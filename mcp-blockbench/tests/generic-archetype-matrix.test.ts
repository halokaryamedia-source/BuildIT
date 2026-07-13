import { describe, expect, test } from "bun:test";
import {
  analyzeTexturePixels,
  evaluateAnimationQuality,
  evaluateGeometrySymmetry,
} from "../src/lib/stageQuality";

describe("generic positive archetype matrix", () => {
  test("passes a symmetric prop contract", () => {
    const result = evaluateGeometrySymmetry({
      policy: "BILATERAL",
      toleranceUnits: 0.05,
      pairs: [{ id: "handles", left_patterns: ["handle_left"], right_patterns: ["handle_right"] }],
      elements: [
        { name: "handle_left", center: [-3, 5, 0], size: [1, 4, 1] },
        { name: "handle_right", center: [3, 5, 0], size: [1, 4, 1] },
      ],
    });
    expect(result.status).toBe("PASS");
  });

  test("passes an explicitly asymmetric equipment contract", () => {
    const result = evaluateGeometrySymmetry({
      policy: "ASYMMETRIC",
      asymmetryContracts: [{ id: "left_satchel", patterns: ["left_satchel"] }],
      elements: [{ name: "left_satchel", center: [-4, 6, 0], size: [3, 4, 2] }],
    });
    expect(result.status).toBe("PASS");
  });

  test("passes compact Texture and Animation quality contracts", () => {
    const texture = analyzeTexturePixels({
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([80, 72, 60, 255, 96, 86, 70, 255]),
      contract: {
        anti_aliasing_allowed: false,
        palette_hex: ["#50483C", "#605646"],
        maximum_palette_distance: 8,
        maximum_palette_outlier_ratio: 0,
        maximum_unique_colors: 4,
      },
    });
    const animation = evaluateAnimationQuality({
      snapshots: [{
        name: "idle",
        length: 1,
        animator_count: 2,
        keyframe_count: 4,
        root_position_channels: 0,
      }],
      requiredClips: ["idle"],
      existingGroups: ["body", "head"],
      movingGroups: ["head"],
      staticGroups: ["body"],
      rootMotionAllowed: false,
    });
    expect(texture.status).toBe("PASS");
    expect(animation.status).toBe("PASS");
  });
});
