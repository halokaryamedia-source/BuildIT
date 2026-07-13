import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  maskBounds,
  projectElementsGeometry,
  type CoordinateEnvelope,
} from "../src/lib/geometryProjection";

const read = (path: string) => readFileSync(path, "utf8");
const envelope: CoordinateEnvelope = {
  x_min: -8,
  x_max: 8,
  y_min: 0,
  y_max: 24,
  z_min: -12,
  z_max: 12,
};

describe("asymmetric Geometry review support", () => {
  test("projects a distinct right-side silhouette on the same approved frame", () => {
    const elements = [
      {
        name: "body",
        uuid: "body",
        from: [-4, 0, -6],
        to: [4, 16, 6],
        origin: [0, 0, 0],
        rotation: [0, 0, 0],
        parent: "root",
      },
      {
        name: "left_satchel",
        uuid: "left_satchel",
        from: [-7, 5, -2],
        to: [-4, 11, 3],
        origin: [0, 0, 0],
        rotation: [0, 0, 0],
        parent: "root",
      },
    ];
    const common = {
      envelope,
      front_axis: "-z" as const,
      width: 128,
      height: 128,
      margin: 8,
    };
    const left = projectElementsGeometry(elements, { ...common, view: "left_side" });
    const right = projectElementsGeometry(elements, { ...common, view: "right_side" });
    expect(left.frame.scale).toBeCloseTo(right.frame.scale, 8);
    expect(right.frame.view).toBe("right_side");
    expect(maskBounds(right.mask)).not.toBeNull();
    expect(right.cube_count).toBe(2);
  });

  test("requires right-side evidence only for asymmetric manifests", () => {
    const gate = read("src/server/tools/geometry-review-gate.ts");
    const studio = read("../engines/chatgpt/skills/blockbench-reference-studio/SKILL.md");
    expect(gate).toContain('symmetry_policy');
    expect(gate).toContain('"right_side"');
    expect(gate).toContain('geometry_right.png');
    expect(studio).toContain('Right Side when `symmetry_policy` is `ASYMMETRIC`');
  });
});
