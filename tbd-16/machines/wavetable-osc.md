---
layout: default
title: Wavetable Osc
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 12
---

# Wavetable Osc
{: .no_toc }

A flexible wavetable oscillator with state-variable filter, ADSR, two LFOs and 32 onboard wavetables (64 waves each). Great for pads, leads and evolving textures.
{: .fs-6 .fw-300 }

**Available on:** Track 12 (Lead2) — default boot host. Selectable on Lead2 alongside other lead voices (TBDaits, Mono Synth).
**Built on:** Custom **CTAG** wavetable voice using the *Plaits* wavetable oscillator helper, a CTAG ADSR, an LFO, and ~33 KiB of PSRAM-cached wavetable data per active bank.

---

## Character

Two-dimensional wavetable scanning — pick a **Bank** (32 wavetables, each holding 64 waves) then sweep through **Wave** positions for evolving timbres. The ADSR + LFO can modulate wave position, oscillator FM, filter cutoff and amplitude — enough routing to build classic "moving pad" or "evolving bass" sounds wavetables are loved for.

A dedicated **Env-GFX** page shows the live ADSR shape as a graphic — knobs land directly on the curve so you can sculpt envelopes by eye.

{: .warning }
> **Gotchas before you tweak:**
> - **Bank-switch is heavy** — the active bank is preprocessed into PSRAM (~33 KiB). Changing **Bank** during playback briefly mutes the voice while the new wavetable is staged. Prefer locking Bank per pattern.
> - **Sync** is a toggle — affects LFO reset phase on note-on only.

---

## Parameters

The default Wavetable Osc performance macro is organised as **5 semantic pages × 4 knobs = 20 params**:

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Voice** | Bank | Wave | Tune | Gain |
| **Filter** | Type | Cutoff | Reso | EG Flt |
| **Env**\* | Attack | Decay | Sustain | Release |
| **EG Mod** | EG Wav | EG FM | LFO Spd | Sync |
| **LFO Mod** | L2 Wav | L2 AM | L2 FM | L2 Flt |
{: .dada-minimal-table }

\* The **Env** page renders as a live ADSR graph — see [Env-GFX page](#env-gfx-page) below.

### Voice

| Parameter | What it does |
|:----------|:-------------|
| **Bank** | Select wavetable (0–31). Each bank holds 64 waves. Bank label shows the wavetable name on the OLED. |
| **Wave** | Scan position within the current bank. Hi-res 14-bit for smooth wavetable sweeps. |
| **Tune** | Oscillator fine tuning, **bipolar ±12 semitones**. Centre = unity pitch. Hi-res. |
| **Gain** | Voice output gain, 0–100 % (linear). Hi-res. |
{: .dada-minimal-table }

### Filter

| Parameter | What it does |
|:----------|:-------------|
| **Type** | Filter mode — `Off` (bypass), `LP`, `BP`, `HP`. Default `LP`. |
| **Cutoff** | Filter cutoff frequency, log curve. Hi-res 14-bit. |
| **Reso** | Filter resonance (0 → 20×). Hi-res. |
| **EG Flt** | Envelope → Cutoff modulation depth, **bipolar ±1** — negative closes the filter on note-on, positive opens it. Hi-res. |
{: .dada-minimal-table }

### Env (ADSR)

A full attack / decay / sustain / release amplitude envelope shapes every note. The page renders as a live graph (see [below](#env-gfx-page)) but the four parameters behave normally — P-Lock and automation work as on any other parameter page.

| Parameter | What it does |
|:----------|:-------------|
| **Attack** | 0.5 ms – 5 s exponential, hi-res. |
| **Decay** | 0 – 10 s exponential, hi-res. |
| **Sustain** | Sustain level 0–100 %, hi-res. |
| **Release** | 0 – 10 s exponential, hi-res. |
{: .dada-minimal-table }

### EG Mod

Envelope → destinations + main LFO speed/sync controls.

| Parameter | What it does |
|:----------|:-------------|
| **EG Wav** | Envelope → Wave position, **bipolar ±1**. Negative swings the scan backward, positive forward. |
| **EG FM** | Envelope → Oscillator FM, **bipolar ±12 semitones**. |
| **LFO Spd** | LFO frequency in Hz, log curve, hi-res. Readout shows current Hz on the OLED. |
| **Sync** | `OFF` / `ON` — on note-on, reset LFO phase to 0 for rhythmic patches. |
{: .dada-minimal-table }

### LFO Mod

LFO → destinations. All unipolar 0–100 %.

| Parameter | What it does |
|:----------|:-------------|
| **L2 Wav** | LFO → Wave position scan depth. |
| **L2 AM** | LFO → Amplitude (tremolo). |
| **L2 FM** | LFO → Oscillator FM depth. |
| **L2 Flt** | LFO → Cutoff depth. |
{: .dada-minimal-table }

{: .note }
> **Recipes**:
> - **Evolving pad**: long Attack + long Release + slow LFO Spd + modest L2 Wav for wavetable drift.
> - **Plucky wavetable lead**: short Attack + short Decay + Sustain `0` + strong `EG Wav` for a swept transient on each note.
> - **FM bass**: short envelope + `EG FM` cranked (bipolar — try positive for up-sweep, negative for down-sweep).

---

## Env-GFX page

![wtosc-allparams — Env page](../../../images/tbd-16/wtosc_all_env.png){: .screenshot }

The **Env** page replaces the usual 4-column layout with a live ADSR graph drawn from the four envelope knobs:

- **Linear curve** segments connect the breakpoints (start → attack peak → decay end → sustain plateau → release end).
- **Outlined breakpoint dots** mark the A/D/S/R transitions.
- **Dashed vertical gutters** drop from each breakpoint so the time axis stays legible.
- **Knob labels** (`A` / `D` / `S` / `R`) and **values** stay in fixed bottom positions; only the curve shape moves with the knobs.
- **P-Lock**, **Automation** and **MIDI-mapped** indicators render as small overlays under the value, exactly as on the per-cell pages.

P-Lock, Automation and held-step parameter editing all work normally on this page — the graph is purely a visualisation; the underlying knobs are the same Attack / Decay / Sustain / Release params.

---

## Factory presets

| Preset | Character |
|:-------|:----------|
| `Default` | Plucky default — short A, medium D, Sustain 0, medium R, LP filter at moderate cutoff with a hint of resonance. Tune by ear from here. |
{: .dada-minimal-table }

---

## See also

- [TBDaits](tbdaits) — 24-engine macro voice on the same track (Lead2).
- [Mono Synth](mono-synth) — Braids macro-oscillator alternative on Lead.
- [PolyPad](polypad) — 24-voice polyphonic pad companion.

<div class="origin-card" markdown="1">

## Origin & credits

Custom CTAG wavetable voice by Robert Manzke (GPL 3.0). Built on Mutable Instruments **Plaits** wavetable oscillator helpers (MIT), with a CTAG ADSR + state-variable filter and 32 onboard wavetables.

- DSP sources: `plaits/dsp/oscillator/wavetable_oscillator.h`, `helpers/ctagSampleRom.hpp`, `helpers/ctagADSREnv.hpp`
- TBD-16 wrapper: `rack/RackWTOsc.hpp` / `.cpp`
- Related reading: [CTAG TBD plugins](https://ctag-fh-kiel.github.io/ctag-tbd/plugins/)

</div>
