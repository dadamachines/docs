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
| **Func LEDs** | on / off | Show the multi-zone signal level meter on FUNC1 (input) / FUNC2 (output) — see colour key below. Off by default. |
| **Clip LEDs** | on / off | Adds the magenta soft-clip-catching latch on top of the Func LEDs zone colours. Held briefly so transient peaks remain visible after the signal drops. Independent of Func LEDs. |
| **Input meter** | on / off | Vertical bar in the OLED header (left) — shows Audio Input track (Track 16) signal level only. Hidden when Live waveform is on. |
| **Output meter** | on / off | Vertical bar in the OLED header (right) — shows the combined level of synth tracks 1–15 only. Hidden when Live waveform is on. |
| **Network ind.** | on / off | Letter glyph in the OLED header: **U** = USB-NCM ready, **W** = WiFi station, **A** = WiFi access point, blank = network off. Hidden when Live waveform is on. |
{: .dada-minimal-table }

## Header indicators at a glance

The OLED header row shows live signal flow even when the sequencer is
idle:

- **Input meter** (left bar) — fills top→down as Audio Input audio
  arrives at Track 16. Solid block + zone-coloured FUNC1 LED.
- **Output meter** (right bar) — fills bottom→up with the combined
  bus level of synth tracks. Solid block + zone-coloured FUNC2 LED.
- **Network indicator** — single character showing what's currently
  serving the WebUI / REST API.

## FUNC clip LEDs — multi-zone colour key

When **Func LEDs** is on, FUNC1 (above the FUNC1 button) shows the
input level and FUNC2 the output level. Each LED uses a smooth colour
progression so you can read level at a glance without watching the
OLED:

| Colour | Approx. level | Meaning |
|---|---|---|
| Off / dim green | < −10 dBFS | Clean, plenty of headroom |
| Bright green | −10..−5 dBFS | Healthy signal level |
| Yellow | −5..−2 dBFS | Approaching ceiling — caution |
| Orange | −2..−1 dBFS | At the soft-clip threshold |
| Red | −1..0 dBFS | Right at the ceiling |
| Magenta | > 0 dBFS | Soft-clipper actively catching peaks |

Magenta means the cubic soft-clipper is gently saturating peaks that
would otherwise digital-clip — audio is still safe, but you're hearing
soft-saturation character. Held for ~30 frames so a one-shot transient
hit stays visible after the signal has already dropped back to safe
levels.

When **Clip LEDs** is off, the magenta latch is suppressed but the
red zone (peaks at the ceiling) still renders.

The two meters are **fully independent** — Audio Input never bleeds
into the Output meter regardless of Master Volume, FX returns, or
input-track gain. So you can use the Input meter to set Scarlett /
external audio levels without the synth signal interfering.
