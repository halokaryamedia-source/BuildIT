import { describe, expect, test } from "bun:test";
import {
  analyzeSnowstormCompatibility,
  evaluateMotionEnvelope,
  simulateWinterskyDynamicMotion,
  validateParticleBundleReferences,
  type JsonObject,
} from "../src/particlePreflight";

function particle(components: JsonObject, events?: JsonObject): JsonObject {
  return {
    format_version: "1.10.0",
    particle_effect: {
      description: {
        identifier: "test:particle",
      },
      components,
      ...(events ? { events } : {}),
    },
  };
}

describe("experimental Snowstorm compatibility preflight", () => {
  test("warns when vector initial speed would lose authored magnitude in Wintersky", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:particle_initial_speed": [2, 20, 12],
      })
    );

    expect(diagnostics.map((entry) => entry.code)).toContain(
      "snowstorm_initial_speed_vector_normalized"
    );
  });

  test("warns when emitter age controls a living particle property", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:particle_motion_dynamic": {
          linear_acceleration: [
            0,
            "variable.emitter_age < 3 ? 2 : 0",
            0,
          ],
          linear_drag_coefficient: 0.1,
        },
        "minecraft:particle_appearance_billboard": {
          size: [
            "variable.emitter_age < 3 ? 1 : 4",
            1,
          ],
        },
      })
    );

    expect(
      diagnostics.filter(
        (entry) => entry.code === "unstable_emitter_age_particle_property"
      )
    ).toHaveLength(2);
  });

  test("keeps stable particle-owned expressions clean", () => {
    const diagnostics = analyzeSnowstormCompatibility(
      particle({
        "minecraft:particle_initial_speed": 17,
        "minecraft:particle_motion_dynamic": {
          linear_acceleration: [0, -6, 0],
          linear_drag_coefficient:
            "0.04 + variable.particle_random_1 * 0.02",
        },
        "minecraft:particle_appearance_billboard": {
          size: [
            "1 + variable.particle_age * 0.2",
            "1 + variable.particle_age * 0.2",
          ],
        },
      })
    );

    expect(diagnostics).toEqual([]);
  });
});

describe("experimental Wintersky motion preflight", () => {
  test("reproduces a bounded ballistic heavy-bomb trajectory", () => {
    const result = simulateWinterskyDynamicMotion({
      direction: [-0.1, 0.94, 0.45],
      initial_speed: 17,
      acceleration: [0, -6, 0],
      linear_drag_coefficient: 0.06,
      lifetime: 6,
    });

    expect(result.apex_y).toBeGreaterThan(15);
    expect(result.apex_y).toBeLessThan(23);
    expect(result.maximum_horizontal_distance).toBeGreaterThan(28);
    expect(result.maximum_horizontal_distance).toBeLessThan(42);
  });

  test("reports an authored motion target miss without rewriting it", () => {
    const result = simulateWinterskyDynamicMotion({
      direction: [0, 1, 0.15],
      initial_speed: 3,
      acceleration: [0, 0, 0],
      linear_drag_coefficient: 0.2,
      lifetime: 3,
    });

    const diagnostics = evaluateMotionEnvelope(result, {
      apex_y: { min: 15, max: 25 },
      horizontal_distance: { min: 20, max: 40 },
    });

    expect(diagnostics.map((entry) => entry.code)).toContain(
      "motion_apex_outside_target"
    );
    expect(diagnostics.map((entry) => entry.code)).toContain(
      "motion_horizontal_distance_outside_target"
    );
  });

  test("rejects zero-magnitude launch direction", () => {
    expect(() =>
      simulateWinterskyDynamicMotion({
        direction: [0, 0, 0],
        initial_speed: 10,
        acceleration: [0, -6, 0],
        linear_drag_coefficient: 0.05,
        lifetime: 2,
      })
    ).toThrow("direction must have non-zero magnitude");
  });
});

describe("experimental particle bundle reference preflight", () => {
  test("reports a missing child particle effect", () => {
    const master = particle(
      {},
      {
        start: {
          particle_effect: {
            effect: "test:missing_child",
            type: "emitter",
          },
        },
      }
    );

    const diagnostics = validateParticleBundleReferences([
      { identifier: "test:master", document: master },
    ]);

    expect(diagnostics.map((entry) => entry.code)).toEqual([
      "missing_particle_bundle_reference",
    ]);
  });

  test("accepts a resolved child effect", () => {
    const master = particle(
      {},
      {
        start: {
          particle_effect: {
            effect: "test:child",
            type: "emitter",
          },
        },
      }
    );
    const child = particle({
      "minecraft:particle_initial_speed": 4,
    });

    expect(
      validateParticleBundleReferences([
        { identifier: "test:master", document: master },
        { identifier: "test:child", document: child },
      ])
    ).toEqual([]);
  });
});
