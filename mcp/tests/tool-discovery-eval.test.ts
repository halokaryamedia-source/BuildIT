import { describe, expect, test } from "bun:test";

type ToolDiscoveryReport = {
  proxy_note: string;
  routed_query_contract?: string;
  routed_query_note?: string;
  upstream_reference: {
    commit: string;
    default_limit: number;
  };
  enabled_tool_count: number;
  expected_tool_count: number;
  case_count: number;
  missing_expected_tools: string[];
  metrics: {
    top_1_accuracy: number;
    top_3_recall: number;
    top_8_recall: number;
    mean_reciprocal_rank: number;
  };
  collision_pairs: unknown[];
  top_8_misses: unknown[];
};

function runEval(script: string): ToolDiscoveryReport {
  const result = Bun.spawnSync({
    cmd: [process.execPath, "run", script],
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = result.stdout.toString();
  const stderr = result.stderr.toString();
  expect(result.exitCode, stderr || stdout).toBe(0);
  return JSON.parse(stdout) as ToolDiscoveryReport;
}

describe("tool discovery eval", () => {
  test("separates raw semantic stress from routed exact-name spec loading", () => {
    const raw = runEval("./scripts/evaluate-tool-discovery.ts");
    const routed = runEval("./scripts/evaluate-routed-tool-loading.ts");

    console.log(
      JSON.stringify(
        {
          tool_discovery_eval: {
            upstream_commit: raw.upstream_reference.commit,
            enabled_tools: raw.enabled_tool_count,
            expected_tools: raw.expected_tool_count,
            cases: raw.case_count,
            raw_semantic_stress: raw.metrics,
            routed_exact_name_loading: routed.metrics,
            top_raw_collision_pairs: raw.collision_pairs.slice(0, 10),
            top_routed_collision_pairs: routed.collision_pairs.slice(0, 10),
            routed_top_8_misses: routed.top_8_misses.slice(0, 10),
          },
        },
        null,
        2
      )
    );

    for (const report of [raw, routed]) {
      expect(report.case_count).toBe(106);
      expect(report.expected_tool_count).toBe(53);
      expect(report.enabled_tool_count).toBe(65);
      expect(report.missing_expected_tools).toEqual([]);
      expect(report.upstream_reference.default_limit).toBe(8);
      expect(report.proxy_note).toContain("not installed-client proof");
    }

    expect(routed.routed_query_contract).toBe(
      "<exact_selected_tool_name> <semantic action>"
    );
    expect(routed.routed_query_note).toContain("deferred spec loading");
    expect(routed.metrics.top_8_recall).toBe(1);
    expect(routed.metrics.top_3_recall).toBeGreaterThan(raw.metrics.top_3_recall);
    expect(routed.metrics.top_1_accuracy).toBeGreaterThan(raw.metrics.top_1_accuracy);
    expect(routed.metrics.mean_reciprocal_rank).toBeGreaterThan(
      raw.metrics.mean_reciprocal_rank
    );
  });
});
