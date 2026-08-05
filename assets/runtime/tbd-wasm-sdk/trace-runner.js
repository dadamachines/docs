/**
 * Deterministic ordering rule: for each timestamp, advance once, apply inputs
 * in trace array order, then capture its one checkpoint. Observables use a
 * subset expectation; surfaces, outputs, and events are exact.
 */
const encoder = new TextEncoder();

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
}

function requireTimestamp(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(`${label} must be a non-negative safe integer`);
}
function subset(actual, expected, path = 'observables') {
  for (const [key, value] of Object.entries(expected)) {
    if (!Object.hasOwn(actual, key)) throw new Error(`${path}.${key} is missing`);
    if (value && typeof value === 'object' && !Array.isArray(value)) subset(actual[key], value, `${path}.${key}`);
    else if (actual[key] !== value) throw new Error(`${path}.${key} differs: expected ${JSON.stringify(value)}, got ${JSON.stringify(actual[key])}`);
  }
}

function validateTrace(trace, descriptor) {
  if (!trace || trace.schemaVersion !== 1 || trace.runtimeId !== descriptor.runtimeId) throw new TypeError('trace has an unsupported schema or runtime');
  if (!Array.isArray(trace.events) || !Array.isArray(trace.checkpoints)) throw new TypeError('trace events and checkpoints must be arrays');
  let prior = -1;
  for (const [index, event] of trace.events.entries()) {
    requireTimestamp(event.atUs, `events[${index}].atUs`);
    if (event.atUs < prior) throw new Error('trace events must be ordered by atUs');
    prior = event.atUs;
    if (typeof event.endpoint !== 'string' || !event.endpoint) throw new TypeError(`events[${index}].endpoint is required`);
    if (!['button-down', 'button-up', 'encoder-delta', 'absolute-value'].includes(event.kind)) throw new TypeError(`events[${index}].kind is unsupported`);
    if (!descriptor.inputs.some(input => input.id === event.endpoint && input.actions.includes(event.kind))) throw new Error(`events[${index}] references an undeclared input`);
  }
  prior = -1; const times = new Set();
  for (const [index, checkpoint] of trace.checkpoints.entries()) {
    requireTimestamp(checkpoint.atUs, `checkpoints[${index}].atUs`);
    if (checkpoint.atUs < prior || times.has(checkpoint.atUs)) throw new Error('checkpoints must be ordered and unique by atUs');
    prior = checkpoint.atUs; times.add(checkpoint.atUs);
  }
}

async function compareCheckpoint(snapshot, expected, descriptor) {
  const surfaces = new Map(snapshot.surfaces.map(surface => [surface.id, surface]));
  for (const [id, hash] of Object.entries(expected.surfaces || {})) {
    const surface = surfaces.get(id);
    if (!surface) throw new Error(`checkpoint ${expected.atUs}: missing surface ${id}`);
    const actual = await sha256(surface.raw);
    if (actual !== hash) throw new Error(`checkpoint ${expected.atUs}: surface ${id} hash differs`);
  }
  if ((expected.surfaces && Object.keys(expected.surfaces).length !== surfaces.size)) throw new Error(`checkpoint ${expected.atUs}: unexpected surface`);

  const outputIds = new Map(descriptor.outputs.map(output => [output.endpoint, output.id]));
  const actualOutputs = Object.fromEntries(snapshot.outputs.map(output => [outputIds.get(output.endpoint), { value: output.value, alpha: output.alpha }]));
  if (JSON.stringify(actualOutputs) !== JSON.stringify(expected.outputs || {})) throw new Error(`checkpoint ${expected.atUs}: outputs differ`);
  subset(snapshot.observables, expected.observables || {});
  if (JSON.stringify(snapshot.events) !== JSON.stringify(expected.events || { generation: snapshot.events.generation, records: [] })) throw new Error(`checkpoint ${expected.atUs}: events differ`);
  if (expected.generation !== undefined && snapshot.generation !== expected.generation) throw new Error(`checkpoint ${expected.atUs}: runtime generation differs`);
  if (expected.surfaceGenerations) for (const surface of snapshot.surfaces) if (surface.generation !== expected.surfaceGenerations[surface.id]) throw new Error(`checkpoint ${expected.atUs}: surface generation differs for ${surface.id}`);
}

async function captureCheckpoint(snapshot, atUs, descriptor) {
  const outputIds = new Map(descriptor.outputs.map(output => [output.endpoint, output.id]));
  return {
    atUs,
    surfaces: Object.fromEntries(await Promise.all(snapshot.surfaces.map(async surface => [surface.id, await sha256(surface.raw)]))),
    outputs: Object.fromEntries(snapshot.outputs.map(output => [outputIds.get(output.endpoint), { value: output.value, alpha: output.alpha }])),
    events: snapshot.events,
    observables: snapshot.observables,
    generation: snapshot.generation,
    surfaceGenerations: Object.fromEntries(snapshot.surfaces.map(surface => [surface.id, surface.generation])),
  };
}

async function replay(runtime, trace, checkpointVisitor) {
  if (!runtime.descriptor) throw new Error('runtime must be initialized before trace replay');
  validateTrace(trace, runtime.descriptor);
  const byTime = new Map();
  for (const event of trace.events) {
    let events = byTime.get(event.atUs);
    if (!events) { events = []; byTime.set(event.atUs, events); }
    events.push(event);
  }
  const checkpoints = new Map(trace.checkpoints.map(checkpoint => [checkpoint.atUs, checkpoint]));
  const times = [...new Set([...byTime.keys(), ...checkpoints.keys()])].sort((a, b) => a - b);
  let currentUs = 0; const results = [];
  for (const atUs of times) {
    await runtime.advance(atUs - currentUs, { snapshot: false }); currentUs = atUs;
    for (const event of byTime.get(atUs) || []) await runtime.dispatch({ kind: event.kind, endpoint: event.endpoint, value: event.value ?? 0 }, { snapshot: false });
    const checkpoint = checkpoints.get(atUs);
    if (checkpoint) results.push(await checkpointVisitor(await runtime.snapshot(), checkpoint, atUs));
  }
  return results;
}

/** Replay and compare. Throws at the first mismatched checkpoint. */
export async function runTrace(runtime, trace) {
  const report = await replay(runtime, trace, async (snapshot, checkpoint, atUs) => {
    await compareCheckpoint(snapshot, checkpoint, runtime.descriptor);
    return { atUs, generation: snapshot.generation };
  });
  return { checkpoints: report, bytesHashed: encoder.encode(JSON.stringify(report)).byteLength };
}

/** Replay a trace template and return complete canonical checkpoints. This is
 * used to compare two implementations; publishing the result as a golden
 * still requires independent provenance review. */
export async function captureTrace(runtime, trace) {
  const checkpoints = await replay(runtime, trace, (snapshot, _checkpoint, atUs) =>
    captureCheckpoint(snapshot, atUs, runtime.descriptor));
  return { ...trace, checkpoints };
}
