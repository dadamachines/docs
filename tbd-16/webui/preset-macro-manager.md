---
layout: default
title: Preset / Macro Manager
nav_order: 2
parent: WebUI
grand_parent: tbd 16 groovebox
---

# Preset / Macro Manager

The **Preset / Macro Manager** is where you create and edit **macros** (parameter mappings exposed as knobs) and manage **performer presets** (saved sound states). Reach it from the WebUI top navigation → **Presets** tab.

{: .note }
> For the conceptual model behind Macros and Presets — why the same Machine can feel completely different from one preset to the next — read [Macros & Presets]({{ site.baseurl }}/tbd-16/sound-and-tracks/macros-and-presets) first.

## Layout

- **Track strip** across the top — select one of 19 tracks: the 16 sound channels (CH 01–16) plus the three bus tracks **FX1 (17)**, **FX2 (18)** and **Master (19)**. Knob controls update to show that track's macro parameters.
- **Sidebar tabs** on the left toggle between two modes:
  - **Presets** — browse and load saved sounds
  - **Macros** — list of macro definitions and the editor
- **Center panel** — always shows the knob preview. In Macros mode it also shows the **Macro Builder**.

{: .note }
> Picking FX1, FX2 or Master in the track strip lets you build and save layouts for the bus tracks in exactly the same way as for sound tracks — same Macro / Preset model, same 6-page × 4-knob limit, same JSON export.

---

## For performers — using presets

On the **Presets** tab:

1. Select a track from the top strip.
2. Browse the list of presets for the current macro definition.
3. Click a preset to **load** it — the knobs jump to the saved values.
4. Tweak knobs to taste, then click **Save As** to store a new preset.

Presets can be exported and imported as JSON.

---

## For designers — building macros

On the **Macros** tab:

1. **Create a macro** or select an existing one to edit.
2. Use the **Macro Builder** to map hardware knobs to plugin parameters:
   - Name each knob
   - Set its range (min / max)
   - Map it to one or more CC outputs with optional scaling or formulas
3. **1:1 Map All** auto-generates passthrough mappings — useful as a starting point.
4. Combine multiple CCs into a single **MACRO knob** for rich multi-parameter sound control.
5. **Lock** parameters to fixed values when you don't want them exposed.

The panel below the builder lists **Sound Presets for This Definition** so you can see which presets depend on the macro you're editing.

### Author-defined indices are preserved

When the WebUI saves a macro, it does **not** renumber the parameter indices (`idx`) you authored — the value you set on a knob is the storage slot it will use, and any presets keyed against that idx keep working untouched. This is why presets are portable across macro edits as long as you don't reuse the same idx for two different parameters or break the source/identity convention used for hi-res NRPN knobs.

The save path runs an automatic consistency pass that fixes up the per-mapping `type` field to match the underlying synth definition (e.g. `cc` vs `nrpm`). If you've hand-edited macro JSON outside the WebUI you can re-open it in the Macro Builder and click Save to apply the same fix-up.

---

## Quick Start overlay

The first time you open the tool, a **Quick Start Guide** dialog appears with separate performer and designer workflow steps. You can reopen it at any time from the help icon.

{: .note }
> Macros and presets can be exported and imported as JSON — useful for sharing sounds between devices or backing up your library.
