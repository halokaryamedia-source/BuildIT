# Next Action

Updated: 2026-09-05 — local/Codex handoff active

Working branch: **`Local` only**. Continuation only; facts → `CONTEXT.md`, proof → `current-validation.md`, procedure → `operations/local-acceptance-runbook.md`.

## Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
DIRECT AUTHORING: SOURCE_READY / LOCAL SMOKE NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
3D_ASSISTED: DESIGN_LOCKED / IMPLEMENTATION PENDING
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

## Ordered Next Steps

1. **Local/Codex baseline** — follow the Local Acceptance Runbook: exact `Local` checkout, `bun run verify:mcp`, deploy exact plugin, configure Codex through the four-tool Gateway, then prove Runtime offline→online, Geometry↔Texturing handoff, plugin reload, and Blockbench close/open in one Codex task with zero manual MCP reconnect/new chat.

2. **DIRECT smoke** — one small disposable asset with approved reference, dimensions, `DIRECT`, `Animation Required=NO`; complete Geometry approval/checkpoint → Texturing approval/checkpoint → Finalization → editable `.bbmodel`.

3. **Thin 3D-Assisted orchestrator** — reuse pinned POCs only:

```text
Active Workspace
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1
→ Shape GLB Gate → persist shape.glb/state
→ PrimitiveAnything
→ Decomposition Gate → persist primitive-decomposition.json/state
```

No provider framework and no Blockbench Cube authoring in the external orchestrator.

4. **External pipeline proof** — one representative fixture must reach acceptable `shape.glb` and primitive decomposition. Bad external output stops here; do not compensate in Runtime.

5. **Dedicated Geometry materializer** — only after Step 4 PASS: validate active-workspace state/schema/hashes, prevalidate all primitives, one atomic Undo transaction, one temporary `pa_<id>` Group/Bone + Cube per primitive, complete scaffold or no accepted scaffold.

6. **End-to-end `3D_ASSISTED`** — materialize → Semantic Geometry Cleanup → remove live Shape GLB → Geometry approval → Texturing approval → optional Animation → Finalization.

## Non-Goals

No automatic strategy classifier, provider router, GLB-only/PrimitiveAnything-only product route, fifth Gateway tool, `from_geo_json` revival, automatic fallback to `DIRECT`, or benchmark/profile framework before one representative end-to-end proof.
