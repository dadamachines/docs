---
layout: default
title: Analog Snare
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 5
---

# Analog Snare

808/909-inspired analog-style snare drum. Wider, warmer and noisier than the Digital Snare.
{: .fs-6 .fw-300 }

**Available on:** Track 3  
**Built on:** Mutable Instruments **Plaits** — `analog_snare_drum` model.

---

## Character

Two detuned resonant modes shaped by a fast envelope, plus a filtered noise burst — the classic analog snare signature. Low `tone` gives deep, thumpy snares; high `tone` gives cracking, metallic hits.

---

## Parameters

The `as-allparams` macro exposes all five DSP parameters across two pages (OLED short label: **AnaSnare**):

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Tone** | Freq | Tone | Decay | Snap |
| **Snap** | Accent | — | — | — |
{: .dada-minimal-table }

### Tone

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Freq**  | low → high    | Base pitch of the tonal body | `f0` |
| **Tone**  | dark → bright | Brightness of the body modes | `tone` |
| **Decay** | short → long  | Snare tail length | `decay` |
| **Snap**  | body → snap   | Balance between body and noise layer | `snappy` |
{: .dada-minimal-table }

### Snap

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Accent** | soft → hard | Velocity / emphasis | `accent` |
{: .dada-minimal-table }

{: .tip }
> Higher `Snap` for noisy rimshot-style hits; lower `Snap` for pitched, tom-like snares.

---

## See also

- [Digital Snare](digital-snare) — brighter, tuned alternative on the same track.
- [Clap](clap) — sits nicely on top of the snare on Track 4.

<div class="origin-card" markdown="1">

## Origin & credits

Based on Mutable Instruments Plaits' `analog_snare_drum` voice (Émilie Gillet, MIT-licensed). TBD-16 integration by Robert Manzke / CTAG (GPL 3.0).

- DSP source: `plaits/dsp/drums/analog_snare_drum.h`
- TBD-16 wrapper: `rack/RackASD.hpp` / `.cpp`

</div>
