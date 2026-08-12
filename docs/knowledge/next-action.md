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
- asset-authoring instructions are split by owner: routing → orchestrator → one active domain specialist;
- repository-development instructions are split by owner: root routing → compact development brief → package rules → at most one specialist;
- `CONTEXT.md` is stable facts only; stale local-acceptance/current-state routing is removed;
- runtime prompt bundle contains only callable `bedrock_entity_workflow`; maintainer API/eval Markdown is source-only;
- active skill routing is regression-checked against the canonical `.agents/skills/` packages;
- generated state remains source-owned and freshness-checked.

## GitHub-Only Pretest Hardening

The verification workflow now pins Bun through root `.bun-version` at **1.3.14** and runs an isolated real `initialize → tools/list` measurement through the current stateless HTTP path.

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

CI now guards the fresh surface with small regression headroom while retaining exactly 62 default tools.

Actual serialized Locator schemas were also checked. `manage_locator` and `manage_null_object` expose all relevant fields with only `action` top-level-required; their `name` and `id` field descriptions preserve explicit `action=create` / `action=update` requirements. Runtime validation still uses the original discriminated-union schema. Do not split tools or redesign registration solely to make the static JSON Schema prettier.

## Deliberately Not Changed From Static Guessing

Do not redesign these until a future user-requested local trace supplies client evidence:

- whether Codex injects all 62 schemas or uses deferred/native tool search;
- actual prompt/skill co-loading;
- real token/context/latency savings;
- actual invalid-call retry frequency;
- realistic image/context cost.

Also do not pre-emptively add a router/profile/readiness framework, mass-trim legitimate schemas, impose arbitrary global output limits, or default-disable retained Bedrock Animation/Paint/Texture/Locator/material capability merely to reduce counts.

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
WAIT — GitHub-only pretest hardening complete; do not run local until the user explicitly requests testing or a new product task requires it.
```
