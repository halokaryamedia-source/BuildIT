import { describe, expect, test } from "bun:test";

describe("Gateway capability discovery contract", () => {
  test("routing invokes known capabilities directly and defers discovery only for unknown/stale capability", async () => {
    const [skill, routedEval, gateway] = await Promise.all([
      Bun.file("../.agents/skills/blockit-bedrock-entity-mcp/SKILL.md").text(),
      Bun.file("scripts/evaluate-routed-tool-loading.ts").text(),
      Bun.file("gateway/contract.ts").text(),
    ]);

    expect(skill).toContain("deferred spec loading after routing");
    expect(skill).toContain("known exact capability   → invoke directly");
    expect(skill).toContain("one precise search_capabilities query");
    expect(skill).toContain("describe_capability once");
    expect(skill).toContain("One precise search miss");
    expect(skill).toContain("reformulate once");
    expect(skill).not.toContain("tool_search");

    expect(gateway).toContain("searchCapabilityCatalog");
    expect(gateway).toContain("CapabilityTier");

    // Native phase-scoped evaluator remains a lower-level discovery benchmark.
    expect(routedEval).toContain("query: testCase.expected");
    expect(routedEval).toContain('routed_query_contract: "<exact_selected_tool_name>"');
    expect(routedEval).toContain("applyMcpToolSurface");
    expect(routedEval).toContain("getMcpSurfaceToolNames");
    expect(routedEval).not.toContain("`${testCase.expected} ${testCase.query}`");
  });
});
