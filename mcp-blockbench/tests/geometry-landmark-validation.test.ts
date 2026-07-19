import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { evaluateGeometryLandmarks } from "../src/server/geometry-landmark-validation-guard";

const previousCube = (globalThis as any).Cube;
const previousCanvas = (globalThis as any).Canvas;

afterEach(() => {
  (globalThis as any).Cube = previousCube;
  (globalThis as any).Canvas = previousCanvas;
});

function cube(name: string, from: number[], to: number[]) {
  return {
    uuid: `${name}-uuid`,
    name,
    from,
    to,
    origin: [0, 0, 0],
    rotation: [0, 0, 0],
    inflate: 0,
    parent: "root",
  };
}

describe("semantic Geometry landmark validation", () => {
  test("passes a rendered/manual anchor connection within tolerance", () => {
    (globalThis as any).Canvas = { meshes: {} };
    (globalThis as any).Cube = {
      all: [
        cube("neck", [0, 0, 0], [4, 4, 4]),
        cube("head", [4, 0, 0], [8, 4, 4]),
      ],
    };
    const [result] = evaluateGeometryLandmarks([
      {
        id: "neck_head_joint",
        cube_patterns: ["neck"],
        anchor: ["max", "center", "center"],
        target_patterns: ["head"],
        target_anchor: ["min", "center", "center"],
        maximum_distance_units: 0.1,
      },
    ]);
    expect(result.status).toBe("PASS");
    expect(result.distance_units).toBeCloseTo(0, 6);
    expect(result.issues).toEqual([]);
  });

  test("rejects missing required landmarks and visible connection gaps", () => {
    (globalThis as any).Canvas = { meshes: {} };
    (globalThis as any).Cube = {
      all: [
        cube("neck", [0, 0, 0], [4, 4, 4]),
        cube("head", [7, 0, 0], [11, 4, 4]),
      ],
    };
    const results = evaluateGeometryLandmarks([
      {
        id: "neck_head_joint",
        cube_patterns: ["neck"],
        anchor: ["max", "center", "center"],
        target_patterns: ["head"],
        target_anchor: ["min", "center", "center"],
        maximum_distance_units: 0.25,
      },
      {
        id: "horn_tip",
        cube_patterns: ["horn"],
        required: true,
      },
    ]);
    expect(results[0].status).toBe("REVISION_REQUIRED");
    expect(results[0].issues).toContain("LANDMARK_CONNECTION_GAP");
    expect(results[1].issues).toContain("LANDMARK_CUBE_MISSING");
  });

  test("extends existing validation without adding another public tool", () => {
    const source = readFileSync(
      "src/server/geometry-landmark-validation-guard.ts",
      "utf8"
    );
    const tools = readFileSync("src/server/tools.ts", "utf8");
    expect(source).toContain('getAllToolDefinitions()["validate_geometry_contract"]');
    expect(source).toContain("resolveCubeWorldAnchor");
    expect(source).toContain("geometry_report.json");
    expect(source).toContain("semantic_landmarks");
    expect(tools).toContain("installGeometryLandmarkValidationGuard();");
  });
});
