/*
 * TBD-16 front-panel layout for the Learn lessons.
 *
 * SOURCE OF TRUTH FOR GEOMETRY
 *   tbd-studio → projects/prototype-workflow-demo.tbd-project.json
 *   → panels[0] (`panel-tbd16-prototype`, 110 × 110 mm, corner radius 0.5)
 *   Positions below are copied verbatim from that file's component
 *   `position` values, in millimetres, origin top-left, Y down.
 *
 * CONTROL-SURFACE VERSION
 *   The Studio prototype adapts its legacy source artboard to the Rev C
 *   control surface: FUNC1/FUNC2 sit beside the OLED, SHIFT/HYPER occupy the
 *   centre pair, and FUNC3–FUNC6 form the right-hand 2 × 2 block. The two
 *   visible FUNC status LEDs are included along with the 16 step LEDs.
 */
window.TbdPanelLayout = {
  source: 'tbd-studio/projects/prototype-workflow-demo.tbd-project.json',
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

  functionLeds: [
    { id: 'func1-led', x: 13.50, y: 31.50 },
    { id: 'func2-led', x: 96.50, y: 31.50 }
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
  buttons: [
    // dedicated project/global buttons beside the OLED
    { id: 'func1', x: 13.50, y: 19.50, cap: 'F1', name: 'Func 1' },
    { id: 'func2', x: 96.50, y: 19.50, cap: 'F2', name: 'Func 2' },

    // upper auxiliary row — y 58.65
    { id: 'up',    x: 27.50, y: 58.65, cap: '⌃',    name: 'Up' },
    { id: 'rec',   x: 49.50, y: 58.65, cap: '●',    name: 'Rec',  tint: 'rec' },
    { id: 'play',  x: 60.50, y: 58.65, cap: '▶',    name: 'Play', tint: 'play' },
    { id: 'func4', x: 82.50, y: 58.65, cap: 'F4',   name: 'Func 4' },
    { id: 'func3', x: 93.50, y: 58.65, cap: 'F3',   name: 'Func 3' },

    // lower auxiliary row — y 69.65
    { id: 'left',  x: 16.50, y: 69.65, cap: '‹',    name: 'Left' },
    { id: 'down',  x: 27.50, y: 69.65, cap: '⌄',    name: 'Down' },
    { id: 'right', x: 38.50, y: 69.65, cap: '›',    name: 'Right' },
    { id: 'shift', x: 49.50, y: 69.65, cap: 'SHFT', name: 'Shift', small: true, tint: 'shift' },
    { id: 'hyper', x: 60.50, y: 69.65, cap: 'HYPR', name: 'Hyper', small: true, tint: 'hyper' },
    { id: 'func5', x: 82.50, y: 69.65, cap: 'F5',   name: 'Func 5' },
    { id: 'func6', x: 93.50, y: 69.65, cap: 'F6',   name: 'Func 6' }
  ],

  // Steps 1–8 on y 84.65, steps 9–16 on y 99.65; each with a WS2812 above it.
  stepColumns: [16.50, 27.50, 38.50, 49.50, 60.50, 71.50, 82.50, 93.50],
  stepRows: [
    { buttonY: 84.65, ledY: 77.85, from: 1 },
    { buttonY: 99.65, ledY: 92.85, from: 9 }
  ],
  stepDiameter: 6,
  ledDiameter: 2
};
