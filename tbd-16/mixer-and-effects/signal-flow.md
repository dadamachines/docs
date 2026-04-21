---
layout: default
title: Signal Flow
nav_order: 0
parent: Mixer & Effects
grand_parent: tbd 16 groovebox
---

# Signal Flow

How audio signals route through the **tbd 16** from tracks to output.
{: .fs-6 .fw-300 }

---

## Overview

The **tbd 16** uses a **send/return effects architecture** with per-track mixer parameters, group-level offsets, two global FX buses (Delay and Reverb), a master compressor chain, and a final stereo output stage.

The sequencer handles all step data, parameter locks, and automation, sending note and CC data to the audio engine internally. The audio engine runs the synth voices, effects, and audio output.

---

## Signal Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   PER-TRACK (×16)                       │
│                                                         │
│  Sequencer Step                                         │
│       ↓                                                 │
│  Note + Velocity + P-Locks + Automation                 │
│       ↓                                                 │
│  ┌─────────────────────┐                                │
│  │   Synth Engine      │  (runs on P4)                  │
│  │   TBD03 / Wavetable │                                │
│  │   Rompler / Polypad │                                │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│  ┌─────────────────────┐                                │
│  │   Track Mixer       │                                │
│  │   Level  [0-127]    │  ← can be p-locked per step    │
│  │   Pan    [0-127]    │  ← can be p-locked per step    │
│  └────┬────┬────┬──────┘                                │
│       │    │    │                                       │
│       │    │    └─→ FX2 Send [0-127] ──→ FX2 Bus       │
│       │    └──────→ FX1 Send [0-127] ──→ FX1 Bus       │
│       ↓                                                 │
│   Dry Signal → Group Mixer                              │
└─────────────────────────────────────────────────────────┘
            ↓                      ↓              ↓
┌───────────────────────┐ ┌──────────────┐ ┌──────────────┐
│    GROUP MIXER        │ │   FX1 BUS    │ │   FX2 BUS    │
│                       │ │   (Delay)    │ │   (Reverb)   │
│  Group 0: Tr 1-2      │ │              │ │              │
│  Group 1: Tr 3-8      │ │ Time         │ │ Time         │
│  Group 2: Tr 9-11     │ │ Sync         │ │ Lowpass      │
│  Group 3: Tr 12-15    │ │ Freeze       │ │ Level ──────┐│
│                       │ │ Stereo Width │ │             ││
│  Each group applies:  │ │ Feedback     │ └──────┬──────┘│
│  • Volume offset      │ │ FX2 Send ────────→   │       │
│  • Pan offset         │ │ Level ──────┐│        │       │
│  • FX1/FX2 offsets    │ └──────┬──────┘│        │       │
└───────────┬───────────┘        │       │        │       │
            ↓                    ↓       ↓        ↓       │
┌─────────────────────────────────────────────────────────┐
│                     MASTER CHAIN                        │
│                                                         │
│  Dry Mix + FX1 Return + FX2 Return                      │
│       ↓                                                 │
│  ┌─────────────────────┐                                │
│  │   Compressor        │                                │
│  │   Threshold/Ratio   │                                │
│  │   Attack/Release    │                                │
│  │   LPF / Gain / Mix  │                                │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│  ┌─────────────────────┐                                │
│  │   Master Output     │                                │
│  │   Delay Level adj.  │                                │
│  │   Reverb Level adj. │                                │
│  │   Mute  [on/off]    │  ← Global Sound Knob 4 click  │
│  │   Level [0-127]     │  ← Global Sound Knob 4 turn   │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│       STEREO OUTPUT                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Track Level

Each of the 16 tracks has its own synth engine running on the P4 and four mixer parameters controlled by the Pico sequencer:

| Parameter | Range | Default | Description |
|:----------|:------|:--------|:------------|
| Level | 0–127 | 64 | Track output volume |
| Pan | 0–127 | 64 (center) | Stereo position |
| FX1 Send | 0–127 | 0 | Send level to Delay |
| FX2 Send | 0–127 | 0 | Send level to Reverb |
{: .dada-minimal-table }

All four mixer parameters can be **parameter-locked per step**, allowing rhythmic volume changes, panning automation, and per-step FX send variations.

Edit these on the [Track Mixer](track-mixer) screen or the individual track pages of the [Mixer](mixer) screen.

## Track Groups

Tracks are organized into 4 groups, each with level/pan/FX offset controls accessible on the [Mixer](mixer) screen's group page:

| Group | Tracks | Default Assignment |
|:------|:-------|:-------------------|
| Group 0 | 1–2 | Kicks |
| Group 1 | 3–8 | Percussion / Rompler |
| Group 2 | 9–11 | Synths |
| Group 3 | 12–15 | Wavetable / Poly |
{: .dada-minimal-table }

Group offsets are applied **on top of** individual track mixer values. Each group has: Volume Delta, Pan Delta, FX1 Delta, FX2 Delta, and Filter Delta.

## FX Buses

### FX1 — Delay

3 pages of parameters (12 total). Key parameters:

- **Time** — delay time
- **Sync** — tempo sync mode
- **Freeze** — freeze buffer
- **Stereo Width** — stereo spread
- **Feedback** — delay feedback amount
- **FX2 Send** — sends delay output into the reverb (FX chain cascade)
- **Level** — FX1 output level (also accessible as **Knob 2** on Global Sound)

### FX2 — Reverb

1 page of parameters (3 total):

- **Time** — reverb decay time
- **Lowpass** — reverb tone/damping
- **Level** — FX2 output level (also accessible as **Knob 3** on Global Sound)

FX2 receives signal from both individual track sends **and** from FX1's FX2 Send parameter, enabling delay-into-reverb chaining.

## Master Chain

The master chain processes the combined stereo mix (dry + FX returns):

**Compressor** (2 pages):
- Threshold, Ratio, Attack, Release
- LPF (sidechain filter), Gain (makeup), Mix (dry/wet)

**Master Output** (1 page):
- Delay Level — post-master delay return trim
- Reverb Level — post-master reverb return trim
- Mute — master mute toggle
- Level — final output level

## Global Sound Quick Access

The [Global Sound](global-sound) screen provides one-knob access to the four most important mix parameters:

| Knob | Controls | Source |
|:-----|:---------|:-------|
| Knob 1 | Input Level | Track 16 mixer level |
| Knob 2 | Delay Level | FX1 param 10 (output level) |
| Knob 3 | Reverb Level | FX2 param 14 (output level) |
| Knob 4 | Master Level | Master param 13 (click = mute toggle) |
{: .dada-minimal-table }

## Where Parameter Locks Apply

Parameter locks (p-locks) and automation inject at the track level, **before** the signal reaches the mixer and effects:

- **Audio parameter p-locks** — modify synth engine parameters per step (up to 24 parameters)
- **Mixer parameter p-locks** — modify track level, pan, and FX sends per step (up to 8 parameters)
- **LFO/Random automation** — continuous modulation applied per step, combined with p-lock values

The evaluation priority is: `P-Lock value (or track default) + Automation value + MIDI map value`, clamped to the parameter range.

## MIDI Signal Flow

The Pico sequencer generates MIDI data that routes to both the internal P4 synth engines and external MIDI ports:

```
Sequencer → Note/CC data
    ├──→ P4 (internal synth engines via SPI)
    ├──→ TRS MIDI 1 Out
    ├──→ TRS MIDI 2 Out
    ├──→ USB Host MIDI Out
    └──→ USB Device MIDI Out
```

Each output port can be independently configured as **None**, **Sync**, **Notes**, or **Sync+Notes** via [MIDI Settings](../project-and-settings/midi-settings).

External MIDI input follows the reverse path, with received notes and clock routed to the sequencer.
