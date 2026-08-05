/*
 * <tbd-seq> — the step sequencer used by the tbd 16 Learn lessons.
 *
 * A browser demo, not an emulator: the drums are synthesised with a handful of
 * oscillators so a lesson can make a point in one click, with no device and no
 * downloads. The grid deliberately mirrors the device — 16 steps, two rows of
 * eight, beat columns on 1·5·9·13 — because the layout is part of what a
 * lesson is teaching.
 *
 * Configuration is entirely data- attributes; see _includes/tbd-seq.html.
 *
 * Three rules this file exists to enforce, all learned from the standalone
 * prototype this replaces:
 *   1. An AudioContext is created only from a real user gesture inside a
 *      widget — never on page load, never from a document-level listener.
 *   2. One transport for the whole page. Starting a widget stops the others.
 *   3. The space bar only belongs to the widget when focus is inside it.
 */
(function () {
  'use strict';

  var SCRIPT = document.getElementById('tbd-seq-js');
  var LANG = (SCRIPT && SCRIPT.dataset.lang) || 'en';

  // ---------------------------------------------------------------------
  // Strings
  // ---------------------------------------------------------------------

  function bundle() {
    var all = window.TbdSeqStrings || {};
    return { active: all[LANG] || all.en || {}, fallback: all.en || {} };
  }

  function t(key) {
    var b = bundle();
    var v = b.active[key];
    if (v === undefined || v === '') v = b.fallback[key];
    return v === undefined ? key : v;
  }

  function tIn(group, key) {
    var b = bundle();
    var g = b.active[group] || {};
    var v = g[key];
    if (v === undefined || v === '') v = (b.fallback[group] || {})[key];
    return v === undefined ? key : v;
  }

  function fmt(str) {
    var args = Array.prototype.slice.call(arguments, 1);
    return String(str).replace(/\{(\d+)\}/g, function (m, i) {
      return args[i] === undefined ? m : args[i];
    });
  }

  // ---------------------------------------------------------------------
  // Audio — one context per page, built lazily inside a user gesture
  // ---------------------------------------------------------------------

  var Audio = {
    ctx: null,
    master: null,
    masterValue: 91,
    masterMuted: false,
    noise: null,
    _unlocked: false,

    ensure: function () {
      if (this.ctx) return this.ctx;
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();

      // iOS 16.4+: play through the hardware silent switch, like a media app.
      try {
        if (navigator.audioSession) navigator.audioSession.type = 'playback';
      } catch (e) { /* not supported — the silent switch will mute us */ }

      this.master = this.ctx.createGain();
      this.master.gain.value = this.masterMuted
        ? 0 : 0.8 * Math.pow(this.masterValue / 91, 2);
      this.master.connect(this.ctx.destination);

      // One second of white noise, shared by every noise-based voice.
      var buf = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      this.noise = buf;

      return this.ctx;
    },

    // Must be called from within a user gesture.
    unlock: function () {
      var ctx = this.ensure();
      if (!ctx) return null;
      if (ctx.state === 'suspended') ctx.resume();
      if (!this._unlocked) {
        var s = ctx.createBufferSource();
        s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        s.connect(ctx.destination);
        s.start(0);
        this._unlocked = true;
      }
      return ctx;
    },

    noiseSource: function () {
      var s = this.ctx.createBufferSource();
      s.buffer = this.noise;
      return s;
    },

    // One persistent gain -> panner per voice, so the device's TR.MIX level and
    // pan have something to act on. Built lazily and kept for the page's life:
    // a per-hit node cannot hold state between hits.
    chains: {},
    fx: null,

    // A decaying noise burst is a serviceable reverb impulse and costs nothing
    // to ship — far better than loading an impulse-response file for a widget
    // whose job is to teach what a send does.
    impulse: function (seconds, decay) {
      var rate = this.ctx.sampleRate;
      var length = Math.max(1, Math.floor(rate * seconds));
      var buffer = this.ctx.createBuffer(2, length, rate);
      for (var c = 0; c < 2; c++) {
        var data = buffer.getChannelData(c);
        for (var i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
      }
      return buffer;
    },

    // FX1 delay and FX2 reverb, one shared pair for the whole page, matching
    // the device: tracks send to two global effects rather than each carrying
    // its own. Built on first use so a page that never opens TR.MIX pays
    // nothing.
    ensureFx: function () {
      if (this.fx || !this.ctx) return this.fx;
      var ctx = this.ctx;

      var delay = ctx.createDelay(2);
      delay.delayTime.value = 0.3;
      var feedback = ctx.createGain();
      feedback.gain.value = 0.34;
      // Damping in the feedback path: undamped repeats pile up into noise and
      // stop sounding like an effect you can learn from.
      var damping = ctx.createBiquadFilter();
      damping.type = 'lowpass';
      damping.frequency.value = 3200;
      delay.connect(damping);
      damping.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.master);

      var reverb = ctx.createConvolver();
      reverb.buffer = this.impulse(1.9, 2.6);
      reverb.connect(this.master);

      this.fx = { delay: delay, reverb: reverb };
      return this.fx;
    },

    // Dotted eighth: the delay setting that makes a send sound intentional
    // rather than like a mistake, and it has to follow tempo to stay that way.
    setFxTempo: function (bpm) {
      if (!this.fx || !this.ctx || !bpm) return;
      var time = Math.min(2, (60 / bpm) * 0.75);
      this.fx.delay.delayTime.setTargetAtTime(time, this.ctx.currentTime, 0.05);
    },

    trackChain: function (id) {
      if (!this.ctx) return null;
      var chain = this.chains[id];
      if (!chain) {
        var gain = this.ctx.createGain();
        gain.gain.value = 1;
        var panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
        if (panner) {
          gain.connect(panner);
          panner.connect(this.master);
        } else {
          // Safari without StereoPanner still gets level; pan is a no-op
          // rather than a broken graph.
          gain.connect(this.master);
        }

        // Post-fader sends, as on the device: pulling the fader down takes the
        // effect with it, instead of leaving a track audible through its own
        // reverb after you muted it.
        var tail = panner || gain;
        var fx = this.ensureFx();
        var send1 = this.ctx.createGain();
        var send2 = this.ctx.createGain();
        send1.gain.value = 0;
        send2.gain.value = 0;
        tail.connect(send1);
        tail.connect(send2);
        send1.connect(fx.delay);
        send2.connect(fx.reverb);

        chain = this.chains[id] = {
          gain: gain, panner: panner, send1: send1, send2: send2
        };
      }
      return chain;
    },

    // Preserve the production fader's quadratic response while calibrating
    // its default wire value (91, about +6 dB on the device) to the browser
    // player's established 0.8 headroom. The runtime remains the authority.
    setMasterVolume: function (value, muted) {
      value = Math.max(0, Math.min(127, Math.round(Number(value))));
      if (!Number.isFinite(value)) return false;
      this.masterValue = value;
      this.masterMuted = Boolean(muted);
      if (!this.master || !this.ctx) return true;
      var target = this.masterMuted ? 0 : 0.8 * Math.pow(value / 91, 2);
      var now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(target, now, 0.012);
      return true;
    }
  };

  // ---------------------------------------------------------------------
  // Voices
  //
  // Each voice may expose knob parameters. Knob values are always 0–100 —
  // the same "turn it up, turn it down" scale a beginner reasons in — and the
  // voice maps them onto whatever the synthesis actually needs. `display`
  // turns the value back into something meaningful under the knob.
  // ---------------------------------------------------------------------

  function lerp(a, b, x) { return a + (b - a) * (x / 100); }
  function hz(v) { return Math.round(v) + ' Hz'; }
  function pct(v) { return Math.round(v) + '%'; }
  function ms(v) { return Math.round(v * 1000) + ' ms'; }

  function env(ctx, node, out, t0, dur, peak) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), t0 + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    node.connect(g);
    g.connect(out);
    return g;
  }

  var VOICES = {
    kick: {
      color: '#ff5a3c',
      params: {
        freq:     { def: 3, display: function (v) { return hz(lerp(38, 110, v)); } },
        tone:     { def: 46, display: pct },
        decay:    { def: 45, display: function (v) { return ms(lerp(0.09, 0.85, v)); } },
        dirt:     { def: 0, display: pct },
        fmEnv:    { def: 0, display: pct },
        fmDecay:  { def: 0, display: function (v) { return ms(lerp(0.015, 0.4, v)); } },
        fmAccent: { def: 8, display: pct }
      },
      play: function (ctx, t0, out, p, vel) {
        var fmAmount = p.fmEnv === undefined ? 0 : p.fmEnv;
        var base = lerp(38, 110, p.freq);
        var dur = lerp(0.09, 0.85, p.decay);
        var o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(base * lerp(3.2, 8, fmAmount), t0);
        o.frequency.exponentialRampToValueAtTime(base, t0 + Math.min(lerp(0.025, 0.25, p.fmDecay || 0), dur * 0.7));

        var node = o;
        if (p.dirt > 2) {
          // A gentle waveshaper: audible grit without turning into a buzz.
          var shaper = ctx.createWaveShaper();
          var amt = lerp(1, 24, p.dirt);
          var curve = new Float32Array(1024);
          for (var i = 0; i < 1024; i++) {
            var x = (i / 512) - 1;
            curve[i] = ((1 + amt) * x) / (1 + amt * Math.abs(x));
          }
          shaper.curve = curve;
          o.connect(shaper);
          node = shaper;
        }
        env(ctx, node, out, t0, dur, (0.92 + (p.fmAccent || 0) / 500) * vel);
        o.start(t0);
        o.stop(t0 + dur + 0.05);

        // `tone` is the beater click that lets a kick cut through on phones.
        if (p.tone > 2) {
          var n = Audio.noiseSource();
          var hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 2200;
          n.connect(hp);
          env(ctx, hp, out, t0, 0.03, (p.tone / 100) * 0.5 * vel);
          n.start(t0);
          n.stop(t0 + 0.05);
        }
      }
    },

    kick2: {
      color: '#ff7a52',
      params: {
        carFreq:     { def: 35, display: function (v) { return hz(lerp(30, 115, v)); } },
        carDecay:    { def: 10, display: function (v) { return ms(lerp(0.06, 1.2, v)); } },
        atkPitch:    { def: 12, display: pct },
        sweepDecay:  { def: 2, display: function (v) { return ms(lerp(0.015, 0.4, v)); } },
        modFreq:     { def: 5, display: function (v) { return hz(lerp(40, 1500, v)); } },
        modDecay:    { def: 6, display: function (v) { return ms(lerp(0.02, 0.8, v)); } },
        modFeedback: { def: 37, display: pct },
        index:       { def: 1, display: pct },
        ratio:       { def: 0, display: function (v) { return (1 + Math.round(v / 20)) + ':1'; } },
        envSync:     { def: 0, display: function (v) { return v >= 50 ? 'On' : 'Off'; } }
      },
      play: function (ctx, t0, out, p, vel) {
        // The two production pages expose the carrier and modulator separately.
        var base = lerp(30, 115, p.carFreq);
        var dur = lerp(0.06, 1.2, p.carDecay);
        var sweep = lerp(0.015, 0.4, p.sweepDecay);
        var ratio = 1 + Math.round((p.ratio || 0) / 20);
        var car = ctx.createOscillator();
        car.type = 'sine';
        car.frequency.setValueAtTime(base * lerp(1, 6, p.atkPitch), t0);
        car.frequency.exponentialRampToValueAtTime(base, t0 + Math.min(sweep, dur));
        var mod = ctx.createOscillator();
        mod.type = 'sine';
        mod.frequency.value = (p.envSync >= 50 ? base * ratio : lerp(40, 1500, p.modFreq));
        var modGain = ctx.createGain();
        modGain.gain.setValueAtTime(base * lerp(0.2, 10, Math.max(p.index, p.modFeedback)), t0);
        modGain.gain.exponentialRampToValueAtTime(1, t0 + Math.min(lerp(0.02, 0.8, p.modDecay), dur));
        mod.connect(modGain);
        modGain.connect(car.frequency);
        env(ctx, car, out, t0, dur, 0.95 * vel);
        mod.start(t0); mod.stop(t0 + dur);
        car.start(t0); car.stop(t0 + dur + 0.05);
      }
    },

    snare: {
      color: '#ffd23c',
      params: {
        freq:   { def: 9, display: function (v) { return hz(lerp(140, 300, v)); } },
        decay:  { def: 54, display: function (v) { return ms(lerp(0.06, 0.5, v)); } },
        fm:     { def: 24, display: pct },
        snap:   { def: 65, display: pct },
        accent: { def: 8, display: pct }
      },
      play: function (ctx, t0, out, p, vel) {
        var dur = lerp(0.06, 0.5, p.decay);
        var mix = p.snap / 100;

        var n = Audio.noiseSource();
        var hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = lerp(700, 4000, p.snap);
        n.connect(hp);
        env(ctx, hp, out, t0, dur, 0.6 * mix * vel);
        n.start(t0);
        n.stop(t0 + dur + 0.02);

        var o = ctx.createOscillator();
        o.type = 'triangle';
        var base = lerp(140, 300, p.freq);
        o.frequency.setValueAtTime(base * lerp(1, 3.5, p.fm), t0);
        o.frequency.exponentialRampToValueAtTime(base, t0 + Math.min(0.08, dur * 0.5));
        env(ctx, o, out, t0, dur * 0.55, (0.5 + (p.accent || 0) / 500) * (1 - mix * 0.6) * vel);
        o.start(t0);
        o.stop(t0 + dur);
      }
    },

    clap: {
      color: '#ff9f43',
      params: {
        freq:      { def: 10, display: function (v) { return hz(lerp(700, 2600, v)); } },
        tone:      { def: 40, display: pct },
        decay:     { def: 63, display: function (v) { return ms(lerp(0.08, 0.55, v)); } },
        scale:     { def: 0, display: pct },
        transient: { def: 0, display: function (v) { return String(Math.round(lerp(2, 6, v))); } }
      },
      play: function (ctx, t0, out, p, vel) {
        // Four short bursts a few milliseconds apart — the reason a clap
        // sounds like a room full of hands rather than one pair.
        var count = Math.round(lerp(2, 6, p.transient || 0));
        var spacing = lerp(0.007, 0.022, p.scale || 0);
        Array.from({ length: count }, function (_, i) { return i * spacing; }).forEach(function (dl, i) {
          var n = Audio.noiseSource();
          var bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.value = lerp(700, 2600, p.freq);
          bp.Q.value = lerp(0.6, 3, p.tone);
          n.connect(bp);
          var tail = lerp(0.08, 0.55, p.decay);
          env(ctx, bp, out, t0 + dl, i === count - 1 ? tail : Math.min(0.09, tail), 0.5 * vel);
          n.start(t0 + dl);
          n.stop(t0 + dl + tail + 0.02);
        });
      }
    },

    rim: {
      color: '#c56cf0',
      play: function (ctx, t0, out, p, vel) {
        var o = ctx.createOscillator();
        o.type = 'square';
        o.frequency.value = 1700;
        env(ctx, o, out, t0, 0.03, 0.5 * vel);
        o.start(t0);
        o.stop(t0 + 0.05);
      }
    },

    hhc: {
      color: '#43c9b0',
      params: {
        freq:   { def: 11, display: function (v) { return hz(lerp(5000, 12000, v)); } },
        tone:   { def: 55, display: pct },
        decay:  { def: 25, display: function (v) { return ms(lerp(0.015, 0.16, v)); } },
        noise:  { def: 61, display: pct },
        accent: { def: 8, display: pct }
      },
      play: function (ctx, t0, out, p, vel) {
        hat(ctx, t0, out, p, vel, lerp(0.015, 0.16, p.decay), 0.62 + (p.accent || 0) / 500);
      }
    },

    hho: {
      color: '#2ec4ff',
      params: {
        freq:  { def: 55, display: function (v) { return hz(lerp(5000, 12000, v)); } },
        tone:  { def: 40, display: pct },
        decay: { def: 50, display: function (v) { return ms(lerp(0.08, 0.7, v)); } },
        noise: { def: 70, display: pct }
      },
      play: function (ctx, t0, out, p, vel) {
        hat(ctx, t0, out, p, vel, lerp(0.08, 0.7, p.decay), 0.48);
      }
    },

    ride: {
      color: '#7d8bff',
      play: function (ctx, t0, out, p, vel) {
        var n = Audio.noiseSource();
        var hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 6000;
        n.connect(hp);
        env(ctx, hp, out, t0, 0.7, 0.25 * vel);
        n.start(t0); n.stop(t0 + 0.75);
        var o = ctx.createOscillator();
        o.type = 'square';
        o.frequency.value = 380;
        env(ctx, o, out, t0, 0.1, 0.08 * vel);
        o.start(t0); o.stop(t0 + 0.14);
      }
    },

    cow: {
      color: '#a0d911',
      play: function (ctx, t0, out, p, vel) {
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.28 * vel, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
        g.connect(out);
        [560, 845].forEach(function (f) {
          var o = ctx.createOscillator();
          o.type = 'square';
          o.frequency.value = f;
          o.connect(g);
          o.start(t0);
          o.stop(t0 + 0.32);
        });
      }
    },

    tom: {
      color: '#ff6b9d',
      play: function (ctx, t0, out, p, vel) {
        var o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(180, t0);
        o.frequency.exponentialRampToValueAtTime(90, t0 + 0.24);
        env(ctx, o, out, t0, 0.3, 0.7 * vel);
        o.start(t0); o.stop(t0 + 0.34);
      }
    },

    shk: {
      color: '#8ea0b5',
      play: function (ctx, t0, out, p, vel) {
        var n = Audio.noiseSource();
        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 6500;
        bp.Q.value = 2;
        n.connect(bp);
        env(ctx, bp, out, t0, 0.05, 0.25 * vel);
        n.start(t0); n.stop(t0 + 0.08);
      }
    }
  };

  // Shared by both hats — the only difference is how long they ring.
  function hat(ctx, t0, out, p, vel, dur, peak) {
    var n = Audio.noiseSource();
    var hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = lerp(4200, 9800, p.freq === undefined ? 55 : p.freq);
    hp.Q.value = 0.55;
    n.connect(hp);

    // Tone is a broad high-shelf, not a second narrow filter in series. The
    // former highpass+bandpass cascade discarded most Hat energy and made the
    // voice nearly disappear on laptop speakers.
    var shelf = ctx.createBiquadFilter();
    shelf.type = 'highshelf';
    shelf.frequency.value = 6500;
    var toneAmt = p.tone === undefined ? 40 : p.tone;
    shelf.gain.value = lerp(-4, 8, toneAmt);
    hp.connect(shelf);

    // Noise changes character, but never acts as a hidden volume control.
    // A zero fourth parameter from a product fixture must still produce a
    // clearly audible closed Hat.
    var noiseAmt = (p.noise === undefined ? 70 : p.noise) / 100;
    env(ctx, shelf, out, t0, dur, peak * (0.82 + noiseAmt * 0.18) * vel);
    n.start(t0);
    n.stop(t0 + dur + 0.05);
  }

  var STEP_OFF = 0, STEP_ON = 1, STEP_ACCENT = 2, STEP_GHOST = 3;
  var VELOCITY = {};
  VELOCITY[STEP_ON] = 1.0;
  VELOCITY[STEP_ACCENT] = 1.35;
  VELOCITY[STEP_GHOST] = 0.42;

  // ---------------------------------------------------------------------
  // Transport — one scheduler, one playing widget, for the whole page
  // ---------------------------------------------------------------------

  var Transport = {
    active: null,
    timer: null,
    raf: null,
    LOOKAHEAD: 0.12,
    TICK: 25,

    claim: function (inst) {
      if (this.active && this.active !== inst) this.active.stop();
      this.active = inst;
      var self = this;
      if (!this.timer) this.timer = setInterval(function () { self.tick(); }, this.TICK);
      if (!this.raf) this.raf = requestAnimationFrame(function () { self.frame(); });
    },

    release: function (inst) {
      if (this.active !== inst) return;
      this.active = null;
      clearInterval(this.timer);
      this.timer = null;
      cancelAnimationFrame(this.raf);
      this.raf = null;
    },

    tick: function () {
      if (this.active && Audio.ctx) this.active.schedule(Audio.ctx.currentTime + this.LOOKAHEAD);
    },

    frame: function () {
      var self = this;
      if (!this.active) { this.raf = null; return; }
      this.active.drawPlayhead();
      this.raf = requestAnimationFrame(function () { self.frame(); });
    }
  };

  // Mobile Safari throttles setInterval in a background tab; without this the
  // lookahead queue empties and then fires as a burst when you come back.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && Transport.active) Transport.active.stop();
  });

  // ---------------------------------------------------------------------
  // Pattern parsing:  "kick:1,5,9,13|snare:5,8~,13!"
  // ---------------------------------------------------------------------

  function parsePattern(spec, length) {
    var out = {};
    if (!spec) return out;
    spec.split('|').forEach(function (part) {
      var bits = part.split(':');
      if (bits.length < 2) return;
      var id = bits[0].trim();
      if (!id) return;
      var row = new Uint8Array(length);
      bits[1].split(',').forEach(function (tok) {
        tok = tok.trim();
        if (!tok) return;
        var state = STEP_ON;
        if (tok.slice(-1) === '!') { state = STEP_ACCENT; tok = tok.slice(0, -1); }
        else if (tok.slice(-1) === '~') { state = STEP_GHOST; tok = tok.slice(0, -1); }
        var n = parseInt(tok, 10);
        if (!isNaN(n) && n >= 1 && n <= length) row[n - 1] = state;
      });
      out[id] = row;
    });
    return out;
  }

  function trackIdsFrom(spec) {
    var ids = [];
    if (!spec) return ids;
    spec.split('|').forEach(function (part) {
      var id = part.split(':')[0].trim();
      if (id && ids.indexOf(id) === -1) ids.push(id);
    });
    return ids;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // ---------------------------------------------------------------------
  // The element
  // ---------------------------------------------------------------------

  var PAGE_LABELS = ['A', 'B', 'C', 'D'];

  class TbdSeq extends HTMLElement {}
  var proto = TbdSeq.prototype;

  proto.connectedCallback = function () {
    if (this._built) return;
    this._built = true;

    var d = this.dataset;
    this.steps = Math.max(16, Math.min(64, parseInt(d.steps, 10) || 16));
    this.pages = Math.ceil(this.steps / 16);
    this.bpm = parseInt(d.bpm, 10) || 120;
    this.swing = parseInt(d.swing, 10) || 0;
    this.accentEvery = parseInt(d.accent, 10) || 4;
    this.editable = d.edit !== 'false';
    this.controls = (d.controls || 'play,bpm').split(',').map(function (s) { return s.trim(); });
    // Every editable teaching pattern has a reliable way home. Authors define
    // the default in data-pattern/data-variant-b; Reset restores that authored
    // state instead of inventing a second browser-side preset.
    if (this.editable && this.controls.indexOf('reset') === -1) this.controls.push('reset');
    this.controlInputs = {};
    this.controlOutputs = {};
    this.compact = d.density === 'compact';

    this.variants = [parsePattern(d.pattern, this.steps)];
    this.variantLabels = ['A', 'B'];
    if (d.variantB) {
      this.variants.push(parsePattern(d.variantB, this.steps));
      this.variantLabels = (d.variantLabels || 'A,B').split(',').map(function (s) { return s.trim(); });
    }
    this.variantIndex = 0;

    var ids = d.tracks ? d.tracks.split(',').map(function (s) { return s.trim(); }) : null;
    if (!ids || !ids.length) {
      ids = [];
      this.variants.forEach(function (v) {
        Object.keys(v).forEach(function (id) { if (ids.indexOf(id) === -1) ids.push(id); });
      });
    }
    this.trackIds = ids.filter(function (id) { return VOICES[id]; });
    if (!this.trackIds.length) this.trackIds = ['kick'];
    var self = this;

    // Runtime-linked product tracks may need sound without adding curriculum
    // rows to the deliberately simple teaching grid. Keep those voices in the
    // same sequencer/audio state, but render only `trackIds`.
    this.audioTrackIds = this.trackIds.slice();
    (d.panelTracks || '').split(',').forEach(function (entry) {
      var id = (entry.split(':')[1] || '').trim();
      if (VOICES[id] && self.audioTrackIds.indexOf(id) === -1) self.audioTrackIds.push(id);
    });

    this.muted = {};
    this.knobValues = {};
    this.audioTrackIds.forEach(function (id) {
      self.muted[id] = false;
      self.knobValues[id] = {};
      var params = VOICES[id].params || {};
      Object.keys(params).forEach(function (k) {
        self.knobValues[id][k] = params[k].def;
      });
    });

    this.knobSpec = null;
    if (d.knobs) {
      var kb = d.knobs.split(':');
      var kid = kb[0].trim();
      if (VOICES[kid] && VOICES[kid].params && kb[1]) {
        this.knobSpec = {
          track: kid,
          names: kb[1].split(',').map(function (s) { return s.trim(); })
            .filter(function (k) { return VOICES[kid].params[k]; })
        };
      }
    }

    this.grid = {};
    this.loadVariant(0);

    this.playing = false;
    this.currentStep = 0;
    this.nextNoteTime = 0;
    this.queue = [];
    this.viewPage = 0;
    this.followPlay = true;
    this.focusRow = 0;
    this.focusCol = 0;

    this.render();
    this.observeVisibility();
  };

  proto.disconnectedCallback = function () {
    this.stop();
    if (this._io) { this._io.disconnect(); this._io = null; }
  };

  proto.loadVariant = function (i) {
    var v = this.variants[i] || {};
    var self = this;
    this.audioTrackIds.forEach(function (id) {
      var src = v[id];
      var row = new Uint8Array(self.steps);
      if (src) row.set(src.subarray(0, self.steps));
      self.grid[id] = row;
    });
  };

  // A widget that has scrolled away should not still be making noise.
  proto.observeVisibility = function () {
    if (!('IntersectionObserver' in window)) return;
    // An instrument the learner deliberately started keeps playing while they
    // scroll — reading the text below it is part of using it. A lesson widget
    // still stops, because there the sound belongs to the passage on screen.
    if (this.dataset.keepPlaying === 'true') return;
    var self = this;
    this._io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting && self.playing) self.stop();
      });
    }, { threshold: 0 });
    this._io.observe(this);
  };

  // -------------------------------------------------------------- render

  proto.render = function () {
    this.textContent = '';
    this.classList.add('tbd-seq');
    if (this.compact) this.classList.add('tbd-seq--compact');
    if (!this.editable) this.classList.add('tbd-seq--readonly');
    if (this.dataset.panelMonitor === 'true') this.classList.add('tbd-seq--panel-monitor');

    var head = el('div', 'tbd-seq__head');
    if (this.dataset.label) head.appendChild(el('span', 'tbd-seq__label', this.dataset.label));
    if (this.variants.length > 1) head.appendChild(this.buildVariants());
    if (head.childNodes.length) this.appendChild(head);

    this.appendChild(this.buildControls());
    if (this.pages > 1 && this.controls.indexOf('pages') !== -1) {
      this.appendChild(this.buildPages());
    }
    this.appendChild(this.buildGrid());
    if (this.knobSpec) this.appendChild(this.buildKnobs());

    this.status = el('div', 'tbd-seq__status');
    this.status.setAttribute('role', 'status');
    this.status.setAttribute('aria-live', 'polite');
    this.appendChild(this.status);
  };

  proto.buildVariants = function () {
    var self = this;
    var wrap = el('div', 'tbd-seq__variants');
    wrap.setAttribute('role', 'group');
    this.variantBtns = this.variants.map(function (_, i) {
      var b = el('button', 'tbd-seq__variant', self.variantLabels[i] || String(i + 1));
      b.type = 'button';
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () { self.selectVariant(i); });
      wrap.appendChild(b);
      return b;
    });
    return wrap;
  };

  proto.selectVariant = function (i) {
    if (i === this.variantIndex) return;
    this.variantIndex = i;
    // Deliberately does not touch nextNoteTime: the loop keeps its phase, so
    // you hear the difference between two patterns rather than a restart.
    this.loadVariant(i);
    this.refreshSteps();
    this.emitPatternChange(this.viewPage);
    this.variantBtns.forEach(function (b, j) {
      b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
    this.announce(fmt(t('statusVariant'), this.variantLabels[i]));
  };

  proto.buildControls = function () {
    var self = this;
    var bar = el('div', 'tbd-seq__controls');

    if (this.controls.indexOf('play') !== -1) {
      this.playBtn = el('button', 'tbd-seq__play', t('play'));
      this.playBtn.type = 'button';
      this.playBtn.setAttribute('aria-pressed', 'false');
      this.playBtn.setAttribute('aria-keyshortcuts', 'Space');
      this.playBtn.addEventListener('click', function () { self.toggle(); });
      bar.appendChild(this.playBtn);
    }

    if (this.controls.indexOf('bpm') !== -1) {
      bar.appendChild(this.buildSlider('bpm', t('tempo'), 30, 300, this.bpm, t('bpmUnit'), function (v) {
        self.bpm = v;
      }));
    }

    if (this.controls.indexOf('swing') !== -1) {
      bar.appendChild(this.buildSlider('swing', t('swing'), 0, 60, this.swing, t('percentUnit'), function (v) {
        self.swing = v;
      }));
    }

    if (this.controls.indexOf('length') !== -1) {
      bar.appendChild(this.buildLength());
    }

    ['clear', 'random'].forEach(function (name) {
      if (self.controls.indexOf(name) === -1) return;
      var b = el('button', 'tbd-seq__btn', t(name));
      b.type = 'button';
      b.addEventListener('click', function () {
        if (name === 'clear') self.clearGrid(); else self.randomise();
      });
      bar.appendChild(b);
    });

    if (this.controls.indexOf('reset') !== -1) {
      var reset = el('button', 'tbd-seq__btn tbd-seq__reset', t('reset'));
      reset.type = 'button';
      reset.addEventListener('click', function () { self.resetPattern(); });
      bar.appendChild(reset);
    }

    return bar;
  };

  proto.buildSlider = function (name, label, min, max, value, unitFmt, onInput) {
    var id = 'tbdseq-' + name + '-' + Math.random().toString(36).slice(2, 8);
    var wrap = el('div', 'tbd-seq__ctrl');
    var lab = el('label', 'tbd-seq__ctrl-label', label);
    lab.setAttribute('for', id);
    var input = document.createElement('input');
    input.type = 'range';
    input.id = id;
    input.min = min;
    input.max = max;
    input.value = value;
    input.setAttribute('aria-valuetext', fmt(unitFmt, value));
    var out = el('span', 'tbd-seq__ctrl-value', fmt(unitFmt, value));
    input.addEventListener('input', function () {
      var v = parseInt(input.value, 10);
      out.textContent = fmt(unitFmt, v);
      input.setAttribute('aria-valuetext', fmt(unitFmt, v));
      onInput(v);
    });
    this.controlInputs[name] = input;
    this.controlOutputs[name] = out;
    wrap.appendChild(lab);
    var row = el('div', 'tbd-seq__ctrl-row');
    row.appendChild(input);
    row.appendChild(out);
    wrap.appendChild(row);
    return wrap;
  };

  proto.buildLength = function () {
    var self = this;
    var wrap = el('div', 'tbd-seq__ctrl');
    wrap.appendChild(el('span', 'tbd-seq__ctrl-label', t('bars')));
    var seg = el('div', 'tbd-seq__seg');
    seg.setAttribute('role', 'group');
    this.lengthBtns = [16, 32, 64].map(function (n) {
      var b = el('button', 'tbd-seq__seg-btn', String(n / 16));
      b.type = 'button';
      b.setAttribute('aria-pressed', n === self.steps ? 'true' : 'false');
      b.setAttribute('aria-label', fmt(t('barsUnit'), n / 16));
      b.addEventListener('click', function () { self.setLength(n); });
      seg.appendChild(b);
      return b;
    });
    wrap.appendChild(seg);
    return wrap;
  };

  proto.buildPages = function () {
    var self = this;
    var wrap = el('div', 'tbd-seq__pages');
    wrap.appendChild(el('span', 'tbd-seq__ctrl-label', t('page')));
    this.pageBtns = [];
    for (var i = 0; i < this.pages; i++) {
      (function (i) {
        var b = el('button', 'tbd-seq__page', PAGE_LABELS[i]);
        b.type = 'button';
        b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        b.addEventListener('click', function () { self.setPage(i, true); });
        wrap.appendChild(b);
        self.pageBtns.push(b);
      }(i));
    }
    return wrap;
  };

  proto.buildGrid = function () {
    var self = this;
    var panel = el('div', 'tbd-seq__panel');

    var grid = el('div', 'tbd-seq__grid');
    grid.setAttribute('aria-label', t('gridLabel'));
    grid.addEventListener('keydown', function (e) { self.onGridKey(e); });

    this.cells = {};
    this.trackIds.forEach(function (id, rowIndex) {
      var row = el('div', 'tbd-seq__row');
      row.style.setProperty('--tbd-seq-color', VOICES[id].color);

      var isPanelMonitor = self.dataset.panelMonitor === 'true';
      var name = el(isPanelMonitor ? 'div' : 'button', 'tbd-seq__rowlab');
      if (!isPanelMonitor) {
        name.type = 'button';
        name.setAttribute('aria-pressed', 'false');
        name.setAttribute('aria-label', fmt(t('muteLabel'), tIn('tracks', id)));
      }
      name.appendChild(el('span', 'tbd-seq__dot'));
      name.appendChild(el('span', 'tbd-seq__rowlab-long', tIn('tracks', id)));
      name.appendChild(el('span', 'tbd-seq__rowlab-short', tIn('tracksShort', id)));
      if (!isPanelMonitor) name.addEventListener('click', function () { self.toggleMute(id, name); });
      row.appendChild(name);

      var steps = el('div', 'tbd-seq__steps');
      var half1 = el('div', 'tbd-seq__half');
      var half2 = el('div', 'tbd-seq__half');
      var cells = [];
      for (var c = 0; c < 16; c++) {
        (function (c) {
          var b = el('button', 'tbd-seq__step');
          b.type = 'button';
          b.tabIndex = -1;
          b.dataset.col = c;
          b.dataset.row = rowIndex;
          if (self.accentEvery && c % self.accentEvery === 0) b.classList.add('is-beat');
          if (self.editable) {
            b.addEventListener('click', function () {
              if (self.dataset.panelMonitor === 'true') {
                self.toggleStepEnabled(self.viewPage * 16 + c + 1, id);
              } else {
                self.cycleStep(id, c, rowIndex);
              }
            });
          } else {
            b.setAttribute('aria-disabled', 'true');
          }
          (c < 8 ? half1 : half2).appendChild(b);
          cells.push(b);
        }(c));
      }
      steps.appendChild(half1);
      steps.appendChild(half2);
      row.appendChild(steps);
      grid.appendChild(row);
      self.cells[id] = cells;
    });

    if (this.cells[this.trackIds[0]]) this.cells[this.trackIds[0]][0].tabIndex = 0;

    panel.appendChild(grid);
    this.gridEl = grid;
    this.refreshSteps();

    // Space belongs to the page unless focus is genuinely inside the widget.
    this.addEventListener('keydown', function (e) {
      if (e.key !== ' ' && e.key !== 'Spacebar') return;
      if (!self.contains(document.activeElement)) return;
      var tag = document.activeElement.tagName;
      if (tag === 'BUTTON' || tag === 'INPUT') return; // let the control act
      e.preventDefault();
      self.toggle();
    });

    return panel;
  };

  proto.buildKnobs = function () {
    var self = this;
    var wrap = el('div', 'tbd-seq__knobs');
    var id = this.knobSpec.track;
    var params = VOICES[id].params;

    this.knobEls = [];
    this.knobSpec.names.forEach(function (key) {
      var spec = params[key];
      var cell = el('div', 'tbd-seq__knob');
      var knob = document.createElement('webaudio-knob');
      knob.setAttribute('diameter', '46');
      knob.setAttribute('min', '0');
      knob.setAttribute('max', '100');
      knob.setAttribute('step', '1');
      knob.setAttribute('value', String(spec.def));
      knob.setAttribute('colors', '#ccc;#484848;#525252');
      knob.setAttribute('valuetip', '0');
      knob.setAttribute('sensitivity', '0.5');
      knob.setAttribute('tooltip', '');

      var caption = el('span', 'tbd-seq__knob-name', tIn('knobs', key));
      var value = el('span', 'tbd-seq__knob-value', spec.display(spec.def));

      // webaudio-controls gives the knob no accessible role and a positive
      // tabindex on an element inside its shadow root. Both are fixed here
      // rather than by patching the vendored file.
      knob.setAttribute('role', 'slider');
      knob.setAttribute('tabindex', '0');
      knob.setAttribute('aria-valuemin', '0');
      knob.setAttribute('aria-valuemax', '100');
      var setAria = function (v) {
        knob.setAttribute('aria-valuenow', String(v));
        knob.setAttribute('aria-valuetext', spec.display(v));
        knob.setAttribute('aria-label', fmt(t('knobLabel'), tIn('tracks', id), tIn('knobs', key)));
      };
      setAria(spec.def);

      knob.addEventListener('input', function () {
        var v = Math.round(knob.value);
        self.knobValues[id][key] = v;
        value.textContent = spec.display(v);
        setAria(v);
      });

      // Arrow up/down come from the library; the rest are the conventions a
      // slider is expected to honour.
      knob.addEventListener('keydown', function (e) {
        var v = Math.round(knob.value), next = null;
        if (e.key === 'ArrowRight') next = v + 1;
        else if (e.key === 'ArrowLeft') next = v - 1;
        else if (e.key === 'PageUp') next = v + 10;
        else if (e.key === 'PageDown') next = v - 10;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = 100;
        if (next === null) return;
        e.preventDefault();
        e.stopPropagation();
        knob.setValue(Math.max(0, Math.min(100, next)), true);
      });

      cell.appendChild(knob);
      cell.appendChild(caption);
      cell.appendChild(value);
      wrap.appendChild(cell);
      self.knobEls.push(knob);
    });

    // The library builds its shadow DOM on upgrade; neutralise its
    // tabindex="1" once that has happened.
    requestAnimationFrame(function () {
      self.knobEls.forEach(function (k) {
        var body = k.shadowRoot && k.shadowRoot.querySelector('.webaudio-knob-body');
        if (body) body.setAttribute('tabindex', '-1');
      });
    });

    return wrap;
  };

  // --------------------------------------------------------------- state

  proto.cycleStep = function (id, col, rowIndex) {
    this.toggleStep(this.viewPage * 16 + col + 1, id, rowIndex);
  };

  // Public control surface for a linked <tbd-panel>. Step numbers are
  // one-based, matching the legends printed on the device and in the lesson.
  proto.toggleStep = function (stepNumber, id, rowIndex) {
    if (!this.editable) return false;
    id = id || this.trackIds[0];
    var i = parseInt(stepNumber, 10) - 1;
    if (!this.grid[id] || i < 0 || i >= this.steps) return false;

    // Off → on → accent → ghost → off. Accents and ghosts are what turn a
    // typed-in pattern into something with a shape.
    this.grid[id][i] = (this.grid[id][i] + 1) % 4;
    var page = Math.floor(i / 16);
    var col = i % 16;
    if (page === this.viewPage) this.paintStep(id, col);
    this.focusRow = rowIndex === undefined ? this.trackIds.indexOf(id) : rowIndex;
    this.focusCol = col;
    this.emitPatternChange(page, id);
    return true;
  };

  // Device buttons are binary in this lesson: one press toggles a step. The
  // richer browser grid keeps its on → accent → ghost cycle for later lessons.
  proto.toggleStepEnabled = function (stepNumber, id) {
    if (!this.editable) return false;
    id = id || this.trackIds[0];
    var i = parseInt(stepNumber, 10) - 1;
    if (!this.grid[id] || i < 0 || i >= this.steps) return false;
    this.grid[id][i] = this.grid[id][i] === STEP_OFF ? STEP_ON : STEP_OFF;
    var page = Math.floor(i / 16);
    var col = i % 16;
    if (page === this.viewPage) this.paintStep(id, col);
    this.focusRow = this.trackIds.indexOf(id);
    this.focusCol = col;
    this.emitPatternChange(page, id);
    return true;
  };

  // A followed hardware panel exposes its four encoders through the same
  // 0–100 parameter model used by the sequencer's Web Audio Controls.
  proto.getPanelTrackId = function (productTrack) {
    var track = parseInt(productTrack, 10);
    var spec = this.dataset.panelTracks || '';
    var mapped = null;
    if (!Number.isFinite(track) && spec) {
      var first = spec.split(',')[0].split(':');
      mapped = (first[1] || '').trim();
      if (mapped && this.grid[mapped]) return mapped;
    }
    spec.split(',').some(function (entry) {
      var parts = entry.split(':');
      if (parseInt(parts[0], 10) !== track) return false;
      mapped = (parts[1] || '').trim();
      return true;
    });
    if (mapped && this.grid[mapped]) return mapped;
    // Existing one-track Lesson 1 embeds predate the explicit map.
    if ((!spec && (!Number.isFinite(track) || track === 1)) || (!Number.isFinite(track) && this.trackIds.length === 1)) {
      return this.trackIds[0];
    }
    return null;
  };

  proto.getPanelProductTrack = function (trackId) {
    var wanted = String(trackId || '');
    var productTrack = null;
    (this.dataset.panelTracks || '').split(',').some(function (entry) {
      var parts = entry.split(':');
      if ((parts[1] || '').trim() !== wanted) return false;
      var parsed = parseInt(parts[0], 10);
      if (Number.isFinite(parsed)) productTrack = parsed;
      return true;
    });
    return productTrack;
  };

  // Initial lesson state and Reset use the same track-addressed payload. The
  // panel applies it through semantic product inputs after the runtime mounts;
  // this remains a request, and runtime snapshots remain authoritative.
  proto.getPanelPatterns = function (page) {
    var self = this;
    page = page === undefined ? 0 : page;
    return this.audioTrackIds.map(function (id) {
      return {
        productTrack: self.getPanelProductTrack(id),
        active: self.activeColumnsForTrack(id, page)
      };
    }).filter(function (entry) { return entry.productTrack !== null; });
  };

  proto.getPanelKnobs = function (productTrack, page) {
    var id = this.getPanelTrackId(productTrack);
    if (!id) return [];
    var params = VOICES[id].params || {};
    var self = this;
    page = Math.max(0, Number(page) || 0);
    return Object.keys(params).slice(page * 4, page * 4 + 4).map(function (key) {
      var value = self.knobValues[id][key];
      return { key: key, label: tIn('knobs', key), value: value, display: params[key].display(value) };
    });
  };

  proto.setPanelKnob = function (slot, value, productTrack, page) {
    var id = this.getPanelTrackId(productTrack);
    if (!id) return null;
    var params = VOICES[id].params || {};
    page = Math.max(0, Number(page) || 0);
    var key = Object.keys(params)[page * 4 + slot];
    if (!key) return null;
    value = Math.max(0, Math.min(100, Math.round(value)));
    this.knobValues[id][key] = value;
    return { key: key, label: tIn('knobs', key), value: value, display: params[key].display(value) };
  };

  // A product runtime owns the canonical pattern. This updates the browser
  // audio/view projection without emitting another command back to it.
  proto.setPanelPattern = function (active, page, productTrack) {
    page = page === undefined ? 0 : page;
    var id = this.getPanelTrackId(productTrack);
    if (!id) return false;
    var row = this.grid[id];
    if (!row) return false;
    var wanted = {};
    (active || []).forEach(function (column) { wanted[column] = true; });
    var base = page * 16;
    for (var column = 0; column < 16 && base + column < this.steps; column++) {
      row[base + column] = wanted[column] ? STEP_ON : STEP_OFF;
      if (page === this.viewPage) this.paintStep(id, column);
    }
    // Publish a read-only projection event for lesson progress UI. The event
    // is emitted only after a product-runtime snapshot updates this grid; it
    // is not a command and cannot become another sequencer authority.
    this.dispatchEvent(new CustomEvent('tbd-seq:runtime-pattern', {
      detail: { page: page, productTrack: Number(productTrack), active: (active || []).slice() }
    }));
    return true;
  };

  proto.unlockPanelAudio = function () { return Boolean(Audio.unlock()); };

  proto.setPanelTransport = function (running) {
    running = Boolean(running);
    if (running === this.playing) return;
    if (running) this.play(); else this.stop();
  };

  // Keep the approachable browser-audio player on the firmware clock when a
  // learner changes BPM on the production Tempo screen.
  proto.setPanelTempo = function (value) {
    value = Math.max(30, Math.min(300, Math.round(Number(value))));
    if (!Number.isFinite(value)) return false;
    this.bpm = value;
    var input = this.controlInputs && this.controlInputs.bpm;
    var out = this.controlOutputs && this.controlOutputs.bpm;
    var label = fmt(t('bpmUnit'), value);
    if (input) {
      input.value = String(value);
      input.setAttribute('aria-valuetext', label);
    }
    if (out) out.textContent = label;
    return true;
  };

  proto.setPanelMasterVolume = function (value, muted) {
    return Audio.setMasterVolume(value, muted);
  };

  // Project the device's TR.MIX strip onto the browser voice for that track.
  // Values arrive in the firmware's own 0-127 range; 64 is centre for pan,
  // and 100 is unity for level so the fader has headroom above nominal like
  // the device's does.
  proto.setPanelMixer = function (productTrack, level, pan, fx1, fx2) {
    var id = this.getPanelTrackId(productTrack);
    if (!id || !Audio.ctx) return false;
    var chain = Audio.trackChain(id);
    if (!chain) return false;
    var now = Audio.ctx.currentTime;

    if (Number.isFinite(level)) {
      var normalized = Math.max(0, Math.min(127, level)) / 100;
      // Quadratic, matching the master fader's response, so a move near the
      // bottom of the range does what the ear expects.
      chain.gain.gain.setTargetAtTime(normalized * normalized, now, 0.02);
    }
    if (chain.panner && Number.isFinite(pan)) {
      chain.panner.pan.setTargetAtTime(
        Math.max(-1, Math.min(1, (pan - 64) / 63)), now, 0.02);
    }

    // Sends are quadratic too, and top out below unity: a fully open send that
    // drowns the dry signal teaches the wrong lesson about what a send is.
    function send(node, value) {
      if (!node || !Number.isFinite(value)) return;
      var amount = Math.max(0, Math.min(127, value)) / 127;
      node.gain.setTargetAtTime(amount * amount * 0.9, now, 0.02);
    }
    send(chain.send1, fx1);
    send(chain.send2, fx2);

    Audio.setFxTempo(this.bpm);
    return true;
  };

  // The display name of a voice row, in the page's language. A linked runtime
  // uses this so the device screen and the grid row agree on what a track is
  // called instead of maintaining a second list that can drift.
  proto.getTrackLabel = function (id) {
    return tIn('tracks', id);
  };

  // Move a slider and its readout together. Used when something other than the
  // learner's own drag changes a value, so the control never lies about state.
  proto.setSliderValue = function (name, value, unitKey) {
    var input = this.controlInputs && this.controlInputs[name];
    var out = this.controlOutputs && this.controlOutputs[name];
    var label = fmt(t(unitKey), value);
    if (input) {
      input.value = String(value);
      input.setAttribute('aria-valuetext', label);
    }
    if (out) out.textContent = label;
  };

  // Load a whole multi-track pattern at once, in the same `data-pattern` spec
  // authors already use ("kick:1,5,9,13|snare:5,13"). Tracks absent from the
  // spec are cleared rather than left behind, so a preset is what you hear and
  // nothing survives from the previous one.
  //
  // Deliberately additive: nothing calls this unless a page opts in, so every
  // existing lesson behaves exactly as before.
  proto.applyPreset = function (spec, opts) {
    opts = opts || {};
    var parsed = parsePattern(spec, this.steps);
    var self = this;

    this.audioTrackIds.forEach(function (id) {
      var row = new Uint8Array(self.steps);
      if (parsed[id]) row.set(parsed[id].subarray(0, self.steps));
      self.grid[id] = row;
    });

    if (opts.bpm) {
      this.bpm = Math.max(30, Math.min(300, Math.round(opts.bpm)));
      this.setSliderValue('bpm', this.bpm, 'bpmUnit');
    }
    if (opts.swing !== undefined) {
      this.swing = Math.max(0, Math.min(60, Math.round(opts.swing)));
      this.setSliderValue('swing', this.swing, 'percentUnit');
    }

    this.refreshSteps();
    // One batch, not eight per-track events: see emitPatternBatch. Emitting
    // per track would walk a linked device onto the last track in the map.
    this.emitPatternBatch(this.viewPage);
    if (opts.announce) this.announce(opts.announce);
  };

  proto.paintStep = function (id, col) {
    var i = this.viewPage * 16 + col;
    var b = this.cells[id][col];
    var v = i < this.steps ? this.grid[id][i] : STEP_OFF;
    b.classList.toggle('is-on', v === STEP_ON);
    b.classList.toggle('is-accent', v === STEP_ACCENT);
    b.classList.toggle('is-ghost', v === STEP_GHOST);
    b.classList.toggle('is-outside', i >= this.steps);
    b.setAttribute('aria-pressed', v === STEP_OFF ? 'false' : 'true');
    var state = v === STEP_ACCENT ? t('stepStateAccent')
      : v === STEP_GHOST ? t('stepStateGhost')
        : v === STEP_ON ? t('stepStateOn') : t('stepStateOff');
    b.setAttribute('aria-label', fmt(t('stepLabel'), tIn('tracks', id), i + 1) + ', ' + state);
  };

  proto.refreshSteps = function () {
    var self = this;
    this.trackIds.forEach(function (id) {
      for (var c = 0; c < 16; c++) self.paintStep(id, c);
    });
  };

  proto.toggleMute = function (id, btn) {
    this.muted[id] = !this.muted[id];
    btn.setAttribute('aria-pressed', this.muted[id] ? 'true' : 'false');
    btn.classList.toggle('is-muted', this.muted[id]);
  };

  // Publish a whole-grid change as ONE batch instead of a per-track stream.
  //
  // The per-track path makes a linked runtime select each track in turn and
  // leaves it on the last one — so rewriting eight tracks parks the device on
  // track 8 instead of wherever the learner was. The batch channel applies
  // every track and then restores the original selection.
  proto.emitPatternBatch = function (page) {
    page = page === undefined ? this.viewPage : page;
    var patterns = this.getPanelPatterns(page);
    if (!patterns.length) {
      this.emitPatternChange(page);
      return;
    }
    this.dispatchEvent(new CustomEvent('tbd-seq:reset-pattern', {
      detail: { page: page, patterns: patterns }
    }));
  };

  proto.clearGrid = function () {
    var self = this;
    this.trackIds.forEach(function (id) { self.grid[id].fill(STEP_OFF); });
    this.refreshSteps();
    this.emitPatternBatch(this.viewPage);
  };

  proto.randomise = function () {
    var self = this;
    this.trackIds.forEach(function (id, i) {
      var row = self.grid[id];
      for (var s = 0; s < self.steps; s++) {
        // Sparser as you go down the rows, so the result still reads as a beat.
        var chance = i === 0 ? 0.32 : 0.22 - i * 0.02;
        row[s] = Math.random() < chance ? STEP_ON : STEP_OFF;
      }
    });
    this.refreshSteps();
    this.emitPatternBatch(this.viewPage);
  };

  proto.resetPattern = function () {
    this.loadVariant(this.variantIndex);
    this.refreshSteps();
    var self = this;
    var patterns = this.getPanelPatterns(this.viewPage);
    if (patterns.length) {
      this.dispatchEvent(new CustomEvent('tbd-seq:reset-pattern', {
        detail: { page: this.viewPage, patterns: patterns }
      }));
    } else {
      this.emitPatternChange(this.viewPage);
    }
    this.announce(t('statusReset'));
  };

  proto.setLength = function (n) {
    var self = this;
    var old = this.steps;
    this.steps = n;
    this.pages = Math.ceil(n / 16);
    this.audioTrackIds.forEach(function (id) {
      var next = new Uint8Array(n);
      next.set(self.grid[id].subarray(0, Math.min(old, n)));
      // Repeat what is already there rather than leaving new bars empty —
      // extending a pattern should sound like the same pattern, at first.
      if (n > old) {
        for (var s = old; s < n; s++) next[s] = next[s % old];
      }
      self.grid[id] = next;
    });
    if (this.lengthBtns) {
      this.lengthBtns.forEach(function (b, i) {
        b.setAttribute('aria-pressed', [16, 32, 64][i] === n ? 'true' : 'false');
      });
    }
    if (this.viewPage >= this.pages) this.setPage(0, true);
    this.rebuildPages();
    this.refreshSteps();
  };

  proto.rebuildPages = function () {
    if (this.controls.indexOf('pages') === -1) return;
    var existing = this.querySelector('.tbd-seq__pages');
    var fresh = this.pages > 1 ? this.buildPages() : null;
    if (existing && fresh) this.replaceChild(fresh, existing);
    else if (existing && !fresh) this.removeChild(existing);
    else if (!existing && fresh) this.insertBefore(fresh, this.querySelector('.tbd-seq__panel'));
  };

  proto.setPage = function (i, manual) {
    if (i >= this.pages) return;
    this.viewPage = i;
    if (this.pageBtns) {
      this.pageBtns.forEach(function (b, j) {
        b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
      });
    }
    if (manual) this.followPlay = false;
    this.refreshSteps();
    this.emitPatternChange(this.viewPage);
  };

  // ------------------------------------------------------------ keyboard

  proto.onGridKey = function (e) {
    var keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
    if (keys.indexOf(e.key) === -1) return;
    e.preventDefault();

    var rows = this.trackIds.length;
    if (e.key === 'ArrowLeft') this.focusCol = Math.max(0, this.focusCol - 1);
    else if (e.key === 'ArrowRight') this.focusCol = Math.min(15, this.focusCol + 1);
    else if (e.key === 'ArrowUp') this.focusRow = Math.max(0, this.focusRow - 1);
    else if (e.key === 'ArrowDown') this.focusRow = Math.min(rows - 1, this.focusRow + 1);
    else if (e.key === 'Home') this.focusCol = 0;
    else if (e.key === 'End') this.focusCol = 15;
    else if (e.key === 'PageUp') this.setPage(Math.max(0, this.viewPage - 1), true);
    else if (e.key === 'PageDown') this.setPage(Math.min(this.pages - 1, this.viewPage + 1), true);

    this.moveFocus();
  };

  // Roving tabindex: 16 columns × N rows would otherwise be N×16 tab stops.
  proto.moveFocus = function () {
    var self = this;
    this.trackIds.forEach(function (id, r) {
      self.cells[id].forEach(function (b, c) {
        b.tabIndex = (r === self.focusRow && c === self.focusCol) ? 0 : -1;
      });
    });
    var target = this.cells[this.trackIds[this.focusRow]][this.focusCol];
    if (target) target.focus();
  };

  // ------------------------------------------------------------ playback

  proto.toggle = function () {
    if (this.playing) this.stop(); else this.play();
  };

  proto.play = function () {
    var ctx = Audio.unlock();
    if (!ctx) return;
    Transport.claim(this);
    this.playing = true;
    this.followPlay = true;
    this.currentStep = 0;
    this.queue = [];
    this.nextNoteTime = ctx.currentTime + 0.06;
    if (this.playBtn) {
      this.playBtn.textContent = t('stop');
      this.playBtn.setAttribute('aria-pressed', 'true');
      this.playBtn.classList.add('is-playing');
    }
    this.classList.add('is-playing');
    this.announce(fmt(t('statusPlaying'), this.dataset.label || '', this.bpm));
  };

  proto.stop = function () {
    if (!this.playing) return;
    this.playing = false;
    Transport.release(this);
    this.queue = [];
    if (this.playBtn) {
      this.playBtn.textContent = t('play');
      this.playBtn.setAttribute('aria-pressed', 'false');
      this.playBtn.classList.remove('is-playing');
    }
    this.classList.remove('is-playing');
    this.clearPlayhead();
    this.dispatchEvent(new CustomEvent('tbd-seq:stop'));
    this.announce(t('statusStopped'));
  };

  proto.stepDuration = function () {
    return (60 / this.bpm) / 4;
  };

  proto.schedule = function (until) {
    while (this.nextNoteTime < until) {
      var step = this.currentStep;
      var dur = this.stepDuration();
      // Swing pushes every second 16th later; at 60% it is close to a triplet
      // feel, which is where hip-hop and garage live.
      var offset = (step % 2 === 1) ? (this.swing / 100) * (2 / 3) * dur : 0;
      var when = this.nextNoteTime + offset;

      this.fireStep(step, when);
      this.queue.push({ step: step, time: when });

      this.nextNoteTime += dur;
      this.currentStep = (step + 1) % this.steps;
    }
  };

  proto.fireStep = function (step, when) {
    var self = this;
    var ctx = Audio.ctx;
    this.getAudibleTrackIds(step).forEach(function (id) {
      var v = self.grid[id][step];
      var out = ctx.createGain();
      out.gain.value = 1;
      // Through the track's own strip, not straight to master, so TR.MIX level
      // and pan apply to everything that track plays.
      var chain = Audio.trackChain(id);
      out.connect(chain ? chain.gain : Audio.master);
      VOICES[id].play(ctx, when, out, self.knobValues[id], VELOCITY[v] || 1);
    });
  };

  // Kept separate from rendering so runtime-mapped voices that are hidden
  // from a beginner grid are still first-class scheduler inputs.
  proto.getAudibleTrackIds = function (step) {
    var self = this;
    return this.audioTrackIds.filter(function (id) {
      return !self.muted[id] && self.grid[id] && Boolean(self.grid[id][step]);
    });
  };

  proto.drawPlayhead = function () {
    if (!Audio.ctx) return;
    var now = Audio.ctx.currentTime;
    var current = null;
    while (this.queue.length && this.queue[0].time <= now) {
      current = this.queue.shift().step;
    }
    if (current === null || current === this._drawnStep) return;
    this._drawnStep = current;

    var page = Math.floor(current / 16);
    if (this.followPlay && page !== this.viewPage) this.setPage(page, false);

    this.clearPlayhead();
    var col = current % 16;
    var self = this;
    if (page === this.viewPage) {
      this.trackIds.forEach(function (id) {
        self.cells[id][col].classList.add('is-playhead');
      });
    }

    // Let a <tbd-panel data-follow="..."> light its step LEDs in time with us,
    // so the pattern being heard is the pattern shown on the device.
    this.dispatchEvent(new CustomEvent('tbd-seq:step', {
      detail: { step: current, column: col, page: page, active: this.activeColumns(page) }
    }));
  };

  // Which of the 16 columns on `page` have anything playing on any track.
  proto.activeColumns = function (page) {
    var out = [];
    var base = page * 16;
    for (var c = 0; c < 16; c++) {
      var i = base + c;
      if (i >= this.steps) break;
      for (var k = 0; k < this.trackIds.length; k++) {
        var id = this.trackIds[k];
        if (!this.muted[id] && this.grid[id][i]) { out.push(c); break; }
      }
    }
    return out;
  };

  proto.activeColumnsForTrack = function (trackId, page) {
    var out = [];
    var row = this.grid[trackId];
    if (!row) return out;
    var base = page * 16;
    for (var c = 0; c < 16; c++) {
      var i = base + c;
      if (i >= this.steps) break;
      if (!this.muted[trackId] && row[i]) out.push(c);
    }
    return out;
  };

  // Keep external representations of the device in sync even while stopped.
  proto.emitPatternChange = function (page, trackId) {
    page = page === undefined ? this.viewPage : page;
    this.dispatchEvent(new CustomEvent('tbd-seq:pattern', {
      detail: {
        page: page,
        trackId: trackId || null,
        productTrack: trackId ? this.getPanelProductTrack(trackId) : null,
        active: trackId ? this.activeColumnsForTrack(trackId, page) : this.activeColumns(page)
      }
    }));
  };

  proto.emitAllPatternChanges = function (page) {
    var self = this;
    var mapped = this.audioTrackIds.filter(function (id) {
      return self.getPanelProductTrack(id) !== null;
    });
    if (!mapped.length) {
      this.emitPatternChange(page);
      return;
    }
    mapped.forEach(function (id) { self.emitPatternChange(page, id); });
  };

  proto.clearPlayhead = function () {
    var marked = this.querySelectorAll('.is-playhead');
    for (var i = 0; i < marked.length; i++) marked[i].classList.remove('is-playhead');
    this._drawnStep = null;
  };

  proto.announce = function (msg) {
    if (this.status) this.status.textContent = msg;
  };

  if (!window.customElements.get('tbd-seq')) {
    window.customElements.define('tbd-seq', TbdSeq);
  }
}());
