---
layout: default
title: Synth Kick
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 1
---

# Synth Kick

A punchy electronic kick drum — the default sound on Track 1. Goes from deep sub thumps to short clicky transients.
{: .fs-6 .fw-300 }

**Available on:** Track 1  
**Built on:** Mutable Instruments **Plaits** — `synthetic_bass_drum` model.

---

## Character

A model-based synth kick rather than an analog emulation. The tone control pushes the transient from soft and round to bright and snappy; the decay reshapes the body from a percussive click to a long sustained boom.

---

## Parameters

The `db-allparams` macro surfaces all seven DSP parameters across two pages:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Tone**   | Freq | Tone | Decay | Dirt |
| **FM Env** | Fm Env | Fm Decay | Fm Accent | — |
{: .dada-minimal-table }

### Tone

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Freq**  | low → high    | Base pitch of the kick body | `f0` |
| **Tone**  | soft → clicky | Transient brightness | `tone` |
| **Decay** | short → long  | Body decay length | `decay` |
| **Dirt**  | clean → dirty | Adds grit / noise to the body (low-pitched kicks only) | `dirtiness` |
{: .dada-minimal-table }

### FM Env

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Fm Env**    | 0 → high     | Strength of the pitch-sweep at the attack | `fm_envelope_amount` |
| **Fm Decay**  | short → long | Speed of the pitch sweep | `fm_envelope_decay` |
| **Fm Accent** | soft → hard  | Overall emphasis / velocity scaling | `accent` |
{: .dada-minimal-table }

{: .tip }
> Set a short `Decay` with a mid `Tone` for fast techno kicks; long `Decay` with higher `Freq` for tom-like body hits.

---

## See also

- [Analog Bass Drum](analog-bass-drum) — warmer 909/808-style alternative on the same track.
- [FM Kick / Bass](fm-kick) — FM-based kick on Track 2.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — per-step accent and tone variation.

<div class="origin-card" markdown="1">

## Origin & credits

Based on Mutable Instruments Plaits' `synthetic_bass_drum` voice (Émilie Gillet, MIT-licensed). The TBD-16 integration by Robert Manzke / CTAG (GPL 3.0) adds the trigger pipeline, accent scaling and the preset/parameter surface.

- DSP source: `plaits/dsp/drums/synthetic_bass_drum.h`
- TBD-16 wrapper: `rack/RackDBD.hpp` / `.cpp`

</div>
