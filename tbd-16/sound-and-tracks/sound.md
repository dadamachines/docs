---
layout: default
title: Sound Parameters
nav_order: 1
parent: Sound & Tracks
grand_parent: tbd 16 groovebox
---

# Sound Parameters

The Sound screen is the primary view for editing the active track's synth engine. It displays four parameters per page, one per knob.

![Sound screen — parameters page](../../../images/tbd-16/sound_page0.png){: .screenshot }

## Access

- `FUNC3` — enter Sound screen (cycles: Sound → Track Mixer → Track)
- `FUNC2` — return to Sound from any system screen

## Navigation

- **↑/↓** — switch between parameter pages
- **Knobs 1–4** — adjust the four parameters shown on screen
- **Hyper + Turn** — fine-tune (±1 per click, no acceleration)
- **←/→** — switch active track

## Parameter Pages

The number of pages, page names, and parameter names are **defined by the loaded [Macro]({{ site.baseurl }}/tbd-16/sound-and-tracks/macros-and-presets)**. Different Macros expose different parameters. A typical preset might have pages like:

![Page 2](../../../images/tbd-16/sound_page1.png){: .screenshot }

![Page 3](../../../images/tbd-16/sound_page2.png){: .screenshot }

![Page 4](../../../images/tbd-16/sound_page3.png){: .screenshot }

Each page shows up to 4 parameters. The page name appears at the top of the screen, and page indicator dots at the bottom show your current position. Presets can have up to 6 pages (24 parameters).

## Parameter Display

Each parameter shows:
- **Short name** — abbreviated label from the preset definition
- **Value** — formatted according to parameter type (e.g., `20Hz`–`20.0k` for filter cutoff, `L50`/`C`/`R50` for pan, `-60dB`–`+6dB` for level)
- **Automation prefix** — `L` for LFO, `R` for random modulation
- **Lock indicator** — `<` appears when a step has a parameter lock set

## Parameter Locks (P-Locks)

{: .important }
Parameter locks let you set per-step parameter values, creating evolving, dynamic patterns.

**To set a parameter lock:**
1. **Hold** a step button (long press)
2. While holding, **turn any knob** to set that parameter's value for that step
3. Release the step button — a `<` indicator appears on the parameter display

**To clear a parameter lock:**
- Hold the step button and **click the knob** — clears the lock for that specific parameter on that step

**To clear ALL automation for a parameter:**
- **Long press a knob** — opens a confirmation screen to clear all automation and locks for that parameter

During playback, locked steps override the track's default parameter value for that specific step.

## Parameter Automation

Press a **knob** (without holding a step) to open the automation overlay for that parameter:

- **LFO** — continuous modulation with configurable speed, amount, period, and reset behavior (shown as `L` prefix on value)
- **Random** — randomized modulation per interval (shown as `R` prefix on value)
- **None** — disable automation (fixed value)

See [Step Editing]({{ site.baseurl }}/docs/sequencer/step-editing/) for LFO and random parameter details.

## MIDI CC Mapping

**Shift + knob press** opens the MIDI CC mapping overlay, letting you assign an external MIDI CC to control that parameter.

---

To change *which* Machine is loaded on the track, or to browse and save sound presets, see [Macros & Presets]({{ site.baseurl }}/tbd-16/sound-and-tracks/macros-and-presets).
