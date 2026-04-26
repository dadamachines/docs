---
layout: default
title: Audio Input
parent: Machines
grand_parent: tbd 16 groovebox
nav_order: 15
---

# Audio Input

Stereo audio passthrough with built-in input processing — bring an external instrument, mic, synth or turntable into the TBD-16 signal chain, shape it with Gain / Mono / HP / Drive, run it through a resonant multi-mode filter with envelope follower, send it through the mixer and FX bus, and automate any of it with per-step parameter locks.
{: .fs-6 .fw-300 }

**Available on:** Track 16 (only)  
**Built on:** Custom CTAG `RackInput` voice with post-ADC digital processing + the shared mixer strip.

---

## Signal path

```
Audio jack IN
    │
    ▼
TLV320AIC3254 codec ADC              ← global sensitivity: WebUI → Device Settings → Audio Config
    │
    ▼
RackInput DSP  (Input page)          ← per-preset digital processing
    │  • Gain  (–60 dB .. +24 dB digital gain)
    │  • Mono  (stereo ↔ mono collapse)
    │  • HP    (0–500 Hz high-pass pre-filter, log curve)
    │  • Drive (tanh soft-clip saturation, 1× – 4×)
    ▼
RackInput SVF  (Filter page)         ← resonant multi-mode filter with env-follower
    │  • Type    (Off / LP / BP / HP — bypass when Off)
    │  • Cutoff  (20 Hz .. 12 kHz, log curve)
    │  • Reso    (0 .. ~20 Q)
    │  • Env     (0..100% envelope-to-cutoff, up to 4-octave sweep)
    ▼
ch16 mixer strip  (TR.MIX page)      ← per-track mix into the main bus
    │  • LEVEL (–60 dB to +12 dB fader)
    │  • PAN   (L / C / R balance)
    │  • FX1   (send to effect bus 1 — typically Delay)
    │  • FX2   (send to effect bus 2 — typically Reverb)
    ▼
Master bus → Output
```

The **Input page** shapes the signal right after it enters the P4 (gain staging, mono fold, rumble filter, optional drive). The **Filter page** adds a resonant multi-mode state-variable filter with an envelope follower for auto-wah / dub-style effects. The **TR.MIX page** is the standard per-track mixer strip available on every track and sends the processed result into the main mix, send buses, and FX chain. All three pages accept step-level parameter locks.

---

## Parameters — Input page

![Audio Input — INPUT page](../../../images/tbd-16/inp_input.png){: .screenshot }

| Parameter | What it does |
|:----------|:-------------|
| **Gain**  | Pre-fader digital gain, **rendered as a dB fader** (same bar+numeric readout style as TR.MIX LEVEL). Range **–60 dB to +24 dB** — the extra +18 dB vs TR.MIX LEVEL is there to accommodate weak sources like dynamic mics and passive instrument DIs. Factory default is **0 dB unity** so a freshly-loaded Audio In preset passes the signal through at its codec level. Pull left to attenuate or mute, push right to boost up to +24 dB before the mixer. Hi-res 14-bit. |
| **Mono**  | `OFF` / `ON`. Folds a stereo source down to mono (`(L + R) / 2` sent to both outputs). Essential when only one input channel is connected — otherwise the unconnected channel's noise gets into the signal. |
| **HP**    | High-pass filter cutoff, 0 – 500 Hz, log curve. At 0 the filter is bypassed; above ~20 Hz it starts cutting DC, rumble and mains hum. Hi-res 14-bit. One-pole design (gentle 6 dB/oct slope). |
| **Drive** | Tanh soft-clip saturation. At 0 the signal passes clean; cranked to full it produces warm analog-style overdrive that compresses peaks and adds harmonics. Hi-res 14-bit. |
{: .dada-minimal-table }

{: .tip }
> **For mic or guitar in**: turn **Gain** up and **HP** up ~30–80 Hz to cut hum, leave **Mono** ON (if using one channel), **Drive** low for clean, higher for grit.
> 
> **For line-level synth in**: **Gain** near centre, **HP** off, **Mono** OFF (stereo), **Drive** to taste.

---

## Parameters — Filter page

![Audio Input — Filter page](../../../images/tbd-16/inp_filter.png){: .screenshot }

A proper state-variable filter (SVF) sitting after Drive, with a built-in envelope follower that lets the input signal's own dynamics open the cutoff — classic auto-wah / dub-siren territory without tying up a dedicated CV source.

| Parameter | What it does |
|:----------|:-------------|
| **Type**   | `Off` / `LP` / `BP` / `HP`. `Off` bypasses the SVF entirely — the input page output goes straight to the mixer. `LP` = low-pass (darkens), `BP` = band-pass (isolates a frequency band), `HP` = high-pass (brightens, cuts sub content). The Type knob also accepts per-step P-locks, so you can switch modes on specific steps. |
| **Cutoff** | Corner frequency, 20 Hz – 12 kHz, log curve. Hi-res 14-bit. Clamped to 12 kHz to stay safely below Nyquist. |
| **Reso**   | Resonance, 0 – ~20 Q. At 0 the filter is maximally damped; at full the filter self-emphasises around the cutoff for a vocal / squelchy character. Hi-res 14-bit. |
| **Env**    | Envelope-to-cutoff amount, 0 – 100 %. At 0 the filter tracks Cutoff directly. Crank it up and the input signal's amplitude opens the cutoff upward — up to ~4 octaves of sweep at max signal + max amount. The envelope follower is fixed at 5 ms attack / 100 ms release, musical for auto-wah without sounding gated. Hi-res 14-bit. |
{: .dada-minimal-table }

{: .tip }
> **Dub siren**: Type = `LP`, Cutoff about a third up, Reso near max, Env at 0. P-lock Cutoff to a rising value across 4 steps.
> 
> **Auto-wah guitar**: Type = `BP`, Cutoff low (200–400 Hz), Reso mid-high, Env ~50 %. Playing louder opens the filter.
> 
> **Remove low rumble from a field recording**: Type = `HP`, Cutoff ~80–200 Hz, Reso = 0, Env = 0.

The filter runs per-channel on L and R independently, using a TPT / Cytomic state-variable topology (the same style of SVF used in most modern digital filter plugins). Switching Type to `Off` truly bypasses the filter — no CPU cost, no signal coloration — so leaving the preset with filter off is free.

---

## Parameters — TR.MIX page

![Audio Input — TR.MIX page](../../../images/tbd-16/track_mixer.png){: .screenshot }

Every track — including Input — has a **TR.MIX** page as the last page after the machine's own parameter pages. Navigate to it with the parameter-page arrows (`<` / `>` on the encoder row).

| Parameter | What it does |
|:----------|:-------------|
| **LEVEL** | Channel fader into the main mix. The fader uses a console-style squared curve — wire 0 = silence (`off` on the OLED), wire 64 (mid, default) = **0 dB unity** (signal passes through unchanged), wire 127 = **+12 dB** boost. Below wire ~10 the OLED reads "−60" or "off". Drop fully left to mute, push past mid to amplify the input above unity. The dedicated **Mute** button / pattern-mute system is the faster way to cut the track and correctly silences the Input's continuous audio regardless of LEVEL. |
| **PAN**   | Stereo balance, `L` / `C` / `R`. Works on stereo sources too (reduces the opposite channel). |
| **FX1**   | Aux send to effect bus 1 (delay). Same scale as LEVEL: wire 0 = `off`, wire 64 = unity, wire 127 = +12 dB. |
| **FX2**   | Aux send to effect bus 2 (reverb). Same scale as LEVEL. |
{: .dada-minimal-table }

Together these four provide the classic channel-strip controls. For more elaborate routing (swapping what's on FX1/FX2, changing FX parameters, adjusting bus levels), see [Mixer & Effects]({{ site.baseurl }}/tbd-16/mixer-and-effects/).

---

## Sequencer integration

The Input track is a fully-featured sequencer track. You get:

- **Parameter locks** on every Input-page, Filter-page and TR.MIX-page knob. Set a knob value on a held step and the value fires only when the sequencer hits that step.  
  *Example — tempo-synced filter sweep*: P-lock **Cutoff** to 200 Hz on every 4th step, 8 kHz on the others. The input audio gets chopped into a filtered pulse pattern.  
  *Example — per-step filter mode*: P-lock **Type** to `Off` on even steps and `LP` on odd steps for a stutter effect.
- **Track mute** silences the Input instantly (TR.MIX **Mute** button or **Pattern + step** on the Pattern/Mute overlay). Unlike the other tracks — which mute by suppressing note triggers — the Input track's mute gates the mixer itself, so continuous passthrough audio is cut the moment mute engages.
- **Pattern chains, song mode, scenes** — the Input track follows the pattern/song like every other track.
- **MIDI-CC automation** — you can route external MIDI CCs to any Input-page, Filter-page or TR.MIX parameter via the MIDI mapping page; the sequencer records and plays those lanes on the Input track.

{: .note }
> **Per-step "gate"**: the Input passes audio continuously — it has no note-on trigger. For rhythmic gating, P-lock **LEVEL** (TR.MIX) or the **Filter Type** knob per step (set Type to `Off` on silent steps).

---

## Factory preset

| Preset | Character |
|:-------|:----------|
| `Audio in` | Unity gain, stereo, filter off, no drive. A clean transparent passthrough — shape from here. |
{: .dada-minimal-table }

---

## Where in the signal chain — gain stages on the Input path

The Input track has up to **three** independent gain points before the master bus:

| Stage | Range | Where to touch it |
|:------|:------|:------------------|
| **Input page → Gain** | −60 .. +24 dB digital | Per-preset, accepts P-locks. The wide +24 dB ceiling (vs LEVEL's +12 dB) is for weak sources — dynamic mics, passive instrument DIs, low-output line gear. Default 0 dB unity. |
| **Input page → Drive** | 1× .. 4× tanh | Per-preset, soft-clip saturation that adds harmonics + tames peaks. Default off. |
| **TR.MIX → LEVEL** | off .. +12 dB | Per-track mixer fader, accepts P-locks, the live mixing knob. Default 0 dB unity. |
{: .dada-minimal-table }

Set **Input Gain** for source matching ("how hot does this mic / synth want to drive the device?"), then ride **LEVEL** on TR.MIX during the song. **Drive** is a creative tone tool — leave it off for clean passthrough.

The codec's analog input PGA is configured at boot from `sdcard_image/user/config/device.json` and is not currently exposed as a runtime control on the OLED. Most users won't need to touch it; the digital Gain stage covers the typical −60 .. +24 dB range for any reasonable line-level or dynamic-mic source.

---

## See also

- [Hardware / Connections]({{ site.baseurl }}/tbd-16/hardware/connections) — physical input wiring.
- [Mixer & Effects]({{ site.baseurl }}/tbd-16/mixer-and-effects/) — FX routing and TR.MIX reference.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — step-level automation.

<div class="origin-card" markdown="1">

## Origin & credits

The Input machine is a custom CTAG `RackInput` voice — a P4 DSP block that takes the codec's audio-in buffer, applies the post-ADC processing chain, and writes the result into the rack output where the per-track mixer strip picks it up. The wrapper builds on the CTAG-tbd plugin pattern by Robert Manzke / CTAG (GPL 3.0). The Gain / Mono / HP / Drive stage was added in 2026-04 to give the Input track a usable parameter page; the resonant SVF + envelope follower + track-mute-gate landed later the same month.

**Per-block DSP order** (in `RackInput::Process`):

1. Optional mono fold (`(L + R) / 2` to both channels) when **Mono** is on.
2. Linear gain × `gain` where `gain = 10^(dB/20)` and `dB = -60 + (in_gain/4095) × 84` — the same formula as the OLED dB readout, so what you see is what's applied.
3. One-pole high-pass at the **HP** cutoff (0..500 Hz, linear in DSP; the macro applies a `log` curve at the authoring layer for perceptual feel).
4. `tanhf(sample * drive)` soft-clip when **Drive > 1.02×**.
5. SVF stage when **Type** ≠ Off:
   - Envelope follower with 5 ms attack / 100 ms release coefficients tracking `|post-drive sample|`.
   - Cutoff modulated up to 4 octaves: `mod_fc = base_fc * 2^(env_amount × env_level × 4)`, clamped to 18 kHz.
   - TPT (Cytomic / Andy Simper) state-variable filter, one pair of integrators per channel — gives `LP` / `BP` / `HP` outputs from the same internal state.

Default values at boot: Gain = 0 dB unity (`in_gain = 2925`), Mono off, HP 0 Hz (bypassed), Drive 1× (bypassed), Type Off (SVF bypassed), Cutoff 12 kHz (open), Reso 0, Env 0.

- TBD-16 wrapper: `components/ctagSoundProcessor/rack/RackInput.cpp` + `.hpp`
- SVF topology: TPT / Cytomic state-variable (Andy Simper), one pair of integrators per channel.

</div>
