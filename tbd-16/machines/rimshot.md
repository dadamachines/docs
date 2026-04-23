---
layout: default
title: Rimshot
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 8
---

# Rimshot

Sharp, pitched rimshot / side-stick voice. Covers side-stick, rimshot, woodblock and claves-style percussion.
{: .fs-6 .fw-300 }

**Available on:** Track 4  
**Built on:** Custom **CTAG** voice — sine oscillator through resonant filter with noise.

---

## Character

A pure sine oscillator, driven through a pair of resonant state-variable filters and a highpass, shaped by an AD envelope. A noise layer sits alongside for the metallic ring, and a separate accent control brightens and emphasises louder hits.

---

## Parameters

The `rs-allparams` macro exposes all five primary DSP controls across two pages:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Tone** | Freq | Tone | Decay | Noise |
| **Snap** | Accent | — | — | — |
{: .dada-minimal-table }

### Tone

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Freq**  | low → high   | Pitch of the sine body | `f0` |
| **Tone**  | soft → hard  | Pre-filter drive / tone character | `base` |
| **Decay** | short → long | Envelope decay | `decay` |
| **Noise** | 0 → high     | Metallic noise layer amount | `noise_level` |
{: .dada-minimal-table }

### Snap

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Accent** | soft → hard | Velocity / emphasis | `accent` |
{: .dada-minimal-table }

{: .tip }
> Low `Freq` + low `Noise` = woodblock; higher `Freq` + medium `Noise` + more resonant `Tone` = classic 808 rimshot.

---

## See also

- [Clap](clap) — shares Track 4.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG voice (`synthesis/Rimshot.hpp` / `.cpp`) by Robert Manzke — part of the CTAG TBD rack library (GPL 3.0). Uses Mutable Instruments `SineOscillator` and `stmlib` SVF filters internally.

- DSP source: `synthesis/Rimshot.hpp` / `.cpp`
- TBD-16 wrapper: `rack/RackRimshot.hpp` / `.cpp`

</div>
