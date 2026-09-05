# Next Action

Updated: 2026-09-06 — MCP Resource/Prompt audit complete; canonical local regeneration required before plugin-surface edits

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`; procedure → local acceptance runbook.

## Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
CODEX AUTHORING BOOT: SOURCE_UPDATED / LOCAL PROOF NEXT
SHARED AUTHORING SURFACE: SOURCE_UPDATED / LOCAL PROOF NEXT
DIRECT AUTHORING: SOURCE_READY / LOCAL SMOKE NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
3D_ASSISTED EXTERNAL ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER ENGINE: SOURCE_READY / PUBLIC MCP BINDING LOCAL_CODE REQUIRED
MCP RESOURCE/PROMPT SURFACE: AUDITED / LOCAL_CODE IMPLEMENTATION REQUIRED
RUNTIME PROMPT CONTRACT: DIRECT|3D_ASSISTED + APPROVAL/UV/VALIDATOR/ANIMATION SYNC REQUIRED
ANIMATION RESOURCE: animations://{id} PLANNED / GENERATED API DOCS REQUIRED
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

## Immediate Local Handoff

1. Pin exact `Local`; run `bun install --frozen-lockfile`, `bun run verify:authoring`, `bun run verify:repository`, then `bun run verify:mcp` before changing public MCP contracts.
2. Implement one coherent MCP Resource/Prompt refresh without redoing the audit:
   - canonical `mcp/prompts/bedrock_entity_workflow.md`: add the Requirement Gate; user-selected `DIRECT | 3D_ASSISTED`; no automatic fallback; explicit 3D-Assisted route; surface-coverage/gap invariant; user Geometry approval before production UV; native UV/template flow; `validator://status` summary-first routing; Texture approval before Animation handoff;
   - move Animation workflow prose out of hardcoded `mcp/server/prompts.ts` into the canonical prompt and strengthen `mcp/lib/promptContract.ts` so compatible overrides preserve the material workflow invariants;
   - add one concise read-only `animations://{id}` Resource for Animation/AnimationController overview while keeping authored bone/state/keyframe/effect detail in `inspect_animation`;
   - remove the invalid bare `validator://checks` collection advertisement from validator status while retaining `validator://checks/{id}` detail URIs;
   - do **not** add duplicate Cube/Group/workspace/capability Resources or a materials Resource without a demonstrated context use case.
3. Update the affected Resource/Prompt contract tests and canonical resource docs owner; run `bun run prompts:build`, `bun run docs:build`, `bun run docs:check`, `bun run verify:authoring`, `bun run verify:repository`, then `bun run verify:mcp`. Carry `prompts/manifest.json` and generated MCP docs in the same logical delivery; never hand-edit generated output.
4. Deploy the exact plugin and use a fresh/restarted Codex session from that worktree. Before authoring mutation, prove current `AGENTS.md` → current `blockit-bedrock-entity-mcp` → matching current specialist.
5. Run one disposable `DIRECT` smoke: Geometry internal verify → user Geometry approval → native UV template/UV PASS → Texturing/Texture Verify → user Texture approval → optional Animation → Finalization.
6. Continue external `3D_ASSISTED` proof; then bind the existing materializer locally, run docs checks + `verify:mcp`, prove atomic Undo behavior, then end-to-end `3D_ASSISTED`.

## Active Workspace

No active asset project. `workspace/active/README.md` is the only retained active-workspace file. The industrial-elevator asset was test data and was intentionally removed; do not resume it.

## Non-Goals

No automatic strategy/provider router, partial 3D route, fifth Gateway tool, arbitrary decomposition input, `from_geo_json` revival, automatic `DIRECT` fallback, benchmark/profile framework, resource-per-tool mirror, duplicate workspace/capability registry, or remembered/stale Skill content substituting for the current worktree.
