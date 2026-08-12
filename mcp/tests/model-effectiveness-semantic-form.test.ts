import { describe, expect, test } from "bun:test";
import { placeCubeParameters } from "@/server/tools/cubes";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — semantic form, rotation, pivot and contact", () => {
  test("historical geometry failures are explicit design inputs rather than fixture rules", async () => {
    const audit = await source("../docs/knowledge/reviews/mcp-geometry-ai-slop-audit.md");
    expect(audit).toContain("G-01");
    expect(audit).toContain("Arbitrary coordinates could be presented as deliberate modelling decisions");
    expect(audit).toContain("G-09");
    expect(audit).toContain("disconnected-looking or oversized cuboids");
    expect(audit).toContain("G-11");
    expect(audit).toContain("visibly sloped neck or tail could still be represented as axis-aligned blocks");
  });

  test("semantic form must exist before exact Cube coordinates", async () => {
    const [modelling, workflow, geometry] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
    ]);

    for (const text of [modelling, workflow]) {
      expect(text).toContain("Semantic Form Contract");
      expect(text).toContain("primary masses + must-exist reason");
      expect(text).toContain("required count / symmetry");
      expect(text).toContain("topology: what attaches to what");
      expect(text).toContain("negative spaces");
      expect(text).toContain("representation: geometry | texture | animation | omit");
      expect(text.toLowerCase()).toContain("semantic label");
      expect(text.toLowerCase()).toContain("coordinates");
    }

    expect(modelling).toContain("No orphan Cube, filler Cube");
    expect(workflow).toContain("no orphan/filler Cube");
    expect(geometry).toContain("Every material Cuboid must have a modelling purpose in the **whole form**");
    expect(geometry).toContain("It is a no-guess reasoning gate");
  });

  test("rotation is an explicit modelling decision instead of zero-rotation default bias", async () => {
    const [modelling, workflow, geometry] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
    ]);

    for (const text of [modelling, workflow]) {
      expect(text).toContain("AXIS_ALIGNED | ROTATED | UNRESOLVED");
      expect(text).toContain("[0,0,0]");
      expect(text.toLowerCase()).toMatch(/visible.*slope|slope.*visible/);
      expect(text).toContain("MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM");
    }
    expect(geometry).toContain("Rotation is justified when");
    expect(geometry.toLowerCase()).toContain("visibly");
    expect(geometry).toContain("orientation/slope");
    expect(geometry).toContain("any non-zero rotation");
    expect(geometry).toContain("explicit origin/pivot required");

    expect(
      placeCubeParameters.safeParse({
        elements: [{ name: "sloped_mass", from: [0, 0, 0], to: [4, 8, 4], rotation: [0, 0, 20] }],
      }).success
    ).toBe(false);
    expect(
      placeCubeParameters.safeParse({
        elements: [{
          name: "sloped_mass",
          from: [0, 0, 0],
          to: [4, 8, 4],
          rotation: [0, 0, 20],
          origin: [2, 0, 2],
        }],
      }).success
    ).toBe(true);
  });

  test("pivot and contact preserve a declared relationship instead of technical touching", async () => {
    const [modelling, workflow, geometry] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/05-geometry-standard.md"),
    ]);

    for (const text of [modelling, workflow]) {
      expect(text).toContain("required attachment");
      expect(text).toContain("contact target/invariant");
      expect(text).toContain("attachment/joint pivot");
      expect(text).toContain("negative spaces");
    }
    expect(modelling).toContain("AABB overlap, hierarchy, or numeric touching is not contact proof");
    const normalizedGeometry = geometry.replace(/\s+/g, " ");
    expect(normalizedGeometry).toContain("AABB overlap or hierarchy alone is not proof");
    expect(geometry).toContain("joint/articulation");
    expect(geometry).toContain("attachment");
  });

  test("semantic hardening stays in modelling judgement instead of adding self-reported MCP fields", async () => {
    const [cubes, profile] = await Promise.all([
      source("server/tools/cubes.ts"),
      source("lib/registrationProfile.ts"),
    ]);
    const start = cubes.indexOf("export const placeCubeParameters");
    const end = cubes.indexOf("export const modifyCubeParameters", start);
    const placeContract = cubes.slice(start, end);

    for (const field of ["semantic_form", "mass_id", "must_exist_reason", "contact_target", "orientation_state", "pivot_role"]) {
      expect(placeContract).not.toContain(field);
    }
    expect(profile).not.toContain("semantic_form");
    expect(profile).not.toContain("orientation_gate");
    expect(profile).not.toContain("geometry_reasoning");
  });
});
