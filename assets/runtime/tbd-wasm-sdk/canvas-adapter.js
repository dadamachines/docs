/**
 * Consumer-neutral Canvas painter for normalized runtime surfaces. It never
 * mutates the source pixels and skips a copy when a surface generation did
 * not change.
 */
export class CanvasSurfaceAdapter {
  constructor(canvas, { surfaceId = 'display.main', fallback = null } = {}) {
    if (!canvas || typeof canvas.getContext !== 'function') throw new TypeError('canvas with getContext() is required');
    this.canvas = canvas;
    this.surfaceId = surfaceId;
    this.context = canvas.getContext('2d', { alpha: false });
    if (!this.context || typeof this.context.putImageData !== 'function') throw new Error('a 2D canvas context is required');
    this.lastGeneration = null;
    this.image = null;
    this.fallback = fallback;
    this.canvas.style.imageRendering = 'pixelated';
  }

  paint(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.surfaces)) throw new TypeError('snapshot surfaces are required');
    const surface = snapshot.surfaces.find(candidate => candidate.id === this.surfaceId);
    if (!surface) throw new Error(`snapshot does not contain surface ${this.surfaceId}`);
    if (surface.generation === this.lastGeneration) return false;
    if (!(surface.luma instanceof Uint8Array) || surface.luma.byteLength !== surface.width * surface.height) throw new RangeError('surface luma does not match its geometry');
    if (this.canvas.width !== surface.width) this.canvas.width = surface.width;
    if (this.canvas.height !== surface.height) this.canvas.height = surface.height;
    if (!this.image || this.image.width !== surface.width || this.image.height !== surface.height) {
      this.image = this.context.createImageData(surface.width, surface.height);
    }
    // Reuse ImageData: an OLED-sized frame should not allocate a second RGBA
    // buffer on every paint.
    for (let source = 0, target = 0; source < surface.luma.length; source += 1, target += 4) {
      const value = surface.luma[source];
      this.image.data[target] = value;
      this.image.data[target + 1] = value;
      this.image.data[target + 2] = value;
      this.image.data[target + 3] = 255;
    }
    this.context.putImageData(this.image, 0, 0);
    this.lastGeneration = surface.generation;
    if (this.fallback && typeof this.fallback.setAttribute === 'function') this.fallback.setAttribute('aria-hidden', 'true');
    return true;
  }

  reset() { this.lastGeneration = null; }
}
