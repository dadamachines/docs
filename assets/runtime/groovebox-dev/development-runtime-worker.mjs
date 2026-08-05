// Temporary development worker. Release builds use tbd-wasm/runtime-worker.js
// with a verified package; this loader exists only while the product worktree
// is intentionally uncommitted and therefore ineligible for release packaging.
import { DirectWasmRuntime } from '../tbd-wasm-sdk/runtime-controller.js';

let runtime = null;

function transferableSnapshot(snapshot) {
  const transfers = [];
  const surfaces = snapshot.surfaces.map(surface => {
    const raw = new Uint8Array(surface.raw);
    const luma = new Uint8Array(surface.luma);
    transfers.push(raw.buffer, luma.buffer);
    return { ...surface, raw, luma };
  });
  return [{ ...snapshot, surfaces }, transfers];
}

function postFrame(snapshot) {
  const [frame, transfers] = transferableSnapshot(snapshot);
  postMessage({ type: 'frame', snapshot: frame }, transfers);
}

async function handle(message) {
  if (message.type === 'initialize') {
    if (runtime) throw new Error('runtime is already initialized');
    const imported = await import(message.moduleUrl);
    if (typeof imported.default !== 'function') throw new Error('GrooveBox module has no factory export');
    // Emscripten resolves the sibling .wasm without inheriting the module
    // query string. Give both halves of the generated artifact the same
    // cache key; otherwise a refreshed .mjs can be paired with an older
    // cached .wasm and the first live canvas frame replaces the useful OLED
    // fallback with black pixels.
    const moduleVersion = new URL(message.moduleUrl).search;
    const module = await imported.default({
      locateFile: file => {
        const located = new URL(file, message.moduleUrl);
        located.search = moduleVersion;
        return located.href;
      }
    });
    runtime = new DirectWasmRuntime(module);
    const snapshot = await runtime.initialize({ configuration: message.configuration, seed: message.seed });
    postFrame(snapshot);
    return { descriptor: runtime.descriptor, development: true };
  }
  if (!runtime) throw new Error('runtime is not initialized');
  const snapshot = message.type === 'dispatch'
    ? await runtime.dispatch(message.input)
    : message.type === 'advance'
      ? await runtime.advance(message.deltaUs)
      : null;
  if (!snapshot) throw new Error(`unknown worker request ${message.type}`);
  postFrame(snapshot);
  return { generation: snapshot.generation };
}

self.addEventListener('message', async event => {
  try {
    const result = await handle(event.data);
    postMessage({ id: event.data.id, result });
  } catch (error) {
    postMessage({ id: event.data.id, error: error instanceof Error ? error.message : String(error) });
  }
});
