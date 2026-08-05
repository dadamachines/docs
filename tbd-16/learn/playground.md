---
layout: default
title: "▶ Playground"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 16
lang: en
tbd_widgets: true
tbd_panel: true
tbd_playground: true
---

# Playground

No lesson, no right answer. Thirty-three classic patterns, a live device, and every step yours to change.
{: .fs-6 .fw-300 }

Load a groove, hear what makes it work, then take it apart. Everything on this
page is a starting point — there is nothing here you can break.

{: .note }
> The device below is the real thing: **← →** move between tracks, the OLED and
> the step LEDs are the runtime's own output. The sounds you hear are generic
> browser drums, not the tbd 16's engines — see
> [Machines]({{ '/tbd-16/machines/' | relative_url }}) for what it actually has
> on board.

{% include tbd-playground.html
   id="playground"
   label="Playground"
   tracks="kick,snare,clap,rim,hhc,hho,ride,shk"
   panel_tracks="1:kick,2:snare,3:clap,4:rim,5:hhc,6:hho,7:ride,8:shk"
   pattern="kick:1,5,9,13|clap:5,13|hho:3,7,11,15"
   steps="16"
   bpm="124"
   caption="Press ← → on the device to move between tracks. The step buttons and the grid below are the same pattern." %}

## How to use it

Pick a **genre**, pick a **pattern**, press **Load pattern**. Then press play
and start changing things while it runs — that is the fastest way to hear what
each part is doing.

Three things worth trying on any pattern you load:

1. **Mute a track.** Click a row name to silence it. Take the hats out of a
   house beat and you will hear how much of the groove they were carrying.
2. **Move one hit.** Drag a kick one step later. Most grooves live or die on a
   single note being early or late.
3. **Turn up the swing.** Anything in the hip-hop, garage or funk sections wants
   it. Straight sixteenths become a shuffle somewhere around 20–40%.

## Where the patterns come from

These are the standard drum-machine grooves that circulate freely among
producers — the same set often published as *Pocket Operations*. They are
starting points that generations of records were built on, not rules.

Each pattern loads its own tempo, and some load swing too, because a groove at
the wrong tempo teaches the wrong thing.

## One bar, sixteen steps

Everything here is a single bar, the same sixteen steps the device shows on its
step buttons — so what you see in the grid and what the device shows are always
the same pattern.

That is not much of a limit. Almost every groove in the list above is one bar
repeating; what makes them sound different from each other is *which* sixteen
steps, not how many.

---

Ready to build one from scratch instead? Start at
[lesson 1]({{ '/tbd-16/learn/01-first-beat' | relative_url }}).
