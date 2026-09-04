import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("asset tool routing", () => {
  test("orchestrator uses Gateway + active phase before repository discovery", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Fast Routing Contract");
    expect(skill).toContain("must not begin by searching repository files");
    expect(skill).toContain("ACTIVE PHASE + intent + known state/UUIDs");
    expect(skill).toContain("exact known Runtime capability");
    expect(skill).toContain("search_capabilities");
    expect(skill).toContain("describe_capability");
    expect(skill).toContain("## Authoring Stage Lock");
    expect(skill).toContain("DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE");
  });

  test("Geometry strategy is explicit, user-selected, and keeps 3D-Assisted indivisible", async () => {
    const [router, modelling] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("../.agents/skills/blockbench-bedrock-modelling/SKILL.md"),
    ]);

    for (const owner of [router, modelling]) {
      expect(owner).toContain("approved image");
      expect(owner).toContain("DIRECT");
      expect(owner).toContain("3D_ASSISTED");
      expect(owner).toMatch(/user-selected|user.*selected/i);
      expect(owner).not.toContain("optional 3D Evidence");
      expect(owner).not.toContain("Image Reference Route");
    }
    expect(router).toContain("Shape Reconstruction");
    expect(router).toContain("PrimitiveAnything");
    expect(router).toContain("manage_geometry_reference");
  });

  test("Geometry hierarchy and rig routes retain one canonical owner", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("Group/bone parent move         → reparent_element");
    expect(skill).toContain("Group pivot/rotation/visible   → modify_group");
    expect(skill).toContain("rig IK/mirror                  → bone_rigging");
    expect(skill).toContain("`bone_rigging` only for IK/mirror");
  });

  test("Gateway discovery is bounded and foreign-phase need is a handoff, not a miss", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Capability Discovery / Recovery");
    expect(skill).toContain("One precise search miss");
    expect(skill).toContain("reformulate once");
    expect(skill).toContain("second miss → `BLOCKED`");
    expect(skill).toContain("known foreign-phase capability is never a discovery miss");
    expect(skill).not.toContain("tool_search");
  });

  test("hot-path failures retain bounded evidence-based recovery", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    for (const term of [
      "INVALID_INPUT",
      "TARGET_AMBIGUOUS",
      "TARGET_NOT_FOUND",
      "STALE_STATE",
      "NO_EFFECT",
      "CAPABILITY_MISMATCH",
      "OUTCOME_UNKNOWN",
      "repair args; same capability",
      "focused identity lookup",
      "one focused refresh",
    ]) expect(skill).toContain(term);
  });

  test("texturing uses consolidated material facade and keeps support tools conditional", async () => {
    const texturing = await source("../.agents/skills/blockit-bedrock-texturing/SKILL.md");

    for (const term of [
      "create_texture",
      "list_textures",
      "get_texture",
      "activate_texture",
      "manage_material",
      "manage_material_instances",
      "HANDOFF_REQUIRED",
      "switch_authoring_phase",
      "Primary vs Support Capabilities",
    ]) expect(texturing).toContain(term);

    expect(texturing).not.toContain("create_pbr_material / configure_material / assign_texture_channel");
    expect(texturing).not.toContain("reload BlockIT MCP");
  });

  test("animation keeps compact primary surface and Gateway handoff", async () => {
    const animation = await source("../.agents/skills/blockit-bedrock-animation/SKILL.md");

    for (const term of [
      "create_animation",
      "inspect_animation",
      "manage_animation_timeline",
      "manage_animation_effects",
      "manage_animation_controller",
      "HANDOFF_REQUIRED",
      "switch_authoring_phase",
      "same task",
    ]) expect(animation).toContain(term);
    expect(animation).not.toContain("reload BlockIT MCP");
  });

  test("internal extended identifier remains compatibility rather than a second authoring router", async () => {
    const [profile, settings] = await Promise.all([
      source("lib/registrationProfile.ts"),
      source("ui/settings.ts"),
    ]);

    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(settings).toContain('name: "Legacy UI Fallbacks (Debug)"');
    expect(settings).toContain("not an authoring profile");
    expect(profile).not.toContain("decision_loop");
    expect(profile).not.toContain("routing_state");
  });
});
