---
layout: default
title: "3 · Hats and the in-between"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 3
lang: en
tbd_widgets: true
---

# Hats and the in-between

The kick and snare tell you where the beat is. The hats tell you how fast it's moving.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="3" stage="Stage A — your first beat" status="live" status_label="Live device practice" %}

**You now have:** a kick and a snare — a beat, but a stiff one.

---

## Hear it

{% include tbd-seq.html
   label="Eighth-note hats"
   tracks="kick,snare,hhc"
   pattern="kick:1,9|snare:5,13|hhc:1,3,5,7,9,11,13,15"
   bpm="118"
   controls="play" %}

The hat plays every other step — steps 1, 3, 5, 7 and so on. Eight hits in a bar, so: **eighth notes**. This is the single most common hi-hat pattern there is.

## Understand it

Kick and snare mark out the four beats. The hat fills in what happens *between* them, and by doing so it sets the speed you perceive — even though the tempo hasn't changed at all.

Switch between these two at the same BPM — and compare both against the eighth notes above:

{% include tbd-seq.html
   label="Quarters vs. sixteenths"
   tracks="kick,snare,hhc"
   pattern="kick:1,9|snare:5,13|hhc:1,5,9,13"
   variant_b="kick:1,9|snare:5,13|hhc:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16"
   variant_labels="Quarters,Sixteenths"
   bpm="118"
   controls="play" %}

Quarters feel slow and heavy. Sixteenths feel urgent and busy — sixteenths on a closed hat is a big part of why trap and drill sound the way they do. Neither changed the tempo by a single BPM.

## The offbeat: where house comes from

There's a second hi-hat sound: the **open** hat, which rings on instead of stopping short. Put it on the *offbeats* — steps 3, 7, 11, 15, the "and" between each beat — and something specific happens:

{% include tbd-seq.html
   label="Closed vs. offbeat opens"
   tracks="kick,snare,hhc,hho"
   pattern="kick:1,5,9,13|snare:5,13|hhc:1,3,5,7,9,11,13,15"
   variant_b="kick:1,5,9,13|snare:5,13|hho:3,7,11,15"
   variant_labels="Closed 8ths,Offbeat opens"
   bpm="124"
   controls="play,bpm" %}

Switch between the two while it's looping. The second one is *house* — that "tss" landing exactly between the kicks is the genre's signature, and it works because the open hat is still ringing when the next kick arrives.

Once you've heard it you can build the same idea into anything. Same trick, faster and harder, and you're in techno.

## Practice on your virtual tbd 16

The Kick and Snare are already in place. Add an eighth-note closed hat on
Track 4. The grid and physical device edit the same runtime state, and **Reset
pattern** restores the starting Kick and Snare.

{% include tbd-practice-goal.html
   id="hats-goal"
   goal="Keep the Kick on 1, 5, 9 and 13 and the Snare on 5 and 13. Add the Hat on every odd-numbered step."
   follow="seq-hats-device"
   target="1:1,5,9,13|3:5,13|4:1,3,5,7,9,11,13,15"
   labels="1:Kick|3:Snare|4:Hat"
   success="Eighth-note hats complete — press PLAY and hear how they change the groove." %}

{% include tbd-seq.html
   id="seq-hats-device"
   label="Sound from your virtual tbd 16"
   tracks="kick,snare,hhc"
   panel_tracks="1:kick,3:snare,4:hhc"
   pattern="kick:1,5,9,13|snare:5,13"
   bpm="124"
   controls="device"
   panel_monitor="true" %}

{% include tbd-panel.html
   steps="1,5,9,13"
   oled="sound_page0"
   runtime="groovebox-dev"
   follow="seq-hats-device"
   highlight="right,play"
   caption="Live GrooveBox — select Track 4, add every odd-numbered step, then press PLAY." %}

1. Press **→** three times to select Track 4. The OLED shows the Hi-Hat track.
2. Switch on steps **1, 3, 5, 7, 9, 11, 13 and 15**.
3. Press **PLAY**. Watch the OLED and LEDs while Kick, Snare and Hat play together.
4. Remove a few hats and listen to the space they leave. Use **Reset pattern** to return to the lesson's starting state.

Made a mess? While the sequencer is playing, hold **FUNC5**. Steps on the
selected track are erased as the playhead passes over them; release **FUNC5**
when you want to stop erasing. This is the same live-clear gesture as on the
hardware, and **Reset pattern** still brings back this lesson's starting beat.

## Try this

- Take the hats **off the beats entirely** — only steps 3, 7, 11, 15. Sparse and springy.
- Put a hat on **every step except 1**. The hole at the start pulls your ear to the downbeat.
- Add a hat on step **16**, right before the loop restarts. It pushes you into the next bar.

## You now have

A groove: kick, snare, hats, and control over how fast it feels. What it doesn't have yet is a *sound* — right now every drum is sitting at whatever the factory left it at. Fixing that is the most valuable thing in Stage A.

---

**Next:** [4 · Make it sound great](04-sound) · **Previous:** [2 · The backbeat](02-backbeat)

**Want the hardware details?** [Hi-Hat 1](../machines/hi-hat-1) · [Machines](../machines/)
