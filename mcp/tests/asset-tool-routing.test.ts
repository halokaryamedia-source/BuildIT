import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("asset tool routing", () => {
  test("orchestrator decides from intent and known state before repository discovery", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    expect(skill).toContain("## Fast Routing Contract");
    expect(skill).toContain("must not begin by searching repository files");
    expect(skill).toContain("routing authority for the first tool decision");
    expect(skill).toContain("Known UUID/identity → skip");
    expect(skill).toContain("Known tool spec already loaded → call it");
    expect(skill).toContain("asset tool selection         ≠ repository/code search");
    expect(skill).toContain("Do not use Graphify, Obsidian, GitHub/code search");
  });

  test("semantic routes distinguish common competing tools without loading their schemas", async () => {
    const skill = await source("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md");

    for (const route of [
      "create new Cube geometry",
      "correct one known existing Cube",
      "coherent correction over several known Cubes",
      "target identity unknown; attributes/name/scope known",
      "hierarchy/parent structure is the question",
      "exact state of one known target needed",
      "Locator/Null Object identity unknown",
      "create/update known Locator/Null Object",
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
    expect(skill).toContain("exact tool spec is already loaded, skip search");
    expect(skill).toContain("one precise native tool_search");
    expect(skill).toContain("Do not issue multiple exploratory tool searches");
    expect(skill).not.toContain("route_tool(");
    expect(skill).not.toContain("find_best_blockit_tool");
  });
});
