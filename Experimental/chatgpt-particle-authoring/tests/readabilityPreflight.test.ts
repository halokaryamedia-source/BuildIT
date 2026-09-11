import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  evaluateViewDistanceReadability,
} from "../src";

describe("experimental view-distance readability preflight", () => {
  test("keeps large long-distance particles above the authored angular threshold", () => {
    const result = evaluateViewDistanceReadability({
      size_blocks: 3,
      distance_blocks: 100,
      minimum_angular_degrees: 0.3,
      label: "plume",
    });

    expect(result.angular_size_degrees).toBeGreaterThan(0.3);
    expect(result.diagnostics).toEqual([]);
  });

  test("warns when a particle is too small for the intended viewing distance", () => {
    const result = evaluateViewDistanceReadability({
      size_blocks: 0.2,
      distance_blocks: 100,
      minimum_angular_degrees: 0.3,
      label: "fragment",
    });

    expect(result.diagnostics[0]?.code).toBe(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.readabilityBelowTarget
    );
  });
});
