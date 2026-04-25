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
> - **Slide** is not yet wired in the firmware — setting per-step slide currently has no audible effect. Tracked as a follow-up DSP task. Use pitch glides via tied steps as a workaround.
> - **Accent** is a per-track toggle controlled by the Accent knob (and P-lockable per step). Any knob value above 0 turns accent ON. For alternating-step 303 accent patterns, parameter-lock the Accent knob on the steps you want accented.
> - **Tim EG, Col EG, Acc Lev are conditional knobs** — they only produce audible change when their dependencies are in place. See [Conditional modulation knobs](#conditional-modulation-knobs) below.

---

## Parameters

Two macros ship for this machine — pick the one that matches how you want to perform:

- **`td3-allparams`** — full 15-knob access across four pages (below). Use for deep sound design. Preset picker shows these as `F Default` / `F Acid` (F = Full parameter set).
- **`td3-acidbass`** — 4-knob performance macro: `Squelch` / `Grit` / `Envelope` / `Accent`. Each knob fans out to multiple underlying DSP ctrls so one twist changes a whole aspect of the sound at once. Use for live tweaking and P-lock automation. Preset picker shows these as `P Classic` / `P Dirty` (P = Performance).

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
| **Timbre** | Braids parameter 0 (model-specific). Hi-res 14-bit. *See note on base-level headroom below if using Tim EG.* |
| **Color** | Braids parameter 1 (model-specific). Hi-res 14-bit. *See note on base-level headroom below if using Col EG.* |
| **Warp** | Signature waveshaper amount — adds analog-style fold/grit at the oscillator stage. Hi-res 14-bit. |
{: .dada-minimal-table }

### Filter

| Parameter | What it does |
|:----------|:-------------|
| **Cutoff** | Filter cutoff frequency. Hi-res 14-bit with log curve for smooth sweeps. |
| **Reso** | Filter resonance — crank for squelch. Hi-res. |
| **Type** | Filter topology: `0` ZDF-Boost (aggressive), `1` Karlson (warm), `2` Blaukraut (vintage), `3` Pirkle ZDF (clean). Four modes 0–3. *(A fifth internal mode exists in the DSP but is unreachable via macro — ignore until a firmware fix lands.)* |
| **Drive** | Filter input drive / soft-clip gain 1×–30×. Hi-res. |
{: .dada-minimal-table }

### Mod

| Parameter | What it does |
|:----------|:-------------|
| **Env Amt** | Filter-envelope amount — how much the VCF envelope opens the cutoff. Classic 303 squelch lives here. Hi-res. |
| **Tim EG** | VCF envelope → Timbre modulation amount. Hi-res. **Conditional — see below.** |
| **Col EG** | VCF envelope → Color modulation amount. Hi-res. **Conditional — see below.** |
| **Acc Lev** | Accent level — extra cutoff boost when Accent is ON. Hi-res. **Conditional — see below.** |
{: .dada-minimal-table }

### Env

| Parameter | What it does |
|:----------|:-------------|
| **VCA Dec** | Amplitude envelope decay, 0–5 s exponential. Hi-res. |
| **VCF Dec** | Filter envelope decay, 0–5 s exponential (Accent shortens this to 0.5 s for per-step sharpness). Hi-res. |
| **Accent** | `OFF`/`ON` — per-track accent toggle. Shortens VCF Dec and boosts VCA gain + cutoff when ON. Lock per-step for 303-style accent patterns. |
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

The preset picker name indicates which macro is behind the preset — `F` for the **Full** all-params macro (15 knobs), `P` for the **Performance** macro (4 knobs).

| Preset | Macro | Character |
|:-------|:------|:----------|
| `F Default` | `td3-allparams` | Neutral starting point across every knob. Timbre and Color kept modest so `Tim EG` / `Col EG` have audible headroom. |
| `F Acid` | `td3-allparams` | Classic 303 character — saw shape, dark low cutoff, high resonance, strong filter-env sweep, ~2 s VCA decay. |
| `P Classic` | `td3-acidbass` | 303-style SAW squelch, cutoff sweeps high, moderate grit + accent. |
| `P Dirty` | `td3-acidbass` | Aggressive cutoff, cranked grit + drive + accent. Harder hitting. |
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
