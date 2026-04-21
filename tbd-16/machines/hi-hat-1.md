---
layout: default
title: Hi-Hat 1
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 6
---

# Hi-Hat 1

Short, bright closed-hat voice. Pair with [Hi-Hat 2](hi-hat-2) for a full closed + open hi-hat kit.
{: .fs-6 .fw-300 }

**Available on:** Track 5  
**Built on:** Mutable Instruments **Plaits** — `hi_hat` model (closed variant).

---

## Character

A six-partial metallic noise source shaped by a bandpass/highpass filter and a fast decay envelope. Tuned for short, crisp closed-hat hits with musically-pleasing inharmonic partials.

---

## Parameters

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **f0** | low → high | Centre pitch of the hat partials |
| **tone** | warm → bright | Bandpass / highpass colour |
| **decay** | short → long | Decay time (short = closed, long = half-open) |
| **noisiness** | metallic → noisy | Blend between tuned partials and white noise |
| **accent** | soft → hard | Velocity / emphasis |
{: .dada-minimal-table }

{: .tip }
> Lock `decay` per step to mix closed and half-open hits on a single track, or run HH1 closed and HH2 open on adjacent tracks.

---

## See also

- [Hi-Hat 2](hi-hat-2) — open-hat companion on Track 6.

<div class="origin-card" markdown="1">

## Origin & credits

Based on Mutable Instruments Plaits' `hi_hat` model (Émilie Gillet, MIT-licensed). HH1 and HH2 wrap the same DSP with different default presets. TBD-16 integration by Robert Manzke / CTAG (GPL 3.0).

- DSP source: `plaits/dsp/drums/hi_hat.h`
- TBD-16 wrapper: `rack/RackHH1.hpp` / `.cpp`

</div>
