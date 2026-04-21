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

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **f0** | low → high | Pitch of the tonal body |
| **fm_amount** | 0 → high | Envelope FM into the oscillator — adds bite |
| **decay** | short → long | Body + noise decay length |
| **snappy** | body → snap | Balance between tonal body and snare noise layer |
| **accent** | soft → hard | Velocity / emphasis |
{: .dada-minimal-table }


{: .tip }
> Lock `f0` per step to create snare melodies; very short `decay` values behave almost like rimshots.

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
