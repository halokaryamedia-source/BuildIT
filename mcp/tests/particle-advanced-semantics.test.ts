import { describe, expect, test } from "bun:test";
import {
  applyParticleOperations,
  createParticleDocument,
} from "../lib/bedrockParticleDocument";
import {
  analyzeBedrockParticleSemantics,
  BEDROCK_PARTICLE_SPECIAL_MOLANG_VARIABLES,
} from "../lib/bedrockParticleSemantics";

describe("Bedrock particle advanced semantics", () => {
  test("recognizes current math in parametric particle motion without evaluating it", () => {
    let document = createParticleDocument({
      identifier: "blockit:math_orbit",
      preset: "trail",
    });
    document = applyParticleOperations(document, [
      {
        op: "set_component",
        component: "minecraft:particle_motion_parametric",
        value: {
          relative_position: [
            "math.sin(variable.particle_age * 180) * 0.5",
            "variable.particle_age * 0.25",
            "math.cos(variable.particle_age * 180) * 0.5",
          ],
          direction: [0, 1, 0],
          rotation: "variable.particle_age * 90",
        },
      },
    ]);

    const diagnostics = analyzeBedrockParticleSemantics(document);
    expect(diagnostics.some((entry) => entry.code === "parametric_motion_molang")).toBe(true);
    expect(diagnostics.some((entry) => entry.code === "unknown_particle_molang_math")).toBe(false);
    expect(BEDROCK_PARTICLE_SPECIAL_MOLANG_VARIABLES).toContain("variable.particle_age");
  });

  test("warns on unknown math and obvious literal zero divisors", () => {
    let document = createParticleDocument({ identifier: "blockit:math_lint" });
    document = applyParticleOperations(document, [
      {
        op: "patch",
        path: ["components", "minecraft:particle_appearance_billboard", "size"],
        value: [
          "math.future_wave(variable.particle_age)",
          "variable.particle_age / 0",
        ],
      },
    ]);

    const diagnostics = analyzeBedrockParticleSemantics(document);
    expect(diagnostics.some((entry) => entry.code === "unknown_particle_molang_math")).toBe(true);
    expect(diagnostics.some((entry) => entry.code === "literal_zero_divisor")).toBe(true);
  });

  test("detects malformed Molang and costly per-render randomness", () => {
    let malformed = createParticleDocument({ identifier: "blockit:bad_math" });
    malformed = applyParticleOperations(malformed, [
      {
        op: "patch",
        path: ["components", "minecraft:particle_lifetime_expression", "max_lifetime"],
        value: "math.sin((variable.particle_age)",
      },
    ]);
    expect(
      analyzeBedrockParticleSemantics(malformed).some(
        (entry) => entry.code === "invalid_particle_molang_syntax"
      )
    ).toBe(true);

    let expensive = createParticleDocument({ identifier: "blockit:render_math" });
    expensive = applyParticleOperations(expensive, [
      {
        op: "set_component",
        component: "minecraft:particle_initialization",
        value: {
          per_render_expression:
            "v.a=math.sin(v.particle_age);v.b=math.cos(v.particle_age);v.c=math.abs(v.a);v.d=math.floor(v.b);v.e=math.ceil(v.c);v.f=math.random(0,1);v.g=math.sqrt(math.abs(v.f));",
        },
      },
    ]);
    const diagnostics = analyzeBedrockParticleSemantics(expensive);
    expect(diagnostics.some((entry) => entry.code === "per_render_random_molang")).toBe(true);
    expect(diagnostics.some((entry) => entry.code === "expensive_per_render_molang")).toBe(true);
  });

  test("validates literal flipbook bounds and detailed curve contracts", () => {
    let document = createParticleDocument({ identifier: "blockit:flip_curve" });
    document = applyParticleOperations(document, [
      {
        op: "patch",
        path: [
          "components",
          "minecraft:particle_appearance_billboard",
          "uv",
          "flipbook",
        ],
        value: {
          base_UV: [0, 0],
          size_UV: [8, 8],
          step_UV: [8, 0],
          frames_per_second: 12,
          max_frame: 4,
          loop: true,
        },
      },
      {
        op: "set_curve",
        name: "variable.bad_bezier",
        value: {
          type: "bezier",
          input: "variable.particle_age / variable.particle_lifetime",
          nodes: [0, 1, 0],
        },
      },
    ]);

    const diagnostics = analyzeBedrockParticleSemantics(document);
    expect(diagnostics.some((entry) => entry.code === "flipbook_frame_outside_texture")).toBe(true);
    expect(diagnostics.some((entry) => entry.code === "invalid_bezier_curve_nodes")).toBe(true);
  });

  test("rejects invalid randomize weights and warns on high nested-effect fan-out", () => {
    let document = createParticleDocument({ identifier: "blockit:event_quality" });
    document = applyParticleOperations(document, [
      {
        op: "set_event",
        name: "impact",
        value: {
          sequence: [
            { particle_effect: { effect: "blockit:a", type: "emitter" } },
            { particle_effect: { effect: "blockit:b", type: "emitter" } },
            { particle_effect: { effect: "blockit:c", type: "emitter" } },
            { particle_effect: { effect: "blockit:d", type: "emitter" } },
            { particle_effect: { effect: "blockit:e", type: "emitter" } },
            { particle_effect: { effect: "blockit:f", type: "emitter" } },
            { particle_effect: { effect: "blockit:g", type: "emitter" } },
          ],
          randomize: [
            { weight: -1, particle_effect: { effect: "blockit:x", type: "emitter" } },
            { weight: 0 },
          ],
        },
      },
    ]);

    const diagnostics = analyzeBedrockParticleSemantics(document);
    expect(diagnostics.some((entry) => entry.code === "invalid_particle_randomize_weight")).toBe(true);
    expect(diagnostics.some((entry) => entry.code === "high_particle_event_fanout")).toBe(true);
  });
});
