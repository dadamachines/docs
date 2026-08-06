/*
 * <tbd-panel> — the TBD-16 front panel, rendered in the docs.
 *
 * Purpose: close the gap between "I understand the pattern" and "I know which
 * button to press". A lesson's browser sequencer teaches the music; this shows
 * the same thing as lit step buttons on the device, next to the OLED screen you
 * should be looking at.
 *
 * Geometry comes from tbd16-panel.js, which is copied from the hardware
 * design source. Rendering is deliberately a separate, much smaller
 * implementation rather than a copy of the existing simulator panel: that
 * module carries hardcoded singleton element ids (so only one panel could
 * exist per page) and needs several stubbed globals. Sharing the *data* keeps
 * the panels honest without coupling a documentation site to an application's
 * internals.
 *
 * TWO LAYERS OF MARKING, and only one of them is on the device.
 *
 * The PRINT is the panel's own silkscreen — arrows, the record dot and play
 * triangle, x/y over a/b, and a dash on pads 1, 5, 9 and 13. It comes from the
 * product artwork through tbd16-panel.js's `print` block and it is always
 * drawn, because it is part of the hardware.
 *
 * The LABELS are ours: F1–F6, SHFT, HYPR and the pad numbers. The device has
 * none of them. They are how a lesson says "press FUNC2" and how somebody
 * debugging a binding knows which cap is F5, so they are on by default — but
 * `data-labels="off"` (or `panel.setLabels(false)`) removes every one of them
 * and leaves the device's actual surface.
 *
 * Attributes
 *   data-steps      "1,5,9,13"  — step buttons to show lit
 *   data-steps-alt  "3,7,11,15" — a second, differently-coloured set
 *   data-highlight  "func1,play" — controls to ring, for "press this"
 *   data-oled       "sound_page0" — screenshot basename in images/tbd-16/
 *   data-caption    short line under the panel
 *   data-labels     "off" — hide the helper labels; the print stays
 *   data-follow     id of a <tbd-seq> whose playhead should drive the LEDs
 *   data-img-base   filled in by the Liquid include so --baseurl survives
 *   data-runtime-module optional ES module that exports mount(panel), used by
 *                       a product Wasm development runtime
 */
(function () {
  'use strict';

  var L = window.TbdPanelLayout;
  if (!L) return;

  function pct(v, total) { return (v / total * 100) + '%'; }

  function place(node, x, y, w, h) {
    node.style.left = pct(x - w / 2, L.width);
    node.style.top = pct(y - h / 2, L.height);
    node.style.width = pct(w, L.width);
    node.style.height = pct(h, L.height);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function parseList(spec) {
    if (!spec) return [];
    return spec.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  // ---- the printed symbols ---------------------------------------------------
  //
  // Placement is the viewBox and nothing else. The path data is in the print
  // artwork's own coordinates, so giving a control's <svg> the viewBox of that
  // control's 8 mm cap window — converted to artwork units by the single
  // registration transform in tbd16-panel.js — shows exactly the piece of the
  // print that falls on the cap. There is no per-symbol offset to get wrong,
  // and a symbol whose geometry disagrees with the artwork lands off the cap
  // rather than quietly re-centring itself.
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var print = L.print || null;
  var printByControl = {};
  var printByStep = {};
  ((print && print.symbols) || []).forEach(function (symbol) {
    if (symbol.control) printByControl[symbol.control] = symbol;
    else if (symbol.step) printByStep[symbol.step] = symbol;
  });

  function addPrint(node, symbol, cx, cy, size) {
    if (!symbol || !print) return;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'tbd-panel__print');
    svg.setAttribute('viewBox', [
      print.origin + (cx - size / 2) * print.unitsPerMm,
      print.origin + (cy - size / 2) * print.unitsPerMm,
      size * print.unitsPerMm,
      size * print.unitsPerMm
    ].join(' '));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', symbol.d);
    path.setAttribute('fill', symbol.fill || 'none');
    if (symbol.stroke) {
      path.setAttribute('stroke', symbol.stroke);
      path.setAttribute('stroke-width', symbol.strokeWidth);
      // The artwork sets round caps at the document level; the dashes are open
      // strokes and lose 0.35 mm of their printed length without it.
      path.setAttribute('stroke-linecap', 'round');
    }
    svg.appendChild(path);
    node.appendChild(svg);
    node.classList.add('has-print');
  }

  class TbdPanel extends HTMLElement {}
  TbdPanel.observedAttributes = ['data-labels'];
  var proto = TbdPanel.prototype;

  proto.connectedCallback = function () {
    if (this._built) return;
    this._built = true;

    this.imgBase = this.dataset.imgBase || '/images/tbd-16/';
    this.interactive = Boolean(this.dataset.follow || this.dataset.runtimeModule);
    this.classList.add('tbd-panel');

    var frame = el('div', 'tbd-panel__frame');
    frame.classList.toggle('is-interactive', this.interactive);
    frame.setAttribute('role', this.interactive ? 'group' : 'img');
    frame.setAttribute('aria-label', this.describe());
    this.frame = frame;

    this.applyLabels(frame);
    this.renderScrews(frame);
    this.renderOled(frame);
    this.renderFunctionLeds(frame);
    this.renderEncoders(frame);
    this.renderButtons(frame);
    this.renderSteps(frame);

    this.appendChild(frame);

    if (this.dataset.caption) {
      this.appendChild(el('p', 'tbd-panel__caption', this.dataset.caption));
    }

    this.applyState();
    if (this.dataset.runtimeModule) {
      // Keep a lesson's browser audio player connected. Runtime rendering wins
      // the visual state, while the followed sequence receives the same button
      // clicks and remains responsible only for sound.
      if (this.dataset.follow) this.attachFollow(true);
      this.attachRuntime();
    } else this.attachFollow();
  };

  proto.disconnectedCallback = function () {
    if (this._runtime && typeof this._runtime.destroy === 'function') this._runtime.destroy();
    if (this._followEl && this._onStep) {
      this._followEl.removeEventListener('tbd-seq:step', this._onStep);
      this._followEl.removeEventListener('tbd-seq:stop', this._onStop);
      this._followEl.removeEventListener('tbd-seq:pattern', this._onPattern);
    }
    if (this._followEl && this._onRuntimeFollowStep) {
      this._followEl.removeEventListener('tbd-seq:step', this._onRuntimeFollowStep);
      this._followEl.removeEventListener('tbd-seq:stop', this._onRuntimeFollowStop);
      this._followEl.removeEventListener('tbd-seq:pattern', this._onRuntimePattern);
      this._followEl.removeEventListener('tbd-seq:reset-pattern', this._onRuntimeResetPattern);
    }
  };

  // ---- helper labels ---------------------------------------------------------
  //
  // A class on the frame rather than a re-render: the labels are still in the
  // DOM when they are hidden, so a screen reader and `title` keep naming the
  // controls, and toggling costs nothing. The print is untouched either way.
  proto.applyLabels = function (frame) {
    var target = frame || this.frame;
    if (!target) return;
    target.classList.toggle('is-labels-off', (this.dataset.labels || '').toLowerCase() === 'off');
  };

  /** Show or hide the helper labels. Reflected to `data-labels` so the
   *  attribute stays the single source of truth for the state. */
  proto.setLabels = function (on) {
    if (on) delete this.dataset.labels;
    else this.dataset.labels = 'off';
  };

  proto.attributeChangedCallback = function () { this.applyLabels(); };

  // A screen reader gets one useful sentence, not 30 button names.
  proto.describe = function () {
    var bits = ['tbd 16 front panel'];
    if (this.interactive) bits.push('interactive');
    var steps = parseList(this.dataset.steps);
    if (steps.length) bits.push('step buttons ' + steps.join(', ') + ' lit');
    var hi = parseList(this.dataset.highlight);
    if (hi.length) bits.push('highlighting ' + hi.join(', '));
    return bits.join(', ') + '.';
  };

  proto.renderScrews = function (frame) {
    L.screws.forEach(function (s) {
      var n = el('span', 'tbd-panel__screw');
      place(n, s.x, s.y, 6.72, 6.72);
      frame.appendChild(n);
    });
  };

  proto.renderOled = function (frame) {
    var body = el('div', 'tbd-panel__oled');
    place(body, L.oled.x, L.oled.y, L.oled.bodyW, L.oled.bodyH);

    var view = el('div', 'tbd-panel__oled-view');
    view.style.width = (L.oled.viewW / L.oled.bodyW * 100) + '%';
    view.style.height = (L.oled.viewH / L.oled.bodyH * 100) + '%';

    if (this.dataset.oled) {
      var img = document.createElement('img');
      img.src = this.imgBase + this.dataset.oled + '.png';
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      view.appendChild(img);
    }
    body.appendChild(view);
    frame.appendChild(body);
    this.oledView = view;
  };

  proto.renderEncoders = function (frame) {
    var self = this;
    this.knobs = [];
    L.encoders.forEach(function (k, index) {
      var n = el('span', 'tbd-panel__knob');
      n.dataset.control = k.id;
      n.title = k.label;
      place(n, k.x, k.y, k.d, k.d);
      n.appendChild(el('span', 'tbd-panel__knob-pointer'));
      if (self.interactive) {
        var knob = document.createElement('webaudio-knob');
        knob.setAttribute('diameter', '64');
        knob.setAttribute('min', '0');
        knob.setAttribute('max', '100');
        knob.setAttribute('step', '1');
        knob.setAttribute('value', '50');
        knob.setAttribute('sensitivity', '0.5');
        knob.setAttribute('valuetip', '0');
        knob.setAttribute('tooltip', '');
        knob.setAttribute('role', 'slider');
        knob.setAttribute('tabindex', '0');
        knob.setAttribute('aria-label', k.label);
        knob.setAttribute('aria-valuemin', '0');
        knob.setAttribute('aria-valuemax', '100');
        knob.dataset.slot = index;
        n.appendChild(knob);
        self.knobs[index] = knob;
        self.setKnobVisual(n, 50);
      }
      frame.appendChild(n);
    });
  };

  proto.setKnobVisual = function (wrap, value) {
    var angle = -135 + (Math.max(0, Math.min(100, value)) / 100 * 270);
    wrap.style.setProperty('--tbd-panel-knob-angle', angle + 'deg');
  };

  proto.renderFunctionLeds = function (frame) {
    (L.functionLeds || []).forEach(function (led) {
      // `kind` defaults to 'func' so a layout written before the REC LED
      // existed still renders the two meters exactly as it did.
      var n = el('span', 'tbd-panel__led tbd-panel__led--' + (led.kind || 'func'));
      n.dataset.control = led.id;
      place(n, led.x, led.y, L.ledDiameter, L.ledDiameter);
      frame.appendChild(n);
    });
  };

  proto.renderButtons = function (frame) {
    var self = this;
    this.controls = {};
    L.buttons.forEach(function (b) {
      // Every control the runtime binds, not a subset. Anything omitted here
      // still receives pointer events as a <span>, but is invisible to the
      // keyboard and announces nothing — so it looks like a dead button to
      // anyone not using a mouse.
      var RUNTIME_CONTROLS = ['play', 'func1', 'func2', 'func5', 'left', 'right', 'up', 'down'];
      var runtimeControl = self.dataset.runtimeModule && RUNTIME_CONTROLS.indexOf(b.id) !== -1;
      var canControl = self.interactive && (b.id === 'play' || runtimeControl);
      var n = el(canControl ? 'button' : 'span', 'tbd-panel__btn');
      if (canControl) {
        n.type = 'button';
        n.setAttribute('aria-label', b.name + (b.id === 'play' ? ' linked sequencer' : ' device control'));
        n.setAttribute('aria-pressed', 'false');
      }
      n.dataset.control = b.id;
      if (b.tint) n.classList.add('is-' + b.tint);
      if (b.small) n.classList.add('is-small');
      n.title = b.name;
      place(n, b.x, b.y, 8, 8);
      addPrint(n, printByControl[b.id], b.x, b.y, 8);
      // Only the caps the device leaves unmarked carry one. The print already
      // names the arrows, REC and PLAY, and a stand-in glyph beside the real
      // one would be a second answer to the same question.
      if (b.cap) n.appendChild(el('span', 'tbd-panel__cap', b.cap));
      frame.appendChild(n);
      self.controls[b.id] = n;
    });
  };

  proto.renderSteps = function (frame) {
    var self = this;
    this.stepBtns = [];
    this.stepLeds = [];
    L.stepRows.forEach(function (row) {
      L.stepColumns.forEach(function (x, i) {
        var index = row.from + i;

        var led = el('span', 'tbd-panel__led');
        place(led, x, row.ledY, L.ledDiameter, L.ledDiameter);
        frame.appendChild(led);
        self.stepLeds[index - 1] = led;

        var b = el(self.interactive ? 'button' : 'span', 'tbd-panel__btn tbd-panel__btn--step');
        if (self.interactive) {
          b.type = 'button';
          b.setAttribute('aria-label', 'Step ' + index);
          b.setAttribute('aria-pressed', 'false');
        }
        b.dataset.step = index;
        b.title = 'Step ' + index;
        place(b, x, row.buttonY, 8, 8);
        // The device numbers no pad; it prints a dash on 1, 5, 9 and 13 to
        // mark the beats. The number is ours.
        addPrint(b, printByStep[index], x, row.buttonY, 8);
        b.appendChild(el('span', 'tbd-panel__cap', String(index)));
        frame.appendChild(b);
        self.stepBtns[index - 1] = b;
      });
    });
  };

  proto.applyState = function () {
    var self = this;
    parseList(this.dataset.steps).forEach(function (n) {
      var i = parseInt(n, 10) - 1;
      if (self.stepBtns[i]) {
        self.stepBtns[i].classList.add('is-lit');
        if (self.interactive) self.stepBtns[i].setAttribute('aria-pressed', 'true');
      }
      if (self.stepLeds[i]) self.stepLeds[i].classList.add('is-lit');
    });
    parseList(this.dataset.stepsAlt).forEach(function (n) {
      var i = parseInt(n, 10) - 1;
      if (self.stepBtns[i]) self.stepBtns[i].classList.add('is-lit-alt');
      if (self.stepLeds[i]) self.stepLeds[i].classList.add('is-lit-alt');
    });
    parseList(this.dataset.highlight).forEach(function (id) {
      var n = self.controls[id];
      if (n) n.classList.add('is-highlight');
    });
  };

  // Follow a sequencer on the same page: its playhead becomes the step LEDs,
  // so the pattern you are hearing is the pattern you would see on the device.
  proto.attachFollow = function (runtimeLinked) {
    var id = this.dataset.follow;
    if (!id) return;
    var seq = document.getElementById(id);
    if (!seq) {
      // The panel can upgrade before the sequencer exists in the DOM if a
      // lesson ever puts the panel first. Try once more when parsing is done.
      if (document.readyState === 'loading') {
        var self0 = this;
        document.addEventListener('DOMContentLoaded', function () {
          self0.attachFollow(runtimeLinked);
        }, { once: true });
      }
      return;
    }
    var self = this;

    this._followEl = seq;
    this._setPattern = function (active) {
      if (!active) return;
      self.stepBtns.forEach(function (b, i) {
        var on = active.indexOf(i) !== -1;
        b.classList.toggle('is-lit', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (self.stepLeds[i]) self.stepLeds[i].classList.toggle('is-lit', on);
      });
    };
    this._setPlaying = function (playing) {
      var playBtn = self.controls.play;
      if (!playBtn) return;
      playBtn.classList.toggle('is-active', playing);
      playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    };
    this._onStep = function (e) {
      var d = e.detail || {};
      self.stepBtns.forEach(function (b, i) {
        var isPlayhead = i === d.column;
        b.classList.toggle('is-playhead', isPlayhead);
        if (self.stepLeds[i]) self.stepLeds[i].classList.toggle('is-playhead', isPlayhead);
      });
      self._setPattern(d.active);
      self._setPlaying(true);
    };
    this._onPattern = function (e) { self._setPattern((e.detail || {}).active); };
    this._onStop = function () {
      self.stepBtns.forEach(function (b) { b.classList.remove('is-playhead'); });
      self.stepLeds.forEach(function (led) { led.classList.remove('is-playhead'); });
      self._setPlaying(false);
    };
    // With the product runtime mounted, its LED state is authoritative. The
    // lesson sequencer still supplies browser audio, and its transport must
    // start/stop the runtime too; it must not paint the LEDs itself.
    if (!runtimeLinked) {
      seq.addEventListener('tbd-seq:step', this._onStep);
      seq.addEventListener('tbd-seq:stop', this._onStop);
      seq.addEventListener('tbd-seq:pattern', this._onPattern);
    } else {
      this._onRuntimePattern = function (e) {
        var detail = e.detail || {};
        if (detail.page !== undefined && detail.page !== 0) return;
        var active = detail.active || [];
        var productTrack = Number(detail.productTrack);
        if (!Number.isInteger(productTrack)) return;
        self._runtimeWantedPattern = active.slice();
        if (self._runtime && typeof self._runtime.setTrackPattern === 'function') {
          self._runtime.setTrackPattern(productTrack, active);
        }
      };
      this._onRuntimeResetPattern = function (e) {
        var detail = e.detail || {};
        if (detail.page !== undefined && detail.page !== 0) return;
        if (self._runtime && typeof self._runtime.setTrackPatterns === 'function') {
          self._runtime.setTrackPatterns(detail.patterns || []);
        }
      };
      this._onRuntimeFollowStep = function () {
        if (self._runtimePanelInput) return;
        self._runtimeWantedPlaying = true;
        if (self._runtime && typeof self._runtime.setTransport === 'function') self._runtime.setTransport(true);
      };
      this._onRuntimeFollowStop = function () {
        if (self._runtimePanelInput) return;
        self._runtimeWantedPlaying = false;
        if (self._runtime && typeof self._runtime.setTransport === 'function') self._runtime.setTransport(false);
      };
      seq.addEventListener('tbd-seq:step', this._onRuntimeFollowStep);
      seq.addEventListener('tbd-seq:stop', this._onRuntimeFollowStop);
      seq.addEventListener('tbd-seq:pattern', this._onRuntimePattern);
      seq.addEventListener('tbd-seq:reset-pattern', this._onRuntimeResetPattern);
    }

    this.stepBtns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        // With Wasm mounted, the physical input adapter sends the command to
        // the product runtime. Its next snapshot updates browser audio.
        if (runtimeLinked) return;
        var page = typeof seq.viewPage === 'number' ? seq.viewPage : 0;
        if (typeof seq.toggleStepEnabled === 'function') seq.toggleStepEnabled(page * 16 + i + 1);
      });
    });
    if (this.controls.play) {
      this.controls.play.addEventListener('click', function () {
        // The panel's own runtime listener performs the corresponding device
        // press. Unlock audio synchronously in the user gesture, then let the
        // canonical runtime snapshot decide whether playback actually starts.
        if (runtimeLinked) {
          if (typeof seq.unlockPanelAudio === 'function') seq.unlockPanelAudio();
          return;
        }
        if (typeof seq.toggle === 'function') seq.toggle();
        self._setPlaying(Boolean(seq.playing));
      });
    }
    if (!runtimeLinked && typeof seq.activeColumns === 'function') {
      this._setPattern(seq.activeColumns(seq.viewPage || 0));
    }
    if (typeof seq.getPanelKnobs === 'function') {
      seq.getPanelKnobs().forEach(function (config, i) {
        var knob = self.knobs[i];
        if (!knob) return;
        // The product runtime owns the visible pointer/value when mounted.
        // The same input must still reach the lesson sequencer, otherwise a
        // live panel turns knobs without changing the browser audio.
        if (!runtimeLinked) {
          if (typeof knob.setValue === 'function') knob.setValue(config.value, false);
          else knob.value = config.value;
        }
        knob.setAttribute('aria-label', 'Knob ' + (i + 1) + ', ' + config.label);
        if (!runtimeLinked) {
          knob.setAttribute('aria-valuenow', String(config.value));
          knob.setAttribute('aria-valuetext', config.display);
          self.setKnobVisual(knob.parentNode, config.value);
        }
        knob.addEventListener('input', function () {
          // With Wasm mounted, the semantic input adapter owns this gesture.
          // panel-runtime projects the resulting production snapshot into the
          // audio voice, so this DOM event must never become a second source
          // of parameter truth.
          if (runtimeLinked) return;
          var next = seq.setPanelKnob(i, knob.value, self.dataset.runtimeTrack);
          if (!next) return;
          if (!runtimeLinked) {
            knob.setAttribute('aria-valuenow', String(next.value));
            knob.setAttribute('aria-valuetext', next.display);
            self.setKnobVisual(knob.parentNode, next.value);
          }
        });
      });
    }
    if (!runtimeLinked) this._setPlaying(Boolean(seq.playing));
    else this._runtimeWantedPlaying = Boolean(seq.playing);
  };

  // A Wasm product runtime can animate this exact physical panel. The runtime
  // module supplies only semantic state and pixels; panel geometry remains the
  // one shared with TBD Studio above.
  proto.attachRuntime = function () {
    var self = this;
    import(this.dataset.runtimeModule).then(function (module) {
      if (!module || typeof module.mount !== 'function') throw new Error('runtime module has no mount(panel) export');
      return module.mount(self);
    }).then(function (runtime) {
      self._runtime = runtime;
      var initialPatterns = self._followEl && typeof self._followEl.getPanelPatterns === 'function'
        ? self._followEl.getPanelPatterns(0) : [];
      var initialized = initialPatterns.length && typeof runtime.setTrackPatterns === 'function'
        ? Promise.resolve(runtime.setTrackPatterns(initialPatterns)) : Promise.resolve();
      return initialized.then(function () {
        if (typeof self._runtimeWantedPlaying === 'boolean' && typeof runtime.setTransport === 'function') {
          runtime.setTransport(self._runtimeWantedPlaying);
        }
        return runtime;
      });
    }).catch(function (error) {
      self.frame.classList.add('has-runtime-error');
      self.frame.setAttribute('aria-label', 'tbd 16 front panel; GrooveBox runtime could not load.');
      // Keep the useful static panel and screenshot as a graceful fallback.
      if (window.console && console.error) console.error('TBD panel runtime:', error);
    });
  };

  if (!window.customElements.get('tbd-panel')) {
    window.customElements.define('tbd-panel', TbdPanel);
  }
}());
