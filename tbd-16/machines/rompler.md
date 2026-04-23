---
layout: default
title: Rompler
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 14
---

# Rompler

Sample-playback engine for drum kits, one-shots and sliced loops. Any Rompler-hosting track picks a **bank** and **slice** inside the currently active sample kit and plays it back with its own filter, envelope, pitch, and optional looping.
{: .fs-6 .fw-300 }

**Available on:** Any track 1–15. Factory default setup puts Romplers on **Track 7, 8, 13, 14** (shared kit).
**Built on:** CTAG `RomplerVoiceMinimal` by Robert Manzke — filter, envelope, pitch, slice playback, and ping-pong loops.

---

## Character

A sample-playback voice with an independent filter and AD envelope per track. The Rompler tracks share **one active sample kit** from the SD card — each track plays a different slice out of that kit. Load or change the kit from the **Project menu → Select kit**.

{: .warning }
> **Gotchas before you tweak:**
> - **BitCr** (bit-reduction knob): knob is visible but produces no audible crushing. Downstream DSP/mixer/codec path recovers the dropped bits — same issue as MonoSynth's *Bit Red*. Flagged for the DSP owners.
> - **Speed** and **Timestretch** (`playbackSpeed`, `tsmode`, `tsamt`): intentionally not exposed in the current macros. `playbackSpeed` was dead DSP (the rack wrapper never wrote the user value); `tsmode`/`tsamt` need their own UX design and will return under a focused "Timestretch Rompler" macro when the DSP is ready.

---

## Parameters

Two macros ship for the Rompler — pick the one that matches how you want to perform:

- **`ro-basic`** — 8-knob minimum surface across two pages. The default. Use for quick drum / one-shot use.
- **`ro-full`** — 15-knob complete access across four pages. Use for deep sound design with the filter, envelope and loop modes exposed.

Both macros share an **identical Page 1 (SAMPLE) and Page 2 (TONE) layout** so swapping between them leaves the first eight knobs untouched.

### `ro-basic` — two-page minimal layout

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **SAMPLE** | Bank | Slice | Start | End |
| **TONE**   | Pitch | Decay | Cutoff | Reso |
{: .dada-minimal-table }

### `ro-full` — four-page complete layout

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **SAMPLE** | Bank | Slice | Start | End |
| **TONE**   | Pitch | Decay | Cutoff | Reso |
| **SHAPE**  | Attack | FType | BitCr | EG2FM |
| **LOOP**   | Loop | PPong | PPSta | — |
{: .dada-minimal-table }

### What each knob does

| Knob | What it does |
|:-----|:-------------|
| **Bank**   | Which 32-slice bank within the loaded sample kit. Rompler DSP supports up to 32 banks. |
| **Slice**  | Which slice (0–31) within the active bank. |
| **Start**  | Playback start position within the slice (0–100 % of slice length). |
| **End**    | Playback end position within the slice. Set to 127 for full-length, lower values for chopped playback. |
| **Pitch**  | Pitch offset from the incoming MIDI note. 64 = no transpose; higher = up, lower = down (±5 octaves). |
| **Decay**  | AD envelope decay time. Exponential curve: short values for drum-like decays, high for long-sustaining samples. |
| **Cutoff** | SVF filter cutoff frequency. Logarithmic curve — filter opens smoothly toward high frequencies. |
| **Reso**   | SVF filter resonance. |
| **Attack** | AD envelope attack time. Tiny for percussive transients, high for pad-like fades-in. |
| **FType**  | Filter mode: OFF / LP / BP / HP. |
| **BitCr**  | *(Visible but currently inaudible — see Gotchas.)* Intended bit-reduction amount. |
| **EG2FM**  | Envelope-to-pitch modulation amount, bipolar around centre (wire 64 = 0 modulation). |
| **Loop**   | Loop the sample indefinitely (toggle). |
| **PPong**  | Ping-pong loop mode (forward-then-reverse). Only effective when Loop is on. |
| **PPSta**  | Ping-pong start offset — where the loop returns to on each bounce. |
{: .dada-minimal-table }

{: .tip }
> All Rompler tracks share one kit, so reloading a kit swaps every Rompler track's pool of samples at once. Think of the kit as the "drum machine" and each Rompler track as a dedicated pad inside it.

---

## See also

- [Change Track Setup]({{ site.baseurl }}/tbd-16/sound-and-tracks/change-track-setup) — loading and changing sample kits.
- [Project & Settings]({{ site.baseurl }}/tbd-16/project-and-settings/project) — how kits are stored and swapped on the SD card.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG sample-playback voice (`synthesis/RomplerVoiceMinimal.hpp` / `.cpp`) by Robert Manzke (2020, GPL 3.0). Uses Mutable Instruments pitch-shifting helpers (`mifx/pitch_shifter_mono.h`, MIT) and `stmlib` filters.

- DSP sources: `synthesis/RomplerVoiceMinimal.hpp` / `.cpp`, `mifx/pitch_shifter_mono.h`, `helpers/ctagSampleRom.hpp`
- TBD-16 wrapper: `rack/RackRompler.hpp` / `.cpp`

</div>
