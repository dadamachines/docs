---
layout: default
title: Macros & Presets
nav_order: 5
parent: Sound & Tracks
grand_parent: tbd 16 groovebox
---

# Macros & Presets
{: .no_toc }

How the **tbd 16** turns a DSP engine into a playable instrument — and why the same [Machine]({{ site.baseurl }}/tbd-16/machines/) can feel completely different from one preset to the next.
{: .fs-6 .fw-300 }

1. TOC
{:toc}

---

## The three layers

A sound on the **tbd 16** is built from three stacked layers. Understanding them is the key to everything else in this manual.

| Layer | What it is | You edit it with |
|:------|:-----------|:-----------------|
| **Machine** | The raw DSP engine — the actual audio code (e.g. PolyPad, Mono Synth, Rompler). | Can't be edited — you *choose* one. |
| **Macro** | A *parameter layout* for a Machine: which knobs appear on screen, how they're grouped into pages, what each knob does, and what MIDI CCs it drives. | **WebUI → Preset & Macro Manager** |
| **Preset** | A set of **knob values** for one specific Macro. Loading a preset sets the knobs, nothing else. | On-device Preset browser (`Shift + FUNC3`) or WebUI |
{: .dada-minimal-table }

The relationship is strict:

```
Machine  ──┐
           ├──  Macro  ──┐
                         ├──  Preset
                         ├──  Preset
                         └──  Preset   ← presets always belong to exactly
                                         one Macro, which belongs to one Machine
```

A preset only makes sense in the context of its Macro, and a Macro only makes sense for the Machine it was designed for.

---

## Why this matters

The same Machine can have **many different Macros**. That means a single DSP engine like PolyPad can be presented to the player as:

- A **simple 4-knob pad** (one page: cutoff, resonance, attack, release) — perfect for live playing.
- A **full 24-knob sound-design rig** (six pages covering every parameter) — perfect for crafting new sounds from scratch.
- Something in between — for example an **8-knob performance layout** that locks the boring parameters and combines others into expressive MACRO knobs.

It's the same audio engine under the hood. Only the control surface changes.

{: .tip }
> If a preset suddenly exposes different knobs and pages than the previous one, that's because it's built on a different Macro — not a different Machine. Check the Macro name in the WebUI to see the layout.

---

## Macros in detail

A **Macro** defines up to **six pages of four knobs** (24 knobs total). For each knob it stores:

- A human-readable **name** (e.g. *Brightness*, not *CC 12*).
- A **range** (min / max / default).
- One or more **output mappings** — how the knob value is converted into MIDI CCs sent to the DSP.

The mapping formula is:

```
finalCC = start + Σ (knobValue × mul ÷ div)
```

### Three common mapping patterns

- **1:1 passthrough** — one knob controls one CC directly. The *1:1 Map All* button in the Macro Builder auto-generates a full passthrough layout as a starting point.
- **MACRO knob** — one knob drives several CCs at once. A single *Punch* knob can simultaneously raise attack speed, FM depth and accent. This is the most expressive pattern and where the "macro" name comes from.
- **Constant lock** — a CC is fixed to one value with no source knob. Use this to hide parameters you don't want performers to touch.

---

## Presets in detail

A **Preset** is just the current values of all the knobs defined by a Macro — plus a name and optional category. Loading a preset sets the knobs; that's it.

Because a preset carries no information about *which* knobs to show, it can only be loaded against the Macro it was saved with. The device enforces this — the preset browser groups presets by Macro.

### The on-device Sound Preset browser

Press **`Shift + FUNC3`** from any screen to open the Sound Preset browser.

![Sound Preset browser](../../../images/tbd-16/sound_preset.png){: .screenshot }

The browser has two columns:

- **Left column (Machine)** — the [Machine]({{ site.baseurl }}/tbd-16/machines/) / sound-engine group. The `<` marker shows which group contains the currently loaded preset.
- **Right column (Preset)** — presets available for the selected Machine. The `<` marker shows the active preset. A `>` cursor indicates your selection.

#### Navigation

| Action | Result |
|:-------|:-------|
| **↑/↓** or **Knob 1/2** | Browse groups (left column) or presets (right column) |
| **→** | Move from groups to presets column |
| **←** | Move back to groups, or exit browser |
| **Knob 2 click** or **→** (on preset) | Load the selected preset |
{: .dada-minimal-table }

The right column also includes a **"Save preset..."** entry at the end for saving custom presets.

{: .warning }
Loading a sound preset replaces the active track's Machine and all its parameters. Use [Change track setup](../project-and-settings/project) if you want to reset a whole track arrangement instead of a single track's sound.

### Creating and editing presets in the WebUI

Use **WebUI → Preset & Macro Manager → Presets** tab. Select a track, tweak the knobs, click **Save As…**. Presets can be exported and imported as JSON — useful for sharing libraries between devices.

See [Preset & Macro Manager]({{ site.baseurl }}/tbd-16/webui/preset-macro-manager) for the full tool reference.

---

## Track setups vs. presets

A preset changes the sound of **one** track. If you want to change the Machine / preset arrangement on **all 16 tracks at once**, use **Project menu → Change track setup**.

Factory setups ship with the device (for example `default` and `sampler`) and are marked with `(F)` in the browser. Custom setups saved on the SD card appear without the `(F)` tag. See [Project Menu](../project-and-settings/project) for details.

---

## Typical workflow

1. **Choose a Machine** on the track (`Shift + FUNC3`, left column). The Machine determines what DSP is available.
2. **Choose a Macro** — in practice this happens implicitly: you pick a preset, and the preset drags along its Macro. Advanced users can create new Macros in the WebUI for the same Machine.
3. **Tweak and save** — turn knobs on the device or in the WebUI, then save a new preset for later recall.

{: .note }
> A Macro without any presets is perfectly fine — the device uses the Macro's default knob values. Presets just give you named snapshots to jump between.

---

## See also

- [Machines]({{ site.baseurl }}/tbd-16/machines/) — the list of DSP engines and which tracks they're available on.
- [Sound Parameters]({{ site.baseurl }}/tbd-16/sound-and-tracks/sound) — how knob pages render on the OLED once a Macro is loaded.
- [Preset & Macro Manager]({{ site.baseurl }}/tbd-16/webui/preset-macro-manager) — the WebUI tool where you build Macros and organise presets.
