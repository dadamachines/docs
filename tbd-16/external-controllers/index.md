---
layout: default
title: External Controllers
parent: tbd 16 groovebox
nav_order: 10
has_children: true
has_toc: false
permalink: /tbd-16/external-controllers/
---

# External Controllers

Plug a Novation **Launchpad** or **Launchkey** into the tbd 16 and play the whole groovebox from the controller — steps, drums, keys, pattern launch and transport all work out of the box. No setup, no menus, no MIDI mapping.
{: .fs-6 .fw-300 }

---

## Two ways to use the USB-A port

1. **Any class-compliant USB MIDI device** — keyboards, pad controllers, external sequencers, drum machines. Plug it in, play, and its notes, CCs and clock feed straight into the active track on the tbd 16.
2. **Deeply integrated controllers** — Novation Launchpad and Launchkey get a full two-way integration: pad LEDs, display, transport, step editing and pattern launch all follow what you're doing on the groovebox.

---

## In this section

| Page | What it's for |
|:-----|:--------------|
| [Launchpad](launchpad) | Grid controller — steps, drum pads, pattern launch, chromatic keys |
| [Launchkey](launchkey) | Keyboard controller — keys, wheels, 16 pads, 8 knobs, transport |
{: .dada-toc-table }

---

## Connecting

1. Power up the tbd 16 and wait for the Groovebox app to boot.
2. Plug your controller into the **USB-A** port on the back.
3. The controller lights up after a moment — you're ready to play.

That's it. The tbd 16 recognises the model, switches it into the right mode and mirrors the sequencer onto its pads and LEDs automatically. Any other class-compliant USB MIDI device — keyboard, pad controller, external sequencer — also works, see [Plug-and-play MIDI](#plug-and-play-midi-everything-else) below.

---

## If something doesn't work

- **No lights on the controller** — unplug it, wait a couple of seconds, plug it back in.
- **Wrong colours or dim pads** — update your controller's firmware using **Novation Components**.
- **Device not detected** — some controllers only enumerate in a particular mode (e.g. "USB" vs "iPad" on a keyboard, or DAW vs standalone on an external sequencer). Try the alternative mode on the device.

---

## Plug-and-play MIDI (everything else)

The USB-A port is a standard USB MIDI host, so most class-compliant devices work without any setup:

- **MIDI keyboards** — any USB-class-compliant keyboard plays the active track. Velocity, pitch bend, mod wheel and sustain all pass through.
- **Pad controllers & drum pads** — velocity-sensitive pads play the active track.
- **External sequencers** — a sequencer like the **Arturia BeatStep Pro**, a hardware drum machine or another groovebox can be plugged in and will send notes (and optionally MIDI clock) into the tbd 16. This isn't the tbd 16's main use case, but it works: you can use it as a sound module at the end of a MIDI chain.
- **Foot controllers, wind controllers, guitar-to-MIDI boxes** — anything that speaks class-compliant MIDI over USB.

All incoming notes go to the **active track**, so switch tracks on the tbd 16 to play different sounds. Changes to CCs and program changes are accepted too and can be used for parameter locks where the current screen supports them.

{: .note }
> "Plug-and-play" here means class-compliant USB MIDI. Devices that ship with a vendor-specific driver for a computer (some DJ controllers, some audio interfaces) won't work because there's no driver on the tbd 16 to match.

---

## Using several controllers at once

With a **self-powered USB hub** the tbd 16 can talk to multiple devices in parallel. A common setup:

- **Launchpad** driving the grid — steps, drums, pattern launch.
- **Launchkey** (or any keyboard) on the keys.
- An external sequencer feeding MIDI clock and notes into the mix.

Either device can be hot-plugged without disturbing the others.
