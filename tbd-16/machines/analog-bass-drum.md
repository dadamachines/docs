---
layout: default
title: Analog Bass Drum
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 2
---

# Analog Bass Drum

Classic 808/909-flavoured analog-style bass drum. Warmer and more resonant than the Synth Kick, with a strong body tail.
{: .fs-6 .fw-300 }

**Available on:** Track 1  
**Built on:** Mutable Instruments **Plaits** — `analog_bass_drum` model.

---

## Character

Models a classic analog bass-drum voice — a damped resonant body with a fast pitch sweep at the transient. Turns into long resonant thumps at high decay settings; stays snappy and punchy at short decays.

---

## Parameters

The `ab-allparams` macro exposes all six DSP parameters across two pages (OLED short label: **AnaKick**):

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Tone**   | Freq | Tone | Decay | A FM |
| **FM Env** | S FM | Accent | — | — |
{: .dada-minimal-table }

### Tone

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **Freq**  | low → high    | Base pitch of the bass-drum body | `f0` |
| **Tone**  | dark → bright | Transient / body brightness | `tone` |
| **Decay** | short → long  | Body decay length | `decay` |
| **A FM**  | 0 → high      | Attack FM — pitch-sweep intensity at the attack | `attack_fm_amount` |
{: .dada-minimal-table }

### FM Env

| Parameter | Range | What it does | DSP |
|:----------|:------|:-------------|:----|
| **S FM**   | 0 → high    | Self FM — internal feedback FM, adds punch and weight | `self_fm_amount` |
| **Accent** | soft → hard | Velocity / emphasis | `accent` |
{: .dada-minimal-table }

{: .tip }
> Longer `Decay` with low `Freq` gives the long-tail 808 sub kick; shorter `Decay` with a slightly higher `Freq` gives tighter 909-style kicks.

---

## See also

- [Synth Kick](synth-kick) — brighter, more modern synth kick on Track 1.
- [FM Kick / Bass](fm-kick) — FM-based kick on Track 2.

<div class="origin-card" markdown="1">

## Origin & credits

Based on Mutable Instruments Plaits' `analog_bass_drum` voice (Émilie Gillet, MIT-licensed). TBD-16 integration by Robert Manzke / CTAG (GPL 3.0).

- DSP source: `plaits/dsp/drums/analog_bass_drum.h`
- TBD-16 wrapper: `rack/RackABD.hpp` / `.cpp`

</div>
