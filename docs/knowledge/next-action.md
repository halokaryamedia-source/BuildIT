# Next Action

Updated: 2026-09-05 — authoring correction active

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`; procedure → local acceptance runbook.

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

1. **Local baseline** — exact `Local`; `bun install --frozen-lockfile`; `bun run verify:mcp`; deploy exact plugin; Codex uses the four-tool Gateway only.
2. **Gateway + AUTHORING proof** — Runtime offline→online; Geometry/Texturing startup focus must expose the same AUTHORING catalog; prove AUTHORING↔Animation handoff and restart/reload in one task.
3. **DIRECT smoke** — disposable asset through Geometry surface/cohort review, UV quality, Texture Verify, approvals, and Finalization.
4. **External `3D_ASSISTED` proof** — `bun run three-d-assisted:run -- run --workspace <absolute-active-workspace>`; accept Shape and PrimitiveAnything only at their gates.
5. **Bind materializer locally** — expose `materializeThreeDAssistedScaffoldFromWorkspace` as one Geometry ToolSpec taking only `workspace_path`; keep Gateway at four tools; run docs checks + `verify:mcp`.
6. **Live materializer proof** — stale/hash/schema failure mutates nothing; valid materialization is one Undo unit and Undo restores prior state.
7. **End-to-end `3D_ASSISTED`** — materialize → Cuboid Gate → cleanup → remove Shape GLB → Geometry approval → Texturing → optional Animation → Finalization.

## Non-Goals

No automatic strategy/provider router, partial 3D route, fifth Gateway tool, arbitrary decomposition input, `from_geo_json` revival, automatic `DIRECT` fallback, or benchmark/profile framework before end-to-end proof.

## Current Asset Handoff

Industrial elevator is **reopened at Geometry + UV quality**. Baseline: `workspace/active/industrial-elevator/industrial-elevator.bbmodel`; reference remains authority.

Prior z-fighting closure is not visual acceptance. Repair observed structural/cohort defects, then UV face proportion, texel density, orientation, seam/padding, and semantic reuse. Do not begin Animation before corrected Authoring is accepted.
