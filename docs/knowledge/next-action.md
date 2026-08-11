# Next Action

Updated: 2026-08-12

This is the **single active repository-continuation snapshot**. Root `AGENTS.md` still owns task routing.

## Active Goal

Complete a **static pre-local efficiency cleanup** before any new Codex + Blockbench run.

The user explicitly does **not** want another local run yet. Functional local acceptance already exists; the current phase is repository/source cleanup so the next local run happens only after the known static AI-slop and usage-waste boundaries have been reduced as far as source evidence safely allows.

## Current Status

`PRE_LOCAL_EFFICIENCY_CLEANUP_ACTIVE`

Working branch: **`Local` only**.

Already completed in this cleanup:

- exact single-text JSON mirrors of `structuredContent` are compacted at the MCP reconstruction boundary;
- concise text summaries, images, and canonical structured data are preserved;
- regression coverage prevents the exact mirror from returning silently;
- completed local-acceptance procedure is no longer default continuation context.

## In Scope Before The Next Local Run

1. remove other source-provable response/output waste without weakening useful evidence;
2. make high-frequency read/discovery defaults bounded and summary-first where source evidence already supports it;
3. reduce repeated instruction ownership across root routing, asset orchestrator, specialists, and MCP workflow prompt while preserving one clear owner for every invariant;
4. remove stale/current-state contradictions from active documentation and tests;
5. improve client-facing schema clarity where this can be done without adding a router/profile or broadening capability;
6. remove dead/duplicate repository guidance and generated-context paths that are not active product/runtime requirements;
7. keep CI/static gates green after each bounded slice.

## Do Not Do Yet

Until static cleanup is exhausted, do **not**:

- ask for or run another local Codex/Blockbench acceptance pass;
- create a custom router/profile/readiness framework;
- default-disable retained Bedrock Animation/Paint/Texture/Locator/material capability merely to reduce tool count;
- infer token/latency savings that the client has not measured;
- replace the current MCP/Blockbench transport or schema architecture;
- reopen unrelated historical/deferred feature work.

## Static Cleanup Rule

Fix now when the waste is directly visible in source, for example:

- duplicated payload representation;
- oversized default reads with a clear smaller normal path;
- repeated active instructions with an existing canonical owner;
- stale continuation/status text;
- ambiguous public descriptions that predictably invite invalid calls;
- dead default surface entries or guidance already superseded by current product rules.

Defer to the eventual local run when the claim depends on client behavior, for example:

- whether Codex injects all 62 schemas or uses deferred search;
- actual prompt/skill co-loading;
- actual retry frequency;
- image/token/latency cost in the client.

## Continuation Boot

For this cleanup:

```text
AGENTS.md
→ this file
→ affected source + nearest AGENTS.md
→ one relevant specialist only when needed
```

Read `CONTEXT.md`, foundation docs, reviews, or the old local-acceptance runbook only when a concrete cleanup decision depends on them.

## Protected Product Invariants

- Minecraft Bedrock Entity remains the default product.
- Tool success is execution evidence, not visual approval.
- Visual gates remain `FAIL / UNVERIFIED / PASS`; `BLOCKED` remains valid.
- Reuse fresh returned state before redundant reads.
- Production texture/animation must not hide unresolved material geometry.
- Preserve native Bedrock capability; do not fake gaps with generic Mesh, risky evaluation, UI automation, or another format.

## Next Step

```text
STATIC — continue source/context efficiency cleanup; no local run yet.
```

The local efficiency trace becomes the final validation stage only after this static cleanup reaches a stable, CI-green boundary.
