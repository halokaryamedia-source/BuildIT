# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want another local Codex/Blockbench run yet. Use the smallest relevant repository/static proof; do not manually rerun broad or unrelated tests when existing CI covers the changed contract.

## Cleaned Baseline

Retained Bedrock capability uses compact structured results, bounded summary-first reads, returned-state reuse, separated asset/repository routing, one runtime prompt (`bedrock_entity_workflow`), and regression-checked ownership.

## GitHub-Only Pretest Hardening

Bun **1.3.14**; isolated `initialize → tools/list`:

```text
62 tools
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters
```

These are serialized surface measurements, not client token/context measurements.

## Native Deferred MCP Discovery

```text
MCP initialize + tools/list
→ client-side deferred catalog
→ tool_search
→ matching tool specs loaded when needed
```

**native deferred MCP tool search exists**. Current upstream uses BM25 with default limit 8. BuildIT retains all 62 capabilities and the compact **386 characters** initialization description; no custom MCP router is added.

## P0–P4 Efficiency Hardening

Implemented on `Local`:

```text
P0  DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE
P1  raw static proxy:    Top-1 .5096 / Top-3 .7981 / Top-8 .9231 / MRR .6652
P2  exact-name loading:  Top-1 .8173 / Top-3 .9808 / Top-8 1.0000 / MRR .8990
P3  validation/identity/stale/no-effect/capability failures → bounded recovery
P4  named hot-path defect → mapped source + primary regression first
```

P2 uses `tool_search("<exact_tool_name> <semantic action>")` only after semantic routing selected the tool; one reformulation keeps the same name, then `BLOCKED`. P3 consumes existing failure signals instead of adding a recovery framework. P4 is repository-only navigation, not asset runtime routing.

## Post-P4 Current-State Synchronization

Completed:

- dashboard/minimal-nav/activation/source maps now agree on named-tool defect routing;
- skill inventory reflects exact-name loading + bounded recovery without new skills;
- README/MCP README, Validation Report, Review Index, Task Board, Implementation Map, and this snapshot agree on current status/measurements;
- current review navigation no longer says local acceptance is the next stage; historical review bodies/runbook remain provenance;
- audit-time helper names in the durable decision log are explicitly non-routing provenance under current source precedence;
- P4 corrected `get_project_info` and `inspect_model_bounds`; `get_undo_stack` is indexed, while `undo`/`redo` remain source-owned until a specific regression owner is justified.

No runtime behavior or local proof changed in this synchronization.

## Evidence Boundary

GitHub/CI proves routing/recovery/ownership text, mapped source/test paths, static retrieval, buildability, and regression integrity. Installed Codex/model decisions, live Blockbench behavior, latency, and real token savings remain local-proof questions when explicitly needed.

## Continuation Boot

```text
AGENTS.md
→ this file
→ CONTEXT.md only if stable facts matter
→ named MCP-tool defect? Implementation Map Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ development-brief
→ at most one relevant specialist
```

## Next Step

```text
WAIT LOCAL — do not run local until the user explicitly requests testing.

P0–P4 EFFICIENCY HARDENING + POST-P4 CURRENT-STATE SYNC — IMPLEMENTED ON LOCAL.
Proof budget: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT — WAIT for the next product/defect task or explicit local-proof request. Do not add more routing/recovery architecture or expand the ownership index without a real defect proving the bounded path insufficient.
```
