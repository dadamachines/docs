# TBD-16 front-panel print artwork

The vector source for the symbols printed on the TBD-16's front panel — the
arrows, the record dot and play triangle, the `x` / `y` / `a` / `b` legends on
the right-hand block, and the dashes that mark pads 1, 5, 9 and 13.

These are the product's own print files, kept here so that `<tbd-panel>` draws
the real panel rather than a set of stand-in glyphs. They are not decoration:
`assets/js/tbd16-panel.js` carries the path data copied from
`tbd-symbols2.svg`, verbatim and in the artwork's own coordinates, and
`assets/js/tbd-panel.js` maps it onto the rendered panel.

| File | What it is |
|---|---|
| `tbd-symbols2.svg` | **Canonical.** Every symbol is a separate `<path>` with an `id`, and every one carries its final fill or stroke. This is the file the panel component's data is derived from. |
| `tbd-symbols_withbg.svg` | An earlier export of the same drawing. Same geometry, but the paths are unnamed and the four letter glyphs are still `fill:none` (outlines, not filled type). Kept for provenance; do not derive from it. |

## The coordinate system, and why it is the whole story

Both files use a `0 0 4074 4074` viewBox and contain two groups:

* `Background` — a `<rect>` at `x=6.51 y=6.51`, `4060.04 × 4060.02` units. That
  rectangle **is** the front panel: the same 110 × 110 mm plate whose component
  positions `tbd16-panel.js` lists in millimetres.
* `tbd-symbols` — the printed curves, in absolute coordinates on that plate.

So there is exactly one transform between the artwork and the panel geometry,
and it has no free parameters:

```
units per mm = 4060.04 / 110 = 36.909455
mm  = (artwork unit − 6.51) / 36.909455
unit = 6.51 + mm × 36.909455
```

Nothing is eyeballed and no symbol carries a per-symbol nudge. Each printed
symbol is drawn into a `<svg>` sitting on its control whose `viewBox` is that
control's own 8 mm cap window converted into artwork units — so the symbol lands
where the print puts it, including the typographic side bearings and the
baseline offset of the four letters, or it does not land on the cap at all.

That property is a test, not a hope. Running the transform over the artwork puts
the ten symmetric symbols — four arrows, the record dot, the play triangle and
the four pad dashes — on their control centres to within 0.001 mm, and the four
letters within their caps at the type's own optical offsets.

## Re-exporting

Export from the design file with the `Background` rectangle **included and
unchanged**; it is the registration reference. Then update the `print.symbols`
path data in `assets/js/tbd16-panel.js` from the new export, and confirm the
transform above still lands every symbol on its cap.

If a symbol moves on the product, it moves here first.
