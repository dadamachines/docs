---
layout: default
title: Wavetable Osc
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 12
---

# Wavetable Osc

A flexible wavetable oscillator with a state-variable filter, dual LFOs and 1 MiB of onboard wavetable ROM. Great for pads, leads and evolving textures.
{: .fs-6 .fw-300 }

**Available on:** Track 8  
**Built on:** Custom **CTAG** voice — wavetable oscillator with 1 MiB wavetable ROM, full ADSR and two LFOs.

---

## Character

Two-dimensional wavetable scanning — you choose a **wavebank**, then sweep through its **wave** positions for evolving timbres. A full ADSR and two LFOs can modulate wave position, FM, filter cutoff and amplitude — enough routing to build the classic "moving pad" or "evolving bass" sounds wavetables are loved for.

---

## Parameters

### Oscillator

| Parameter | What it does |
|:----------|:-------------|
| **wavebank** | Select wavetable bank |
| **wave** | Scan position within the wavetable |
| **tune** | Oscillator tuning |
| **gain** | Voice output gain |
{: .dada-minimal-table }


### Filter

| Parameter | What it does |
|:----------|:-------------|
| **fmode** | Filter mode (LP / BP / HP) |
| **fcut** | Cutoff frequency |
| **freso** | Resonance |
| **q_scale** | Pitch quantize scale |
{: .dada-minimal-table }


### Envelope (ADSR)

| Parameter | What it does |
|:----------|:-------------|
| **attack / decay / sustain / release** | Full ADSR envelope |
| **eg2wave** | Envelope → wave position |
| **eg2fm** | Envelope → oscillator FM |
| **eg2filtfm** | Envelope → filter FM |
{: .dada-minimal-table }


### LFO 1 + LFO 2

| Parameter | What it does |
|:----------|:-------------|
| **lfospeed** | LFO 1 speed |
| **lfosync** | LFO 1 tempo sync |
| **lfo2wave** | LFO 2 → wave position |
| **lfo2am** | LFO 2 → amplitude |
| **lfo2fm** | LFO 2 → oscillator FM |
| **lfo2filtfm** | LFO 2 → filter FM |
{: .dada-minimal-table }


{: .tip }
> Long `attack` + long `release` + LFO 2 modulating `wave` position = instant evolving pad. For plucks, use a fast envelope with `eg2wave` to sweep the wavetable on each note.

---

## See also

- [Mono Synth](mono-synth) — Braids macro-oscillator alternative on the same track.
- [PolyPad](polypad) — 24-voice polyphonic pad companion.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG wavetable voice by Robert Manzke (GPL 3.0). Built on Mutable Instruments Plaits' wavetable helpers (`plaits/dsp/oscillator/wavetable_oscillator.h`, MIT), with Braids' signature waveshaper, a CTAG ADSR and 1 MiB of wavetable ROM.

- DSP sources: `plaits/dsp/oscillator/wavetable_oscillator.h`, `braids/*`, `helpers/ctagSampleRom.hpp`, `helpers/ctagADSREnv.hpp`
- TBD-16 wrapper: `rack/RackWTOsc.hpp` / `.cpp`
- Related reading: [CTAG TBD plugins](https://ctag-fh-kiel.github.io/ctag-tbd/plugins/)

</div>
