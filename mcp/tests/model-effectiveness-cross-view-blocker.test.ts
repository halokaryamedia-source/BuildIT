import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — cross-view and blocker handling", () => {
  test("material 3D claims keep explicit evidence states instead of borrowing confidence across axes", async () => {
    const reference = await source("../docs/foundation/04-reference-guide.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [reference, modelling, workflow]) {
      expect(text).toContain("SUPPORTED");
      expect(text).toContain("PROVISIONAL");
      expect(text).toContain("CONFLICTING");
      expect(text).toContain("UNAVAILABLE");
    }
    expect(modelling).toContain("A convincing front silhouette does not validate depth");
    expect(workflow).toContain("A front-view match cannot certify depth");
  });

  test("material cross-view conflicts block instead of being averaged into invented geometry", async () => {
    const reference = await source("../docs/foundation/04-reference-guide.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const validation = await source("../docs/foundation/07-visual-validation.md");

    expect(reference).toContain("must not be averaged");
    expect(modelling).toContain("Enter the workflow `BLOCKED` state");
    expect(validation).toContain("front PASS + conflicting side/top reference -> BLOCKED");
  });

  test("persistent correction failures stop and report a blocker instead of looping", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");

    for (const text of [modelling, orchestrator, workflow, audit]) {
      expect(text).toContain("BLOCKED");
    }
    expect(modelling).toContain("same causal correction direction has failed twice without new evidence");
    expect(workflow).toContain("same causal correction direction fails twice without new evidence");
    expect(orchestrator).toContain("Do not continue speculative mutation");
    expect(audit).toContain("A valid result is more important than producing a success report");
  });

  test("cross-view safeguards remain active as problem-driven work advances", async () => {
    const next = await source("../docs/knowledge/next-action.md");
    expect(next).toContain("cross-view / depth hallucination");
    expect(next).toContain("BLOCKED");
    expect(next).not.toContain(
      "The next bounded modelling problem is:\n\n```text\nP0 — cross-view / depth hallucination"
    );
  });
});
