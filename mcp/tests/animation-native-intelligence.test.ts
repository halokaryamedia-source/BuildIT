import { describe, expect, test } from "bun:test";
import {
  MOLANG_ANIMATION_MATH_SYMBOLS,
  analyzeAnimationMolangExpressions,
} from "@/lib/animationMolangSemantics";
import { analyzeAnimationMotionDynamics } from "@/lib/animationMotionDynamics";
import { animationNativePropertiesParameters } from "@/server/tools/animation-native-intelligence";

describe("Bedrock animation native intelligence", () => {
  test("recognizes the complete current official Molang math surface compactly", () => {
    expect(MOLANG_ANIMATION_MATH_SYMBOLS).toHaveLength(61);
    expect(new Set(MOLANG_ANIMATION_MATH_SYMBOLS).size).toBe(61);

    for (const direction of ["ease_in", "ease_in_out", "ease_out"]) {
      for (const shape of [
        "back",
        "bounce",
        "circ",
        "cubic",
        "elastic",
        "expo",
        "quad",
        "quart",
        "quint",
        "sine",
      ]) {
        expect(MOLANG_ANIMATION_MATH_SYMBOLS).toContain(
          `${direction}_${shape}`
        );
      }
    }

    for (const name of [
      "abs",
      "acos",
      "asin",
      "atan",
      "atan2",
      "ceil",
      "clamp",
      "copy_sign",
      "cos",
      "die_roll",
      "die_roll_integer",
      "exp",
      "floor",
      "hermite_blend",
      "inverse_lerp",
      "lerp",
      "lerprotate",
      "ln",
      "max",
      "min",
      "min_angle",
      "mod",
      "pi",
      "pow",
      "random",
      "random_integer",
      "round",
      "sign",
      "sin",
      "sqrt",
      "trunc",
    ]) {
      expect(MOLANG_ANIMATION_MATH_SYMBOLS).toContain(name);
    }
  });

  test("Molang diagnostics normalize aliases without evaluating gameplay truth", () => {
    const result = analyzeAnimationMolangExpressions([
      {
        source: "head.rotation",
        expression:
          "math.ease_in_out_back(0, 1, math.clamp(math.sin(q.anim_time * 90), 0, 1)) + math.pi + v.look_bias",
      },
      {
        source: "state.condition",
        expression: "math.future_curve(q.life_time) > 0",
      },
      {
        source: "bad.namespace",
        expression: "geometry.foo + 1",
      },
      {
        source: "complex.value",
        expression: "t.x = 1; t.x + 1;",
      },
    ]);

    expect(result.math.used).toEqual(
      expect.arrayContaining(["ease_in_out_back", "clamp", "sin", "pi"])
    );
    expect(result.math.unknown).toEqual(["future_curve"]);
    expect(result.math.version_sensitive_1_21_120).toEqual([
      "ease_in_out_back",
    ]);
    expect(result.dependencies.query).toEqual(
      expect.arrayContaining(["query.anim_time", "query.life_time"])
    );
    expect(result.dependencies.variable).toEqual(["variable.look_bias"]);
    expect(result.dependencies.temp).toEqual(["temp.x"]);
    expect(result.forbidden_animation_namespaces).toEqual(["geometry.foo"]);
    expect(result.complex_missing_return_count).toBe(1);
  });

  test("one properties branch batches native Bedrock clip semantics", () => {
    const parsed = animationNativePropertiesParameters.parse({
      operation: "properties",
      animation_id: "animation.test.walk",
      length: 1.25,
      fps: 20,
      loop_mode: "hold",
      anim_time_update: "q.modified_distance_moved / 1.4",
      blend_weight: "math.clamp(v.weight, 0, 1)",
      start_delay: "math.random(0, 0.4)",
      loop_delay: 0.25,
      override_previous_animation: true,
      rotation_spaces: [
        { bone_name: "head", relative_to: "entity" },
        { bone_name: "body", relative_to: "parent" },
      ],
    });

    expect(parsed.operation).toBe("properties");
    expect(parsed.loop_mode).toBe("hold");
    expect(parsed.rotation_spaces).toHaveLength(2);
    expect(
      animationNativePropertiesParameters.safeParse({
        operation: "properties",
        animation_id: "animation.test.walk",
      }).success
    ).toBe(false);
    expect(
      animationNativePropertiesParameters.safeParse({
        operation: "properties",
        start_delay: "   ",
      }).success
    ).toBe(false);
  });

  test("motion dynamics use shortest rotation deltas and bounded numeric evidence", () => {
    const result = analyzeAnimationMotionDynamics({
      loop_mode: "loop",
      tracks: [
        {
          group_uuid: "root",
          group_name: "root",
          channel: "position",
          keyframes: [
            { time: 0, value: [0, 0, 0] },
            { time: 0.5, value: [8, 0, 0] },
            { time: 1, value: [16, 0, 0] },
          ],
        },
        {
          group_uuid: "head",
          group_name: "head",
          channel: "rotation",
          keyframes: [
            { time: 0, value: [0, 170, 0] },
            { time: 1, value: [0, -170, 0] },
          ],
        },
      ],
    });

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected dynamics");
    const root = result.examples.find((entry) => entry.group_uuid === "root");
    const head = result.examples.find((entry) => entry.group_uuid === "head");
    expect(root?.path_length).toBe(16);
    expect(root?.boundary_velocity_delta).toBe(0);
    expect(head?.path_length).toBe(20);
  });

  test("runtime wiring expands capability without adding another MCP tool", async () => {
    const [runtime, server, skill] = await Promise.all([
      Bun.file("server/tools/animation-native-intelligence.ts").text(),
      Bun.file("server/server.ts").text(),
      Bun.file("../.agents/skills/blockit-bedrock-animation/SKILL.md").text(),
    ]);

    expect(runtime).toContain('operation: z.literal("properties")');
    expect(runtime).toContain("start_delay");
    expect(runtime).toContain("loop_delay");
    expect(runtime).toContain("override_previous_animation");
    expect(runtime).toContain("rotation_global");
    expect(runtime).toContain("diagnostics_cost");
    expect(runtime).not.toContain("createTool(");
    expect(server).toContain("wireAnimationNativeIntelligence();");
    expect(skill).toContain("operation: properties");
    expect(skill).toContain("math.ease_{in|out|in_out}_");
  });
});
