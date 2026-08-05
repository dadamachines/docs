---
layout: default
title: "4 · Make it sound great"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 4
lang: en
tbd_widgets: true
---

# Make it sound great

Four knobs shape the active parameter page. Learn the common sound concepts,
then let the OLED tell you what each machine puts under your hands.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="4" stage="Stage A — your first beat" status="live" status_label="Live device practice" %}

**You now have:** a groove — kick, snare, hats — that plays correctly and sounds like nothing in particular.

---

## Read the machine, not a generic template

Many drum machines reuse **Freq**, **Tone**, and **Decay**, but they do not all
put them in the same slots. The virtual device now follows each production
machine's real pages. On the **Synth Kick** first page you get:

| Knob | What it does | Turn it up and… |
|:--|:--|:--|
| **Freq** | The pitch of the drum | it gets higher and smaller |
| **Tone** | Bright versus dull | it gets sharper and cuts through more |
| **Decay** | How long it rings | it goes from a tick to a boom |
{: .dada-minimal-table }

Other machines rearrange or replace controls for their synthesis method:

- **Digital Snare:** `Freq / Decay / FM / Snap`
- **Hi-Hat 1:** `Freq / Tone / Decay / Noise`
- **Clap:** `Freq / Tone / Decay / Scale`
- **FM Kick:** dedicated Carrier, Modulator, and Mode pages

The reusable skill is knowing what pitch, brightness, length, and character do
to a drum—not memorising four positions that are not universal. Use **UP/DOWN**
to move between the active machine's production pages.

## Turn them yourself

Below is the kick from lesson 1 with those four knobs wired up. Press play and turn them while it loops.

{% include tbd-seq.html
   label="Synth Kick — page 1"
   tracks="kick"
   pattern="kick:1,5,9,13"
   knobs="kick:freq,tone,decay,dirt"
   bpm="124"
   controls="play,bpm" %}

Drag a knob up or down, or focus it and use the arrow keys. Try this in order:

1. **Decay all the way down.** A dry click. Useful, but it's not holding the floor.
2. **Decay up past halfway.** Now it booms and sustains under everything.
3. **Freq down, Decay still long.** Deep and heavy — this is where the low end of a track lives.
4. **Tone up.** The click at the front comes back. That click is how a kick stays audible on a phone speaker, where there's no bass at all.
5. **Dirt up.** Saturation. It gets angrier without getting louder.

## Decay is a genre control

Nothing separates a house kick from a techno kick as reliably as **Decay**.

| Sound | Freq | Tone | Decay |
|:--|:--|:--|:--|
| **Techno** — short, hard, hits and gets out of the way | low | mid–high | **short** |
| **House** — round and warm, rings into the next beat | low–mid | low–mid | **long** |
| **Trap 808** — a bass note more than a drum | very low | low | **very long** |
{: .dada-minimal-table }

Set the widget above to the techno row, listen for a bar, then drag Decay up to the house setting. Same pattern, same tempo, different record.

## Then the hats

The same three knobs, and one more genre lever. On a hat, **Decay** is the difference between *closed* and *open*:

{% include tbd-seq.html
   label="Hat — page 1"
   tracks="hhc"
   pattern="hhc:1,3,5,7,9,11,13,15"
   knobs="hhc:freq,tone,decay,noise"
   bpm="124"
   controls="play" %}

- **Decay short** — a tight tick. Sits underneath everything.
- **Decay long** — it rings into the next step and the pattern starts to blur. This is exactly how you make the offbeat open hat from [lesson 3](03-hats), without needing a second sound.
- **Freq up** — thinner and more metallic; **down** — closer to a shaker.
- **Noise down** — more tone, less hiss. Turn it well down for something more like a bell.

## Try this

- In the kick player above, make the same pattern sound like **techno** with short Decay, then like **house** with longer Decay. Change nothing but the knobs.
- Turn the kick's **Freq** right up. It stops being a kick and becomes a tom. Most drum machines are one knob away from being a different drum.
- In the hat player, set **Decay** long and **Freq** low. Keep the rhythm on steps 3, 7, 11 and 15 for an offbeat house texture.

## Practice on your virtual tbd 16

This practice starts on the Synth Kick from Lesson 1. The four physical knobs
change the production values on the OLED, and those same runtime values shape
the sound you hear. **Reset pattern** restores the four kick steps; reload the
lesson whenever you want the factory parameter values again.

{% include tbd-seq.html
   id="seq-sound-device"
   label="Sound from your virtual tbd 16"
   tracks="kick"
   panel_tracks="1:kick"
   pattern="kick:1,5,9,13"
   bpm="124"
   controls="device"
   panel_monitor="true" %}

{% include tbd-panel.html
   steps="1,5,9,13"
   oled="sound_page0"
   runtime="groovebox-dev"
   follow="seq-sound-device"
   highlight="knob1,knob2,knob3,knob4,play"
   caption="Live GrooveBox — press PLAY, then shape the Synth Kick with Knobs 1–4." %}

1. Press **PLAY** so the kick repeats while you edit it.
2. Turn **Knob 3 (Decay)** down for a short click, then above halfway for a longer boom.
3. Turn **Knob 1 (Freq)** down and listen for the kick becoming deeper.
4. Bring **Knob 2 (Tone)** up to restore the attack, then add character with **Knob 4 (Dirt)**.

The OLED is the source of truth: its values come from the production runtime,
and the browser audio follows those values. The separate examples above remain
independent so you can compare them without changing your virtual device.

## You now have

A groove that sounds like something—and a method for reading and shaping each
machine instead of assuming every machine has the same layout. That's Stage A
done.

Stage B is about *feel*: why a perfectly programmed pattern can still sound like a computer, and what to do about it.

---

**Next:** [5 · Swing and accents](05-swing) · **Previous:** [3 · Hats and the in-between](03-hats)

**Want the hardware details?** [Synth Kick](../machines/synth-kick) · [Hi-Hat 1](../machines/hi-hat-1) · [Sound parameters](../sound-and-tracks/sound)
