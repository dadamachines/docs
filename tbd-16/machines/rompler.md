---
layout: default
title: Rompler
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 14
---

# Rompler

Sample-playback engine for drum kits, one-shots and sliced loops. Each of the six Rompler tracks plays back its own slice from the track's loaded sample kit.
{: .fs-6 .fw-300 }

**Available on:** Track 10 – 15 (shared kit)  
**Built on:** Custom **CTAG** sample-playback voice — filter, envelope, time-stretch, pitch-shift and slice playback.

---

## Character

A full sample-playback voice with independent filter, envelope, pitch and speed — plus optional time-stretching and ping-pong looping. The six Rompler tracks share a single sample kit loaded from the SD card, with each track playing a different slice. Load new kits from the **Change Track Setup** menu.

---

## Parameters

### Playback

| Parameter | What it does |
|:----------|:-------------|
| **slice** | Which slice within the loaded kit to play |
| **startOffsetRelative** | Start position within the slice (0–1) |
| **lengthRelative** | Length of playback within the slice (0–1) |
| **playbackSpeed** | Playback speed (without changing pitch when time-stretch is on) |
| **pitch** | Pitch offset |
{: .dada-minimal-table }


### Loop

| Parameter | What it does |
|:----------|:-------------|
| **loop** | Enable looping |
| **loopPiPo** | Ping-pong loop mode |
| **loopMarker** | Loop point within the playback section |
{: .dada-minimal-table }


### Filter

| Parameter | What it does |
|:----------|:-------------|
| **filterType** | None / LP / BP / HP |
| **cutoff** | Cutoff frequency |
| **resonance** | Filter resonance |
{: .dada-minimal-table }


### Envelope & modulation

| Parameter | What it does |
|:----------|:-------------|
| **a** | Attack time |
| **d** | Decay time |
| **gate** | Gate / one-shot mode |
| **egFM** | Envelope → pitch FM |
{: .dada-minimal-table }


### Lo-fi & time-stretch

| Parameter | What it does |
|:----------|:-------------|
| **bitReduction** | Bit-depth reduction (lo-fi crush) |
| **timeStretchEnable** | Enable time-stretch |
| **timeStretchWindowSize** | Time-stretch window size |
{: .dada-minimal-table }

{: .tip }
> Because the six Rompler tracks share one kit, reloading a kit swaps all six sounds at once. Think of the kit as the "drum machine" and each track as a dedicated pad.

---

## See also

- [Change Track Setup]({{ site.baseurl }}/tbd-16/sound-and-tracks/change-track-setup) — loading sample kits.
- [Project & Settings]({{ site.baseurl }}/tbd-16/project-and-settings/project) — how kits are stored on the SD card.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG sample-playback voice (`synthesis/RomplerVoiceMinimal.hpp` / `.cpp`) by Robert Manzke (2020, GPL 3.0). Uses Mutable Instruments pitch-shifting helpers (`mifx/pitch_shifter_mono.h`, MIT) and `stmlib` filters.

- DSP sources: `synthesis/RomplerVoiceMinimal.hpp` / `.cpp`, `mifx/pitch_shifter_mono.h`, `helpers/ctagSampleRom.hpp`
- TBD-16 wrapper: `rack/RackRompler.hpp` / `.cpp`

</div>
