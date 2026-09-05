# Next Action

Updated: 2026-09-05 — Codex authoring routing hardened; local/live proof next

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
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

## Immediate Local Handoff

1. Pin exact `Local`; run `bun install --frozen-lockfile`, `bun run verify:authoring`, `bun run verify:repository`, then `bun run verify:mcp`.
2. Deploy exact plugin and use a fresh/restarted Codex session from that worktree. Before authoring mutation, prove current `AGENTS.md` → current `blockit-bedrock-entity-mcp` → matching current specialist.
3. Run one disposable `DIRECT` smoke: Geometry internal verify → user Geometry approval → native UV template/UV PASS → Texturing/Texture Verify → user Texture approval → optional Animation → Finalization.
4. Continue external `3D_ASSISTED` proof; then bind the existing materializer locally, run docs checks + `verify:mcp`, prove atomic Undo behavior, then end-to-end `3D_ASSISTED`.

## Active Workspace

No active asset project. `workspace/active/README.md` is the only retained active-workspace file. The industrial-elevator asset was test data and was intentionally removed; do not resume it.

## Non-Goals

No automatic strategy/provider router, partial 3D route, fifth Gateway tool, arbitrary decomposition input, `from_geo_json` revival, automatic `DIRECT` fallback, benchmark/profile framework, or remembered/stale Skill content substituting for the current worktree.
