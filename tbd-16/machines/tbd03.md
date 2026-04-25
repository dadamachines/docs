---
layout: default
title: Acid Bass (TBD-03)
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 10
---

# Acid Bass (TBD-03)

A TB-303-style acid bass voice — Braids macro-oscillator driven through a choice of analog-modelled diode-ladder filters, with a dedicated filter envelope and 303-style accent.
{: .fs-6 .fw-300 }

**Available on:** Track 7
**Built on:** Mutable Instruments **Braids** `MacroOscillator` + CTAG diode-ladder filter models.

---

## Character

Braids provides the tonal source — saw, square, FM, and many other Braids synthesis models via the **Shape** knob. A filter-envelope drives the cutoff for the squelchy 303 character. Accent sharpens short decays and lifts gain per step. Five filter variants range from classic ZDF to Karlson to Blaukraut for different flavours of acid grit.

{: .warning }
> **Gotchas before you tweak:**
> - **Slide** is not yet wired in the firmware — setting per-step slide currently has no audible effect. Tracked as a follow-up DSP task. Use pitch glides via tied steps as a workaround.
> - **Accent** is a per-track toggle controlled by the Accent knob (and P-lockable per step). Any knob value above 0 turns accent ON. For alternating-step 303 accent patterns, parameter-lock the Accent knob on the steps you want accented.

---

## Parameters

Two macros ship for this machine — pick the one that matches how you want to perform:

- **`td3-allparams`** — full 15-knob access across four pages (below). Use for deep sound design.
- **`td3-acidbass`** — 4-knob performance macro: `Squelch` / `Grit` / `Envelope` / `Accent`. Each knob fans out to multiple underlying DSP ctrls so one twist changes a whole aspect of the sound at once. Use for live tweaking and P-lock automation.

### `td3-allparams` page layout (4/4/4/3)

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Osc** | Shape | Timbre | Color | Warp |
| **Filter** | Cutoff | Reso | Type | Drive |
| **Mod** | Env Amt | Tim EG | Col EG | Acc Lev |
| **Env** | VCA Dec | VCF Dec | Accent | — |
{: .dada-minimal-table }

### Osc

| Parameter | What it does |
|:----------|:-------------|
| **Shape** | Braids synthesis model (47 shapes, same catalogue as Mono Synth). `SAW\|SQR` (shape 2) is the classic acid starting point. |
| **Timbre** | Braids parameter 0 (model-specific). Hi-res 14-bit. |
| **Color** | Braids parameter 1 (model-specific). Hi-res 14-bit. |
| **Warp** | Signature waveshaper amount — adds analog-style fold/grit at the oscillator stage. Hi-res 14-bit. |
{: .dada-minimal-table }

### Filter

| Parameter | What it does |
|:----------|:-------------|
| **Cutoff** | Filter cutoff frequency. Hi-res 14-bit with log curve for smooth sweeps. |
| **Reso** | Filter resonance — crank for squelch. Hi-res. |
| **Type** | Filter topology 0–4: `0` ZDF-Boost (aggressive), `1` Karlson (warm), `2` Blaukraut (vintage), `3` Pirkle ZDF (clean), `4` Zavalishin (modern). |
| **Drive** | Filter input drive / soft-clip gain 1×–30×. Hi-res. |
{: .dada-minimal-table }

### Mod

| Parameter | What it does |
|:----------|:-------------|
| **Env Amt** | Filter-envelope amount — how much the VCF envelope opens the cutoff. Classic 303 squelch lives here. Hi-res. |
| **Tim EG** | VCF envelope → Timbre modulation amount. Hi-res. |
| **Col EG** | VCF envelope → Color modulation amount. Hi-res. |
| **Acc Lev** | Accent level — extra cutoff boost when Accent is ON. Hi-res. |
{: .dada-minimal-table }

### Env

| Parameter | What it does |
|:----------|:-------------|
| **VCA Dec** | Amplitude envelope decay, 0–5 s exponential. Hi-res. |
| **VCF Dec** | Filter envelope decay, 0–5 s exponential (Accent shortens this to 0.5 s for per-step sharpness). Hi-res. |
| **Accent** | `OFF`/`ON` — per-track accent toggle. Shortens VCF Dec and boosts VCA gain + cutoff when ON. Lock per-step for 303-style accent patterns. |
{: .dada-minimal-table }

{: .note }
> **Dialing a classic acid bass**:
> 1. Set **Shape** to `SAW\|SQR` (2).
> 2. **Cutoff** around 30–60 %, **Reso** at 80 %+.
> 3. **VCF Dec** short (10–25 %), **VCA Dec** short-to-medium.
> 4. **Env Amt** high (60 %+) for the squelch sweep.
> 5. Lock **Accent ON** on alternating steps for 303-style groove.

---

## Performance macro (`td3-acidbass`) — four knobs, many CCs

The performance macro collapses the 15-knob "all params" layout down to **four knobs** that each fan out to the underlying DSP ctrls. Good for quick tweaking and parameter-locked acid lines where one knob shifts multiple sonic attributes together.

All four source knobs are hi-res (14-bit NRPN) — each click is a distinct DSP step.

| Knob | Fans out to |
|:-----|:------------|
| **Squelch** | Cutoff (log sweep across full range) + Reso (3000 → 13000) + Env Amt (5000 → 15000). The primary 303-character knob. |
| **Grit** | Warp (full range) + Drive (0 → 12000). Adds oscillator-side shaping + filter overdrive together. |
| **Envelope** | VCA Dec + VCF Dec + Release — longer envelopes for sustained parts, shorter for staccato. |
| **Accent** | Accent toggle (0 = OFF, any value > 0 = ON) + Acc Lev intensity (0 → 12000). At 0, clean sound with full VCF Dec; above 0, accent kicks in proportionally. |
{: .dada-minimal-table }

The non-modulated params (Shape, Timbre, Color, filter Type) are held at `td3-acidbass` fixed defaults (`SAW|SQR`, moderate Timbre, ZDF-Boost filter). Use `td3-allparams` if you need to vary those.

## Factory presets

| Preset | Macro | Character |
|:-------|:------|:----------|
| `Classic` | `td3-acidbass` | 303-style SAW squelch, cutoff sweeps high, moderate grit + accent. |
| `Dirty` | `td3-acidbass` | Aggressive cutoff, cranked grit + drive + accent. Harder hitting. |
| `AcidBass` | `td3-allparams` | Neutral defaults across every knob for dialling sounds from scratch. |
{: .dada-minimal-table }

---

## See also

- [Mono Synth](mono-synth) — same Braids oscillator without the 303-style filter path.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — essential for acid programming (lock Accent per-step, automate Cutoff / Env Amt sweeps).

<div class="origin-card" markdown="1">

## Origin & credits

CTAG's **TBD-03** engine. Combines Mutable Instruments **Braids** `MacroOscillator` (Émilie Gillet, MIT-licensed) with CTAG's own analog diode-ladder filter models and a 303-style envelope + accent engine by Robert Manzke (GPL 3.0).

- DSP sources: `braids/macro_oscillator.h`, `filters/ctagDiodeLadderFilter*.hpp`
- TBD-16 wrapper: `rack/RackTBD03.hpp` / `.cpp`
- Related reading: [Mutable Instruments Braids manual](https://pichenettes.github.io/mutable-instruments-documentation/modules/braids/manual/)

</div>
