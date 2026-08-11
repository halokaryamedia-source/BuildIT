import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — texture/animation sequencing", () => {
  test("end-to-end production waits for geometry and rig prerequisites", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const workflow = await source("prompts/bedrock_entity_workflow.md");

    for (const text of [orchestrator, texturing, workflow]) {
      expect(text).toContain("production");
      expect(text).toContain("geometry");
      expect(text).toContain("PASS");
      expect(text).toContain("UNVERIFIED");
      expect(text).toContain("BLOCKED");
    }
    expect(animation).toContain("participating Group/bone hierarchy and pivots");
    expect(workflow).toContain("participating hierarchy/pivots");
  });

  test("existing-asset direct tasks do not invent geometry approval", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    for (const text of [orchestrator, texturing, animation]) {
      expect(text.toLowerCase().replaceAll("-", " ")).toContain("existing asset");
      expect(text.toLowerCase()).toContain("baseline");
    }
    expect(orchestrator).toContain("does **not** upgrade that geometry to `PASS`");
    expect(texturing).toContain("Do not claim that baseline is reference-accurate");
    expect(animation).toContain("does not certify the static model as reference-accurate");
  });

  test("temporary visibility/rig aids stay provisional and downstream state is invalidated after material upstream changes", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const foundation = await source("../docs/foundation/03-modelling-workflow.md");

    expect(orchestrator).toContain("flat/placeholder texture");
    expect(orchestrator).toContain("diagnostic pose/playback");
    expect(orchestrator).toContain("provisional/disposable");
    expect(texturing).toContain("re-check only the affected downstream state");
    expect(animation).toContain("consider animation on the affected bones stale");
    expect(foundation).toContain("keyframe effort never justifies preserving a bad rig or geometry baseline");
  });

  test("sequencing hardening remains decision-layer only", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const audit = await source("../docs/knowledge/reviews/model-creation-effectiveness-audit-2026-08-10.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing");
    expect(profile).not.toContain("readiness");
    expect(audit).toContain("No runtime readiness state, new profile, or tool gate was added");
  });

});
