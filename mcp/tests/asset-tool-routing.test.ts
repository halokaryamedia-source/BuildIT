import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("asset tool routing", () => {
  test("orchestrator decides from intent and known state before repository discovery", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Fast Routing Contract");
    expect(skill).toContain("must not begin by searching repository files");
    expect(skill).toContain("This skill is the routing authority for the first tool decision");
    expect(skill).toContain("Known UUID/identity → skip");
    expect(skill).toContain("Known tool spec already loaded → call it");
    expect(skill).toContain("asset tool selection          ≠ repository/code search");
    expect(skill).toContain("Do not use Graphify, Obsidian, GitHub/code search");
  });

  test("semantic routes distinguish common competing tools without loading their schemas", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    for (const route of [
      "create new Cube geometry",
      "correct one known existing Cube",
      "one coherent correction spans several known Cubes",
      "target identity unknown; attributes/name/scope are known",
      "hierarchy/parent structure itself is the question",
      "exact authored state of one known target is needed",
      "Locator/Null Object identity unknown",
      "create/update known Locator or Null Object",
    ]) {
      expect(skill).toContain(route);
    }

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
    ]) {
      expect(skill).toContain(tool);
    }
  });

  test("native tool search is precise and optional rather than an extra routing layer", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Search Intent Templates");
    expect(skill).toContain("if the exact tool spec is already loaded, call it directly");
    expect(skill).toContain("otherwise use one precise native tool_search query");
    expect(skill).toContain("Do not issue multiple exploratory tool searches");
    expect(skill).not.toContain("route_tool(");
    expect(skill).not.toContain("find_best_blockit_tool");
  });
});
