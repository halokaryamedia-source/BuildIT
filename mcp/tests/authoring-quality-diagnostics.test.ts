import { describe, expect, test } from "bun:test";
import {
  analyzeOrientedBoxSurfaceQuality,
  SURFACE_MICRO_GAP_REVIEW_DISTANCE,
  SURFACE_SHALLOW_PENETRATION_REVIEW_DEPTH,
} from "@/lib/renderedModelBounds";
import type { OrientedBox } from "@/lib/orientedBoxContact";
import {
  summarizeFaceUvQuality,
  summarizeUvDensity,
  UV_CUBE_DENSITY_SPREAD_REVIEW_FACTOR,
  UV_FACE_ASPECT_REVIEW_FACTOR,
} from "@/server/tools/element-inspection";

function box(center: [number, number, number]): OrientedBox {
  return {
    center,
    axes: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    halfSizes: [1, 1, 1],
  };
}

describe("authoring quality diagnostics", () => {
  test("surface diagnostics distinguish clean contact from z-fight, micro-gap, and shallow penetration risks", () => {
    const base = box([0, 0, 0]);

    expect(analyzeOrientedBoxSurfaceQuality(base, box([2, 0, 0]))).toEqual(
      []
    );

    const coplanar = analyzeOrientedBoxSurfaceQuality(
      base,
      {
        ...box([0.5, 0, 0]),
        halfSizes: [0.5, 0.75, 0.75],
      }
    );
    expect(coplanar.some((risk) => risk.kind === "coplanar_overlap")).toBe(
      true
    );

    const gap = analyzeOrientedBoxSurfaceQuality(base, box([2.02, 0, 0]));
    expect(gap.some((risk) => risk.kind === "micro_gap")).toBe(true);

    const penetration = analyzeOrientedBoxSurfaceQuality(
      base,
      box([1.98, 0, 0])
    );
    expect(
      penetration.some((risk) => risk.kind === "shallow_penetration")
    ).toBe(true);

    expect(
      analyzeOrientedBoxSurfaceQuality(
        base,
        box([2 + SURFACE_MICRO_GAP_REVIEW_DISTANCE * 2, 0, 0])
      ).some((risk) => risk.kind === "micro_gap")
    ).toBe(false);
    expect(
      analyzeOrientedBoxSurfaceQuality(
        base,
        box([2 - SURFACE_SHALLOW_PENETRATION_REVIEW_DEPTH * 2, 0, 0])
      ).some((risk) => risk.kind === "shallow_penetration")
    ).toBe(false);
  });

  test("UV aspect diagnostics accept direct or 90-degree proportional mapping and flag distorted mapping", () => {
    const direct = summarizeFaceUvQuality([8, 4], [0, 0, 16, 8]);
    expect(direct.state).toBe("measured");
    if (direct.state !== "measured") throw new Error("expected measured UV");
    expect(direct.best_aspect_alignment).toBe("direct");
    expect(direct.aspect_ratio_scale_error).toBeCloseTo(1);
    expect(direct.aspect_state).toBe("matched");

    const rotated = summarizeFaceUvQuality([8, 4], [0, 0, 4, 8]);
    expect(rotated.state).toBe("measured");
    if (rotated.state !== "measured") throw new Error("expected measured UV");
    expect(rotated.best_aspect_alignment).toBe("rotated_90");
    expect(rotated.aspect_state).toBe("matched");

    const distorted = summarizeFaceUvQuality([8, 4], [0, 0, 8, 8]);
    expect(distorted.state).toBe("measured");
    if (distorted.state !== "measured") throw new Error("expected measured UV");
    expect(distorted.aspect_ratio_scale_error).toBeGreaterThan(
      UV_FACE_ASPECT_REVIEW_FACTOR
    );
    expect(distorted.aspect_state).toBe("review_required");
  });

  test("UV diagnostics expose density spread without turning it into a visual score", () => {
    expect(summarizeUvDensity([1, 1, 1])).toMatchObject({
      state: "consistent",
      min: 1,
      median: 1,
      max: 1,
      spread_factor: 1,
    });

    const inconsistent = summarizeUvDensity([
      1,
      UV_CUBE_DENSITY_SPREAD_REVIEW_FACTOR * 2,
    ]);
    expect(inconsistent.state).toBe("review_required");
    expect(inconsistent.spread_factor).toBeGreaterThan(
      UV_CUBE_DENSITY_SPREAD_REVIEW_FACTOR
    );

    expect(summarizeFaceUvQuality([8, 4], [0, 0, 0, 8]).state).toBe(
      "degenerate"
    );
  });
});
