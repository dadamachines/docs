import { normalizeLuma } from './framebuffer-normalizer.js';
import { validateDescriptor } from './contract-validator.js';

export const ABI_V0 = 0x00000001;

const InputKind = Object.freeze({
  'button-down': 1,
  'button-up': 2,
  'encoder-delta': 3,
  'absolute-value': 4,
});
const Status = Object.freeze({ ok: 0 });

function decodeU16(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(offset, true);
}
function decodeU32(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}
function utf8(bytes) { return new TextDecoder().decode(bytes); }
function assertStatus(status, operation, errorText) {
  if (status !== Status.ok) throw new Error(`${operation} failed (${status}): ${errorText || 'no runtime error'}`);
}

/** Direct adapter to one Emscripten MODULARIZE instance. Keep it in a Worker
 * in production; this class remains public for deterministic Node parity tests. */
export class DirectWasmRuntime {
  constructor(module) {
    this.module = module;
    this.descriptor = null;
    this.descriptorBytes = null;
    this.inputEndpoints = new Map();
    this.maxAdvanceUs = 1_000_000;
  }

  #bytes(ptr, length) {
    if (!Number.isInteger(ptr) || !Number.isInteger(length) || ptr < 0 || length < 0) throw new TypeError('invalid runtime buffer range');
    const heap = this.module.HEAPU8;
    if (!heap || ptr > heap.byteLength || length > heap.byteLength - ptr) throw new RangeError('runtime returned an out-of-bounds buffer');
    return heap.slice(ptr, ptr + length);
  }
  #call(name, ...args) {
    const fn = this.module[`_${name}`];
    if (typeof fn !== 'function') throw new Error(`runtime does not export ${name}`);
    return fn(...args);
  }
  #errorText() {
    const length = this.#call('tbd_runtime_last_error_size');
    return length ? utf8(this.#bytes(this.#call('tbd_runtime_last_error_data'), length)) : '';
  }

  async initialize({ configuration = {}, seed = 0 } = {}) {
    if (this.#call('tbd_runtime_abi_version') !== ABI_V0) throw new Error('unsupported runtime ABI');
    this.descriptorBytes = this.#bytes(
      this.#call('tbd_runtime_descriptor_data'), this.#call('tbd_runtime_descriptor_size'),
    );
    const descriptor = JSON.parse(utf8(this.descriptorBytes));
    this.descriptor = validateDescriptor(descriptor);
    this.inputEndpoints = new Map(this.descriptor.inputs.map(input => [input.id, input.endpoint]));
    this.maxAdvanceUs = this.descriptor.maxAdvanceUs;
    const configBytes = new TextEncoder().encode(JSON.stringify(configuration));
    const ptr = configBytes.length ? this.module._malloc(configBytes.length) : 0;
    try {
      if (configBytes.length) this.module.HEAPU8.set(configBytes, ptr);
      assertStatus(this.#call('tbd_runtime_init', ptr, configBytes.length, seed >>> 0, Math.floor(seed / 0x100000000) >>> 0), 'initialize', this.#errorText());
    } finally { if (ptr) this.module._free(ptr); }
    return this.snapshot();
  }

  dispatch({ kind, endpoint, value = 0 }, { snapshot = true } = {}) {
    const action = InputKind[kind];
    const endpointCode = typeof endpoint === 'number' ? endpoint : this.inputEndpoints.get(endpoint);
    if (!action) throw new TypeError(`unknown input kind ${String(kind)}`);
    if (!Number.isInteger(endpointCode)) throw new TypeError(`unknown input endpoint ${String(endpoint)}`);
    const declaration = this.descriptor.inputs.find(input => input.endpoint === endpointCode);
    if (!declaration || !declaration.actions.includes(kind)) throw new TypeError(`unsupported input ${String(kind)} for endpoint ${String(endpoint)}`);
    assertStatus(this.#call('tbd_runtime_input', endpointCode, action, value | 0), 'input', this.#errorText());
    return snapshot ? this.snapshot() : undefined;
  }

  advance(deltaUs, { snapshot = true } = {}) {
    if (!Number.isInteger(deltaUs) || deltaUs < 0) throw new TypeError('deltaUs must be a non-negative integer');
    while (deltaUs > 0) {
      const slice = Math.min(deltaUs, this.maxAdvanceUs);
      assertStatus(this.#call('tbd_runtime_advance', slice), 'advance', this.#errorText());
      deltaUs -= slice;
    }
    return snapshot ? this.snapshot() : undefined;
  }

  snapshot() {
    const surfaces = [];
    const descriptors = new Map((this.descriptor.surfaces || []).map(surface => [surface.index, surface]));
    const count = this.#call('tbd_runtime_surface_count');
    for (let index = 0; index < count; index += 1) {
      const description = descriptors.get(index);
      if (!description) throw new Error(`runtime returned undescribed surface ${index}`);
      const surface = { ...description, generation: this.#call('tbd_runtime_surface_generation', index) };
      const raw = this.#bytes(this.#call('tbd_runtime_surface_data', index), this.#call('tbd_runtime_surface_size', index));
      surfaces.push({ ...surface, raw, luma: normalizeLuma(surface, raw) });
    }
    const outputBytes = this.#bytes(this.#call('tbd_runtime_outputs_data'), this.#call('tbd_runtime_outputs_size'));
    const outputs = parseOutputs(outputBytes, this.descriptor.outputs);
    const events = this.drainEvents();
    const observableLength = this.#call('tbd_runtime_observables_size');
    const observables = observableLength ? JSON.parse(utf8(this.#bytes(this.#call('tbd_runtime_observables_data'), observableLength))) : {};
    return { generation: this.#call('tbd_runtime_generation'), surfaces, outputs, events, observables };
  }

  drainEvents() {
    const generation = this.#call('tbd_runtime_events_generation');
    const bytes = this.#bytes(this.#call('tbd_runtime_events_data'), this.#call('tbd_runtime_events_size'));
    const events = parseEvents(bytes, this.descriptor, generation);
    if (events.length) assertStatus(this.#call('tbd_runtime_events_consume', generation), 'consume events', this.#errorText());
    return { generation, records: events };
  }
}

export function parseOutputs(bytes, declaredOutputs) {
  if (bytes.byteLength < 16 || decodeU32(bytes, 0) !== 0x4f444254 || decodeU16(bytes, 4) !== 1 || decodeU16(bytes, 6) !== 16) throw new Error('invalid TBDO output snapshot');
  const count = decodeU32(bytes, 12);
  if (bytes.byteLength !== 16 + count * 16) throw new Error('invalid TBDO output byte length');
  if (count !== declaredOutputs.length) throw new Error('TBDO output count does not match descriptor');
  const records = Array.from({ length: count }, (_, index) => {
    const offset = 16 + index * 16;
    return { endpoint: decodeU32(bytes, offset), kind: decodeU32(bytes, offset + 4), value: decodeU32(bytes, offset + 8), alpha: decodeU32(bytes, offset + 12), generation: decodeU32(bytes, 8) };
  });
  for (const record of records) {
    const declared = declaredOutputs.find(output => output.endpoint === record.endpoint);
    const kind = record.kind === 1 ? 'rgb24' : record.kind === 2 ? 'normalized-u16' : null;
    if (!declared || declared.kind !== kind) throw new Error('TBDO output is undeclared or has the wrong kind');
  }
  return records;
}

export function parseEvents(bytes, descriptor, expectedGeneration) {
  if (bytes.byteLength < 20 || decodeU32(bytes, 0) !== 0x45444254 || decodeU16(bytes, 4) !== 1 || decodeU16(bytes, 6) !== 20) throw new Error('invalid TBDE event snapshot');
  if (decodeU32(bytes, 8) !== expectedGeneration) throw new Error('TBDE generation changed while reading');
  const count = decodeU32(bytes, 12); const recordBytes = decodeU32(bytes, 16);
  if (recordBytes !== 24 || bytes.byteLength !== 20 + count * recordBytes) throw new Error('invalid TBDE event byte length');
  const knownEndpoints = new Set([...descriptor.inputs, ...descriptor.outputs].map(item => item.endpoint));
  let priorSequence = 0;
  return Array.from({ length: count }, (_, index) => {
    const offset = 20 + index * recordBytes;
    const type = decodeU32(bytes, offset); const endpoint = decodeU32(bytes, offset + 4);
    const timestamp = decodeU32(bytes, offset + 8) + decodeU32(bytes, offset + 12) * 0x1_0000_0000;
    const value = new DataView(bytes.buffer, bytes.byteOffset + offset + 16, 4).getInt32(0, true);
    const sequence = decodeU32(bytes, offset + 20);
    if (type !== 1 || !knownEndpoints.has(endpoint) || !Number.isSafeInteger(timestamp) || sequence <= priorSequence) throw new Error('invalid TBDE event record');
    priorSequence = sequence;
    return { type: 'step-crossed', endpoint, timestampUs: timestamp, value, sequence };
  });
}

/** Main-thread client for one headless Worker runtime. */
export class WorkerRuntimeClient extends EventTarget {
  constructor(workerUrl, { WorkerConstructor = globalThis.Worker } = {}) {
    super();
    if (typeof WorkerConstructor !== 'function') throw new Error('Worker is unavailable');
    this.worker = new WorkerConstructor(workerUrl, { type: 'module' });
    this.nextId = 1; this.pending = new Map(); this.ready = null; this.disposed = false; this.latestSnapshot = null;
    this.worker.addEventListener('message', event => this.#message(event.data));
    this.worker.addEventListener('error', event => this.#workerFailure(event.error || new Error(event.message)));
    this.worker.addEventListener('messageerror', () => this.#workerFailure(new Error('runtime Worker message could not be decoded')));
  }
  #message(message) {
    if (this.disposed) return;
    if (message.type === 'frame') {
      this.latestSnapshot = message.snapshot;
      this.dispatchEvent(new CustomEvent('frame', { detail: message.snapshot }));
    }
    if (!message.id) return;
    const pending = this.pending.get(message.id); if (!pending) return;
    this.pending.delete(message.id); message.error ? pending.reject(new Error(message.error)) : pending.resolve(message.result);
  }
  #failAll(error) { for (const { reject } of this.pending.values()) reject(error); this.pending.clear(); }
  #workerFailure(error) {
    if (this.disposed) return;
    this.disposed = true; this.ready = null;
    this.#failAll(error);
    this.worker.terminate();
  }
  #request(type, payload = {}) {
    if (this.disposed) return Promise.reject(new Error('runtime disposed'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      try { this.worker.postMessage({ id, type, ...payload }); }
      catch (error) { this.pending.delete(id); reject(error); }
    });
  }
  initialize(options) {
    if (this.disposed) return Promise.reject(new Error('runtime disposed'));
    if (this.ready) return this.ready;
    this.ready = this.#request('initialize', options).catch(error => { this.ready = null; throw error; });
    return this.ready;
  }
  async #requestSnapshot(type, payload) {
    const acknowledgement = await this.#request(type, payload);
    const snapshot = this.latestSnapshot;
    if (!snapshot || snapshot.generation !== acknowledgement?.generation) {
      throw new Error(`${type} acknowledgement has no matching runtime frame`);
    }
    return snapshot;
  }
  async dispatch(input) { if (this.disposed) throw new Error('runtime disposed'); if (!this.ready) throw new Error('runtime initialization has not completed'); await this.ready; return this.#requestSnapshot('dispatch', { input }); }
  async advance(deltaUs) { if (this.disposed) throw new Error('runtime disposed'); if (!this.ready) throw new Error('runtime initialization has not completed'); await this.ready; return this.#requestSnapshot('advance', { deltaUs }); }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.ready = null;
    this.#failAll(new Error('runtime disposed'));
    this.worker.terminate();
  }
}

export { InputKind };
