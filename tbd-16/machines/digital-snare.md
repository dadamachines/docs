---
layout: default
title: Digital Snare
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 4
---

# Digital Snare

Crisp modern snare voice — tuned body with a filtered noise layer. Default sound on Track 3.
{: .fs-6 .fw-300 }

**Available on:** Track 3  
**Built on:** Mutable Instruments **Plaits** — `synthetic_snare_drum` model.

---

## Character

A tuned oscillator pair plus a noise layer, shaped by a fast envelope. Pitched content gives it more presence in a mix than classic analog snares — great for digital / electronic styles.

---

## Parameters

The `ds-allparams` macro exposes all five DSP parameters across two pages:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Tone** | Freq | Decay | FM | Snap |
| **Snap** | Accent | — | — | — |
{: .dada-minimal-table }

### Tone

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Freq**  | low → high   | Pitch of the tonal body | `f0` |
| **Decay** | short → long | Body + noise decay length | `decay` |
| **FM**    | 0 → high     | Envelope FM into the oscillator — adds bite | `fm_amount` |
| **Snap**  | body → snap  | Balance between tonal body and snare noise layer | `snappy` |
{: .dada-minimal-table }

### Snap

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Accent** | soft → hard | Velocity / emphasis | `accent` |
{: .dada-minimal-table }

{: .tip }
> Lock `Freq` per step to create snare melodies; very short `Decay` values behave almost like rimshots.

---

## See also

- [Analog Snare](analog-snare) — warmer 808/909-style snare on the same track.
- [Clap](clap) — layering partner on Track 4.

<div class="origin-card" markdown="1">

## Origin & credits

Based on Mutable Instruments Plaits' `synthetic_snare_drum` voice (Émilie Gillet, MIT-licensed). TBD-16 integration by Robert Manzke / CTAG (GPL 3.0).

- DSP source: `plaits/dsp/drums/synthetic_snare_drum.h`
- TBD-16 wrapper: `rack/RackDSD.hpp` / `.cpp`

</div>
