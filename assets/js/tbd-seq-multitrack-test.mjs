import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./tbd-seq.js', import.meta.url), 'utf8');
let TbdSeq;
const context = {
  console,
  CustomEvent: class {
    constructor(type, options) { this.type = type; this.detail = options?.detail; }
  },
  document: {
    getElementById: () => ({ dataset: { lang: 'en' } }),
    addEventListener: () => {}
  },
  HTMLElement: class {},
  navigator: {},
  window: {
    customElements: {
      get: () => undefined,
      define: (_name, constructor) => { TbdSeq = constructor; }
    }
  }
};
vm.runInNewContext(source, context, { filename: 'tbd-seq.js' });

const sequencer = Object.create(TbdSeq.prototype);
sequencer.audioTrackIds = ['kick', 'kick2', 'snare'];
sequencer.muted = { kick: false, kick2: false, snare: false };
sequencer.grid = {
  kick: Uint8Array.from([1, 0]),
  kick2: Uint8Array.from([0, 1]),
  snare: Uint8Array.from([1, 0])
};

assert.deepEqual(Array.from(sequencer.getAudibleTrackIds(0)), ['kick', 'snare']);
assert.deepEqual(Array.from(sequencer.getAudibleTrackIds(1)), ['kick2'],
  'a runtime-mapped FM Kick must be scheduled even when it is not a visible curriculum row');
sequencer.muted.kick2 = true;
assert.deepEqual(Array.from(sequencer.getAudibleTrackIds(1)), []);

const hats = Object.create(TbdSeq.prototype);
hats.audioTrackIds = ['kick', 'snare', 'hhc'];
hats.muted = { kick: false, snare: false, hhc: false };
hats.grid = {
  kick: Uint8Array.from([1, 0, 0]),
  snare: Uint8Array.from([0, 0, 0]),
  hhc: Uint8Array.from([1, 0, 1])
};
assert.deepEqual(Array.from(hats.getAudibleTrackIds(2)), ['hhc'],
  'Lesson 3 odd steps must schedule the Track 4 Hat voice independently');

const routed = Object.create(TbdSeq.prototype);
routed.dataset = { panelTracks: '1:kick,2:kick2,3:snare' };
routed.steps = 16;
routed.viewPage = 0;
routed.audioTrackIds = ['kick', 'kick2', 'snare'];
routed.muted = { kick: false, kick2: false, snare: false };
routed.grid = {
  kick: Uint8Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
  kick2: new Uint8Array(16),
  snare: Uint8Array.from([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0])
};
routed.knobValues = {
  kick2: {
    carFreq: 35, carDecay: 10, atkPitch: 12, sweepDecay: 2,
    modFreq: 5, modDecay: 6, modFeedback: 37, index: 1,
    ratio: 0, envSync: 0
  }
};
assert.deepEqual(Array.from(routed.getPanelKnobs(2, 0), knob => knob.key),
  ['carFreq', 'carDecay', 'atkPitch', 'sweepDecay'],
  'FM Kick page 1 must expose its production Carrier parameters');
assert.deepEqual(Array.from(routed.getPanelKnobs(2, 1), knob => knob.key),
  ['modFreq', 'modDecay', 'modFeedback', 'index'],
  'FM Kick page 2 must expose its production Modulator parameters');
assert.deepEqual(Array.from(routed.getPanelKnobs(2, 2), knob => knob.key),
  ['ratio', 'envSync'], 'FM Kick page 3 must expose its production Mode parameters');
assert.equal(routed.setPanelKnob(0, 42, 2, 1).key, 'modFreq',
  'a page-2 encoder snapshot must update the matching browser-audio parameter');
assert.equal(routed.knobValues.kick2.modFreq, 42);
assert.equal(routed.setPanelMasterVolume(64, false), true,
  'a production Master snapshot must be accepted before browser audio is unlocked');
const events = [];
routed.dispatchEvent = event => events.push(event);
routed.emitPatternChange(0, 'snare');
assert.deepEqual(JSON.parse(JSON.stringify(events[0].detail)), {
  page: 0,
  trackId: 'snare',
  productTrack: 3,
  active: [4, 12]
}, 'an editable monitor row must route its complete pattern to the matching product track');
assert.deepEqual(JSON.parse(JSON.stringify(routed.getPanelPatterns(0))), [
  { productTrack: 1, active: [0, 4, 8, 12] },
  { productTrack: 2, active: [] },
  { productTrack: 3, active: [4, 12] }
], 'runtime initialization must receive every authored practice track');

routed.variants = [{
  kick: Uint8Array.from([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]),
  kick2: new Uint8Array(16),
  snare: new Uint8Array(16)
}];
routed.variantIndex = 0;
routed.refreshSteps = () => {};
routed.announce = () => {};
routed.grid.kick.fill(0);
routed.resetPattern();
assert.deepEqual(Array.from(routed.grid.kick).filter(Boolean).length, 4,
  'Reset must restore the lesson-authored pattern');
const resetEvent = events.find(event => event.type === 'tbd-seq:reset-pattern');
assert.ok(resetEvent, 'a runtime-linked reset must be emitted as one multi-track operation');
assert.deepEqual(JSON.parse(JSON.stringify(resetEvent.detail.patterns)), [
  { productTrack: 1, active: [0, 4, 8, 12] },
  { productTrack: 2, active: [] },
  { productTrack: 3, active: [] }
]);

console.log('TBD sequencer machine pages, independent audio, and product-track routing passed');
