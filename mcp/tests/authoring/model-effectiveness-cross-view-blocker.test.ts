import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — cross-view and blocker handling", () => {
  test("material 3D claims keep explicit evidence states instead of borrowing confidence across axes", async () => {
    const [schema, modelling, workflow] = await Promise.all([
      source("../docs/02-reference/package/schema.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const state of ["SUPPORTED", "PROVISIONAL", "CONFLICTING", "UNAVAILABLE"]) {
      expect(schema).toContain(state);
      expect(modelling).toContain(state);
    }
    expect(modelling).toContain("Front agreement does not certify depth");
    expect(workflow).toContain("Front PASS is not full 3D PASS");
  });

  test("material cross-view conflicts block instead of being averaged into invented geometry", async () => {
    const [modelling, validation] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/03-authoring/validation/visual.md"),
    ]);

    expect(modelling).toContain("Do not average drift");
    expect(modelling).toContain("Only unresolved material conflict becomes `BLOCKED`");
    expect(validation.toLowerCase()).toContain("conflicting");
    expect(validation).toContain("BLOCKED");
  });

  test("persistent correction failures stop instead of looping", async () => {
    const [root, modelling, workflow] = await Promise.all([
      source("../AGENTS.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    expect(root).toContain("Stop the same failed direction after two attempts without new evidence");
    expect(modelling).toMatch(/same causal correction.*twice without new evidence.*BLOCKED/i);
    expect(workflow).toContain("Same causal correction failing twice without new evidence");
  });
});
