import { describe, expect, test } from "bun:test";
import {
  countEffectiveEffectDataPoints,
  countEffectiveTimelineScriptLines,
} from "@/server/tools/animation-inspection";

describe("animation effect summary semantics", () => {
  test("particle and sound summary counts match exported non-empty effects", () => {
    expect(
      countEffectiveEffectDataPoints([
        { effect: "minecraft:spark" },
        { effect: "" },
        { effect: null },
        {},
        { effect: " " },
      ])
    ).toBe(2);
  });

  test("timeline summary counts effective exported script lines", () => {
    expect(
      countEffectiveTimelineScriptLines([
        { script: "variable.a = 1\n\n;\n/say ready" },
        { script: "   " },
        { script: null },
        {},
      ])
    ).toBe(2);
  });

  test("inspection summary uses effective-count helpers without dropping authored datapoints", async () => {
    const source = await Bun.file("server/tools/animation-inspection.ts").text();
    expect(source).toContain("countEffectiveEffectDataPoints(keyframe.particles)");
    expect(source).toContain("countEffectiveEffectDataPoints(keyframe.sounds)");
    expect(source).toContain("countEffectiveTimelineScriptLines(keyframe.scripts)");
    expect(source).toContain("data_point_index: dataPointIndex");
  });
});
