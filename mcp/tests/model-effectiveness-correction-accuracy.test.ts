import { describe, expect, test } from "bun:test";
import { modifyCubeParameters, modifyCubesBatchParameters, placeCubeParameters } from "@/server/tools/cubes";
import { requireFiniteInspectableVector3 } from "@/server/tools/element-inspection";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — correction accuracy", () => {
  test("single-Cube mutation rejects id-only correction requests", () => {
    expect(() => modifyCubeParameters.parse({ id: "cube-1" })).toThrow();
    expect(
      modifyCubeParameters.parse({ id: "cube-1", from: [0, 0, 0] }).from
    ).toEqual([0, 0, 0]);
    expect(() =>
      modifyCubeParameters.parse({ id: "cube-1", to: [Infinity, 1, 1] })
    ).toThrow();
    expect(modifyCubeParameters.safeParse({ id: "cube-1", uv_offset: [0, Infinity] }).success).toBe(false);
    expect(modifyCubeParameters.safeParse({ id: "cube-1", inflate: Infinity }).success).toBe(false);
    expect(modifyCubeParameters.safeParse({ id: "cube-1", uv_offset: [4, 8] }).success).toBe(true);
    expect(modifyCubeParameters.safeParse({ id: "cube-1", inflate: 0.25 }).success).toBe(true);
    expect(modifyCubeParameters.safeParse({ id: "cube-1", shade: false }).success).toBe(false);
    expect(modifyCubeParameters.safeParse({ id: "cube-1", color: 2 }).success).toBe(false);
  });

  test("Cube identity and face inputs remain deterministic", () => {
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "", from: [0, 0, 0], to: [1, 1, 1] }],
      }).success
    ).toBe(false);
    expect(modifyCubeParameters.safeParse({ id: "cube", name: "" }).success).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        texture: "legacy-per-cube-texture",
      }).success
    ).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: false,
      }).success
    ).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: ["north"],
      }).success
    ).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: [],
      }).success
    ).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: ["north", "north"],
      }).success
    ).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: [
          { face: "north", uv: [0, 0, 1, 1] },
          { face: "north", uv: [1, 1, 2, 2] },
        ],
      }).success
    ).toBe(false);
  });

  test("place_cube does not expose generic per-Cube texture selection or ambient face routing", async () => {
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: [{ face: "north", uv: [0, 0, 1, 1] }],
      }).success
    ).toBe(true);
    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "cube", from: [0, 0, 0], to: [1, 1, 1] }],
        faces: [{ face: "north", uv: [0, 0, Infinity, 1] }],
      }).success
    ).toBe(false);

    const cubes = await source("server/tools/cubes.ts");
    const start = cubes.indexOf("createTool(cubeToolDocs[0].name");
    const end = cubes.indexOf("createTool(cubeToolDocs[1].name", start);
    const block = cubes.slice(start, end);
    expect(block).toContain("...(customFaceUvs ? { box_uv: false } : {})");
    expect(block).toContain("cube.mapAutoUV()");
    expect(block).not.toContain("cube.applyTexture(");
    expect(cubes).not.toContain("resolvePlacementTexture");
    expect(cubes).not.toContain("resolveCoreTexture");
  });
  test("focused element inspection refuses non-finite transform evidence", () => {
    expect(requireFiniteInspectableVector3([1, 2, 3], "test")).toEqual([1, 2, 3]);
    expect(() => requireFiniteInspectableVector3([Infinity, 0, 0], "test")).toThrow("non-finite authored transform");
    expect(() => requireFiniteInspectableVector3([0, 0], "test")).toThrow("non-finite authored transform");
  });
  test("batch Cube correction rejects duplicate/unsupported inputs at schema boundary", () => {
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [
          { id: "cube-1", from: [0, 0, 0] },
          { id: "cube-1", to: [1, 1, 1] },
        ],
      }).success
    ).toBe(false);
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [{ id: "cube-1", from: [0, 0, 0], name: "unsupported" }],
      }).success
    ).toBe(false);
    expect(
      modifyCubesBatchParameters.safeParse({
        updates: [{ id: "cube-1", visibility: false }],
        extra: true,
      }).success
    ).toBe(false);
  });
  test("Cube authoring rejects finite endpoints that produce non-finite size", () => {
    expect(() =>
      placeCubeParameters.parse({
        elements: [{ name: "overflow", from: [-1e308, 0, 0], to: [1e308, 1, 1] }],
      })
    ).toThrow();
    expect(() =>
      modifyCubeParameters.parse({
        id: "cube-1",
        from: [-1e308, 0, 0],
        to: [1e308, 1, 1],
      })
    ).toThrow();
  });
  test("Cube correction results expose before/after structural effects", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const inspection = await source("server/tools/element-inspection.ts");

    expect(cubes).toContain("geometry_effect: geometryEffect");
    expect(cubes).toContain("center_delta");
    expect(cubes).toContain("size_delta");
    expect(cubes).toContain("origin_delta");
    expect(cubes).toContain("rotation_delta");
    expect(cubes).toContain("inflate_delta");
    expect(cubes).toContain("uv_offset_delta");
    expect(cubes).toContain("mirror_uv_changed");
    expect(cubes).toContain("autouv_changed");
    expect(cubes).toContain("modifyCubeRequestWouldChange");
    const batchRuntimeStart = cubes.indexOf("createTool(cubeToolDocs[2].name");
    const batchRuntime = cubes.slice(batchRuntimeStart);
    expect(batchRuntime).toContain("!modifyCubeRequestWouldChange(cube, update)");
    expect(batchRuntime).toContain("Batch update for Cube");
    expect(batchRuntime.indexOf("!modifyCubeRequestWouldChange(cube, update)")).toBeLessThan(batchRuntime.indexOf("Undo.initEdit"));
    expect(cubes).toContain("has no authored effect");
    expect(cubes).toContain("effective_geometry_targets");
    expect(cubes).not.toContain('Undo.finishEdit("Agent corrected multiple cubes")');
    const modifyStart = cubes.indexOf("export const modifyCubeParameters");
    const batchStart = cubes.indexOf("export const modifyCubesBatchParameters", modifyStart);
    const modifySchema = cubes.slice(modifyStart, batchStart);
    expect(modifySchema).toContain("uv_offset: finiteVec2Schema");
    expect(modifySchema).toContain("inflate: z.number().finite()");
    expect(modifySchema).toContain("}).strict().refine(");
    expect(modifySchema).not.toContain("shade:");
    expect(modifySchema).not.toContain("color:");
    expect(inspection).toContain("center: [");
    expect(cubes).toContain("requireFiniteCubeSpan(");
    expect(cubes).toContain("state.from[0] + state.size[0] / 2");
    expect(inspection).toContain("cube.from[0] + size[0] / 2");
    expect(inspection).toContain("non-finite derived size");
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
  });

  test("correction safeguards remain active as problem-driven work advances", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("correction accuracy");
    expect(next).toContain("tool-choice / context friction");
    expect(next).not.toContain(
      "The next bounded modelling problem is:\n\n```text\nP1 — correction accuracy"
    );
  });
});
