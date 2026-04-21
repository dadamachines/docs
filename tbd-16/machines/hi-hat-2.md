---
layout: default
title: Hi-Hat 2
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 7
---

# Hi-Hat 2

Longer, more open hi-hat companion to [Hi-Hat 1](hi-hat-1). Great for open hats, ride-like textures and shakers.
{: .fs-6 .fw-300 }

**Available on:** Track 6  
**Built on:** Mutable Instruments **Plaits** — `hi_hat` model (open variant).

---

## Character

Same six-partial metallic noise voice as HH1, tuned here for longer, more sustained hats. The noise balance is pushed further so you can dial in open hats, rides and tambourine-like textures.

---

## Parameters

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **f0** | low → high | Centre pitch of the hat partials |
| **tone** | warm → bright | Bandpass / highpass colour |
| **decay** | short → long | Open-hat decay time |
| **noisiness** | metallic → noisy | Blend between tuned partials and white noise |
| **accent** | soft → hard | Velocity / emphasis |
{: .dada-minimal-table }

{: .tip }
> Pair HH1 (closed) and HH2 (open) on adjacent tracks and use [Mutes]({{ site.baseurl }}/tbd-16/sequencer/pattern-mutes) to sculpt the groove.

---

## See also

- [Hi-Hat 1](hi-hat-1) — closed-hat companion on Track 5.

<div class="origin-card" markdown="1">

## Origin & credits

Based on Mutable Instruments Plaits' `hi_hat` model (Émilie Gillet, MIT-licensed). Uses the same DSP as Hi-Hat 1 with an open-hat-oriented preset. TBD-16 integration by Robert Manzke / CTAG (GPL 3.0).

- DSP source: `plaits/dsp/drums/hi_hat.h`
- TBD-16 wrapper: `rack/RackHH2.hpp` / `.cpp`

</div>
