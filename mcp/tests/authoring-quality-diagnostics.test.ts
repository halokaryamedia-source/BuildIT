import { describe, expect, test } from "bun:test";
import {
  analyzeOrientedBoxSurfaceQuality,
  SURFACE_COPLANAR_EDGE_GAP_REVIEW_DISTANCE,
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

  test("coplanar diagnostics require overlapping face regions instead of plane coincidence alone", () => {
    const base = box([0, 0, 0]);
    const samePlaneButDisjoint: OrientedBox = {
      ...box([0.5, 3, 0]),
      halfSizes: [0.5, 0.75, 0.75],
    };

    expect(
      analyzeOrientedBoxSurfaceQuality(base, samePlaneButDisjoint).some(
        (risk) => risk.kind === "coplanar_overlap"
      )
    ).toBe(false);
  });

  test("coplanar edge-gap diagnostics catch local panel holes without treating diagonal separation as adjacency", () => {
    const base = box([0, 0, 0]);

    const edgeGap = analyzeOrientedBoxSurfaceQuality(base, box([0, 2.5, 0]));
    const edgeGapRisk = edgeGap.find(
      (risk) => risk.kind === "coplanar_edge_gap"
    );
    expect(edgeGapRisk).toMatchObject({
      kind: "coplanar_edge_gap",
      distance: 0.5,
      shared_span: 2,
    });

    expect(
      analyzeOrientedBoxSurfaceQuality(base, box([0, 2, 0])).some(
        (risk) => risk.kind === "coplanar_edge_gap"
      )
    ).toBe(false);
    expect(
      analyzeOrientedBoxSurfaceQuality(base, box([3, 3, 0])).some(
        (risk) => risk.kind === "coplanar_edge_gap"
      )
    ).toBe(false);
    expect(
      analyzeOrientedBoxSurfaceQuality(
        base,
        box([0, 2 + SURFACE_COPLANAR_EDGE_GAP_REVIEW_DISTANCE * 2, 0])
      ).some((risk) => risk.kind === "coplanar_edge_gap")
    ).toBe(false);
  });

  test("a complete third-Cube cover clears a non-adjacent pair without changing the pair", () => {
    const lower = box([0, 0, 0]);
    const upper = box([0, 2.5, 0]);
    const bridge: OrientedBox = { ...box([0, 1.25, 0]), halfSizes: [1, 0.25, 1] };
    const hasGap = (a: OrientedBox, b: OrientedBox, cover: OrientedBox[]) =>
      analyzeOrientedBoxSurfaceQuality(a, b, cover).some((risk) => risk.kind === "coplanar_edge_gap");

    expect(hasGap(lower, upper, [])).toBe(true);
    expect(hasGap(lower, upper, [lower, upper, bridge])).toBe(false);
    expect(hasGap(upper, lower, [bridge, upper, lower])).toBe(false);
    expect(hasGap(lower, upper, [lower, upper])).toBe(true);
  });

  test("tiled strip coverage must be complete; partial or recessed cover keeps the gap", () => {
    const lower = box([0, 0, 0]);
    const upper = box([0, 2.5, 0]);
    const left: OrientedBox = { ...box([-0.5, 1.25, 0]), halfSizes: [0.5, 0.25, 1] };
    const right: OrientedBox = { ...box([0.5, 1.25, 0]), halfSizes: [0.5, 0.25, 1] };
    const gap = (cover: OrientedBox[]) =>
      analyzeOrientedBoxSurfaceQuality(lower, upper, cover).some((risk) => risk.kind === "coplanar_edge_gap");

    expect(gap([left])).toBe(true);
    expect(gap([left, right])).toBe(false);
    expect(gap([right, left])).toBe(false);
    expect(gap([{ ...right, center: [0.51, 1.25, 0], halfSizes: [0.49, 0.25, 1] }, left])).toBe(true);
    expect(gap([{ ...box([0, 1.25, 0]), halfSizes: [0.75, 0.25, 0.75] }])).toBe(true);
  });

  test("coverage respects shared rotation and never uses a skew face's projected rectangle as cover", () => {
    const lower = box([0, 0, 0]);
    const upper = box([0, 2.5, 0]);
    const bridge: OrientedBox = { ...box([0, 1.25, 0]), halfSizes: [1, 0.25, 1] };
    const c = Math.cos(Math.PI / 4);
    const s = Math.sin(Math.PI / 4);
    const rotateVector = ([x, y, z]: [number, number, number]): [number, number, number] =>
      [c * x - s * y, s * x + c * y, z];
    const rotate = (value: OrientedBox): OrientedBox => ({
      ...value,
      center: rotateVector(value.center),
      axes: value.axes.map(rotateVector) as OrientedBox["axes"],
    });
    const rotated = [lower, upper, bridge].map(rotate);
    expect(analyzeOrientedBoxSurfaceQuality(rotated[0], rotated[1], rotated)
      .some((risk) => risk.kind === "coplanar_edge_gap")).toBe(false);
    expect(analyzeOrientedBoxSurfaceQuality(rotated[0], rotated[1])
      .some((risk) => risk.kind === "coplanar_edge_gap")).toBe(true);

    const skew: OrientedBox = {
      ...bridge,
      axes: rotate(bridge).axes,
      halfSizes: [1, 1, 1],
    };
    expect(analyzeOrientedBoxSurfaceQuality(lower, upper, [skew])
      .some((risk) => risk.kind === "coplanar_edge_gap")).toBe(true);
  });

  test("shared edge span is the actual interval intersection, not penetration depth", () => {
    const wide: OrientedBox = { ...box([0, 0, 0]), halfSizes: [4, 1, 1] };
    const upper = box([0, 2.5, 0]);
    expect(analyzeOrientedBoxSurfaceQuality(wide, upper)
      .find((risk) => risk.kind === "coplanar_edge_gap")).toMatchObject({
        kind: "coplanar_edge_gap", distance: 0.5, shared_span: 2,
      });
  });

  test("UV aspect diagnostics follow actual 0/90/180/270 rotation, not a hypothetical best fit", () => {
    for (const rotation of [0, 180]) {
      expect(summarizeFaceUvQuality([8, 4], [0, 0, 16, 8], rotation)).toMatchObject({
        state: "measured", best_aspect_alignment: "direct", aspect_ratio_scale_error: 1, aspect_state: "matched",
      });
      expect(summarizeFaceUvQuality([8, 4], [0, 0, 4, 8], rotation)).toMatchObject({
        state: "measured", aspect_ratio_scale_error: 4, aspect_state: "review_required",
      });
    }
    for (const rotation of [90, 270]) {
      expect(summarizeFaceUvQuality([8, 4], [0, 0, 4, 8], rotation)).toMatchObject({
        state: "measured", best_aspect_alignment: "rotated_90", aspect_ratio_scale_error: 1, aspect_state: "matched",
      });
      expect(summarizeFaceUvQuality([8, 4], [0, 0, 8, 4], rotation)).toMatchObject({
        state: "measured", aspect_ratio_scale_error: 4, aspect_state: "review_required",
      });
    }
    const distorted = summarizeFaceUvQuality([8, 4], [0, 0, 8, 8]);
    expect(distorted.state).toBe("measured");
    if (distorted.state !== "measured") throw new Error("expected measured UV");
    expect(distorted.aspect_ratio_scale_error).toBeGreaterThan(UV_FACE_ASPECT_REVIEW_FACTOR);
    expect(distorted.aspect_state).toBe("review_required");
    expect(summarizeFaceUvQuality([8, 4], [0, 0, 4, 8], 45).state).toBe("degenerate");
  });

  test("pixel-axis metrics reveal anisotropy and correctly account for non-square physical scaling", () => {
    expect(summarizeFaceUvQuality([8, 4], [0, 0, 8, 4], 0, [2, 1])).toMatchObject({
      state: "measured", aspect_space: "physical_pixels", aspect_state: "review_required",
      physical_pixels_per_model_unit_axes: { width: 2, height: 1 },
    });
    expect(summarizeFaceUvQuality([8, 4], [0, 0, 4, 8], 90, [2, 1])).toMatchObject({
      state: "measured", aspect_state: "review_required",
      physical_pixels_per_model_unit_axes: { width: 1, height: 2 },
    });
    expect(summarizeFaceUvQuality([8, 4], [0, 0, 8, 8], 0, [2, 1])).toMatchObject({
      state: "measured", aspect_state: "matched",
      physical_pixels_per_model_unit_axes: { width: 2, height: 2 },
    });
    expect(summarizeFaceUvQuality([8, 4], [8, 4, 0, 0], 0, [2, 2])).toMatchObject({
      state: "measured", aspect_state: "matched",
      physical_pixels_per_model_unit_axes: { width: 2, height: 2 },
    });
    expect(summarizeFaceUvQuality([8, 4], [0, 0, 8, 4], 0, [Infinity, 1]).state).toBe("degenerate");
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
