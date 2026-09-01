import { describe, expect, test } from "bun:test";
import {
  classifyBedrockTransformInterpolation,
  normalizeBedrockAnimationItemIdentifier,
  requireBedrockAnimationIdentifier,
  requireDirectBedrockExportableInterpolation,
} from "@/lib/bedrockAnimationSemantics";

describe("Bedrock animation semantics", () => {
  test("normalizes authored animation/controller identifiers", () => {
    expect(normalizeBedrockAnimationItemIdentifier("robot.walk", "animation")).toBe(
      "animation.robot.walk"
    );
    expect(
      normalizeBedrockAnimationItemIdentifier("robot.move", "controller")
    ).toBe("controller.animation.robot.move");
    expect(
      normalizeBedrockAnimationItemIdentifier(
        "controller.animation.robot.move",
        "controller"
      )
    ).toBe("controller.animation.robot.move");
  });

  test("accepts Bedrock identifier characters and rejects unsafe names", () => {
    expect(() =>
      requireBedrockAnimationIdentifier("animation.robot.walk_2", "Animation")
    ).not.toThrow();
    expect(() =>
      requireBedrockAnimationIdentifier("animation.robot-walk", "Animation")
    ).toThrow();
    expect(() =>
      requireBedrockAnimationIdentifier("animation:robot.walk", "Animation")
    ).toThrow();
    expect(() =>
      requireBedrockAnimationIdentifier("2animation.robot", "Animation")
    ).toThrow();
  });

  test("classifies direct Bedrock interpolation semantics", () => {
    expect(classifyBedrockTransformInterpolation("linear")).toBe(
      "native_lerp_mode"
    );
    expect(classifyBedrockTransformInterpolation("catmullrom")).toBe(
      "native_lerp_mode"
    );
    expect(classifyBedrockTransformInterpolation("step")).toBe(
      "pre_post_discontinuity"
    );
    expect(classifyBedrockTransformInterpolation("bezier")).toBe(
      "editor_only_bake_required"
    );
  });

  test("fails closed on direct Bezier Bedrock delivery", () => {
    expect(() =>
      requireDirectBedrockExportableInterpolation(
        "bezier",
        "animation.robot.walk head.rotation"
      )
    ).toThrow(/Bake/);
    expect(() =>
      requireDirectBedrockExportableInterpolation(
        "step",
        "animation.robot.walk head.rotation"
      )
    ).not.toThrow();
  });
});
