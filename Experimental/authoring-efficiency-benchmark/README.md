# Authoring Efficiency Benchmark

Status:

```text
BENCHMARK HARNESS READY
LIVE BASELINE PENDING
NO AUTHORING EFFICIENCY CLAIM YET
```

This package measures **Cost to Accepted Result** for reference-driven BlockIT Geometry work. It is a bounded evaluation harness, not production capability and not a substitute for live visual acceptance.

## Goal

Compare two exact BlockIT revisions under the same fixed cases and environment:

```text
quality PASS on every required case
+
observable authoring cost does not regress
+
material cost decreases
→ efficiency improvement may be claimed
```

If quality is not accepted, the comparison is blocked regardless of call count.

## Fixed suite

`cases.json` is the benchmark-case authority. Version 1 uses three approved Clockwork geometry references already owned by the active workspace:

| Case | Complexity | Purpose |
|---|---|---|
| `clockwork-signal-lamp` | small | compact rigid housing / proportion / contact |
| `clockwork-spike-floor-trap` | medium | compact repeated forms / height hierarchy / floor contact |
| `clockwork-power-ring` | large | multi-part mechanical form / major negative space / cross-view coherence |

All three are **Geometry-only**. Texture and animation are intentionally excluded so phase changes do not confound the first benchmark.

## Run controls

For a valid comparison:

1. pin an exact 40-character `Local` commit SHA and loaded `build_identity`;
2. use the same Blockbench/client class and Geometry phase for baseline and candidate;
3. start each case from a fresh project and fresh agent/client session;
4. make the actual approved reference image visible before authoring;
5. use the target dimensions and case notes from `cases.json`;
6. do **not** inspect the existing approved `.bbmodel` or `.geo.json` listed as `forbidden_baselines` until the case quality verdict is final;
7. do not preload later-phase specialists or use texture/animation to repair Geometry;
8. save benchmark artifacts/results only to ignored local `.cache/` paths.

The existing approved model is retained only as project history/current asset state; it must not become an answer key during the benchmark run.

## Quality gate

Each case declares `required_quality_dimensions`. Every required dimension must be manually judged from the actual reference and fresh model evidence as one of:

```text
PASS
FAIL
UNVERIFIED
```

The evaluator accepts an efficiency comparison only when **both baseline and candidate are PASS on every required dimension for every case**.

## Observable cost

Each session records non-negative integer counts only for work the running agent can actually observe:

```text
total_mcp_calls
discovery_calls
redundant_readbacks
tool_search_calls
tool_search_misses
view_captures
correction_attempts
same_cause_retries
undo_recovery_actions
phase_handoffs
broad_state_reads
```

Optional `tool_counts` can identify call hotspots. Do not invent token counts, latency, or hidden reasoning metrics.

## Result format

A run JSON contains:

```text
schema_version = 1
suite          = clockwork-geometry-v1
run_id
revision       = exact 40-char git SHA
build_identity = sha256:<64 lowercase hex>
environment
sessions[]     = exactly one result for each case
```

Keep live result files local, for example:

```text
workspace/active/Clockwork/.cache/authoring-efficiency/baseline.json
workspace/active/Clockwork/.cache/authoring-efficiency/candidate.json
```

Do not commit routine benchmark result snapshots. Git history owns code changes; local result files are disposable evidence unless a specific review explicitly requires a retained artifact.

## Evaluate

From `mcp/`:

```bash
bun run eval:authoring-efficiency -- \
  ../workspace/active/Clockwork/.cache/authoring-efficiency/baseline.json \
  ../workspace/active/Clockwork/.cache/authoring-efficiency/candidate.json
```

One file prints a validated run summary. Two files produce per-case and aggregate deltas.

The evaluator deliberately has **no weighted efficiency score**. Cost vectors are classified conservatively:

```text
IMPROVED   every observed cost is <= baseline and at least one is lower
UNCHANGED  all observed costs are equal
REGRESSED  every observed cost is >= baseline and at least one is higher
TRADEOFF   some costs improve while others worsen
```

Overall comparison is blocked when quality is not PASS. A `TRADEOFF` requires human diagnosis; it is not automatically an improvement.

## Static routing proxy

`bun run eval:tool-discovery` remains useful before a live benchmark when tool names/descriptions/routing guidance changed. It is only a static search proxy and cannot replace the live benchmark.

## Current boundary

No live baseline numbers are committed or claimed yet. Establishing the first baseline requires an actual desktop Blockbench + MCP + fresh client authoring run. Until that happens, Authoring Efficiency remains `LOCAL PROOF REQUIRED`.
