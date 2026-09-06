# Next Action

Updated: 2026-09-06 — TCP/brush/export repairs in `a8219c3`; texture/public-contract audit work remains.

Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

```text
GATEWAY: SOURCE_READY / LIVE PROOF PENDING
SHARED AUTHORING SURFACE: SOURCE_READY / LIVE PROOF PENDING
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
GEOMETRY/UV CORRECTION: SOURCE_UPDATED / LOCAL LIVE PROOF PENDING
SURFACE GAP DIAGNOSTIC: SOURCE_READY / TARGETED LIVE PROOF NEXT
MCP RESOURCE/PROMPT/HANDOFF: LOCAL_CODE IMPLEMENTATION REQUIRED
3D_ASSISTED: ORCHESTRATOR SOURCE_READY; PUBLIC BINDING + GPU/LIVE PROOF PENDING
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Next

1. Do not repeat the audit or completed Geometry/UV and TCP/brush/export fixes. TCP waits for new data; size-2 uses native Painter; no-path export returns content. Regression owners: `p1-stateless-net-integration.test.ts`, `texture-authoring-contract.test.ts`, `prelocal-generic-semantics.test.ts`. Reuse accepted exact-SHA proof under `GITHUB_RULES.md`; CI is not native Blockbench proof.
2. Close remaining owners:
   - `texture.ts`: native template density, async failure/cancellation, rollback, existing-atlas rebuild, returned audit, and meaningful collapsed-UV hygiene.
   - Public discovery schemas, retired-tool recovery hints, Resource/Prompt/handoff approval and native-UV semantics.
   - Review the audited SDK advisory; regenerate a compatible lockfile in `LOCAL_CODE`.
   - Synchronize proof/ownership only against actual evidence.
3. Transfer to `LOCAL_CODE` for canonical generators: `bun install --frozen-lockfile` → `prompts:build` / `docs:build` with committed outputs → `bun run verify:full`. No hand-edited generated output or Actions authoring. Reported `5.16` was interpreted as `5.1.6`; confirm installed identity during live work.
4. Surface-gap proof stays separate: deploy exact plugin, reload once, then `bun run verify:surface-gap-live -- --confirm-disposable`. Open gap warns; contact/complete coverage clears it; hiding cover restores it. Inspect affected bounds/views once; no full Local Acceptance solely for this defect.
5. After source closure: Gateway/DIRECT smoke → 3D_ASSISTED GPU proof → public materializer binding + generated docs → live atomic Undo → end-to-end. CI/mocks never prove desktop rendering, persistence, or user approval.
