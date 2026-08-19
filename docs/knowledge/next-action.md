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
ANIMATION_SOURCE_IN_LOCAL_CANONICAL_VERIFICATION_PENDING
ANIMATION_CANONICAL_CLOSURE_DEFERRED_UNTIL_CROSS_DOMAIN_FINALIZATION
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub discipline is owned by `GITHUB_RULES.md`; do not duplicate it here.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental browser proof below does not upgrade desktop MCP claims. Visual fidelity, playback, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**. Static/source/CI evidence proves only its matching surface.

## Animation Source Now In Local

The previously reviewed animation closure is now intentionally integrated into `Local` at source level. Historical preflight candidate:

```text
8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c
feat(animation): prepare canonical effect and Molang closure
```

Integrated scope:
- D1 `manage_animation_effects`: particle/sound/timeline add-update-remove, exact inspected identity, snapping/collision/no-op preflight, one Undo, native point cap, split-on-move, final-point removal, preview `file` preservation, strict schemas, inspector/export-compatible continuation.
- D2 extends `manage_animation_controller` with controller-state sound/particle lifecycle; no new controller tool.
- D3 extends `animation_timeline` with `set_anim_time_update` / `set_blend_weight`; no `math_animation`.
- runtime registration + canonical docs manifest source include D1; `inspect_animation` covers particle/sound/timeline.
- animation skill/policy/runtime prompt route implemented D1/D2 instead of treating them as gaps.
- regression owners cover D1/D2/D3, strictness, one-Undo behavior, docs registration, inspection parity, routing, and ownership.
- implementation map owns `manage_animation_effects` and the static 64-tool inventory.

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

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions. Generic generators, quality scores, and extra Bezier complexity remain deferred.

## Canonical Verification Still Pending

Source presence in `Local` is **not** the same as canonical verification. Public MCP changes still require:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

The repo-owned `.github/workflows/mcp-verify.yml` runs automatically for relevant pushes to `Local`. The user's Windows workstation is not required for this CI gate.

Generated artifacts are not hand-edited. Until canonical generation is committed, these may remain stale relative to the new source:
- `mcp/docs/api.json`
- `mcp/docs/index.html`
- `mcp/prompts/manifest.json`

`docs/foundation/validation-report.md` remains the proof owner for the last completed canonical/live evidence; do not reinterpret its prior 63-tool proof as verification of this 64-tool source state.

## Next Step

1. Read the automatic `MCP Verify` result for the Local integration commit.
2. Fix only concrete failures attributable to the animation integration; do not widen scope.
3. If generated docs are the only remaining stale surface, keep that canonical generation/commit as unfinished and allow it to wait for cross-domain finalization if desired.
4. At final project closure, run the full canonical gate, regenerate all derived artifacts, and update proof owners from actual results.
5. Mark **ANIMATION SOURCE CLOSED** only after canonical verification; local Blockbench acceptance remains separately deferred.

**Local acceptance remains deferred and is not part of this next step.**
