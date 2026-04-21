---
layout: default
title: Input
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 15
---

# Input

Stereo audio passthrough for the physical line input. Lets you bring an external instrument or mic into the TBD-16 mixer, effects, mutes and pattern system.
{: .fs-6 .fw-300 }

**Available on:** Track 16  
**Built on:** Stereo audio passthrough — route the physical line input through the TBD-16 mixer and FX.

---

## Character

Transparent stereo passthrough — no synthesis, no parameters. The track behaves like any other track: level, pan, FX sends, mutes and step-gating.

---

## Parameters

This machine has no DSP parameters. All shaping happens in the [mixer]({{ site.baseurl }}/tbd-16/mixer-and-effects/) and master chain.

{: .tip }
> Pair Input with a step pattern and the track's gate to get tempo-synced stutter / gating effects on an external source.

---

## See also

- [Hardware / Connections]({{ site.baseurl }}/tbd-16/hardware/connections) — physical input wiring.
- [Mixer & Effects]({{ site.baseurl }}/tbd-16/mixer-and-effects/) — FX routing.

<div class="origin-card" markdown="1">

## Origin & credits

A minimal CTAG wrapper voice — audio input passed through the rack at voice level so it can participate in the mixer, FX, mutes and pattern system like any other track. By Robert Manzke / CTAG (GPL 3.0).

- TBD-16 wrapper: `rack/RackInput.hpp` / `.cpp`

</div>
