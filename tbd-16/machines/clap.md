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

The `cl-allparams` macro surfaces the five most playable controls across two pages — the underlying DSP has more layers internally (two filtered burst layers, per-layer resonance and decay, timer patterns) that the macro collapses into higher-level shaping knobs:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Tone**  | Freq | Tone | Decay | Scale |
| **Shape** | Trans | — | — | — |
{: .dada-minimal-table }

### Tone

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Freq**  | low → high     | Centre pitch of the burst layers | `pitch1` / `pitch2` |
| **Tone**  | soft → sharp   | Filter resonance shaping | `reso1` / `reso2` |
| **Decay** | short → long   | Overall tail length of both layers | `decay1` / `decay2` |
| **Scale** | tight → spread | Spacing of the burst sequence | `scale` |
{: .dada-minimal-table }

### Shape

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Trans** | 0 → 15 | Transient pattern preset (burst timing / attack softness) | `transient` |
{: .dada-minimal-table }

{: .tip }
> Lock `Scale` or `Trans` per step to turn a single clap track into handclap, rimshot-burst and tambourine-like textures.

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
