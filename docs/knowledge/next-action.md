# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns routing; proof detail lives in `docs/foundation/validation-report.md`; source ownership lives in `implementation-map.md`.

## Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

The user explicitly does **not** want another local Codex/Blockbench run yet. Functional local acceptance already exists. Source-provable cleanup and the follow-up GitHub-only pretest hardening are complete and CI-green.

## Cleaned Baseline

Current static hardening covers:

- duplicate MCP result representation: exact JSON mirrors of `structuredContent` are compacted centrally;
- metadata-first filesystem export after verified path writes;
- compact normal defaults for project hierarchy, outline/search, and undo-history reads while explicit larger bounds remain available;
- `list_locator_elements` is identity/type/parent discovery only; `inspect_element` owns detailed Locator/Null Object state;
- asset-authoring and repository-development instructions are split by their existing owners instead of being co-loaded by ritual;
- `CONTEXT.md` is stable facts only; stale local-acceptance/current-state routing is removed;
- runtime prompt bundle contains only callable `bedrock_entity_workflow`; maintainer API/eval Markdown is source-only;
- active skill routing is regression-checked against the canonical `.agents/skills/` packages;
- generated state remains source-owned and freshness-checked.

## GitHub-Only Pretest Hardening

The verification workflow pins Bun through root `.bun-version` at **1.3.14** and runs an isolated real `initialize → tools/list` measurement through the current stateless HTTP path.

Fresh serialized default-surface baseline:

```text
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034
```

Compared with the historical accepted static measurement, descriptions are smaller but schema and total serialized characters are larger. These are **serialization measurements, not token/context measurements**. Do not claim overall client savings from these character counts.

CI guards the fresh surface with small regression headroom while retaining exactly 62 default tools. Actual serialized Locator schemas are also checked: `manage_locator` and `manage_null_object` expose all relevant fields with only `action` top-level-required; `name`/`id` descriptions preserve create/update requirements while runtime validation keeps the original discriminated union.

## Native Deferred MCP Discovery

Current upstream Codex source establishes the intended efficient path when tool search is available:

```text
MCP initialize + tools/list
→ catalog retained client-side
→ MCP tools registered as deferred
→ tool_search ranks/searches deferred tools
→ only matching tool specs are loaded for model use
```

This means the full 74,996-character `tools/list` response is a **client/catalog serialization cost**, not proof that all 62 schemas are placed in every model turn.

BuildIT sends a compact MCP initialization description: **386 characters**. This gives native deferred search useful namespace context without embedding the 6k workflow prompt.

No custom MCP router, new registration profile, server split, or tool deletion was added. All 62 default capabilities remain available.

Normal asset routing is now deterministic in the existing compact `blockit-bedrock-entity-mcp` orchestrator:

```text
intent + known returned state / UUIDs + authoring stage
→ select semantic route
→ exact tool already loaded: call it
→ otherwise: one precise native tool_search
→ execute → reuse returned state
```

For ordinary asset tool selection, do **not** search repository files/source/docs or invoke Graphify/Obsidian. Repository search starts only for an actual plugin/source task or reproduced defect. Routing/skill/doc changes now trigger MCP Verify automatically.

## Evidence Boundary

Upstream Codex behavior resolves the architecture question: **native deferred MCP tool search exists** and is the preferred retrieval owner rather than a BuildIT MCP router. What remains unverified without a future local run is the exact behavior of the installed Codex version/model and real token/context/latency numbers.

Do not redesign these from static guessing:

- actual prompt/skill co-loading in the installed client;
- real token/context/latency savings;
- actual invalid-call retry frequency;
- realistic image/context cost;
- whether an older/non-tool-search client needs a restricted `enabled_tools` compatibility configuration.

Also do not pre-emptively add another router/profile/readiness framework, split the MCP server into many endpoints, mass-trim legitimate schemas, impose arbitrary global output limits, or default-disable retained Bedrock Animation/Paint/Texture/Locator/material capability merely to reduce counts.

## Continuation Boot

For a future repository task, load only what changes the decision:

```text
AGENTS.md
→ this file when continuing current work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ development-brief for a create/change task
→ at most one relevant specialist
```

The completed Local Acceptance Runbook is history/procedure only unless explicitly reactivated.

## Next Step

```text
WAIT LOCAL — do not run local until the user explicitly requests testing.

NEXT GITHUB/CI TASK — P0 DECISION-LOOP HARDENING:
1. Lock authoring stage: DISCOVER → AUTHOR → VERIFY → CORRECT → DONE; known fresh state must not regress to discovery.
2. Make texturing + animation route directly from intent + known state.
3. Allow one precise tool_search + at most one reformulation per unchanged intent.
4. Add anti-loop guards for redundant discovery, readback, re-search, and same-direction retry.

Do not start discovery-eval, error-recovery framework, tool→source/test index, router/profile/server split, or local Codex/Blockbench work in this step.
```