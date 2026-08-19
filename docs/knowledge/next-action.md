# Next Action

Updated: 2026-08-19

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
PRO-1–PRO-8 STATIC HARDENING RETAINED
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
ANIMATION_D1_EFFECT_MUTATION_SOURCE_IN_LOCAL
ANIMATION_D2_CONTROLLER_EFFECT_SOURCE_IN_LOCAL
ANIMATION_D3_MATH_PROPERTY_SOURCE_IN_LOCAL
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_FIXED
ANIMATION_D5_EFFECT_SUMMARY_COUNTS_FIXED
ANIMATION_CREATE_INSPECT_MODIFY_SYMMETRY_STATIC_AUDIT_COMPLETE
ANIMATION_FINAL_STATIC_ARCHITECTURE_AUDIT_COMPLETE
ANIMATION_LOCAL_SOURCE_INTEGRATION_STATIC_VERIFIED
ANIMATION_GENERATED_ARTIFACTS_STALE
ANIMATION_CANONICAL_CI_EXECUTION_NOT_OBSERVED
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub discipline is owned by `GITHUB_RULES.md`; do not duplicate it here.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental browser proof below does not upgrade desktop MCP claims. Visual fidelity, playback, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**. Static/source/CI evidence proves only its matching surface.

## Animation Source In Local

Integrated commit:

```text
33784de067525e8fcdd2510d6195c7b2ac85187e
feat(animation): integrate effect and Molang closure
```

Historical preflight candidate: `8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c`.

Integrated scope:
- D1 `manage_animation_effects`: particle/sound/timeline add-update-remove, exact inspected identity, snapping/collision/no-op preflight, one Undo, native point cap, split-on-move, final-point removal, preview `file` preservation, strict schemas, inspector/export-compatible continuation.
- D2 extends `manage_animation_controller` with controller-state sound/particle lifecycle; no new controller tool.
- D3 extends `animation_timeline` with `set_anim_time_update` / `set_blend_weight`; no `math_animation`.
- runtime registration calls `registerAnimationEffectTools()` inside the existing animation family.
- canonical docs-manifest source includes `animationEffectToolDocs`.
- static surface owner expects exactly 64 default tools.
- regression owners for D1/D2/D3 are present in `Local`.

Static lifecycle remains coherent:

```text
transform keys          create/manage → inspect → modify → inspect
Molang transforms       manage_keyframes → inspect → modify → inspect
animation effects       create/manage_animation_effects → inspect → modify → inspect
controller composition  manage_animation_controller → inspect(state) → modify → inspect
controller effects      manage_animation_controller → inspect(state) → modify → inspect
animation properties    animation_timeline → inspect → modify → inspect
loop/length/snapping    create/timeline → inspect → modify → inspect
```

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions.

## Verification Result So Far

Static integration checks on current `Local` are coherent, but canonical PASS is **not claimed**.

Generated artifacts are demonstrably stale relative to the integrated source:
- `mcp/docs/api.json` still has `generatedAt` 2026-08-14.
- `mcp/docs/index.html` still reports Animation tool count `(9)` instead of the manifest with the added effect tool.
- `mcp/prompts/manifest.json` still classifies existing-animation effects as a protected gap.

Therefore `docs:check` cannot be considered fresh until canonical regeneration is committed.

No GitHub CI status/workflow run is observable for integration commit `33784de067525e8fcdd2510d6195c7b2ac85187e` through the currently available GitHub status/run surfaces. Do not infer typecheck/test/build PASS from source inspection.

Canonical gate still required:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

The user's Windows workstation is not required for this CI gate. `docs/foundation/validation-report.md` remains the proof owner for the last completed canonical/live evidence; its prior 63-tool proof does not verify this 64-tool source state.

## Next Step

1. Regenerate `mcp/prompts/manifest.json`, `mcp/docs/api.json`, and `mcp/docs/index.html` through canonical Bun generators when the Bun-capable gate is available.
2. Run typecheck, tests, `measure:surface`, build, and docs freshness on the exact final source state.
3. Fix only concrete failures attributable to this integration; do not widen scope.
4. After a completed successful canonical run, update proof owners and mark **ANIMATION SOURCE CLOSED**.

**Local acceptance remains deferred and is not part of this next step.**
