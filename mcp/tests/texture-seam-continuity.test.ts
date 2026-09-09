import { describe, expect, test } from "bun:test";
import {
  analyzeTextureSeamContinuity,
  type TextureSeamEdgeInput,
} from "@/lib/textureSeamContinuity";

function edge(
  overrides: Partial<TextureSeamEdgeInput> = {}
): TextureSeamEdgeInput {
  return {
    cube_uuid: "cube-a",
    cube_name: "Cube A",
    face: "north",
    edge: "right",
    start: [1, 0, 0],
    end: [1, 1, 0],
    samples: [
      [20, 20, 20, 255],
      [20, 20, 20, 255],
      [20, 20, 20, 255],
      [20, 20, 20, 255],
    ],
    ...overrides,
  };
}

describe("texture seam continuity", () => {
  test("reports intra-Cube scope instead of certifying coincident edges on different Cubes", () => {
    const result = analyzeTextureSeamContinuity([
      edge(), edge({ cube_uuid: "cube-b", face: "east", samples: [[255, 255, 255, 255]] }),
    ]);
    expect(result.scope).toBe("intra_cube");
    expect(result.cross_cube_continuity).toBe("not_evaluated");
    expect(result.paired_seam_count).toBe(0);
    expect(result.unpaired_edge_count).toBe(2);
  });
  test("pairs reversed physical edges and ranks strong contrast as advisory review", () => {
    const result = analyzeTextureSeamContinuity([
      edge(),
      edge({
        face: "east",
        edge: "left",
        start: [1, 1, 0],
        end: [1, 0, 0],
        samples: [
          [240, 240, 240, 255],
          [240, 240, 240, 255],
          [240, 240, 240, 255],
          [240, 240, 240, 255],
        ],
      }),
    ]);

    expect(result.paired_seam_count).toBe(1);
    expect(result.review.candidate_count).toBe(1);
    expect(result.gate.state).toBe("advisory");
    expect(result.gate.reasons).toContain("SEAM_CONTINUITY_REVIEW");
    expect(result.review.examples[0].faces.map((item) => item.face)).toEqual([
      "north",
      "east",
    ]);
  });

  test("matching edge pixels do not create a seam review candidate", () => {
    const result = analyzeTextureSeamContinuity([
      edge(),
      edge({
        face: "east",
        edge: "left",
        start: [1, 1, 0],
        end: [1, 0, 0],
      }),
    ]);

    expect(result.paired_seam_count).toBe(1);
    expect(result.review.candidate_count).toBe(0);
    expect(result.gate.reasons).toEqual([]);
  });

  test("unpaired outer edges remain inventory rather than false seam failures", () => {
    const result = analyzeTextureSeamContinuity([edge()]);
    expect(result.paired_seam_count).toBe(0);
    expect(result.unpaired_edge_count).toBe(1);
    expect(result.review.candidate_count).toBe(0);
  });
});
