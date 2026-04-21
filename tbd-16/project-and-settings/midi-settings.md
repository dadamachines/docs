---
layout: default
title: MIDI Settings
nav_order: 2
parent: Project & Settings
grand_parent: tbd 16 groovebox
---

# MIDI Settings

Configure MIDI input/output routing, channel mapping, and Ableton Link.
{: .fs-6 .fw-300 }

**FUNC1 → Settings → MIDI Settings**

![MIDI Settings](../../../images/tbd-16/midi_settings.png){: .screenshot }

---

## MIDI Ports

The **tbd 16** has four physical MIDI paths, each with independent In and Out settings:

| Port | Description |
|:-----|:------------|
| **TRS MIDI 1 In / Out** | UART MIDI port 1 (TRS Type A) |
| **TRS MIDI 2 In / Out** | UART MIDI port 2 (TRS Type A) |
| **USB Host In / Out** | USB-A port (connect a class-compliant MIDI controller) |
| **USB Device In / Out** | USB-C port (connect to a computer) |
{: .dada-minimal-table }

Use **↑/↓** to navigate, turn a **knob** to change the mode for each port.

## Port Modes

Each In or Out can be set to:

| Mode | Passes |
|:-----|:-------|
| **None** | Nothing — the port is disabled |
| **Sync** | Clock and transport only (start/stop/continue) |
| **Notes** | Note On/Off and CC messages |
| **Sy+No** | Everything (sync + notes) |
{: .dada-minimal-table }

### Status indicators

| Symbol | Meaning |
|:-------|:--------|
| `<` | Valid MIDI received in the last 200 ms |
| `!` | MIDI received but ignored (mode setting) |
| `>` | MIDI sent in the last 200 ms |
{: .dada-minimal-table }

---

## MIDI Channel Routing

Tracks map to specific MIDI channels:

| Tracks | MIDI Channel | Voice type |
|:-------|:-------------|:-----------|
| 1–3 | Channel 10 | Drums |
| 4–6 | Channel 11 | Drums |
| 7–8 | Channel 12 | Rompler |
| 9–11 | Channels 1–3 | Mono synth |
| 12 | Channel 4 | Wavetable |
| 13 | Channel 5 | Rompler / Arp |
| 14–15 | Channels 6–7 | Poly synth |
| 16 | Channel 8 | Audio input |
{: .dada-minimal-table }

When a track plays, the note is sent internally to the engine and also to all enabled MIDI output ports simultaneously. Each output filters messages based on its configured mode.

---

## Ableton Link

Ableton Link keeps the **tbd 16** in sync with other Link-enabled apps and devices over WiFi or the USB network.

| Mode | Behavior |
|:-----|:---------|
| **Off** | Link disabled, internal clock only |
| **Tempo** | Sync BPM with Link peers |
| **Tmp+ST** | Sync BPM + start/stop with Link peers |
{: .dada-minimal-table }

Requires an active network connection (Access Point mode or USB Network mode — see [WiFi Settings](wifi-settings)). The first device to join a session sets the initial tempo; any peer can change tempo.

Link works alongside MIDI clock, but avoid running two tempo sources at once — pick one master.

---

## MIDI CC mapping

Individual sound parameters can be driven by external MIDI CC messages:

1. On the **Sound** screen, hold **SHIFT** and click a knob
2. The **MIDI CC Map** editor opens for that parameter
3. Assign a CC number to match your external controller

The mapped parameter will then respond to incoming CC on the channel its track is bound to.
