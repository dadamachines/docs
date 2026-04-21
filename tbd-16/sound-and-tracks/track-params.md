---
layout: default
title: Track Parameters
nav_order: 3
parent: Sound & Tracks
grand_parent: tbd 16 groovebox
---

# Track Parameters

The Track Parameters screen configures the active track's sequencer behavior — pattern type, length, arpeggiator, euclidean generator, gate time, and track speed. Access it by pressing `FUNC3` three times from Sound.

![Track Parameters — page 1](../../../images/tbd-16/track_params_page0.png){: .screenshot }

## Navigation

- `FUNC3` — cycle to Track Parameters (Sound → Track Mixer → **Track**)
- **↑/↓** — switch parameter pages
- **←/→** — switch active track

## Page 1 — Type & Length

| Knob | Parameter | Values |
|:-----|:----------|:-------|
| Knob 1 | **Type** | `Norm` (normal), `ARP` (arpeggiator), `EUCL` (euclidean) |
| Knob 2 | **Length** | 1–64 steps |
| Knob 3 | *(depends on Type)* | See below |
| Knob 4 | *(depends on Type)* | See below |
{: .dada-minimal-table }

### When Type = ARP

| Knob | Parameter | Values |
|:-----|:----------|:-------|
| Knob 3 | **Dir** (direction) | `Up`, `Dwn`, `U+D`, `Rnd` |
| Knob 4 | **Steps** | 0–4 |
{: .dada-minimal-table }

### When Type = EUCL (Euclidean)

| Knob | Parameter | Values |
|:-----|:----------|:-------|
| Knob 3 | **M** (trigger pulses) | 1–16 |
| Knob 4 | **N** (total steps) | 1–16 |
{: .dada-minimal-table }

![Track Parameters — page 2](../../../images/tbd-16/track_params_page1.png){: .screenshot }

## Page 2 — Arpeggiator (ARP type only)

| Knob | Parameter | Values |
|:-----|:----------|:-------|
| Knob 1 | **Dist** (distance) | 1–64 |
| Knob 3 | **Arp..** (speed top) | 1–32 |
| Knob 4 | **..Speed** (speed bottom) | 1–64 |
{: .dada-minimal-table }

The arp speed is displayed as a fraction (e.g., `1/4`).

## Page 3 — Gate & Speed

![Track Parameters — page 3](../../../images/tbd-16/track_params_page2.png){: .screenshot }

| Knob | Parameter | Values |
|:-----|:----------|:-------|
| Knob 2 | **Gate** (gate time) | 1–64 ms |
| Knob 3 | **Track..** (speed top) | Fraction numerator |
| Knob 4 | **..Speed** (speed bottom) | Fraction denominator |
{: .dada-minimal-table }

Track speed is displayed as a fraction (e.g., `1/2` for half speed, `2/1` for double speed).

## Track Presets

**Shift + FUNC4** opens the Track Preset browser for loading pre-configured track setups.

![Track Preset selector](../../../images/tbd-16/track_preset.png){: .screenshot }

See [Macros & Presets]({{ site.baseurl }}/tbd-16/sound-and-tracks/macros-and-presets) for details.
