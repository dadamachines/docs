---
layout: default
title: "11 · Chords and harmony"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 11
lang: en
---

# Chords and harmony

How to play in key without knowing any music theory — and what the theory is, once you want it.
{: .fs-6 .fw-300 }

{% include tbd-learn-progress.html lesson="11" stage="Stage C — add notes" status="planned" status_label="Planned" %}

**You now have:** drums, bass and a lead.

{: .new }
> **Firmware note.** The Harmony feature described here is on a development branch and has not reached a stable firmware build yet. Everything about **PolyPad** applies today.

{: .note }
> This lesson is being written. The outline below is what it will cover.

## Planned outline

### PolyPad — chords without harmony theory

**Track 15 is Chords**, running **PolyPad**, whose page 1 is:

| Knob | What it does |
|:--|:--|
| `Chord` | Which chord shape is played from one note |
| `Inv` | Inversion — the same chord with a different note at the bottom |
| `Nnotes` | How many notes of the chord actually sound |
| `Detune` | Spread between the voices — small amounts thicken, large amounts wobble |
{: .dada-minimal-table }

Play one button, get a chord. Page 4 (`Spread`, `Tilt`, `Motion`, `Phase`) puts it in stereo.

### Harmony — the whole device in key

The planned Harmony exercise has three small ideas:

- **SETUP** — `MODE` (`OFF` / `QUANT` / `AUTO` / `FIXED`), `KEY` (C–B), `SCALE` (Major, Natural Minor, Harmonic Minor, Dorian, Mixolydian), `KEYS` (`PIANO` or `SCALE`).
- **CHORD** — `QUALITY` (Maj / Min / Sus4 / Dim / Aug) and `VOICE` (inversion, −2 to +2).
- **PLAY** — for machines that have to play a chord one note at a time: `RATE`, `ORDER` (up / down / up-down) and `STYLE` (arp or strum).

The two ideas that matter:

1. **`QUANT` mode means you cannot play a wrong note.** Every note is pulled to the nearest note in the key. With scale keys, the 16 buttons become scale degrees, so the whole grid is in key.
2. **The engine adapts to the machine.** PolyPad plays a real chord; the Wavetable Osc and TBDaits manage two voices, so you get a dyad; the Rompler retriggers pitches in sequence. The overlay's headline tells you which is happening.

Also planned: why minor sounds sad and Dorian doesn't quite; picking a key that suits your bassline; and the `RNot2` / `RNot3` fields in the Step Editor as a way to get chords out of a mono track.

---

**Next:** [12 · Samples](12-samples) · **Previous:** [10 · Lead sounds](10-lead)

**Reference:** [PolyPad](../machines/polypad) · [TBDaits](../machines/tbdaits) · [Step editing](../sequencer/step-editing)
