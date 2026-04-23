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

The `fmb-allparams` macro exposes all ten FM-drum parameters across three pages:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Carrier**   | carFrq  | carDec  | atkPit | swpDec |
| **Modulator** | modFrq  | modDec  | modFB  | index  |
| **Mode**      | ratio   | envSync | —      | —      |
{: .dada-minimal-table }

### Carrier

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **carFrq**  | 20 – 100 Hz | Base carrier frequency — the fundamental pitch of the kick | `f_b` |
| **carDec**  | 1 ms – 2 s  | Carrier amplitude decay — how long the body sustains | `d_b` |
| **atkPit**  | 0 – 1000 Hz | Pitch-sweep amount at the attack — initial pitch deviation before settling | `A_f` |
| **swpDec**  | 1 – 100 ms  | Pitch-sweep decay — how fast the attack pitch settles | `d_f` |
{: .dada-minimal-table }

### Modulator

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **modFrq**  | 40 – 2000 Hz | Modulator frequency (Hz mode) — tonal character of the FM | `f_m` |
| **modDec**  | 1 – 500 ms   | Modulator amplitude decay — transient brightness length | `d_m` |
| **modFB**   | 0 – 16       | Modulator self-feedback — distortion / resonance amount | `b_m` |
| **index**   | 0 – 10       | FM modulation index — depth of the modulation (0 = no FM) | `I` |
{: .dada-minimal-table }

### Mode

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **ratio**   | off / on | When on, `modFrq` locks to a harmonic ratio of `carFrq` instead of running as free Hz — enables clean musical FM bass lines | `use_ratio_mode` |
| **envSync** | off / on | Sync the modulator frequency envelope to the carrier — cleaner retrigger for sequenced bass | `mod_env_sync` |
{: .dada-minimal-table }

{: .tip }
> For punchy techno kicks: low `carFrq`, short `carDec`, short `modDec`, moderate `index`, short `atkPit` sweep. For FM bass lines: higher `carFrq`, `ratio` on, longer `carDec`.

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
