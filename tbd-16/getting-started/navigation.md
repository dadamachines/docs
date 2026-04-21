---
layout: default
title: Navigation
nav_order: 3
parent: Getting Started
grand_parent: tbd 16 groovebox
---

# Navigation

Knowing how to move between screens is the fastest way to feel at home on the **tbd 16**. Use the function buttons as shortcuts, and the arrow keys to step between related screens.
{: .fs-6 .fw-300 }

![tbd 16 — top view](../../../images/tbd-16/dadamachines-tbd16-drawing.png)

---

## Function Buttons

The six function buttons are the primary way to switch between screens:

| Button | Click | Shift + Click | Medium Press (Hold) |
|:-------|:------|:--------------|:--------------------|
| `FUNC1` | Project Menu | — | — |
| `FUNC2` | Toggle Global Sound ↔ Sound | — | — |
| `FUNC3` | Cycle: Sound → Track Mixer → Track | Sound Preset browser | Track Select Overlay |
| `FUNC4` | Pattern Select | Track Preset browser | Mixer Select Overlay |
| `FUNC5` | Delete steps (hold while playing) | Delete all tracks | Pattern activate (on Pattern screen) |
| `FUNC6` | (Not yet assigned) | — | — |
{: .dada-minimal-table }

### FUNC2 Behavior

`FUNC2` acts as a toggle between the Sound screen and the system screens:
- From **Sound/TrackMixer/Track** → switches to **Global Sound**
- From **Global Sound/Mixer/Tempo/FX/Master** → returns to **Sound**

### FUNC3 Cycle

Each press of `FUNC3` cycles through the per-track screens:

```
Sound → Track Mixer → Track Parameters → Sound → ...
```

### FUNC5 — Delete / Erase

On the **Sound screen**, holding `FUNC5` while the sequencer is playing erases steps in real-time as the playhead passes them:
- **Hold FUNC5** — erase steps on the active track
- **Shift or Hyper + Hold FUNC5** — erase steps on ALL tracks

On the **Pattern Select screen**, `FUNC5` activates the selected pattern:
- **Click** — activate pattern for the active track
- **Long press** — activate pattern for ALL tracks

## Navigation Ring

The arrow keys (`←`/`→`) connect the system-level screens in a ring:

```
GlobalSound  ←→  Mixer (Group + 4 track pages)  ←→  Tempo
     ↑                                                  ↑
     └──────────────────────────────────────────────────┘
```

From the **Sound screen**, `←`/`→` navigate between tracks. At the edges:
- **Track 1** + `←` → Master screen
- **Track 16** + `→` → FX1 screen

The **FX and Master** screens form a separate chain accessible from track navigation or the Mixer Select Overlay:

```
(Track 16) →  FX1  ←→  FX2  ←→  Master  → (Track 1)
```

## Mixer Select Overlay

Hold `FUNC4` to open the Mixer Select Overlay. While held, the first 6 step buttons light up as shortcuts:

| Step Button | Color | Target Screen |
|:------------|:------|:--------------|
| Step 1 | Red | Track Select (mute mode) |
| Step 2 | Green | Pattern Select |
| Step 3 | Blue | Mixer |
| Step 4 | Red | Tempo |
| Step 5 | Green | Master |
| Step 6 | Blue | FX1 |
{: .dada-minimal-table }

## Track Select Overlay

Hold `FUNC3` to open the Track Select Overlay. The 16 step buttons show track activity:
- Press a step button to **jump to that track**
- LEDs show: green = active, red = muted, flash on trigger

## Screen Map

```
                        ┌─────────────┐
            FUNC1 ───→  │ Project Menu│
                        │  Save       │
                        │  Load       │
                        │  New        │
                        │  Select Kit │
                        │  Track Setup│
                        │  Settings ──┼──→ MIDI / Display / WiFi / Utilities / Firmware
                        └─────────────┘

                        ┌──────────────────────────────────────────────┐
            FUNC3 ───→  │ Sound ←→ Track Mixer ←→ Track Parameters    │
          Shift+F3 ──→  │ Sound Preset Browser                        │
          Shift+F4 ──→  │ Track Preset Browser                        │
                        └──────────────────────────────────────────────┘

            FUNC2 ───→  GlobalSound ←→ Mixer ←→ Tempo
            FUNC4 ───→  Pattern Select (+ Mute via step buttons)

         Navigation:    Track 16 → FX1 ←→ FX2 ←→ Master → Track 1
```
