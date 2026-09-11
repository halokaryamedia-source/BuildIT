import { describe, expect, test } from "bun:test";
import {
  evaluateKeepOutSamples,
  evaluateMotionEnvelope,
  evaluateViewDistanceReadability,
  estimateParticlePerformanceBudget,
  simulateWinterskyDynamicMotion,
  validateParticleIntentContract,
} from "../src";
import {
  VOLCANO_EFFECTIVE_EMITTER_BUDGET,
  VOLCANO_GOLDEN_INTENT,
  VOLCANO_HEAVY_BOMB_ENVELOPE,
  VOLCANO_HEAVY_BOMB_MOTION,
  VOLCANO_KEEP_OUT,
  VOLCANO_RING_SAMPLES,
} from "./fixtures/volcanoGolden";

describe("approved volcano golden static contract", () => {
  test("keeps the approved authored intent structurally valid", () => {
    expect(validateParticleIntentContract(VOLCANO_GOLDEN_INTENT)).toEqual([]);
  });

  test("keeps representative heavy-bomb motion inside its authored envelope", () => {
    const motion = simulateWinterskyDynamicMotion(VOLCANO_HEAVY_BOMB_MOTION);
    expect(evaluateMotionEnvelope(motion, VOLCANO_HEAVY_BOMB_ENVELOPE)).toEqual([]);
  });

  test("keeps representative crater-ring samples outside the central keep-out", () => {
    const spatial = evaluateKeepOutSamples(
      VOLCANO_RING_SAMPLES,
      VOLCANO_KEEP_OUT,
      0.25
    );
    expect(spatial.overlap_fraction).toBe(0);
    expect(spatial.diagnostics).toEqual([]);
  });

  test("keeps representative plume scale readable at the intended distance", () => {
    const readability = evaluateViewDistanceReadability({
      size_blocks: 3,
      distance_blocks: VOLCANO_GOLDEN_INTENT.view_distance_blocks!,
      minimum_angular_degrees: 0.3,
      label: "volcano plume",
    });
    expect(readability.diagnostics).toEqual([]);
  });

  test("keeps the representative effective load inside the experimental budget", () => {
    const performance = estimateParticlePerformanceBudget(
      VOLCANO_EFFECTIVE_EMITTER_BUDGET,
      { max_visible_particles: 115 }
    );
    expect(performance.estimated_peak_visible).toBeLessThanOrEqual(115);
    expect(performance.diagnostics).toEqual([]);
  });
});
