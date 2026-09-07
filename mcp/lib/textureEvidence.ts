import { z } from "zod";
import { textureIdOptionalSchema } from "@/lib/zodObjects";
import {
  computeTextureRevision,
  requireTextureRevisionDimensions,
  requireTextureRevisionMatch,
} from "@/lib/textureRevision";

export const textureRevisionSchema = z
  .string()
  .regex(/^sha256:\d+x\d+:[0-9a-f]{64}$/)
  .describe("Full decoded-RGBA texture revision returned by BlockIT.");

export const textureEvidenceRegionSchema = z
  .object({
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict()
  .describe("Bounded bitmap-pixel region [x,y,width,height].");

export const textureEvidenceOptionsSchema = z
  .object({
    region: textureEvidenceRegionSchema.optional(),
    expected_revision: textureRevisionSchema.optional(),
  })
  .strict();

/**
 * Generator-ready replacement for the existing get_texture input contract.
 * It remains internal until canonical generated API output can be authored with
 * the public ToolSpec change.
 */
export const focusedGetTextureParameters = z
  .object({
    texture: textureIdOptionalSchema,
    region: textureEvidenceRegionSchema.optional(),
    expected_revision: textureRevisionSchema.optional(),
  })
  .strict();

export type TextureEvidenceRegion = z.infer<typeof textureEvidenceRegionSchema>;
export type TextureEvidenceOptions = z.infer<typeof textureEvidenceOptionsSchema>;

function requireTextureRgbaLength(
  pixels: Uint8ClampedArray,
  width: number,
  height: number
): void {
  const expected = width * height * 4;
  if (!Number.isSafeInteger(expected) || pixels.byteLength !== expected) {
    throw new Error(
      `Texture evidence RGBA length mismatch: expected ${expected} bytes for ${width}x${height}, received ${pixels.byteLength}.`
    );
  }
}

export function normalizeTextureEvidenceRegion(
  region: TextureEvidenceRegion | undefined,
  width: number,
  height: number
): TextureEvidenceRegion {
  const [validatedWidth, validatedHeight] = requireTextureRevisionDimensions(
    width,
    height
  );
  if (!region) {
    return { x: 0, y: 0, width: validatedWidth, height: validatedHeight };
  }

  const parsed = textureEvidenceRegionSchema.parse(region);
  const right = parsed.x + parsed.width;
  const bottom = parsed.y + parsed.height;
  if (
    !Number.isSafeInteger(right) ||
    !Number.isSafeInteger(bottom) ||
    right > validatedWidth ||
    bottom > validatedHeight
  ) {
    throw new Error(
      `Texture evidence region [${parsed.x},${parsed.y},${parsed.width},${parsed.height}] exceeds bitmap bounds ${validatedWidth}x${validatedHeight}.`
    );
  }
  return parsed;
}

export function textureEvidenceRegionToLogicalUv(
  region: TextureEvidenceRegion,
  bitmapWidth: number,
  bitmapHeight: number,
  uvWidth: number,
  uvHeight: number
): [number, number, number, number] {
  const normalized = normalizeTextureEvidenceRegion(
    region,
    bitmapWidth,
    bitmapHeight
  );
  const [validatedUvWidth, validatedUvHeight] = requireTextureRevisionDimensions(
    uvWidth,
    uvHeight
  );
  return [
    (normalized.x / bitmapWidth) * validatedUvWidth,
    (normalized.y / bitmapHeight) * validatedUvHeight,
    ((normalized.x + normalized.width) / bitmapWidth) * validatedUvWidth,
    ((normalized.y + normalized.height) / bitmapHeight) * validatedUvHeight,
  ];
}

export function cropTextureRgba(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  region?: TextureEvidenceRegion
): Uint8ClampedArray {
  const normalized = normalizeTextureEvidenceRegion(region, width, height);
  requireTextureRgbaLength(pixels, width, height);

  const cropped = new Uint8ClampedArray(normalized.width * normalized.height * 4);
  for (let row = 0; row < normalized.height; row += 1) {
    const sourceStart = ((normalized.y + row) * width + normalized.x) * 4;
    const sourceEnd = sourceStart + normalized.width * 4;
    const targetStart = row * normalized.width * 4;
    cropped.set(pixels.subarray(sourceStart, sourceEnd), targetStart);
  }
  return cropped;
}

export async function buildTextureEvidenceSnapshot(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  options: TextureEvidenceOptions = {}
) {
  const parsed = textureEvidenceOptionsSchema.parse(options);
  const region = normalizeTextureEvidenceRegion(parsed.region, width, height);
  requireTextureRgbaLength(pixels, width, height);

  const revision = await computeTextureRevision(pixels, width, height);
  requireTextureRevisionMatch(
    parsed.expected_revision,
    revision,
    "Texture evidence source"
  );

  const rgba = cropTextureRgba(pixels, width, height, region);
  const full =
    region.x === 0 &&
    region.y === 0 &&
    region.width === width &&
    region.height === height;

  return {
    inspection: full ? ("full_atlas" as const) : ("region" as const),
    revision,
    bitmap: { width, height },
    region,
    byte_length: rgba.byteLength,
    rgba,
  };
}
