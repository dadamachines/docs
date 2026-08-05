---
layout: default
title: "2 · The backbeat"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 2
lang: en
tbd_widgets: true
---

# The backbeat

One more sound, in exactly two places, turns a pulse into a beat.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="2" stage="Stage A — your first beat" status="live" status_label="Live device practice" %}

**You now have:** a kick on steps 1, 5, 9 and 13 on Track 1.

---

## Hear it

{% include tbd-seq.html
   label="Kick and snare"
   tracks="kick,snare"
   pattern="kick:1,5,9,13|snare:5,13"
   bpm="118"
   controls="play" %}

The snare lands on steps **5 and 13** — beats **2 and 4**. That's the backbeat, and once you've heard it you'll hear it in almost every song you know.

## Understand it

The kick sits on the beat and tells you where the floor is. The snare answers it on the *off* beats, and the tension between the two is what makes a beat feel like it's moving rather than just ticking.

It's such a strong pattern that you can strip everything else away and still be recognisably in a genre. Kick on 1 and 9 instead of all four beats, snare still on 5 and 13, hats through the middle — say it out loud as *"boots and cats and boots and cats"* and you've got it:

{% include tbd-seq.html
   label="Boots 'n' cats"
   tracks="kick,snare,hhc"
   pattern="kick:1,9|snare:5,13|hhc:1,3,5,7,9,11,13,15"
   bpm="118"
   controls="play,bpm" %}

Notice the kick has moved. It's no longer on every beat — it plays on 1 and 3 (steps 1 and 9) and leaves beats 2 and 4 to the snare. Two instruments taking turns.

## Not every hit is equal

Click a step twice and it becomes an **accent** — a white ring, and noticeably louder. Click again for a **ghost note**, much quieter than normal.

{% include tbd-seq.html
   label="Flat vs. shaped"
   tracks="kick,snare"
   pattern="kick:1,5,9,13|snare:5,13"
   variant_b="kick:1!,5,9,13|snare:5!,8~,13!"
   variant_labels="Flat,Shaped"
   bpm="118"
   controls="play" %}

Switch between **Flat** and **Shaped** while it loops. Same steps in almost the same places — but the second one has a loud downbeat, hard snares, and a quiet extra snare hit on step 8 that you feel more than hear. That quiet hit is a *ghost note*, and it's most of what people mean when they say a beat has "feel".

## Now do it on your tbd 16

The examples above and the virtual device below are separate instruments: editing one never silently changes another. In **Sound from your virtual tbd 16**, you can program all practice tracks directly or use the device buttons. Both controls edit the same device state. **Reset pattern** restores this exercise's starting beat.

{% include tbd-practice-goal.html
   id="backbeat-goal"
   goal="Keep the Kick on steps 1, 5, 9 and 13. Add the Snare on steps 5 and 13."
   follow="seq-backbeat-device"
   target="1:1,5,9,13|3:5,13"
   labels="1:Kick|3:Snare"
   success="Backbeat complete — press PLAY and listen to Kick and Snare together." %}

{% include tbd-seq.html
   id="seq-backbeat-device"
   label="Sound from your virtual tbd 16"
   tracks="kick,kick2,snare,clap"
   panel_tracks="1:kick,2:kick2,3:snare,6:clap"
   pattern="kick:1,5,9,13"
   bpm="120"
   controls="device"
   panel_monitor="true" %}

The device still shows **one track at a time**. The grid keeps every exercise track visible and audible. A grid row always edits its matching device track; tracks outside this exercise remain navigable but the OLED identifies them as **Disabled for this example**.

{% include tbd-panel.html
   steps="1,5,9,13"
   oled="sound_page0"
   runtime="groovebox-dev"
   follow="seq-backbeat-device"
   highlight="right,play"
   caption="Live GrooveBox — → twice selects Track 3; add steps 5 and 13, then press PLAY." %}

1. **Press the → arrow twice** to get to **Track 3**. Track 3 is the **Snare** track, running the **Digital Snare** machine.

2. **Press step buttons 5 and 13.** Press **PLAY** — kick and snare together.

3. **Check your work.** Press **←** twice to go back to Track 1 and confirm the kick is still there. The track number is in the top-left of the display, next to the machine name.

4. **Try Track 6 too.** Track 6 is **Clap**. Put a clap on 5 and 13 alongside the snare — layering a clap over a snare is how most house and techno records get that big backbeat.

## You now have

A beat: kick, snare, and a sense of where beats 2 and 4 are. It's still stiff, because nothing is happening between the beats. That's next.

---

**Next:** [3 · Hats and the in-between](03-hats) · **Previous:** [1 · Your first beat](01-first-beat)

**Want the hardware details?** [Digital Snare](../machines/digital-snare) · [Clap](../machines/clap) · [Navigation](../getting-started/navigation)
