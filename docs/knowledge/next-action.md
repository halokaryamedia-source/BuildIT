# Next Action

Updated: 2026-09-06 — recurring Geometry surface-gap diagnostic prepared in REMOTE_GITHUB; targeted LOCAL live proof is next.

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`.

## Status

```text
GATEWAY: SOURCE_READY / LIVE PROOF NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
SHARED AUTHORING SURFACE: SOURCE_UPDATED / LOCAL PROOF NEXT
3D_ASSISTED ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER: ENGINE SOURCE_READY / PUBLIC BINDING LOCAL_CODE REQUIRED
MCP RESOURCE/PROMPT/HANDOFF: AUDITED / LOCAL_CODE IMPLEMENTATION REQUIRED
TEST LAYERS: RUNTIME / AUTHORING / REPOSITORY SPLIT; FULL GATE NON-DUPLICATING
REMOTE TEST/CLOSURE CLEANUP: MCP VERIFY GREEN @ 6e44fef / BROADER LOCAL verify:full STILL PENDING
SURFACE GAP DIAGNOSTIC: SOURCE + REGRESSION HARNESS UPDATED / TARGETED LIVE TEST NEXT
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Immediate Local Handoff

1. For the recurring Geometry hole/gap defect, use the targeted path first; do **not** run full Local Acceptance just to validate this fix:
   - pin exact `Local`;
   - from `mcp/`, run `bun test tests/authoring-quality-diagnostics.test.ts`;
   - deploy exact plugin with `bun run deploy:local -- /absolute/path/to/blockit_mcp.js`, reload BlockIT once;
   - run `bun run verify:surface-gap-live -- --confirm-disposable`;
   - on the real rejected asset, use one `inspect_model_bounds` call plus fresh affected view(s).
   - expected diagnostic: a local same-plane panel hole reports `Possible coplanar edge-gap` with the Cube UUID pair and distance; the warning disappears after the seam is closed.
2. Only when broader Local acceptance/contract work is resumed, run `bun install --frozen-lockfile` then `bun run verify:full`. Do not make that full gate part of the surface-gap edit loop.
3. Close the MCP contract in one LOCAL_CODE delivery:
   - canonical workflow: Requirement Gate, `DIRECT | 3D_ASSISTED`, no fallback, 3D-Assisted route, coverage invariant, Geometry approval → native production UV → Texture approval → Animation;
   - move Animation prose into the canonical prompt and strengthen `promptContract` override invariants;
   - synchronize `authoringPhase` readiness with approval semantics;
   - synchronize `switch_authoring_phase` with `target_phase + reason + readiness + resume_from` and no normal reconnect instruction;
   - add `animations://{id}` summary Resource;
   - stop advertising bare `validator://checks`; keep `validator://checks/{id}`;
   - do not add duplicate Cube/Group/workspace/capability/material Resources.
4. Regenerate in the same delivery: `prompts:build` → `docs:build` → `verify:full`. Commit generated prompt/docs output; never hand-edit it.
5. Deploy exact plugin; prove Gateway lifecycle and a disposable DIRECT flow through Geometry APPROVED → UV Layout PASS → Texture APPROVED → optional Animation → Finalization.
6. Continue 3D_ASSISTED GPU proof, bind the existing materializer as one Geometry capability, regenerate docs, prove atomic Undo, then run end-to-end 3D_ASSISTED.

## Non-Goals

No automatic strategy/provider routing, DIRECT fallback, fifth Gateway tool, `from_geo_json`, resource-per-tool mirror, duplicate workspace/capability registry, SDK migration, or test-count reduction as a proxy for coverage quality.
