import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — cross-view and blocker handling", () => {
  test("material 3D claims keep explicit evidence states instead of borrowing confidence across axes", async () => {
    const [reference, modelling, workflow] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [reference, modelling]) {
      for (const state of ["SUPPORTED", "PROVISIONAL", "CONFLICTING", "UNAVAILABLE"]) {
        expect(text).toContain(state);
      }
    }
    expect(modelling).toContain("Front agreement does not certify depth");
    expect(workflow).toContain("Front PASS is not full 3D PASS");
  });

  test("material cross-view conflicts block instead of being averaged into invented geometry", async () => {
    const [reference, modelling, validation] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);

    expect(reference).toContain("must not be averaged");
    expect(modelling).toContain("Do not average drift");
    expect(modelling).toContain("Only unresolved material conflict becomes `BLOCKED`");
    expect(validation.toLowerCase()).toContain("conflicting");
    expect(validation).toContain("BLOCKED");
  });

  test("persistent correction failures stop instead of looping", async () => {
    const [modelling, orchestrator, workflow] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [modelling, orchestrator, workflow]) expect(text).toContain("BLOCKED");
    expect(modelling).toContain("same causal correction direction has failed twice without new evidence");
    expect(workflow).toContain("Same causal correction failing twice without new evidence");
    expect(orchestrator).toContain("Same routed failure twice without new evidence");
    expect(orchestrator).not.toContain("Same causal correction failing twice without new evidence");
  });
});
