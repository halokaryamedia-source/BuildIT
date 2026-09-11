import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  evaluateMotionAgainstIntentTarget,
  simulateWinterskyDynamicMotion,
  validateParticleIntentContract,
} from "../src";

describe("experimental particle intent contract", () => {
  test("accepts a bounded authoring intent", () => {
    expect(
      validateParticleIntentContract({
        effect_name: "volcanic eruption",
        target_runtime: "snowstorm",
        view_distance_blocks: 100,
        total_duration_seconds: 30,
        motion_targets: [
          {
            id: "heavy_bomb",
            envelope: {
              apex_y: { min: 15, max: 23 },
              horizontal_distance: { min: 28, max: 40 },
            },
          },
        ],
      })
    ).toEqual([]);
  });

  test("reports invalid ranges and duplicate target ids", () => {
    const diagnostics = validateParticleIntentContract({
      effect_name: "",
      target_runtime: "snowstorm",
      view_distance_blocks: 0,
      total_duration_seconds: -1,
      motion_targets: [
        { id: "bomb", envelope: { apex_y: { min: 20, max: 10 } } },
        { id: "bomb", envelope: { horizontal_distance: { min: 10, max: 20 } } },
      ],
    });

    const codes = diagnostics.map((entry) => entry.code);
    expect(codes).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.invalidParticleIntentContract
    );
    expect(codes).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.duplicateParticleIntentTarget
    );
  });

  test("uses the intent target as an acceptance envelope, not an auto-fix", () => {
    const result = simulateWinterskyDynamicMotion({
      direction: [0, 1, 0.1],
      initial_speed: 2,
      acceleration: [0, 0, 0],
      linear_drag_coefficient: 0.2,
      lifetime: 3,
    });
    const diagnostics = evaluateMotionAgainstIntentTarget(result, {
      id: "plume",
      envelope: {
        apex_y: { min: 20, max: 35 },
        horizontal_distance: { min: 2, max: 10 },
      },
    });

    expect(diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.motionApexOutsideTarget
    );
  });
});
