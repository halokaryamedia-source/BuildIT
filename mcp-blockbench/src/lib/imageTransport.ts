export type TransportImageFormat = "jpeg" | "png";

export interface ImageTransportOptions {
  maxDimension: number;
  format: TransportImageFormat;
  quality: number;
  maxBytes: number;
  minimumDimension?: number;
}

export interface ImageTransportPreview {
  data: Buffer;
  mimeType: "image/jpeg" | "image/png";
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
  sourceBytes: number;
  transportBytes: number;
  base64Bytes: number;
  quality: number;
  attempts: number;
  downscaled: boolean;
}

export interface PlannedDimensions {
  width: number;
  height: number;
  downscaled: boolean;
}

const DEFAULT_MINIMUM_DIMENSION = 320;
const DATA_URL_PATTERN = /^data:(image\/(?:png|jpeg));base64,/;

export function planTransportDimensions(
  sourceWidth: number,
  sourceHeight: number,
  maxDimension: number
): PlannedDimensions {
  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0
  ) {
    throw new Error("IMAGE_TRANSPORT_SOURCE_DIMENSIONS_INVALID");
  }
  if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
    throw new Error("IMAGE_TRANSPORT_MAX_DIMENSION_INVALID");
  }

  const largest = Math.max(sourceWidth, sourceHeight);
  const scale = Math.min(1, maxDimension / largest);
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
    downscaled: scale < 1,
  };
}

export function encodedBase64Length(byteLength: number): number {
  if (!Number.isFinite(byteLength) || byteLength < 0) {
    throw new Error("IMAGE_TRANSPORT_BYTE_LENGTH_INVALID");
  }
  return Math.ceil(byteLength / 3) * 4;
}

function sourceDataUrl(data: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${data.toString("base64")}`;
}

async function loadImage(source: string): Promise<HTMLImageElement> {
  if (typeof Image === "undefined") {
    throw new Error("IMAGE_TRANSPORT_IMAGE_API_UNAVAILABLE");
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("IMAGE_TRANSPORT_IMAGE_LOAD_FAILED"));
    image.src = source;
  });
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  if (typeof document === "undefined") {
    throw new Error("IMAGE_TRANSPORT_CANVAS_API_UNAVAILABLE");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function decodeCanvasDataUrl(value: string): {
  data: Buffer;
  mimeType: "image/jpeg" | "image/png";
} {
  const match = value.match(DATA_URL_PATTERN);
  if (!match) throw new Error("IMAGE_TRANSPORT_ENCODING_FAILED");
  return {
    data: Buffer.from(value.slice(match[0].length), "base64"),
    mimeType: match[1] as "image/jpeg" | "image/png",
  };
}

function encodeCanvas(
  canvas: HTMLCanvasElement,
  format: TransportImageFormat,
  quality: number
): { data: Buffer; mimeType: "image/jpeg" | "image/png" } {
  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  return decodeCanvasDataUrl(canvas.toDataURL(mimeType, quality));
}

export async function createImageTransportPreview(
  source: Buffer,
  sourceMimeType: string,
  options: ImageTransportOptions
): Promise<ImageTransportPreview> {
  if (source.byteLength <= 0) throw new Error("IMAGE_TRANSPORT_SOURCE_EMPTY");
  if (!Number.isFinite(options.quality) || options.quality < 0.5 || options.quality > 1) {
    throw new Error("IMAGE_TRANSPORT_QUALITY_INVALID");
  }
  if (!Number.isFinite(options.maxBytes) || options.maxBytes < 32 * 1024) {
    throw new Error("IMAGE_TRANSPORT_MAX_BYTES_INVALID");
  }

  const image = await loadImage(sourceDataUrl(source, sourceMimeType));
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const initial = planTransportDimensions(
    sourceWidth,
    sourceHeight,
    options.maxDimension
  );
  const minimumDimension = Math.max(
    128,
    options.minimumDimension ?? DEFAULT_MINIMUM_DIMENSION
  );

  let width = initial.width;
  let height = initial.height;
  let quality = options.quality;
  let encoded: { data: Buffer; mimeType: "image/jpeg" | "image/png" } | null = null;
  let attempts = 0;

  while (attempts < 6) {
    attempts += 1;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("IMAGE_TRANSPORT_CONTEXT_UNAVAILABLE");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    if (options.format === "jpeg") {
      context.fillStyle = "#111318";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    encoded = encodeCanvas(canvas, options.format, quality);

    if (encoded.data.byteLength <= options.maxBytes) break;

    const ratio = Math.sqrt(options.maxBytes / encoded.data.byteLength);
    const nextLargest = Math.max(
      minimumDimension,
      Math.floor(Math.max(width, height) * Math.min(0.88, ratio * 0.92))
    );
    const next = planTransportDimensions(sourceWidth, sourceHeight, nextLargest);

    if (next.width === width && next.height === height) {
      if (options.format === "jpeg" && quality > 0.68) {
        quality = Math.max(0.68, quality - 0.08);
        continue;
      }
      break;
    }
    width = next.width;
    height = next.height;
  }

  if (!encoded || encoded.data.byteLength > options.maxBytes) {
    throw new Error(
      `IMAGE_TRANSPORT_PREVIEW_TOO_LARGE: ${encoded?.data.byteLength ?? 0} bytes exceeds ${options.maxBytes}.`
    );
  }

  return {
    data: encoded.data,
    mimeType: encoded.mimeType,
    width,
    height,
    sourceWidth,
    sourceHeight,
    sourceBytes: source.byteLength,
    transportBytes: encoded.data.byteLength,
    base64Bytes: encodedBase64Length(encoded.data.byteLength),
    quality,
    attempts,
    downscaled: width !== sourceWidth || height !== sourceHeight,
  };
}
