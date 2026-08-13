import { describe, expect, test } from "bun:test";
import { inspectAnimationParameters, resolveUniqueControllerState } from "@/server/tools/animation-inspection";

describe("AnimationController inspection closure", () => {
  test("adds a focused controller-state selector without a new tool", async () => {
    expect(inspectAnimationParameters.parse({ state: "idle" }).state).toBe("idle");
    expect(inspectAnimationParameters.safeParse({ state: "" }).success).toBe(false);
    const source = await Bun.file("server/tools/animation-inspection.ts").text();
    expect(source).toContain("instanceof AnimationController");
    expect(source).toContain('authored_space: "blockbench_animation_controller"');
    expect(source).toContain("animation_key");
    expect(source).toContain("target_name");
    expect(source).not.toContain("create_animation_controller");
    expect(source).not.toContain("manage_animation_controller");
  });

  test("state identity is UUID-first then unique exact name", () => {
    const states = [
      { uuid: "u1", name: "idle" },
      { uuid: "u2", name: "attack" },
      { uuid: "u3", name: "attack" },
    ];
    expect(resolveUniqueControllerState(states, "u3")).toEqual(states[2]);
    expect(resolveUniqueControllerState(states, "idle")).toEqual(states[0]);
    expect(() => resolveUniqueControllerState(states, "attack")).toThrow("ambiguous");
    expect(() => resolveUniqueControllerState(states, "missing")).toThrow("not found");
  });
});
