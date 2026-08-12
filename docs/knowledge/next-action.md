# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want another local Codex/Blockbench run yet. Repository/static work must use the smallest relevant proof; do not manually rerun broad or unrelated tests when existing CI covers the changed contract.

## Cleaned Baseline

Retained Bedrock capability already uses compact structured results, bounded summary-first reads, returned-state reuse, asset/repository routing separation, one runtime prompt (`bedrock_entity_workflow`), and regression-checked generated/skill ownership.

## GitHub-Only Pretest Hardening

Bun is pinned to **1.3.14**; isolated `initialize → tools/list` proof remains:

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

**native deferred MCP tool search exists**. Upstream search uses BM25 with default limit 8 over tool identity, title/description, namespace description, and top-level input-schema property names. BuildIT keeps **386 characters** initialization instructions and all 62 retained default capabilities; no custom MCP router is added.

## P0 Decision-Loop Hardening

Implemented:

```text
DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE
```

Fresh identity/state does not regress to discovery without a stale/ambiguous reason. Unchanged intent gets one search plus at most one reformulation; redundant discovery/readback/re-search and repeated same-direction correction stop.

## P1 Tool Discovery Eval

Static proxy only; installed-client/model behavior remains `LOCAL PROOF REQUIRED`.

```text
104 cases / 52 expected tools / 62 competitors
raw Top-1 0.5096
raw Top-3 0.7981
raw Top-8 0.9231
raw MRR   0.6652
```

Raw semantic search is diagnostic, not a reason to mass-edit tool descriptions.

## P2 Exact-Name Deferred Spec Loading

Implemented:

```text
semantic route selects exact tool
→ exact spec loaded? call directly
→ else tool_search("<exact_tool_name> <semantic action>")
→ one reformulation keeps the same exact name
→ second miss = BLOCKED
```

Routed static proxy:

```text
Top-1  0.8173
Top-3  0.9808
Top-8  1.0000
MRR    0.8990
```

Because native search returns up to 8 matches and the route already knows the target, Top-8 presence is the correctness gate; Top-1 is diagnostic.

## P3 Deterministic Hot-Path Recovery

Implemented as a **decision contract over existing failure signals**, not a recovery framework.

```text
validation/schema failure → INVALID_INPUT    → repair args; same tool; no search
ambiguous target          → TARGET_AMBIGUOUS → resolve exact UUID once; same tool
not-found unknown ref     → TARGET_NOT_FOUND → focused identity lookup; same tool
known UUID now not found  → STALE_STATE      → one focused refresh; same tool
no authored effect        → NO_EFFECT        → diagnose/change payload; never resend
unsupported capability    → CAPABILITY_MISMATCH → reroute once if supported, else BLOCKED
```

Current source already exposes the required signals: Zod validates before execute; shared identity resolution distinguishes ambiguous/not-found; Cube correction rejects no-authored-effect requests; format/capability failures are explicit. Recovery therefore does not add result payload fields, an error router, global error enum, profile, server split, or another MCP layer.

## P4 Hot-Path Defect Ownership Index

Implemented as a **repository-only first-stop index**, not runtime routing.

```text
named MCP-tool defect
→ docs/knowledge/implementation-map.md Hot-Path Defect Index
→ mapped source owner + primary regression owner
→ inspect those first
→ broaden to caller/helper/code search only if they cannot explain the defect
```

The index covers the highest-value project, Cube, hierarchy/discovery, camera, Locator, texture/PBR, animation, and export tools. It is intentionally not a 62-tool dependency graph. The mapped regression is the first falsification target, not a command to load every adjacent test.

## Evidence Boundary

GitHub/CI can prove routing/recovery/ownership text, source/test paths, static retrieval, buildability, and regression integrity. It cannot prove installed Codex/model decisions, live Blockbench behavior, latency, or real token savings.

## Continuation Boot

```text
AGENTS.md
→ this file
→ CONTEXT.md only if stable facts change the decision
→ named MCP-tool defect? implementation-map Hot-Path Defect Index
→ affected source + nearest AGENTS.md
→ development-brief
→ at most one relevant specialist
```

## Next Step

```text
WAIT LOCAL — do not run local until the user explicitly requests testing.

P4 HOT-PATH DEFECT OWNERSHIP INDEX — IMPLEMENTED ON LOCAL.
Proof budget: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT PROPOSED — WAIT for the next product/defect task or an explicit local-proof request. Do not add more routing/recovery architecture or expand the ownership index without a real defect showing that the current bounded path is insufficient.
```