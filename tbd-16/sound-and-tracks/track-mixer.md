---
layout: default
title: Track Mixer
nav_order: 4
parent: Sound & Tracks
grand_parent: tbd 16 groovebox
---

# Track Mixer

The Track Mixer screen shows the active track's mixer parameters: level, pan, and FX sends. Access it by pressing `FUNC3` twice from the Sound screen.

![Track Mixer — level, pan, and FX sends](../../../images/tbd-16/track_mixer.png){: .screenshot }

## Navigation

- `FUNC3` — cycle to Track Mixer (Sound → **Track Mixer** → Track)
- **Knobs 1–4** — adjust the mixer parameters
- **←/→** — switch active track

## Parameters

The Track Mixer displays the per-track mixer parameters defined by the preset (typically 4):

| Knob | Typical Parameter | Description |
|:-----|:------------------|:------------|
| Knob 1 | Level | Track output volume |
| Knob 2 | Pan | Stereo position |
| Knob 3 | FX1 Send | Amount sent to FX1 bus |
| Knob 4 | FX2 Send | Amount sent to FX2 bus |
{: .dada-minimal-table }

{: .note }
The exact parameter names and count come from the loaded preset. The shortnames shown on screen are defined by the preset data.

## Parameter Display

Each parameter shows:
- **Short name** from the preset
- **Current value** (formatted by parameter type)
- **`m`** prefix if MIDI-mapped (e.g., `m64`)
- **`<`** indicator if a step parameter lock is set
- **`L=`** or **`R=`** prefix for LFO or random automation

## Per-Step Mixer Locks

{: .tip }
Just like sound parameters, mixer parameters support **parameter locks** — hold a step button and turn a mixer knob to set a per-step value. Click the knob while holding a step to clear the lock.

---

## Muting Tracks

The Track Mixer does not have a dedicated mute switch — muting is handled at the sequencer level on the [Patterns & Mutes](../sequencer/pattern) page. Press `FUNC4` and use the step buttons (1–16) to toggle mute per track, or hold `FUNC3` to use the Track Select Overlay.
