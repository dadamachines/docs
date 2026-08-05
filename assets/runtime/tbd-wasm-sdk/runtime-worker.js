import { loadVerifiedRuntimePackage } from './package-loader.js';

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
  const [transferable, transfers] = transferableSnapshot(snapshot);
  postMessage({ type: 'frame', snapshot: transferable }, transfers);
}

async function handle(message) {
  if (message.type === 'initialize') {
    if (runtime) throw new Error('runtime is already initialized');
    const loaded = await loadVerifiedRuntimePackage(message.packageUrl, { configuration: message.configuration, seed: message.seed });
    runtime = loaded.runtime;
    const snapshot = loaded.snapshot;
    postFrame(snapshot);
    return { package: loaded.package, descriptor: loaded.descriptor };
  }
  if (!runtime) throw new Error('runtime is not initialized');
  if (message.type === 'dispatch') {
    const snapshot = runtime.dispatch(message.input);
    postFrame(snapshot);
    return { generation: snapshot.generation };
  }
  if (message.type === 'advance') {
    const snapshot = runtime.advance(message.deltaUs);
    postFrame(snapshot);
    return { generation: snapshot.generation };
  }
  throw new Error(`unknown worker request ${message.type}`);
}

self.addEventListener('message', async event => {
  const message = event.data;
  try {
    const result = await handle(message);
    postMessage({ id: message.id, result });
  } catch (error) {
    postMessage({ id: message.id, error: error instanceof Error ? error.message : String(error) });
  }
});
