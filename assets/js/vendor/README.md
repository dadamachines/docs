# Vendored third-party assets

(No front matter on purpose — Jekyll copies this file verbatim instead of
rendering it as a page, so it never reaches the nav or the search index.)

## `webaudio-controls.js`

Knob / slider / switch custom elements by Eiji Kitamura, Ryoya Kawai, Keisuke Ai
and g200kg. Apache-2.0 — see the licence header inside the file.

Used by the Learn lessons so the knobs in the manual look and behave like the
knobs in the device's own WebUI.

| | |
|---|---|
| MD5 when copied | `39e18d680c693200586435d1647edb07` |
| Copied on | 2026-08-04 |

**The file is kept byte-identical to the copy used by the device's own WebUI on
purpose** — do not edit it here. If that copy is updated, re-copy it rather
than patching. Anything this site needs on top of the library — accessibility
wrapping, value formatting — lives in `assets/js/tbd-seq.js`, not in the
vendored file.
