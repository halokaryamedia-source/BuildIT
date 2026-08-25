import { describe, expect, test } from "bun:test";
import { getMcpPhaseReadinessSummary } from "@/lib/authoringPhase";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — texture/animation sequencing", () => {
  test("phase handoff waits for explicit upstream readiness", async () => {
    const [orchestrator, texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    expect(getMcpPhaseReadinessSummary("geometry")).toContain("geometry=PASS");
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("uv_layout=PASS");
    expect(getMcpPhaseReadinessSummary("texturing")).toContain("texture_verify=PASS");

    for (const text of [orchestrator, texturing, animation]) {
      expect(text).toContain("HANDOFF_REQUIRED");
      expect(text).toContain("target_phase");
      expect(text).toContain("readiness");
      expect(text).toContain("STOP");
    }

    expect(texturing.toLowerCase()).toContain("final box uv locked with `autouv=0`");
    expect(texturing).toContain("list_textures");
    expect(texturing).toContain("partial-overlap blocker");
    expect(animation.toLowerCase().replaceAll("/", " ")).toContain(
      "participating hierarchy pivots are suitable"
    );
  });

  test("existing-asset tasks may use current geometry as baseline without inventing reference approval", async () => {
    const [orchestrator, modelling, foundation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/03-modelling-workflow.md"),
    ]);

    expect(orchestrator.toLowerCase()).toContain("existing geometry may be a task baseline");
    expect(orchestrator.toLowerCase()).toContain("without certifying reference accuracy");
    expect(modelling.toLowerCase()).toContain("existing-asset work may use current geometry as baseline");
    expect(foundation.toLowerCase()).toContain("existing-asset work may accept the current asset as the task baseline");
  });

  test("downstream phases return structural defects to Geometry instead of borrowing mutation", async () => {
    const [texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    expect(texturing).toContain("unlocked/invalid UV        → HANDOFF_REQUIRED(geometry)");
    expect(texturing).toContain("must not borrow Cube mutation");
    expect(animation).toContain("Animation owns motion, not structural rig mutation");
    expect(animation).toContain("target_phase: geometry");
    expect(animation).toContain("Do not `tool_search` for `bone_rigging`");
  });

  test("texture and animation guidance remains evidence-based without preset density metrics", async () => {
    const [texturing, animation, texturePolicy] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
      source("../docs/foundation/06-texture-standard.md"),
    ]);

    expect(texturePolicy).toContain("## Box UV / UV Lock");
    expect(texturePolicy).toContain("one coherent final UV lock with autouv=0");
    expect(texturePolicy).toContain("Do not optimize atlas occupancy as a quality score");
    expect(texturePolicy).toContain("physical pixels per UV unit");

    expect(texturing).toContain("pixels per UV unit");
    expect(texturing).toContain("random high-contrast noise");

    const normalizedAnimation = animation.toLowerCase();
    expect(normalizedAnimation).toContain(
      "no universal fps, duration, amplitude, phase, keyframe count, or bezier target"
    );
    expect(normalizedAnimation).toContain("animation quality score");
    expect(normalizedAnimation).toContain("manage_keyframes");
    expect(normalizedAnimation).toContain("molang");
  });

  test("sequencing remains instruction/phase ownership rather than a registration profile", async () => {
    const profile = await source("lib/registrationProfile.ts");
    const validation = await source("../docs/foundation/validation-report.md");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing_profile");
    expect(profile).not.toContain("readiness_profile");
    expect(validation).toContain("Current Agent-Contract Proof");
    expect(validation).toContain("LOCAL PROOF REQUIRED");
  });
});
