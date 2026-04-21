---
layout: default
title: Troubleshooting
nav_order: 12
parent: tbd 16 groovebox
has_children: false
---

# Troubleshooting

Common issues and solutions.
{: .fs-6 .fw-300 }

---

## Boot Issues

### Display shows "Waiting for P4+NCM..."

This is normal during startup — the device is initializing its audio engine. Total boot time is typically 30–50 seconds.

**If it stays on this screen for more than 60 seconds:**
- Power cycle the device (unplug and replug USB-C)
- Try a different USB cable or power source

### Device doesn't power on

- Ensure the USB-C cable supports data + power (some cables are charge-only)
- Try a different USB port or power source
- Check that the USB-C connector is fully seated

## No Sound

### Check the master mute

On the **Global Sound** screen, press **Knob 4** to toggle master mute. If you see a "MUTED" overlay on screen, the master output is muted.

### Check track mute

On the **Sound** or **Track** screen, press **SHIFT + ↓** to toggle the current track's mute state. On the **Pattern Select** screen, muted tracks have dimmed step buttons.

### Check mixer levels

Navigate to the **Global Sound** screen and verify:
- **Knob 4** (Master Level) is above 0
- Track levels are up — navigate to [Track Mixer](../sound-and-tracks/track-mixer) to check per-track volume

### Check that a pattern has notes

If the pattern is empty (no lit step buttons), no notes will trigger. Enter **Step Record** mode (press RECORD twice) and add some steps.

### Check the preset

Some presets may have parameters set to produce silence (e.g., volume at 0, filter fully closed). Try loading a different preset via **SHIFT + FUNC3**.

## MIDI Issues

### No MIDI data being sent or received

1. Go to **Settings → MIDI Settings**
2. Check that the relevant port is set to **Notes**, **Sync**, or **Sy+No** (not **None**)
3. Look for the status indicators:
   - `<` = data received successfully
   - `!` = data received but **ignored** (wrong mode)
   - `>` = data being sent
4. If you see `!`, change the port mode to include the message type you need

### External MIDI device not recognized (USB Host)

- The device must be class-compliant USB MIDI
- Only low-speed and full-speed USB devices are supported (not hi-speed)
- Check the USB-A port power — devices requiring more than 500mA may not work
- Try disconnecting and reconnecting the device

### MIDI clock out of sync

- Check that only **one** clock source is active. Having both Ableton Link and MIDI clock sync enabled on multiple ports can cause conflicts
- On the [Tempo](../sequencer/tempo) screen (page 2), verify the clock source is set correctly (Internal, MIDI-USB, or Link)

## WiFi / Network Issues

### Can't access Web UI

1. Check which WiFi mode is active in **Settings → WiFi**:
   - **Access Point mode**: Connect to the **tbd 16**'s WiFi network, then navigate to the mDNS hostname or IP
   - **USB NCM mode**: Connect via USB-C, then navigate to `http://192.168.4.1/`

2. For USB NCM, verify the network interface is up:
   - Check your computer's network settings for a `192.168.4.x` interface
   - The host should get IP `192.168.4.2`

### USB NCM not connecting

- Wait at least 30 seconds after boot
- Unplug and replug the USB-C cable
- Check your system's network interfaces for the NCM adapter
- On macOS, the interface should appear automatically

### Ableton Link not finding peers

- Ensure **tbd 16** and other Link devices are on the **same network**
- In USB NCM mode, your computer must bridge the network to other Link peers
- Check that Link is not set to **Off** in MIDI Settings

## Display Issues

### Screen is too dim or too bright

Navigate to **Settings → Display Settings** and adjust:
- **Min Brightness**: minimum display brightness
- **Max Brightness**: maximum display brightness
- **Gamma**: brightness curve

### LEDs above FUNC1/FUNC2 are distracting

Navigate to **Settings → Display Settings → Func LEDs** and set to **Off** to disable the status LEDs above the FUNC1 and FUNC2 buttons.

## Sequencer Issues

### Parameter lock values seem wrong or jumpy

This was a known issue that has been fixed. If you experience erratic p-lock behavior, ensure your firmware is up to date. The fix restored a guard that prevents encoder acceleration from being applied during p-lock editing.

### Pattern doesn't play all steps

Check the pattern length on the **Track Parameters** screen (Knob 2). The default length is based on the track setup, but can be changed from 1 to 64 steps.

### Steps are skipped randomly

This may be the **Chance** parameter. Open the Step Editor (long-press a step button) and check that Chance is set to 100% for steps that should always play. Values below 100% cause probabilistic step triggering.

## Project & Data

### Settings reset after firmware update

The configuration file version is checked on boot. If the firmware expects a newer config version, defaults are loaded automatically. This is normal after major firmware updates. Re-configure your settings and save.

### SD card not detected

- Power off, reseat the SD card, and power on again
- Ensure the SD card is formatted correctly (FAT32)
- Try a different SD card

## Utilities

The **Utilities** screen (accessible via Settings → System Menu → Utilities) provides diagnostic tools:

| Utility | Purpose |
|:--------|:--------|
| Button Tester | Verify all buttons register correctly |
| MIDI Debugger | View incoming/outgoing MIDI data in real-time |
| Reboot P4 | Restart the audio processor without rebooting the Pico |
| Reboot Pico + P4 | Full system restart |
{: .dada-minimal-table }
