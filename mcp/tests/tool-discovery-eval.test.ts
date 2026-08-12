import { describe, expect, test } from "bun:test";

type ToolDiscoveryReport = {
  proxy_note: string;
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

describe("tool discovery eval", () => {
  test("measures curated MCP intent retrieval in a clean default-profile process", () => {
    const result = Bun.spawnSync({
      cmd: [process.execPath, "run", "./scripts/evaluate-tool-discovery.ts"],
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = result.stdout.toString();
    const stderr = result.stderr.toString();
    expect(result.exitCode, stderr || stdout).toBe(0);

    const report = JSON.parse(stdout) as ToolDiscoveryReport;

    console.log(
      JSON.stringify(
        {
          tool_discovery_eval: {
            upstream_commit: report.upstream_reference.commit,
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

    expect(report.case_count).toBe(104);
    expect(report.expected_tool_count).toBe(52);
    expect(report.enabled_tool_count).toBe(62);
    expect(report.missing_expected_tools).toEqual([]);
    expect(report.upstream_reference.default_limit).toBe(8);
    expect(report.proxy_note).toContain("not installed-client proof");
  });
});
