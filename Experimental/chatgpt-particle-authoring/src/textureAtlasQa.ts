import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  type ExperimentalParticleDiagnostic,
} from "./diagnostics";
import type { TextureAtlasInput, TextureAtlasSummary } from "./types";

export type TextureAtlasAnalysis = {
  summary: TextureAtlasSummary | null;
  diagnostics: ExperimentalParticleDiagnostic[];
};

function positiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function cellHash(
  rgba: Uint8Array,
  width: number,
  x0: number,
  y0: number,
  cellWidth: number,
  cellHeight: number
): string {
  let hash = 0x811c9dc5;
  for (let y = y0; y < y0 + cellHeight; y += 1) {
    for (let x = x0; x < x0 + cellWidth; x += 1) {
      const offset = (y * width + x) * 4;
      for (let channel = 0; channel < 4; channel += 1) {
        hash ^= rgba[offset + channel] ?? 0;
        hash = Math.imul(hash, 0x01000193) >>> 0;
      }
    }
  }
  return hash.toString(16).padStart(8, "0");
}

/**
 * Pure RGBA atlas QA. Decoding PNG bytes remains outside this experimental
 * module; callers provide decoded RGBA pixels so this stays dependency-free.
 */
export function analyzeTextureAtlas(input: TextureAtlasInput): TextureAtlasAnalysis {
  const diagnostics: ExperimentalParticleDiagnostic[] = [];
  const { width, height, rgba, grid } = input;

  if (!positiveInteger(width) || !positiveInteger(height)) {
    diagnostics.push({
      severity: "error",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidTextureAtlasBuffer,
      path: "texture",
      message: "Texture width and height must be positive integers.",
    });
    return { summary: null, diagnostics };
  }

  if (rgba.length !== width * height * 4) {
    diagnostics.push({
      severity: "error",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidTextureAtlasBuffer,
      path: "texture.rgba",
      message: `RGBA buffer length ${rgba.length} does not match ${width}x${height}x4.`,
    });
    return { summary: null, diagnostics };
  }

  if (
    !positiveInteger(grid.columns) ||
    !positiveInteger(grid.rows) ||
    width % grid.columns !== 0 ||
    height % grid.rows !== 0
  ) {
    diagnostics.push({
      severity: "error",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasGridMismatch,
      path: "texture.grid",
      message:
        "Atlas grid rows/columns must be positive integers that divide the texture dimensions exactly.",
    });
    return { summary: null, diagnostics };
  }

  const alphaThreshold = input.alpha_threshold ?? 16;
  const whiteThreshold = input.neutral_white_threshold ?? 235;
  const cellWidth = width / grid.columns;
  const cellHeight = height / grid.rows;
  let transparentPixels = 0;
  let visibleWhitePixels = 0;

  for (let offset = 0; offset < rgba.length; offset += 4) {
    const r = rgba[offset];
    const g = rgba[offset + 1];
    const b = rgba[offset + 2];
    const a = rgba[offset + 3];
    if (a <= alphaThreshold) transparentPixels += 1;
    if (
      a > alphaThreshold &&
      (r + g + b) / 3 >= whiteThreshold &&
      Math.max(r, g, b) - Math.min(r, g, b) <= 18
    ) {
      visibleWhitePixels += 1;
    }
  }

  if (transparentPixels === 0) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasMissingTransparency,
      path: "texture.rgba",
      message: "Atlas has no transparent pixels; verify that transparency was not flattened or baked.",
    });
  }
  if (visibleWhitePixels > 0) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasVisibleWhiteMatte,
      path: "texture.rgba",
      message: `Atlas contains ${visibleWhitePixels} visible near-neutral white pixels; verify they are intentional sprite content rather than a matte/halo.`,
    });
  }

  let minimumGutter: number | null = null;
  const hashes = new Set<string>();
  for (let row = 0; row < grid.rows; row += 1) {
    for (let column = 0; column < grid.columns; column += 1) {
      const x0 = column * cellWidth;
      const y0 = row * cellHeight;
      let minX = cellWidth;
      let minY = cellHeight;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < cellHeight; y += 1) {
        for (let x = 0; x < cellWidth; x += 1) {
          const alpha = rgba[((y0 + y) * width + (x0 + x)) * 4 + 3];
          if (alpha <= alphaThreshold) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }

      if (maxX >= 0) {
        const gutter = Math.min(
          minX,
          minY,
          cellWidth - 1 - maxX,
          cellHeight - 1 - maxY
        );
        minimumGutter = minimumGutter === null ? gutter : Math.min(minimumGutter, gutter);
      }
      hashes.add(cellHash(rgba, width, x0, y0, cellWidth, cellHeight));
    }
  }

  const requiredGutter = grid.min_gutter ?? 0;
  if (minimumGutter !== null && minimumGutter < requiredGutter) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasUnsafeGutter,
      path: "texture.grid.min_gutter",
      message: `Minimum visible sprite gutter ${minimumGutter}px is below the requested ${requiredGutter}px.`,
    });
  }

  const totalCells = grid.columns * grid.rows;
  if (grid.require_unique_cells && hashes.size < totalCells) {
    diagnostics.push({
      severity: "warning",
      code: PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasDuplicateCell,
      path: "texture.grid",
      message: `Atlas has ${hashes.size}/${totalCells} unique cells while unique cells were requested.`,
    });
  }

  return {
    summary: {
      width,
      height,
      columns: grid.columns,
      rows: grid.rows,
      cell_width: cellWidth,
      cell_height: cellHeight,
      transparent_pixels: transparentPixels,
      visible_white_pixels: visibleWhitePixels,
      minimum_gutter: minimumGutter,
      unique_cells: hashes.size,
      total_cells: totalCells,
    },
    diagnostics,
  };
}
