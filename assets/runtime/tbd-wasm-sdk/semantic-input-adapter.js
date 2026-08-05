/** Canonical DOM pointer/keyboard bridge. It intentionally emits no clicks,
 * holds, or repeats: those semantics belong to the product RuntimePort. */
export class SemanticInputAdapter {
  constructor({ dispatch, visibilityTarget = globalThis.document, onError = null } = {}) {
    if (typeof dispatch !== 'function') throw new TypeError('dispatch must be a function');
    if (onError !== null && typeof onError !== 'function') throw new TypeError('onError must be a function');
    this.dispatch = dispatch;
    this.visibilityTarget = visibilityTarget;
    this.onError = onError;
    this.activeButtons = new Map();
    this.cleanup = [];
    this.pending = Promise.resolve();
    this.lastError = null;
    this.nextBindingId = 1;
    this.disposed = false;
    if (visibilityTarget && typeof visibilityTarget.addEventListener === 'function') {
      const listener = () => { if (visibilityTarget.hidden) void this.releaseAll(); };
      this.#listen(visibilityTarget, 'visibilitychange', listener);
    }
  }

  #listen(target, type, listener, local = null) {
    target.addEventListener(type, listener);
    const remove = () => target.removeEventListener(type, listener);
    this.cleanup.push(remove);
    if (local) local.push(remove);
  }
  #assertLive() { if (this.disposed) throw new Error('input adapter is disposed'); }
  #queue(input) {
    const operation = this.pending.then(() => this.dispatch(input));
    this.pending = operation.catch(error => {
      this.lastError = error instanceof Error ? error : new Error(String(error));
      if (this.onError) this.onError(this.lastError, input);
    });
    return operation;
  }
  #press(key, active) {
    if (this.activeButtons.has(key)) return;
    this.activeButtons.set(key, active);
    void this.#queue({ kind: 'button-down', endpoint: active.endpoint });
  }

  bindButton(element, endpoint, { keyboard = true } = {}) {
    this.#assertLive();
    if (!element || typeof element.addEventListener !== 'function') throw new TypeError('button element is required');
    const bindingId = this.nextBindingId++;
    const local = [];
    const press = event => {
      if (event.button !== undefined && event.button !== 0) return;
      const key = `pointer:${event.pointerId}`;
      if (this.activeButtons.has(key)) return;
      if (typeof element.setPointerCapture === 'function' && event.pointerId !== undefined) element.setPointerCapture(event.pointerId);
      this.#press(key, { endpoint, element, pointerId: event.pointerId, bindingId });
    };
    const release = event => { void this.#release(`pointer:${event.pointerId}`); };
    this.#listen(element, 'pointerdown', press, local);
    this.#listen(element, 'pointerup', release, local);
    this.#listen(element, 'pointercancel', release, local);
    this.#listen(element, 'lostpointercapture', release, local);
    if (keyboard) {
      const keydown = event => {
        if ((event.key !== 'Enter' && event.key !== ' ') || event.repeat) return;
        if (typeof event.preventDefault === 'function') event.preventDefault();
        this.#press(`key:${bindingId}:${event.code || event.key}`, { endpoint, element, bindingId });
      };
      const keyup = event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        if (typeof event.preventDefault === 'function') event.preventDefault();
        void this.#release(`key:${bindingId}:${event.code || event.key}`);
      };
      this.#listen(element, 'keydown', keydown, local);
      this.#listen(element, 'keyup', keyup, local);
      this.#listen(element, 'blur', () => { void this.#releaseBinding(bindingId); }, local);
    }
    return async () => {
      for (const remove of local) remove();
      await this.#releaseBinding(bindingId);
    };
  }

  bindEncoder(element, endpoint, { pixelsPerStep = 8, direction = -1, keyboard = true } = {}) {
    this.#assertLive();
    if (!element || typeof element.addEventListener !== 'function') throw new TypeError('encoder element is required');
    if (!Number.isFinite(pixelsPerStep) || pixelsPerStep <= 0 || !Number.isFinite(direction) || direction === 0) throw new TypeError('encoder configuration is invalid');
    const local = [];
    let active = null;
    const down = event => {
      if (event.button !== undefined && event.button !== 0) return;
      active = { pointerId: event.pointerId, y: event.clientY, remainder: 0 };
      if (typeof element.setPointerCapture === 'function' && event.pointerId !== undefined) element.setPointerCapture(event.pointerId);
    };
    const move = event => {
      if (!active || event.pointerId !== active.pointerId) return;
      const distance = (event.clientY - active.y) * direction + active.remainder;
      const steps = distance < 0 ? Math.ceil(distance / pixelsPerStep) : Math.floor(distance / pixelsPerStep);
      active.remainder = distance - steps * pixelsPerStep;
      active.y = event.clientY;
      if (steps) void this.#queue({ kind: 'encoder-delta', endpoint, value: steps });
    };
    const end = event => { if (active && event.pointerId === active.pointerId) active = null; };
    this.#listen(element, 'pointerdown', down, local);
    this.#listen(element, 'pointermove', move, local);
    this.#listen(element, 'pointerup', end, local);
    this.#listen(element, 'pointercancel', end, local);
    this.#listen(element, 'lostpointercapture', end, local);
    if (keyboard) {
      const keydown = event => {
        const value = event.key === 'ArrowUp' || event.key === 'ArrowRight' ? 1
          : event.key === 'ArrowDown' || event.key === 'ArrowLeft' ? -1 : 0;
        if (!value) return;
        if (typeof event.preventDefault === 'function') event.preventDefault();
        void this.#queue({ kind: 'encoder-delta', endpoint, value });
      };
      this.#listen(element, 'keydown', keydown, local);
    }
    return () => { for (const remove of local) remove(); active = null; };
  }

  async #release(key) {
    const active = this.activeButtons.get(key);
    if (!active) return;
    this.activeButtons.delete(key);
    if (typeof active.element.releasePointerCapture === 'function' && active.pointerId !== undefined) {
      try { active.element.releasePointerCapture(active.pointerId); } catch { /* capture was already released */ }
    }
    await this.#queue({ kind: 'button-up', endpoint: active.endpoint });
  }
  async #releaseBinding(bindingId) {
    await Promise.all([...this.activeButtons.entries()]
      .filter(([, active]) => active.bindingId === bindingId)
      .map(([key]) => this.#release(key)));
  }
  async flush() {
    await this.pending;
    if (this.lastError) {
      const error = this.lastError;
      this.lastError = null;
      throw error;
    }
  }
  async releaseAll() {
    await Promise.all([...this.activeButtons.keys()].map(key => this.#release(key)));
    await this.flush();
  }
  async dispose() {
    if (this.disposed) return;
    try { await this.releaseAll(); }
    finally {
      this.disposed = true;
      for (const remove of this.cleanup.splice(0)) remove();
    }
  }
}
