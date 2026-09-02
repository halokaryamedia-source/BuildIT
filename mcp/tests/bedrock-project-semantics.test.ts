import { describe, expect, test } from "bun:test";
import {
  expandBedrockVisibleBounds,
  fitBedrockVisibleBoundsFromWorldAabb,
  planLogicalUvResolutionChange,
} from "@/lib/bedrockProjectSemantics";

describe("Bedrock project semantics", () => {
  test("keeps UV coordinates when logical resolution changes with keep policy", () => {
    expect(
      planLogicalUvResolutionChange(
        { width: 64, height: 32 },
        { width: 128, height: 64 },
        "keep"
      )
    ).toEqual({
      previous: { width: 64, height: 32 },
      next: { width: 128, height: 64 },
      policy: "keep",
      uv_multiplier: [1, 1],
      requires_box_uv_integrality_check: false,
    });
  });

  test("plans rectangular UV rescaling without assuming square textures", () => {
    expect(
      planLogicalUvResolutionChange(
        { width: 64, height: 32 },
        { width: 128, height: 96 },
        "rescale_uv"
      )
    ).toEqual({
      previous: { width: 64, height: 32 },
      next: { width: 128, height: 96 },
      policy: "rescale_uv",
      uv_multiplier: [2, 3],
      requires_box_uv_integrality_check: false,
    });
  });

  test("flags fractional Box-UV offset risk for non-integral scaling", () => {
    const plan = planLogicalUvResolutionChange(
      { width: 64, height: 64 },
      { width: 96, height: 64 },
      "rescale_uv"
    );
    expect(plan.uv_multiplier).toEqual([1.5, 1]);
    expect(plan.requires_box_uv_integrality_check).toBe(true);
  });

  test("matches Blockbench native centered X/Z visible-width basis", () => {
    expect(
      fitBedrockVisibleBoundsFromWorldAabb({
        min: [-8, 0, -24],
        max: [8, 31, 8],
      })
    ).toEqual({
      width: 3,
      height: 2,
      offset_y: 1,
    });
  });

  test("supports explicit block padding for animated envelope safety", () => {
    expect(
      fitBedrockVisibleBoundsFromWorldAabb(
        {
          min: [-8, 0, -8],
          max: [8, 16, 8],
        },
        0.5
      )
    ).toEqual({
      width: 2,
      height: 3,
      offset_y: 0.5,
    });
  });

  test("expands authored bounds without shrinking existing coverage", () => {
    expect(
      expandBedrockVisibleBounds(
        { width: 4, height: 2, offset_y: 1 },
        { width: 3, height: 4, offset_y: 2 }
      )
    ).toEqual({
      width: 4,
      height: 4,
      offset_y: 2,
    });
  });

  test("rejects malformed resolution and bounds", () => {
    expect(() =>
      planLogicalUvResolutionChange(
        { width: 0, height: 32 },
        { width: 64, height: 32 },
        "keep"
      )
    ).toThrow();
    expect(() =>
      fitBedrockVisibleBoundsFromWorldAabb({
        min: [2, 0, 0],
        max: [1, 1, 1],
      })
    ).toThrow();
  });
});
