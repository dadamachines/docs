(function () {
  'use strict';

  function parseTrackMap(spec) {
    var map = new Map();
    String(spec || '').split('|').forEach(function (entry) {
      var parts = entry.split(':');
      var track = parseInt(parts[0], 10);
      if (!Number.isInteger(track)) return;
      var steps = (parts[1] || '').split(',').map(Number).filter(function (step) {
        return Number.isInteger(step) && step >= 1 && step <= 16;
      });
      map.set(track, Array.from(new Set(steps)).sort(function (a, b) { return a - b; }));
    });
    return map;
  }

  function sameSteps(actual, expected) {
    if (actual.length !== expected.length) return false;
    return actual.every(function (step, index) { return step === expected[index]; });
  }

  function TbdPracticeStatus() {
    return Reflect.construct(HTMLElement, [], TbdPracticeStatus);
  }

  TbdPracticeStatus.prototype = Object.create(HTMLElement.prototype);
  TbdPracticeStatus.prototype.constructor = TbdPracticeStatus;
  Object.setPrototypeOf(TbdPracticeStatus, HTMLElement);

  TbdPracticeStatus.prototype.connectedCallback = function () {
    var self = this;
    this.targets = parseTrackMap(this.dataset.target);
    this.labels = parseTrackMap('');
    this.trackLabels = new Map();
    String(this.dataset.labels || '').split('|').forEach(function (entry) {
      var parts = entry.split(':');
      var track = parseInt(parts.shift(), 10);
      if (Number.isInteger(track)) self.trackLabels.set(track, parts.join(':').trim());
    });
    this.current = new Map();
    this.classList.add('tbd-practice-status');
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');
    this._onPattern = function (event) {
      var detail = event.detail || {};
      var track = Number(detail.productTrack);
      if (!self.targets.has(track)) return;
      var active = (detail.active || []).map(function (step) { return Number(step) + 1; })
        .filter(function (step) { return Number.isInteger(step); })
        .sort(function (a, b) { return a - b; });
      self.current.set(track, active);
      self.renderStatus();
    };
    this.follow = document.getElementById(this.dataset.follow);
    if (this.follow) {
      this.follow.addEventListener('tbd-seq:runtime-pattern', this._onPattern);
      // Seed the status from the visible projection while the Worker starts.
      this.targets.forEach(function (_steps, track) {
        var id = self.follow.getPanelTrackId && self.follow.getPanelTrackId(track);
        if (!id || !self.follow.activeColumnsForTrack) return;
        self.current.set(track, self.follow.activeColumnsForTrack(id, 0).map(function (step) { return step + 1; }));
      });
    }
    this.renderStatus();
  };

  TbdPracticeStatus.prototype.disconnectedCallback = function () {
    if (this.follow && this._onPattern) this.follow.removeEventListener('tbd-seq:runtime-pattern', this._onPattern);
  };

  TbdPracticeStatus.prototype.renderStatus = function () {
    var self = this;
    var remaining = [];
    this.targets.forEach(function (expected, track) {
      var actual = self.current.get(track) || [];
      if (sameSteps(actual, expected)) return;
      var missing = expected.filter(function (step) { return actual.indexOf(step) === -1; });
      var extra = actual.filter(function (step) { return expected.indexOf(step) === -1; });
      var label = self.trackLabels.get(track) || ('Track ' + track);
      var parts = [];
      if (missing.length) parts.push('add ' + missing.join(', '));
      if (extra.length) parts.push('remove ' + extra.join(', '));
      remaining.push(label + ': ' + parts.join('; '));
    });
    var complete = this.targets.size > 0 && remaining.length === 0;
    this.classList.toggle('is-complete', complete);
    this.textContent = complete ? this.dataset.success : ('Keep going — ' + remaining.join('. ') + '.');
  };

  if (!window.customElements.get('tbd-practice-status')) {
    window.customElements.define('tbd-practice-status', TbdPracticeStatus);
  }
}());
