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

| Parameter | Range | What it does |
|:----------|:------|:-------------|
| **f0** | low → high | Pitch of the sine body |
| **base** | soft → hard | Pre-filter drive / tone character |
| **decay** | short → long | Envelope decay |
| **reso_hp** | open → resonant | Highpass resonance — more ring at higher values |
| **noise_level** | 0 → high | Metallic noise layer amount |
| **accent** | soft → hard | Velocity / emphasis |
{: .dada-minimal-table }

{: .tip }
> Low `f0` + low `noise_level` = woodblock; higher `f0` + medium `noise_level` + more `reso_hp` = classic 808 rimshot.

---

## See also

- [Clap](clap) — shares Track 4.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG voice (`synthesis/Rimshot.hpp` / `.cpp`) by Robert Manzke — part of the CTAG TBD rack library (GPL 3.0). Uses Mutable Instruments `SineOscillator` and `stmlib` SVF filters internally.

- DSP source: `synthesis/Rimshot.hpp` / `.cpp`
- TBD-16 wrapper: `rack/RackRimshot.hpp` / `.cpp`

</div>
