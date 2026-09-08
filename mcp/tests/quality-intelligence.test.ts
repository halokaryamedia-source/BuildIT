import { describe, expect, test } from "bun:test";
import { analyzeGeometryHygiene } from "@/lib/geometryQuality";
import { analyzeTextureColorProfile } from "@/lib/textureColorProfile";
import {
  analyzeRootMotionTrack,
  analyzeRootMotionTracks,
} from "@/lib/rootMotionAnalysis";

describe("bounded authoring quality intelligence", () => {
  test("geometry hygiene exposes precision corrections and duplicate bone identity without mutating", () => {
    const result = analyzeGeometryHygiene(
      [
        {
          uuid: "cube-a",
          name: "body",
          from: [0.0000004, 0, 0],
          to: [16, 16, 16],
          origin: [8, 8, 8],
          rotation: [0, 0, 0],
          inflate: 0,
        },
        {
          uuid: "cube-b",
          name: "flat",
          from: [0, 0, 0],
          to: [0, 2, 2],
        },
      ],
      [
        { uuid: "bone-a", name: "arm" },
        { uuid: "bone-b", name: "arm" },
        { uuid: "bone-c", name: "body" },
      ]
    );

    expect(result.state).toBe("review_required");
    expect(result.precision.drift_count).toBe(1);
    expect(result.precision.examples[0]).toMatchObject({
      cube_uuid: "cube-a",
      field: "from",
      axis: "x",
      suggested: 0,
    });
    expect(result.degenerate_cubes.count).toBe(1);
    expect(result.duplicate_bone_names.name_count).toBe(1);
    expect(result.duplicate_bone_names.examples[0].count).toBe(2);
  });

  test("clean geometry stays compact", () => {
    const result = analyzeGeometryHygiene(
      [
        {
          uuid: "cube",
          name: "cube",
          from: [0, 0, 0],
          to: [16, 16, 16],
          origin: [8, 8, 8],
          rotation: [0, 0, 0],
        },
      ],
      [{ uuid: "root", name: "root" }]
    );
    expect(result.state).toBe("clean");
    expect(result.precision.drift_count).toBe(0);
    expect(result.degenerate_cubes.count).toBe(0);
    expect(result.duplicate_bone_names.name_count).toBe(0);
  });

  test("texture color profile is deterministic, sampled, and palette-bounded", () => {
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,
      255, 0, 0, 255,
      0, 0, 255, 255,
      0, 0, 0, 0,
    ]);
    const first = analyzeTextureColorProfile(pixels, 2, 2, { maxSamples: 4, paletteSize: 2 });
    const second = analyzeTextureColorProfile(pixels, 2, 2, { maxSamples: 4, paletteSize: 2 });

    expect(first).toEqual(second);
    expect(first.sampling.sampled_pixels).toBe(4);
    expect(first.alpha.visible_coverage).toBe(0.75);
    expect(first.palette).toHaveLength(2);
    expect(first.palette[0].hex).toBe("#ff0000");
    expect(first.palette[0].visible_ratio).toBe(0.6667);
    expect(first.luma?.span).toBeGreaterThan(0);
  });

  test("root motion reports Bedrock-scale displacement and stable velocity", () => {
    const result = analyzeRootMotionTrack({
      uuid: "root",
      name: "root",
      keyframes: [
        { time: 0, value: [0, 0, 0] },
        { time: 0.5, value: [8, 0, 0] },
        { time: 1, value: [16, 0, 0] },
      ],
    });

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected root motion");
    expect(result.displacement_blocks).toEqual([1, 0, 0]);
    expect(result.horizontal_speed_blocks_per_second).toBe(1);
    expect(result.dominant_axis).toBe("x");
    expect(result.speed_consistency.state).toBe("stable");
  });

  test("root motion chooses the strongest horizontal root and ignores Molang-only tracks", () => {
    const result = analyzeRootMotionTracks([
      {
        uuid: "molang",
        name: "molang",
        keyframes: [
          { time: 0, value: ["query.foo", 0, 0] },
          { time: 1, value: ["query.foo", 0, 0] },
        ],
      },
      {
        uuid: "slow",
        name: "slow",
        keyframes: [
          { time: 0, value: [0, 0, 0] },
          { time: 1, value: [8, 0, 0] },
        ],
      },
      {
        uuid: "fast",
        name: "fast",
        keyframes: [
          { time: 0, value: [0, 0, 0] },
          { time: 1, value: [32, 0, 0] },
        ],
      },
    ]);

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected root motion summary");
    expect(result.primary.track.uuid).toBe("fast");
    expect(result.primary.horizontal_distance_blocks).toBe(2);
  });
});
