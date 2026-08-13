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

  test("existing-asset direct tasks stay scoped without inventing geometry approval", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    for (const text of [orchestrator, texturing, animation]) {
      expect(text.toLowerCase().replaceAll("-", " ")).toContain("existing asset");
      expect(text.toLowerCase()).toContain("baseline");
    }
    expect(orchestrator).toContain("without certifying it");
    expect(texturing).toContain("Do not claim that baseline is reference-accurate");
    expect(animation).toContain("does not certify the static model as reference-accurate");
  });

  test("temporary aids and downstream invalidation stay with their domain owners", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    expect(texturing).toContain("flat/placeholder texture");
    expect(texturing).toContain("re-check only the affected downstream state");
    expect(animation).toContain("diagnostic pose/playback");
    expect(animation).toContain("consider animation on the affected bones stale");
    expect(orchestrator).not.toContain("A flat/placeholder texture or diagnostic pose/playback");
  });

  test("professional texture and animation evidence improves reasoning without density presets", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const texturePolicy = await source("../docs/foundation/06-texture-standard.md");

    expect(texturing).toContain("Box-UV Cubes");
    expect(texturing).toContain("modify_cubes_batch");
    expect(texturing).toContain("Logical project UV resolution and bitmap pixel dimensions are separate facts");
    expect(texturePolicy).toContain("Box UV / Atlas Authoring");
    expect(texturePolicy).toContain("packing-density score");
    expect(animation).toContain("no keyframe-count, FPS, or Bezier-complexity target");
    expect(animation).toContain("expression-valued transform keyframes");
    expect(animation).toContain("Do not fake expression motion");
  });

  test("sequencing hardening remains decision-layer only", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const validation = await source("../docs/foundation/validation-report.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing");
    expect(profile).not.toContain("readiness");
    expect(validation).toContain("P5–P7");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
  });
});
