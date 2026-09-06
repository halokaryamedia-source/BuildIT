# Next Action

Updated: 2026-09-06 — bounded TCP/brush/export audit repairs delivered in source. Texture/public-contract audit work is not complete.

Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

```text
GATEWAY: SOURCE_READY / LIVE PROOF PENDING
SHARED AUTHORING SURFACE: SOURCE_READY / LIVE PROOF PENDING
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
GEOMETRY/UV CORRECTION: SOURCE_UPDATED / LOCAL LIVE PROOF PENDING
TCP/BRUSH/EXPORT REPAIRS: SOURCE_UPDATED / EXACT-COMMIT CI REQUIRED
SURFACE GAP DIAGNOSTIC: SOURCE_READY / TARGETED LIVE PROOF NEXT
MCP RESOURCE/PROMPT/HANDOFF: LOCAL_CODE IMPLEMENTATION REQUIRED
3D_ASSISTED: ORCHESTRATOR SOURCE_READY; PUBLIC BINDING + GPU/LIVE PROOF PENDING
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Next

1. Do not repeat the audit or completed Geometry fixes: provisional UV capacity, UV mode-change preflight, per-target feedback, and actual-rotation/pixel-axis diagnostics. The bounded pre-local repair also removes incomplete-request TCP re-entry, limits direct exact-pixel writes to brush size 1, and restores no-path export content while retaining metadata-first filesystem writes. Primary regressions are `p1-stateless-net-integration.test.ts`, `texture-authoring-contract.test.ts`, and `prelocal-generic-semantics.test.ts`. Reuse successful exact-SHA CI under `GITHUB_RULES.md`; source/CI proof is not native Blockbench proof.
2. Close remaining owners:
   - `texture.ts`: native template density, async failure/cancellation, rollback, existing-atlas rebuild, returned audit, and meaningful collapsed-UV hygiene.
   - Public discovery schemas, remaining retired-tool recovery hints, Resource/Prompt/handoff approval and native-UV semantics.
   - Review the audited SDK advisory and regenerate a compatible lockfile in `LOCAL_CODE`; dependencies were not changed by the bounded repair.
   - Synchronize proof/ownership only against actual evidence.
3. Schema/prompt changes require `LOCAL_CODE`: `bun install --frozen-lockfile` → canonical `prompts:build` / `docs:build` with committed outputs → `bun run verify:full`. No hand-edited generated output or Actions authoring. The remote repair context had no usable checkout/Bun/generator execution; transfer these owners before implementation. Reported `5.16` was interpreted as `5.1.6`; confirm installed identity during live work.
4. Surface-gap proof stays separate: deploy exact plugin, reload once, then `bun run verify:surface-gap-live -- --confirm-disposable`. Open gap warns; contact/complete coverage clears it; hiding cover restores it. Inspect the rejected asset once with `inspect_model_bounds` + fresh affected views. No full Local Acceptance solely for this defect.
5. After source closure: Gateway/DIRECT smoke → 3D_ASSISTED GPU proof → public materializer binding + generated docs → live atomic Undo → end-to-end. CI/mocks never prove desktop rendering, persistence, or user approval.
