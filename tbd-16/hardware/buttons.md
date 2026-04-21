---
layout: default
title: Button Reference
nav_order: 2
parent: Hardware
grand_parent: tbd 16 groovebox
---

# Button Reference

Complete cheat sheet for all button combinations and shortcuts.
{: .fs-6 .fw-300 }

---

## Transport

| Button | Action |
|:-------|:-------|
| **PLAY** | Toggle play/pause |
| **RECORD** | Cycle record mode: OFF → LIVE → STEP → OFF |
{: .dada-minimal-table }

## Function Buttons

| Button | Press | Action |
|:-------|:------|:-------|
| **FUNC1** | Click | Open Project screen |
| **FUNC2** | Click | Toggle between Global Sound and Sound screens |
| **FUNC3** | Click | Cycle: Sound → TrackMixer → Track |
| **FUNC3** | SHIFT + Click | Open Sound Preset browser |
| **FUNC3** | Medium press | Open Track Select overlay |
| **FUNC4** | Click | Open Pattern Select screen |
| **FUNC4** | SHIFT + Click | Open Track Preset browser |
| **FUNC4** | Medium press | Open Mixer Select overlay |
| **FUNC5** | Hold (during play) | Erase steps on active track while held |
| **FUNC5** | SHIFT + Hold | Erase steps on **all tracks** while held |
| **FUNC5** | Click (Pattern Select) | Activate pattern at cursor for active track |
| **FUNC5** | Long press (Pattern) | Activate pattern for **all tracks** |
{: .dada-minimal-table }

## Arrow Buttons

### General Navigation

| Button | Modifier | Action |
|:-------|:---------|:-------|
| **←** | — | Previous track |
| **→** | — | Next track |
| **↑** | — | Previous parameter page |
| **↓** | — | Next parameter page |
| **↓** | SHIFT | Toggle track mute |
| **←** | SHIFT | Step page left |
| **→** | SHIFT | Step page right |
| **←** | Long press | Step page left |
| **→** | Long press | Step page right |
{: .dada-minimal-table }

### Screen-Specific Navigation

| Screen | Button | Action |
|:-------|:-------|:-------|
| Global Sound / Tempo | ←/→ | Navigate between system screens (GlobalSound ↔ Mixer ↔ Tempo) |
| Mixer | ↑/↓ | Change parameter group (Level/Pan/FX1/FX2/Filter) |
| Mixer | ←/→ | Navigate mixer pages or to adjacent system screens |
| Pattern Select | ↑/↓ | Move cursor row (pattern slot 0–5) |
| Pattern Select | ←/→ | Change active track |
| Step Editor Overlay | ←/→ | Navigate between step parameters |
| Step Editor Overlay | ↑/↓ | Toggle step on/off (when on Step indicator) |
{: .dada-minimal-table }

## Step Buttons

### During Playback — Drum Tracks (1–8)

| Button | Action |
|:-------|:-------|
| Step 9–16 | Trigger drum sound + select that drum instrument |
{: .dada-minimal-table }

### During Playback — Synth Tracks (9–16)

| Button | Action |
|:-------|:-------|
| Step 1 | Octave down (min -2) |
| Step 8 | Octave up (max +2) |
| Steps 2–7, 9–15 | Play chromatic note (press = note on, release = note off) |
{: .dada-minimal-table }

### Step Edit Mode (RECORD = STEP)

| Press | Action |
|:------|:-------|
| Click | Toggle step on/off |
| Long press | Open Step Editor overlay |
| Release (after long) | Close Step Editor overlay |
{: .dada-minimal-table }

### Pattern Select Screen

| Button | Action |
|:-------|:-------|
| Steps 1–16 | Toggle mute for corresponding track |
{: .dada-minimal-table }

### Mixer Select Overlay

| Step | Color | Target |
|:-----|:------|:-------|
| Step 1 | Red | Track Select |
| Step 2 | Green | Pattern Select |
| Step 3 | Blue | Mixer |
| Step 4 | Red | Tempo |
| Step 5 | Green | Master |
| Step 6 | Blue | FX1 |
{: .dada-minimal-table }

### Track Select Overlay

| Action | Result |
|:-------|:-------|
| Step 1–16 click | Jump to that track |
| SHIFT + Step 1–16 | Toggle mute for that track |
{: .dada-minimal-table }

## Knobs

### Sound Screen

| Action | Modifier | Result |
|:-------|:---------|:-------|
| Turn | — | Adjust parameter (with acceleration) |
| Turn | HYPER held | Fine-tune (±1 per step) |
| Turn | Hold step | Set parameter lock for that step |
| Click | — | Open Parameter Editor overlay (automation) |
| Click | Hold step | Clear parameter lock for that step |
| Click | SHIFT | Open MIDI CC map editor |
| Long press | — | Clear automation (with confirmation) |
{: .dada-minimal-table }

### Mixer Screen — Group View

| Action | Result |
|:-------|:-------|
| Turn | Adjust group offset (volume/pan/FX delta) |
| Click | Reset parameter to 0 |
| Long press | Reset all parameters for that group to 0 |
{: .dada-minimal-table }

### Global Sound Screen

| Knob | Turn | Click |
|:-----|:-----|:------|
| Knob 1 | Adjust input level | — |
| Knob 2 | Adjust delay level | — |
| Knob 3 | Adjust reverb level | — |
| Knob 4 | Adjust master level | Toggle mute on/off |
{: .dada-minimal-table }

{: .note }
> When the master is **muted**, only Knob 4 responds. A full-screen "MUTED" overlay is displayed.

### Tempo Screen

| Knob | Parameter | Range |
|:-----|:----------|:------|
| Knob 1 | BPM | 30–300 |
| Knob 2 | Shuffle | 0–100% |
| Knob 3 | Time Sig Top | 1–16 |
| Knob 4 | Time Sig Bottom | 1–16 |
{: .dada-minimal-table }

### Track Screen

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| 0 (Normal) | Type | Length | — | — |
| 0 (ARP) | Type | Length | Direction | Steps |
| 0 (EUCL) | Type | Length | K (hits) | N (steps) |
| 1 (ARP) | — | Distance | Speed ↑ | Speed ↓ |
| 2 | — | Gate Time | Speed ↑ | Speed ↓ |
{: .dada-minimal-table }

## Knob Acceleration

| Mode | When | Behavior |
|:-----|:-----|:---------|
| **Normal** | Default turning | Quadratic: `delta + (delta × |delta|) / 6` for large-range params |
| **Fine (HYPER)** | HYPER held | Clamp to ±1 per turn |
| **Recording** | During live record | Gentle: `delta + delta/3` |
| **P-Lock** | Holding a step | Normal acceleration disabled (held_step guard) |
{: .dada-minimal-table }

## Overlay Triggers

| Overlay | Open | Close |
|:--------|:-----|:------|
| Step Editor | Long-press step button | Release step button |
| Parameter Editor | Click knob (Sound screen) | Click knob again or navigate |
| Track Select | Medium-press FUNC3 | Release FUNC3 |
| Mixer Select | Medium-press FUNC4 | Release FUNC4 |
| MIDI CC Map | SHIFT + click knob | Dialog closes |
{: .dada-minimal-table }

## Press Durations

| Type | Threshold |
|:-----|:----------|
| Click | < 150ms |
| Medium Press 1 | 150–500ms |
| Medium Press 2 | 500ms+ |
| Long Press | 500ms+ (held) |
{: .dada-minimal-table }
