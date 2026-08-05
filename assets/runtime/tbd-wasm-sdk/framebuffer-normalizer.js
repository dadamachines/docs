export const SurfaceFormat = Object.freeze({
  gray8: 1,
  'mono1-page-vertical-lsb': 2,
  gray4: 3,
  rgb565le: 4,
  rgba8888: 5,
});

const MAX_PIXELS = 1_048_576;

const requireLength = (bytes, required, description) => {
  if (!(bytes instanceof Uint8Array) || bytes.byteLength < required) {
    throw new RangeError(`${description} needs ${required} bytes`);
  }
};

/** Normalize an announced runtime surface into one byte of luma per pixel. */
export function normalizeLuma(surface, bytes) {
  const { width, height, stride, format, byteLength } = surface;
  if (![width, height, stride].every(Number.isSafeInteger) || width < 1 || height < 1 || stride < width || width * height > MAX_PIXELS) throw new TypeError('surface geometry is unsafe');
  if (!Number.isSafeInteger(byteLength) || byteLength < 1) throw new TypeError('surface byteLength is required');
  if (!(bytes instanceof Uint8Array) || bytes.byteLength !== byteLength) throw new RangeError('runtime surface length differs from descriptor');
  const pixels = new Uint8Array(width * height);

  if (format === SurfaceFormat.gray8 || format === 'gray8') {
    const rowStride = stride || width;
    if (byteLength !== rowStride * height) throw new RangeError('gray8 byteLength does not match geometry');
    requireLength(bytes, byteLength, 'gray8 surface');
    for (let y = 0; y < height; y += 1) pixels.set(bytes.subarray(y * rowStride, y * rowStride + width), y * width);
    return pixels;
  }

  if (format === SurfaceFormat['mono1-page-vertical-lsb'] || format === 'mono1-page-vertical-lsb') {
    const rowStride = stride || width;
    const required = rowStride * Math.ceil(height / 8);
    if (byteLength !== required) throw new RangeError('monochrome byteLength does not match geometry');
    requireLength(bytes, required, 'monochrome page surface');
    for (let y = 0; y < height; y += 1) {
      const page = Math.floor(y / 8);
      const mask = 1 << (y & 7);
      for (let x = 0; x < width; x += 1) pixels[y * width + x] = (bytes[page * rowStride + x] & mask) ? 255 : 0;
    }
    return pixels;
  }

  throw new Error(`unsupported surface format ${String(format)}`);
}

export function lumaToRgba(luma) {
  const rgba = new Uint8ClampedArray(luma.length * 4);
  for (let source = 0, target = 0; source < luma.length; source += 1, target += 4) {
    const value = luma[source];
    rgba[target] = value;
    rgba[target + 1] = value;
    rgba[target + 2] = value;
    rgba[target + 3] = 255;
  }
  return rgba;
}
