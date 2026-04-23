---
layout: default
title: Wavetable Osc
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 12
---

# Wavetable Osc

A flexible wavetable oscillator with a state-variable filter, dual modulators (ADSR + LFO) and 1 MiB of onboard wavetable ROM. Great for pads, leads and evolving textures.
{: .fs-6 .fw-300 }

**Available on:** Track 8
**Built on:** Custom **CTAG** voice — wavetable oscillator with 1 MiB wavetable ROM, full ADSR and two LFOs.

---

## Character

Two-dimensional wavetable scanning — pick a **Bank** (16 banks of 64 waves each), then sweep through **Wave** positions for evolving timbres. The ADSR + LFO can modulate wave position, oscillator FM, filter cutoff and amplitude — enough routing to build classic "moving pad" or "evolving bass" sounds wavetables are loved for.

{: .warning }
> **Gotchas before you tweak:**
> - **Q Scale** (pitch-quantize) is currently not wired on the Wavetable Osc DSP — dropped from the macro until the feature lands. Use sequencer-side note quantization if you need scale snapping.
> - **Sync** parameter is a toggle — affects LFO reset phase on note-on only.

---

## Parameters

The default Wavetable Osc performance macro is organised as **five semantic pages × 4 knobs = 20 params**:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Osc** | Bank | Wave | Tune | Gain |
| **Filter** | Type | Cutoff | Reso | EG Flt |
| **Env** | Attack | Decay | Sustain | Release |
| **EG Mod** | EG Wav | EG FM | LFO Spd | Sync |
| **LFO** | LFO Wav | LFO AM | LFO FM | LFO Flt |
{: .dada-minimal-table }

### Osc

| Parameter | What it does |
|:----------|:-------------|
| **Bank** | Select wavetable bank (0–15). Each bank holds 64 waves. |
| **Wave** | Scan position within the current bank. Hi-res 14-bit for smooth wavetable sweeps. |
| **Tune** | Oscillator fine tuning, **bipolar ±1 octave**. Centre = unity pitch; full left = −12 semitones, full right = +12 semitones. Hi-res. |
| **Gain** | Voice output gain (0 = silent, centre ≈ unity, max ≈ 2× with quadratic taper — gets loud). Hi-res. |
{: .dada-minimal-table }

### Filter

| Parameter | What it does |
|:----------|:-------------|
| **Type** | Filter mode — `0` Off (bypass), `1` LP, `2` BP, `3` HP. |
| **Cutoff** | Filter cutoff frequency, log curve. Hi-res 14-bit. |
| **Reso** | Filter resonance (0 → 20×). Hi-res. |
| **EG Flt** | Envelope → Cutoff modulation depth, **bipolar ±1** — negative values close the filter on note-on, positive open it. Hi-res. |
{: .dada-minimal-table }

### Env (ADSR)

A full attack / decay / sustain / release amplitude envelope shapes every note.

| Parameter | What it does |
|:----------|:-------------|
| **Attack** | 0.5 ms – 5 s exponential, hi-res. |
| **Decay** | 0 – 10 s exponential, hi-res. |
| **Sustain** | Sustain level 0–100 %, hi-res. |
| **Release** | 0 – 10 s exponential, hi-res. |
{: .dada-minimal-table }

### EG Mod

Envelope → destinations + main LFO speed/sync controls.

| Parameter | What it does |
|:----------|:-------------|
| **EG Wav** | Envelope → Wave position, **bipolar ±1**. Negative swings the scan backward, positive forward. |
| **EG FM** | Envelope → Oscillator FM, **bipolar ±12 semitones**. |
| **LFO Spd** | LFO 1 frequency, 0–20 Hz with log curve. Hi-res. |
| **Sync** | `OFF` / `ON` — on note-on, reset LFO phase to 0 for rhythmic patches. |
{: .dada-minimal-table }

### LFO

LFO → destinations. All unipolar 0–100 %.

| Parameter | What it does |
|:----------|:-------------|
| **LFO Wav** | LFO → Wave position scan depth. |
| **LFO AM** | LFO → Amplitude (tremolo). |
| **LFO FM** | LFO → Oscillator FM depth. |
| **LFO Flt** | LFO → Cutoff depth. |
{: .dada-minimal-table }

{: .note }
> **Recipes**:
> - **Evolving pad**: long Attack + long Release + slow LFO Spd + modest LFO Wav for wavetable drift.
> - **Plucky wavetable lead**: short Attack + short Decay + strong `EG Wav` for wavetable sweep on each note.
> - **FM bass**: short envelope + `EG FM` cranked (bipolar — try positive for up-sweep, negative for down-sweep).

---

## Factory presets

| Preset | Character |
|:-------|:----------|
| `WaveTbl` | Neutral defaults across every knob. Starting point for sound design. |
| `GlasEvo` | Glass-like evolving pad — mid morph, bright filter, subtle LFO texture. |
| `Gritty` | Deeper bass morph with harsher wavetable position + filter drive. |
{: .dada-minimal-table }

---

## See also

- [Mono Synth](mono-synth) — Braids macro-oscillator alternative on the same track.
- [PolyPad](polypad) — 24-voice polyphonic pad companion.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG wavetable voice by Robert Manzke (GPL 3.0). Built on Mutable Instruments Plaits' wavetable helpers (MIT), with a CTAG ADSR and 1 MiB of wavetable ROM.

- DSP sources: `plaits/dsp/oscillator/wavetable_oscillator.h`, `helpers/ctagSampleRom.hpp`, `helpers/ctagADSREnv.hpp`
- TBD-16 wrapper: `rack/RackWTOsc.hpp` / `.cpp`
- Related reading: [CTAG TBD plugins](https://ctag-fh-kiel.github.io/ctag-tbd/plugins/)

</div>
