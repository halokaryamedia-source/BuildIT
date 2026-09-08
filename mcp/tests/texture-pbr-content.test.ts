import { describe, expect, test } from "bun:test";
import { analyzePbrTextureContent } from "@/lib/texturePbrContent";

function pixels(r: number, g: number, b: number, a = 255, count = 64) {
  const data = new Uint8ClampedArray(count * 4);
  for (let index = 0; index < count; index += 1) {
    const offset = index * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = a;
  }
  return data;
}

describe("PBR texture content diagnostics", () => {
  test("a flat tangent-space normal is accepted while grayscale normal data is reviewed", () => {
    const ready = analyzePbrTextureContent([
      {
        uuid: "normal-flat",
        name: "normal-flat.png",
        channel: "normal",
        pixels: pixels(128, 128, 255),
      },
    ]);
    expect(ready.gate.state).toBe("ready");

    const review = analyzePbrTextureContent([
      {
        uuid: "normal-gray",
        name: "normal-gray.png",
        channel: "normal",
        pixels: pixels(128, 128, 128),
      },
    ]);
    expect(review.gate.state).toBe("review_required");
    expect(review.gate.reasons).toContain("NORMAL_MAP_APPEARS_GRAYSCALE");
  });

  test("height content with divergent RGB channels is a semantic review candidate", () => {
    const result = analyzePbrTextureContent([
      {
        uuid: "height-rgb",
        name: "height-rgb.png",
        channel: "height",
        pixels: pixels(0, 128, 255),
      },
    ]);
    expect(result.gate.reasons).toContain("HEIGHT_MAP_NOT_GRAYSCALE");
  });

  test("MERS reports strong metalness and subsurface overlap without inventing a score", () => {
    const result = analyzePbrTextureContent([
      {
        uuid: "mers-overlap",
        name: "mers-overlap.png",
        channel: "mer",
        pixels: pixels(255, 0, 128, 255),
        mers_enabled: true,
      },
    ]);
    expect(result.gate.reasons).toContain("MERS_METALNESS_SUBSURFACE_OVERLAP");
    expect(result.textures[0]).toMatchObject({ semantic_mode: "MERS" });
    expect(JSON.stringify(result)).not.toContain("quality_score");
  });
});
