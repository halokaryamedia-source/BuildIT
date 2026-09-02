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
    expect(cubes).toContain("reference fidelity was not evaluated");
  });

  test("successful placement cannot authorize visual PASS or secondary detail", async () => {
    const [modelling, workflow] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const text of [modelling, workflow]) {
      expect(text.toLowerCase()).toContain("tool success");
      expect(text.toLowerCase()).toContain("execution evidence");
      expect(text).toContain("PASS");
      expect(text.toLowerCase()).toContain("secondary");
    }
    expect(modelling).toContain("After primary `PASS`, add identity-weighted secondary geometry only");
    expect(workflow).toContain("After primary `PASS`, add only identity-weighted detail");
  });

  test("under-constrained geometry remains provisional rather than success-by-placement", async () => {
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    expect(modelling).toContain("PROVISIONAL");
    expect(modelling).toContain("placement never verifies it");
    expect(modelling).toContain("Material `UNRESOLVED` → `BLOCKED`");
    expect(modelling).toContain("Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`");
  });
});
