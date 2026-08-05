import { validateDescriptor, validateRuntimePackage } from './contract-validator.js';
import { DirectWasmRuntime } from './runtime-controller.js';

function equalBytes(left, right) {
  return left.byteLength === right.byteLength && left.every((value, index) => value === right[index]);
}
async function digest(bytes) {
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(hash)].map(value => value.toString(16).padStart(2, '0')).join('');
}
async function readArtifact(baseUrl, artifact, fetchImpl) {
  const response = await fetchImpl(new URL(artifact.path, baseUrl));
  if (!response.ok) throw new Error(`unable to read runtime artifact ${artifact.path}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength !== artifact.bytes) throw new Error(`runtime artifact ${artifact.path} has the wrong byte length`);
  if (await digest(bytes) !== artifact.sha256) throw new Error(`runtime artifact ${artifact.path} has the wrong SHA-256`);
  return bytes;
}

async function defaultImport(bytes) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'text/javascript' }));
  try { return await import(url); } finally { URL.revokeObjectURL(url); }
}

/**
 * Trusted-local package loader. It validates and hashes every declared byte
 * before importing the generated module. `importModule` is injectable only for
 * Node/headless tests that cannot import a browser Blob URL.
 */
export async function loadVerifiedRuntimePackage(packageUrl, { fetchImpl = fetch, importModule = defaultImport, configuration = {}, seed = 0 } = {}) {
  const packageResponse = await fetchImpl(packageUrl);
  if (!packageResponse.ok) throw new Error('unable to read runtime-package.json');
  const pkg = validateRuntimePackage(await packageResponse.json());
  const baseUrl = new URL('.', packageUrl);
  const artifacts = {};
  for (const role of ['descriptor', 'mjs', 'wasm', 'licenses']) artifacts[role] = await readArtifact(baseUrl, pkg.artifacts[role], fetchImpl);
  const externalDescriptor = validateDescriptor(JSON.parse(new TextDecoder().decode(artifacts.descriptor)));
  if (externalDescriptor.runtimeId !== pkg.runtimeId || externalDescriptor.productId !== pkg.productId) throw new Error('package and descriptor identity differ');
  const imported = await importModule(artifacts.mjs);
  if (typeof imported.default !== 'function') throw new Error('verified module has no Emscripten factory export');
  const wasmUrl = URL.createObjectURL(new Blob([artifacts.wasm], { type: 'application/wasm' }));
  try {
    const module = await imported.default({ locateFile: () => wasmUrl });
    const runtime = new DirectWasmRuntime(module);
    const snapshot = await runtime.initialize({ configuration, seed });
    if (!equalBytes(runtime.descriptorBytes, artifacts.descriptor)) throw new Error('embedded runtime descriptor does not equal verified descriptor artifact');
    return { package: pkg, descriptor: runtime.descriptor, runtime, snapshot };
  } finally { URL.revokeObjectURL(wasmUrl); }
}
