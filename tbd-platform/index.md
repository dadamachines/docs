---
layout: default
title: tbd platform
nav_order: 4
has_children: false
---

# tbd platform

The open audio platform for musicians and developers.
{: .fs-6 .fw-300 }

The **dadamachines TBD-16** is a standalone desktop instrument built on [CTAG TBD](https://github.com/ctag-fh-kiel/ctag-tbd){:target="_blank"}, an open-source audio DSP engine. It combines 50+ synthesizers and effects with standard MIDI, a browser-based UI, and Ableton Link. Plug in power and start making music — no computer required.

{: .note }
> Full platform and developer documentation lives at **[dadamachines.github.io/ctag-tbd](https://dadamachines.github.io/ctag-tbd/index.html){:target="_blank"}**. This page is a high-level summary — head there for the complete reference.

---

## Why

Most electronic instruments are closed boxes — you get the sounds the manufacturer chose, and that's it. **TBD is different.** The DSP engine, firmware, and plugin system are fully open source (GPL/LGPL). You can play it out of the box, or dive into the code and shape it into exactly the instrument you need.

| Feature | What it means |
|:--------|:--------------|
| **Ready to play** | Ships as a complete instrument. Plug in USB-C power, connect speakers, and you're making music. |
| **Open-source software** | Core DSP engine is GPL 3.0; Web UI, tools, and docs are LGPL 3.0. Full source access — study, modify, contribute. |
| **No lock-in** | Standard MIDI, standard audio jacks, SD card storage. Your instruments and sounds belong to you. |
| **Built on CTAG TBD** | Audio engine and 50+ plugins come from the [CTAG TBD](https://github.com/ctag-fh-kiel/ctag-tbd){:target="_blank"} project by Robert Manzke. |
{: .dada-minimal-table }

---

## How — multicore architecture

The TBD-16 runs **three purpose-built processors in parallel**:

- **ESP32-P4** (dual-core RISC-V) — real-time audio DSP
- **RP2350** (dual-core ARM/RISC-V) — hardware UI, MIDI, sequencing
- **ESP32-C6** — WiFi & Ableton Link

Each layer is independently programmable — change one without touching the others.

| Layer | What you build |
|:------|:---------------|
| **Controller Apps** | MIDI controllers, sequencers, or control surfaces on the RP2350 using Arduino & PlatformIO. |
| **DSP Plugins** | Audio code in C++ that runs on the ESP32-P4. Test in the desktop simulator before flashing. |
| **Web UI** | Built-in WiFi serves a web interface for preset management, plugin configuration, and firmware updates. |
| **Ableton Link** | Wireless tempo sync with Ableton Live, iOS apps, and any Link-enabled device on the same network. |
{: .dada-minimal-table }

**Key specs:** 50+ DSP plugins · 3 processors · 32-bit audio processing · <1 ms latency

---

## What you can do

Whether you're a musician, a developer, or both — there's a path for you.

### Make Music
Your TBD-16 ships ready to use. Switch apps, tweak 50+ DSP plugins from your browser, sync with Ableton Link.
- [Using Your TBD-16](https://dadamachines.github.io/ctag-tbd/get_started/10_using_your_tbd.html){:target="_blank"}
- [Browse Apps](https://dadamachines.github.io/ctag-tbd/apps/index.html){:target="_blank"}
- [Browse Plugins](https://dadamachines.github.io/ctag-tbd/plugins/index.html){:target="_blank"}
- [WiFi & Ableton Link](https://dadamachines.github.io/ctag-tbd/get_started/15_wifi_and_link.html){:target="_blank"}

### Build Controller Apps
Create custom MIDI controllers, sequencers, or control surfaces on the RP2350 — Arduino & PlatformIO, no audio programming required.
- [Development Setup](https://dadamachines.github.io/ctag-tbd/apps/getting-started.html){:target="_blank"}
- [App Architecture](https://dadamachines.github.io/ctag-tbd/apps/rp2350.html){:target="_blank"}
- [Bootloader & Multi-App](https://dadamachines.github.io/ctag-tbd/apps/bootloader.html){:target="_blank"}
- [Debugging](https://dadamachines.github.io/ctag-tbd/apps/debugging.html){:target="_blank"}

### Write DSP Plugins
Write audio code in C++ for the ESP32-P4. If you already ship VST, AU, or LV2 plugins, the workflow is familiar — start in the desktop simulator, no hardware needed, then flash to the device.
- [Desktop Simulator](https://dadamachines.github.io/ctag-tbd/plugins/simulator.html){:target="_blank"}
- [Plugin Architecture](https://dadamachines.github.io/ctag-tbd/plugins/architecture.html){:target="_blank"}
- [Creating a Plugin](https://dadamachines.github.io/ctag-tbd/plugins/step-by-step.html){:target="_blank"}
- [Development Setup](https://dadamachines.github.io/ctag-tbd/plugins/getting-started.html){:target="_blank"}

### Hardware & Platform
The TBD-16 Devkit ships with 50+ plugins and full multi-app support. Products built on the platform can run the same broad palette, or focus on a single dedicated plugin — the architecture supports both.
- [TBD-16 Specs](https://dadamachines.github.io/ctag-tbd/hardware/10_tbd16.html){:target="_blank"}
- [TBD-Core Module](https://dadamachines.github.io/ctag-tbd/hardware/20_tbd_core.html){:target="_blank"}
- [Custom Integration](https://dadamachines.github.io/ctag-tbd/hardware/30_custom_integration.html){:target="_blank"}
- [Flash & Updates](https://dadamachines.github.io/ctag-tbd/flash/index.html){:target="_blank"}

---

## Get involved

TBD is built by a growing community of developers, musicians, and manufacturers.

- **Contribute a plugin** — write a synthesizer, effect, or drum machine in C++. Test in the desktop simulator, then submit a pull request. → [Create a Plugin](https://dadamachines.github.io/ctag-tbd/plugins/step-by-step.html){:target="_blank"}
- **Build an app** — create a MIDI controller, sequencer, or performance app for the RP2350. → [App Dev Guide](https://dadamachines.github.io/ctag-tbd/apps/getting-started.html){:target="_blank"}
- **Build your own hardware product** — already shipping VST, AU, or LV2 plugins? Your C++ DSP code can run on TBD hardware. Use the [TBD-Core](https://dadamachines.github.io/ctag-tbd/hardware/20_tbd_core.html){:target="_blank"} module or work with dadamachines on a [custom PCB integration](https://dadamachines.github.io/ctag-tbd/hardware/30_custom_integration.html){:target="_blank"}. → [Talk to dadamachines](https://dadamachines.com/contact/){:target="_blank"}

---

## Full documentation

**→ [dadamachines.github.io/ctag-tbd](https://dadamachines.github.io/ctag-tbd/index.html){:target="_blank"}**
