---
layout: default
title: Clap
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 9
---

# Clap

Classic electronic clap. The rapid-fire burst → long tail anatomy of the 808/909 clap, with extra shaping controls.
{: .fs-6 .fw-300 }

**Available on:** Track 4  
**Built on:** Custom **CTAG** voice — multi-burst filtered noise with dual-envelope tail.

---

## Character

Two filtered noise layers running through a pair of state-variable filters and AD envelopes, with a timer-driven transient engine that fires a sequence of short bursts followed by a longer noise tail. The `scale` and `transient` controls let you go from tight hand-claps to wet, room-sized claps.

---

## Parameters

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **pitch1** | low → high | Centre frequency of burst layer 1 |
| **pitch2** | low → high | Centre frequency of burst layer 2 |
| **reso1** | soft → sharp | Resonance of layer 1 filter |
| **reso2** | soft → sharp | Resonance of layer 2 filter |
| **decay1** | short → long | Tail decay of layer 1 |
| **decay2** | short → long | Tail decay of layer 2 (the long "room" tail) |
| **attack** | fast → soft | Transient softness |
| **scale** | tight → spread | Spacing of the burst sequence |
| **transient** | 0 → 15 | Transient preset (burst pattern / timing) |
{: .dada-minimal-table }


{: .tip }
> Lock `scale` or `transient` per step to turn a single clap track into handclap, rimshot-burst and tambourine-like textures.

---

## See also

- [Rimshot](rimshot) — shares Track 4.
- [Analog Snare](analog-snare) — layering partner on Track 3.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG voice (`synthesis/Clap.hpp` / `.cpp`) by Robert Manzke — part of the CTAG TBD rack library (GPL 3.0). Uses `stmlib` SVF filters and CTAG's own AD envelope / timer helpers.

- DSP source: `synthesis/Clap.hpp` / `.cpp`
- TBD-16 wrapper: `rack/RackClap.hpp` / `.cpp`

</div>
