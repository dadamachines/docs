---
layout: default
title: Patterns & Mutes
nav_order: 2
parent: Sequencer
grand_parent: tbd 16 groovebox
---

# Patterns & Mutes

The Pattern Select screen manages pattern assignment and track muting. Access it with `FUNC4`.

![Pattern Select — pattern grid and mute status](../../../images/tbd-16/pattern_select.png){: .screenshot }

## Screen Layout

The screen title shows **PATTERN+MUTE** and displays:

- **Top row** — track activity bar showing trigger activity and mute status for all 16 tracks
- **Grid** — 16 columns (tracks) × 6 rows (pattern slots). The active pattern for each track is highlighted. A cursor indicates the selected row.
- **Row numbers** (0–5) displayed at the right edge

## Pattern Selection

Each track has **6 pattern slots** (rows 0–5). The cursor moves between rows to select which pattern to activate.

| Action | Result |
|:-------|:-------|
| **↑/↓** | Move cursor between pattern rows (0–5) |
| **←/→** | Switch active track |
| **FUNC5 click** | Activate the cursor row pattern for the **active track** |
| **FUNC5 long press** | Activate the cursor row pattern for **ALL tracks** |
{: .dada-minimal-table }

## Track Muting

Muting silences a track without changing its pattern or sequence. Mutes are **live-performance tools** — use them to drop tracks in and out while the sequencer keeps playing.

The **step buttons (1–16)** toggle mute on the corresponding track:

- **Green LED** = track is playing (unmuted)
- **Red LED** = track is muted
- LED flashes briefly when a track triggers a note

Mutes are stored per-project and persist across save/load. They are independent of pattern selection — switching patterns does not change the mute state.

{: .tip }
Muting is also available via the Track Select Overlay (hold `FUNC3`). Both mute methods control the same underlying state.

## Track Select Overlay

Hold `FUNC3` to open the Track Select Overlay, showing all 16 tracks with their activity status:

![Track Select Overlay](../../../images/tbd-16/track_select_overlay.png){: .screenshot }

- Press a **step button** to jump to that track
- LEDs show track state: green = active, red = muted, flash on trigger
