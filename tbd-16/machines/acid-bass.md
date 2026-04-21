---
layout: default
title: Acid Bass (TBD-03)
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 10
---

# Acid Bass (TBD-03)

A TB-303-style acid bass voice with slide, accent and the squelchy resonant filter that defines the genre.
{: .fs-6 .fw-300 }

**Available on:** Track 7  
**Built on:** **Braids** macro-oscillator + CTAG **diode-ladder filter** — 303-style acid voice.

---

## Character

A Braids macro-oscillator provides the tonal source (saw, square, and many other models), driven through a choice of analog-modelled diode-ladder filter variants. A dedicated filter envelope, slide circuit and 303-style accent circuit brighten and punch louder steps.

---

## Parameters


### Oscillator

| Parameter | What it does |
|:----------|:-------------|
| **shape** | Braids oscillator model |
| **param_0 / param_1** | Model-specific TIMBRE / COLOR controls |
| **p0_amt / p1_amt** | Envelope modulation into TIMBRE / COLOR |
| **q_scale** *(see Mono Synth)* | Pitch-quantize scale |
{: .dada-minimal-table }


### Filter

| Parameter | What it does |
|:----------|:-------------|
| **filter_type** | Selects one of five diode-ladder filter variants |
| **cutoff** | Filter cutoff frequency |
| **resonance** | Filter resonance — crank for squelch |
| **envelope** | Filter-envelope amount |
| **decay_vcf** | Filter envelope decay |
| **saturation** | Pre-filter saturation |
| **drive** | Overdrive into the filter |
{: .dada-minimal-table }


### Amplifier / Performance

| Parameter | What it does |
|:----------|:-------------|
| **decay_vca** | Amplitude envelope decay |
| **slide** | Portamento between notes |
| **accent** | Per-step accent on/off |
| **accent_level** | How much accent brightens / boosts the voice |
{: .dada-minimal-table }

{: .tip }
> Program slides using step **ties** and set `accent` locks on specific steps to get classic 303 funk. Try each `filter_type` — they sound noticeably different.

---

## See also

- [Mono Synth](mono-synth) — same Braids oscillator without the acid filter.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — essential for acid programming.

<div class="origin-card" markdown="1">

## Origin & credits

CTAG's **TBD-03** engine. Combines Mutable Instruments **Braids** macro-oscillator (Émilie Gillet, MIT) with CTAG's own analog diode-ladder filter models (`filters/ctagDiodeLadderFilter*.hpp`) and a 303-style envelope + accent engine by Robert Manzke (GPL 3.0).

- DSP sources: `braids/*`, `filters/ctagDiodeLadderFilter*.hpp`, `synthesis/RomplerVoiceMinimal.hpp`
- TBD-16 wrapper: `rack/RackTBD03.hpp` / `.cpp`
- Related reading: [Mutable Instruments Braids manual](https://pichenettes.github.io/mutable-instruments-documentation/modules/braids/manual/), [CTAG TBD plugins](https://ctag-fh-kiel.github.io/ctag-tbd/plugins/)

</div>
