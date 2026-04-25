---
layout: default
title: Machines
nav_order: 5
parent: tbd 16 groovebox
has_children: true
has_toc: false
permalink: /tbd-16/machines/
---

# Machines

A **Machine** is a sound engine — the DSP that generates audio on a track. Each track has its own selection of Machines, each with its own parameters and factory presets.
{: .fs-6 .fw-300 }

---

## How Machines work

- Each of the 16 tracks runs **one Machine at a time**.
- Which Machines are available on a track is **hard-wired in the DSP** — this is how the **tbd 16** stays responsive on a small CPU.
- The **Rompler** (sampler) is available on every track except Track 16.
- Track 16 is the **Input** track — it routes the external audio input through the mixer and FX.
- A Machine's *preset* stores its parameter values plus the page/knob layout shown on the [Sound Parameters]({{ site.baseurl }}/tbd-16/sound-and-tracks/sound) screen.

Change the active Machine with **Shift + FUNC3** (the Sound Preset browser). The left column is the Machine / group; the right column shows the presets for that Machine.

---

## Machine reference

Click a Machine for the full profile — origin, character, parameters, and tips.

### Drum synthesis

| Machine | Character | Based on |
|:--------|:----------|:---------|
| [Synth Kick](synth-kick) | Punchy synthetic kick | Mutable Instruments Plaits `synthetic_bass_drum` |
| [Analog Bass Drum](analog-bass-drum) | Classic analog-style kick | Mutable Instruments Plaits `analog_bass_drum` |
| [FM Kick / Bass](fm-kick) | FM kick / tuned bass | CTAG `FmKick` (custom FM drum voice) |
| [Digital Snare](digital-snare) | Crisp modern snare | Mutable Instruments Plaits `synthetic_snare_drum` |
| [Analog Snare](analog-snare) | Warm analog-style snare | Mutable Instruments Plaits `analog_snare_drum` |
| [Hi-Hat 1](hi-hat-1) | 808-style hi-hat | Mutable Instruments Plaits `hi_hat` |
| [Hi-Hat 2](hi-hat-2) | Alt hi-hat preset | Mutable Instruments Plaits `hi_hat` |
| [Rimshot](rimshot) | Short percussive rim | CTAG `Rimshot` by Robert Manzke |
| [Clap](clap) | Layered analog clap | CTAG `Clap` by Robert Manzke |
{: .dada-minimal-table }

### Tonal synthesis

| Machine | Character | Based on |
|:--------|:----------|:---------|
| [TBD03](tbd03) | 303-style acid line | Braids oscillator + diode-ladder filter |
| [Mono Synth](mono-synth) | Versatile mono voice | Mutable Instruments Braids macro oscillator |
| [Wavetable Osc](wavetable-osc) | Wavetable lead / pad | Braids-based wavetable oscillator |
| [PolyPad](polypad) | 24-voice chord pad | CTAG `ChordSynth` / PolyPad |
{: .dada-minimal-table }

### Sampler & Input

| Machine | Character | Based on |
|:--------|:----------|:---------|
| [Rompler](rompler) | Sample-playback voice | CTAG `RomplerVoiceMinimal` |
| [Input](input) | External audio passthrough | Track 16 only |
{: .dada-minimal-table }

{: .note }
All Rompler tracks share **one active sample kit**. The kit is selected from the **Project menu → Select kit**. Each Rompler track picks a **bank** and **slice** inside that kit, so a single kit can drive up to 15 different sample sounds simultaneously.

---

## Machine availability per track

Which Machines each track can host. A dot (●) means the Machine is available on that track in the factory **default** track setup.

<div class="machine-matrix" markdown="1">

| Machine | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|:--------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| [Synth Kick](synth-kick)         | ● |   |   |   |   |   |   |   |   |    |    |    |    |    |    |    |
| [Analog Bass Drum](analog-bass-drum) | ● |   |   |   |   |   |   |   |   |    |    |    |    |    |    |    |
| [FM Kick / Bass](fm-kick)        |   | ● |   |   |   |   |   |   |   |    |    |    |    |    |    |    |
| [Digital Snare](digital-snare)   |   |   | ● |   |   |   |   |   |   |    |    |    |    |    |    |    |
| [Analog Snare](analog-snare)     |   |   | ● |   |   |   |   |   |   |    |    |    |    |    |    |    |
| [Hi-Hat 1](hi-hat-1)             |   |   |   | ● |   |   |   |   |   |    |    |    |    |    |    |    |
| [Hi-Hat 2](hi-hat-2)             |   |   |   | ● |   |   |   |   |   |    |    |    |    |    |    |    |
| [Rimshot](rimshot)               |   |   |   |   | ● |   |   |   |   |    |    |    |    |    |    |    |
| [Clap](clap)                     |   |   |   |   |   | ● |   |   |   |    |    |    |    |    |    |    |
| [TBD03](tbd03)                   |   |   |   |   |   |   |   |   | ● | ●  |    |    |    |    |    |    |
| [Mono Synth](mono-synth)         |   |   |   |   |   |   |   |   |   |    | ●  | ●  |    |    |    |    |
| [Wavetable Osc](wavetable-osc)   |   |   |   |   |   |   |   |   |   |    |    | ●  |    |    |    |    |
| [PolyPad](polypad)               |   |   |   |   |   |   |   |   |   |    |    |    |    |    | ●  |    |
| [Rompler](rompler)               | ● | ● | ● | ● | ● | ● | ● | ● | ● | ●  | ●  | ●  | ●  | ●  | ●  |    |
| [Input](input)                   |   |   |   |   |   |   |   |   |   |    |    |    |    |    |    | ●  |
{: .dada-matrix-table }

</div>

Track 16 is always the audio input — it cannot host a synth or sampler.

{: .tip }
If you want a mostly-sample-based kit, load the **sampler** track setup from the **Project menu → Change track setup** (see [Project Menu]({{ site.baseurl }}/tbd-16/project-and-settings/project) → *Change Track Setup*). It swaps most synth tracks to Rompler.

---

## See also

- [Macros & Presets]({{ site.baseurl }}/tbd-16/sound-and-tracks/macros-and-presets) — the three-layer model that turns a Machine into a playable instrument; also the Sound Preset browser reference.
- [Sound Parameters]({{ site.baseurl }}/tbd-16/sound-and-tracks/sound) — how to edit a Machine's parameters on screen.
- [Project Menu]({{ site.baseurl }}/tbd-16/project-and-settings/project) — *Select kit* and *Change track setup* for Rompler kits and machine assignments.

<div class="origin-card" markdown="1">

## Credits & source

The **tbd 16**'s sound engines are the result of open-source work from several communities. On-device Machines are drawn from:

- **CTAG TBD** by **Robert Manzke** (Creative Technologies Arbeitsgruppe, FH Kiel) — the Rompler, Clap, Rimshot, PolyPad, FM Kick and the TBD03 acid-bass voice. Licensed under GPL 3.0. See the [CTAG TBD project](https://github.com/ctag-fh-kiel/ctag-tbd).
- **Mutable Instruments** open-source DSP — *Plaits* drum models power the Synth Kick, Analog Bass Drum, Digital/Analog Snare and the Hi-Hats; *Braids* provides the macro oscillator used by Mono Synth, Wavetable Osc and the TBD03 acid bass. Originally released by Émilie Gillet, MIT-licensed.
- **TBD-16 integration layer** (`rack/*`, macro/preset system) by **Per-Olov Jernberg** (possan), LGPL 3.0.

Every `Rack*` file in the TBD-16 source lists the upstream header it wraps, so the exact lineage for every Machine is traceable in code.

</div>
