import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { DirectWasmRuntime } from '../tbd-wasm-sdk/runtime-controller.js';
import createGrooveBoxModule from './groovebox-runtime.mjs';

const wasmBinary = await readFile(new URL('./groovebox-runtime.wasm', import.meta.url));
const module = await createGrooveBoxModule({ wasmBinary });
const runtime = new DirectWasmRuntime(module);

function playhead(snapshot) {
  return snapshot.outputs.find(output => (output.alpha & 2) !== 0)?.endpoint ?? -1;
}

function isLit(snapshot, stepIndex) {
  return (snapshot.outputs.find(output => output.endpoint === stepIndex)?.alpha & 1) !== 0;
}

async function tap(endpoint) {
  await runtime.dispatch({ kind: 'button-down', endpoint });
  return runtime.dispatch({ kind: 'button-up', endpoint });
}

let snapshot = await runtime.initialize({ configuration: { fixtureId: 'sound-boot' }, seed: 1 });
assert.equal(snapshot.observables['transport.running'], false);
assert.ok(snapshot.surfaces[0].luma.some(pixel => pixel === 255),
  'OLED gray8 surface must contain visible white pixels, not firmware-internal 0/1 values');
assert.equal(playhead(snapshot), -1, 'stopped runtime must not publish a physical playhead LED');
assert.deepEqual(
  Array.from({ length: 16 }, (_, index) => index).filter(index => isLit(snapshot, index)),
  [0, 4, 8, 12],
  'Lesson runtime must boot with the audible four-on-the-floor pattern on steps 1, 5, 9, and 13'
);

const trackOnePageOneSurface = snapshot.surfaces[0].luma;
snapshot = await tap('navigation.down');
assert.equal(snapshot.observables['parameter.page'], 2, 'DOWN must open Synth Kick FM Env page');
assert.equal(snapshot.observables['parameter.encoder.1'], 20, 'FM Env must use its production raw default');
assert.notDeepEqual(snapshot.surfaces[0].luma, trackOnePageOneSurface, 'a parameter page change must redraw the OLED');
const fmEnvNormalized = snapshot.observables['parameter.encoder.1.normalized'];
snapshot = await runtime.dispatch({ kind: 'encoder-delta', endpoint: 'encoder.1', value: 1 });
assert.equal(snapshot.observables['parameter.encoder.1'], 149,
  'one browser detent must move a usable fraction of the production 14-bit range');
assert.ok(snapshot.observables['parameter.encoder.1.normalized'] > fmEnvNormalized);
snapshot = await tap('navigation.up');
assert.equal(snapshot.observables['parameter.page'], 1, 'UP must return to the first production page');

const trackOneSurface = snapshot.surfaces[0].luma;
snapshot = await tap('navigation.right');
assert.equal(snapshot.observables['track.active'], 2, 'RIGHT must select production Track 2');
assert.notDeepEqual(snapshot.surfaces[0].luma, trackOneSurface, 'Track 2 must render its production Sound view');
snapshot = await tap('navigation.down');
assert.equal(snapshot.observables['parameter.page'], 2, 'FM Kick must expose its Modulator page');
snapshot = await tap('navigation.down');
assert.equal(snapshot.observables['parameter.page'], 3, 'FM Kick must expose its Mode page');
snapshot = await tap('navigation.up');
snapshot = await tap('navigation.up');
snapshot = await tap('navigation.left');
assert.equal(snapshot.observables['track.active'], 1, 'LEFT must return from Track 2 to Track 1');
assert.deepEqual(
  Array.from({ length: 16 }, (_, index) => index).filter(index => isLit(snapshot, index)),
  [0, 4, 8, 12],
  'Track navigation must preserve Track 1 pattern state'
);

for (let track = 2; track <= 6; track += 1) snapshot = await tap('navigation.right');
assert.equal(snapshot.observables['track.active'], 6, 'RIGHT must reach the authored Track 6 Clap fixture');
assert.equal(snapshot.observables['screen.id'], 'sound.parameters');
snapshot = await tap('step.13');
assert.equal(isLit(snapshot, 12), true, 'Track 6 Clap must accept its own pattern notes');
for (let track = 5; track >= 1; track -= 1) snapshot = await tap('navigation.left');
assert.equal(snapshot.observables['track.active'], 1);
assert.deepEqual(
  Array.from({ length: 16 }, (_, index) => index).filter(index => isLit(snapshot, index)),
  [0, 4, 8, 12],
  'editing Track 6 must not alter Track 1'
);

const originalStep2 = isLit(snapshot, 1);
snapshot = await tap('step.2');
assert.equal(isLit(snapshot, 1), !originalStep2, 'step input must immediately update the matching physical LED');
const editedPattern = Array.from({ length: 16 }, (_, index) => index).filter(index => isLit(snapshot, index));

const originalEncoder = snapshot.observables['parameter.encoder.1'];
const originalNormalized = snapshot.observables['parameter.encoder.1.normalized'];
snapshot = await runtime.dispatch({ kind: 'encoder-delta', endpoint: 'encoder.1', value: 5 });
assert.ok(snapshot.observables['parameter.encoder.1'] >= originalEncoder + 10,
  'Synth Kick frequency must scale virtual detents to its production resolution');
assert.ok(snapshot.observables['parameter.encoder.1.normalized'] > originalNormalized);

snapshot = await tap('transport.play');
assert.equal(snapshot.observables['transport.running'], true);
assert.equal(playhead(snapshot), -1, 'PLAY starts transport; the first playhead appears on the first sequencer tick');

const playheads = [];
const surfaceGenerations = [];
for (let index = 0; index < 16; index += 1) {
  snapshot = await runtime.advance(125_000);
  playheads.push(playhead(snapshot));
  surfaceGenerations.push(snapshot.surfaces[0].generation);
  assert.equal(snapshot.observables['sequencer.playhead'], index + 1);
  assert.deepEqual(
    Array.from({ length: 16 }, (_, step) => step).filter(step => isLit(snapshot, step)),
    editedPattern,
    `running firmware must preserve the lesson pattern at playhead ${index + 1}`
  );
}

assert.deepEqual(playheads, Array.from({ length: 16 }, (_, index) => index));
assert.ok(new Set(surfaceGenerations).size > 1, 'OLED framebuffer must advance with the sequencer');

snapshot = await tap('transport.play');
assert.equal(snapshot.observables['transport.running'], false);
assert.equal(playhead(snapshot), -1, 'stopping must clear the physical playhead LED');

let previousSurfaceGeneration = snapshot.surfaces[0].generation;
snapshot = await tap('function.2');
assert.equal(snapshot.observables['screen.id'], 'global.sound', 'FUNC2 must open the production OUTPUT screen');
assert.notEqual(snapshot.surfaces[0].generation, previousSurfaceGeneration);
assert.equal(snapshot.observables['master.volume'], 91, 'OUTPUT must publish the production Master default');
snapshot = await runtime.dispatch({ kind: 'encoder-delta', endpoint: 'encoder.4', value: -8 });
assert.equal(snapshot.observables['master.volume'], 83, 'Knob 4 on OUTPUT must change Master Volume');

previousSurfaceGeneration = snapshot.surfaces[0].generation;
snapshot = await tap('navigation.left');
assert.equal(snapshot.observables['screen.id'], 'tempo', 'LEFT from OUTPUT must open the production TEMPO screen');
assert.notEqual(snapshot.surfaces[0].generation, previousSurfaceGeneration);

snapshot = await runtime.dispatch({ kind: 'encoder-delta', endpoint: 'encoder.1', value: 1 });
assert.equal(snapshot.observables['tempo.bpm'], 121, 'Knob 1 on TEMPO must update the firmware BPM');

snapshot = await tap('function.2');
assert.equal(snapshot.observables['screen.id'], 'sound.parameters', 'FUNC2 must return from TEMPO to Sound');

const scopedModule = await createGrooveBoxModule({ wasmBinary });
const scopedRuntime = new DirectWasmRuntime(scopedModule);
let scopedSnapshot = await scopedRuntime.initialize({
  configuration: { fixtureId: 'sound-boot', enabledTracks: [1] },
  seed: 2
});
scopedSnapshot = await scopedRuntime.dispatch({ kind: 'button-down', endpoint: 'navigation.right' });
scopedSnapshot = await scopedRuntime.dispatch({ kind: 'button-up', endpoint: 'navigation.right' });
assert.equal(scopedSnapshot.observables['track.active'], 2);
assert.equal(scopedSnapshot.observables['screen.id'], 'example.track-disabled',
  'exercise configuration must render an explicit disabled OLED for excluded tracks');
const disabledPattern = Array.from({ length: 16 }, (_, index) => isLit(scopedSnapshot, index));
scopedSnapshot = await scopedRuntime.dispatch({ kind: 'button-down', endpoint: 'step.1' });
scopedSnapshot = await scopedRuntime.dispatch({ kind: 'button-up', endpoint: 'step.1' });
assert.deepEqual(Array.from({ length: 16 }, (_, index) => isLit(scopedSnapshot, index)), disabledPattern,
  'disabled exercise tracks must reject pattern edits');

const eraseModule = await createGrooveBoxModule({ wasmBinary });
const eraseRuntime = new DirectWasmRuntime(eraseModule);
let eraseSnapshot = await eraseRuntime.initialize({
  configuration: { fixtureId: 'sound-boot' },
  seed: 3
});
await eraseRuntime.dispatch({ kind: 'button-down', endpoint: 'transport.play' });
await eraseRuntime.dispatch({ kind: 'button-up', endpoint: 'transport.play' });
await eraseRuntime.dispatch({ kind: 'button-down', endpoint: 'function.5' });
for (let step = 0; step <= 4; step += 1) eraseSnapshot = await eraseRuntime.advance(125_000);
assert.equal(isLit(eraseSnapshot, 0), false,
  'FUNC5 hold must erase step 1 when the production playhead passes it');
assert.equal(isLit(eraseSnapshot, 4), false,
  'FUNC5 hold must erase step 5 when the production playhead passes it');
assert.equal(isLit(eraseSnapshot, 8), true,
  'FUNC5 hold must not erase a future step before the playhead reaches it');
await eraseRuntime.dispatch({ kind: 'button-up', endpoint: 'function.5' });
for (let step = 5; step <= 8; step += 1) eraseSnapshot = await eraseRuntime.advance(125_000);
assert.equal(isLit(eraseSnapshot, 8), true,
  'releasing FUNC5 must stop playhead erase immediately');

console.log('Docs GrooveBox artifact: OLED, inputs, parameters, transport/playhead, Tempo, Master Volume, FUNC5 erase, independent patterns, and exercise-disabled tracks passed');
