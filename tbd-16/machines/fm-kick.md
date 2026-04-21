---
layout: default
title: FM Kick / Bass
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 3
---

# FM Kick / Bass

Synthesised FM kick drum / bass voice — punchy electronic kicks with a distinctive metallic/plucky edge, plus tuned bass notes.
{: .fs-6 .fw-300 }

**Available on:** Track 2  
**Built on:** Custom **CTAG** FM kick voice — two-operator FM synthesis with dedicated decay envelopes.

---

## Character

A classic two-operator FM topology: a **carrier** at the fundamental frequency, modulated by a **modulator** whose frequency, amplitude, feedback and decay you can dial in independently.

- Short modulator decay + high modulation index → plucky, metallic kick transient.
- Low fundamental + gentle pitch sweep → deep sub kick.
- Higher fundamental + more feedback → tuned FM bass lines (perfect for playing melodic bass on a sequencer track).

The modulator can run either on a free Hz frequency or on a **ratio** to the carrier, giving you either arbitrary inharmonic metallic tones or harmonically-locked musical tones.

---

## Parameters

### Carrier

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **f_b** | 20 – 100 Hz | Base carrier frequency (the pitch) |
| **d_b** | 1 ms – 2 s | Carrier amplitude decay |
| **A_f** | 0 – 1000 Hz | Pitch-sweep amount at the attack |
| **d_f** | 1 ms – 2 s | Pitch-sweep decay time |
{: .dada-minimal-table }


### Modulator

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **use_ratio_mode** | off / on | Switch modulator frequency between Hz and ratio-to-carrier |
| **f_m** | 40 – 2000 Hz | Modulator frequency (when ratio mode is off) |
| **mod_ratio_index** | 0 – 63 | Modulator ratio preset (when ratio mode is on) |
| **I** | 0 – 10 | Modulation index (modulator amplitude into carrier) |
| **b_m** | 0 – 16 | Modulator self-feedback |
| **d_m** | 1 ms – 2 s | Modulator amplitude decay |
| **mod_env_sync** | off / on | Sync modulator frequency envelope to carrier |
{: .dada-minimal-table }


{: .tip }
> For punchy techno kicks: low `f_b`, short `d_b`, short `d_m`, moderate `I`, short `A_f` pitch sweep. For FM bass lines: higher `f_b`, ratio mode on, longer `d_b`.

---

## See also

- [Synth Kick](synth-kick) — Plaits-based electronic kick on Track 1.
- [Analog Bass Drum](analog-bass-drum) — warm analog-style kick on Track 1.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — per-step pitch and modulation-index variation.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG FM kick voice (`synthesis/FmKick.hpp` / `.cpp`) by Robert Manzke (CTAG, GPL 3.0). Uses Mutable Instruments Plaits' FM operator (`plaits/dsp/fm/operator.h`, MIT) as the oscillator core.

The design is inspired by the Elektron Machinedrum SPS-1 **EFM Kick** concept and shares ideas with the open-source [md-drum-synth](https://github.com/ctag-fh-kiel/md-drum-synth) research project, but this voice is a separate CTAG implementation — not a port.

- DSP sources: `synthesis/FmKick.hpp` / `.cpp`, `plaits/dsp/fm/operator.h`
- TBD-16 wrapper: `rack/RackFMB.hpp` / `.cpp`

</div>
