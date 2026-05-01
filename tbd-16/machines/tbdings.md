---
layout: default
title: TBDings
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 17
---

# TBDings

A modal / string-resonator voice covering plucked strings, struck modal bars, sympathetic strings (with chord quantization) and FM-bell timbres — wrapped with a wavefolder, a 5-shape envelope, three modulation modes (tremolo · pitch-envelope AM · polyphonic AM with optional harmonic snap) and a continuous AIR excitation source for steel-pan / wind-chime drone work.
{: .fs-6 .fw-300 }

**Available on:** Track 12 (Lead2) and Track 15 (Chordo) — selectable on both, alongside the track defaults (Wavetable Osc on Lead2, PolyPad on Chordo). Each instance is independently allocated — you can host TBDings twice for layered resonators.  
**Built on:** **Mutable Instruments Rings** (modal resonator + sympathetic-string synthesis).

---

## Character

Rings is a physical-modelling resonator — strike it with a pluck or excite it with continuous noise (AIR), and the model rings out per the resonator's material, structure and damping. Each Rings model brings a different timbre family: modal bars, string clusters, FM bells, sympathetically-resonating string sets.

The TBD-16 wrapper adds a **post-Rings wavefolder** for harmonic grit (velocity-driven), three **modulation modes** for tremolo / AM / polyphonic-AM drama, a **5-shape envelope morph** for plucked-vs-sustained character, and a global **AIR** master that fans across both TBDings slots — turn AIR up and the resonator hums at the played pitch continuously, even between notes.

---

## Models

The Model knob picks one of 6 Rings resonator engines. The Easter toggle (Extra page) overrides any selection with **SymQ** (sympathetic-strings quantized) — useful for one-handed switching to chord mode.

| Label | Engine | Character |
|---|---|---|
| **Modal** | Modal resonator | Bell- / bar-like modal voice; the most "tuned" character |
| **Symp** | Sympathetic strings | Multi-string cluster; chord knob silent here |
| **Strg** | Inharmonic string (Karplus) | Plucked-string with inharmonicity |
| **FM** | FM-voice | Bell / metallic FM timbres |
| **SymQ** | Sympathetic strings, quantized | Chord-aware sympathetic strings — Chord knob picks the chord type |
| **S+Rv** | String + reverb | Plucked string with internal reverb tail |

---

## Parameters

The default TBDings performance macro is organised as **5 pages**, ordered for live performance: voicing controls on page 1, envelope-driven dramatic controls on page 2, supportive controls on later pages. Mirrors the TBDaits layout convention (Voice / Mod / … with Model + engine-aware knob on page 1).

### Voice

The 4 main voicing controls. Model + Chord are adjacent because Chord's display is engine-aware (only audible when Model = SymQ or Easter is on).

| Parameter | What it does |
|:----------|:-------------|
| **Model** | Engine selector (6 models — see table above) |
| **Chord** | Chord type. **Display reads "off" unless Model = SymQ (or Easter on)** — the knob is musically inert in the other 5 models, so the OLED tells the truth. Encoder still turns (you can pre-set the chord for when you switch into a chord-aware mode). 11 chord types: oct, 5, sus4, m, m7, m9, m11, 69, M9, M7, M |
| **Bright** | Excitation brightness — opens / closes the resonator's tonal centre |
| **Damp** | Resonator damping — short pluck (CCW) vs sustained ring (CW). The natural decay-time control |
{: .dada-minimal-table }

### Mod

Output-stage modulation drama controls (tremolo / AM with three modes, plus optional harmonic-snap quantizer) — one click from the Voice page for performance build/drops.

| Parameter | What it does |
|:----------|:-------------|
| **MDpth** | Modulation depth — the universal "drama" knob for build-ups and drops |
| **MRate** | Modulation rate (mode-dependent: tremolo Hz, pitch-env decay speed, AM ratio) |
| **MType** | Modulation mode: **Trem** (sine tremolo), **PEnv** (per-strum pitch envelope down from 2× note frequency), **Poly** (pitch-relative AM) |
| **MSnap** | Harmonic-snap quantizer for Poly mode. When **MType = Poly**, snaps the AM frequency to harmonic ratios of the played note (0.5×, 1×, 2×, 3×, 4×, 5×, 6×, 8×). **Display reads "off" when MType ≠ Poly** — the toggle is musically inert in Trem and PEnv modes, so the OLED tells the truth. Encoder still works (you can pre-set the snap value before switching to Poly) |
{: .dada-minimal-table }

{: .note }
> **Two engine-aware knobs that say "off" when inert.** TBDings has two controls that the underlying DSP only consults in specific modes:
> - **Chord** — only audible when **Model = SymQ** (or Easter on). Reads "off" in the other 5 models.
> - **MSnap** — only meaningful when **MType = Poly**. Reads "off" in Trem and PEnv modes.
>
> In both cases the encoder still turns (so you can pre-set the value for when you switch into the active mode) — only the visible readout reflects the current functional state. This honest-display pattern means you never wonder "is this knob broken?" — the OLED tells you whenever the knob is currently doing nothing.

### Excite

Excitation source + envelope shape — controls how the resonator is driven.

| Parameter | What it does |
|:----------|:-------------|
| **Air** | Continuous noise excitation amount. AIR turns the resonator into a hummed drone at the played pitch — try this for steel-pan or wind-chime textures. The global AIR master CC (channel 13 / CC 67) fans across all enabled TBDings instances |
| **Pluck** | Pluck CC trigger (rising-edge). Strums the resonator without re-attacking the envelope — useful for repeated plucks at the same envelope state |
| **VelAmt** | Velocity → wavefolder drive amount. Higher velocity = harder fold = richer harmonics |
| **EnvSh** | Envelope shape morph — interpolates between 5 named shapes: **Plck** (fastest pluck) → **Soft** (slower decay) → **Snap** (sustained snap) → **Bow** (slow bow) → **Pad** (slowest attack/release) |
{: .dada-minimal-table }

### Reson

Secondary resonator controls — pitch detune, structural character, polyphony.

| Parameter | What it does |
|:----------|:-------------|
| **Freq** | Pitch detune (±12 semitones / 1 octave around the played MIDI note). Hi-res NRPM knob — sub-cent precision at center, octave at extremes |
| **Struct** | Resonator structure parameter (per-model: inharmonicity, modal coupling, string interval, etc.) |
| **Pos** | Excitation position along the resonator — closer to the centre = darker harmonics; off-centre = richer overtone mix |
| **Poly** | Internal polyphony: 1v / 2v / 4v. Higher polyphony = more overlap between strums |
{: .dada-minimal-table }

### Extra

| Parameter | What it does |
|:----------|:-------------|
| **Easter** | Engine override — flips the active model to SymQ regardless of the Model knob setting. Use it for one-handed chord-mode switching without losing your Model selection. When Easter is on, the Chord knob's display switches from "off" to live chord names automatically |
{: .dada-minimal-table }

---

## Global AIR master

Track 13's CC 67 acts as a **TBDings AIR master**: the value fans out to every enabled TBDings instance's Air parameter, letting you crossfade between "all dry" and "all hummed drone" with a single CC. Useful in performance for one-handed AIR control across both TBDings slots simultaneously.

---

{: .tip }
> Set Model = **SymQ** (or flip Easter on), pick a chord with the Chord knob (now 11 snappy detents), and play a single MIDI root note — TBDings voices the full chord on the resonator. Lock Chord per step in the sequencer to step through chord progressions on a held root.

{: .tip }
> Crank **Air** for drone work — the resonator hums continuously at the played pitch even between sequencer steps. Combine with Damp at the top of its range for sustained pad textures.

{: .tip }
> Use **MType = PEnv** with high **MDpth** for a per-strum pitch-down "talking" effect — each note attacks from above the played pitch and falls toward it. Great for melodic bass plucks.

---

## Playing TBDings

**With the sequencer**: per-step velocity drives the wavefolder via VelAmt, so harder steps sound brighter / crunchier. Lock Chord per step (in SymQ mode) to step through chord changes on a sustained root note. Lock MType for drama drops (kick into Poly AM with MSnap on for sudden timbre shifts).

**With an external keyboard**: each note re-strums the resonator. Held keys sustain via the resonator's natural decay (Damp knob controls the decay time). The Pluck CC can re-strum without re-triggering the envelope — useful for staccato pluck patterns over a single held envelope state.

**Two TBDings slots**: Track 12 hosts TBDings as the boot default; Track 15 can also host TBDings (selectable from the Setup screen). Each instance has its own preset, params and AIR value — but the global AIR master CC fans across both, letting you crossfade them together.

---

## See also

- [TBDaits](tbdaits) — 24-engine Plaits-extended voice (DX7 / Wave Terrain / String Machine and more).
- [Mono Synth](mono-synth) — single-engine Braids-based monophonic alternative.
- [PolyPad](polypad) — chord-pad voice with built-in chord generator.

<div class="origin-card" markdown="1">

## Origin & credits

TBDings wraps the **Mutable Instruments Rings** modal-resonator DSP for the TBD-16 PicoSeqRack plugin host.

Rings is © 2015 Émilie Gillet, MIT-licensed. The DSP provides 6 resonator models (Modal, Sympathetic Strings, Inharmonic String, FM Voice, Sympathetic-Strings-Quantized, String + Reverb) plus an internal strummer for note-onset detection.

The TBD-16 wrapper adds:
- A **5-shape envelope morph** + velocity-routed **wavefolder** for harmonic grit
- Three **modulation modes** (Tremolo / Pitch-Envelope AM / Polyphonic AM with optional harmonic snap)
- A **continuous AIR excitation** source so the resonator can hum at note pitch between strums
- A **global AIR master** CC fanning across all TBDings instances for performance-grade single-knob drone control
- An **Easter toggle** for one-handed switching to chord-aware SymQ mode
- PSRAM placement-new for `rings::Part` + `rings::Strummer` so the wrapper doesn't blow the PicoSeqRack object size budget

The wrapper's design draws from the Korg phase8-style "single-strum acoustic synthesis" idiom — the project codename internally is "FaseAcht."

- DSP source: `rings/dsp/part.{h,cc}` and `rings/dsp/strummer.{h,cc}`
- TBD-16 wrapper: `rack/RackTBDings.{hpp,cpp}` (PicoSeqRack)
- Related reading: [Rings module manual (Mutable Instruments)](https://pichenettes.github.io/mutable-instruments-documentation/modules/rings/manual/)

</div>
