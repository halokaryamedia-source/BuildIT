# Next Action

Updated: 2026-09-06 — remaining source and basic desktop acceptance completed on Local; exact evidence in `current-validation.md`.

Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

```text
GATEWAY: BASIC LIVE PASS / 4 FIXED CLIENT TOOLS
SHARED AUTHORING SURFACE: LIVE PASS / 46 TOOLS; ANIMATION 19
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
GEOMETRY/UV CORRECTION: REGRESSIONS PASS; ASSET QUALITY UNVERIFIED
SURFACE GAP DIAGNOSTIC: TARGETED LIVE PASS
MCP RESOURCE/PROMPT/HANDOFF: SOURCE + GENERATORS + BASIC LIVE PASS
3D_ASSISTED: ORCHESTRATOR SOURCE_READY; PUBLIC BINDING + GPU/LIVE PROOF PENDING
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Next

1. Do not repeat completed Geometry/UV or texture/discovery repairs. Legacy `mcp` files were removed; canonical `blockit_mcp.js` deployment and Gateway reconnect were verified on Blockbench 5.1.6.
2. Next implementation stage: external `3D_ASSISTED` GPU proof → public materializer binding behind the existing Gateway + generated docs → live atomic Undo/stale-state proof → end-to-end. No fallback or fifth Gateway tool.
3. For actual asset authoring, obtain the approved reference, dimensions, user-selected strategy, and Animation requirement. Internal PASS only means READY_FOR_USER_REVIEW. Geometry APPROVED → UV Layout PASS → user Texture APPROVED + checkpoint → optional Animation handoff.
4. Disposable native-template/brush/rebuild/Undo and surface-gap tests passed. They do not approve geometry, UV layout, styling, or any historical/rejected asset. Inspect an explicitly resumed asset with fresh evidence; none is active now.
5. Re-run local acceptance only after material source/runtime changes. Template regression: `cd mcp` → `bun run scripts/verify-template-live.ts --confirm-disposable` (installed Python/Pillow required). Full command and proof boundaries remain in `current-validation.md`.
