---
layout: default
title: Mono Synth
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 11
---

# Mono Synth

Monophonic lead / bass voice with dozens of synthesis models in a single machine — plus FM, waveshaping, decimation and bit-crushing.
{: .fs-6 .fw-300 }

**Available on:** Track 8  
**Built on:** Mutable Instruments **Braids** — `MacroOscillator` with 40+ synthesis models.

---

## Character

A chameleon synth voice. The **shape** control steps through the full Braids model catalogue: saw, square, FM, wavetables, Karplus-style strings, additive, granular clouds, cymbal, drum, speech, and more. Each model exposes two timbre parameters that change meaning per model. Combined with waveshaping and lo-fi processing, it covers clean, gritty and glitchy tones from one voice.

---

## Parameters


### Oscillator

| Parameter | What it does |
|:----------|:-------------|
| **shape** | Braids synthesis model selector (40+ models) |
| **param_0** | TIMBRE — first timbre control (model-specific) |
| **param_1** | COLOR — second timbre control (model-specific) |
| **p0_amt** | Envelope → TIMBRE amount |
| **p1_amt** | Envelope → COLOR amount |
| **fm_amt** | Envelope → oscillator pitch (FM) |
| **waveshaping** | Signature waveshaper amount |
{: .dada-minimal-table }


### Lo-fi

| Parameter | What it does |
|:----------|:-------------|
| **decimation** | Sample-rate reduction — aliasing / grit |
| **bit_reduction** | Bit-depth reduction — lo-fi crush |
{: .dada-minimal-table }


### Envelope / Pitch

| Parameter | What it does |
|:----------|:-------------|
| **attack** | AD attack time |
| **decay** | AD decay time |
| **loopEG** | Loop the envelope for LFO-like modulation |
| **q_scale** | Quantize incoming pitch to a musical scale |
{: .dada-minimal-table }

{: .tip }
> Spend a minute auditioning `shape` on a held note. Then lock `param_0` / `param_1` per step for expressive sequences. Enable `loopEG` for rhythmic tremolo-style effects without an LFO.

---

## See also

- [Acid Bass (TBD-03)](acid-bass) — same oscillator in a 303-style chassis.
- [Wavetable Osc](wavetable-osc) — dedicated wavetable voice.
- [PolyPad](polypad) — 24-voice polyphonic companion.

<div class="origin-card" markdown="1">

## Origin & credits

Built on Mutable Instruments **Braids** `MacroOscillator` (Émilie Gillet, MIT-licensed). TBD-16 integration by Robert Manzke / CTAG (GPL 3.0) adds the AD envelope, modulation routing, decimation, bit-reduction and scale quantizer.

- DSP sources: `braids/macro_oscillator.h`, `braids/signature_waveshaper.h`
- TBD-16 wrapper: `rack/RackMO.hpp` / `.cpp`
- Related reading: [Mutable Instruments Braids manual](https://pichenettes.github.io/mutable-instruments-documentation/modules/braids/manual/)

</div>
