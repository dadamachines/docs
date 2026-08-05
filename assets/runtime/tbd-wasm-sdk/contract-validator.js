const MAX_SAFE = Number.MAX_SAFE_INTEGER;
const MAX_PIXELS = 1_048_576;
const MAX_SURFACE_BYTES = 8 * 1024 * 1024;
const ID = /^[a-z][a-z0-9.-]+$/;
const RUNTIME_ID = /^[a-z0-9][a-z0-9.-]+$/;
const SHA256 = /^[0-9a-f]{64}$/;

function fail(message) { throw new TypeError(`invalid TBD runtime contract: ${message}`); }
function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must be an object`);
  return value;
}
function integer(value, name, minimum = 0, maximum = MAX_SAFE) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) fail(`${name} must be a safe integer in [${minimum}, ${maximum}]`);
  return value;
}
function string(value, name, expression = null) {
  if (typeof value !== 'string' || !value) fail(`${name} must be a non-empty string`);
  if (expression && !expression.test(value)) fail(`${name} has an invalid format`);
  return value;
}
function unique(values, label) {
  if (new Set(values).size !== values.length) fail(`${label} must be unique`);
}

export function expectedSurfaceBytes(surface) {
  const { width, height, stride, format } = surface;
  if (format === 'gray8') return stride * height;
  if (format === 'mono1-page-vertical-lsb') return stride * Math.ceil(height / 8);
  fail(`surface ${surface.id || '<unknown>'} has unsupported format ${String(format)}`);
}

/** Enforces constraints JSON Schema cannot express: uniqueness and byte arithmetic. */
export function validateDescriptor(value) {
  const descriptor = object(value, 'descriptor');
  if (descriptor.schemaVersion !== 1 || descriptor.abiVersion !== 1) fail('unsupported descriptor schema or ABI version');
  string(descriptor.runtimeId, 'runtimeId', RUNTIME_ID);
  string(descriptor.productId, 'productId');
  integer(descriptor.maxAdvanceUs, 'maxAdvanceUs', 1, 1_000_000);
  if (!Array.isArray(descriptor.inputs) || !Array.isArray(descriptor.outputs) || !Array.isArray(descriptor.surfaces) || !Array.isArray(descriptor.fixtures)) fail('inputs, outputs, surfaces, and fixtures must be arrays');

  const inputIds = []; const inputEndpoints = [];
  for (const input of descriptor.inputs) {
    object(input, 'input'); string(input.id, 'input.id', ID); integer(input.endpoint, 'input.endpoint');
    if (!Array.isArray(input.actions) || input.actions.length === 0) fail(`input ${input.id} requires actions`);
    for (const action of input.actions) if (!['button-down', 'button-up', 'encoder-delta', 'absolute-value'].includes(action)) fail(`input ${input.id} has unsupported action`);
    unique(input.actions, `input ${input.id} actions`); inputIds.push(input.id); inputEndpoints.push(input.endpoint);
  }
  unique(inputIds, 'input IDs'); unique(inputEndpoints, 'input endpoints');

  const outputIds = []; const outputEndpoints = [];
  for (const output of descriptor.outputs) {
    object(output, 'output'); string(output.id, 'output.id', ID); integer(output.endpoint, 'output.endpoint');
    if (!['rgb24', 'normalized-u16'].includes(output.kind)) fail(`output ${output.id} has unsupported kind`);
    outputIds.push(output.id); outputEndpoints.push(output.endpoint);
  }
  unique(outputIds, 'output IDs'); unique(outputEndpoints, 'output endpoints');

  const surfaceIds = []; const surfaceIndexes = [];
  for (const surface of descriptor.surfaces) {
    object(surface, 'surface'); string(surface.id, 'surface.id', ID); integer(surface.index, 'surface.index');
    integer(surface.width, 'surface.width', 1, MAX_PIXELS); integer(surface.height, 'surface.height', 1, MAX_PIXELS);
    integer(surface.stride, 'surface.stride', 1, MAX_PIXELS); integer(surface.byteLength, 'surface.byteLength', 1, MAX_SURFACE_BYTES);
    if (surface.width * surface.height > MAX_PIXELS) fail(`surface ${surface.id} exceeds pixel limit`);
    if (surface.stride < surface.width) fail(`surface ${surface.id} has stride smaller than width`);
    const expected = expectedSurfaceBytes(surface);
    if (!Number.isSafeInteger(expected) || expected !== surface.byteLength) fail(`surface ${surface.id} byteLength does not match format geometry`);
    surfaceIds.push(surface.id); surfaceIndexes.push(surface.index);
  }
  unique(surfaceIds, 'surface IDs'); unique(surfaceIndexes, 'surface indexes');
  unique(descriptor.fixtures.map((fixture, index) => string(fixture, `fixtures[${index}]`)), 'fixture IDs');
  return descriptor;
}

/**
 * Enforces the fixture-configuration rules JSON Schema cannot express:
 * uniqueness, and agreement between `tracks` and `enabledTracks`.
 *
 * Unknown keys pass through untouched. A host may ask for more than a given
 * artifact implements — an older runtime simply ignores what it does not know,
 * which is what lets one consumer target several artifact versions.
 *
 * Returns the configuration so callers can validate inline at the call site.
 */
export function validateFixtureConfiguration(value) {
  const configuration = object(value ?? {}, 'configuration');

  let enabled = null;
  if (configuration.enabledTracks !== undefined) {
    if (!Array.isArray(configuration.enabledTracks) || configuration.enabledTracks.length === 0) fail('enabledTracks must be a non-empty array');
    configuration.enabledTracks.forEach((track, index) => integer(track, `enabledTracks[${index}]`, 1, 16));
    unique(configuration.enabledTracks, 'enabledTracks');
    enabled = new Set(configuration.enabledTracks);
  }

  if (configuration.tracks !== undefined) {
    if (!Array.isArray(configuration.tracks) || configuration.tracks.length === 0) fail('tracks must be a non-empty array');
    const indexes = [];
    for (const track of configuration.tracks) {
      object(track, 'track');
      integer(track.index, 'track.index', 1, 16);
      if (track.machine !== undefined) string(track.machine, `track ${track.index} machine`, /^[a-z][a-z0-9-]*$/);
      if (track.name !== undefined) {
        string(track.name, `track ${track.index} name`);
        if (track.name.length > 16) fail(`track ${track.index} name exceeds 16 characters`);
      }
      // Configuring a track the instance will not expose is a host bug worth
      // surfacing: the setup silently would not appear anywhere.
      if (enabled && !enabled.has(track.index)) fail(`track ${track.index} is configured but not in enabledTracks`);
      indexes.push(track.index);
    }
    unique(indexes, 'track indexes');
  }

  return configuration;
}

function validateArtifact(artifact, role) {
  object(artifact, `artifacts.${role}`);
  const path = string(artifact.path, `artifacts.${role}.path`);
  if (path.startsWith('/') || path.includes('..') || path.includes('\\') || /^[a-z]+:/i.test(path)) fail(`artifacts.${role}.path is unsafe`);
  string(artifact.sha256, `artifacts.${role}.sha256`, SHA256);
  integer(artifact.bytes, `artifacts.${role}.bytes`, 1);
}

export function validateRuntimePackage(value) {
  const pkg = object(value, 'package');
  if (pkg.schemaVersion !== 1 || pkg.abiVersion !== 1) fail('unsupported package schema or ABI version');
  string(pkg.packageName, 'packageName', RUNTIME_ID); string(pkg.packageVersion, 'packageVersion');
  string(pkg.runtimeId, 'runtimeId', RUNTIME_ID); string(pkg.productId, 'productId');
  if (!['debug', 'release'].includes(pkg.buildVariant)) fail('buildVariant must be debug or release');
  object(pkg.source, 'source'); string(pkg.source.repository, 'source.repository'); string(pkg.source.commit, 'source.commit', /^[0-9a-f]{40}$/);
  if (pkg.source.clean !== true) fail('source.clean must be true');
  object(pkg.toolchain, 'toolchain'); for (const key of ['cxx', 'emscripten', 'cmake', 'buildHelper']) string(pkg.toolchain[key], `toolchain.${key}`);
  object(pkg.artifacts, 'artifacts'); for (const role of ['descriptor', 'mjs', 'wasm', 'licenses']) validateArtifact(pkg.artifacts[role], role);
  unique(Object.values(pkg.artifacts).map(artifact => artifact.path), 'artifact paths');
  return pkg;
}
