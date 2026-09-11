import { describe, expect, test } from "bun:test";
import {
  PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES,
  evaluateKeepOutSamples,
} from "../src";

describe("experimental spatial preflight", () => {
  test("accepts samples that remain outside the keep-out cylinder", () => {
    const result = evaluateKeepOutSamples(
      [
        [4, 1, 0],
        [-4, 1, 0],
        [0, 5, 4],
      ],
      { radius: 3, min_y: 0, max_y: 20 }
    );

    expect(result.inside_keep_out_count).toBe(0);
    expect(result.diagnostics).toEqual([]);
  });

  test("warns when authored spatial samples overlap the keep-out volume", () => {
    const result = evaluateKeepOutSamples(
      [
        [0, 1, 0],
        [1, 2, 1],
        [5, 2, 0],
        [6, 2, 0],
      ],
      { radius: 3, min_y: 0, max_y: 20 },
      0.25
    );

    expect(result.overlap_fraction).toBe(0.5);
    expect(result.diagnostics[0]?.code).toBe(
      PARTICLE_PREFLIGHT_DIAGNOSTIC_CODES.keepOutOverlap
    );
  });
});
