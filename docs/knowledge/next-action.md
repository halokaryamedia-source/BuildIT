# Next Action

Updated: 2026-09-06 — Geometry/UV source delivered in `4fa0092`; remaining audit work is not complete.

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

1. Do not repeat the audit or completed Geometry fixes: provisional UV capacity, UV mode-change preflight, per-target feedback, and actual-rotation/pixel-axis diagnostics. In the receiving checkout: `cd mcp` → `bun test tests/model-effectiveness-correction-accuracy.test.ts tests/authoring-quality-diagnostics.test.ts`.
2. Close remaining owners:
   - `texture.ts`: native template density, async failure/cancellation, rollback, existing-atlas rebuild, returned audit, and meaningful collapsed-UV hygiene.
   - `paint.ts`: size-2 requests must not silently write one pixel.
   - Public discovery schemas, remaining retired-tool recovery hints, Resource/Prompt/handoff approval and native-UV semantics.
   - Freshness ordering: `build` must not overwrite a stale manifest before comparison. Synchronize proof/ownership only against actual evidence.
3. Schema/prompt changes require `LOCAL_CODE`: `bun install --frozen-lockfile` → canonical `prompts:build` / `docs:build` with committed outputs → `bun run verify:full`. No hand-edited generated output or Actions authoring. Reported `5.16` was interpreted as `5.1.6`; confirm installed identity during live work.
4. Surface-gap proof stays separate: deploy exact plugin, reload once, then `bun run verify:surface-gap-live -- --confirm-disposable`. Open gap warns; contact/complete coverage clears it; hiding cover restores it. Inspect the rejected asset once with `inspect_model_bounds` + fresh affected views. No full Local Acceptance solely for this defect.
5. After source closure: Gateway/DIRECT smoke → 3D_ASSISTED GPU proof → public materializer binding + generated docs → live atomic Undo → end-to-end. CI/mocks never prove desktop rendering, persistence, or user approval.
