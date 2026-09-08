import { describe, expect, test } from "bun:test";
import {
  analyzeTextureCoverage,
  analyzeTextureOptimizationOpportunities,
} from "@/lib/textureOptimization";
import { analyzeAnimationQuality } from "@/lib/animationQuality";

function rgba(values: number[]): Uint8ClampedArray {
  return new Uint8ClampedArray(values.flatMap((value) => [value, 0, 0, 255]));
}

function borderedPatch(size: number): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const offset = (y * size + x) * 4;
      const border = x === 0 || y === 0 || x === size - 1 || y === size - 1;
      const value = border ? 96 : 100;
      pixels.set([value, 0, 0, 255], offset);
    }
  }
  return pixels;
}

describe("usage-efficient authoring intelligence", () => {
  test("detects pixel-identical UV regions across rotation without requiring pairwise tool calls", () => {
    const result = analyzeTextureOptimizationOpportunities([
      {
        cube_uuid: "cube-a",
        cube_name: "panel_a",
        face: "north",
        texture_uuid: "texture",
        texture_name: "atlas",
        uv: [0, 0, 2, 3],
        width: 2,
        height: 3,
        pixels: rgba([1, 2, 3, 4, 5, 6]),
      },
      {
        cube_uuid: "cube-b",
        cube_name: "panel_b",
        face: "north",
        texture_uuid: "texture",
        texture_name: "atlas",
        uv: [2, 0, 5, 2],
        width: 3,
        height: 2,
        pixels: rgba([5, 3, 1, 6, 4, 2]),
      },
    ]);

    expect(result.state).toBe("available");
    expect(result.uv_stack_opportunities.group_count).toBe(1);
    expect(result.uv_stack_opportunities.examples[0].face_count).toBe(2);
    expect(result.uv_stack_opportunities.examples[0].distinct_uv_region_count).toBe(2);
  });

  test("does not report already-shared UV coordinates as a new stack opportunity", () => {
    const pixels = rgba([1, 2, 3, 4]);
    const result = analyzeTextureOptimizationOpportunities([
      {
        cube_uuid: "cube-a",
        cube_name: "a",
        face: "north",
        texture_uuid: "texture",
        texture_name: "atlas",
        uv: [0, 0, 2, 2],
        width: 2,
        height: 2,
        pixels,
      },
      {
        cube_uuid: "cube-b",
        cube_name: "b",
        face: "south",
        texture_uuid: "texture",
        texture_name: "atlas",
        uv: [0, 0, 2, 2],
        width: 2,
        height: 2,
        pixels,
      },
    ]);

    expect(result.uv_stack_opportunities.group_count).toBe(0);
  });

  test("transparent and solid face candidates share the same bounded scan with coverage", () => {
    const result = analyzeTextureOptimizationOpportunities(
      [
        {
          cube_uuid: "transparent",
          cube_name: "transparent",
          face: "north",
          texture_uuid: "texture",
          texture_name: "atlas",
          uv: [0, 0, 2, 2],
          width: 2,
          height: 2,
          pixels: new Uint8ClampedArray(2 * 2 * 4),
        },
        {
          cube_uuid: "solid",
          cube_name: "solid",
          face: "north",
          texture_uuid: "texture",
          texture_name: "atlas",
          uv: [2, 0, 6, 4],
          width: 4,
          height: 4,
          pixels: new Uint8ClampedArray(
            Array.from({ length: 16 }, () => [64, 32, 16, 255]).flat()
          ),
        },
      ],
      [
        {
          kind: "budget",
          cube_uuid: "omitted",
          cube_name: "omitted",
          face: "north",
        },
      ]
    );

    expect(result.state).toBe("partial");
    expect(result.transparent_faces.count).toBe(1);
    expect(result.solid_color_faces.count).toBe(1);
    expect(result.scan.omission_counts.budget).toBe(1);
    expect(result.coverage.gate.state).toBe("partial");
    expect(result.coverage.gate.reasons).toContain("SCAN_BUDGET_EXHAUSTED");
    expect(result.coverage.gate.reasons).toContain("TRANSPARENT_FACE_REVIEW");
    expect(result.coverage.gate.reasons).toContain("FLAT_FACE_REVIEW");
    expect(result.coverage.review.transparent_face_count).toBe(1);
    expect(result.coverage.review.detail_capable_solid_face_count).toBe(1);
    expect(result.efficiency.pixel_scan_reused_for_coverage).toBe(true);
  });

  test("coverage catches template-like border-only faces and blocks incomplete accounting", () => {
    const coverage = analyzeTextureCoverage(
      [
        {
          cube_uuid: "template-like",
          cube_name: "template_like_panel",
          face: "north",
          texture_uuid: "texture",
          texture_name: "atlas",
          uv: [0, 0, 8, 8],
          width: 8,
          height: 8,
          pixels: borderedPatch(8),
        },
      ],
      [
        {
          kind: "blank",
          cube_uuid: "missing",
          cube_name: "missing_panel",
          face: "south",
        },
      ]
    );

    expect(coverage.states.low_variation).toBe(1);
    expect(coverage.review.low_variation_faces.count).toBe(1);
    expect(coverage.review.low_variation_faces.examples[0].border_only_variation).toBe(true);
    expect(coverage.gate.state).toBe("incomplete");
    expect(coverage.gate.reasons).toContain("FACE_ACCOUNTING_INCOMPLETE");
    expect(coverage.omissions.counts.blank).toBe(1);
  });

  test("coverage becomes ready for visual verification when every scanned face has interior variation", () => {
    const coverage = analyzeTextureCoverage([
      {
        cube_uuid: "styled",
        cube_name: "styled_panel",
        face: "north",
        texture_uuid: "texture",
        texture_name: "atlas",
        uv: [0, 0, 4, 4],
        width: 4,
        height: 4,
        pixels: rgba([
          10, 20, 30, 40,
          50, 60, 70, 80,
          90, 100, 110, 120,
          130, 140, 150, 160,
        ]),
      },
    ]);

    expect(coverage.gate.state).toBe("ready");
    expect(coverage.states.styled).toBe(1);
    expect(coverage.review.candidate_face_count).toBe(0);
    expect(coverage.accounted_ratio).toBe(1);
  });

  test("loop diagnostics flag non-root seam discontinuity but preserve root locomotion", () => {
    const result = analyzeAnimationQuality({
      loop_mode: "loop",
      length: 1,
      tracks: [
        {
          group_uuid: "root",
          group_name: "root",
          is_root: true,
          channel: "position",
          keyframes: [
            { time: 0, value: [0, 0, 0] },
            { time: 1, value: [16, 0, 0] },
          ],
        },
        {
          group_uuid: "arm",
          group_name: "arm",
          is_root: false,
          channel: "rotation",
          keyframes: [
            { time: 0, value: [0, 0, 0] },
            { time: 1, value: [5, 0, 0] },
          ],
        },
      ],
    });

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected animation quality");
    expect(result.loop_seam.review_track_count).toBe(1);
    expect(result.loop_seam.examples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ classification: "root_locomotion_observation" }),
        expect.objectContaining({ group_uuid: "arm", classification: "seam_review" }),
      ])
    );
  });

  test("cadence diagnostics remain advisory and do not invent a failure", () => {
    const result = analyzeAnimationQuality({
      loop_mode: "once",
      length: 2,
      tracks: [
        {
          group_uuid: "arm",
          group_name: "arm",
          is_root: false,
          channel: "rotation",
          keyframes: [
            { time: 0, value: [0, 0, 0] },
            { time: 0.05, value: [1, 0, 0] },
            { time: 2, value: [2, 0, 0] },
          ],
        },
      ],
    });

    expect(result.state).toBe("available");
    if (result.state !== "available") throw new Error("expected animation quality");
    expect(result.loop_seam.applicable).toBe(false);
    expect(result.loop_seam.review_track_count).toBe(0);
    expect(result.cadence.high_variability_track_count).toBe(1);
  });
});
