import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — primary geometry", () => {
  test("Cube mutation results separate execution from visual acceptance", async () => {
    const cubes = await source("server/tools/cubes.ts");
    expect((cubes.match(/visual_verdict: \"not_evaluated\" as const/g) ?? []).length).toBe(3);
    expect((cubes.match(/execution: \"applied\" as const/g) ?? []).length).toBe(3);
    expect(cubes.toLowerCase()).toContain("reference fidelity was not evaluated");
    expect(cubes).not.toContain("Corrected ${targets.length} Cubes");
    expect(cubes).toContain("does not mean the geometry was corrected visually");
  });

  test("successful placement cannot authorize more geometry or detail", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [modelling, workflow]) {
      expect(text).toContain("execution");
      expect(text).toContain("not_evaluated");
      expect(text.toLowerCase()).toContain("stop");
      expect(text.toLowerCase()).toContain("primary");
      expect(text.toLowerCase()).toContain("secondary");
    }
    expect(modelling).toContain("Do not continue with another Cube merely because the previous placement succeeded");
    expect(workflow).toContain("Do not chain Cube placement based on previous tool success");
  });

  test("under-constrained geometry remains provisional rather than becoming success-by-placement", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");

    expect(modelling).toContain("provisional working extent");
    expect(workflow).toContain("working hypothesis, not verified reference evidence");
    expect(audit).toContain("Execution-success bias");
    expect(audit).toContain("Success chaining");
    expect(audit).toContain("Premature detail");
  });
});
