import { describe, expect, test } from "bun:test";
import { cubeSchema } from "@/lib/zodObjects";
import {
  modifyCubeParameters,
  modifyCubesBatchParameters,
  placeCubeParameters,
} from "@/server/tools/cubes";
import { requireFiniteTranslatedElementVector3 } from "@/server/tools/element";
import { inspectElementParameters, requireFiniteInspectableVector3 } from "@/server/tools/element-inspection";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — correction accuracy", () => {
  test("single-Cube mutation rejects id-only correction requests", () => {
    expect(modifyCubeParameters.safeParse({ id: "cube-uuid" }).success).toBe(false);
    expect(modifyCubeParameters.safeParse({ id: "cube-uuid", from: [0, 0, 0] }).success).toBe(true);
  });

  test("Cube identity and face inputs remain deterministic", () => {
    expect(cubeSchema.safeParse({ name: "body" }).success).toBe(true);
    expect(cubeSchema.safeParse({ name: "" }).success).toBe(false);
    expect(placeCubeParameters.safeParse({
      elements: [{ name: "body", from: [0, 0, 0], to: [4, 8, 4] }],
      faces: [{ face: "north", uv: [0, 0, 4, 8] }],
    }).success).toBe(true);
    expect(placeCubeParameters.safeParse({
      elements: [{ name: "body", from: [0, 0, 0], to: [4, 8, 4] }],
      faces: [{ face: "north", uv: [0, 0, 4, 8] }, { face: "north", uv: [0, 0, 4, 8] }],
    }).success).toBe(false);
  });

  test("place_cube does not expose generic per-Cube texture selection", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const start = cubes.indexOf("export const placeCubeParameters");
    const end = cubes.indexOf("export const modifyCubeParameters", start);
    const block = cubes.slice(start, end);
    expect(block).not.toContain("texture:");
    expect(block).not.toContain("applyTo");
    expect(block).toContain("faces:");
  });

  test("focused element inspection refuses non-finite transform evidence", () => {
    expect(inspectElementParameters.safeParse({ id: "cube-uuid" }).success).toBe(true);
    expect(inspectElementParameters.safeParse({ id: "" }).success).toBe(false);
    expect(() => requireFiniteInspectableVector3([0, Number.NaN, 2], "fixture")).toThrow();
  });

  test("batch Cube correction rejects duplicate/unsupported inputs at schema boundary", () => {
    expect(modifyCubesBatchParameters.safeParse({ updates: [{ id: "a", from: [0, 0, 0] }, { id: "a", to: [1, 1, 1] }] }).success).toBe(false);
    expect(modifyCubesBatchParameters.safeParse({ updates: [{ id: "a", uv_offset: [8, 16], autouv: "0", mirror_uv: true }] }).success).toBe(true);
    expect(modifyCubesBatchParameters.safeParse({ updates: [{ id: "a", name: "renamed" }] }).success).toBe(false);
  });

  test("batch Cube correction carries existing Box-UV authored state without a new tool", async () => {
    const cubes = await source("server/tools/cubes.ts");
    expect(cubes).toContain("update.uv_offset");
    expect(cubes).toContain("update.autouv");
    expect(cubes).toContain("update.mirror_uv");
    expect(cubes).toContain("geometryVisibilityFields");
    expect(cubes).not.toContain("professional_uv");
  });

  test("Cube authoring rejects finite endpoints that produce non-finite size", () => {
    expect(() => requireFiniteTranslatedElementVector3([Number.MAX_VALUE, 0, 0], [Number.MAX_VALUE, 0, 0], "fixture")).toThrow();
  });

  test("single-Cube correction returns current authored state plus structural effects", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const effectStart = cubes.indexOf("function cubeGeometryEffect");
    const effectEnd = cubes.indexOf("type ModifyCubeRequest", effectStart);
    const geometryEffect = cubes.slice(effectStart, effectEnd);
    const start = cubes.indexOf("const executeUpdateCube");
    const end = cubes.indexOf("const executeBatchUpdateCubes", start);
    const block = cubes.slice(start, end);
    expect(block).toContain("geometry_effect");
    expect(block).toContain("cubeGeometryEffect(before, after)");
    expect(block).toContain("visual_verdict: \"not_evaluated\"");
    expect(geometryEffect).toContain("center_delta");
    expect(geometryEffect).toContain("size_delta");
    expect(geometryEffect).toContain("rotation_delta");
  });

  test("modelling owner requires a declared invariant before numeric correction", async () => {
    const [geometry, modelling] = await Promise.all([
      source("../docs/foundation/05-geometry-standard.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
    ]);
    for (const text of [geometry, modelling]) {
      expect(text.toLowerCase()).toContain("invariant");
      expect(text).toContain("geometry_effect");
      expect(text).toContain("TRANSLATE");
      expect(text).toContain("RESIZE");
      expect(text).toContain("ROTATE");
    }
    expect(modelling).toContain("State target UUID(s), cause, intended change, invariant");
    expect(modelling).toContain(
      "Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once."
    );
  });
});
