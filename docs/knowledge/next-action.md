# Next Action

Updated: 2026-09-06 — 3D_ASSISTED preparation; GPU/live testing deferred by user. Proof: `current-validation.md`.

Branch: **`Local` only**. Proof → `current-validation.md`.

## Status

```text
GATEWAY: BASIC LIVE PASS / 4 FIXED CLIENT TOOLS
SHARED AUTHORING SURFACE: SOURCE 47; LAST LIVE 46; ANIMATION 19
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
GEOMETRY/UV CORRECTION: REGRESSIONS PASS; ASSET QUALITY UNVERIFIED
SURFACE GAP DIAGNOSTIC: TARGETED LIVE PASS
MCP RESOURCE/PROMPT/HANDOFF: SOURCE + GENERATORS + BASIC LIVE PASS
3D_ASSISTED: ORCHESTRATOR + PUBLIC BINDING SOURCE_READY; ENVIRONMENT PREFLIGHT PASS
3D_ASSISTED GPU / NATIVE UNDO / ASSET QUALITY: NOT_RUN / DEFERRED
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Next

1. Do not repeat completed Geometry/UV or texture/discovery repairs. Legacy `mcp` files were removed; canonical `blockit_mcp.js` deployment and Gateway reconnect were verified on Blockbench 5.1.6.
2. STOP at preparation. Environment/weights are installed and preflight passed without inference. Setup/run commands: `mcp/scripts/three-d-assisted/README.md`. Do not deploy, run GPU/live tests, or create an asset until the user resumes testing.
3. For actual asset authoring, obtain the approved reference, dimensions, user-selected strategy, and Animation requirement. Internal PASS only means READY_FOR_USER_REVIEW. Geometry APPROVED → UV Layout PASS → user Texture APPROVED + checkpoint → optional Animation handoff.
4. When testing is resumed: choose explicit intake → external GPU Shape/Decomposition gates → deploy verified binding → Gateway materializer native Undo/stale-state proof → end-to-end. No fallback or fifth Gateway tool. Earlier disposable tests do not establish new binding/asset quality.
5. RTX 3070 8 GB CUDA visibility is proven; peak inference VRAM capacity is not. Keep internal review gates and bounded retries. Installed runtime is unchanged by this preparation.
