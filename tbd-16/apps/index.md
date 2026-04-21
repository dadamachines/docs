---
layout: default
title: Apps
nav_order: 13
parent: tbd 16 groovebox
has_children: true
has_toc: false
---

# Apps

The **tbd 16** is a **multi-app platform**. Different apps turn the device into different instruments — a groovebox, a MIDI sequencer, a multi-effect processor, or anything you can build.
{: .fs-6 .fw-300 }

---

## How Apps Work

Each app is firmware for the **RP2350** processor (which drives the display, buttons, encoders, LEDs, and MIDI). Some apps also pair with specific behavior on the **ESP32-P4** (DSP plugins, Ableton Link, USB audio).

All apps live on the SD card in the `tbd-apps/` folder. At boot, a **boot menu** lets you select which app to run. The **tbd 16** keeps all apps on the device simultaneously — no flashing or downloading required.

{: .note }
> You can install, update, and remove apps from your browser using the [App Manager](https://dadamachines.github.io/ctag-tbd/flash/60_app_manager.html){:target="_blank"}.

## Shipping Apps

| App | Description | Status |
|:----|:------------|:-------|
| **[Groovebox](#groovebox)** | 16-track drum machine with step sequencing, pattern management, parameter locks, and Ableton Link. **This is the default app.** | ✅ Shipping |
| **[MegaCommand Live](#megacommand-live)** | High-performance MIDI sequencer for external gear. Originally built for the Elektron MachineDrum. | ✅ Shipping |
| **[Multi Effect / Synth](#multi-effect--synth)** | Browse and play any of the 50+ DSP plugins from the hardware UI. Two simultaneous plugin slots. | ✅ Shipping |
{: .dada-minimal-table }

## Planned Apps

| App | Description | Status |
|:----|:------------|:-------|
| **MIDI Controller + Audio Interface** | Turn the **tbd 16** into an iPad/iPhone companion. 30 buttons and 4 encoders as MIDI CC, plus stereo USB audio — all over one USB-C cable. | 🔮 Planned |
{: .dada-minimal-table }

## Utility Apps

| App | SD Card File | Description |
|:----|:-------------|:------------|
| **Debug Probe** | `tbd-apps/dbg_prb.uf2` | CMSIS-DAP debug probe for flashing the STM32 input scanner |
| **USB Mass Storage** | `tbd-apps/tusb_msc.uf2` | Mount the SD card as a USB drive on your computer |
| **UI Test** | `tbd-apps/ui_test.uf2` | Hardware test for display, LEDs, pots, buttons, and SD card |
| **Game** | `tbd-apps/game.uf2` | A small game — proof that the RP2350 can run anything |
{: .dada-minimal-table }

---

## Groovebox

The **Groovebox** is the default app and the focus of this manual. It turns the **tbd 16** into a 16-track drum machine and groovebox with:

- **16 tracks** — each triggering a DSP plugin sound
- **Step sequencing** with variable step lengths and swing
- **Parameter locks** — per-step automation for any sound parameter
- **Pattern management** — store, recall, and chain patterns
- **Per-track mute/solo** from the hardware buttons
- **MIDI in/out** (USB and TRS Type-A) for syncing and controlling external gear
- **Ableton Link** for wireless tempo sync

The Groovebox is a collaboration between two processors: the **RP2350** runs the sequencer and UI ([tbd-pico-seq3](https://github.com/dadamachines/tbd-pico-seq3){:target="_blank"} by [Possan](https://possan.codes/){:target="_blank"}), while the **ESP32-P4** runs the audio engine (PicoSeqRack DSP plugin).

📖 The rest of this manual documents the Groovebox in detail — see [Getting Started](../getting-started/), [Sound & Tracks](../sound-and-tracks/), [Mixer & Effects](../mixer-and-effects/), [Sequencer](../sequencer/), and [Project & Settings](../project-and-settings/).

---

## MegaCommand Live

**MegaCommand Live (MCL)** is a high-performance MIDI sequencer originally created by [Justin Mammarella (jmamma)](https://github.com/jmamma){:target="_blank"} for the Elektron MachineDrum. On the **tbd 16**, it runs natively on the RP2350 while the ESP32-P4 provides Ableton Link sync.

- MIDI sequencing with tracks for external hardware
- Song mode for chaining patterns
- Live performance tools — real-time transpose, mute groups, parameter locks
- Ableton Link for wireless tempo sync

SD card file: `tbd-apps/mcl.uf2`

📖 See the [MCL documentation](https://dadamachines.github.io/ctag-tbd/apps/mcl.html){:target="_blank"} for details.

---

## Multi Effect / Synth

The **Multi Effect / Synth** app lets you browse, load, and play any of the [50+ DSP plugins](https://dadamachines.github.io/ctag-tbd/plugins/index.html){:target="_blank"} using the **tbd 16**'s hardware interface — no computer or web UI required.

- Browse plugins on the OLED with encoders
- Two independent plugin slots — run any two plugins at the same time
- Preset management — save and recall parameter snapshots
- MIDI mapping for external control

SD card file: `tbd-apps/multi_fx.uf2`

📖 See the [Multi Effect / Synth documentation](https://dadamachines.github.io/ctag-tbd/apps/multi-effect.html){:target="_blank"} for details.

---

## Developer Resources

The **tbd 16**'s app system is fully open. You can build your own apps for the RP2350, write DSP plugins for the ESP32-P4, or both.

| Resource | Description |
|:---------|:------------|
| [Developer Documentation](https://dadamachines.github.io/ctag-tbd/){:target="_blank"} | Full developer docs: app architecture, plugin system, getting started guides |
| [App Development Setup](https://dadamachines.github.io/ctag-tbd/apps/getting-started.html){:target="_blank"} | Set up Arduino & PlatformIO for RP2350 app development |
| [App Architecture](https://dadamachines.github.io/ctag-tbd/apps/rp2350.html){:target="_blank"} | How apps are structured and how RP2350 ↔ P4 communication works |
| [Bootloader & Multi-App](https://dadamachines.github.io/ctag-tbd/apps/bootloader.html){:target="_blank"} | How the boot menu works, how apps are loaded from SD |
| [Plugin System](https://dadamachines.github.io/ctag-tbd/plugins/index.html){:target="_blank"} | Browse 50+ DSP plugins and learn how to write your own in C++ |
| [Desktop Simulator](https://dadamachines.github.io/ctag-tbd/plugins/simulator.html){:target="_blank"} | Test DSP plugins on your computer before flashing to hardware |
| [GitHub: P4 DSP Engine](https://github.com/dadamachines/ctag-tbd){:target="_blank"} | ESP32-P4 audio engine source code |
| [GitHub: Groovebox](https://github.com/dadamachines/tbd-pico-seq3){:target="_blank"} | RP2350 Groovebox firmware source code |
{: .dada-minimal-table }

{: .note }
> This manual (docs.dadamachines.com) is for **musicians** who want to use the **tbd 16**. The [developer documentation](https://dadamachines.github.io/ctag-tbd/){:target="_blank"} is for **developers** who want to build custom plugins or apps.
