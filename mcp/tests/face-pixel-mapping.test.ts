import { describe, expect, test } from "bun:test";
import {
  mapFaceUvToTexturePixels,
  requireFiniteFaceUv,
  requirePositiveTextureMetric,
} from "@/lib/facePixelMapping";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("face pixel mapping ownership", () => {
  test("maps logical UV coordinates directly at 1x pixel density", () => {
    expect(
      mapFaceUvToTexturePixels(
        [1, 2, 5, 6],
        { width: 128, displayHeight: 128, uvWidth: 128, uvHeight: 128 },
        "fixture"
      )
    ).toEqual({
      corners: [1, 2, 5, 6],
      rect: [1, 2, 5, 6],
      size: [4, 4],
      flip_u: false,
      flip_v: false,
    });
  });

  test("preserves U and V direction while normalizing only the returned bounds", () => {
    const uFlipped = mapFaceUvToTexturePixels(
      [5, 2, 1, 6],
      { width: 128, displayHeight: 128, uvWidth: 128, uvHeight: 128 },
      "fixture"
    );
    expect(uFlipped.rect).toEqual([1, 2, 5, 6]);
    expect(uFlipped.size).toEqual([4, 4]);
    expect(uFlipped.flip_u).toBe(true);
    expect(uFlipped.flip_v).toBe(false);

    const vFlipped = mapFaceUvToTexturePixels(
      [1, 6, 5, 2],
      { width: 128, displayHeight: 128, uvWidth: 128, uvHeight: 128 },
      "fixture"
    );
    expect(vFlipped.rect).toEqual([1, 2, 5, 6]);
    expect(vFlipped.flip_u).toBe(false);
    expect(vFlipped.flip_v).toBe(true);
  });

  test("scales logical UV into higher-density physical texture pixels", () => {
    expect(
      mapFaceUvToTexturePixels(
        [2, 3, 4, 5],
        { width: 256, displayHeight: 256, uvWidth: 128, uvHeight: 128 },
        "fixture"
      )
    ).toEqual({
      corners: [4, 6, 8, 10],
      rect: [4, 6, 8, 10],
      size: [4, 4],
      flip_u: false,
      flip_v: false,
    });
  });

  test("rejects non-finite UVs and non-positive texture metrics", () => {
    expect(() => requireFiniteFaceUv([0, Number.NaN, 1, 1], "fixture")).toThrow();
    expect(() => requireFiniteFaceUv([0, 0, 1], "fixture")).toThrow();
    expect(() => requirePositiveTextureMetric(0, "fixture")).toThrow();
    expect(() => requirePositiveTextureMetric(Number.POSITIVE_INFINITY, "fixture")).toThrow();
  });

  test("inspect_element consumes the shared mapping owner instead of carrying a second implementation", async () => {
    const inspection = await source("server/tools/element-inspection.ts");
    expect(inspection).toContain('from "@/lib/facePixelMapping"');
    expect(inspection).toContain("mapFaceUvToTexturePixels(");
    expect(inspection).not.toContain("function roundNativePainterCoordinate");
    expect(inspection).not.toContain("function requirePositiveTextureMetric");
  });
});
