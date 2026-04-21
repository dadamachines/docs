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

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **f0** | low → high | Base pitch of the kick body |
| **tone** | soft → clicky | Transient brightness |
| **decay** | short → long | Body decay length |
| **dirtiness** | clean → dirty | Adds grit / noise to the body (low-pitched kicks only) |
| **fm_envelope_amount** | 0 → high | Strength of the pitch-sweep at the attack |
| **fm_envelope_decay** | short → long | Speed of the pitch sweep |
| **accent** | soft → hard | Overall emphasis / velocity scaling |
{: .dada-minimal-table }

{: .tip }
> Set a short `decay` with a mid `tone` for fast techno kicks; long `decay` with higher `f0` for tom-like body hits.

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
