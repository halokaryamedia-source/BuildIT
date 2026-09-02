import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("asset tool routing", () => {
  test("orchestrator routes from active phase + intent + known state before repository discovery", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Fast Routing Contract");
    expect(skill).toContain("must not begin by searching repository files");
    expect(skill).toContain("routing authority for the first tool decision");
    expect(skill).toContain("ACTIVE PHASE + intent + known state/UUIDs");
    expect(skill).toContain("## Authoring Stage Lock");
    expect(skill).toContain("DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE");
    expect(skill).toContain("fresh state must not regress");
  });

  test("semantic routes distinguish Core and Geometry capabilities without embedding schemas", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    for (const intent of [
      "target identity unknown",
      "hierarchy question",
      "known target detail",
      "Locator/Null",
      "numeric envelope/scale/ground",
      "visible/reference comparison",
    ]) expect(skill).toContain(intent);

    for (const tool of [
      "manage_cubes",
      "inspect_elements(mode=search)",
      "inspect_elements(mode=outline)",
      "inspect_elements(mode=detail)",
      "list_locator_elements",
      "manage_locator",
      "manage_null_object",
    ]) expect(skill).toContain(tool);
  });

  test("Geometry hierarchy and rig routes have one canonical owner", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("Group/bone parent move        → reparent_element");
    expect(skill).toContain("Group pivot/rotation/visible  → modify_group");
    expect(skill).toContain("rig IK/mirror                 → bone_rigging");
    expect(skill).toContain("`bone_rigging` only for IK/mirror");
    expect(skill).not.toContain("rig parent/pivot/IK/mirror    → bone_rigging");
  });

  test("native tool search is bounded active-phase deferred spec loading", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Search / Recovery");
    expect(skill).toContain("deferred spec loading after routing");
    expect(skill).toContain("belongs to the active phase");
    expect(skill).toContain("One precise search");
    expect(skill).toContain("reformulate once");
    expect(skill).toContain("second miss → `BLOCKED`");
    expect(skill).toContain("A known foreign-phase tool must never enter this search path");
    expect(skill).not.toContain("route_tool(");
    expect(skill).not.toContain("find_best_blockit_tool");
  });

  test("hot-path failures recover without reopening foreign tool selection", async () => {
    const [skill, factories, identity, cubes, locators] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md"),
      source("lib/factories.ts"),
      source("lib/coreIdentity.ts"),
      source("server/tools/cubes.ts"),
      source("server/tools/locators.ts"),
    ]);

    for (const term of [
      "INVALID_INPUT",
      "TARGET_AMBIGUOUS",
      "TARGET_NOT_FOUND",
      "STALE_STATE",
      "NO_EFFECT",
      "CAPABILITY_MISMATCH",
      "repair args; same tool",
      "focused identity lookup",
      "one focused refresh",
      "handoff once or BLOCKED",
    ]) expect(skill).toContain(term);

    const invocationStart = factories.indexOf("function getToolInvocation");
    const invocationEnd = factories.indexOf("function extractShape", invocationStart);
    const invocation = factories.slice(invocationStart, invocationEnd);
    const validation = invocation.indexOf("parameterSchema.parseAsync(args)");
    const execution = invocation.indexOf("toolDef.execute(");
    expect(invocationStart).toBeGreaterThan(-1);
    expect(validation).toBeGreaterThan(-1);
    expect(execution).toBeGreaterThan(validation);

    const registration = factories.slice(
      factories.indexOf("export function registerToolsOnServer")
    );
    expect(registration).toContain("getToolInvocation(name, toolDef)");

    expect(identity).toContain('is ambiguous. Use an exact UUID.');
    expect(identity).toContain('not found.');
    expect(cubes).toContain("has no authored effect");
    expect(locators).toContain("require the Minecraft Bedrock Entity format");
  });

  test("texturing and animation specialists route only within their active phase", async () => {
    const [texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    for (const term of [
      "## Direct Routing",
      "create_texture",
      "list_textures",
      "get_texture",
      "activate_texture",
      "create_pbr_material",
      "configure_material",
      "assign_texture_channel",
      "HANDOFF_REQUIRED",
      "do not re-list/re-read it only for confirmation",
    ]) expect(texturing.toLowerCase()).toContain(term.toLowerCase());
    expect(texturing).toContain(
      "Never `tool_search` for `manage_cubes`, `bone_rigging`"
    );

    for (const term of [
      "## Direct Routing",
      "create_animation",
      "inspect_animation",
      "manage_animation_timeline",
      "HANDOFF_REQUIRED",
    ]) expect(animation.toLowerCase()).toContain(term.toLowerCase());
    expect(animation).toContain("Do not `tool_search` for `bone_rigging`");
  });

  test("routing hardening uses the existing registration profile rather than a second router", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("decision_loop");
    expect(profile).not.toContain("routing_state");
    expect(profile).not.toContain("recovery_profile");
  });
});
