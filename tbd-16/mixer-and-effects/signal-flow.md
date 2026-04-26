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

The **tbd 16** uses a **send/return effects architecture** with per-track mixer parameters, group-level offsets, two global FX buses (FX1 Delay, FX2 Reverb), a master sum-bus chain (compressor → drive → volume), and a final stereo output stage with always-on soft-clip safety.

The sequencer handles all step data, parameter locks, and automation, sending note and CC data to the audio engine internally. The audio engine runs the synth voices, effects, and audio output.

The three bus targets — **FX1**, **FX2**, and **Master** — appear in the track ring at positions **17**, **18**, and **19**. Reach them via the Mixer Select Overlay (hold `FUNC4`) or the left-arrow chain from Track 01.

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
│  │  Compressor (sees   │   Page 2/3 of Master           │
│  │  dry mix only — FX  │   Threshold / Ratio / Atk/Rel  │
│  │  returns skip the   │   MakeUp / Mix / SC-LPF        │
│  │  side-chain)        │                                │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│  ┌─────────────────────┐                                │
│  │   Drive             │   Page 4 — soft saturation     │
│  │   off..heavy        │   bypassed at default (off)    │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│  ┌─────────────────────┐                                │
│  │   Master Output     │   Page 1 — OUTPUT              │
│  │   Volume (fader)    │   off / 0dB unity / +12dB      │
│  │   Mute  [on/off]    │   ← Global Sound Knob 4 click  │
│  │   Delay return      │   FX1 return level             │
│  │   Reverb return     │   FX2 return level             │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│  ┌─────────────────────┐                                │
│  │  Output soft-clip   │   stmlib::SoftClip — ALWAYS ON │
│  │  (per-channel)      │   Hard ceiling at ±1.0;        │
│  │                     │   transparent at safe levels.  │
│  └─────────┬───────────┘                                │
│            ↓                                            │
│       STEREO OUTPUT  (TI AIC32X4 codec)                 │
└─────────────────────────────────────────────────────────┘
```

---

## Track Level

Each of the 16 tracks has its own synth engine running on the P4 and four mixer parameters controlled by the Pico sequencer:

| Parameter | Range | Default | Description |
|:----------|:------|:--------|:------------|
| Level | fader (off / 0 dB / +12 dB) | 64 = unity | Track output volume — squared curve, wire 0 is silence, wire 64 is unity gain, wire 127 is +12 dB |
| Pan | 0–127 | 64 (center) | Stereo position |
| FX1 Send | 0–127 | 0 | Send level to FX1 (Delay) |
| FX2 Send | 0–127 | 0 | Send level to FX2 (Reverb) |
{: .dada-minimal-table }

The OLED renders `Level` as an honest dB readout — `off` at wire 0, `-…dB` below unity, `0dB` at wire 64, and up to `+12dB` at wire 127. The same fader curve is used by **FX returns** and **Master Volume**, so gain language is consistent everywhere on the device.

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

The master chain processes the combined stereo mix (dry + FX returns) across four pages on the [Master](master) screen. The order in the DSP is:

1. **Sum bus** — all 16 tracks plus FX1 + FX2 returns mixed.
2. **Compressor** (Pages `COMPRESSOR A` + `COMPRESSOR B`) — sees the *dry* mix only; FX returns skip its side-chain so reverb/delay tails don't duck. Threshold, Ratio, Attack, Release on Page 2; MakeUp, Mix, SC-LPF on Page 3.
3. **Drive** (Page `DRIVE`) — analog-style soft saturation. Bypassed at default (knob = `off`); pushes into musical clipping when raised.
4. **Master Volume** (Page `OUTPUT` Knob 1) — same squared fader curve as track levels. Wire 0 = silence, wire 64 (boot default) = unity, wire 127 = +12 dB.
5. **Always-on output soft-clip** — `stmlib::SoftClip` per channel, transparent at safe levels, hard ceiling at ±1.0. This is the safety guarantee: no matter what you do upstream, the codec never sees a digital clip.

Page `OUTPUT` (Page 1, the landing page) groups the four live-performance controls — Volume, Mute, Delay return, Reverb return — so live tweaks never need a page change.

## Clip metering — visible from anywhere

Two visual sources surface the master output level so you don't have to leave whichever screen you're on to spot trouble:

- **OLED header peak bar** — visible on every page, between the BPM display and the `Stp / Rec / Ply` indicator. Fills left-to-right with the master peak. Solid (latched) flash = soft-clip is engaging. Latches ~½ second per over-peak so brief transients don't get missed.
- **FUNC1 / FUNC2 LEDs (multi-zone)** — the front-panel `FUNC` LEDs colour-code the post-soft-clip output level: dim green (safe, < −10 dBFS), bright green (healthy, −10..−5), yellow (caution, −5..−2), orange (ceiling, −2..−1), red (at clip, −1..0). A magenta latch flashes briefly when the soft-clipper actually engages. See [Display Settings](../project-and-settings/display-settings) for the colour key reference.

## Global Sound Quick Access

The [Global Sound](global-sound) screen provides one-knob access to the four most important mix parameters:

| Knob | Controls | Source |
|:-----|:---------|:-------|
| Knob 1 | Input Level | Track 16 mixer level (squared fader, off / 0 dB / +12 dB) |
| Knob 2 | Delay Level | FX1 return level (same squared fader) |
| Knob 3 | Reverb Level | FX2 return level (same squared fader) |
| Knob 4 | Master Level | Master Volume (same squared fader); click toggles master mute |
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
