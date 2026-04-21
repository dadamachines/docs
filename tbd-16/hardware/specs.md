---
layout: default
title: Technical Specifications
nav_order: 3
parent: Hardware
grand_parent: tbd 16 groovebox
---

# Technical Specifications

Hardware, audio, and interface specifications for the **tbd 16**.
{: .fs-6 .fw-300 }

---

## Overview

| Parameter | Value |
|:----------|:------|
| **Processors** | ESP32-P4 (DSP) · RP2350B (UI/MIDI) · ESP32-C6 (WiFi) |
| **Audio Codec** | TLV320AIC3254 — Stereo 24-bit ADC/DAC with embedded miniDSP |
| **Sample Rate** | 44.1 kHz (codec supports 8–192 kHz) |
| **Bit Depth** | 32-bit I2S bus · 32-bit float internal processing |
| **Processing Buffer** | 32 stereo frames (0.73 ms at 44.1 kHz) |
| **DAC SNR** | > 110 dB (A-weighted, measured) |
| **DAC THD+N** | 0.018% / −75 dB (1 kHz, 0 dBV, measured) |
| **ADC SNR** | 93 dB typical (codec datasheet) |
| **Channel Separation** | −83 dB (measured) |
| **Audio I/O** | Stereo line in · stereo line out · headphone out (all TRS 3.5 mm) |
| **MIDI** | 2× TRS In (Type-A) · 2× TRS Out · USB MIDI · USB Host MIDI |
| **USB Ports** | 3× USB-C · 1× USB-A Host |
| **Wireless** | WiFi 6 (ESP32-C6) · Ableton Link |
| **Storage** | 2× micro SD (P4 + RP2350) |
| **Display** | 2.4" OLED, 128 × 64 px |
| **Controls** | 30 buttons · 4 endless pots (with push-switch) · volume wheel |
| **LEDs** | 19 RGB LEDs |
| **Power** | USB-C (5 V) — works with any USB power bank or adapter |
| **Dimensions** | 110 × 110 × 25 mm |
| **Enclosure** | Anodized aluminum top, powder-coated steel base |
{: .dada-minimal-table }

## Processors

| Chip | Role | Core | Key Specs |
|:-----|:-----|:-----|:----------|
| **ESP32-P4** | DSP Engine | Dual RISC-V @ 400 MHz | 32 MB stacked PSRAM · 16 MB Flash · AI/vector instructions · USB 2.0 OTG |
| **RP2350B** | UI / MIDI | Dual Arm Cortex-M33 @ 150 MHz | 520 KB SRAM · 8 MB PSRAM · 48 GPIO · 12× PIO state machines · FPU + DSP |
| **ESP32-C6** | WiFi | Single RISC-V | WiFi 6 (802.11ax) · Bluetooth 5 · managed by the P4 |
{: .dada-minimal-table }

The P4 and RP2350B communicate via SPI. The RP2350B handles all UI input and MIDI and forwards control data to the P4; the P4 runs audio processing and sends status and Ableton Link data back.

## Audio Performance

The **tbd 16** uses the TLV320AIC3254 stereo audio codec from Texas Instruments.

### Firmware Defaults

| Parameter | Hardware Capability | Firmware Default |
|:----------|:-------------------|:-----------------|
| Sample rate | 8 kHz – 192 kHz | 44.1 kHz |
| I2S word length | 16 / 20 / 24 / 32 bit | 32 bit |
| Internal processing | — | 32-bit float |
| MCLK | — | 256 × fs = 11.29 MHz |
| DAC oversampling (DOSR) | — | 128 |
| ADC oversampling (AOSR) | — | 128 |
| Processing buffer | — | 32 stereo frames (0.73 ms) |
| DMA buffering | — | 4 × 32 frames (2.9 ms) |
{: .dada-minimal-table }

### Measured Performance (DAC, Line Output)

Measured with a MOTU UltraLite AVB reference interface and ARTA spectrum analyzer. Test signal: 1 kHz sine, output level calibrated to 0 dBV.

| Parameter | Left Channel | Right Channel |
|:----------|:-------------|:--------------|
| THD+N (1 kHz, 0 dBV) | 0.018% | 0.023% |
| SNR to first harmonic | ~80 dB | ~78 dB |
| SNR to noise floor | > 110 dB | > 110 dB |
| Noise floor (DAC muted) | > 120 dB | > 120 dB |
| Channel separation | −83 dB | −83 dB |
{: .dada-minimal-table }

## Sequencer

| Parameter | Value |
|:----------|:------|
| Tracks | 16 |
| Patterns per Track | 6 |
| Steps per Pattern | 1–64 |
| Song Positions | 32 (pattern chaining) |
| Audio Parameter Locks | Up to 24 per step |
| Mixer Parameter Locks | Up to 8 per step |
| Automation Types | Fixed, LFO (sine), Random |
| Pattern Types | Normal, Arpeggiator, Euclidean |
| Tempo Range | 30–300 BPM |
| Shuffle | 0–100% |
| Time Signature | 1/1 to 16/16 |
| DSP Plugins | 50+ (synths, effects, drum machines, granular engines) |
{: .dada-minimal-table }

## MIDI

| Connection | Details |
|:-----------|:--------|
| **TRS MIDI In 1** | TRS 3.5 mm Type-A input for keyboards, sequencers, and controllers |
| **TRS MIDI In 2 / Clock** | Second TRS 3.5 mm Type-A input; doubles as Clock/Reset input for Eurorack and modular sync |
| **TRS MIDI Out 1** | TRS 3.5 mm Type-A output for sending MIDI to external gear |
| **TRS MIDI Out 2** | Second TRS 3.5 mm Type-A output |
| **USB MIDI** | Class-compliant USB MIDI via USB-C (no drivers required on any OS) |
| **USB Host MIDI** | Connect MIDI controllers directly via USB-A Host Port |
{: .dada-minimal-table }

All TRS connections follow the [TRS Type-A standard](https://minimidi.world/) — no adapters or special cables needed.

### MIDI Modes (per port)

None · Sync · Notes · Sync+Notes

### MIDI Channel Assignments

| Tracks | Channel | Type |
|:-------|:--------|:-----|
| 1–3 | 10 | Drums |
| 4–6 | 11 | Drums/Percussion |
| 7–8 | 12 | Rompler |
| 9–11 | 1–3 | Mono Synth |
| 12 | 4 | Wavetable |
| 13 | 5 | Rompler/Arp |
| 14–15 | 6–7 | Poly Synth |
| 16 | 8 | Audio Input |
{: .dada-minimal-table }

## USB Ports

| Port | Function |
|:-----|:---------|
| **USB-C #1** | ESP32-P4 Device (High Speed): USB MIDI, USB Network (web interface without WiFi), firmware flashing via JTAG |
| **USB-C #2** | Additional power and/or RP2350 Device |
| **USB-C #3** | ESP32-P4 JTAG (front panel) |
| **USB-A** | USB Host Port for MIDI controllers and other USB peripherals |
{: .dada-minimal-table }

## User Interface

| Component | Details |
|:----------|:--------|
| Display | 2.4" OLED, 128 × 64 px, wide viewing angles |
| Encoders | 4 endless pots with push-switch and RGB LED rings |
| Step Buttons | 16 backlit RGB buttons |
| Function Keys | 6 (FUNC1–FUNC6) |
| Arrow Buttons | 4 (↑ ↓ ← →) |
| Transport | PLAY + RECORD |
| Modifier Keys | SHIFT + HYPER |
| Status LEDs | 19 RGB LEDs total |
| Volume | Dedicated volume wheel (headphone output) |
{: .dada-minimal-table }

## Connectivity

| Feature | Details |
|:--------|:--------|
| Audio In | Stereo line input (TRS 3.5 mm) |
| Audio Out | Stereo line output (TRS 3.5 mm) |
| Headphone | Stereo headphone output (TRS 3.5 mm) with volume wheel |
| MIDI | 2× TRS In (Type-A) · 2× TRS Out · USB MIDI · USB Host MIDI |
| USB | 3× USB-C · 1× USB-A Host |
| WiFi | WiFi 6 (802.11ax) via ESP32-C6 |
| Sync | Ableton Link (wireless tempo/transport) |
| Storage | 2× micro SD (P4: config/samples/web UI · RP2350: firmware/user data) |
{: .dada-minimal-table }

## Inter-Processor Communication

| Bus | Speed | Purpose |
|:----|:------|:--------|
| SPI (Real-time) | 30 MHz | Note/CC data, audio sync (GPIO 28–31) |
| SPI (State API) | — | Configuration, screenshots (GPIO 32–35) |
| I2C | 400 kHz | STM32 input data (SDA=38, SCL=39, addr 0x42) |
| I2S WS Sync | 44.1 kHz | Audio codec word-select sync (GPIO 27) |
{: .dada-minimal-table }

## Power

| Parameter | Value |
|:----------|:------|
| Input | USB-C, 5 V |
| Compatibility | Any USB power bank or adapter |
| Portable | Ships with powerbank mount accessory |
{: .dada-minimal-table }
