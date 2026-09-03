import { describe, expect, test } from "bun:test";
import {
  planThreeDAssistedCenterGroundTranslation,
  planThreeDAssistedFitEnvelopeScale,
} from "@/lib/threeDAssistedReferenceAlignment";

describe("3D-Assisted reference alignment", () => {
  test("fits observed GLB bounds inside requested Minecraft dimensions with uniform scale", () => {
    const plan = planThreeDAssistedFitEnvelopeScale({
      observed_bounds: {
        min: [-16, 0, -24],
        max: [16, 48, 24],
      },
      target_dimensions_blocks: {
        width: 4,
        height: 3,
        length: 5,
      },
      blockbench_units_per_block: 16,
    });

    expect(plan.policy).toBe("fit_envelope");
    expect(plan.scale_multiplier).toBe(1);
    expect(plan.next_uniform_scale).toBe(1);
    expect(plan.target_dimensions_units).toEqual({
      width: 64,
      height: 48,
      length: 80,
    });
    expect(plan.aligned_dimensions_units).toEqual({
      width: 32,
      height: 48,
      length: 48,
    });
    expect(plan.coverage_ratio).toEqual({
      width: 0.5,
      height: 1,
      length: 0.6,
    });
    expect(plan.limiting_axes).toEqual(["height"]);
  });

  test("returns the next absolute uniform scale from the currently observed scale", () => {
    const plan = planThreeDAssistedFitEnvelopeScale({
      observed_bounds: {
        min: [-32, 0, -48],
        max: [32, 96, 48],
      },
      target_dimensions_blocks: {
        width: 4,
        height: 3,
        length: 5,
      },
      blockbench_units_per_block: 16,
      current_uniform_scale: 2,
    });

    expect(plan.scale_multiplier).toBe(0.5);
    expect(plan.next_uniform_scale).toBe(1);
    expect(plan.aligned_dimensions_units).toEqual({
      width: 32,
      height: 48,
      length: 48,
    });
  });

  test("never requires non-uniform scaling to fit the requested envelope", () => {
    const plan = planThreeDAssistedFitEnvelopeScale({
      observed_bounds: {
        min: [0, 0, 0],
        max: [30, 52, 71],
      },
      target_dimensions_blocks: {
        width: 3,
        height: 4,
        length: 6,
      },
      blockbench_units_per_block: 16,
    });

    expect(plan.scale_multiplier).toBeCloseTo(64 / 52);
    expect(plan.aligned_dimensions_units.width).toBeLessThanOrEqual(48);
    expect(plan.aligned_dimensions_units.height).toBeLessThanOrEqual(64);
    expect(plan.aligned_dimensions_units.length).toBeLessThanOrEqual(96);
    expect(plan.limiting_axes).toEqual(["height"]);
  });

  test("centers X/Z and grounds Y after the scaled bounds are measured again", () => {
    const plan = planThreeDAssistedCenterGroundTranslation({
      observed_bounds_after_scale: {
        min: [2, -5, 10],
        max: [6, 7, 18],
      },
      current_origin: [1, 2, 3],
    });

    expect(plan.translation_delta).toEqual([-4, 5, -14]);
    expect(plan.next_origin).toEqual([-3, 7, -11]);
    expect(plan.expected_bounds).toEqual({
      min: [-2, 0, -4],
      max: [2, 12, 4],
    });
  });

  test("supports an explicit non-zero target anchor without changing the policy", () => {
    const plan = planThreeDAssistedCenterGroundTranslation({
      observed_bounds_after_scale: {
        min: [-2, 0, -4],
        max: [2, 12, 4],
      },
      current_origin: [0, 0, 0],
      target_center_x: 8,
      target_ground_y: 16,
      target_center_z: -8,
    });

    expect(plan.translation_delta).toEqual([8, 16, -8]);
    expect(plan.next_origin).toEqual([8, 16, -8]);
    expect(plan.expected_bounds).toEqual({
      min: [6, 16, -12],
      max: [10, 28, -4],
    });
  });

  test("rejects malformed bounds, dimensions, block size, and scale", () => {
    expect(() =>
      planThreeDAssistedFitEnvelopeScale({
        observed_bounds: {
          min: [1, 0, 0],
          max: [1, 1, 1],
        },
        target_dimensions_blocks: {
          width: 1,
          height: 1,
          length: 1,
        },
        blockbench_units_per_block: 16,
      })
    ).toThrow();

    expect(() =>
      planThreeDAssistedFitEnvelopeScale({
        observed_bounds: {
          min: [0, 0, 0],
          max: [1, 1, 1],
        },
        target_dimensions_blocks: {
          width: 0,
          height: 1,
          length: 1,
        },
        blockbench_units_per_block: 16,
      })
    ).toThrow();

    expect(() =>
      planThreeDAssistedFitEnvelopeScale({
        observed_bounds: {
          min: [0, 0, 0],
          max: [1, 1, 1],
        },
        target_dimensions_blocks: {
          width: 1,
          height: 1,
          length: 1,
        },
        blockbench_units_per_block: 0,
      })
    ).toThrow();

    expect(() =>
      planThreeDAssistedFitEnvelopeScale({
        observed_bounds: {
          min: [0, 0, 0],
          max: [1, 1, 1],
        },
        target_dimensions_blocks: {
          width: 1,
          height: 1,
          length: 1,
        },
        blockbench_units_per_block: 16,
        current_uniform_scale: Number.NaN,
      })
    ).toThrow();
  });
});
