import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  analyzeTextureAtlas,
} from "../src";

function setPixel(
  rgba: Uint8Array,
  width: number,
  x: number,
  y: number,
  value: [number, number, number, number]
): void {
  const offset = (y * width + x) * 4;
  rgba.set(value, offset);
}

function validAtlas(): Uint8Array {
  const rgba = new Uint8Array(8 * 8 * 4);
  const colors: [number, number, number, number][] = [
    [40, 40, 40, 255],
    [80, 60, 40, 255],
    [120, 70, 30, 255],
    [60, 80, 100, 255],
  ];
  let index = 0;
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      const color = colors[index++];
      for (let y = 1; y <= 2; y += 1) {
        for (let x = 1; x <= 2; x += 1) {
          setPixel(rgba, 8, column * 4 + x, row * 4 + y, color);
        }
      }
    }
  }
  return rgba;
}

describe("experimental texture atlas QA", () => {
  test("accepts a transparent, padded, unique atlas", () => {
    const result = analyzeTextureAtlas({
      width: 8,
      height: 8,
      rgba: validAtlas(),
      grid: { columns: 2, rows: 2, min_gutter: 1, require_unique_cells: true },
    });

    expect(result.diagnostics).toEqual([]);
    expect(result.summary?.minimum_gutter).toBe(1);
    expect(result.summary?.unique_cells).toBe(4);
  });

  test("reports near-neutral visible white pixels as a matte risk", () => {
    const rgba = validAtlas();
    setPixel(rgba, 8, 1, 1, [250, 250, 250, 255]);
    const result = analyzeTextureAtlas({
      width: 8,
      height: 8,
      rgba,
      grid: { columns: 2, rows: 2 },
    });

    expect(result.diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasVisibleWhiteMatte
    );
  });

  test("reports unsafe gutter and duplicate cells when requested", () => {
    const rgba = new Uint8Array(8 * 8 * 4);
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 2; column += 1) {
        setPixel(rgba, 8, column * 4, row * 4, [50, 50, 50, 255]);
      }
    }
    const result = analyzeTextureAtlas({
      width: 8,
      height: 8,
      rgba,
      grid: { columns: 2, rows: 2, min_gutter: 1, require_unique_cells: true },
    });

    const codes = result.diagnostics.map((entry) => entry.code);
    expect(codes).toContain(PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasUnsafeGutter);
    expect(codes).toContain(PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.textureAtlasDuplicateCell);
  });

  test("fails closed on an invalid RGBA buffer length", () => {
    const result = analyzeTextureAtlas({
      width: 8,
      height: 8,
      rgba: new Uint8Array(12),
      grid: { columns: 2, rows: 2 },
    });
    expect(result.summary).toBeNull();
    expect(result.diagnostics[0]?.code).toBe(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidTextureAtlasBuffer
    );
  });
});
