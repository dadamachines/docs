---
layout: default
title: Mono Synth
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 11
---

# Mono Synth

Monophonic lead / bass voice with dozens of synthesis models in a single machine — plus FM, waveshaping, decimation and bit-crushing.
{: .fs-6 .fw-300 }

**Available on:** Track 8  
**Built on:** Mutable Instruments **Braids** — `MacroOscillator` with 40+ synthesis models.

---

## Character

A chameleon synth voice. The **shape** control steps through the full Braids model catalogue: saw, square, FM, wavetables, Karplus-style strings, additive, granular clouds, cymbal, drum, speech, and more. Each model exposes two timbre parameters that change meaning per model. Combined with waveshaping and lo-fi processing, it covers clean, gritty and glitchy tones from one voice.

{: .warning }
> **Gotchas before you tweak** — things that look broken but aren't:
> - **Scale** only audibly quantizes when your sequence plays *off-scale* notes. A diatonic C major pattern passed through Ionian sounds identical. Try a chromatic run through Pentatonic Minor or Gamelan to hear it work.
> - **Decay** and **EG Loop** are truncated on `noteOff`. With short step gates you won't hear long decay tails or full loop cycles. Increase step gate length (or use held notes in Play mode) to audition them.
> - **Bit Red** currently produces no audible change in this firmware — known issue under investigation. Use **SR Red** for lo-fi character in the meantime.

---

## When to reach for Mono Synth

| Use this | If you want |
|:---------|:------------|
| **Mono Synth** | Maximum tonal variety in one voice — 47 shapes from analog to granular to speech |
| [Acid Bass (TBD-03)](acid-bass) | Focused 303-style bass with dedicated filter envelope + accent |
| [Wavetable Osc](wavetable-osc) | Smooth wavetable morphing without the extras |
| [PolyPad](polypad) | Chords, pads, evolving textures — polyphonic, 24 voices |
{: .dada-minimal-table }

---

## Shape families at a glance

The 47 shapes aren't a random list — they cluster into audible families. Use this as a navigation aid when hunting tones:

| Shape range | Family | Character |
|:------------|:-------|:----------|
| 0–5 | **Classic analog** | CSAW, saw↔square morph, sine/triangle, buzz, square+sub |
| 6–12 | **Tuned oscillators** | Detuned pairs, triads, harmonic stacks |
| 13–16 | **FM & wavefolder** | 2-op FM, feedback FM, folded sines — metallic to aggressive |
| 17–19 | **Wavetable** | Banks of classic wavetable timbres |
| 20–23 | **Physical models** | Plucked/bowed strings, Karplus, formant models |
| 24–27 | **Harmonic + additive** | Drawbar organ, harmonics, additive |
| 28–31 | **Noise & texture** | Twin peaks, clocked noise, granular clouds |
| 32–35 | **Speech & digital** | Vowels, formants, digital modulation |
| 36–46 | **Percussion + specialty** | Clap, snare, noise bursts, modal textures |
{: .dada-minimal-table }

{: .tip }
> The OLED shows the shape name next to the **Shape** knob. Step slowly on a held note to audition each — many are dramatic one-knob sound changes.

---

## Parameters

The default Mono Synth performance macro is organised as **four semantic pages**: Osc (sound source), Mod (envelope routing), Env (envelope shape), Crush (lo-fi effects).

### Osc

| Parameter | What it does |
|:----------|:-------------|
| **Shape** | Braids synthesis model selector (47 shapes) |
| **Timbre** | First timbre control (model-specific) |
| **Color** | Second timbre control (model-specific) |
| **Warp** | Signature waveshaper amount |
{: .dada-minimal-table }


### Mod

| Parameter | What it does |
|:----------|:-------------|
| **Tim EG** | Envelope → Timbre amount |
| **Col EG** | Envelope → Color amount |
| **FM EG** | Envelope → oscillator pitch (FM) |
| **Scale** | Quantize played pitch to a musical scale. **Scale 0 = Off** (bypass); 1–46 = Semitones, Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian, Blues, Pentatonics, Japanese, Gamelan, and ~30 Indian/exotic scales. Snaps off-scale input notes to the nearest in-scale note. Only audible when your sequence contains notes *outside* the selected scale — a diatonic C major pattern passed through Ionian sounds identical. |
{: .dada-minimal-table }


### Env

An AD envelope shapes each triggered note. The envelope runs from `noteOn` for `Attack + Decay` seconds; `noteOff` cuts it instantly. Loop it on held notes for LFO-style rhythmic modulation.

| Parameter | What it does |
|:----------|:-------------|
| **Attack** | Attack time, 0–5 s, exponential curve. Most musically useful range sits in the lower ~quarter of the knob (plucks, leads, soft swells); beyond that you're in pad/drone territory. |
| **Decay** | Decay time, 0–5 s, exponential. Truncated at `noteOff`, so increase step gate length (or play long held notes) to actually hear long decays. |
| **EG Loop** | `OFF` / `ON` — loop the envelope for tremolo / LFO-style modulation via Tim EG / Col EG / FM EG. Only audible on **held / long-gate notes** (short sequencer gates end before one loop cycle completes). |
{: .dada-minimal-table }

{: .note }
> **Hearing EG Loop**: set `Attack` to minimum and `Decay` low (roughly the bottom fifth of the knob) so one loop cycle completes in ~200 ms, set step gate to maximum, then turn up **Tim EG** and **Col EG** to route the envelope into timbre modulation. With short attack+decay and long notes you'll hear rhythmic tremolo-style movement.


### Crush

Lo-fi sample-rate and bit-depth reduction at the tail of the signal path.

| Parameter | What it does |
|:----------|:-------------|
| **SR Red** | Sample-rate reduction (0–30) — aliasing / grit |
| **Bit Red** | Bit-depth reduction (0–5) — lo-fi crush *(audibility under investigation in current firmware; SR Red works as expected)* |
{: .dada-minimal-table }

---

## Preset recipes

Dial these in quickly to audition MonoSynth's range. Each gets you to a recognisable voice in under 30 seconds. Values shown as approximate knob positions (0–100 %).

### `Pluck` — Plucky Bass

| Knob | Value |
|:-----|:------|
| Shape | **1** (Morph saw↔square) |
| Timbre | 30 % |
| Color | 40 % |
| Warp | 0 |
| Tim EG | 40 % |
| Col EG | 20 % |
| FM EG | 0 |
| Attack | 0 % (≈ 0.5 ms) |
| Decay | 25 % (≈ 200 ms) |
| EG Loop | OFF |
| Scale | Off |
{: .dada-minimal-table }

### `Acid` — Acid-ish Lead

| Knob | Value |
|:-----|:------|
| Shape | **2** (Saw↔Square hard) |
| Timbre | 60 % |
| Color | 30 % |
| Warp | 20 % |
| Tim EG | 80 % (a lot of EG→Timbre for the squelch) |
| Col EG | 0 |
| FM EG | 0 |
| Attack | 0 % |
| Decay | 40 % (≈ 500 ms) |
| SR Red | 10 % |
{: .dada-minimal-table }

### `Drone` — Evolving Drone

| Knob | Value |
|:-----|:------|
| Shape | **15** (Granular Cloud) or **28** (Twin Peaks) |
| Timbre | 50 % |
| Color | 50 % |
| Warp | 40 % |
| Tim EG | 60 % |
| Col EG | 60 % |
| Attack | 40 % (≈ 200 ms) |
| Decay | 30 % (≈ 300 ms) |
| EG Loop | **ON** |
| Step gate | **MAX** (essential — see Gotchas) |
{: .dada-minimal-table }

### `Bass` — Round Bass

| Knob | Value |
|:-----|:------|
| Shape | **2** (Saw↔Square) |
| Timbre | 20 % |
| Color | 50 % |
| Warp | 0 |
| Tim EG | 20 % |
| Col EG | 30 % |
| Attack | 0 % |
| Decay | 35 % (≈ 400 ms) |
{: .dada-minimal-table }

### Chromatic → Gamelan

A Scale demo. Programme a chromatic step pattern (C, C#, D, D#, E, F, F#, G, G#, A, A#, B) then sweep **Scale**:

| Scale value | Effect |
|:------------|:-------|
| **0 Off** | All 12 notes pass unchanged |
| **15 Gamelan** | Snaps to the 5-note Gamelan scale — pattern "flattens" into Gamelan character |
| **11 Pent.Mj** | Snaps to pentatonic major — friendlier than Gamelan |
| **24 Bhairav** | Indian raga — characterful flats / sharps |

### Noise Percussion

For one-shot perc layers:

| Knob | Value |
|:-----|:------|
| Shape | **29** (Clocked Noise) or **36+** (percussion family) |
| Timbre | 60 % |
| Color | 50 % |
| Attack | 0 % |
| Decay | 15 % (≈ 100 ms) |
| SR Red | 30 % (extra grit) |
{: .dada-minimal-table }

{: .tip }
> **Performance tip**: lock per-step **Timbre** or **Color** values via *Parameter Lock* on the step buttons. Shape + lock turns one monosynth into 16 different sounds in a bar.

---

## See also

- [Acid Bass (TBD-03)](acid-bass) — same oscillator in a 303-style chassis.
- [Wavetable Osc](wavetable-osc) — dedicated wavetable voice.
- [PolyPad](polypad) — 24-voice polyphonic companion.

<div class="origin-card" markdown="1">

## Origin & credits

Built on Mutable Instruments **Braids** `MacroOscillator` (Émilie Gillet, MIT-licensed). TBD-16 integration by Robert Manzke / CTAG (GPL 3.0) adds the AD envelope, modulation routing, decimation, bit-reduction and scale quantizer.

- DSP sources: `braids/macro_oscillator.h`, `braids/signature_waveshaper.h`
- TBD-16 wrapper: `rack/RackMO.hpp` / `.cpp`
- Related reading: [Mutable Instruments Braids manual](https://pichenettes.github.io/mutable-instruments-documentation/modules/braids/manual/)

</div>
