import { describe, expect, test } from "bun:test";

describe("exact-name tool search contract", () => {
  test("routing selects the tool before search and loads its spec by exact name", async () => {
    const [skill, routedEval] = await Promise.all([
      Bun.file("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md").text(),
      Bun.file("scripts/evaluate-routed-tool-loading.ts").text(),
    ]);

    expect(skill).toContain("deferred spec loading after routing");
    expect(skill).toContain("the exact selected tool name only");
    expect(skill).toContain("One precise search");
    expect(skill).toContain("reformulate once");
    expect(skill).toContain("search-backend recovery, **not re-routing**");

    expect(routedEval).toContain("query: testCase.expected");
    expect(routedEval).toContain('routed_query_contract: "<exact_selected_tool_name>"');
    expect(routedEval).toContain("applyMcpToolSurface");
    expect(routedEval).toContain("getMcpSurfaceToolNames");
    expect(routedEval).not.toContain("`${testCase.expected} ${testCase.query}`");
  });
});
