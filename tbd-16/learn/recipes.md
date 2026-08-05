---
layout: default
title: "★ Genre recipes"
parent: Learn
grand_parent: tbd 16 groovebox
nav_order: 15
lang: en
tbd_widgets: true
---

# Genre recipes

Complete starting points: which track, which machine, which knobs, which steps.
{: .fs-6 .fw-300 }

{: .note }
> This page is being written. Two recipes are shown in full below as the format; the rest are outlined.

Each recipe is a place to start, not a rule. Build it, then break it.

---

## House · 124 BPM

{% include tbd-seq.html
   label="Classic house"
   tracks="kick,clap,hho,hhc"
   pattern="kick:1,5,9,13|clap:5,13|hho:3,7,11,15|hhc:2,4,6,8,10,12,14,16~"
   bpm="124"
   controls="play,bpm,swing" %}

| Track | Machine | Steps | Knobs |
|:--|:--|:--|:--|
| 1 Kick | Analog Bass Drum | 1 · 5 · 9 · 13 | `Decay` long, `Tone` low–mid |
| 6 Clap | Clap | 5 · 13 | `Decay` mid |
| 4 Hat | Hi-Hat 1 | 3 · 7 · 11 · 15 | `Decay` long — the offbeat "tss" |
| 9 Bass | TBD03 | root notes under the kick | `Cutoff` mid, `Reso` mid, `Env Amt` mid |
{: .dada-minimal-table }

Four on the floor, clap on the backbeat, and open hats on every offbeat. The long kick decay is what makes it *house* rather than techno — see [lesson 4](04-sound).

---

## Techno · 134 BPM

{% include tbd-seq.html
   label="Techno"
   tracks="kick,hho,hhc"
   pattern="kick:1,5,9,13,15~|hho:3,7,11,15|hhc:10"
   bpm="134"
   controls="play,bpm" %}

| Track | Machine | Steps | Knobs |
|:--|:--|:--|:--|
| 1 Kick | Synth Kick | 1 · 5 · 9 · 13, plus a ghost on 15 | `Decay` **short**, `Tone` mid–high, `Dirt` up |
| 2 Kick2 | FM Kick | layer on 1 only | short `carDec` |
| 4 Hat | Hi-Hat 1 | 3 · 7 · 11 · 15 | `Decay` short |
{: .dada-minimal-table }

The extra quiet kick just before the bar ends is the whole trick — it pushes you into the next bar. Short decay everywhere; techno is about space between hits, not sustain.

---

## Planned recipes

| Genre | BPM | The idea |
|:--|:--|:--|
| **Acid** | 130 | TBD03 on Track 9, `Cutoff` low and `Reso` high, slide and accent doing the work |
| **Boom bap** | 88 | Kick and snare on the backbeat, ghost snares, swing at ~20% |
| **Trap** | 140 | Halftime — clap on step 9 only, 808 kick with very long decay, hat rolls via `Rep.` |
| **Drum & bass** | 174 | An Amen-style break from the factory LOOPS bank, chopped with `Start` locks |
| **Dub** | 75 | One drop — no kick on step 1, delay `Feedback` high, filter sweeps on the Audio In |
| **Disco / funk** | 118 | Four on the floor, open hats on the offbeat, syncopated bass, live-recorded percussion |
{: .dada-minimal-table }

---

<div class="origin-card" markdown="1">

## Sources & further reading

The rhythms on this page are common practice — four on the floor, the 2-and-4 backbeat, the dembow, the one drop and the clave are shared musical vocabulary, in some cases centuries old, and belong to no one.

The selection and the wording here are our own, arranged to follow the order these lessons teach in. Where a pattern is associated with a specific recording we describe it by feel rather than by title, and **no audio from any recording is used** — every sound on this page is synthesised live in your browser.

Worth your time if you want to go deeper:

- **Pocket Operations** — a free booklet of drum patterns for small hardware, and the inspiration for building this page at all. [shittyrecording.studio](https://shittyrecording.studio/){:target="_blank"}
- René-Pierre Bardet, *260 Drum Machine Patterns*
- Zoro, *The Commandments of R&B Drumming*
- Rick Latham, *Advanced Funk Studies*

</div>

---

**Previous:** [14 · Arrange and perform](14-arrange) · **Back to** [Learn](./)
