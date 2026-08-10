import { describe, expect, test } from "bun:test";
import { modifyCubeParameters } from "@/server/tools/cubes";

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
  });

  test("Cube correction results expose before/after structural effects", async () => {
    const cubes = await source("server/tools/cubes.ts");
    const inspection = await source("server/tools/element-inspection.ts");

    expect(cubes).toContain("geometry_effect: geometryEffect");
    expect(cubes).toContain("center_delta");
    expect(cubes).toContain("size_delta");
    expect(cubes).toContain("origin_delta");
    expect(cubes).toContain("rotation_delta");
    expect(cubes).toContain("effective_geometry_targets");
    expect(cubes).not.toContain('Undo.finishEdit("Agent corrected multiple cubes")');
    expect(inspection).toContain("center: [");
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

  test("next work remains problem-driven after correction accuracy", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain(
      "MCP_MODEL_EFFECTIVENESS_CORRECTION_ACCURACY_HARDENING_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED"
    );
    expect(next).toContain("P1 — tool-choice / context friction");
  });
});
