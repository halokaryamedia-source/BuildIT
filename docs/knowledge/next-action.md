# Next Action

Updated: 2026-08-19

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
PRO-1–PRO-8 STATIC HARDENING RETAINED
U7  No change required
TEXTURING_T0_T18_STATIC_HARDENING_COMPLETE
ANIMATION_D1_D3_INTEGRATION_PR_ACTIVE
ANIMATION_CREATE_INSPECT_MODIFY_SYMMETRY_STATIC_AUDIT_COMPLETE
ANIMATION_FINAL_STATIC_ARCHITECTURE_AUDIT_COMPLETE
ANIMATION_CANONICAL_VERIFICATION_IN_PROGRESS
NO LOCAL RUN ACTIVE
LOCAL ACCEPTANCE DEFERRED — NOT A CURRENT NEXT STEP
```

Working branch: **`Local` only** as repository authority. PR #21 (`animation/canonical-effect-molang-closure`) is the bounded verification/delivery branch, not a replacement authority. `Experimental/**` remains **PAUSED BY USER**; its research contract lives in `Experimental/README.md`.

## Proof Boundary

Do not claim live desktop Blockbench/model-quality improvement without actual matching runtime proof. Experimental browser proof below does not upgrade desktop MCP claims. Visual fidelity, playback, persistence, and actual runtime/call-efficiency remain **LOCAL PROOF REQUIRED**. Static/source/CI evidence proves only its matching surface; installed-client evidence is separate.

Reference generation remains consent-gated: wait for fresh explicit user generation command before any new reference image generation.

## Integration Delivery

Draft PR #21 targets `Local` with one animation closure commit. It carries:
- D1 `manage_animation_effects` for existing Animation particle/sound/timeline lifecycle with exact inspected identity, collision/no-op preflight, one Undo, native point cap, split-on-move, strict schemas, and inspector/export-compatible continuation.
- D2 state sound/particle lifecycle through existing `manage_animation_controller`; no new controller tool.
- D3 `set_anim_time_update` / `set_blend_weight` through existing `animation_timeline`; no `math_animation`.
- canonical docs-manifest/runtime registration/inspection/routing ownership.
- implementation-map ownership and exact default inventory 63 → 64; serialized character ceilings stay unchanged unless measured evidence requires adjustment.

Remaining protected animation gaps: controller blend-curve mutation and bone-binding expressions. Generic generators, quality scores, and extra Bezier complexity remain deferred.

## CI Evidence

GitHub Actions is the canonical Bun surface; the user's Windows workstation is not required.

Repository Verify exposed bounded instruction/continuation regressions from earlier compaction. MCP Verify reached Bun 1.3.14 successfully and currently exposed a stale TypeScript test-stub typing error before executable tests. Fix only those proved owners; do not weaken tests or widen product scope.

Canonical gate remains:

```text
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:build
bun run docs:check
```

Generated artifacts stay generator-owned:
- `mcp/docs/api.json`
- `mcp/docs/index.html`
- `mcp/prompts/manifest.json`

## Next Step

1. Fix only CI-proved stale instruction/continuation markers and the `_Animation` test-stub type error on PR #21.
2. Let Repository Verify + MCP Verify rerun on the new PR head.
3. Use actual `measure:surface` output for any evidence-backed ceiling change; do not inflate budgets speculatively.
4. Regenerate prompt/API artifacts canonically once executable gates reach generation.
5. When both verification surfaces are green, merge the verified logical delivery to `Local` and mark **ANIMATION SOURCE CLOSED**.

**Local acceptance remains deferred and is not part of this next step.**
