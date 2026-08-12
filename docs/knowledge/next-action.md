# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want another local Codex/Blockbench run yet. Functional local acceptance already exists. Repository/static work must use the smallest relevant proof; do not manually rerun broad or unrelated tests when the existing CI gate already covers the changed contract.

## Cleaned Baseline

Current static hardening retains the audited Bedrock capability while reducing avoidable context/work:

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

These are serialized surface measurements, not client token/context measurements. Do not claim overall token savings from them.

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

Normal authoring route:

```text
intent + fresh known state / UUIDs + stage
→ exact loaded tool: call directly
→ otherwise one precise tool_search
→ execute → reuse returned state
```

Do not use repository search, Graphify, or Obsidian for ordinary asset tool selection.

## P0 Decision-Loop Hardening

Implemented on `Local`:

```text
DISCOVER → AUTHOR → VERIFY → CORRECT → VERIFY → DONE
```

- fresh known identity/state cannot regress to discovery without a stale/ambiguous reason;
- texturing and animation route directly from intent + known state;
- unchanged intent gets one precise `tool_search` plus at most one reformulation;
- redundant discovery/readback/re-search and repeated same-direction correction are stopped.

## P1 Tool Discovery Eval

Implemented as a **static retrieval proxy**, not local Codex proof:

- `mcp/scripts/evaluate-tool-discovery.ts` builds the default 62-tool search corpus from current tool metadata using the upstream Codex MCP search fields;
- 104 curated human-style intent cases cover 52 high-value/ambiguous expected tools while every enabled default tool remains a ranking competitor;
- reports Top-1 accuracy, Top-3 recall, Top-8 recall, mean reciprocal rank, recurring Top-1 collision pairs, and Top-8 misses;
- ranking is a dependency-free BM25 proxy pinned to the inspected upstream Codex source revision; exact installed-client tokenizer/ranking remains `LOCAL PROOF REQUIRED`;
- the regression is exercised inside the existing `bun test` contract gate, so CI does **not** add a second discovery-eval run.

The first purpose of this eval is measurement. Do not tune descriptions to an invented target before reading the emitted collision baseline.

## Evidence Boundary

GitHub/CI can prove corpus construction, curated cases, deterministic proxy metrics, buildability, and regression integrity. It cannot prove the user's installed Codex/model makes the same search choice, nor real latency/token behavior.

Do not pre-emptively add a router/profile/server split, disable retained tools, or add another search framework because of a static proxy result.

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

P1 TOOL DISCOVERY EVAL — IMPLEMENTED ON LOCAL.
Proof budget: one normal MCP Verify run only; no manual broad reruns unless a relevant gate fails.

NEXT PROPOSED — review the emitted P1 collision baseline. If recurring semantic collisions are material, tune only those tool descriptions/search terms and add a measured floor from the observed baseline. Do not mass-edit descriptions, add a custom router/profile/server split, start the error-recovery framework, or run local Codex/Blockbench without separate approval.
```
