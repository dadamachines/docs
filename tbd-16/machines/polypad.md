---
layout: default
title: PolyPad
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 13
---

# PolyPad

A polyphonic chord-pad synth. Play a single root note and PolyPad voices a full chord of up to 8 stacked notes, with inversions, detuned supersaw layers, two LFOs and a state-variable filter.
{: .fs-6 .fw-300 }

**Available on:** Track 9  
**Built on:** **CTAG ChordSynth** — chord table from MI **Plaits** chord engine, MI-style supersaw oscillator, MI **Braids** SVF filter.

---

## Character

Pick a chord shape, pick an inversion, play a single root note — PolyPad voices a full chord with up to 8 stacked notes per trigger. Detuned supersaw layers produce a rich, classic-trance chord pad; turn detune down and the shape stays clean for film-score strings.

Two LFOs can modulate filter cutoff and pitch, the SVF gives you LP / BP / HP shaping, and a per-chord-trigger ADSR envelope makes PolyPad equally at home on slow pads, plucky stabs or rhythmic chord stabs.

**Available chord shapes:** `OCT · 5 · sus4 · m · m6 · m7 · m9 · m11 · 69 · M9 · M7 · M6 · M · D7 · A7 · HDim7 · Dim7 · Dom7 sus`

---

## Parameters

The default PolyPad performance macro is organised as **4 pages × 4 controls**.

### Chord

| Parameter | What it does |
|:----------|:-------------|
| **Chord** | Chord type (18 shapes, see list above) |
| **Inv** | Chord inversion |
| **Nnotes** | Number of stacked notes (1–8) |
| **Detune** | Supersaw detune amount |
{: .dada-minimal-table }


### Filter

| Parameter | What it does |
|:----------|:-------------|
| **Cutoff** | Filter cutoff frequency |
| **Reso** | Filter resonance |
| **Type** | LP / BP / HP |
| **EG Flt** | Envelope → cutoff amount |
{: .dada-minimal-table }


### Env

The ADSR envelope shapes each triggered chord. Re-triggered on every note, not held from a key gate.

| Parameter | What it does |
|:----------|:-------------|
| **Attack** | Time from trigger to envelope peak |
| **Decay** | Time from peak down to sustain level |
| **Sustain** | Level held while the chord sustains |
| **Release** | Time from note-off back to zero |
{: .dada-minimal-table }


### Motion

Two LFOs for filter cutoff and pitch modulation.

| Parameter | What it does |
|:----------|:-------------|
| **L1 Spd** | LFO 1 speed (modulates pitch / vibrato) |
| **L1 Amt** | LFO 1 depth |
| **L2 Spd** | LFO 2 speed (modulates filter cutoff) |
| **L2 Amt** | LFO 2 depth |
{: .dada-minimal-table }


{: .tip }
> Lock `chord` per step to turn a single held note into a full chord progression — the fastest way to write chord sequences on a groovebox.

---

## See also

- [Mono Synth](mono-synth) — monophonic Braids-based alternative.
- [Wavetable Osc](wavetable-osc) — pad-capable wavetable voice.

<div class="origin-card" markdown="1">

## Origin & credits

PolyPad is CTAG's **ChordSynth** engine, a custom chord voice by Robert Manzke (CTAG, 2020, GPL 3.0) that combines several Mutable Instruments building blocks:

- **Chord table from Plaits' chord engine** — CTAG's own source comment reads *"from plaits chord engine augmented with inversions"*. The 18 chord shapes are taken directly from Plaits, with inversion logic added on top.
- **MI-style supersaw oscillator** (`polypad/MiSuperSawOsc.hpp`) using Braids' parameter-interpolation and resource tables.
- **Braids SVF filter** (`braids/svf.h`, MIT).
- **CTAG ADSR, sine source, voice allocation** by Robert Manzke (GPL 3.0).

The CTAG TBD plugin list describes PolyPad as *"Dub-like minor pads or smooth long attack / release glue logic strings, 24 voice polyphony."*

- DSP sources: `polypad/ChordSynth.hpp`, `polypad/MiSuperSawOsc.hpp`, `braids/svf.h`
- TBD-16 wrapper: `rack/RackPolyPad.hpp` / `.cpp`
- Related reading: [Plaits chord engine](https://pichenettes.github.io/mutable-instruments-documentation/modules/plaits/manual/#chord)

</div>
