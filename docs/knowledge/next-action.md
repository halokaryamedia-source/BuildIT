# Next Action

Updated: 2026-09-06 — Covered-gap correction and current live-verifier contract prepared; live proof remains pending.

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`.

## Status

```text
GATEWAY: SOURCE_READY / LIVE PROOF NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
SHARED AUTHORING SURFACE: SOURCE_READY / LIVE PROOF NEXT
SURFACE GAP DIAGNOSTIC: SOURCE_READY / TARGETED LIVE PROOF NEXT
MCP RESOURCE/PROMPT/HANDOFF: LOCAL_CODE IMPLEMENTATION REQUIRED
3D_ASSISTED: ORCHESTRATOR SOURCE_READY; MATERIALIZER PUBLIC BINDING + GPU/LIVE PROOF PENDING
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Next

1. Surface-gap defect only:
   - `cd mcp`
   - `bun test tests/authoring-quality-diagnostics.test.ts tests/surface-gap-live-contract.test.ts`
   - `bun run deploy:local -- /absolute/path/to/blockit_mcp.js`; reload BlockIT once.
   - `bun run verify:surface-gap-live -- --confirm-disposable`
   - On the rejected asset, call `inspect_model_bounds` once plus fresh affected view(s). Expected: an open gap warns; contact or complete coplanar coverage clears the pair warning; hiding its cover restores it. Mock-contract CI is not live/visual proof.
   - Do **not** run full Local Acceptance or `verify:full` just for this defect.
2. Remaining audit owners: `cubes.ts` provisional UV packing + per-target batch feedback; `element-inspection.ts` actual UV rotation/pixel-axis density. Reproduce with targeted tests before editing. Then `bun install --frozen-lockfile` → close Resource/Prompt/handoff + generated prompt/docs → `bun run verify:full` → deploy/Gateway/DIRECT smoke.
3. Continue 3D_ASSISTED GPU proof, bind the existing materializer, regenerate docs, prove atomic Undo, then end-to-end 3D_ASSISTED.
