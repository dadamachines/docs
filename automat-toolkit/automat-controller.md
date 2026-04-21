---
layout: default
title: automat controller
parent: automat toolkit
has_children: true
nav_order: 2
---

# automat controller
{: .fs-9 }

The heart of the automat toolkit — a plug-and-play MIDI-to-solenoid controller with 12 universal DC outputs.
{: .fs-6 .fw-300 }

There are two versions in the family:

- **automat controller** *(original / MK1)* — the one that started it all. MIDI in, solenoids out. This page covers its inputs, outputs and specs.
- **[automat controller MK2]({{ site.baseurl }}/automat-toolkit/automat-controller/mk2/)** — same hardware concept, now with a **USB host port** and a **standalone mode** so you can drive it from a Novation Launchpad with no computer. *Coming soon.*

![automat controller floating](../../../images/automat-toolkit/dada_automat-top_float.jpg)

## Input
- **DC Powered** – Power Supply 9V–24V – DC Barrel Plug 2.5 × 5.5 mm Center Positive – 8 A max current (protected by 5×20 mm Cartridge Fuse / *Feinsicherung*).
- The Power Supply shipped with the automat toolkit is 24 V / 160 W / 6.6 A (first batch) or 24 V / 120 W / 5.0 A (current batches).
- **USB Powered** – for development and hacking only; outputs cannot drive actuators over USB power alone.

## Output
- Each DC output channel is limited to 1.4 A.
- DC outputs mirror the supply voltage you feed the automat (default 24 V, allowed range 9–24 V).
- Output connectors: 2.1 × 5.5 mm DC jacks, center positive (9–24 V on center pin).
- Switching MOSFETs are fully protected (overload, short-circuit, overvoltage, current-limit, thermal shutdown with auto-restart).
- Each output has a flyback diode for protection against inductive loads.