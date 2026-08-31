# Next Action

Updated: 2026-08-31 — remote MCP efficiency pass completed; final verification intentionally deferred by user

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`REMOTE_MCP_EFFICIENCY_PASS_COMPLETE`

Current remote work improved authoring cost without adding a new tool family, router, profile, or arbitrary execution escape hatch:

- Geometry: known coherent Cube creation stays batched; known Cube cohorts sharing one deterministic translate/resize correction reuse fresh state, derive absolute targets once, and use one `modify_cubes_batch` instead of per-Cube inspect/mutate loops.
- Texturing: atlas lifecycle is reuse-first; production blank atlas resolution comes from current project/handoff state rather than trusting the provisional 16×16 schema default; advanced editor-state tools stay conditional rather than normal hot-path choices.
- Animation: coherent time/value cohort transforms use existing `batch_keyframe_operations`; per-key authored edits stay `manage_keyframes`; controller/effect/graph/copy-paste surfaces are conditional.
- Structural validation is summary-first through `validator://status`, with active problem checks routing lazily to exact detail resources.
- The implementation borrows intent-level batching/reuse ideas from public Blockbench MCPs while retaining BlockIT UUID-first targeting, full preflight, explicit pivots, one-Undo ownership, phase boundaries, and fail-closed semantics.

No new current live Blockbench, visual-quality, or Authoring Efficiency PASS is claimed.

## Remaining High-Value Work

These changes require **`LOCAL_CODE`** because they alter public MCP schema/ToolSpecs and must regenerate canonical committed docs. Do not partially implement them from `REMOTE_GITHUB` and leave generated docs stale.

1. **Texture default correctness** — replace the provisional blank `create_texture` 16×16 schema default with project/Bedrock production-resolution semantics; preserve explicit imported dimensions and atlas-reuse preflight.
2. **Geometry API ergonomics, only if still needed after live measurement** — consider bounded relative translate/resize intent inside existing `modify_cube` / `modify_cubes_batch`; do not add a generic `transform_elements` family merely for parity with another MCP.
3. **Animation schema slimming, only where total serialized cost falls without capability loss** — prefer existing `batch_keyframe_operations` and focused owners; do not split tools solely to improve a per-tool vanity metric.
4. **Protected advanced gaps** — controller blend-curve mutation, bone-binding expressions, animated-texture mutation, TextureMesh direct authoring/inspection, and native visible bounding-box fields remain evidence-gated. Implement only when a real Bedrock workflow requires them; do not widen the default surface speculatively.

## Verification Boundary

The user explicitly deferred intermediate CI while this improvement pass was in progress. When implementation is considered complete, run one final canonical validation pass instead of using every intermediate commit as a checkpoint:

```text
LOCAL_CODE
→ regenerate canonical docs when public ToolSpecs changed
→ docs:check
→ verify:mcp

LIVE_BLOCKBENCH, when requested
→ disposable Geometry/Texturing/Animation E2E
→ mutation → exact readback → before/after evidence → Undo/Redo where applicable
```

Static or CI proof must not be promoted to live Blockbench quality/runtime proof.

## Other Deferred Work

Route 1 live validation remains user-deferred. Do not reactivate it automatically. Historical TODOs, interrupted candidates, and old experiments are not active work by themselves.
