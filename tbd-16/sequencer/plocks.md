---
layout: default
title: Parameter Locks
nav_order: 1
parent: Sequencer
grand_parent: tbd 16 groovebox
---

# Parameter Locks (P-Locks)

Per-step parameter automation — the heart of sound design in the sequencer.
{: .fs-6 .fw-300 }

---

## What Are Parameter Locks?

Parameter locks (p-locks) let you set a **different value for any sound parameter on each step** of a pattern. Instead of a parameter staying at one value for the whole pattern, you can make it change on specific steps — creating evolving textures, rhythmic timbral shifts, and complex sound design that would be impossible with static settings.

For example: lock the filter cutoff high on beat 1, low on beat 3, with different resonance values on each — all within a single pattern.

## Setting a Parameter Lock

1. Navigate to the **Sound** screen for the track you want to edit
2. **Hold** a step button (the step must have a note — lit white)
3. While holding the step, **turn a knob** to set that parameter's value for that specific step
4. Release the step button

The display shows the parameter value updating as you turn the knob. The locked value is stored per-step and will be recalled every time that step plays.

{: .tip }
> You can lock parameters across multiple pages. Hold the step, use **↑/↓ arrows** to change parameter pages, then turn knobs to lock parameters on different pages — all while keeping the step held.

## What Can Be Locked?

### Audio Parameters (up to 24 per track)

All sound engine parameters visible on the Sound screen can be p-locked. This includes any parameter from any page of the current preset. Each step stores a bitmask (`audioParamLocks`) indicating which of the 24 possible audio parameters have locked values.

### Mixer Parameters (up to 8 per track)

Track mixer parameters can also be p-locked:

| Index | Parameter |
|:------|:----------|
| 0 | Level |
| 1 | Pan |
| 2 | FX1 Send |
| 3 | FX2 Send |
{: .dada-minimal-table }

This means you can create per-step volume changes, panning automation, or rhythmic FX send variations.

## Visual Indicators

When a step has parameter locks, the step button LED may show differently during playback. On the Sound screen display:

- **Held step with lock**: Shows the locked value for each knob position
- **Lock indicator overlay**: `PO_LOCKED` state appears when viewing a locked parameter

## Clearing Parameter Locks

### Clear a Single Parameter Lock

1. **Hold** the step button
2. **Click** the knob for the parameter you want to clear
3. The lock for that specific parameter on that step is removed

### Clear All Automation

1. On the Sound screen (without holding a step), **long-press** a knob
2. A confirmation dialog appears: "Confirm Clear Automation"
3. Confirm to clear all automation data for that parameter across all steps

## How P-Locks Are Stored

Each step in a pattern has dedicated storage for parameter locks:

```
SONGPATTERNSTEP {
    audioParamLocks  : uint32_t bitmask (24 params)
    audioParams[24]  : uint8_t values
    mixerParamLocks  : uint8_t bitmask (8 params)
    mixerParams[8]   : uint8_t values
}
```

### Value Scaling

Parameters with a range of **0–255 or less** are stored losslessly as a direct offset from the minimum value.

Parameters with a range **greater than 255** (e.g., 14-bit NRPN parameters) are proportionally scaled to fit in a uint8_t (0–255), with approximately ±0.4% precision. This scaling happens automatically — you always work with the full parameter range in the UI.

## Playback Evaluation

During playback, each step's parameters are evaluated in this priority order:

```
1. P-Lock value (if locked) OR Track default value
2. + LFO/Random automation value
3. + MIDI CC map value
4. = Final value (clamped to parameter range)
```

This means p-locks **combine with** automation. If a parameter has both a p-lock and an LFO, the LFO modulates around the locked value rather than the track default.

## Parameter Automation (LFO / Random)

Beyond per-step p-locks, each parameter can have continuous automation applied. Access this via the **Parameter Editor** overlay:

1. On the Sound screen (without holding a step), **click a knob**
2. The Parameter Editor overlay opens

### Automation Types

| Type | Description |
|:-----|:------------|
| **Fixed** | No automation — parameter stays at its set value (or p-lock) |
| **Random** | Random value added each update interval |
| **LFO** | Sine wave modulation with configurable speed, amount, and period |
{: .dada-minimal-table }

### Random Parameters

| Parameter | Range | Description |
|:----------|:------|:------------|
| Amount | -127 to +127 | Random modulation depth |
| Interval | see below | When to generate new random value |
{: .dada-minimal-table }

### LFO Parameters

| Parameter | Range | Description |
|:----------|:------|:------------|
| Amount | -127 to +127 | Modulation depth |
| Speed | 1–128 | Frequency multiplier |
| Period Steps | 1–255 | LFO cycle length in sequencer steps |
| Update Interval | see below | When to recalculate |
| Reset Interval | see below | When to restart phase |
| Reset Phase | Start / Random Offset | Phase on reset |
{: .dada-minimal-table }

### Update Intervals

| Interval | Description |
|:---------|:------------|
| Every Step | Recalculate every sequencer step |
| Every Trig | Recalculate on note triggers only |
| Pattern Start | Recalculate once at pattern loop |
| Random Step 25/50/75% | Random chance per step |
| Random Trig 25/50/75% | Random chance per trigger |
{: .dada-minimal-table }

### Reset Intervals (LFO only)

| Interval | Description |
|:---------|:------------|
| Pattern Start | Reset LFO phase when pattern loops |
| Never | Free-running LFO |
| Play | Reset when playback starts |
| Trig | Reset on each note trigger |
{: .dada-minimal-table }

## Workflow Tips

{: .tip }
> **Create evolving patterns**: Lock filter cutoff to different values across 16 steps for a rhythmic filter sweep.

{: .tip }
> **Accent beats**: Lock velocity higher on beats 1 and 9 for emphasis, lower on off-beats for groove.

{: .tip }
> **Ghost notes**: Lock chance to 30–50% on certain steps to create variations that change on every loop.

{: .tip }
> **Combine with automation**: Set an LFO on a parameter, then p-lock specific steps to override the LFO — creating a pattern that's mostly automated but with intentional anchor points.
