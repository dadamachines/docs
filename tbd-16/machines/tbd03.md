---
layout: default
title: TBD03
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 10
---

# TBD03

A TB-303-style acid bass voice — Braids macro-oscillator driven through a choice of analog-modelled diode-ladder filters, with a dedicated filter envelope and 303-style accent.
{: .fs-6 .fw-300 }

**Available on:** Tracks 9 and 10
**Built on:** Mutable Instruments **Braids** `MacroOscillator` + CTAG diode-ladder filter models.

---

## Character

Braids provides the tonal source — saw, square, FM, and many other Braids synthesis models via the **Shape** knob. A filter-envelope drives the cutoff for the squelchy 303 character. Accent sharpens short decays and lifts gain per step. Four filter variants range from classic ZDF to Karlson to Blaukraut for different flavours of acid grit.

{: .warning }
> **Gotchas before you tweak:**
> - **Drive** only audibly affects filter Type 0 (`PrZB` — Pirkle ZDF + Boost). On the other four filter types it shows `off` in the readout because the DSP doesn't apply gain to those filters. The encoder still works on any Type so you can pre-set Drive before switching to `PrZB`.
> - **Acc Lev** only matters when **Accent is ON**. With Accent off it reads `off` regardless of the knob position — encoder still works for pre-setting.
> - **Tim EG and Col EG are conditional knobs** — they only produce audible change when `VCF Dec` is up and base `Timbre` / `Color` have headroom. See [Conditional modulation knobs](#conditional-modulation-knobs) below.
> - **Slide** smooths pitch between connected notes (one-pole IIR, ~7 ms time constant). Glide is subtle but audible — toggle it on for tied 303-style runs, off for staccato lines.

---

## Macros

One macro ships for this machine — `td3-allparams`. The full 16-knob deep-access layout across **4 pages** (Filter / Osc / Mod / Perf), with engine-aware conditional rendering on the Drive and Acc Lev knobs.

Earlier feature-test builds also shipped a `td3-hybrid` 3-page layout and a `td3-acidbass` 4-knob performance macro. Those have been retired in favour of focusing the redesign effort on a single well-tuned page layout — every parameter is reachable from `td3-allparams`, and the new conditional renderers (Drive `off` when Type ≠ `PrZB`; Acc Lev `off` when Accent off) make the deeper macro readable enough that the simplified hybrid no longer earns its keep.

---

## `td3-allparams` — page layout (4/4/4/4)

The deep-access macro. Every shipped TBD03 sound exposing the full parameter surface uses this layout. The May 2026 redesign reorganised the pages around live-performance flow — the filter section sits up front because that's where the daily 303 squelch tweaks happen.

| Page | Knob 1 | Knob 2 | Knob 3 | Knob 4 |
|:-----|:-------|:-------|:-------|:-------|
| **Filter** | Cutoff | Reso | Env Amt | VCF Dec |
| **Osc** | Shape | Timbre | Color | Warp |
| **Mod** | Tim EG | Col EG | Acc Lev | Accent |
| **Perf** | Type | Drive | Slide | VCA Dec |
{: .dada-minimal-table }

### Filter

![td3-allparams — Filter page](../../../images/tbd-16/td3_all_filter.png){: .screenshot }

The live-performance hot zone — these four knobs are the daily 303 squelch controls.

| Parameter | What it does |
|:----------|:-------------|
| **Cutoff** | Filter cutoff frequency, log-mapped 20 Hz → 22 kHz. Equal octaves per fraction of knob travel — sub-150 Hz region gets useful resolution instead of a dead zone. Hi-res 14-bit. |
| **Reso** | Filter resonance — crank for squelch. Hi-res. |
| **Env Amt** | Filter-envelope amount — how much the VCF envelope opens the cutoff. Classic 303 squelch lives here. Hi-res. |
| **VCF Dec** | Filter envelope decay, 0–5 s exponential (Accent shortens this to 0.5 s for per-step sharpness). Hi-res. |
{: .dada-minimal-table }

### Osc

![td3-allparams — Osc page](../../../images/tbd-16/td3_all_osc.png){: .screenshot }

Timbre selection + waveshaping. Pick the shape and base timbre, then dial Warp for grit. The full 47-shape Braids catalogue is reachable across the knob travel (`res:10` matches Mono Synth's encoder feel — one click ≈ one shape).

| Parameter | What it does |
|:----------|:-------------|
| **Shape** | Braids synthesis model (47 shapes, same catalogue as Mono Synth). `SAW\|SQR` (shape 2) is the classic acid starting point. |
| **Timbre** | Braids parameter 0 (model-specific). Hi-res 14-bit. *See note on base-level headroom below if using Tim EG.* |
| **Color** | Braids parameter 1 (model-specific). Hi-res 14-bit. *See note on base-level headroom below if using Col EG.* |
| **Warp** | Signature waveshaper blend (Mutable Instruments' Braids "signature" curve, deterministically seeded). Sweeps from clean to fully waveshaped. Hi-res 14-bit. **Default value 0** — the knob has no audible effect at rest; sweep upward to hear it. |
{: .dada-minimal-table }

### Mod

![td3-allparams — Mod page](../../../images/tbd-16/td3_all_mod.png){: .screenshot }

Modulation depth + accent emphasis. Both Tim EG / Col EG are filter-envelope-driven (require `VCF Dec > 0` to be audible). Acc Lev only matters when Accent is on.

| Parameter | What it does |
|:----------|:-------------|
| **Tim EG** | VCF envelope → Timbre modulation amount. Hi-res. **Conditional — see below.** |
| **Col EG** | VCF envelope → Color modulation amount. Hi-res. **Conditional — see below.** |
| **Acc Lev** | Accent intensity — extra cutoff boost when Accent is ON. Renders as `off` when Accent toggle is off. Hi-res. |
| **Accent** | `OFF`/`ON` — per-track accent toggle. Shortens VCF Dec and boosts VCA gain + cutoff when ON. Lock per-step for 303-style accent patterns. |
{: .dada-minimal-table }

### Perf

![td3-allparams — Perf page](../../../images/tbd-16/td3_all_perf.png){: .screenshot }

Filter character + groove — the set-and-forget knobs. Choose your filter, dial drive, decide on slide behaviour, set the amp envelope length. Type and Drive sit next to each other deliberately: Drive only audibly affects Type 0, so when you switch the filter you immediately see the Drive readout flip to `off` if it's no longer doing anything.

| Parameter | What it does |
|:----------|:-------------|
| **Type** | Filter topology — five modes: `PrZB` (Pirkle ZDF + Boost — aggressive, the only one that applies Drive), `Karl` (Karlson — warm), `Blau` (Blaukraut — vintage), `PrkZ` (Pirkle ZDF — clean, no boost), `Zav` (Zavalishin ZDF — modern). Snappy 5-detent encoder. |
| **Drive** | Filter input drive / soft-clip gain (Pirkle ZDF + Boost only). Reads `off` when Type ≠ `PrZB`. Hi-res. |
| **Slide** | `OFF`/`ON` — when ON, smooths pitch between consecutive notes (one-pole IIR, ~7 ms time constant). Subtle 303-style glide. P-lock per step for tied-note runs. |
| **VCA Dec** | Amplitude envelope decay, 0–5 s exponential. Hi-res. |
{: .dada-minimal-table }

---

## Conditional modulation knobs

Three knobs on the Mod page are **not broken if they seem quiet** — they require other parameters to be in the right position to produce audible change.

### Tim EG and Col EG

Both modulate the oscillator's timbre/color **by the VCF envelope**. Two conditions have to be met to hear them:

1. **`VCF Dec` must be > 0.** The modulation source *is* the filter envelope. With `VCF Dec` at zero there is no envelope to modulate from — `Tim EG` and `Col EG` appear dead regardless of their value.
2. **Base Timbre / Color needs headroom.** The modulation is *additive only* — it always adds on top of the base `Timbre` (or `Color`) setting, and the result clamps to the hardware max. If base `Timbre` is already high (say 70 %+ of the knob), the mod hits the ceiling immediately and the audible sweep is tiny. Lower the base and the same `Tim EG` value becomes dramatic.

A good starting combination for clearly-audible `Tim EG` / `Col EG`:
- `VCF Dec` around 20–30 % (≈ 0.5–1 s envelope).
- Base `Timbre` / `Color` at 15–25 %.
- `Tim EG` / `Col EG` at 50–80 % to hear the modulation sweep.

### Acc Lev

Gated on `Accent`. When `Accent = OFF` (the factory default for `F Default`), `Acc Lev` does nothing regardless of its value. Turn `Accent = ON` first, *then* dial `Acc Lev` to hear the extra filter-envelope punch on note-on. In live play, P-lock `Accent = ON` on the steps you want accented and leave `Acc Lev` at a fixed level on the sound knob.

---

## Accent: trigger flag + intensity dial

The TBD03 DSP has **two separate accent-related atomics**, exposed as two separate knobs on the Mod page:

| DSP atomic | Type | What it controls |
|:-----------|:-----|:-----------------|
| **`accent`** (ctrl 19) — `Accent` knob | **Binary** in practice — used as a boolean `if (td3_isAccent) { … }` in `RackTBD03::Process`. Any non-zero value = accent ON. | When ON at note-trigger: shortens VCF Decay to a fixed short value (`kAccentDecay`) and multiplies VCA gain by `kAccentVCAFactor`. The classic 303 "extra punch" on accented notes. |
| **`accent_level`** (ctrl 23) — `Acc Lev` knob | **Continuous** 0..1 (hi-res 14-bit). Renders `off` when Accent toggle is off. | How much extra cutoff modulation depth the accent adds. Higher = sharper, more dramatic accent sweep. |
{: .dada-minimal-table }

`Accent` is the *trigger flag* ("is this note accented?"); `Acc Lev` is the *intensity dial* ("how strong is the accent boost when it fires?"). For classic 303 accent-on-some-steps patterns: P-lock the `Accent` toggle to `ON` on the steps you want accented, and dial `Acc Lev` once on the song-level sound page.

---

{: .note }
> **Dialing a classic acid bass**:
> 1. Set **Shape** to `SAW\|SQR` (2).
> 2. **Cutoff** around 30–60 %, **Reso** at 80 %+.
> 3. **VCF Dec** short (10–25 %), **VCA Dec** short-to-medium.
> 4. **Env Amt** high (60 %+) for the squelch sweep.
> 5. Lock **Accent ON** on alternating steps for 303-style groove.

---

## Factory presets

| Preset | Macro | Character |
|:-------|:------|:----------|
| `F Default` | `td3-allparams` | Neutral starting point across the full 16-knob surface. Timbre / Color kept modest so `Tim EG` / `Col EG` have audible headroom. The TBD03 baseline; author your own variants on top via the WebUI Preset Manager. |
{: .dada-minimal-table }

---

## See also

- [Mono Synth](mono-synth) — same Braids oscillator without the 303-style filter path.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — essential for acid programming (lock Accent per-step, automate Cutoff / Env Amt sweeps).

<div class="origin-card" markdown="1">

## Origin & credits

CTAG's **TBD03** engine. Combines Mutable Instruments **Braids** `MacroOscillator` (Émilie Gillet, MIT-licensed) with CTAG's own analog diode-ladder filter models and a 303-style envelope + accent engine by Robert Manzke (GPL 3.0).

- DSP sources: `braids/macro_oscillator.h`, `filters/ctagDiodeLadderFilter*.hpp`
- TBD-16 wrapper: `rack/RackTBD03.hpp` / `.cpp`
- Related reading: [Mutable Instruments Braids manual](https://pichenettes.github.io/mutable-instruments-documentation/modules/braids/manual/)

</div>
