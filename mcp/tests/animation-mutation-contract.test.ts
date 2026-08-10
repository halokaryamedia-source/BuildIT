import { describe, expect, test } from "bun:test";
import {
  animationTimelineParameters,
  manageKeyframesParameters,
} from "@/server/tools/animation";

describe("animation mutation contract", () => {
  test("manage_keyframes rejects an empty target list", () => {
    const result = manageKeyframesParameters.safeParse({
      action: "create",
      bone_name: "root",
      channel: "rotation",
      keyframes: [],
    });
    expect(result.success).toBe(false);
  });

  test("timeline loop requires an explicit loop mode", () => {
    expect(animationTimelineParameters.safeParse({ action: "loop" }).success).toBe(false);
    expect(
      animationTimelineParameters.safeParse({ action: "loop", loop_mode: "loop" }).success
    ).toBe(true);
  });
});
