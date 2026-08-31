# Next Action

Updated: 2026-08-31 — remote MCP efficiency pass complete; cross-phase live E2E source prepared; final verification intentionally deferred by user

Working branch: **`Local` only**.

This file owns **active continuation only**. Stable facts belong in `CONTEXT.md`; proof belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`.

## Current Status

`REMOTE_MCP_EFFICIENCY_PASS_COMPLETE`

Current remote work improved authoring cost without adding a new tool family, router, profile, or arbitrary execution escape hatch:

- Geometry: coherent Cube creation stays batched; known Cube cohorts sharing one deterministic translate/resize correction reuse fresh state, derive absolute targets once, and use one `modify_cubes_batch` instead of per-Cube inspect/mutate loops.
- Texturing: atlas lifecycle is reuse-first; production blank atlas resolution comes from current project/handoff state rather than trusting the provisional 16×16 schema default; advanced editor-state tools stay conditional rather than normal hot-path choices.
- Animation: coherent multi-key work uses existing batch-capable owners; per-key authored edits stay `manage_keyframes`; controller/effect/graph/copy-paste surfaces are conditional.
- Structural validation is summary-first through `validator://status`, with active problem checks routing lazily to exact detail resources.
- The implementation borrows intent-level batching/reuse ideas from public Blockbench MCPs while retaining BlockIT UUID-first targeting, full preflight, explicit pivots, one-Undo ownership, phase boundaries, and fail-closed semantics.

## Prepared Live E2E Source

The live harness is **source-prepared only**; this is not a live PASS claim.

```text
GEOMETRY
bun run verify:geometry-live -- --confirm-disposable
→ creates/leaves blockit_geometry_e2e_disposable open
→ exact geometry readback + before/after render + Undo/Redo
→ prints observable request/tool-call cost

switch BlockIT MCP Authoring Phase → texturing; reload/reconnect
bun run verify:texturing-live -- --confirm-disposable
→ reuses the same project
→ one disconnected-coordinate paint batch
→ exact full-atlas PNG hashes before/after/Undo/Redo
→ prints observable request/tool-call cost

switch BlockIT MCP Authoring Phase → animation; reload/reconnect
bun run verify:animation-live -- --confirm-disposable
→ reuses the same `e2e_root` bone
→ one two-keyframe authored edit
→ exact `inspect_animation` readback + Undo/Redo
→ prints observable request/tool-call cost
```

Each verifier checks exact installed build identity, profile, active phase, and required live tools before mutation. Cost output records tool/mutation/inspection/evidence/history call counts plus serialized request/response body bytes and elapsed time. These are runtime observables, **not model-token measurements and not visual-quality scores**.

No automatic cross-phase orchestrator is added because changing MCP Authoring Phase still requires an explicit Blockbench setting change plus reload/reconnect.

## Remaining High-Value Work

These changes require **`LOCAL_CODE`** because they alter public MCP schema/ToolSpecs and must regenerate canonical committed docs. Do not partially implement them from `REMOTE_GITHUB` and leave generated docs stale.

1. **Texture default correctness** — replace the provisional blank `create_texture` 16×16 schema default with project/Bedrock production-resolution semantics; preserve explicit imported dimensions and atlas-reuse preflight.
2. **Geometry API ergonomics, only if live cost still justifies it** — consider bounded relative translate/resize intent inside existing `modify_cube` / `modify_cubes_batch`; do not add a generic `transform_elements` family merely for parity with another MCP.
3. **Animation schema slimming, only where measured serialized cost falls without capability loss** — prefer existing batch/focused owners; do not split tools solely to improve a per-tool vanity metric.
4. **Protected advanced gaps** — controller blend-curve mutation, bone-binding expressions, animated-texture mutation, TextureMesh direct authoring/inspection, and native visible bounding-box fields remain evidence-gated. Implement only when a real Bedrock workflow requires them; do not widen the default surface speculatively.

## Verification Boundary

The user explicitly deferred intermediate CI while the improvement pass is in progress. When implementation is considered complete, run one final canonical validation pass instead of using every intermediate commit as a checkpoint:

```text
LOCAL_CODE
→ regenerate canonical docs when public ToolSpecs changed
→ docs:check
→ verify:mcp

LIVE_BLOCKBENCH, when requested
→ Geometry → Texturing → Animation disposable E2E sequence above
→ compare Cost to Accepted Result only with equivalent accepted-quality work
```

Static or CI proof must not be promoted to live Blockbench quality/runtime proof.

## Other Deferred Work

Route 1 live validation remains user-deferred. Do not reactivate it automatically. Historical TODOs, interrupted candidates, and old experiments are not active work by themselves.
