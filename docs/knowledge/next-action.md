# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation deterministic, API-correct, and recoverable on the intended Bedrock
rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_PASTE_RECOVERABLE`

Execution channel now: **ChatGPT → GitHub**.  
Local Blockbench testing: **intentionally deferred** by current priority.

## Frozen Boundaries

### Geometry

The active Minecraft Bedrock Entity modelling path is **Cube/Cuboid only**.
Do not introduce Mesh, vertex deformation, morph targets, free-form geometry,
or another shape system into the Bedrock modelling/animation path.

### Texture

Texture source-hardening is frozen. Reopen it only when a concrete Bedrock
Cuboid modelling/Animation workflow proves a material Texture blocker.

The existing 2D texture-selection utilities are not model geometry and are not
an Animation gate.

## Latest Completed Animation Slice — Copy/Paste Mutation Recoverability

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
d789dcaca7ef439971d57a024bb0bd333413160f
fix: recover animation paste mutations
```

The `copy` action remains read-only and unchanged. The source change is limited
to `paste` / `mirror_paste`.

### Animator creation is now inside the target Animation transaction

Previous paste flow could register a missing `BoneAnimator` before the Undo
snapshot. Current Local now:

```text
resolve target Animation + Group
→ inspect existing animator without mutation
→ read clipboard / mirror settings
→ Undo.initEdit({ animations: [targetAnimation] })
→ inside try:
   getBoneAnimator(targetGroup) only when missing
   add pasted keyframes
   targetAnimation.setLength()
   Undo.finishEdit(...)
→ failure:
   Undo.cancelEdit(true)
   refresh animation/timeline state
   rethrow
```

Because current Blockbench Animation undo copies include animator/keyframe state,
opening the transaction before `getBoneAnimator()` allows rollback to restore the
pre-paste structure, including the previous absence of an animator.

### Paste no longer depends on `Animation.selected`

The old path used `GeneralAnimator.createKeyframe()`, which internally updates
`Animation.selected.setLength()`. That is unsafe when MCP explicitly targets a
different animation.

Paste now uses primitives bound to the resolved target animation:

```text
targetAnimation.getBoneAnimator(targetGroup)
animator.addKeyframe(...)
Timeline.snapTime(time, targetAnimation)
Keyframe.replaceOthers(...)
targetAnimation.setLength()
```

The pasted keyframe data is supplied as explicit `data_points` so the target
animation remains independent of editor selection.

### Preserved behavior

The following were intentionally preserved:

- deterministic Animation/Group UUID-first target resolution;
- `copy` behavior and clipboard shape;
- `paste` / `mirror_paste` result text;
- existing mirror-axis value semantics;
- interpolation values;
- copied vector Bezier handle data;
- Geometry Cube/Cuboid-only contract;
- frozen Texture boundary.

### Diff proof

The source commit changes one hunk in `animation_copy_paste` only. There is no
source drift into `copy`, `manage_keyframes`, graph editor, timeline, batch
operations, Geometry, or Texture. No CI/status checks are registered for the
source commit.

Actual Blockbench paste, mirror-paste, playback, and Undo/Redo remain
`LOCAL PROOF REQUIRED`.

## Continuation Audit — `animation_graph_editor`

The next grounded Animation boundary is the graph-editor tool.

Current Local exposes:

```text
axis = x | y | z | all
```

but the execute path currently does not use `axis` when applying graph-editor
actions.

For Bezier actions it also assigns scalar values directly to properties that
current Blockbench owns as per-axis vectors, for example:

```text
kf.bezier_left_time = 0
kf.bezier_right_time = duration
```

and the custom-curve path likewise assigns scalar handle times.

Current official Blockbench graph-editor behavior proves that Bezier handles are
read and edited by axis index:

```text
bezier_left_time[axis_number]
bezier_left_value[axis_number]
bezier_right_time[axis_number]
bezier_right_value[axis_number]
```

Native handle dragging snapshots the full vectors, restores them, then mutates
the selected axis component. Uniform keyframes may propagate that component to
other axes explicitly. The UI itself has an X/Y/Z graph axis selector.

Therefore the next correction must distinguish two concepts instead of treating
`axis` as decorative:

- keyframe `interpolation` is a keyframe-level property;
- Bezier handle time/value data is per-axis vector state.

The current graph-editor mutation also opens `Undo.initEdit()` without a
try/catch + `Undo.cancelEdit(true)` recovery path.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- timeline mutation (`set_length`, `set_fps`, `loop`) Undo/API parity;
- batch keyframe operations;
- animation readback/inspection coverage.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- deterministic Animation + Group targeting on keyframe/curve/copy-paste paths;
- recoverable/action-specific `manage_keyframes` animator/keyframe mutation;
- native-vector Bezier handle input contract for `manage_keyframes`;
- recoverable target-bound `animation_copy_paste` paste/mirror-paste mutation;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions only where live Blockbench proof has not been
performed.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- auxiliary 2D `texture_selection` completeness: parked/non-gating.
- shared `findTextureGroupOrThrow()` hardening: deferred until callers can be
  exhaustively audited.
- shared `layerBlendModeEnum` cleanup: deferred until callers can be exhaustively
  audited.
- shared `findGroupOrThrow()` migration: deferred.
- shared `keyframeDataSchema` Bezier contract: left unchanged because direct
  caller ownership could not be exhaustively proven.
- save/reopen proof: later local validation.
- broad public-surface reduction/removal of generic non-Bedrock tools: separate
  scope.

## Next Step

Audit and correct **only `animation_graph_editor` axis / Bezier-vector parity and
Undo recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve deterministic Animation/Group target resolution and Cuboid-only
   modelling;
2. verify the action contract against current Blockbench graph-editor semantics:
   interpolation mode is keyframe-level while Bezier handles are per-axis;
3. stop assigning scalar values directly to vector-valued Bezier handle
   properties;
4. make `axis` meaningful for Bezier-handle edits, including an explicit and
   deterministic interpretation of MCP `all` without inventing per-axis
   interpolation support that Blockbench does not have;
5. wrap graph-editor mutation/finish in recoverable Undo cancellation on failure;
6. keep the slice limited to `animation_graph_editor`; do not modify timeline,
   batch operations, copy/paste, Geometry, or Texture.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution/Undo
structure only. Actual Blockbench graph curves, pasted keyframes, playback,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
