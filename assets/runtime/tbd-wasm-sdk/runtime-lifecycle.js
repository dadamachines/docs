import { MonotonicClock } from './clock-drivers.js';
import { WorkerRuntimeClient } from './runtime-controller.js?v=r1-worker-frame-1';

/**
 * Lazy, retryable lifecycle for one logical device. Hidden devices release
 * bindings and terminate their Worker; becoming visible creates a fresh,
 * isolated runtime from the same verified package.
 */
export class RuntimeLifecycle {
  constructor({
    workerUrl,
    createClient = () => new WorkerRuntimeClient(workerUrl),
    createClock = advance => new MonotonicClock(advance),
    createBindings = async () => null,
    onFrame = () => {},
    onError = () => {},
    visibilityTarget = globalThis.document,
  } = {}) {
    if (typeof createClient !== 'function' || typeof createClock !== 'function' || typeof createBindings !== 'function') throw new TypeError('runtime lifecycle factories are required');
    if (typeof onFrame !== 'function' || typeof onError !== 'function') throw new TypeError('runtime lifecycle callbacks must be functions');
    this.createClient = createClient;
    this.createClock = createClock;
    this.createBindings = createBindings;
    this.onFrame = onFrame;
    this.onError = onError;
    this.visibilityTarget = visibilityTarget;
    this.client = null;
    this.clock = null;
    this.bindings = null;
    this.activation = null;
    this.epoch = 0;
    this.options = null;
    this.wanted = false;
    this.disposed = false;
    this.frameListener = event => this.onFrame(event.detail);
    this.visibilityListener = () => {
      if (visibilityTarget.hidden) void this.deactivate({ preserveIntent: true });
      else if (this.wanted && this.options) void this.activate(this.options).catch(() => {});
    };
    if (visibilityTarget && typeof visibilityTarget.addEventListener === 'function') visibilityTarget.addEventListener('visibilitychange', this.visibilityListener);
  }

  async activate(options) {
    if (this.disposed) throw new Error('runtime lifecycle is disposed');
    this.wanted = true;
    this.options = options;
    if (this.visibilityTarget?.hidden) return null;
    if (this.client) return this.client;
    if (this.activation) return this.activation.promise;
    const token = ++this.epoch;
    const promise = this.#activate(options, token);
    this.activation = { token, promise };
    try { return await promise; }
    finally { if (this.activation?.token === token) this.activation = null; }
  }

  async #activate(options, token) {
    const client = this.createClient();
    this.client = client;
    client.addEventListener('frame', this.frameListener);
    let bindings = null;
    let clock = null;
    try {
      const initialized = await client.initialize(options);
      if (token !== this.epoch || !this.wanted || this.disposed || this.visibilityTarget?.hidden) {
        await this.#disposeResources({ client, bindings, clock });
        return null;
      }
      bindings = await this.createBindings({ client, initialized });
      if (token !== this.epoch || !this.wanted || this.disposed || this.visibilityTarget?.hidden) {
        await this.#disposeResources({ client, bindings, clock });
        return null;
      }
      clock = this.createClock(deltaUs => client.advance(deltaUs));
      clock.start();
      this.bindings = bindings;
      this.clock = clock;
      return client;
    } catch (error) {
      await this.#disposeResources({ client, bindings, clock });
      if (token !== this.epoch || this.disposed || !this.wanted) return null;
      if (this.client === client) this.client = null;
      this.onError(error);
      throw error;
    }
  }

  async pump() { return this.clock ? this.clock.pump() : 0; }

  async #disposeResources({ client, bindings, clock }) {
    if (clock) clock.stop();
    if (bindings && typeof bindings.dispose === 'function') await bindings.dispose();
    if (client) {
      client.removeEventListener('frame', this.frameListener);
      client.dispose();
    }
  }

  async #disposeCurrent() {
    const resources = { bindings: this.bindings, client: this.client, clock: this.clock };
    this.clock = null; this.bindings = null; this.client = null;
    await this.#disposeResources(resources);
  }

  async deactivate({ preserveIntent = false } = {}) {
    if (!preserveIntent) this.wanted = false;
    this.epoch += 1;
    this.activation = null;
    await this.#disposeCurrent();
  }

  async dispose() {
    if (this.disposed) return;
    this.disposed = true; this.wanted = false;
    if (this.visibilityTarget && typeof this.visibilityTarget.removeEventListener === 'function') this.visibilityTarget.removeEventListener('visibilitychange', this.visibilityListener);
    await this.#disposeCurrent();
  }
}
