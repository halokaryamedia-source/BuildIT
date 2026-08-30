import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type BenchmarkCase = {
  id: string;
  reference: string;
  forbidden_baselines: string[];
  required_quality_dimensions: string[];
};

type Manifest = {
  schema_version: number;
  suite: string;
  scope: string;
  cases: BenchmarkCase[];
};

const EVALUATOR = "../Experimental/authoring-efficiency-benchmark/evaluate.mjs";
const MANIFEST_PATH = "../Experimental/authoring-efficiency-benchmark/cases.json";
const COST = {
  total_mcp_calls: 20,
  discovery_calls: 2,
  redundant_readbacks: 1,
  tool_search_calls: 1,
  tool_search_misses: 0,
  view_captures: 4,
  correction_attempts: 3,
  same_cause_retries: 0,
  undo_recovery_actions: 1,
  phase_handoffs: 0,
  broad_state_reads: 0,
};

async function manifest(): Promise<Manifest> {
  return JSON.parse(await Bun.file(MANIFEST_PATH).text()) as Manifest;
}

function makeRun(
  suite: string,
  cases: BenchmarkCase[],
  revision: string,
  costPatch: Partial<typeof COST> = {},
  failedCase?: string
) {
  const cost = { ...COST, ...costPatch };
  return {
    schema_version: 1,
    suite,
    run_id: `run-${revision.slice(0, 7)}`,
    revision,
    build_identity: `sha256:${"a".repeat(64)}`,
    environment: {
      agent: "benchmark-test",
      blockbench_version: "5.1.6",
      authoring_phase: "geometry",
    },
    sessions: cases.map((definition) => ({
      case_id: definition.id,
      quality: Object.fromEntries(
        definition.required_quality_dimensions.map((dimension) => [
          dimension,
          definition.id === failedCase ? "FAIL" : "PASS",
        ])
      ),
      cost: { ...cost },
    })),
  };
}

function runEvaluator(baseline: unknown, candidate?: unknown) {
  const dir = mkdtempSync(join(tmpdir(), "blockit-authoring-benchmark-"));
  try {
    const baselinePath = join(dir, "baseline.json");
    Bun.write(baselinePath, JSON.stringify(baseline));
    const cmd = [process.execPath, "run", EVALUATOR, baselinePath];
    if (candidate !== undefined) {
      const candidatePath = join(dir, "candidate.json");
      Bun.write(candidatePath, JSON.stringify(candidate));
      cmd.push(candidatePath);
    }
    const result = Bun.spawnSync({ cmd, stdout: "pipe", stderr: "pipe" });
    return {
      exitCode: result.exitCode,
      stdout: result.stdout.toString(),
      stderr: result.stderr.toString(),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("authoring efficiency benchmark", () => {
  test("fixed suite uses three approved Geometry references without baseline leakage", async () => {
    const data = await manifest();
    expect(data.schema_version).toBe(1);
    expect(data.suite).toBe("clockwork-geometry-v1");
    expect(data.scope).toBe("geometry-only");
    expect(data.cases.map((entry) => entry.id)).toEqual([
      "clockwork-signal-lamp",
      "clockwork-spike-floor-trap",
      "clockwork-power-ring",
    ]);

    for (const entry of data.cases) {
      expect(await Bun.file(`../${entry.reference}`).exists(), entry.reference).toBe(true);
      expect(entry.forbidden_baselines.length).toBeGreaterThan(0);
      for (const path of entry.forbidden_baselines) {
        expect(await Bun.file(`../${path}`).exists(), path).toBe(true);
      }
      expect(entry.required_quality_dimensions).toContain("identity");
      expect(entry.required_quality_dimensions).toContain("primary_form");
      expect(entry.required_quality_dimensions).toContain("buildability");
    }
  });

  test("comparison claims improvement only after quality PASS and Pareto cost improvement", async () => {
    const data = await manifest();
    const baseline = makeRun(data.suite, data.cases, "1".repeat(40));
    const candidate = makeRun(data.suite, data.cases, "2".repeat(40), {
      total_mcp_calls: 18,
      discovery_calls: 1,
      redundant_readbacks: 0,
      correction_attempts: 2,
    });
    const result = runEvaluator(baseline, candidate);
    expect(result.exitCode, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.quality_gate).toBe("PASS");
    expect(output.overall_verdict).toBe("IMPROVED");
    expect(output.aggregate_cost_delta.total_mcp_calls).toBe(-6);
  });

  test("mixed cost movement is TRADEOFF rather than a weighted score", async () => {
    const data = await manifest();
    const baseline = makeRun(data.suite, data.cases, "3".repeat(40));
    const candidate = makeRun(data.suite, data.cases, "4".repeat(40), {
      total_mcp_calls: 18,
      view_captures: 5,
    });
    const result = runEvaluator(baseline, candidate);
    expect(result.exitCode, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout).overall_verdict).toBe("TRADEOFF");
  });

  test("quality failure blocks an efficiency claim regardless of lower cost", async () => {
    const data = await manifest();
    const baseline = makeRun(data.suite, data.cases, "5".repeat(40));
    const candidate = makeRun(
      data.suite,
      data.cases,
      "6".repeat(40),
      { total_mcp_calls: 10, correction_attempts: 1 },
      "clockwork-power-ring"
    );
    const result = runEvaluator(baseline, candidate);
    expect(result.exitCode, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output.quality_gate).toBe("BLOCKED");
    expect(output.overall_verdict).toBe("BLOCKED_QUALITY");
  });

  test("benchmark routing stays authoring-owned and exposes one canonical convenience command", async () => {
    const [workflow, packageText, readme] = await Promise.all([
      Bun.file("../.github/workflows/authoring-policy-verify.yml").text(),
      Bun.file("package.json").text(),
      Bun.file("../Experimental/authoring-efficiency-benchmark/README.md").text(),
    ]);
    const scripts = JSON.parse(packageText).scripts as Record<string, string>;
    expect(workflow).toContain('"Experimental/authoring-efficiency-benchmark/**"');
    expect(scripts["eval:authoring-efficiency"]).toContain(
      "authoring-efficiency-benchmark/evaluate.mjs"
    );
    expect(readme).toContain("no weighted efficiency score");
    expect(readme).toContain("Do not invent token counts, latency");
    expect(readme).toContain("LIVE BASELINE PENDING");
  });
});
