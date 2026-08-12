import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

function normalized(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

describe("model creation effectiveness — fidelity convergence and evaluation integrity", () => {
  test("historical correction-guessing failures remain the design input", async () => {
    const audit = await source("../docs/knowledge/reviews/mcp-geometry-ai-slop-audit.md");
    expect(audit).toContain("G-24");
    expect(audit).toContain("guessed another transform");
    expect(audit).toContain("G-25");
    expect(normalized(audit)).toContain("automatic correction would have been guesswork");
  });

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

  test("model-facing reference evaluation stays independent and non-circular", async () => {
    const decision = await source("../docs/knowledge/decisions/reference-fidelity-loop.md");
    const lower = normalized(decision);

    expect(decision).toContain("P7 — Fidelity Convergence / Evaluation Integrity");
    expect(lower).toContain("independent expectations");
    expect(lower).toContain("candidate must not receive the expected answer");
    for (const dimension of [
      "decomposition / coverage",
      "cross-view consistency",
      "spatial hypothesis quality",
      "correction direction / convergence",
    ]) expect(lower).toContain(dimension);
    expect(lower).toContain("actual approved reference image");
    expect(lower).toContain("pre-existing audited evidence");
    expect(lower).toContain("not runtime anatomy law");
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
