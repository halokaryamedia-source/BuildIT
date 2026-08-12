# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want another local Codex/Blockbench run yet. Repository/static work must use the smallest relevant proof; do not manually rerun broad or unrelated tests when the existing CI gate already covers the changed contract.

## Cleaned Baseline

Static hardening retains the audited Bedrock capability while reducing avoidable work:

- exact JSON mirrors of `structuredContent` are compacted centrally;
- project/outline/search/history/Locator discovery use bounded summary-first defaults;
- mutation-returned identity/state is reused instead of confirmation reads;
- asset authoring bypasses repository-development history/context unless source work is actually needed;
- runtime prompt bundle contains only `bedrock_entity_workflow`;
- generated state and active skill references remain source-owned and regression-checked.

## GitHub-Only Pretest Hardening

The workflow pins Bun **1.3.14** and measures a real isolated `initialize → tools/list` path.

```text
62 tools
74,996 tools/list response characters
51,810 input-schema characters
10,885 description characters
initialize instructions: 386 characters
```

These are serialized surface measurements, not client token/context measurements.

## Native Deferred MCP Discovery

Current upstream Codex establishes the intended architecture when tool search is available:

```text
MCP initialize + tools/list
→ client-side deferred catalog
→ tool_search
→ matching tool specs loaded when needed
```

**native deferred MCP tool search exists**; BuildIT therefore does not add a custom MCP router. Current upstream uses BM25 with a default search limit of 8. MCP search text includes tool identity, title/description, namespace description, and top-level input-schema property names.

BuildIT keeps compact **386 characters** initialization instructions and all 62 retained default capabilities.

## P0 Decision-Loop Hardening

Implemented on `Local`:

```text
DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE
```

Fresh known identity/state cannot regress to discovery without a stale/ambiguous reason. Texturing and animation route directly from intent + known state. Unchanged intent gets one search plus at most one reformulation; redundant discovery/readback/re-search and repeated same-direction correction stop.

## P1 Tool Discovery Eval

Implemented as a **static retrieval proxy**, not local Codex proof:

- 104 human-style cases cover 52 high-value/ambiguous expected tools against all 62 enabled default tools;
- raw semantic-stress baseline: Top-1 **0.5096**, Top-3 **0.7981**, Top-8 **0.9231**, MRR **0.6652**;
- reports collision pairs and Top-8 misses;
- exact installed-client/model behavior remains `LOCAL PROOF REQUIRED`.

The raw baseline is diagnostic. It must not become a reason to mass-edit descriptions if normal authoring already knows the selected tool before deferred loading.

## P2 Exact-Name Deferred Spec Loading

Implemented on `Local` as the cheaper response to P1 collisions:

```text
intent + fresh state + stage
→ deterministic semantic route selects exact tool
→ exact spec loaded? call directly
→ otherwise tool_search("<exact_tool_name> <semantic action>")
→ one reformulation keeps the same exact tool name
→ second miss = BLOCKED
```

`tool_search` is therefore a **spec loader after routing**, not a second router. Raw user wording must not be sent alone after the route already selected `place_cube`, `manage_locator`, `configure_material`, `animation_graph_editor`, etc.

The routed-loading static proxy reuses the same 104 cases with the already-selected exact tool identity included in the query. First measured result:

```text
Top-1  0.8173
Top-3  0.9808
Top-8  1.0000
MRR    0.8990
```

Because upstream `tool_search` returns up to 8 matches and routing already knows the exact tool, **Top-8 presence is the correctness gate**; Top-1 is only an efficiency diagnostic. The contract gate therefore requires routed Top-8 **1.0**, Top-3 **>= 0.95**, and improvement over the raw semantic-stress baseline.

No public tool-description mass edit, new router/profile, server split, or capability reduction is part of P2. Public descriptions should be tuned only if exact-name routed loading still misses materially.

## Evidence Boundary

GitHub/CI can prove routing text, static proxy retrieval, buildability, generated-doc freshness, and regression integrity. It cannot prove the user's installed Codex/model makes the same search choice or establish real latency/token savings.

## Continuation Boot

```text
AGENTS.md
→ this file
→ CONTEXT.md only if stable facts change the decision
→ affected source + nearest AGENTS.md
→ development-brief
→ at most one relevant specialist
```

## Next Step

```text
WAIT LOCAL — do not run local until the user explicitly requests testing.

P2 EXACT-NAME DEFERRED SPEC LOADING — IMPLEMENTED ON LOCAL.
Proof budget: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT PROPOSED — deterministic error recovery for the highest-frequency tools only. Start from observed failure classes (invalid input, missing/ambiguous target, stale state, no-effect/capability mismatch); do not build a global recovery framework, tool→source index, router/profile/server split, or local Codex/Blockbench run without separate approval.
```
