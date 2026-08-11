# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` owns task routing.

## Current Goal

Hold the cleaned `Local` baseline stable until the user explicitly chooses the next product task or asks to begin a new local efficiency test.

The user explicitly does **not** want another local Codex/Blockbench run yet. Functional local acceptance already exists, and the source-provable efficiency cleanup requested after that pass is now complete.

## Current Status

```text
PRE_LOCAL_EFFICIENCY_CLEANUP_COMPLETE
```

Working branch: **`Local` only**.

## Static Cleanup Completed

### MCP result / output waste

- exact single-text JSON mirrors of `structuredContent` are compacted centrally;
- canonical structured data, meaningful text summaries, and images are preserved;
- filesystem export remains metadata-first when a path already delivers the artifact;
- regression coverage prevents exact structured/text duplication from returning silently.

### Read / discovery defaults

- `get_project_info` uses a bounded top-level Group summary;
- `list_outline` defaults to a compact hierarchy while larger explicit bounds remain available;
- targeted element discovery defaults to 50 results while explicit larger limits remain available;
- undo history defaults to 20 recent entries while deeper history remains explicitly available.

### Context / instruction ownership

- root `AGENTS.md` owns routing/proof discipline only;
- the asset orchestrator owns MCP lane/state reuse rather than modelling judgement;
- modelling, texturing, and animation specialists own their domain decisions without repeated cross-domain procedure;
- `CONTEXT.md` contains stable facts rather than active routing/procedure;
- stale local-acceptance routing was removed from active docs.

### Runtime prompt / schema guidance

- runtime prompt bundle contains only callable `bedrock_entity_workflow`;
- maintainer API/eval Markdown remains source reference and is not runtime-bundled;
- Locator/Null Object create/update branch intent is explicit in client-facing descriptions;
- current discriminated-union runtime validation is retained; no tool split/router was added.

### Regression / generated state

- static efficiency budgets lock instruction sizes, compact normal read defaults, 62 enabled tools, and a bounded default description surface;
- generated MCP docs/runtime manifest are synchronized through their build owner;
- capability count and retained Bedrock families were not reduced merely to make the catalog smaller.

## Intentionally Deferred Until A Future User-Requested Local Test

Static source cannot establish:

- whether Codex injects all 62 schemas or uses native deferred/tool search;
- actual prompt/skill co-loading behavior;
- real token/context/latency savings;
- actual invalid-call retry frequency;
- image/context cost during realistic authoring.

These remain future evidence questions. Do not redesign registration architecture from static counts alone.

## Do Not Reopen By Default

- custom router/profile/readiness frameworks;
- default-disabling retained Bedrock Animation/Paint/Texture/Locator/material capability;
- mass schema trimming based only on size;
- global arbitrary token/output limits;
- completed local-acceptance procedure;
- historical/deferred feature slices without a new reproduced defect or explicit product requirement.

## Protected Product Invariants

- Minecraft Bedrock Entity remains the default product.
- Tool success is execution evidence, not visual approval.
- Visual gates remain `FAIL / UNVERIFIED / PASS`; `BLOCKED` remains valid.
- Reuse fresh returned state before redundant reads.
- Production texture/animation must not hide unresolved material geometry.
- Preserve native Bedrock capability; do not fake gaps with generic Mesh, risky evaluation, UI automation, Hytale, or another format.

## Continuation Boot

For future repository work:

```text
AGENTS.md
→ this file
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ one relevant specialist only when needed
```

The completed Local Acceptance Runbook is history/procedure only unless explicitly reactivated.

## Next Step

```text
WAIT — static cleanup complete; do not run local until the user explicitly requests testing or a new product task.
```
