import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  evaluateMotionEnvelope,
  simulateWinterskyDynamicMotion,
} from "../src";

describe("experimental Wintersky motion preflight", () => {
  test("reproduces a bounded ballistic heavy-bomb trajectory", () => {
    const result = simulateWinterskyDynamicMotion({
      direction: [-0.1, 0.94, 0.45],
      initial_speed: 17,
      acceleration: [0, -6, 0],
      linear_drag_coefficient: 0.06,
      lifetime: 6,
    });

    expect(Math.hypot(...result.initial_velocity)).toBeCloseTo(17, 8);
    expect(result.apex_y).toBeGreaterThan(15);
    expect(result.apex_y).toBeLessThan(23);
    expect(result.time_to_apex).toBeGreaterThan(0);
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
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.motionApexOutsideTarget
    );
    expect(diagnostics.map((entry) => entry.code)).toContain(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.motionHorizontalDistanceOutsideTarget
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

  test("fails closed when a request exceeds the bounded simulation budget", () => {
    expect(() =>
      simulateWinterskyDynamicMotion({
        direction: [0, 1, 0],
        initial_speed: 1,
        acceleration: [0, 0, 0],
        linear_drag_coefficient: 0,
        lifetime: 3_000,
        tick_rate: 60,
      })
    ).toThrow("motion simulation exceeds bounded step limit");
  });
});
