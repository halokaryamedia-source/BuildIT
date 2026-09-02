# Next Action

Updated: 2026-09-02 — PrimitiveAnything Cuboid POC prepared; local geometry proof required before any production integration

Working branch: **`Local` only**.

This file owns active continuation only. Stable facts → `CONTEXT.md`; complete capability contracts → `docs/knowledge/mcp-capability-backlog.md`; proof → `docs/knowledge/current-validation.md`; source ownership → `docs/knowledge/implementation-map.md`; local procedure → `docs/knowledge/operations/local-acceptance-runbook.md`.

## Current Status

```text
ROUTE 1: IMAGE_GLB_SELECTED → GLB_REFERENCE_LOADED → PRIMITIVEANYTHING_POC_PREPARED → LOCAL_POC_REQUIRED
MCP: BASE_EXTENDED_DESIGN_LOCKED → LOCAL_IMPLEMENTATION_REQUIRED
```

Do not reopen Route 1 image-only vs image+GLB selection. Do not restart broad feature research while the current PrimitiveAnything gate is unresolved.

## Local Order

```text
1. git switch Local && git pull --ff-only
2. cd mcp && bun install --frozen-lockfile
3. establish a clean verifier baseline
4. resolve the legacy registration-profile name collision with capability EXTENDED
5. prove how same-phase EXTENDED definitions are made reachable with the current client/transport before broad routing implementation
   → do not combine this with an SDK/transport migration unless current mechanics cannot satisfy the contract
6. Core/project lifecycle consolidation
7. Route 1 sample GLB load into Blockbench — completed
   → bounded PrimitiveAnything POC is prepared under Experimental/primitiveanything-poc
   → run local Gate 0 / Gate 1 proof before any Route 1 production Cube integration
8. Texturing consolidation
9. Animation consolidation
10. implement final BASE / EXTENDED exposure/reuse from the consolidated owners
11. regenerate prompts/docs, run `bun run verify:mcp`, measure final surfaces
12. deploy/reconnect and run representative BASE, EXTENDED, reuse, and cross-phase handoff fixtures
```

Route 1 exact alignment/test flow lives in `Experimental/route1-hunyuan-poc/README.md` and the local runbook. The new bounded external-solver experiment lives in `Experimental/primitiveanything-poc/README.md`. Alignment math is already prepared in `mcp/lib/route1ReferenceAlignment.ts` with `mcp/tests/route1-reference-alignment.test.ts`.

## Locked Boundaries

```text
BASE / EXTENDED are the only capability-category names.
Same-phase BASE ↔ EXTENDED must not require reload/reconnect/reset.
Foreign phase still uses HANDOFF_REQUIRED.
Do not add packs, a second router, extra Route 1 formats, non-uniform GLB scaling, or a new alignment tool without reproduced need.
Do not add production MCP mesh→Cube conversion before the PrimitiveAnything local POC passes.
The currently authorized mesh→Cuboid work is isolated to Experimental/primitiveanything-poc only.
Public ToolSpec/schema/runtime-prompt changes require LOCAL_CODE + Bun generators.
```

Completion is proof-bound: static/source ready ≠ local PASS ≠ live PASS.

## Route 1 external-method boundary

The previous user-deferred Cube boundary is now satisfied by a new explicitly approved method: **PrimitiveAnything learned primitive decomposition followed by deterministic all-Cuboid substitution**.

The only reactivated path is:

```text
approved elephant GLB
→ stock PrimitiveAnything
→ inspect mixed primitive assembly (Gate 0)
→ deterministic canonical-primitive AABB substitution to oriented Cuboids
→ inspect pure-Cuboid preview (Gate 1)
→ open generated Bedrock geo.json in Blockbench as native Groups + Cubes
→ save .bbmodel only after visual PASS
```

The POC must remain isolated under `Experimental/primitiveanything-poc/` until local proof exists. Do not reopen the discarded direct-GLB-to-Cube, voxel, visual-hull, greedy cuboid-fit, CoACD/OBB, or semantic-guess routes as continuation steps. Do not integrate this path into `mcp/**`, texture it, animate it, or perform production Cube cleanup before Gate 0 and Gate 1 pass on the approved elephant GLB.
