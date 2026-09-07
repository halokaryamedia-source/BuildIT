import { z } from "zod";
import {
  requiredHexColorSchema,
  textureIdOptionalSchema,
} from "@/lib/zodObjects";
import { textureRevisionSchema } from "@/lib/textureEvidence";

const transactionCoordinateSchema = z
  .object({
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
  })
  .strict();

const transactionRectSchema = z
  .object({
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();

const setPixelsOperationSchema = z
  .object({
    operation: z.literal("set_pixels"),
    color: requiredHexColorSchema,
    coordinates: z.array(transactionCoordinateSchema).min(1),
  })
  .strict();

const fillRectOperationSchema = z
  .object({
    operation: z.literal("fill_rect"),
    color: requiredHexColorSchema,
    rect: transactionRectSchema,
  })
  .strict();

const erasePixelsOperationSchema = z
  .object({
    operation: z.literal("erase_pixels"),
    coordinates: z.array(transactionCoordinateSchema).min(1),
  })
  .strict();

export const paintTransactionOperationSchema = z.union([
  setPixelsOperationSchema,
  fillRectOperationSchema,
  erasePixelsOperationSchema,
]);

/**
 * Internal, generator-ready contract for one bounded exact-pixel transaction.
 * It is intentionally not registered as a public MCP tool in REMOTE_GITHUB.
 */
export const paintTransactionParameters = z
  .object({
    texture_id: textureIdOptionalSchema,
    expected_revision: textureRevisionSchema,
    operations: z.array(paintTransactionOperationSchema).min(1).max(64),
  })
  .strict();

export type PaintTransactionOperation = z.infer<
  typeof paintTransactionOperationSchema
>;

export type PaintTransactionRequest = z.infer<typeof paintTransactionParameters>;

type Rgba = [number, number, number, number];
type AffectedRect = [number, number, number, number];

function parseHexRgba(value: string): Rgba {
  const normalized = requiredHexColorSchema.parse(value).slice(1);
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
    normalized.length === 8
      ? Number.parseInt(normalized.slice(6, 8), 16)
      : 255,
  ];
}

function requireBitmapDimensions(width: number, height: number): void {
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error("Paint transaction bitmap dimensions must be positive safe integers.");
  }
}

function requirePoint(
  point: { x: number; y: number },
  width: number,
  height: number,
  context: string
): void {
  if (
    !Number.isSafeInteger(point.x) ||
    !Number.isSafeInteger(point.y) ||
    point.x < 0 ||
    point.y < 0 ||
    point.x >= width ||
    point.y >= height
  ) {
    throw new Error(
      `${context} (${point.x}, ${point.y}) is outside bitmap bounds ${width}x${height}.`
    );
  }
}

function requireRect(
  rect: { x: number; y: number; width: number; height: number },
  width: number,
  height: number,
  context: string
): void {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  if (
    !Number.isSafeInteger(right) ||
    !Number.isSafeInteger(bottom) ||
    rect.x < 0 ||
    rect.y < 0 ||
    rect.width <= 0 ||
    rect.height <= 0 ||
    right > width ||
    bottom > height
  ) {
    throw new Error(
      `${context} [${rect.x},${rect.y},${rect.width},${rect.height}] is outside bitmap bounds ${width}x${height}.`
    );
  }
}

function includePixel(
  current: AffectedRect | null,
  x: number,
  y: number
): AffectedRect {
  if (!current) return [x, y, x + 1, y + 1];
  return [
    Math.min(current[0], x),
    Math.min(current[1], y),
    Math.max(current[2], x + 1),
    Math.max(current[3], y + 1),
  ];
}

function includeRect(
  current: AffectedRect | null,
  rect: { x: number; y: number; width: number; height: number }
): AffectedRect {
  const candidate: AffectedRect = [
    rect.x,
    rect.y,
    rect.x + rect.width,
    rect.y + rect.height,
  ];
  if (!current) return candidate;
  return [
    Math.min(current[0], candidate[0]),
    Math.min(current[1], candidate[1]),
    Math.max(current[2], candidate[2]),
    Math.max(current[3], candidate[3]),
  ];
}

export function planPaintTransaction(
  operations: readonly PaintTransactionOperation[],
  width: number,
  height: number
) {
  requireBitmapDimensions(width, height);
  const parsed = z.array(paintTransactionOperationSchema).min(1).max(64).parse(operations);

  let affectedRect: AffectedRect | null = null;
  let pixelWrites = 0;

  for (const [index, operation] of parsed.entries()) {
    if (operation.operation === "fill_rect") {
      requireRect(operation.rect, width, height, `operations[${index}].rect`);
      parseHexRgba(operation.color);
      affectedRect = includeRect(affectedRect, operation.rect);
      pixelWrites += operation.rect.width * operation.rect.height;
      continue;
    }

    if (operation.operation === "set_pixels") {
      parseHexRgba(operation.color);
    }
    for (const [coordinateIndex, coordinate] of operation.coordinates.entries()) {
      requirePoint(
        coordinate,
        width,
        height,
        `operations[${index}].coordinates[${coordinateIndex}]`
      );
      affectedRect = includePixel(affectedRect, coordinate.x, coordinate.y);
      pixelWrites += 1;
    }
  }

  if (!affectedRect) {
    throw new Error("Paint transaction produced no bounded affected region.");
  }

  return {
    operation_count: parsed.length,
    pixel_writes: pixelWrites,
    affected_rect: affectedRect,
    affected_size: [
      affectedRect[2] - affectedRect[0],
      affectedRect[3] - affectedRect[1],
    ] as [number, number],
    operations: parsed,
  };
}

function writePixel(
  pixels: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  rgba: Rgba
): void {
  const offset = (y * width + x) * 4;
  pixels[offset] = rgba[0];
  pixels[offset + 1] = rgba[1];
  pixels[offset + 2] = rgba[2];
  pixels[offset + 3] = rgba[3];
}

/**
 * Applies a transaction to a copy only after the complete plan validates.
 * This gives the Runtime wiring a deterministic preflight/rollback oracle before
 * it opens one native Blockbench Undo unit.
 */
export function applyPaintTransactionRgba(
  source: Uint8ClampedArray,
  width: number,
  height: number,
  operations: readonly PaintTransactionOperation[]
) {
  const expectedLength = width * height * 4;
  if (!Number.isSafeInteger(expectedLength) || source.byteLength !== expectedLength) {
    throw new Error(
      `Paint transaction RGBA length mismatch: expected ${expectedLength}, received ${source.byteLength}.`
    );
  }

  const plan = planPaintTransaction(operations, width, height);
  const result = new Uint8ClampedArray(source);

  for (const operation of plan.operations) {
    if (operation.operation === "fill_rect") {
      const rgba = parseHexRgba(operation.color);
      for (let y = operation.rect.y; y < operation.rect.y + operation.rect.height; y += 1) {
        for (let x = operation.rect.x; x < operation.rect.x + operation.rect.width; x += 1) {
          writePixel(result, width, x, y, rgba);
        }
      }
      continue;
    }

    if (operation.operation === "set_pixels") {
      const rgba = parseHexRgba(operation.color);
      for (const coordinate of operation.coordinates) {
        writePixel(result, width, coordinate.x, coordinate.y, rgba);
      }
      continue;
    }

    for (const coordinate of operation.coordinates) {
      writePixel(result, width, coordinate.x, coordinate.y, [0, 0, 0, 0]);
    }
  }

  return { pixels: result, ...plan };
}
