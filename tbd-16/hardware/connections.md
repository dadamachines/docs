---
layout: default
title: Connections
nav_order: 1
parent: Hardware
grand_parent: tbd 16 groovebox
---

# Connections

Physical ports on the **tbd 16**.
{: .fs-6 .fw-300 }

---

## Audio

| Port | Type | Use |
|:-----|:-----|:----|
| **Stereo Line In** | TRS 3.5 mm | Sample external audio, run through effects |
| **Stereo Line Out** | TRS 3.5 mm | Main output for monitors, mixer, or external gear |
| **Headphone Out** | TRS 3.5 mm | Dedicated headphone output with its own volume wheel |
{: .dada-minimal-table }

All three are on the right side of the device.

---

## MIDI

Four independent MIDI connections are available. All TRS MIDI jacks follow the [TRS Type-A standard](https://minimidi.world/){:target="_blank"} — no adapters needed for standard MIDI cables.

| Port | Details |
|:-----|:--------|
| **TRS MIDI 1 In / Out** | Standard 5-pin-equivalent MIDI over TRS |
| **TRS MIDI 2 In / Out** | Standard MIDI. **MIDI 2 In** doubles as an analog Clock/Reset input for Eurorack sync — a switch on the bottom of the case selects between MIDI and Clock/Reset modes. |
| **USB Host MIDI** | USB-A port — connect class-compliant USB MIDI controllers (Launchpad, Launchkey, etc.). Provides up to 500 mA to the connected device. Multiple devices supported via a USB hub. See [External Controllers]({{ site.baseurl }}/tbd-16/external-controllers/) for supported models. |
| **USB Device MIDI** | USB-C port — the **tbd 16** appears as a USB MIDI device to your computer. Shares the same USB-C cable used for power. |
{: .dada-minimal-table }

Each port's behaviour (notes only, clock only, both, or disabled) is configured in [Project & Settings → MIDI Settings](../project-and-settings/midi-settings).

---

## USB

The **tbd 16** has four USB ports:

| Port | Function |
|:-----|:---------|
| **USB-C** (primary) | Power, USB MIDI to a computer, and the web interface over USB network |
| **USB-C** (secondary) | Additional power, development |
| **USB-C** (front panel) | Debug / firmware flashing |
| **USB-A** | Host port for class-compliant USB MIDI devices |
{: .dada-minimal-table }

### USB Network (NCM)

Over the primary USB-C port, the **tbd 16** also provides a network connection to your computer — you can open the WebUI in a browser without connecting to WiFi. See [WiFi Settings](../project-and-settings/wifi-settings).

---

## WiFi

Built-in WiFi for:

- The WebUI — open the docs address in a browser on your computer or phone
- **Ableton Link** — wireless tempo and transport sync with Ableton Live and other Link-capable apps

Configured in [Project & Settings → WiFi Settings](../project-and-settings/wifi-settings).

---

## SD Card

A microSD card slot on the bottom of the device holds all project data, kits, presets, and samples. Projects persist across power cycles.

{: .note }
> Power the device off before removing or inserting the SD card.

---

## Power

The **tbd 16** is powered over USB-C (5 V). Any standard USB-C power supply, USB battery pack, or computer USB port works.
