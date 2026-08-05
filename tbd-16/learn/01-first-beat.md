---
layout: default
title: "1 · Your first beat"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 1
lang: en
tbd_widgets: true
---

# Your first beat

Sixteen steps and one sound. That's where every groove starts.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="1" stage="Stage A — your first beat" status="live" status_label="Live device practice" %}

The players on this page are browser demos with simple synthesised drums — they teach the pattern, not the tbd 16's sound engines.

---

## Hear it

Press play.

{% include tbd-seq.html
   label="Four on the floor"
   tracks="kick"
   pattern="kick:1,5,9,13"
   bpm="120"
   controls="play"
   density="compact" %}

One sound, four hits, repeating forever. That is a complete, usable drum pattern — and it's the foundation of house, techno, disco and most other dance music ever made.

## Understand it

The row you just heard is **16 steps**, and 16 steps is **one bar** of music. Each step is a sixteenth note: the shortest thing you'll normally place.

Look at where the hits are — steps **1, 5, 9 and 13**. Those are the four beats you count when you tap your foot: *one, two, three, four*. That's why those four columns are drawn a little brighter than the rest. Everything else sits between the beats.

The demo splits the row into two groups of eight on purpose. So does the device: the **tbd 16** has 16 step buttons arranged as **two rows of eight**, so what you see here is what you'll see under your fingers.

## Try it here

Now the grid is live. Click a step to switch it on or off.

{% include tbd-seq.html
   label="Your turn"
   tracks="kick"
   pattern="kick:1,5,9,13"
   bpm="120"
   controls="play,bpm" %}

Three things worth actually doing:

- **Pull the tempo down to 90.** Same pattern, completely different mood.
- **Switch step 13 off.** Hear the hole where the fourth beat should be? Your ear was expecting it.
- **Switch every step on.** It stops being a beat and becomes a machine gun. Space is what makes a pattern feel like music.

{: .note }
> Clicking a step more than once cycles it through **on → accent → ghost → off**. Ignore that for now — accents come in [lesson 2](02-backbeat) and ghost notes in [lesson 5](05-swing).

## Now do it on your tbd 16

Here's the device with that pattern on it. This is a separate practice instrument, not a remote control for the examples above. Program its kick from the **Sound from your virtual tbd 16** grid or with the device buttons; both edit the same runtime state. **Reset pattern** restores the lesson's starting beat.

{% include tbd-practice-goal.html
   id="first-beat-goal"
   goal="Confirm the kick on steps 1, 5, 9 and 13, press PLAY, then change one step and use Reset pattern to recover."
   follow="seq-first-beat-device" %}

{% include tbd-seq.html
   id="seq-first-beat-device"
   label="Sound from your virtual tbd 16"
   tracks="kick"
   panel_tracks="1:kick"
   pattern="kick:1,5,9,13"
   bpm="120"
   controls="device"
   panel_monitor="true" %}

{% include tbd-panel.html
   steps="1,5,9,13"
   oled="sound_page0"
   runtime="groovebox-dev"
   highlight="play"
   follow="seq-first-beat-device"
   caption="Live GrooveBox — change the steps, then press PLAY." %}

1. **Power on.** The device boots into the **Sound** screen with `Stp` shown at the top — step mode, where the 16 buttons draw a pattern.

2. **You're already on Track 1.** Track 1 is the **Kick** track and boots with **Synth Kick20**. This first exercise deliberately enables only that track. Press **→** and the OLED says **Disabled for this example**; press **←** to return to Track 1.

3. **Press step buttons 1, 5, 9 and 13.** Their LEDs light up. Remember the layout: the top row is steps 1–8, the bottom row is steps 9–16, so you're pressing the first and fifth button of each row.

4. **Press PLAY.** That's your pattern, looping.

5. **Set the tempo.** Press **FUNC2** to open **OUTPUT**, then press **LEFT** to move to **TEMPO**, and turn **Knob 1**. This is the same two-stage route as the production firmware.

Need the whole browser instrument louder or quieter? Stay on **OUTPUT** and
turn **Knob 4 (Master)** before moving left to Tempo. It changes the production
Master value and the sound from the virtual device together.

> **Preview scope:** Master is the Global Sound control connected to browser
> audio in this first preview. Input has no virtual input source yet, and the
> Delay and Reverb returns update the real OLED state but are not audible yet.
{: .note }

{% include tbd-panel.html
   highlight="func2,left,knob1"
   oled="tempo"
   caption="FUNC2 opens OUTPUT; LEFT opens TEMPO. Knob 1 sets BPM." %}

## You now have

A pulse. It's not a beat yet — for that you need something answering the kick, which is exactly what the next lesson is about.

---

**Next:** [2 · The backbeat](02-backbeat)

**Want the hardware details?** [Quick Start](../getting-started/quickstart) · [Navigation](../getting-started/navigation) · [Synth Kick](../machines/synth-kick)
