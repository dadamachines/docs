---
layout: default
title: "7 · Parameter locks"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 7
lang: en
---

# Parameter locks

Where the tbd 16 stops being a drum machine and becomes an instrument.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="7" stage="Stage B — make it move" status="planned" status_label="Planned" %}

**You now have:** a groove that varies — chance, ratchets, per-step velocity.

{: .note }
> This lesson is being written. The outline below is what it will cover.

## Planned outline

Everything so far changed *whether* a step plays and *how loud*. A parameter lock changes **what the sound is** on one single step.

- A lock stores a different knob value for one step while every other step keeps the original value.
- What can be locked: any sound parameter and any mixer parameter (level, pan, FX1, FX2, filter).
- **96 lock slots per pattern.** The Step Editor shows how many you've used (`pl.ch. use: n/96`), which is plenty until you start locking four knobs on every step.
- The three moves worth learning first:
  - **Hat decay per step** — one long hat every four bars, all others short. Costs one lock, sounds like a second hat track.
  - **Kick pitch on the last step** — a rising or falling tail that pushes into the next bar.
  - **Filter opening across four steps** — the classic build, without touching a knob live.
- Building the *"dub siren"* from the [Audio In](../machines/input) page is the same idea: resonant filter, cutoff locked rising across four steps.
- Locks versus **automation lanes**: a lock is a fixed value on a fixed step; an automation lane is an LFO or random source that keeps moving. Eight lanes per track. Use locks for things you want exactly, lanes for things you want alive.
- The finished exercise will let you select one hat step, change its Decay,
  hear the result, and remove the lock again without leaving the page.

---

**Next:** [8 · Bass](08-bass) · **Previous:** [6 · Variation](06-variation)

**Reference:** [Parameter locks](../sequencer/plocks) · [Step editing](../sequencer/step-editing) · [Audio In](../machines/input)
