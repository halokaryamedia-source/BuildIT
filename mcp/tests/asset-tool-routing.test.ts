import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("asset tool routing", () => {
  test("orchestrator routes from intent, known state and stage before repository discovery", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Fast Routing Contract");
    expect(skill).toContain("must not begin by searching repository files");
    expect(skill).toContain("routing authority for the first tool decision");
    expect(skill).toContain("## Authoring Stage Lock");
    expect(skill).toContain("DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE");
    expect(skill).toContain("known fresh state must not regress");
    expect(skill).toContain("Known UUID/identity → skip");
    expect(skill).toContain("Known tool spec already loaded → call it");
    expect(skill).toContain("asset tool selection         ≠ repository/code search");
    expect(skill).toContain("Do not use Graphify, Obsidian, GitHub/code search");
  });

  test("semantic routes distinguish common competing capabilities without embedding schemas", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    for (const intent of [
      "target identity unknown",
      "hierarchy question",
      "known existing Cube",
      "Locator/Null",
      "numeric envelope/scale/ground",
      "visible/reference comparison",
    ]) expect(skill).toContain(intent);

    for (const tool of [
      "place_cube",
      "modify_cube",
      "modify_cubes_batch",
      "find_elements_by_criteria",
      "list_outline",
      "inspect_element",
      "list_locator_elements",
      "manage_locator",
      "manage_null_object",
    ]) expect(skill).toContain(tool);
  });

  test("native tool search is bounded exact-name deferred spec loading", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Search Intent Templates");
    expect(skill).toContain("exact tool spec is already loaded, skip search");
    expect(skill).toContain("deferred spec loading after routing");
    expect(skill).toContain("exact selected tool name");
    expect(skill).toContain("never send raw user wording alone");
    expect(skill).toContain('place_cube create new Bedrock Cube geometry');
    expect(skill).toContain("one precise native `tool_search`");
    expect(skill).toContain("reformulate once");
    expect(skill).toContain("a second miss is `BLOCKED`");
    expect(skill).toContain("Do not issue multiple exploratory tool searches");
    expect(skill).not.toContain("route_tool(");
    expect(skill).not.toContain("find_best_blockit_tool");
  });

  test("texturing and animation specialists route directly and load the selected spec by exact name", async () => {
    const [texturing, animation] = await Promise.all([
      source("../.agents/skills/blockit-bedrock-texturing/SKILL.md"),
      source("../.agents/skills/blockit-bedrock-animation/SKILL.md"),
    ]);

    for (const term of [
      "## Direct Routing",
      "## Deferred Spec Loading",
      "create_texture",
      "list_textures",
      "get_texture",
      "activate_texture",
      "create_pbr_material",
      "configure_material",
      "assign_texture_channel",
      "exact tool name",
      "known identity skips",
      "do not re-list/re-read it only for confirmation",
    ]) expect(texturing.toLowerCase()).toContain(term.toLowerCase());

    for (const term of [
      "## Direct Routing",
      "## Deferred Spec Loading",
      "create_animation",
      "inspect_animation",
      "manage_keyframes",
      "animation_graph_editor",
      "bone_rigging",
      "animation_timeline",
      "batch_keyframe_operations",
      "animation_copy_paste",
      "exact tool name",
      "known participating identity/state must not fall back",
    ]) expect(animation.toLowerCase()).toContain(term.toLowerCase());
  });

  test("decision-loop hardening remains instruction-layer only", async () => {
    const profile = await source("lib/registrationProfile.ts");
    expect(profile).toContain('export type McpRegistrationProfile = "bedrock_entity" | "extended";');
    expect(profile).not.toContain("authoring_stage");
    expect(profile).not.toContain("decision_loop");
    expect(profile).not.toContain("routing_state");
  });
});
