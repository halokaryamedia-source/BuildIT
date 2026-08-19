# Next Action

Updated: 2026-08-19

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
PRO-1–PRO-8 STATIC HARDENING RETAINED
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
ANIMATION_D1_EFFECT_OBSERVABILITY_IMPLEMENTED
ANIMATION_D2_CONTROLLER_EFFECT_CANDIDATE_PREPARED
ANIMATION_D3_MATH_PROPERTY_OBSERVABILITY_IMPLEMENTED
ANIMATION_D4_TIMELINE_BATCH_OWNERSHIP_FIXED
ANIMATION_D5_EFFECT_SUMMARY_COUNTS_FIXED
ANIMATION_FINAL_STATIC_INTEGRATION_CANDIDATE_PREPARED
ANIMATION_CREATE_INSPECT_MODIFY_SYMMETRY_STATIC_AUDIT_COMPLETE
ANIMATION_FINAL_STATIC_ARCHITECTURE_AUDIT_COMPLETE
ANIMATION_CANONICAL_CLOSURE_DEFERRED_UNTIL_CROSS_DOMAIN_FINALIZATION
ANIMATION_SOURCE_CLOSURE_PENDING_CANONICAL_GATE
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only**. `Experimental/**` remains **PAUSED BY USER**. GitHub discipline is owned by `GITHUB_RULES.md`; do not duplicate it here.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental browser proof below does not upgrade desktop MCP claims. Visual fidelity, playback, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**. Static/source/CI evidence proves only its matching surface.

## Final Static Candidate

Reference candidate, **NOT on `Local`**:

```text
8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c
feat(animation): prepare canonical effect and Molang closure
```

Final delivery must reproduce it from the then-current `Local`; never merge orphan history blindly.

Candidate closure:
- D1 `manage_animation_effects`: particle/sound/timeline add-update-remove, exact inspected identity, snapping/collision/no-op preflight, one Undo, native point cap, split-on-move, final-point removal, preview `file` preservation, strict schemas, inspector/export-compatible continuation.
- D2 extends existing `manage_animation_controller` with controller-state sound/particle lifecycle; no new controller tool.
- D3 extends existing `animation_timeline` with `set_anim_time_update` / `set_blend_weight`; no `math_animation`.
- runtime registration + canonical docs manifest include D1; inspector covers particle/sound/timeline.
- skill/policy/runtime workflow stop treating implemented D1/D2 as gaps; animation skill remains routing owner.
- regression owners cover D1/D2/D3, strictness, one-Undo behavior, docs registration, inspection parity, routing, and ownership.
- implementation-map candidate owns `manage_animation_effects`, 64-tool inventory, and remaining protected gaps.
- only exact inventory 63 → 64 is adjusted statically; serialized character ceilings stay unchanged until measured.

## Static Symmetry / Architecture Closure

Verified lifecycle:

```text
transform keys          create/manage → inspect → modify → inspect
Molang transforms       manage_keyframes → inspect → modify → inspect
animation effects       create/manage_animation_effects → inspect → modify → inspect
controller composition  manage_animation_controller → inspect(state) → modify → inspect
controller effects      manage_animation_controller → inspect(state) → modify → inspect
animation properties    animation_timeline → inspect → modify → inspect
loop/length/snapping    create/timeline → inspect → modify → inspect
```

No missing owner/tool justifies new public surface. Identity, Undo ownership, collision/no-op preflight, Molang preservation, effect ownership, controller composition, continuation state, routing, docs ownership, and 64-tool inventory are coherent at source/static level.

Legacy `animation_timeline` action-field strictness was reviewed but not promoted: its multi-action looseness predates D3 and no current failure evidence justifies widening this closure. Reopen only with concrete evidence.

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions. Generic generators, quality scores, and extra Bezier complexity remain deferred.

## Deferred Canonical Closure

Animation canonical verification/integration is intentionally **unfinished and deferred** until the other development domains are finalized. This is not a current blocker for continuing unrelated source work.

When final project closure begins, public MCP changes still require:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

Environment boundary: the user's workstation is **Windows and is not needed for this gate**. Repo-owned `.github/workflows/mcp-verify.yml` uses `ubuntu-latest`; the assistant sandbox is separate and not repository authority.

Generated artifacts remain intentionally pending canonical generation:
- `mcp/docs/api.json`
- `mcp/docs/index.html`
- `mcp/prompts/manifest.json`

Do not create a temporary workflow/branch, push incomplete schema only to trigger CI, hand-edit generated API docs, or weaken verification.

## Next Step

1. Continue/finalize the other development domains first; animation needs no further source expansion now.
2. At cross-domain finalization, reproduce candidate `8cd1a4e86b28af8ff4ecaa0cbfa72051c6de194c` from the then-current `Local` as one logical delivery.
3. Run the canonical gate; `measure:surface` must confirm 64 tools and prove any ceiling adjustment actually needed.
4. Regenerate prompt/API artifacts canonically in the same verified delivery.
5. If verification changes executable source beyond generated artifacts or evidence-backed budget values, rerun only the affected static audit; otherwise mark **ANIMATION SOURCE CLOSED**.

**Local acceptance remains deferred and is not part of this next step.**
