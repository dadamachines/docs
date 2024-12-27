---
layout: default
title: midi
parent: tbd
has_children: false
---
# Midi

In contrast to the Eurorack- or AE Modular-version of the TBD, the TBD BBA (Black Box Audio) focuses on MIDI as input to control the various instruments and effects available for the TBD-platform. MIDI can be applied either via the classical 5-pin DIN-jacks or via USB.

As with the classical TBD, instruments and effects are, due to the character of their technical integration, also known as Plugins and can be mono or stereo. In mono operation-mode, two plugins can be used at once! 
The TBD-BBA is backwards-compatible to the original TBD in many ways, so that you still can use the instruments and effects that previously had been designed for a module controlled by Gates, Triggers and CVs (control voltages) in mind. 

Basically the TBD-BBA is a TBD with a builtin MIDI-to-CV/Gate interface including different keyboard-modes to facilitate the aggregation of functional groups to voices.

In case you are not familiar with the concept of CV/Gate, wikipedia has a defintion: [wp: CV/gate](https://en.wikipedia.org/wiki/CV/gate)

> CV/gate (an abbreviation of control voltage/gate) is an analog method of controlling synthesizers, drum machines, and similar equipment with external sequencers. The control voltage typically controls pitch and the gate signal controls note on-off.

## Virtual CVs, Triggers and Gates

* Triggers or Gates are symbolized as switches on the Web-GUI
* CVs are symbolized as sliders on the Web-GUI

When you open up the dropdown-listbox associated with any switch or slide of the Web-GUI, you’ll see a list of available MIDI-parameters for individual mappings.

The available parameters that can be mapped as virtual Gates/Triggers or CVs are slightly different. Basically the MIDI-parameters for Gates are a subset of the parameters for CV, according to their original nature in the “MIDI-world”.

Please note: some mappings of Voice A also are available with the Percussion voice.


## MIDI-Channels

Midi-Channels have two main functions regarding the TBD-BBA:

1. Switching Voice-modes
2. Context-sensitive filtering of “CVs” and “Gates” for mapping of parameters

The following voice-modes are available:

* Mono: Channel 1 (mimics the behavior of a classical mono-synth)
* Duophonic-AB: Channel 14
* Duophonic-CD: Channel 15
* Polyphonic (4-voice) Channel 16
