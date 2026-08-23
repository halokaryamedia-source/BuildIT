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
      // Sources capitalize Production at sentence start; compare lowered.
      const lowered = text.toLowerCase();
      expect(lowered).toContain("production");
      expect(lowered).toContain("geometry");
      expect(lowered).toContain("pass");
      expect(lowered).toContain("unverified");
      expect(lowered).toContain("blocked");
    }

    // Animation compaction states the prerequisite in its opening contract.
    const normalizedAnimation = animation.toLowerCase().replaceAll("/", " ");
    expect(normalizedAnimation).toContain("participating hierarchy pivots are suitable");
    expect(normalizedAnimation).toContain("hierarchy");
    expect(normalizedAnimation).toContain("pivot");
    expect(workflow).toContain("participating hierarchy/pivots");
  });

  test("existing-asset direct tasks stay scoped without inventing geometry approval", async () => {
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");
    const modelling = await source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md");
    const foundationSequencing = await source("../docs/foundation/03-modelling-workflow.md");

    // Specialist skills no longer restate the baseline-scope rule; ownership
    // is the orchestrator lane, the modelling skill, and foundation policy.
    expect(orchestrator.toLowerCase()).toContain("existing geometry may be a task baseline");
    expect(orchestrator).toContain("without certifying accuracy");
    expect(modelling.toLowerCase()).toContain("existing-asset work may use current geometry as baseline");
    expect(foundationSequencing).toContain(
      "Existing-asset work may accept the current asset as the task baseline"
    );
  });

  test("temporary aids and downstream invalidation stay with their domain owners", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const orchestrator = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(texturing).toContain(
      "Flat color is provisional when form/material/detail is visible"
    );
    expect(animation).toContain("invalidate only affected animation assumptions");
    expect(orchestrator).not.toContain("A flat/placeholder texture or diagnostic pose/playback");
  });

  test("professional texture and animation evidence improves reasoning without density presets", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");
    const texturePolicy = await source("../docs/foundation/06-texture-standard.md");

    // Texture standard now owns atlas/UV-lock/texel-scale reasoning.
    expect(texturePolicy).toContain("Box UV / UV Lock");
    expect(texturePolicy).toContain("Painted Box-UV Cubes should be locked with `autouv=0`");
    expect(texturePolicy).toContain("Do not optimize atlas occupancy as a quality score.");
    expect(texturePolicy).toContain("physical pixels per UV unit");

    // The texturing skill keeps the operational gate.
    expect(texturing).toContain("AI Box UV final paint");
    expect(texturing).toContain("`autouv=0`");
    expect(texturing).toContain("Do not mentally re-derive atlas coordinates");

    const normalizedAnimation = animation.toLowerCase();
    expect(normalizedAnimation).toContain("keyframe count or curve complexity");
    expect(normalizedAnimation).toContain("fps");
    expect(normalizedAnimation).toContain("bezier");
    expect(normalizedAnimation).toContain("manage_keyframes");
    expect(normalizedAnimation).toContain("molang");
    expect(normalizedAnimation).toContain("no universal fps, duration, amplitude, phase, keyframe count, or bezier target");
  });

  test("sequencing hardening remains decision-layer only", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const validation = await source("../docs/foundation/validation-report.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing");
    expect(profile).not.toContain("readiness");
    expect(validation).toContain("## P5 —");
    expect(validation).toContain("## P6 —");
    expect(validation).toContain("## P7 — Fidelity Convergence / Evaluation Integrity");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
  });
});
