// Development consumer for the product-owned GrooveBox runtime. Simulation,
// rendering, and input cross the shared tbd-wasm host boundaries; this file
// contains only docs-panel bindings and temporary audio-follow coordination.
import { CanvasSurfaceAdapter } from '../tbd-wasm-sdk/canvas-adapter.js';
import { RuntimeLifecycle } from '../tbd-wasm-sdk/runtime-lifecycle.js';
import { SemanticInputAdapter } from '../tbd-wasm-sdk/semantic-input-adapter.js';

const workerUrl = new URL('./development-runtime-worker.mjs?v=r14-port-compat-1', import.meta.url);
const moduleUrl = new URL('./groovebox-runtime.mjs?v=r14-port-compat-1', import.meta.url);

function rgbCss(rgb) { return `#${(rgb >>> 0).toString(16).padStart(6, '0').slice(-6)}`; }

export async function mount(panel) {
  panel.dataset.runtimeStatus = 'loading';
  const fallback = panel.oledView.querySelector('img');
  const canvas = document.createElement('canvas');
  canvas.className = 'tbd-panel__oled-canvas';
  canvas.width = 128;
  canvas.height = 64;
  canvas.setAttribute('aria-label', 'Live GrooveBox screen');
  panel.oledView.appendChild(canvas);
  const painter = new CanvasSurfaceAdapter(canvas, { fallback });

  let destroyed = false;
  let animationFrame = null;
  let latestRunning = false;
  let desiredRunning = null;
  let input = null;
  let client = null;
  let transportQueue = Promise.resolve();
  let patternQueue = Promise.resolve();
  let latestPattern = [];
  let latestTrack = 1;
  let lastAudioTempo = null;
  let lastAudioMasterVolume = null;
  let lastAudioMasterMuted = null;

  function fail(error) {
    if (destroyed) return;
    panel.dataset.runtimeStatus = 'error';
    panel.frame.classList.add('has-runtime-error');
    panel.frame.setAttribute('aria-label', 'tbd 16 front panel; GrooveBox runtime stopped.');
    if (window.console && console.error) console.error('TBD panel runtime:', error);
  }

  function render(snapshot) {
    painter.paint(snapshot);
    const screenId = String(snapshot.observables['screen.id'] || '');
    const tempo = Number(snapshot.observables['tempo.bpm']);
    const activeTrack = Number(snapshot.observables['track.active']);
    const parameterPage = Math.max(0, Number(snapshot.observables['parameter.page'] || 1) - 1);
    const masterVolume = Number(snapshot.observables['master.volume']);
    const masterMuted = snapshot.observables['master.muted'] === true;
    panel.dataset.runtimeScreen = screenId;
    if (Number.isFinite(tempo)) panel.dataset.runtimeTempo = String(tempo);
    if (Number.isFinite(activeTrack)) {
      latestTrack = activeTrack;
      panel.dataset.runtimeTrack = String(activeTrack);
    }
    const outputs = new Map(snapshot.outputs.map(output => [output.endpoint, output]));
    const playheadOutput = snapshot.outputs.find(output => (output.alpha & 2) !== 0);
    panel.dataset.runtimeStatus = 'ready';
    panel.dataset.runtimePlayhead = playheadOutput ? String(playheadOutput.endpoint + 1) : '';
    const activePattern = [];
    panel.stepBtns.forEach((button, index) => {
      const output = outputs.get(index);
      if (!output) return;
      const lit = (output.alpha & 1) !== 0;
      if (lit) activePattern.push(index);
      const playhead = (output.alpha & 2) !== 0;
      button.classList.toggle('is-lit', lit);
      button.classList.toggle('is-playhead', playhead);
      button.setAttribute('aria-pressed', lit ? 'true' : 'false');
      const led = panel.stepLeds[index];
      led.classList.toggle('is-lit', lit);
      led.classList.toggle('is-playhead', playhead);
      led.classList.add('is-runtime-led');
      led.style.setProperty('--tbd-panel-runtime-led', rgbCss(output.value));
    });
    latestPattern = activePattern;
    panel.dataset.runtimePattern = activePattern.map(index => index + 1).join(',');
    // The product runtime is canonical. Browser audio consumes its published
    // pattern instead of independently guessing the result of the same click.
    const seq = panel._followEl;
    if (seq && typeof seq.setPanelPattern === 'function') seq.setPanelPattern(activePattern, 0, activeTrack);
    const transport = outputs.get(16);
    latestRunning = Boolean(transport && (transport.alpha & 1));
    panel.dataset.runtimeRunning = String(latestRunning);
    panel.controls.play.classList.toggle('is-active', latestRunning);
    panel.controls.play.setAttribute('aria-pressed', latestRunning ? 'true' : 'false');
    if (transport) panel.controls.play.style.setProperty('--tbd-panel-runtime-led', rgbCss(transport.value));
    if (seq && typeof seq.setPanelTransport === 'function') seq.setPanelTransport(latestRunning);
    for (let index = 0; index < 4; index += 1) {
      let value = Number(snapshot.observables[`parameter.encoder.${index + 1}`]);
      let scaledValue = Number(snapshot.observables[`parameter.encoder.${index + 1}.normalized`]);
      if (!Number.isFinite(scaledValue)) scaledValue = value / 127 * 100;
      if (screenId === 'tempo') {
        if (index !== 0 || !Number.isFinite(tempo)) continue;
        value = tempo;
        scaledValue = (tempo - 30) / 270 * 100;
      } else if (screenId === 'global.sound') {
        const globalValues = [
          snapshot.observables['global.input'],
          snapshot.observables['global.delay'],
          snapshot.observables['global.reverb'],
          snapshot.observables['master.volume']
        ];
        value = Number(globalValues[index]);
        scaledValue = value / 127 * 100;
      } else if (screenId === 'track.mixer') {
        // TR.MIX publishes the track's own strip. Let the knobs follow it, and
        // project level and pan into that track's browser voice below, so the
        // fader does something audible rather than only moving on screen.
        scaledValue = value / 127 * 100;
      } else if (screenId !== 'sound.parameters') {
        continue;
      }
      const knob = panel.knobs[index];
      if (!knob || !Number.isFinite(value)) continue;
      knob.setAttribute('aria-valuenow', String(value));
      knob.setAttribute('aria-valuetext', screenId === 'tempo' ? `${Math.round(value)} BPM` : String(value));
      // Keep the transparent Web Audio control and the visible firmware knob
      // on one position. Do not reset its drag origin while the user is
      // actively moving it.
      if (!knob.drag && typeof knob.setValue === 'function' && Math.abs(Number(knob.value) - scaledValue) >= 0.5) {
        knob.setValue(scaledValue, false);
      }
      panel.setKnobVisual(knob.parentNode, scaledValue);
      // The Wasm snapshot is the only parameter authority. Project the
      // production value into the browser-audio voice after the command has
      // completed; never let the DOM knob invent an optimistic second state.
      if (screenId === 'sound.parameters' && seq && typeof seq.setPanelKnob === 'function') {
        seq.setPanelKnob(index, scaledValue, activeTrack, parameterPage);
      }
    }
    // The strip is one thing, so apply it in one call after the loop rather
    // than four times as separate knobs.
    if (screenId === 'track.mixer' && seq && typeof seq.setPanelMixer === 'function') {
      seq.setPanelMixer(
        activeTrack,
        Number(snapshot.observables['parameter.encoder.1']),   // LEVEL
        Number(snapshot.observables['parameter.encoder.2']),   // PAN
        Number(snapshot.observables['parameter.encoder.3']),   // FX1 delay send
        Number(snapshot.observables['parameter.encoder.4'])    // FX2 reverb send
      );
    }
    if (screenId === 'tempo' && Number.isFinite(tempo) && tempo !== lastAudioTempo) {
      const seq = panel._followEl;
      if (seq && typeof seq.setPanelTempo === 'function') seq.setPanelTempo(tempo);
      lastAudioTempo = tempo;
    }
    if (Number.isFinite(masterVolume)
        && (masterVolume !== lastAudioMasterVolume || masterMuted !== lastAudioMasterMuted)) {
      const seq = panel._followEl;
      if (seq && typeof seq.setPanelMasterVolume === 'function') {
        seq.setPanelMasterVolume(masterVolume, masterMuted);
      }
      panel.dataset.runtimeMasterVolume = String(masterVolume);
      panel.dataset.runtimeMasterMuted = String(masterMuted);
      lastAudioMasterVolume = masterVolume;
      lastAudioMasterMuted = masterMuted;
    }
  }

  async function tap(endpoint) {
    if (!client) return;
    await client.dispatch({ kind: 'button-down', endpoint });
    const snapshot = await client.dispatch({ kind: 'button-up', endpoint });
    // Apply the command response immediately. The regular pump will publish
    // the same generation later, but track-aware pattern queues must observe
    // the result before deciding which physical input comes next.
    if (snapshot) render(snapshot);
    return snapshot;
  }

  function ensureTransport() {
    transportQueue = transportQueue.then(async () => {
      // A linked audio click follows the physical pointer-up. Wait until that
      // canonical down/up pair and its frame have crossed the Worker before
      // deciding whether a corrective transport press is necessary.
      if (input) await input.flush();
      if (!client || desiredRunning === null || latestRunning === desiredRunning) return;
      await tap('transport.play');
    }).catch(fail);
    return transportQueue;
  }

  function normalizePattern(active) {
    return Array.from(new Set((active || [])
      .map(Number)
      .filter(index => Number.isInteger(index) && index >= 0 && index < 16)))
      .sort((a, b) => a - b);
  }

  async function selectTrack(targetTrack) {
    while (client && latestTrack < targetTrack) await tap('navigation.right');
    while (client && latestTrack > targetTrack) await tap('navigation.left');
  }

  async function applyTrackPattern(targetTrack, wantedPattern) {
    await selectTrack(targetTrack);
    while (client) {
      const wanted = new Set(wantedPattern);
      const current = new Set(latestPattern);
      const changed = Array.from({ length: 16 }, (_, index) => index)
        .filter(index => wanted.has(index) !== current.has(index));
      if (changed.length === 0) break;
      await tap(`step.${changed[0] + 1}`);
    }
  }

  function setTrackPattern(productTrack, active) {
    const targetTrack = Number(productTrack);
    const wantedPattern = normalizePattern(active);
    if (!Number.isInteger(targetTrack) || targetTrack < 1 || targetTrack > 16) return patternQueue;
    patternQueue = patternQueue.then(async () => {
      if (input) await input.flush();
      await applyTrackPattern(targetTrack, wantedPattern);
    }).catch(fail);
    return patternQueue;
  }

  function setTrackPatterns(patterns) {
    const requested = (patterns || []).map(entry => ({
      productTrack: Number(entry.productTrack),
      active: normalizePattern(entry.active)
    })).filter(entry => Number.isInteger(entry.productTrack) && entry.productTrack >= 1 && entry.productTrack <= 16);
    patternQueue = patternQueue.then(async () => {
      if (input) await input.flush();
      const restoreTrack = latestTrack;
      for (const entry of requested) await applyTrackPattern(entry.productTrack, entry.active);
      await selectTrack(restoreTrack);
    }).catch(fail);
    return patternQueue;
  }

  const lifecycle = new RuntimeLifecycle({
    workerUrl,
    onFrame: render,
    onError: fail,
    createBindings: async ({ client: activeClient }) => {
      client = activeClient;
      canvas.hidden = false;
      painter.reset();
      input = new SemanticInputAdapter({ dispatch: event => activeClient.dispatch(event), onError: fail });
      const unbind = [];
      panel.stepBtns.forEach((button, index) => unbind.push(input.bindButton(button, `step.${index + 1}`)));
      unbind.push(input.bindButton(panel.controls.play, 'transport.play'));
      // F1 opens the Project menu and closes it again.
      //
      // Bound like every other control. An earlier attempt gated this on
      // client.descriptor, which only DirectWasmRuntime has — the Worker
      // client does not, so the condition was always false and F1 silently
      // did nothing. A press against an artifact without the endpoint is
      // reported through onError, which is the same path every other binding
      // already relies on.
      if (panel.controls.func1) {
        unbind.push(input.bindButton(panel.controls.func1, 'function.1'));
      }
      unbind.push(input.bindButton(panel.controls.func2, 'function.2'));
      unbind.push(input.bindButton(panel.controls.func5, 'function.5'));
      unbind.push(input.bindButton(panel.controls.left, 'navigation.left'));
      unbind.push(input.bindButton(panel.controls.right, 'navigation.right'));
      unbind.push(input.bindButton(panel.controls.up, 'navigation.up'));
      unbind.push(input.bindButton(panel.controls.down, 'navigation.down'));
      panel.knobs.forEach((knob, index) => {
        // Capture on the actual Web Audio control. Capturing on its wrapper
        // can steal the encoder drag stream.
        if (knob) unbind.push(input.bindEncoder(knob, `encoder.${index + 1}`, { pixelsPerStep: 2 }));
      });
      void ensureTransport();
      return {
        async dispose() {
          await Promise.all(unbind.map(remove => remove()));
          await input.dispose();
          input = null;
          client = null;
          canvas.hidden = true;
          if (fallback) fallback.setAttribute('aria-hidden', 'false');
        }
      };
    }
  });

  const panelTrackEntries = String(panel._followEl?.dataset.panelTracks || '')
    .split(',')
    .map(entry => {
      const [track, voice] = entry.split(':');
      return { track: Number(track), voice: (voice || '').trim() };
    })
    .filter(entry => Number.isInteger(entry.track) && entry.track >= 1 && entry.track <= 16);
  const enabledTracks = panelTrackEntries.map(entry => entry.track);

  // Which product machine backs each teaching voice. This binding is the docs
  // site's to make: the runtime contract carries neutral machine ids precisely
  // so a consumer can choose, and the product never learns about lesson voices.
  const VOICE_MACHINES = {
    kick: 'synth-kick', kick2: 'fm-kick', snare: 'digital-snare',
    clap: 'clap', rim: 'rimshot', hhc: 'hat-closed', hho: 'hat-open',
    ride: 'hat-open', cow: 'rimshot', tom: 'analog-snare', shk: 'hat-closed'
  };

  // Opt-in per page. Lessons deliberately do NOT set this: their text names the
  // real machines ("boots with Synth Kick20"), so renaming their tracks would
  // make the prose disagree with the screen. Sending no `tracks` key leaves
  // boot state byte-identical to before this existed.
  const wantsGenericNames = panel._followEl?.dataset.panelGenericNames === 'true';
  const seq = panel._followEl;
  if (wantsGenericNames && typeof seq?.getTrackLabel !== 'function' && window.console) {
    console.warn('TBD panel: <tbd-seq> has no getTrackLabel(); device tracks keep their factory names. Usually a stale cached tbd-seq.js — hard-reload.');
  }
  const tracks = wantsGenericNames
    ? panelTrackEntries
        .filter(entry => VOICE_MACHINES[entry.voice])
        .map(entry => ({
          index: entry.track,
          machine: VOICE_MACHINES[entry.voice],
          // Taken from the grid row itself, so the screen and the row can
          // never drift apart, and both follow the page's language.
          // No silent fallback to the raw voice id: that used to put "hhc" on
          // the device while the grid row said "Closed hat", which reads as a
          // bug in the device rather than a stale script. Omitting the name
          // keeps the factory one and the warning says why.
          name: typeof seq.getTrackLabel === 'function' ? seq.getTrackLabel(entry.voice) : undefined
        }))
    : null;

  await lifecycle.activate({
    moduleUrl: moduleUrl.href,
    configuration: tracks && tracks.length
      ? { fixtureId: 'sound-boot', enabledTracks, tracks }
      : { fixtureId: 'sound-boot', enabledTracks },
    seed: 1
  });

  async function frame() {
    if (destroyed) return;
    try { await lifecycle.pump(); } catch (error) { fail(error); }
    animationFrame = window.requestAnimationFrame(frame);
  }
  animationFrame = window.requestAnimationFrame(frame);

  return {
    handlesPhysicalInput: true,
    toggleTransport() {
      desiredRunning = !latestRunning;
      void ensureTransport();
    },
    setTransport(shouldRun) {
      desiredRunning = Boolean(shouldRun);
      void ensureTransport();
    },
    setTrackPattern(productTrack, active) {
      return setTrackPattern(productTrack, active);
    },
    setTrackPatterns(patterns) {
      return setTrackPatterns(patterns);
    },
    async destroy() {
      if (destroyed) return;
      destroyed = true;
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      await lifecycle.dispose();
      canvas.remove();
      if (fallback) fallback.setAttribute('aria-hidden', 'false');
      panel.dataset.runtimeStatus = 'disposed';
      panel.dataset.runtimeRunning = 'false';
      panel.dataset.runtimePlayhead = '';
      panel.dataset.runtimePattern = '';
      panel.dataset.runtimeScreen = '';
      panel.dataset.runtimeTempo = '';
      panel.dataset.runtimeTrack = '';
      panel.dataset.runtimeMasterVolume = '';
      panel.dataset.runtimeMasterMuted = '';
    }
  };
}
