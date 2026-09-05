import { describe, expect, test } from "bun:test";
import { getMcpPhaseReadinessSummary } from "@/lib/authoringPhase";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("model creation effectiveness — texture/animation sequencing", () => {
  test("Authoring keeps explicit Geometry approval → UV PASS → Texturing while Animation uses Gateway handoff", async () => {
    const [agents, flow, workspace, orchestrator, texturing, animation] = await Promise.all([
      source("../AGENTS.md"),
      source("../docs/knowledge/flow.md"),
      source("../workspace/README.md"),
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    expect(getMcpPhaseReadinessSummary("geometry")).toContain("geometry=PASS");
    expect(getMcpPhaseReadinessSummary("geometry")).toContain("uv_layout=PASS");
    expect(getMcpPhaseReadinessSummary("texturing")).toContain("texture_verify=PASS");

    for (const text of [agents, flow, workspace, orchestrator, texturing]) {
      expect(text).toContain("Geometry APPROVED");
      expect(text).toContain("UV Layout PASS");
    }
    expect(flow).toContain("Geometry user approval is required before fresh/rebuilt production UV Layout");
    expect(workspace).toContain("Texturing cannot enter `IN_PROGRESS` until `UV Layout: PASS`");
    expect(orchestrator).toContain("Any `NO` → **DO NOT MUTATE**");

    for (const text of [orchestrator, texturing, animation]) {
      expect(text).toContain("HANDOFF_REQUIRED");
      expect(text).toContain("target_phase");
      expect(text).toContain("readiness");
      expect(text).toContain("switch_authoring_phase");
      expect(text).toContain("Gateway");
      expect(text).toMatch(/same task|same task\/chat/i);
      expect(text).not.toContain("action: set MCP Authoring Phase=");
      expect(text).not.toContain("reload BlockIT MCP");
    }

    expect(texturing.toLowerCase()).toContain("final box uv locked with `autouv=0`");
    expect(texturing).toContain("list_textures");
    expect(texturing).toContain("partial-overlap blocker");
    expect(texturing).toContain("No Geometry↔Texturing phase switch");
    expect(animation.toLowerCase().replaceAll("/", " ")).toContain(
      "participating hierarchy pivots are suitable"
    );
  });

  test("existing-asset baseline policy stays with modelling owners", async () => {
    const [orchestrator, modelling, foundation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
      source("../docs/foundation/03-modelling-workflow.md"),
    ]);

    expect(orchestrator.toLowerCase()).not.toContain("existing geometry may be a task baseline");
    expect(orchestrator.toLowerCase()).not.toContain("without certifying reference accuracy");
    expect(modelling.toLowerCase()).toContain("existing-asset work may use current geometry as baseline");
    expect(foundation.toLowerCase()).toContain("existing-asset work may accept the current asset as the task baseline");
  });

  test("Texturing can correct upstream Geometry/UV in-session; Animation still hands back", async () => {
    const [texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    expect(texturing).toMatch(/unlocked\/invalid UV\s+→ Geometry owner \+ bounded UV correction; no phase switch/);
    expect(texturing).toContain("Geometry/UV capabilities remain callable for bounded upstream correction");
    expect(texturing).toContain("No Geometry↔Texturing phase switch");
    expect(animation).toContain("Animation owns motion, not structural rig mutation");
    expect(animation).toContain("target_phase: geometry");
    expect(animation).toContain("Do not search for `bone_rigging`");
    expect(animation).not.toContain("tool_search");
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
    for (const quality of ["face aspect ratio", "texel density", "semantic UV reuse"]) {
      expect(texturing).toContain(quality);
    }

    const normalizedAnimation = animation.toLowerCase();
    expect(normalizedAnimation).toContain(
      "no universal fps, duration, amplitude, phase, keyframe count, or bezier target"
    );
    expect(normalizedAnimation).toContain("animation quality score");
    expect(normalizedAnimation).toContain("manage_animation_timeline");
    expect(normalizedAnimation).toContain("molang");
  });

  test("sequencing remains instruction/stage ownership rather than a registration profile", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("sequencing_profile");
    expect(profile).not.toContain("readiness_profile");
  });
});
