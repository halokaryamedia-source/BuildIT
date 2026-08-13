import { describe, expect, test } from "bun:test";
import { cubeSchema } from "@/lib/zodObjects";
import {
  modifyCubeParameters,
  modifyCubesBatchParameters,
  placeCubeParameters,
} from "@/server/tools/cubes";
import { requireFiniteTranslatedElementVector3 } from "@/server/tools/element";
import {
  inspectElementParameters,
  requireFiniteInspectableVector3,
} from "@/server/tools/element-inspection";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — correction accuracy", () => {
  test("single-Cube mutation rejects id-only correction requests", () => {
    expect(modifyCubeParameters.safeParse({ id: "cube-uuid" }).success).toBe(false);
    expect(
      modifyCubeParameters.safeParse({
        id: "cube-uuid",
        from: [0, 0, 0],
      }).success
    ).toBe(true);
  });

  test("Cube identity and face inputs remain deterministic", () => {
    expect(cubeSchema.safeParse({ name: "body" }).success).toBe(true);
    expect(cubeSchema.safeParse({ name: "" }).success).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [
          {
            name: "body",
            from: [0, 0, 0],
            to: [4, 8, 4],
          },
        ],
        faces: [{ face: "north", uv: [0, 0, 4, 8] }],
      }).success
    ).toBe(true);
    expect(
      placeCubeParameters.safeParse({
        elements: [
          {
            name: "body",
            from: [0, 0, 0],
            to: [4, 8, 4],
          },
        ],
        faces: [
          { face: "north", uv: [0, 0, 4, 8] },
          { face: "north", uv: [0, 0, 4, 8] },
        ],
      }).success
    ).toBe(false);
  });

  test("place_cube does not expose generic per-Cube texture selection or ambient face routing", async () => {
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
    expect(() =>
      requireFiniteInspectableVector3([0, Number.NaN, 2], "fixture")
    ).toThrow();
  });

  test("batch Cube correction rejects duplicate/unsupported inputs at schema boundary", () => {
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [
          { id: "a", from: [0, 0, 0] },
          { id: "a", to: [1, 1, 1] },
        ],
      }).success
    ).toBe(false);
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [
          { id: "a", uv_offset: [8, 16], autouv: "0", mirror_uv: true },
        ],
      }).success
    ).toBe(true);
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [{ id: "a", name: "renamed" }],
      }).success
    ).toBe(false);
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
    expect(() =>
      requireFiniteTranslatedElementVector3(
        [Number.MAX_VALUE, 0, 0],
        [Number.MAX_VALUE, 0, 0],
        "fixture"
      )
    ).toThrow();
  });

  test("Cube correction results expose before/after structural effects", async () => {
    const cubes = await source("server/tools/cubes.ts");
    expect(cubes).toContain("geometry_effect");
    expect(cubes).toContain("center_delta");
    expect(cubes).toContain("size_delta");
    expect(cubes).toContain("rotation_delta");
    expect(cubes).toContain("visual_verdict: \"not_evaluated\"");
  });

  test("modelling workflow requires an invariant before numeric correction", async () => {
    const geometry = await source("../docs/foundation/05-geometry-standard.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [geometry, modelling, workflow]) {
      expect(text.toLowerCase()).toContain("invariant");
      expect(text).toContain("geometry_effect");
      expect(text).toContain("TRANSLATE");
      expect(text).toContain("RESIZE");
      expect(text).toContain("ROTATE");
    }
    expect(modelling).toContain("An unintended center shift");
    expect(workflow).toContain("hierarchy REATTACH");
    expect(workflow).toContain("`BLOCKED`");
    expect(modelling.toLowerCase()).toContain(
      "reuse fresh exact authored state already returned for that target when sufficient"
    );
    expect(workflow.toLowerCase()).toContain(
      "reuse fresh exact authored state already returned for that target when sufficient"
    );
    expect(workflow).not.toContain(
      "`inspect_element` before numeric correction and use the authored state it returns"
    );
  });
});
