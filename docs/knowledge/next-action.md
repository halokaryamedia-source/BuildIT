# Next Action

Updated: 2026-09-06 — Geometry correction and mapped-UV diagnostic owners updated; remaining audit work and live proof stay explicit.

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`.

## Status

```text
GATEWAY: SOURCE_READY / LIVE PROOF NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
SHARED AUTHORING SURFACE: SOURCE_READY / LIVE PROOF NEXT
SURFACE GAP DIAGNOSTIC: SOURCE_READY / TARGETED LIVE PROOF NEXT
GEOMETRY/UV CORRECTION: SOURCE_UPDATED / REMOTE CI REQUIRED; LOCAL LIVE PROOF PENDING
MCP RESOURCE/PROMPT/HANDOFF: LOCAL_CODE IMPLEMENTATION REQUIRED
3D_ASSISTED: ORCHESTRATOR SOURCE_READY; MATERIALIZER PUBLIC BINDING + GPU/LIVE PROOF PENDING
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
ACTIVE ASSET: NONE
```

## Completed Source Scope

- `cubes.ts` + `boxUvLayout.ts`: provisional capacity failure no longer rejects valid Geometry; malformed numeric state still fails closed. Inherited per-face Geometry is not gated by a Box-UV footprint. UV mode changes count as authored effects, true no-ops still fail before Undo, create returns reusable state, and batch returns per-target state/effects.
- `element-inspection.ts`: aspect diagnostics use actual face rotation and physical pixel-axis scaling when available. Per-Cube density is linear; per-axis density remains visible rather than hidden in an area average.
- Existing correction/quality regression owners cover these behaviors, including isolated registered-tool fixtures. Fixtures are not desktop Blockbench evidence.
- No public input schema, ToolSpec, canonical runtime prompt, or generated output was changed by this bounded delivery.

## Next

1. Verify this delivery's exact commit through **MCP Verify** and **Repository Verify**. Inspect any failure before editing. Then in the receiving checkout run the targeted owners: `cd mcp` → `bun test tests/model-effectiveness-correction-accuracy.test.ts tests/authoring-quality-diagnostics.test.ts`. Do not repeat the full audit.
2. Remaining audit implementation is **not completed**:
   - native texture template adapter against Blockbench `v5.1.6`: density, async failure/cancellation, postcondition rollback, existing-atlas rebuild, and returned audit;
   - `paint.ts`: size-2 requests must not silently enter the one-pixel path;
   - UV atlas hygiene: distinguish meaningful collapsed UV faces from genuinely zero-area Geometry;
   - public discovery schemas and remaining retired-tool recovery messages;
   - Resource/Prompt/handoff approval/native-UV semantics plus canonical generated closure;
   - verifier ordering so `build` cannot overwrite a stale manifest before freshness checks; proof/ownership synchronization against completed evidence.
3. Public schema/prompt changes require `LOCAL_CODE`: `bun install --frozen-lockfile`, canonical `prompts:build` / `docs:build`, committed generated output, then `bun run verify:full`. Do not hand-edit generated output or use Actions to author it. The user's reported `5.16` was interpreted as `5.1.6`; confirm installed identity during later live work, not from this source inspection.
4. Surface-gap live proof remains separate:
   - `bun test tests/authoring-quality-diagnostics.test.ts tests/surface-gap-live-contract.test.ts`
   - `bun run deploy:local -- /absolute/path/to/blockit_mcp.js`; reload BlockIT once.
   - `bun run verify:surface-gap-live -- --confirm-disposable`
   - On the rejected asset, call `inspect_model_bounds` once plus fresh affected view(s). An open gap warns; contact or complete coplanar coverage clears the pair warning; hiding its cover restores it. Mock-contract CI is not live/visual proof.
   - Do **not** run full Local Acceptance or `verify:full` just for the surface-gap defect.
5. After source closure: deploy exact plugin, prove Gateway/DIRECT smoke and Geometry/UV correction, then continue 3D_ASSISTED GPU proof, bind the existing materializer with generated docs, prove atomic Undo, and run end-to-end 3D_ASSISTED. User approval and visual/Undo/persistence proof remain live-only.
