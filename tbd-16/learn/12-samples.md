---
layout: default
title: "12 · Samples"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 12
lang: en
---

# Samples

Four tracks that will play anything you give them.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="12" stage="Stage D — make it a track" status="planned" status_label="Planned" %}

**You now have:** drums, bass, lead and chords — a full arrangement's worth of parts.

{: .new }
> **Firmware note.** Parts of the sampling workflow described here are on a development branch. The Rompler, kits, banks and slices work today.

{: .note }
> This lesson is being written. The outline below is what it will cover.

## Planned outline

- **Tracks 7, 8, 13 and 14 are Rompler tracks** — sample players. Tracks 7 and 8 will also run **WavPlayer**, which streams longer files instead of holding them in memory.
- The structure: a **kit** holds **4 banks × 32 slices**. One kit is active at a time and every Rompler track draws from it.
- Page 1 of the Rompler is `Bank`, `Slice`, `Start`, `End` — choose the sound, then choose how much of it you play.
- The factory kit's four banks: **DRUMS** (kicks, snares, hats, toms, percussion), **OTHER** (synth stabs, pads, vocal fragments), **A4 DUB**, and **LOOPS** — five Amen-style breakbeats at 165–175 BPM.
- **Chopping a loop:** put an Amen break on a Rompler track, then use `Start` and `End` — with parameter locks from [lesson 7](07-plocks) — to play a different slice of it on each step. This is where jungle came from, and it's four locks' worth of work.
- `Speed` and `TStrch` on page 2: the difference between playing a loop faster and playing it at a different pitch.
- A sampler-focused project can turn most tracks into Rompler tracks, laid out across the banks — a completely different instrument for sample-based production.
- Getting your own samples onto the device: the WebUI file manager, and USB disk mode.

The finished exercise will provide a deterministic sample kit, let the learner
choose a loop and its start point, place it on the grid, and Reset the result.

---

**Next:** [13 · Space and mix](13-mix) · **Previous:** [11 · Chords and harmony](11-chords)

**Reference:** [Rompler](../machines/rompler) · [Project & settings](../project-and-settings/) · [WebUI](../webui/)
