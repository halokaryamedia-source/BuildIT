# Next Action

Updated: 2026-09-05 — authoring-surface correction active

Working branch: **`Local` only**. Continuation only; facts → `CONTEXT.md`, proof → `current-validation.md`, procedure → `operations/local-acceptance-runbook.md`.

## Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
SHARED AUTHORING SURFACE: SOURCE_UPDATED / LOCAL TOOLS-LIST PROOF NEXT
DIRECT AUTHORING: SOURCE_READY / LOCAL SMOKE NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
3D_ASSISTED EXTERNAL ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER ENGINE: SOURCE_READY / PUBLIC MCP BINDING LOCAL_CODE REQUIRED
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
```

## Ordered Next Steps

1. **Local baseline** — exact `Local`, `bun install --frozen-lockfile`, `bun run verify:mcp`; deploy exact plugin and connect Codex only through the four-tool Gateway.
2. **Gateway + shared AUTHORING proof** — prove Runtime offline→online, Geometry/Texturing startup focus exposing the same AUTHORING capabilities, bounded Geometry↔Texturing corrections without phase switching, then AUTHORING↔Animation handoff, plugin reload, and Blockbench close/open in one task.
3. **DIRECT quality smoke** — one disposable asset through Geometry surface/cohort review, UV quality review, Texture Verify, approval/checkpoints, and Finalization.
4. **External `3D_ASSISTED` proof** — run `bun run three-d-assisted:run -- run --workspace <absolute-active-workspace>`. Review/accept Shape candidate, resume, review/accept PrimitiveAnything decomposition. Bad external output stops at its owning gate.
5. **Bind materializer locally** — expose `materializeThreeDAssistedScaffoldFromWorkspace` as one Geometry Runtime ToolSpec accepting only `workspace_path`; keep Gateway at four tools. Then run `bun run docs:build`, `bun run docs:check`, `bun run verify:mcp`.
6. **Live materializer proof** — stale/hash/schema failure mutates nothing; valid decomposition creates one `pa_<id>` Group/Bone + Cube per primitive in one Undo unit; Undo restores the pre-materialization state.
7. **End-to-end `3D_ASSISTED`** — materialize → Cuboid Gate → Semantic Geometry Cleanup → remove live Shape GLB → Geometry approval → Texturing focus in shared AUTHORING → optional Animation → Finalization.

## Non-Goals

No automatic strategy classifier, provider router, GLB-only/PrimitiveAnything-only route, fifth Gateway tool, arbitrary decomposition path/primitive-array input, `from_geo_json` revival, automatic fallback to `DIRECT`, or benchmark/profile framework before representative end-to-end proof.

## Current Asset Handoff

Industrial elevator is **reopened at Geometry surface/cohort + UV quality**, using `workspace/active/industrial-elevator/industrial-elevator.bbmodel` as the editable baseline. The approved visual authority remains `workspace/active/industrial-elevator/references/approved-reference.png` and the current atlas remains available as evidence, not as accepted mapping.

Do not trust the prior “shell z-fighting correction complete” closure as visual acceptance. User review explicitly reported recurring z-fighting/gap appearance and disorganized UV mapping. Repair only observed structural/cohort defects first, then rebuild/remap affected UVs with face proportion, texel-density, orientation, seam/padding, and semantic-reuse checks before Texture Styling. Do not begin Animation until the user accepts the corrected Authoring result.
