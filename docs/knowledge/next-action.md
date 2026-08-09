# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation operate deterministically on the intended Bedrock rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_TARGET_IDENTITY_HARDENED`

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

## Latest Completed Animation Slice — Target Identity

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
ac1e097c94da6d9659a89dd39a92378e153ff130
fix: harden animation target identity
```

The previous keyframe/curve/copy-paste paths could silently target the wrong
animation or Group because they used first-match name lookup. Current Local now
uses deterministic file-local resolution.

### Animation resolution

A new file-local resolver now implements:

```text
reference omitted
→ selected animation only

explicit reference
→ exact Animation UUID
→ exact unique Animation name
→ duplicate exact name = actionable ambiguity error with candidate UUIDs
→ missing = actionable error
```

An explicit empty string is treated as an explicit reference and therefore
fails as missing; it does not fall back to the selected animation.

Applied to:

```text
manage_keyframes.animation_id
animation_graph_editor.animation_id
animation_copy_paste.source.animation
animation_copy_paste.target.animation
```

### Bone / Group resolution

The affected Animation paths no longer use shared `findGroupOrThrow()`, whose
current implementation is name-only first-match. They now reuse the existing
file-local `resolveRigGroup()` pattern:

```text
exact Group UUID
→ exact unique Group name
→ duplicate exact name = ambiguity error with candidate UUIDs
→ missing = actionable error
```

Applied to:

```text
manage_keyframes.bone_name
animation_graph_editor.bone_name
animation_copy_paste.source.bone
animation_copy_paste.target.bone
```

When a `BoneAnimator` must be created after resolving a target Group, Local now
uses the resolved Group UUID and resolved Group name rather than treating the
supplied reference text as the bone name. This preserves correct identity when
the caller supplied a UUID.

The shared `findGroupOrThrow()` helper itself remains unchanged because its other
callers were not exhaustively audited in this slice.

### Diff proof

The source commit diff is limited to:

- removing `findGroupOrThrow` from `animation.ts`;
- target-contract descriptions for the affected bone references;
- one file-local Animation resolver;
- the four animation-reference call sites;
- the four bone/group-reference call sites;
- resolved Group name use when creating affected `BoneAnimator` instances.

Undo placement, keyframe creation/edit/delete/select behavior, interpolation,
timeline mutation, batch operations, Geometry, and Texture were not changed.
No CI/status checks are registered for the source commit.

## Continuation Audit — `manage_keyframes` Animator Creation / Undo

The next high-value boundary is now isolated to `manage_keyframes`.

Current Local flow remains:

```text
resolve animation + Group
→ read animation.animators[group.uuid]
→ if absent:
   new BoneAnimator(...)
   animation.animators[group.uuid] = animator
→ Undo.initEdit({ animations: [animation], keyframes: [] })
→ create/delete/edit/select keyframes
→ Undo.finishEdit(...)
→ Animator.preview()
```

### Why this is a real recoverability gap

Current official Blockbench `Animation.getUndoCopy()` includes the animation's
animator state. The Undo save path stores `animation.getUndoCopy()` when an
Animation is included in the `animations` aspect.

Therefore an outer edit opened **before** animator registration can structurally
capture the pre-mutation animation state, including the absence of that animator.

Local currently registers a missing `BoneAnimator` **before** opening Undo. If a
later operation fails, the newly registered animator is already outside the
transaction boundary.

After `Undo.initEdit()` opens, `manage_keyframes` also has no action-specific
try/catch/cancel path. A failure during keyframe mutation or `Undo.finishEdit()`
can therefore leave an open edit and/or partial animation state.

The `select` action also currently passes through the unconditional
get-or-create animator path even though it is intended to select existing
keyframes, so whether selection should ever create animator state must be checked
against current Blockbench behavior before editing.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- animation paste animator creation / Undo recoverability;
- graph-editor interpolation / bezier-handle parity;
- timeline mutation (`set_length`, `set_fps`, `loop`) Undo/API parity;
- batch keyframe operations;
- animation readback/inspection coverage.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- deterministic Animation + Group targeting on the main keyframe/curve/copy-paste
  paths;
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
- shared `findGroupOrThrow()` migration: deferred; do not broaden during current
  Animation work.
- save/reopen proof: later local validation.
- broad public-surface reduction/removal of generic non-Bedrock tools: separate
  scope.

## Next Step

Audit and correct **only `manage_keyframes` animator creation / Undo
recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve the deterministic Animation and Group target resolution just
   implemented;
2. verify current Blockbench `Animation.getBoneAnimator`, `BoneAnimator`,
   keyframe mutation, and Undo ownership before changing the path;
3. a missing animator must not be registered outside the recoverable mutation
   transaction;
4. determine action-specific behavior: `create` may need an animator, while
   `delete`, `edit`, and especially `select` must not invent persistent animator
   state merely because the requested target has no animation data;
5. if mutation or outer finish fails after an edit is opened, cancel/revert the
   edit and refresh only the required animation/timeline state before rethrow;
6. keep the slice limited to `manage_keyframes`; do not change animation paste,
   graph-editor curves, timeline, batch operations, Geometry, or Texture.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution/Undo
structure only. Actual Blockbench animation playback, keyframe mutation,
Undo/Redo, timeline selection, motion arcs, clipping, bone pivots,
return-to-neutral behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until
local runtime testing resumes.
