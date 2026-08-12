import { describe, expect, test } from "bun:test";
import {
  CODEX_TOOL_SEARCH_REFERENCE,
  TOOL_DISCOVERY_CASES,
  assertToolDiscoveryEvalIntegrity,
  evaluateToolDiscovery,
} from "../scripts/evaluate-tool-discovery";

describe("tool discovery eval", () => {
  test("measures curated MCP intent retrieval without claiming local Codex proof", () => {
    const report = evaluateToolDiscovery();
    assertToolDiscoveryEvalIntegrity(report);

    console.log(
      JSON.stringify(
        {
          tool_discovery_eval: {
            upstream_commit: CODEX_TOOL_SEARCH_REFERENCE.commit,
            enabled_tools: report.enabled_tool_count,
            expected_tools: report.expected_tool_count,
            cases: report.case_count,
            metrics: report.metrics,
            top_collision_pairs: report.collision_pairs.slice(0, 10),
            top_8_misses: report.top_8_misses.slice(0, 10),
          },
        },
        null,
        2
      )
    );

    expect(TOOL_DISCOVERY_CASES).toHaveLength(104);
    expect(report.enabled_tool_count).toBe(62);
    expect(report.missing_expected_tools).toEqual([]);
    expect(report.upstream_reference.default_limit).toBe(8);
    expect(report.proxy_note).toContain("not installed-client proof");
  });
});
