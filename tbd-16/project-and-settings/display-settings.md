---
layout: default
title: Display Settings
nav_order: 3
parent: Project & Settings
grand_parent: tbd 16 groovebox
---

# Display Settings

Configure the OLED display and LED behaviour.
{: .fs-6 .fw-300 }

**FUNC1 → Settings → Display Settings**

![Display Settings](../../../images/tbd-16/display_settings.png){: .screenshot }

| Setting | Range | Description |
|:--------|:------|:------------|
| **Gamma curve** | 0.00–7.97 | Display gamma correction |
| **Min brightness** | 0–255 | Minimum LED pixel brightness |
| **Max brightness** | 0–255 | Maximum LED pixel brightness |
| **Color theme** | 0–4 | LED colour theme preset |
| **Invert display** | yes / no | Invert the OLED display colours |
| **Button tester** | — | Opens the interactive input debug screen |
| **Overlay timeout** | off / 1–30 s | Auto-dismiss overlay screens after this time |
| **Live waveform** | yes / no | Show the audio waveform on the idle screen. When on, hides the input/output meters and network indicator (they share the same screen area). |
| **Func LEDs** | on / off | Show the green input-level meter on FUNC1 / FUNC2. Off by default — most users prefer the Clip LEDs (below) instead. |
| **Clip LEDs** | on / off | Flash FUNC1 (red) on Audio Input clip and FUNC2 (red) on synth-track output clip. Independent of Func LEDs. |
| **Input meter** | on / off | Vertical bar in the OLED header (left) — shows Audio Input track (Track 16) signal level only. Hidden when Live waveform is on. |
| **Output meter** | on / off | Vertical bar in the OLED header (right) — shows the combined level of synth tracks 1–15 only. Hidden when Live waveform is on. |
| **Network ind.** | on / off | Letter glyph in the OLED header: **U** = USB-NCM ready, **W** = WiFi station, **A** = WiFi access point, blank = network off. Hidden when Live waveform is on. |
{: .dada-minimal-table }

## Header indicators at a glance

The OLED header row shows live signal flow even when the sequencer is
idle:

- **Input meter** (left bar) — fills top→down as Audio Input audio
  arrives at Track 16. Solid block + flashing FUNC1 LED on clip.
- **Output meter** (right bar) — fills bottom→up with the combined
  bus level of synth tracks. Solid block + flashing FUNC2 LED on
  clip.
- **Network indicator** — single character showing what's currently
  serving the WebUI / REST API.

The two meters are **fully independent** — Audio Input never bleeds
into the Output meter regardless of Master Volume, FX returns, or
input-track gain. So you can use the Input meter to set Scarlett /
external audio levels without the synth signal interfering.
