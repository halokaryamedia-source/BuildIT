# Next Action

Updated: 2026-09-05 — authoring correction active

Working branch: **`Local` only**. Continuation only; facts → `CONTEXT.md`, proof → `current-validation.md`, procedure → `operations/local-acceptance-runbook.md`.

## Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
SHARED AUTHORING SURFACE: SOURCE_UPDATED / LOCAL PROOF NEXT
DIRECT AUTHORING: SOURCE_READY / LOCAL SMOKE NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
3D_ASSISTED EXTERNAL ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER ENGINE: SOURCE_READY / PUBLIC MCP BINDING LOCAL_CODE REQUIRED
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

## Ordered Next Steps

1. **Local baseline** — exact `Local`, `bun install --frozen-lockfile`, `bun run verify:mcp`; deploy exact plugin; Codex uses only four-tool Gateway.
2. **Gateway + AUTHORING proof** — Runtime offline→online; Geometry/Texturing startup focus expose the same AUTHORING catalog; then AUTHORING↔Animation handoff, plugin reload, Blockbench close/open in one task.
3. **DIRECT quality smoke** — disposable asset through Geometry surface/cohort review, UV quality, Texture Verify, approvals, Finalization.
4. **External `3D_ASSISTED` proof** — `bun run three-d-assisted:run -- run --workspace <absolute-active-workspace>`; explicit Shape + PrimitiveAnything decomposition gates.
5. **Bind materializer locally** — expose `materializeThreeDAssistedScaffoldFromWorkspace` as one Geometry ToolSpec accepting only `workspace_path`; keep Gateway at four tools; `docs:build`, `docs:check`, `verify:mcp`.
6. **Live materializer proof** — stale/hash/schema failure mutates nothing; Undo restores pre-materialization state.
7. **End-to-end `3D_ASSISTED`** — materialize → Cuboid Gate → cleanup → remove Shape GLB → Geometry approval → Texturing focus → optional Animation → Finalization.

## Non-Goals

No automatic strategy classifier/provider router, GLB-only/PrimitiveAnything-only route, fifth Gateway tool, arbitrary decomposition input, `from_geo_json` revival, automatic `DIRECT` fallback, or benchmark/profile framework before representative end-to-end proof.

## Current Asset Handoff

Industrial elevator is **reopened at Geometry surface/cohort + UV quality**. Editable baseline: `workspace/active/industrial-elevator/industrial-elevator.bbmodel`; approved reference remains authority.

Do not trust the prior “shell z-fighting correction complete” closure as visual acceptance. User review reports recurring z-fighting/gap appearance and disorganized UV mapping. Repair observed structural/cohort defects first; then remap affected UVs with face proportion, texel density, orientation, seam/padding, semantic-reuse checks; then Texture Styling. Do not begin Animation until user accepts corrected Authoring result.
