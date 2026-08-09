# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping the execution surface aligned with the
actual Bedrock modelling contract.

## Current Status

`REFERENCE_FIDELITY_TEXTURE_FROZEN_ANIMATION_NEXT`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Corrected Bedrock Geometry Scope

The active Minecraft Bedrock Entity modelling path is **Cube/Cuboid only**.

Canonical geometry policy already establishes:

```text
Modelling Brief
→ Primary Form Hypothesis
→ intentional coarse Cuboids
→ visual correction
→ secondary Cuboid geometry / hierarchy / pivots
```

The active `blockbench-bedrock-modelling` skill likewise owns Cuboid geometry and
explicitly excludes generic mesh sculpting / Hytale / unrelated geometry
expansion.

Therefore:

- do not route Bedrock Entity modelling through Mesh/non-Cuboid geometry;
- do not treat generic MCP tool availability as permission to expand Bedrock
  geometry beyond Cuboids;
- animation work must operate through the Bedrock rig/hierarchy that drives
  Cuboid children, not vertex/morph/free-form deformation.

## Texture Scope Correction

The previous continuation incorrectly treated `texture_selection` rectangle /
ellipse and operation-mode parity as a **Bedrock modelling blocker**.

That classification was wrong.

`select_rectangle`, `select_ellipse`, selection growth/invert, and related
operations are **2D pixel-selection utilities inside the texture editor**. They
are not model geometry primitives and do not imply rectangle/ellipse geometry in
the Bedrock Entity model.

The source corrections already made to current Blockbench selection APIs may
remain as bounded texture-editor maintenance, but they are **not a requirement
for Cuboid geometry fidelity** and are no longer a gate for the main engineering
sequence.

Remaining selection-operation completeness is parked as auxiliary/non-gating
work. Do not continue it by inertia.

## Texture Phase Decision

The user-approved exit strategy was:

```text
finish high-value Texture blockers
→ closing source audit
→ freeze Texture when remaining findings are not critical to Bedrock modelling
→ move to Animation
```

That condition is now met under the corrected Cuboid-only product scope.

### Texture source-hardening is frozen

High-value completed source boundaries include:

- deterministic texture/material/group targeting on proven mutation paths;
- rollback boundaries for core texture/PBR creation/configuration/assignment;
- `create_texture` group/render/fill-layer parity and render observability;
- texture-layer create/delete/duplicate/merge/opacity/blend/move/rename/flatten
  source hardening;
- stale `Texture.flattenLayers()` replacement with current Blockbench lifecycle;
- `paint_settings` global-settings shadowing fix and requested-setting preflight;
- current-API repair for texture-selection invert/expand/contract and removal of
  unsupported feather selection.

These remain **source implemented**, not live-proven.

Do not reopen Texture merely to chase 2D editor feature completeness. Reopen it
only if Animation or a concrete Bedrock Cuboid modelling workflow proves a
material Texture blocker.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- auxiliary `texture_selection` rectangle/ellipse operation-mode/state parity:
  parked; it is not a Bedrock geometry or Texture-exit blocker.
- shared `findTextureGroupOrThrow()` hardening: deferred until callers can be
  exhaustively audited.
- shared `layerBlendModeEnum` cleanup: deferred until callers can be exhaustively
  audited.
- save/reopen proof: later local validation.
- broad public-surface reduction/removal of generic non-Bedrock tools: separate
  scope; do not delete generic tools merely because the active Bedrock modelling
  route does not use them.

## Next Step

Run the first **Animation source audit** for the active Minecraft Bedrock Entity
workflow.

Primary owner:

```text
mcp/server/tools/animation.ts
```

Inspect `armature.ts` only when required to establish bone/group hierarchy or
pivot ownership for animation.

Audit only the high-value Bedrock Cuboid animation path:

1. animation target identity must resolve the intended Bedrock bone/group rather
   than relying on ambiguous editor selection;
2. keyframe channels/values/timing/interpolation must match current Blockbench
   Bedrock animation contracts;
3. animation mutation must have bounded Undo/recoverability where normal failure
   can leave partial state;
4. inspect/readback must be sufficient to observe the animation state needed for
   correction;
5. preserve the existing Cuboid-only geometry contract: **no Mesh animator,
   vertex deformation, morph targets, free-form geometry, or new shape system**.

Do not redesign the entire animation system in one pass. Select exactly one
critical/major source gap if the audit proves one; otherwise advance to the next
smallest Bedrock animation boundary.

## Proof Boundary

ChatGPT → GitHub may establish source/API/schema/control-flow/Undo structure only.
Actual Blockbench animation playback, motion arcs, clipping, bone pivots,
return-to-neutral behavior, texture rendering, and save/reopen behavior remain
`LOCAL PROOF REQUIRED` until local runtime testing resumes.
