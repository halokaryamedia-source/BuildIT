import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

describe("model creation effectiveness — fidelity convergence and evaluation integrity", () => {
  test("local corrections must demonstrate qualitative convergence rather than mutation activity", async () => {
    const [modelling, workflow, validation] = await Promise.all([
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
      source("../docs/foundation/07-visual-validation.md"),
    ]);

    for (const text of [modelling, workflow, validation]) {
      expect(text).toContain("IMPROVED | UNCHANGED | REGRESSED");
      const lower = normalized(text);
      expect(lower).toContain("not progress");
      expect(lower).toContain("previously supported material claim");
      expect(lower).toContain("regressed");
      expect(lower).toContain("qualitative");
    }
    expect(normalized(modelling)).toContain("helps one view while materially regressing another");
    expect(normalized(workflow)).toContain("cross-view regression");
  });

  test("model-facing evaluation remains evidence-bound and non-circular", async () => {
    const [reference, validation, proof] = await Promise.all([
      source("../docs/foundation/04-reference-guide.md"),
      source("../docs/foundation/07-visual-validation.md"),
      source("../docs/foundation/validation-report.md"),
    ]);

    expect(normalized(reference)).toContain("actual approved reference image");
    expect(normalized(validation)).toContain("actual approved reference image");
    expect(normalized(validation)).toContain("fresh current-revision model");
    expect(normalized(validation)).toContain("difference-first");
    expect(normalized(validation)).toContain("not a scalar similarity score");
    expect(proof).toContain("P7 — Fidelity Convergence / Evaluation Integrity");
    expect(proof).toContain("LOCAL PROOF REQUIRED");
  });

  test("P7 adds no scorer, planner, runtime profile, or fixture-specific authoring law", async () => {
    const [profile, cubes, modelling, workflow] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("server/tools/cubes.ts"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("prompts/bedrock_entity_workflow.md"),
    ]);

    for (const forbidden of ["reference_eval", "fidelity_profile", "vision_score", "fidelity_score"]) {
      expect(profile).not.toContain(forbidden);
      expect(cubes).not.toContain(forbidden);
    }
    expect(normalized(modelling)).not.toContain("zebra");
    expect(normalized(workflow)).not.toContain("zebra");
    expect(normalized(modelling)).toContain("never a similarity score");
    expect(normalized(workflow)).toContain("qualitative, not a score");
  });
});
