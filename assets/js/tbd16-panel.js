/*
 * TBD-16 front-panel layout for the Learn lessons.
 *
 * SOURCE OF TRUTH FOR GEOMETRY
 *   The hardware design source: a 110 × 110 mm panel with corner radius 0.5.
 *   Positions below are copied verbatim from that source's component
 *   `position` values, in millimetres, origin top-left, Y down.
 *
 * CONTROL SURFACE
 *   FUNC1/FUNC2 sit beside the OLED, SHIFT/HYPER occupy the centre pair, and
 *   FUNC3–FUNC6 form the right-hand 2 × 2 block.
 *
 *   That 2 × 2 block reads F3 F4 across the top and F6 F5 across the bottom —
 *   the bottom row is deliberately not in numeric order, which is why it is
 *   easy to transcribe wrongly and was wrong here until 2026-08-06. The
 *   ordering is taken from the physical device; the product drawing legends
 *   these four caps x / y over a / b rather than by FUNC number, so it cannot
 *   settle the question on its own. Check hardware before changing it.
 *
 * THE CENTRE BLOCK IS OFF THE PAD GRID BY HALF A PITCH
 *   REC / PLAY and the SHIFT / HYPER pair below them are NOT on the step
 *   columns. They sit at x = 55.00 and 66.00 — the panel's own centre line and
 *   one 11 mm pitch to the right of it — where the step columns run 16.50,
 *   27.50 … 93.50. Every other control on those two rows is on the grid; these
 *   four are the exception, and the REC LED moves with the REC cap.
 *
 *   This file had all four on the grid (49.50 / 60.50) until 2026-08-06. Two
 *   independent product sources say otherwise and agree to within a hundredth
 *   of a millimetre: the front-panel print artwork (assets/panel-src/, whose
 *   record dot and play triangle land on 55.000 and 66.000 under the single
 *   registration transform documented with the print data below — while all
 *   twelve of its other symbols land on their controls exactly), and the
 *   product's own top-down render, measured against its pad grid, which puts
 *   the record cap at 55.03, play at 66.08, the white SHIFT cap at 55.00, the
 *   blue HYPER cap at 66.00 and the REC LED at 55.03. Confirm against hardware
 *   like the FUNC block order above; the print and the render cannot both be
 *   wrong in the same direction by the same half pitch, but neither is a
 *   caliper.
 *
 * THE COMPLETE LED SET
 *   Nineteen: 16 above the step pads, 2 beside the OLED (above FUNC1/FUNC2),
 *   and 1 above the REC cap. There is no PLAY LED — the PLAY button is an
 *   unlit cap, and so is every step button; the WS2812 above a control is the
 *   only light on this panel. Confirmed against hardware 2026-08-06.
 */
window.TbdPanelLayout = {
  source: 'hardware design source (panel geometry, millimetres)',
  width: 110,
  height: 110,
  cornerRadius: 0.5,

  // Position is the component centre. The body is derived the way the studio
  // draws it — the active area plus the 1 mm glass offset on each side — not
  // the datasheet module size of 60.5 × 37, which includes the flex tail.
  oled: {
    x: 55, y: 17.6,
    bodyW: 58.4, bodyH: 30.9,
    viewW: 56.4, viewH: 28.9,
    resX: 128, resY: 64
  },

  // Every LED that is not above a step pad. `kind` becomes the element's
  // modifier class, so a consumer can style the transport indicator apart from
  // the two meters without hard-coding an id.
  //
  // The REC LED sits directly above the REC cap at the same 6.80 mm offset a
  // step LED has above its pad (stepRows: 84.65 − 77.85), which is how it
  // reads on the hardware: 58.65 − 6.80 = 51.85. Its x is the REC cap's, which
  // is the panel centre line and not a step column — see the centre-block note
  // at the top of this file.
  functionLeds: [
    { id: 'func1-led', x: 13.50, y: 31.50, kind: 'func' },
    { id: 'func2-led', x: 96.50, y: 31.50, kind: 'func' },
    { id: 'rec-led',   x: 55.00, y: 51.85, kind: 'transport' }
  ],

  screws: [
    { x: 9, y: 9 }, { x: 101, y: 9 },
    { x: 9, y: 101 }, { x: 101, y: 101 }
  ],

  // Alpha RV142FF — 360° continuous with push, i.e. the four push-encoders.
  // `d` is the 13 mm knob cap (appearance.knobDiameter), which is what you see
  // and grab; the 9.8 mm in `physical` is the shaft footprint on the PCB.
  encoders: [
    { id: 'knob1', x: 13.50, y: 45, d: 13, label: 'Knob 1' },
    { id: 'knob2', x: 41.17, y: 45, d: 13, label: 'Knob 2' },
    { id: 'knob3', x: 68.84, y: 45, d: 13, label: 'Knob 3' },
    { id: 'knob4', x: 96.51, y: 45, d: 13, label: 'Knob 4' }
  ],

  // 6 mm tactile switches with 8 mm caps, on an 11 mm column pitch.
  //
  // `cap` IS A HELPER LABEL, NOT THE PRINT. The device prints no FUNC numbers,
  // no pad numbers, and nothing whatever on the SHIFT and HYPER caps — see the
  // `print` block below for what it does print. These strings are a teaching
  // and debugging aid, and `data-labels="off"` removes every one of them to
  // leave the device's own surface. The controls the print already names — the
  // four arrows, REC and PLAY — therefore carry no `cap` at all: a stand-in
  // glyph next to the real one would be two answers to the same question.
  //
  // `tint` is a physical CAP COLOUR and only two caps have one: SHIFT is white
  // and HYPER is blue. REC and PLAY are the same black moulding as everything
  // else and used to be tinted red and grey here, which is a thing the panel
  // does not do; the printed red dot is what makes REC red.
  buttons: [
    // dedicated project/global buttons beside the OLED
    { id: 'func1', x: 13.50, y: 19.50, cap: 'F1', name: 'Func 1' },
    { id: 'func2', x: 96.50, y: 19.50, cap: 'F2', name: 'Func 2' },

    // upper auxiliary row — y 58.65
    { id: 'up',    x: 27.50, y: 58.65,             name: 'Up' },
    { id: 'rec',   x: 55.00, y: 58.65,             name: 'Rec' },
    { id: 'play',  x: 66.00, y: 58.65,             name: 'Play' },
    { id: 'func3', x: 82.50, y: 58.65, cap: 'F3',   name: 'Func 3' },
    { id: 'func4', x: 93.50, y: 58.65, cap: 'F4',   name: 'Func 4' },

    // lower auxiliary row — y 69.65
    { id: 'left',  x: 16.50, y: 69.65,             name: 'Left' },
    { id: 'down',  x: 27.50, y: 69.65,             name: 'Down' },
    { id: 'right', x: 38.50, y: 69.65,             name: 'Right' },
    { id: 'shift', x: 55.00, y: 69.65, cap: 'SHFT', name: 'Shift', small: true, tint: 'shift' },
    { id: 'hyper', x: 66.00, y: 69.65, cap: 'HYPR', name: 'Hyper', small: true, tint: 'hyper' },
    { id: 'func6', x: 82.50, y: 69.65, cap: 'F6',   name: 'Func 6' },
    { id: 'func5', x: 93.50, y: 69.65, cap: 'F5',   name: 'Func 5' }
  ],

  // Steps 1–8 on y 84.65, steps 9–16 on y 99.65; each with a WS2812 above it.
  stepColumns: [16.50, 27.50, 38.50, 49.50, 60.50, 71.50, 82.50, 93.50],
  stepRows: [
    { buttonY: 84.65, ledY: 77.85, from: 1 },
    { buttonY: 99.65, ledY: 92.85, from: 9 }
  ],
  stepDiameter: 6,
  ledDiameter: 2,

  // ---- what the panel actually has printed on it ---------------------------
  //
  // The product's own print artwork, in assets/panel-src/. The `d` strings are
  // copied VERBATIM from tbd-symbols2.svg, in the artwork's own coordinates,
  // and are not to be re-typed, re-scaled or re-centred: a symbol is placed by
  // the transform below and by nothing else.
  //
  // THE REGISTRATION, which is the whole mechanism.
  //
  // The artwork's `Background` group is a single rect at (6.51, 6.51) measuring
  // 4060.04 × 4060.02 units, and that rect IS this panel — the same 110 × 110
  // mm plate whose component positions are listed above. So one affine map
  // relates the two coordinate systems and it has no free parameters:
  //
  //     unit = origin + mm × unitsPerMm
  //     unitsPerMm = 4060.04 / 110 = 36.909455
  //     origin     = 6.51
  //
  // A symbol is drawn into an <svg> laid over its control whose viewBox is that
  // control's own 8 mm cap window pushed through that map. Nothing is centred,
  // nothing is nudged, and no symbol carries an offset of its own — so a
  // symbol either lands where the print puts it or it does not land on the cap.
  // That includes the four letters' typographic side bearings and the descender
  // on the `y`, which are part of the print and would be lost by centring.
  //
  // Run the map over the artwork and the ten symmetric symbols (four arrows,
  // record dot, play triangle, four pad dashes) land on their control centres
  // to within 0.001 mm. That agreement is what identified the centre block's
  // half-pitch error described at the top of this file, and it is worth
  // re-running rather than trusting after any re-export.
  //
  // WHAT IS PRINTED, AND WHAT IS NOT. Arrows on the four navigation caps, a red
  // dot on REC, a triangle on PLAY, `x` `y` over `a` `b` on the right-hand
  // block, and a dash on pads 1, 5, 9 and 13 — the beat markers. Nothing else:
  // no FUNC numbers, no pad numbers, and the SHIFT and HYPER caps are blank
  // (they are identified by being white and blue). Anything a person needs
  // beyond that is a label, not a print, and lives in `cap` above.
  //
  // `control` names a button id; `step` names a pad by its 1-based number.
  print: {
    source: 'assets/panel-src/tbd-symbols2.svg (product front-panel print)',
    unitsPerMm: 4060.04 / 110,
    origin: 6.51,
    symbols: [
      { control: 'up', name: 'up', d: 'M986.788,2187.71l11.075,10.937l23.378,-30.488l23.79,30.488l11.21,-10.937l-34.863,-43.887l-34.59,43.887Z', fill: '#fff' },
      { control: 'down', name: 'down', d: 'M1056.24,2560.76l-11.074,-10.937l-23.379,30.488l-23.789,-30.488l-11.211,10.937l34.864,43.887l34.589,-43.887Z', fill: '#fff' },
      { control: 'left', name: 'left', d: 'M631.988,2611.97l10.937,-11.075l-30.488,-23.379l30.488,-23.789l-10.937,-11.211l-43.887,34.864l43.887,34.59Z', fill: '#fff' },
      { control: 'right', name: 'right', d: 'M1411.04,2542.51l-10.937,11.075l30.488,23.515l-30.488,23.653l10.937,11.211l43.887,-34.864l-43.887,-34.59Z', fill: '#fff' },
      { control: 'rec', name: 'record', d: 'M2003.16,2172.71c0,20.918 14.629,33.633 33.359,33.633c18.731,-0 33.36,-12.715 33.36,-33.633c-0,-20.918 -14.629,-33.633 -33.36,-33.633c-18.73,0 -33.359,12.715 -33.359,33.633Z', fill: '#dd342b' },
      { control: 'play', name: 'play', d: 'M2413.67,2206.34l57.695,-35.41l-57.695,-34.864l-0,70.274Z', fill: '#fff' },
      { control: 'func3', name: 'x', d: 'M3063.97,2205.34l22.422,-0l-23.652,-32.95l21.738,-31.035l-22.012,0l-10.117,16.543l-11.758,-16.543l-22.421,0l22.148,31.035l-23.652,32.95l21.875,-0l12.304,-18.184l13.125,18.184Z', fill: '#fff' },
      { control: 'func4', name: 'y', d: 'M3416.44,2230.77c5.605,2.598 11.621,4.102 17.91,4.102c15.312,-0 24.473,-8.477 30.215,-23.379l26.66,-70.137l-19.961,0l-12.578,37.188l-12.578,-37.188l-20.782,0l23.79,63.438l-2.051,4.511c-3.145,6.836 -7.793,8.614 -14.082,8.614c-4.102,-0 -7.383,-1.504 -10.664,-2.735l-5.879,15.586Z', fill: '#fff' },
      { control: 'func6', name: 'a', d: 'M3062.05,2611.38l20.235,-0l-0,-63.985l-20.235,0l0,5.332c-4.785,-4.238 -10.39,-6.699 -17.773,-6.699c-16.406,-0 -28.711,13.398 -28.711,33.223c-0,22.011 12.305,33.632 28.711,33.632c7.793,0 12.988,-3.007 17.773,-7.656l0,6.153Zm-12.988,-15.176c-8.887,-0 -14.082,-6.973 -14.082,-16.817c-0,-9.57 5.059,-16.679 13.945,-16.679c8.067,-0 14.219,5.742 14.219,16.679c0,9.571 -5.195,16.817 -14.082,16.817Z', fill: '#fff' },
      { control: 'func5', name: 'b', d: 'M3426.83,2611.38l20.098,-0l0,-5.196c4.785,4.238 10.527,6.836 18.047,6.836c16.543,0 28.574,-13.672 28.574,-33.496c0,-21.875 -12.031,-33.633 -28.574,-33.633c-7.93,0 -13.262,3.281 -17.91,7.93l-0,-40.879l-20.235,0l0,98.438Zm33.36,-14.903c-8.067,0 -14.356,-6.015 -14.356,-17.09c0,-9.433 5.332,-16.816 14.219,-16.816c8.75,-0 14.219,7.109 14.219,16.816c-0,9.571 -5.196,17.09 -14.082,17.09Z', fill: '#fff' },
      { step: 1, name: 'step-1', d: 'M560.149,3130.88l110.728,-0', stroke: '#fff', strokeWidth: 13.02 },
      { step: 5, name: 'step-5', d: 'M2184.16,3130.88l110.728,-0', stroke: '#fff', strokeWidth: 13.02 },
      { step: 9, name: 'step-9', d: 'M560.149,3684.52l110.728,-0', stroke: '#fff', strokeWidth: 13.02 },
      { step: 13, name: 'step-13', d: 'M2184.16,3684.52l110.728,-0', stroke: '#fff', strokeWidth: 13.02 }
    ]
  }
};
