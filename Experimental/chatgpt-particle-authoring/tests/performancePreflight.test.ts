import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  estimateParticlePerformanceBudget,
} from "../src";

describe("experimental particle performance preflight", () => {
  test("estimates capped steady-state visible load", () => {
    const result = estimateParticlePerformanceBudget(
      [
        { name: "a", spawn_rate: 10, average_lifetime: 2, max_particles: 50 },
        { name: "b", spawn_rate: 20, average_lifetime: 4, max_particles: 30 },
      ],
      { max_visible_particles: 60 }
    );

    expect(result.emitters).toEqual([
      { name: "a", estimated_peak_visible: 20 },
      { name: "b", estimated_peak_visible: 30 },
    ]);
    expect(result.estimated_peak_visible).toBe(50);
    expect(result.diagnostics).toEqual([]);
  });

  test("warns when the authored visible-particle budget is exceeded", () => {
    const result = estimateParticlePerformanceBudget(
      [{ name: "smoke", spawn_rate: 30, average_lifetime: 5, max_particles: 100 }],
      { max_visible_particles: 80 }
    );

    expect(result.diagnostics[0]?.code).toBe(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.performanceBudgetExceeded
    );
  });
});
