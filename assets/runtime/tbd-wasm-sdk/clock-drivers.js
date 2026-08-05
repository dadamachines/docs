/**
 * Runtime clocks deliberately have no knowledge of rendering. They feed
 * elapsed microseconds into a consumer (normally WorkerRuntimeClient.advance)
 * and serialize calls so a slow runtime cannot observe overlapping ticks.
 */
function requireAdvance(advance) {
  if (typeof advance !== 'function') throw new TypeError('advance must be a function');
  return advance;
}

function timeUs(seconds) {
  const value = Math.round(seconds * 1_000_000);
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('clock time is unsafe');
  return value;
}

/** Deterministic clock used by traces and tests. Time moves only on advance(). */
export class ManualClock {
  constructor(advance) { this.advanceRuntime = requireAdvance(advance); this.nowUs = 0; }
  async advance(deltaUs) {
    if (!Number.isSafeInteger(deltaUs) || deltaUs < 0) throw new TypeError('deltaUs must be a non-negative safe integer');
    await this.advanceRuntime(deltaUs);
    this.nowUs += deltaUs;
    return this.nowUs;
  }
  reset(nowUs = 0) {
    if (!Number.isSafeInteger(nowUs) || nowUs < 0) throw new TypeError('nowUs must be a non-negative safe integer');
    this.nowUs = nowUs;
  }
}

/**
 * Serializes an injected monotonic time source. Scheduling is intentionally
 * separate: callers may paint with RAF while calling pump() from an audio or
 * timer delivery loop. The simulation delta always comes from nowSeconds().
 */
export class MonotonicClock {
  constructor(advance, { nowSeconds = () => performance.now() / 1000 } = {}) {
    this.advanceRuntime = requireAdvance(advance);
    if (typeof nowSeconds !== 'function') throw new TypeError('nowSeconds must be a function');
    this.nowSeconds = nowSeconds;
    this.lastTimeUs = null;
    this.pending = Promise.resolve();
    this.running = false;
  }
  start() {
    this.lastTimeUs = timeUs(this.nowSeconds());
    this.running = true;
  }
  stop() { this.running = false; this.lastTimeUs = null; }
  async pump() {
    if (!this.running) return 0;
    const now = timeUs(this.nowSeconds());
    const prior = this.lastTimeUs;
    this.lastTimeUs = now;
    if (prior === null) return 0;
    if (now < prior) throw new Error('monotonic clock moved backwards');
    const deltaUs = now - prior;
    if (!deltaUs) return 0;
    const operation = this.pending.then(() => this.advanceRuntime(deltaUs));
    // Keep the queue reusable after failure, but stop the clock because the
    // runtime and time source are no longer known to be aligned.
    this.pending = operation.catch(() => { this.stop(); });
    await operation;
    return deltaUs;
  }
}

/**
 * Uses an already-created AudioContext as the clock authority. This class
 * never creates or resumes AudioContext; the consuming application owns the
 * required user gesture and audio policy.
 */
export class AudioContextClock extends MonotonicClock {
  constructor(advance, audioContext) {
    if (!audioContext || typeof audioContext.currentTime !== 'number') throw new TypeError('an AudioContext-like currentTime is required');
    super(advance, { nowSeconds: () => audioContext.currentTime });
    this.audioContext = audioContext;
  }
}
