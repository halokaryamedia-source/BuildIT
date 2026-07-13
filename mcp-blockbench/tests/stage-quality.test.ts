import { describe, expect, test } from "bun:test";
import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
  evaluateGeometrySymmetry,
} from "../src/lib/stageQuality";

describe("deterministic stage quality", () => {
  test("rejects partial alpha and palette drift in a sharp-pixel texture", () => {
    const pixels = new Uint8ClampedArray([
      117, 107, 91, 255,
      255, 0, 255, 128,
    ]);
    const result = analyzeTexturePixels({
      width: 2,
      height: 1,
      data: pixels,
      contract: {
        anti_aliasing_allowed: false,
        maximum_partial_alpha_ratio: 0,
        palette_hex: ["#756B5B"],
        maximum_palette_distance: 24,
        maximum_palette_outlier_ratio: 0.1,
      },
    });
    expect(result.status).toBe("REVISION_REQUIRED");
    expect(result.issues.map((issue) => issue.code)).toContain(
      "TEXTURE_PARTIAL_ALPHA_FORBIDDEN"
    );
    expect(result.issues.map((issue) => issue.code)).toContain(
      "TEXTURE_PALETTE_DRIFT"
    );
  });

  test("accepts a compact approved palette texture", () => {
    const pixels = new Uint8ClampedArray([
      117, 107, 91, 255,
      81, 74, 64, 255,
    ]);
    const result = analyzeTexturePixels({
      width: 2,
      height: 1,
      data: pixels,
      contract: {
        anti_aliasing_allowed: false,
        palette_hex: ["#756B5B", "#514A40"],
        maximum_palette_distance: 8,
        maximum_palette_outlier_ratio: 0,
        maximum_unique_colors: 4,
      },
    });
    expect(result.status).toBe("PASS");
  });

  test("rejects missing keyframes, missing groups, and root motion", () => {
    const result = evaluateAnimationQuality({
      snapshots: [
        {
          name: "walk",
          length: 1,
          animator_count: 1,
          keyframe_count: 0,
          root_position_channels: 2,
        },
      ],
      requiredClips: ["walk"],
      existingGroups: ["body"],
      movingGroups: ["leg_left"],
      rootMotionAllowed: false,
    });
    expect(result.status).toBe("REVISION_REQUIRED");
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "ANIMATION_HAS_NO_KEYFRAMES",
        "ANIMATION_ROOT_MOTION_FORBIDDEN",
        "ANIMATION_GROUP_MISSING",
      ])
    );
  });

  test("enforces bilateral pairs and explicit asymmetric contracts", () => {
    const bilateral = evaluateGeometrySymmetry({
      policy: "BILATERAL",
      toleranceUnits: 0.1,
      pairs: [
        {
          id: "ears",
          left_patterns: ["ear_left"],
          right_patterns: ["ear_right"],
        },
      ],
      elements: [
        { name: "ear_left", center: [-2, 10, 0], size: [1, 2, 1] },
        { name: "ear_right", center: [2.5, 10, 0], size: [1, 2, 1] },
      ],
    });
    expect(bilateral.status).toBe("REVISION_REQUIRED");
    expect(bilateral.issues[0]?.code).toBe("SYMMETRY_PAIR_MISMATCH");

    const asymmetric = evaluateGeometrySymmetry({
      policy: "ASYMMETRIC",
      elements: [{ name: "left_satchel", center: [-3, 5, 0], size: [2, 2, 1] }],
      asymmetryContracts: [{ id: "satchel", patterns: ["left_satchel"] }],
    });
    expect(asymmetric.status).toBe("PASS");
  });
});
