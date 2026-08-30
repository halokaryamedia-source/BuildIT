import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CASE_MANIFEST = JSON.parse(readFileSync(join(HERE, "cases.json"), "utf8"));

const QUALITY_VALUES = new Set(["PASS", "FAIL", "UNVERIFIED"]);
const COST_KEYS = [
  "total_mcp_calls",
  "discovery_calls",
  "redundant_readbacks",
  "tool_search_calls",
  "tool_search_misses",
  "view_captures",
  "correction_attempts",
  "same_cause_retries",
  "undo_recovery_actions",
  "phase_handoffs",
  "broad_state_reads",
];

function fail(message) {
  throw new Error(message);
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object`);
  }
}

function assertNonNegativeInteger(value, label) {
  if (!Number.isInteger(value) || value < 0) {
    fail(`${label} must be a non-negative integer`);
  }
}

function caseMap() {
  return new Map(CASE_MANIFEST.cases.map((entry) => [entry.id, entry]));
}

function validateRun(run, label = "run") {
  assertObject(run, label);
  if (run.schema_version !== 1) fail(`${label}.schema_version must be 1`);
  if (run.suite !== CASE_MANIFEST.suite) {
    fail(`${label}.suite must be ${CASE_MANIFEST.suite}`);
  }
  if (typeof run.run_id !== "string" || run.run_id.trim().length === 0) {
    fail(`${label}.run_id must be a non-empty string`);
  }
  if (typeof run.revision !== "string" || !/^[0-9a-f]{40}$/.test(run.revision)) {
    fail(`${label}.revision must be an exact lowercase 40-character git SHA`);
  }
  if (
    typeof run.build_identity !== "string" ||
    !/^sha256:[0-9a-f]{64}$/.test(run.build_identity)
  ) {
    fail(`${label}.build_identity must match sha256:<64 lowercase hex>`);
  }

  assertObject(run.environment, `${label}.environment`);
  for (const key of ["agent", "blockbench_version", "authoring_phase"]) {
    if (
      typeof run.environment[key] !== "string" ||
      run.environment[key].trim().length === 0
    ) {
      fail(`${label}.environment.${key} must be a non-empty string`);
    }
  }
  if (run.environment.authoring_phase !== "geometry") {
    fail(`${label}.environment.authoring_phase must be geometry`);
  }

  if (!Array.isArray(run.sessions)) fail(`${label}.sessions must be an array`);
  const cases = caseMap();
  if (run.sessions.length !== cases.size) {
    fail(`${label}.sessions must contain exactly ${cases.size} benchmark cases`);
  }

  const seen = new Set();
  for (const session of run.sessions) {
    assertObject(session, `${label}.session`);
    const definition = cases.get(session.case_id);
    if (!definition) fail(`${label} contains unknown case_id ${session.case_id}`);
    if (seen.has(session.case_id)) fail(`${label} duplicates case_id ${session.case_id}`);
    seen.add(session.case_id);

    assertObject(session.quality, `${label}.${session.case_id}.quality`);
    for (const dimension of definition.required_quality_dimensions) {
      const status = session.quality[dimension];
      if (!QUALITY_VALUES.has(status)) {
        fail(
          `${label}.${session.case_id}.quality.${dimension} must be PASS, FAIL, or UNVERIFIED`
        );
      }
    }

    assertObject(session.cost, `${label}.${session.case_id}.cost`);
    for (const key of COST_KEYS) {
      assertNonNegativeInteger(
        session.cost[key],
        `${label}.${session.case_id}.cost.${key}`
      );
    }

    if (session.tool_counts !== undefined) {
      assertObject(session.tool_counts, `${label}.${session.case_id}.tool_counts`);
      let total = 0;
      for (const [tool, count] of Object.entries(session.tool_counts)) {
        if (!tool.trim()) fail(`${label}.${session.case_id}.tool_counts has an empty tool name`);
        assertNonNegativeInteger(count, `${label}.${session.case_id}.tool_counts.${tool}`);
        total += count;
      }
      if (total !== session.cost.total_mcp_calls) {
        fail(
          `${label}.${session.case_id}.tool_counts must sum to total_mcp_calls when provided`
        );
      }
    }

    if (session.notes !== undefined) {
      if (!Array.isArray(session.notes) || session.notes.some((note) => typeof note !== "string")) {
        fail(`${label}.${session.case_id}.notes must be an array of strings`);
      }
    }
  }

  for (const id of cases.keys()) {
    if (!seen.has(id)) fail(`${label} is missing benchmark case ${id}`);
  }

  return run;
}

function loadRun(path, label) {
  return validateRun(JSON.parse(readFileSync(path, "utf8")), label);
}

function sessionQualityPass(session, definition) {
  return definition.required_quality_dimensions.every(
    (dimension) => session.quality[dimension] === "PASS"
  );
}

function aggregateCost(run) {
  return Object.fromEntries(
    COST_KEYS.map((key) => [
      key,
      run.sessions.reduce((sum, session) => sum + session.cost[key], 0),
    ])
  );
}

function costDelta(baseline, candidate) {
  return Object.fromEntries(
    COST_KEYS.map((key) => [key, candidate[key] - baseline[key]])
  );
}

function dominance(baseline, candidate) {
  const deltas = COST_KEYS.map((key) => candidate[key] - baseline[key]);
  if (deltas.every((value) => value === 0)) return "UNCHANGED";
  if (deltas.every((value) => value <= 0) && deltas.some((value) => value < 0)) {
    return "IMPROVED";
  }
  if (deltas.every((value) => value >= 0) && deltas.some((value) => value > 0)) {
    return "REGRESSED";
  }
  return "TRADEOFF";
}

function summarizeRun(run) {
  const definitions = caseMap();
  const cases = run.sessions.map((session) => ({
    case_id: session.case_id,
    quality_pass: sessionQualityPass(session, definitions.get(session.case_id)),
    cost: session.cost,
    tool_counts: session.tool_counts ?? null,
  }));

  return {
    suite: run.suite,
    run_id: run.run_id,
    revision: run.revision,
    build_identity: run.build_identity,
    environment: run.environment,
    all_quality_pass: cases.every((entry) => entry.quality_pass),
    aggregate_cost: aggregateCost(run),
    cases,
  };
}

function compareRuns(baseline, candidate) {
  const definitions = caseMap();
  const baselineByCase = new Map(baseline.sessions.map((entry) => [entry.case_id, entry]));
  const candidateByCase = new Map(candidate.sessions.map((entry) => [entry.case_id, entry]));

  const cases = CASE_MANIFEST.cases.map((definition) => {
    const before = baselineByCase.get(definition.id);
    const after = candidateByCase.get(definition.id);
    const baselineQualityPass = sessionQualityPass(before, definition);
    const candidateQualityPass = sessionQualityPass(after, definition);
    const verdict =
      baselineQualityPass && candidateQualityPass
        ? dominance(before.cost, after.cost)
        : "BLOCKED_QUALITY";

    return {
      case_id: definition.id,
      baseline_quality_pass: baselineQualityPass,
      candidate_quality_pass: candidateQualityPass,
      verdict,
      cost_delta: costDelta(before.cost, after.cost),
    };
  });

  const allQualityPass = cases.every(
    (entry) => entry.baseline_quality_pass && entry.candidate_quality_pass
  );
  const aggregateBaseline = aggregateCost(baseline);
  const aggregateCandidate = aggregateCost(candidate);
  const aggregateVerdict = allQualityPass
    ? dominance(aggregateBaseline, aggregateCandidate)
    : "BLOCKED_QUALITY";

  let overallVerdict = "UNCHANGED";
  if (!allQualityPass) {
    overallVerdict = "BLOCKED_QUALITY";
  } else if (cases.some((entry) => entry.verdict === "REGRESSED")) {
    overallVerdict = "REGRESSED";
  } else if (cases.some((entry) => entry.verdict === "TRADEOFF")) {
    overallVerdict = "TRADEOFF";
  } else if (cases.some((entry) => entry.verdict === "IMPROVED")) {
    overallVerdict = "IMPROVED";
  }

  return {
    suite: baseline.suite,
    baseline: {
      run_id: baseline.run_id,
      revision: baseline.revision,
      build_identity: baseline.build_identity,
    },
    candidate: {
      run_id: candidate.run_id,
      revision: candidate.revision,
      build_identity: candidate.build_identity,
    },
    quality_gate: allQualityPass ? "PASS" : "BLOCKED",
    overall_verdict: overallVerdict,
    aggregate_verdict: aggregateVerdict,
    aggregate_cost_delta: costDelta(aggregateBaseline, aggregateCandidate),
    cases,
  };
}

function main() {
  const [, , baselinePath, candidatePath] = process.argv;
  if (!baselinePath) {
    console.error(
      "Usage: bun run evaluate.mjs <run.json> [candidate.json]"
    );
    process.exit(2);
  }

  try {
    const baseline = loadRun(baselinePath, "baseline");
    const output = candidatePath
      ? compareRuns(baseline, loadRun(candidatePath, "candidate"))
      : summarizeRun(baseline);
    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
