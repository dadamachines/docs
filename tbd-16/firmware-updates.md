---
layout: default
title: Firmware Updates
nav_order: 11
parent: tbd 16 groovebox
---

# Firmware Updates

The **tbd 16** has **two ways to update firmware**: the built-in WebUI updater (preferred) and the web flasher (recovery). Always try the WebUI updater first — it can update everything on the device over your local network.

---

## 1. The WebUI System Updater (preferred)

Open the WebUI and click **System Updater** in the footer of any page — or access it from the **Configuration overlay** (cog icon) on most screens.

The updater handles four components, each with its own collapsible section:

| Component | What it updates |
|:----------|:----------------|
| **WebUI** | The browser interface you're looking at |
| **P4 Firmware** | Audio DSP firmware (ESP32-P4) |
| **Pico Firmware** | Hardware UI / sequencer firmware (RP2350) |
| **Factory Data** | Default kits, presets, and factory content |
{: .dada-minimal-table }

### What you'll see

- **Version summary cards** at the top show each component's current version and status (*checking → up-to-date / outdated / offline*).
- An **Update All** banner appears when multiple components have updates available, with a step tracker that walks you through them.
- Each component section has:
  - A **progress bar** and activity log for the running update
  - An **online check** for new versions on the selected update channel
  - A **manual upload** panel (drag-drop a `.zip` or `.bin` or click to browse)
- **Factory Data** additionally supports **backup / restore** workflows.

### Update channel

In the header, choose the update channel:

- **Stable** — recommended for everyday use
- **Staging** — early access to new features (may be unstable)

---

## 2. If the WebUI updater fails

If the WebUI itself won't load or the built-in updater cannot complete — for example after an interrupted WebUI update — use the **web flasher** to reflash from scratch over USB.

{: .important }
> **The web flasher is the only place to flash the firmware if the in-device updater is unavailable.**
>
> → **[dadamachines.github.io/ctag-tbd/flash](https://dadamachines.github.io/ctag-tbd/flash/index.html){:target="_blank"}**

The web flasher runs in your browser (Chrome or Edge). It uses WebUSB to connect to the **tbd 16** and write a full firmware image. Follow the steps on that page.

---

## Choosing which updater to use

| Situation | Use |
|:----------|:-----|
| Normal updates | **WebUI System Updater** (Stable channel) |
| Early-access testing | **WebUI System Updater** (Staging channel) |
| WebUI won't load | **[Web flasher](https://dadamachines.github.io/ctag-tbd/flash/index.html){:target="_blank"}** |
| Recovering a bricked device | **[Web flasher](https://dadamachines.github.io/ctag-tbd/flash/index.html){:target="_blank"}** |
| Initial bring-up / factory reset | **[Web flasher](https://dadamachines.github.io/ctag-tbd/flash/index.html){:target="_blank"}** |
{: .dada-minimal-table }

---

## Tips

- **Back up first.** Before any firmware update, back up your Factory Data from the updater and export your kits and presets from the [File Manager](file-manager) and [Preset / Macro Manager](preset-macro-manager).
- **Power.** Keep the **tbd 16** powered during the entire update — a cut mid-flash can corrupt the partition.
- **Network stability.** For online updates, use a stable WiFi connection.

See also: [TBD platform → Flash & Updates](https://dadamachines.github.io/ctag-tbd/flash/index.html){:target="_blank"} for the platform-level flash reference.
