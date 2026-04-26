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

Every track — including Input — has a **TR.MIX** page as the last page after the machine's own parameter pages. Navigate to it with the parameter-page arrows (`<` / `>` on the encoder row).

| Parameter | What it does |
|:----------|:-------------|
| **LEVEL** | Channel fader into the main mix, –60 dB to +12 dB. Displayed in dB on the OLED. Pull fully left for silence; the dedicated **Mute** button / pattern-mute system is the faster way to cut the track and correctly silences the Input's continuous audio regardless of LEVEL. |
| **PAN**   | Stereo balance, `L` / `C` / `R`. Works on stereo sources too (reduces the opposite channel). |
| **FX1**   | Aux send to effect bus 1, –60 dB to +12 dB. Default bus 1 carries a delay / slapback effect. |
| **FX2**   | Aux send to effect bus 2, –60 dB to +12 dB. Default bus 2 carries a reverb. |
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
> **Per-step "gate"**: the Input passes audio continuously — it has no note-on trigger. For rhythmic gating, P-lock **LEVEL** (TR.MIX) or the **Filter Type** knob per step (set Type to `Off` on silent steps). True per-step recording-style gating is on the feature backlog (see [roadmap](#feature-roadmap)).

---

## Factory preset

| Preset | Character |
|:-------|:----------|
| `Audio in` | Unity gain, stereo, filter off, no drive. A clean transparent passthrough — shape from here. |
{: .dada-minimal-table }

---

## Two kinds of input gain — don't confuse them

TBD-16 has **two independent gain stages** on the input path, and they do different things:

| Layer | Where it lives | When to touch it |
|:------|:---------------|:-----------------|
| **Codec ADC gain** | WebUI → Settings → Audio Configuration → *Input Level* slider | **Once per device**, when you plug in a new source. Tune it so your loudest passage is just below clipping at the ADC (hardware-level sensitivity). |
| **Track Gain knob** | Input page, first knob, per preset | **Every session / per song**, for quick boosts, automation, and level matching against other tracks. Digital — won't add clipping if the ADC is already set correctly. |
{: .dada-minimal-table }

Setting the codec gain correctly once means the track Gain knob has full ±12 dB range to work with without running into noise or clipping.

---

## Feature roadmap

How our Input track compares to industry benchmarks and what's on the backlog.

### What we have

- 4-knob post-ADC DSP (Gain, Mono, HP pre-filter, Drive)
- 4-knob resonant SVF (Type, Cutoff, Reso, Env-follow)
- Mixer-layer Level / Pan / Send1 / Send2
- Per-step parameter locks on every knob (including filter mode and env amount)
- Track mute that actually silences continuous audio
- FX1/FX2 bus sends to master effects
- Pattern/song integration

### Common on similar devices — on our backlog

| Feature | Seen on | Status |
|:--------|:--------|:-------|
| Input **level meter + clipping warning** on the parameter page | most groovebox devices | planned (telemetry from P4 → OLED strip next to Gain, inverted-red when sample peak ≥ −1 dBFS) |
| 3-band EQ (Lo / Mid / Hi) | Elektron Digitakt/Octatrack, Pioneer Toraiz | future DSP page (EQ sits alongside the existing Filter, different job: static tonal shaping vs dynamic cutoff sweeps) |
| Compressor / limiter with ratio + threshold | Elektron Digitakt II, NI Maschine | future DSP page |
| Adjustable env-follower attack/release | most filter pedals | future polish (currently fixed at 5 ms / 100 ms) |
| Sidechain ducking from other tracks | Elektron Syntakt, Maschine | future (routing-layer change) |
| Per-step sampling trigger (input-record on a step) | Elektron Octatrack "Pickup Machine" | major feature, later |
| Phase invert switch | some mixing surfaces | nice-to-have |
| Low-latency live monitoring toggle | any live-input setup | needs hardware routing audit |

### What we chose not to copy

- **Real-time sampling into a slot** (Octatrack Pickup Machine) — intentionally deferred. TBD-16's sampler is the Rompler machine; one-shot sampling from the input is a future cross-machine feature.
- **Heavy effects chain on the input track** — FX are shared across tracks via FX1/FX2 buses. Per-track effects would bloat memory and duplicate the FX bus work. Use the bus sends.

---

## See also

- [Hardware / Connections]({{ site.baseurl }}/tbd-16/hardware/connections) — physical input wiring.
- [Mixer & Effects]({{ site.baseurl }}/tbd-16/mixer-and-effects/) — FX routing and TR.MIX reference.
- [Parameter Locks]({{ site.baseurl }}/tbd-16/sequencer/plocks) — step-level automation.

<div class="origin-card" markdown="1">

## Origin & credits

The Input machine is a custom CTAG `RackInput` voice — a minimal P4 DSP block that takes the codec's audio-in buffer, applies the post-ADC processing chain, and writes the result into the rack output where the mixer strip can pick it up. The wrapper is by Robert Manzke / CTAG (GPL 3.0). The Gain / Mono / HP / Drive processing stage was added in 2026-04 to give the Input track a usable parameter page alongside TR.MIX; the resonant SVF + envelope follower + track-mute-gate landed later the same month.

- TBD-16 wrapper: `rack/RackInput.hpp` / `.cpp`
- SVF topology: TPT / Cytomic state-variable (Andy Simper), one pair of integrators per channel

</div>
