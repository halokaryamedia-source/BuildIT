export type TextureFacePatchInput = {
  cube_uuid: string;
  cube_name: string;
  face: string;
  texture_uuid: string;
  texture_name: string;
  uv: readonly number[];
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
};

export type TextureScanOmission = {
  kind: "blank" | "unresolved_texture" | "invalid_uv" | "fractional_uv" | "non_integral_pixel_mapping" | "degenerate_uv" | "budget";
  cube_uuid: string;
  cube_name: string;
  face: string;
};

export const TEXTURE_OPTIMIZATION_EXAMPLE_LIMIT = 6;

function requirePatch(input: TextureFacePatchInput): void {
  if (!Number.isInteger(input.width) || !Number.isInteger(input.height) || input.width <= 0 || input.height <= 0) {
    throw new Error("Texture face patch dimensions must be positive integers.");
  }
  if (input.pixels.length !== input.width * input.height * 4) {
    throw new Error("Texture face patch RGBA length does not match width × height × 4.");
  }
}

function transformDimensions(width: number, height: number, transform: number): [number, number] {
  return transform >= 4 ? [height, width] : [width, height];
}

function sourceCoordinate(
  x: number,
  y: number,
  width: number,
  height: number,
  transform: number
): [number, number] {
  switch (transform) {
    case 0: return [x, y];
    case 1: return [width - 1 - x, y];
    case 2: return [x, height - 1 - y];
    case 3: return [width - 1 - x, height - 1 - y];
    case 4: return [y, height - 1 - x];
    case 5: return [y, x];
    case 6: return [width - 1 - y, height - 1 - x];
    default: return [width - 1 - y, x];
  }
}

function hashTransformed(input: TextureFacePatchInput, transform: number): string {
  const [outWidth, outHeight] = transformDimensions(input.width, input.height, transform);
  let hashA = 0x811c9dc5;
  let hashB = 0x9e3779b9;
  for (let y = 0; y < outHeight; y += 1) {
    for (let x = 0; x < outWidth; x += 1) {
      const [sx, sy] = sourceCoordinate(x, y, input.width, input.height, transform);
      const offset = (sy * input.width + sx) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        const byte = input.pixels[offset + channel];
        hashA ^= byte;
        hashA = Math.imul(hashA, 0x01000193) >>> 0;
        hashB = (Math.imul(hashB ^ byte, 0x85ebca6b) + 0xc2b2ae35) >>> 0;
      }
    }
  }
  return `${outWidth}x${outHeight}:${hashA.toString(16).padStart(8, "0")}:${hashB.toString(16).padStart(8, "0")}`;
}

function canonicalSignature(input: TextureFacePatchInput): string {
  let best: string | null = null;
  for (let transform = 0; transform < 8; transform += 1) {
    const signature = hashTransformed(input, transform);
    if (best === null || signature < best) best = signature;
  }
  return best!;
}

function normalizedUvKey(uv: readonly number[]): string | null {
  if (uv.length !== 4 || uv.some((value) => !Number.isFinite(value))) return null;
  return [
    Math.min(uv[0], uv[2]),
    Math.min(uv[1], uv[3]),
    Math.max(uv[0], uv[2]),
    Math.max(uv[1], uv[3]),
  ].join(",");
}

function patchAlphaAndColor(input: TextureFacePatchInput) {
  let transparent = true;
  let sameColor = true;
  const first = [input.pixels[0], input.pixels[1], input.pixels[2], input.pixels[3]];
  for (let offset = 0; offset < input.pixels.length; offset += 4) {
    if (input.pixels[offset + 3] !== 0) transparent = false;
    if (
      input.pixels[offset] !== first[0] ||
      input.pixels[offset + 1] !== first[1] ||
      input.pixels[offset + 2] !== first[2] ||
      input.pixels[offset + 3] !== first[3]
    ) {
      sameColor = false;
    }
    if (!transparent && !sameColor) break;
  }
  return {
    fully_transparent: transparent,
    solid_rgba: sameColor ? first as [number, number, number, number] : null,
  };
}

function faceSummary(input: TextureFacePatchInput) {
  return {
    cube_uuid: input.cube_uuid,
    cube_name: input.cube_name,
    face: input.face,
    texture_uuid: input.texture_uuid,
    texture_name: input.texture_name,
    uv: [...input.uv],
    pixel_size: [input.width, input.height],
  };
}

export function analyzeTextureOptimizationOpportunities(
  patches: readonly TextureFacePatchInput[],
  omissions: readonly TextureScanOmission[] = [],
  exampleLimit = TEXTURE_OPTIMIZATION_EXAMPLE_LIMIT
) {
  for (const patch of patches) requirePatch(patch);

  const transparent = patches.filter((patch) => patchAlphaAndColor(patch).fully_transparent);
  const solid = patches
    .map((patch) => ({ patch, quality: patchAlphaAndColor(patch) }))
    .filter(({ quality }) => quality.solid_rgba !== null && !quality.fully_transparent);

  const signatureGroups = new Map<string, TextureFacePatchInput[]>();
  for (const patch of patches) {
    const key = `${patch.texture_uuid}|${canonicalSignature(patch)}`;
    const group = signatureGroups.get(key) ?? [];
    group.push(patch);
    signatureGroups.set(key, group);
  }

  const stackGroups = [...signatureGroups.values()]
    .map((group) => {
      const distinctUv = new Set(group.map((patch) => normalizedUvKey(patch.uv)).filter(Boolean));
      if (group.length < 2 || distinctUv.size < 2) return null;
      return {
        texture_uuid: group[0].texture_uuid,
        texture_name: group[0].texture_name,
        face_count: group.length,
        distinct_uv_region_count: distinctUv.size,
        duplicate_patch_area: group.slice(1).reduce((sum, patch) => sum + patch.width * patch.height, 0),
        faces: group.slice(0, exampleLimit).map(faceSummary),
        faces_truncated: group.length > exampleLimit,
      };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null)
    .sort((a, b) => b.duplicate_patch_area - a.duplicate_patch_area || b.face_count - a.face_count);

  const omissionCounts: Record<TextureScanOmission["kind"], number> = {
    blank: 0,
    unresolved_texture: 0,
    invalid_uv: 0,
    fractional_uv: 0,
    non_integral_pixel_mapping: 0,
    degenerate_uv: 0,
    budget: 0,
  };
  omissions.forEach((omission) => { omissionCounts[omission.kind] += 1; });

  const scannedPixels = patches.reduce((sum, patch) => sum + patch.width * patch.height, 0);
  const stackFaceCount = new Set(stackGroups.flatMap((group) => group.faces.map((face) => `${face.cube_uuid}:${face.face}`))).size;

  return {
    state: omissions.some((omission) => omission.kind === "budget") ? ("partial" as const) : ("available" as const),
    scan: {
      complete_face_patches: patches.length,
      scanned_pixels: scannedPixels,
      omitted_faces: omissions.length,
      omission_counts: omissionCounts,
    },
    uv_stack_opportunities: {
      group_count: stackGroups.length,
      represented_face_count: stackFaceCount,
      duplicate_patch_area: stackGroups.reduce((sum, group) => sum + group.duplicate_patch_area, 0),
      examples: stackGroups.slice(0, exampleLimit),
      examples_truncated: stackGroups.length > exampleLimit,
      note: "Pixel-identical regions are review candidates only; stacking is not applied automatically because UV ownership and semantic reuse may be intentional.",
    },
    transparent_faces: {
      count: transparent.length,
      examples: transparent.slice(0, exampleLimit).map(faceSummary),
      examples_truncated: transparent.length > exampleLimit,
    },
    solid_color_faces: {
      count: solid.length,
      examples: solid.slice(0, exampleLimit).map(({ patch, quality }) => ({
        ...faceSummary(patch),
        rgba: quality.solid_rgba,
      })),
      examples_truncated: solid.length > exampleLimit,
    },
    efficiency: { bounded: true },
  };
}
