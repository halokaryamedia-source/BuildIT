import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  anchorPointFromBounds,
  inverseParentRotationVector,
} from "../src/server/tools/geometry-direct-transform";
import { resolveCubeWorldGeometry } from "../src/lib/renderedGeometry";

const read = (path: string) => readFileSync(path, "utf8");
const json = (path: string) => JSON.parse(read(path)) as Record<string, any>;

function expectVecClose(actual: number[], expected: number[]) {
  expect(actual).toHaveLength(expected.length);
  for (let index = 0; index < expected.length; index += 1) {
    expect(actual[index]).toBeCloseTo(expected[index], 6);
  }
}

describe("Reference-driven direct cuboid transforms", () => {
  test("derives explicit pivots from local cube bounds", () => {
    expect(
      anchorPointFromBounds(
        [-4, 2, -8],
        [6, 10, 4],
        ["min", "center", "max"]
      )
    ).toEqual([-4, 6, 4]);
  });

  test("converts world translation through inverse parent rotations", () => {
    const local = inverseParentRotationVector(
      [0, 0, -2],
      [[0, 90, 0]]
    );
    expectVecClose(local, [2, 0, 0]);
  });

  test("provides a deterministic world-transform fallback outside Blockbench", () => {
    const resolved = resolveCubeWorldGeometry({
      uuid: "cube",
      from: [0, 0, 0],
      to: [2, 4, 2],
      origin: [0, 0, 0],
      rotation: [0, 0, 0],
      parent: "root",
    });
    expect(resolved.source).toBe("manual_transform");
    expect(resolved.corners).toHaveLength(8);
    expect(resolved.pivot).toEqual([0, 0, 0]);
  });

  test("registers one batch tool in the Geometry profile and docs manifest", () => {
    const tools = read("src/server/tools.ts");
    const docs = read("scripts/docs-manifest.ts");
    const profiles = json("../engines/shared/profiles/tool-profiles.json");
    expect(tools).toContain("registerGeometryDirectTransformTools");
    expect(docs).toContain("geometryDirectTransformToolDocs");
    expect(
      profiles.profiles.BEDROCK_CUBOID_GEOMETRY.allowed_tools
    ).toContain("apply_cube_transforms");
  });

  test("uses one rendered transform authority and one optional analysis pass", () => {
    const source = read("src/server/tools/geometry-direct-transform.ts");
    const rendered = read("src/lib/renderedGeometry.ts");
    for (const marker of [
      "mesh.matrixWorld",
      "parent.worldToLocal",
      "resolveCubeWorldAnchor",
      "resolveCubeWorldGeometry",
    ]) {
      expect(rendered).toContain(marker);
    }
    for (const marker of [
      "rendered_pivot_world",
      "DIRECT_TRANSFORM_CONNECTION_REJECTED",
      "analyze_geometry_views",
      "visual_analysis_required_before_review",
      "manifest_rotation_contract_required: false",
      'assertGeometryMutationPhase(\n          "rotate_cube_about_attachment"',
    ]) {
      expect(source).toContain(marker);
    }
  });

  test("keeps direct transforms bounded and undoable", () => {
    const source = read("src/server/tools/geometry-direct-transform.ts");
    expect(source).toContain("z.array(transformSpec).min(1).max(32)");
    expect(source).toContain("Undo.initEdit");
    expect(source).toContain("Undo.finishEdit");
    expect(source).toContain("Undo.cancelEdit");
    expect(source).toContain("DIRECT_TRANSFORM_DUPLICATE_CUBE_IN_BATCH");
  });
});
