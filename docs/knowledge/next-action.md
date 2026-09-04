# Next Action

Updated: 2026-09-05 — local/Codex handoff active

Working branch: **`Local` only**. Continuation only; facts → `CONTEXT.md`, proof → `current-validation.md`, procedure → `operations/local-acceptance-runbook.md`.

## Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
DIRECT AUTHORING: SOURCE_READY / LOCAL SMOKE NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
3D_ASSISTED EXTERNAL ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER ENGINE: SOURCE_READY / PUBLIC MCP BINDING LOCAL_CODE REQUIRED
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

## Ordered Next Steps

1. **Local baseline** — exact `Local`, `bun install --frozen-lockfile`, `bun run verify:mcp`; deploy exact plugin and connect Codex only through the four-tool Gateway.
2. **Gateway + DIRECT proof** — prove Runtime offline→online, Geometry↔Texturing, plugin reload/Blockbench close-open in one task, then one disposable `DIRECT` asset through approval/checkpoints/Finalization.
3. **External `3D_ASSISTED` proof** — run `bun run three-d-assisted:run -- run --workspace <absolute-active-workspace>`. Review/accept Shape candidate, resume, review/accept PrimitiveAnything decomposition. Bad external output stops at its owning gate.
4. **Bind materializer locally** — expose `materializeThreeDAssistedScaffoldFromWorkspace` as one Geometry Runtime ToolSpec accepting only `workspace_path`; keep Gateway at four tools. Then run `bun run docs:build`, `bun run docs:check`, `bun run verify:mcp`.
5. **Live materializer proof** — stale/hash/schema failure mutates nothing; valid decomposition creates one `pa_<id>` Group/Bone + Cube per primitive in one Undo unit; Undo restores the pre-materialization state.
6. **End-to-end `3D_ASSISTED`** — materialize → Cuboid Gate → Semantic Geometry Cleanup → remove live Shape GLB → Geometry approval → Texturing → optional Animation → Finalization.

## Non-Goals

No automatic strategy classifier, provider router, GLB-only/PrimitiveAnything-only route, fifth Gateway tool, arbitrary decomposition path/primitive-array input, `from_geo_json` revival, automatic fallback to `DIRECT`, or benchmark/profile framework before representative end-to-end proof.
