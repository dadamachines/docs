---
layout: default
title: TBDaits
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 16
---

# TBDaits

A 24-engine macro-oscillator voice spanning virtual analog, FM (incl. **DX7-style 6-operator** synthesis with 3 banks of 32 patches), additive, wavetable, chord, speech, granular, particle / string / modal physical models, and analog drum models — driven by a wrapper-side AHR envelope so held keys sustain and release on key-up.
{: .fs-6 .fw-300 }

**Available on:** Track 12 (Lead2) — selectable alongside Wavetable Osc (default boot host), Mono Synth and TBDings.  
**Built on:** **Mutable Instruments Plaits** firmware 1.2 (extended 24-engine registry — orange / green / red banks).

---

## Character

TBDaits exposes the full Plaits-1.2 engine set in a single voice. The Model knob picks one of 24 engines; Harm / Timbre / Morph then mean different things per engine (chord type, bank selection, FM index, formant ratio, decay time, …) — the OLED reflects the active engine's parameter semantics where they're discrete.

The **DX7 engine has 3 instances** (banks A / B / C, 32 patches each = 96 total) — sweep Harm to browse patches; the OLED shows `A17` / `B5` / `C30` so you know exactly where you are.

A wrapper-side AHR envelope (Attack / Hold / Release) drives the Plaits LPG so:
- **Held keys sustain** for as long as you hold them (real keyboard feel)
- **Decay knob** shapes the release tail per key-up across 5 ms .. 8 s (drone mode at the very top of the knob)
- **Velocity** scales both amplitude AND DX7 patch-internal timbre routing
- **Sequencer steps** still re-attack crisply on every trigger

---

## Engines (Model knob)

24 engines, registry order. DX7A/B/C are highlighted as the headline FM voicings.

| # | Label | Engine | # | Label | Engine |
|---:|:--:|---|---:|:--:|---|
| 0 | East | Virtual Analog VCF | 12 | Add  | Additive |
| 1 | PhDi | Phase Distortion | 13 | Wtbl | Wavetable |
| **2** | **DX7A** | **Six-Op DX7 — bank A** | 14 | Chrd | Chord |
| **3** | **DX7B** | **Six-Op DX7 — bank B** | 15 | Spch | Speech |
| **4** | **DX7C** | **Six-Op DX7 — bank C** | 16 | Swrm | Swarm / Granular Cloud |
| 5 | Trrn | Wave Terrain | 17 | Nois | Filtered Noise |
| 6 | SChr | Strings Chorus | 18 | Part | Particle Noise |
| 7 | Chip | Chiptune (Square Chords) | 19 | Strg | Inharmonic String |
| 8 | Dtun | Dual Detune (Virtual Analog) | 20 | Modl | Modal Resonator |
| 9 | Wshp | Waveshaping | 21 | BD   | Bass Drum |
| 10 | FM2  | FM (2-op) | 22 | SD   | Snare |
| 11 | Frmt | Granular Formant | 23 | HH   | Hi-Hat |

---

## Parameters

The default TBDaits performance macro is organised as **3 pages**, ordered for live performance: voicing controls on page 1, envelope-driven dramatic controls on page 2, supportive output settings on page 3.

### Voice

The 4 main timbral controls. Model + Harm are adjacent because Harm's display is engine-aware.

| Parameter | What it does |
|:----------|:-------------|
| **Model** | Engine selector (24 engines — see table above) |
| **Harm** | Engine-dependent. DX7 → patch number (A1..A32 / B1..B32 / C1..C32). Wtbl → bank (A..A-, 8 banks). Chrd → chord type (oct / 5 / sus4 / m / m7 / m9 / m11 / 69 / M9 / M7 / M). All other engines → continuous tone control (% display). |
| **Timbre** | Engine-dependent continuous tone control (e.g. wavefolder amount, formant frequency, mod index, brightness, …) |
| **Morph** | Engine-dependent continuous tone control (e.g. asymmetry, feedback, decay time, filter type, …) |
{: .dada-minimal-table }

### Env

Envelope-driven dramatic controls — the drop / build knobs. All four fed by Plaits' internal envelope.

| Parameter | What it does |
|:----------|:-------------|
| **Decay** | LPG release time (5 ms .. 8 s exponential; drone mode at the very top of the knob holds the envelope indefinitely) |
| **FMod** | Envelope → frequency modulation depth |
| **TMod** | Envelope → timbre modulation depth |
| **MMod** | Envelope → morph modulation depth |
{: .dada-minimal-table }

### Shape

Supportive output settings — set per voice and rarely touched live.

| Parameter | What it does |
|:----------|:-------------|
| **Level** | Voice output gain |
| **Color** | LPG character: VCF (filter sweep) / Mix (blend) / VCA (amplitude only) |
| **Freq** | Pitch detune (±12 semitones) around the played MIDI note |
{: .dada-minimal-table }

---

{: .tip }
> Browse the **96 DX7 patches** by selecting Model = DX7A / DX7B / DX7C and sweeping the Harm knob. The OLED reads `A17`, `B5`, `C30` etc. Lock Harm per step in the sequencer to step through DX7 patches across a pattern.

{: .tip }
> Crank **Decay** to the very top for **drone mode** — the envelope never releases, holding the LPG open indefinitely. Combine with the Noise / Speech / Modal engines for textures that sustain past key-up.

{: .tip }
> Use **FMod / TMod / MMod** for performance drama — automate or hand-sweep these for build-ups and drops. Each scales how much Plaits' internal envelope modulates the corresponding voicing parameter.

---

## Playing TBDaits

**With the sequencer**: per-step velocity is honored on every trigger (re-attack snaps the envelope to the new velocity). Lock Harm per-step to browse DX7 patches inside a pattern. Lock Model per-step for radical engine switches mid-bar.

**With an external keyboard**: held keys sustain for as long as you hold them. Velocity drives both amplitude (via wrapper master gain) and DX7 patch-internal timbre routing (via accent). Decay shapes the release tail on key-up.

---

## See also

- [Mono Synth](mono-synth) — single-engine Braids-based monophonic alternative.
- [PolyPad](polypad) — chord-pad voice with built-in chord generator.
- [TBD03](tbd03) — 303-style mono bass.

<div class="origin-card" markdown="1">

## Origin & credits

TBDaits wraps the **Mutable Instruments Plaits firmware 1.2** voice (extended 24-engine registry) for the TBD-16 PicoSeqRack plugin host.

Plaits is © 2018-2021 Émilie Gillet, MIT-licensed (see `plaits/LICENSE`). Firmware 1.2 adds 8 "orange-bank" engines (Virtual Analog VCF, Phase Distortion, Six-Op DX7 ×3, Wave Terrain, Strings Chorus, Chiptune) on top of Plaits' original 16-engine palette.

The wrapper around Plaits adds:
- A wrapper-side AHR envelope so held keys sustain and release on key-up (Plaits hardware default behaviour assumes an external CV envelope on the LEVEL input)
- Per-engine semantic OLED rendering for HARMONICS (DX7 patch number, Wavetable bank letter, Chord name)
- A silence gate so drone-style engines (Noise / Speech / Modal at high decay) don't hum continuously when no notes are playing
- Per-instance LCG and PSRAM placement-new for the Voice + 16 KB allocator workspace

- DSP source: `plaits/dsp/voice.{h,cc}` and the `plaits/dsp/engine{,2}/*.{h,cc}` engines
- TBD-16 wrapper: `rack/RackTBDaits.{hpp,cpp}` (PicoSeqRack)
- Related reading: [Plaits manual](https://pichenettes.github.io/mutable-instruments-documentation/modules/plaits/manual/)

</div>
