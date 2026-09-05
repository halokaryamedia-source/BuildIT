# Next Action

Updated: 2026-09-05 — industrial elevator geometry incident documented; correction active

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

Industrial elevator is **reopened at Geometry** and Texturing is paused. Baseline: `workspace/active/industrial-elevator/industrial-elevator.bbmodel`; active live rebuild is not an accepted checkpoint; reference remains authority.

Prior z-fighting/overlap closure is not visual acceptance. Repair front-shell continuity and left-glass segmentation from a whole-form surface map, then capture fresh views and obtain explicit Geometry approval. Only after that, generate the native UV template, verify valid UVs, author pixel-level styling from the atlas, run Texture Verify, and obtain explicit Texture approval. Do not begin Animation before corrected Authoring is accepted.

### Required learning flow for the next correction

1. Restate the authority: approved reference image, `5×5×6` blocks (`80×80×96` units), `DIRECT`, and canonical front entrance.
2. Write the semantic surface map before coordinates: closed shell regions, door opening, left glass span, panel boundaries, intentional negative spaces, and attachment/contact invariants.
3. Author the primary shell as continuous cohorts. Every gap must be intentional and named; every required boundary must be covered by an adjacent volume.
4. Audit the whole model, not only bounds: front/3⁄4/left/back/top/bottom views plus gap, seam, penetration, and contact review.
5. Stop at `READY_FOR_USER_REVIEW`; user approval is required before UV Layout/Texturing.
6. Generate the native template only after Geometry approval. The tool must select all model elements, return a valid UV atlas, and fail closed otherwise.
7. Paint exact atlas pixels from the actual UV layout. No guessed UVs, stretched reference image, flat color fill, or texture used to hide geometry.
8. Verify fresh atlas and mapped model views. Then request Texture approval; only afterward start the required door animation.
