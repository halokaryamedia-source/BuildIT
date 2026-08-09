# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation operate deterministically and recoverably on the intended Bedrock rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_MANAGE_KEYFRAMES_RECOVERABLE`

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

## Latest Completed Animation Slice — `manage_keyframes`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
dc0ab76a7e0e348ee31698d758736c78fa42cb07
fix: recover manage keyframe mutations
```

The deterministic Animation/Group target resolution from the previous slice is
preserved.

### Animator creation is now inside the recoverable transaction

Previous flow registered a missing `BoneAnimator` before `Undo.initEdit()`.
Current Local now:

```text
resolve Animation + Group
→ inspect existing animator
→ for create/delete/edit: Undo.initEdit({ animations: [animation] })
→ only create may call animation.getBoneAnimator(group)
→ mutate target animation
→ Undo.finishEdit(...)
→ failure: Undo.cancelEdit(true) + animation/timeline refresh + rethrow
```

This uses the Animation snapshot as the mutation owner. Current Blockbench
`Animation.getUndoCopy()` includes animator/keyframe state, so opening the edit
before animator creation captures the absence of a newly-created animator and
allows rollback to restore that pre-mutation structure.

`delete` and `edit` now fail when the resolved Group has no keyframes in the
requested channel instead of creating an empty animator as a side effect.

### `select` is selection-only

`select` no longer opens model-edit Undo and never creates an animator.

It now requires:

- the resolved animation to be the current selected Blockbench animation;
- an existing animator/channel with keyframes.

The selection mutation uses the native timeline-selection pattern:

```text
Undo.initSelection({ timeline: true })
→ clear current keyframe selection
→ select the existing animator/keyframes
→ updateKeyframeSelection()
→ Undo.finishSelection("Select keyframes")
→ failure: cancelSelection(true)
```

This avoids persisting animation structure merely because the caller asked to
select timeline data.

### Create no longer depends on `Animation.selected`

Current Blockbench `GeneralAnimator.createKeyframe()` calls
`Animation.selected.setLength()`, which is unsafe for MCP when an explicit
`animation_id` targets a different animation.

For `manage_keyframes.create`, Local now uses current Blockbench primitives that
can remain bound to the resolved target animation:

```text
animation.getBoneAnimator(group)
animator.addKeyframe(...)
Timeline.snapTime(time, animation)
Keyframe.set(x/y/z, ...)
Keyframe.replaceOthers(...)
animation.setLength()
```

This prevents keyframe creation on an explicit target from accidentally updating
the length of a different selected animation.

### Keyframe value edits use the real API

Previous `edit` called:

```text
keyframe.set("values", ...)
```

but current Blockbench `Keyframe.set()` accepts axis keys (`x`, `y`, `z`).
Local now maps vector values to `x/y/z`; a scalar value is treated as uniform and
sets all axes through the keyframe's `uniform` behavior.

### Proof boundary

The source commit diff is limited to the `manage_keyframes` execute path. No
Animation copy/paste, graph editor, timeline, batch operation, Geometry, or
Texture behavior was intentionally changed. GitHub has no registered CI/status
checks for this commit.

Actual Blockbench keyframe creation/edit/delete/select behavior and Undo/Redo
remain `LOCAL PROOF REQUIRED`.

## Continuation Audit — Bezier Handle Contract

The next major source gap is now grounded in current Blockbench keyframe
ownership.

Current official Blockbench defines these keyframe properties as vectors:

```text
bezier_left_time  = [x, y, z]
bezier_left_value = [x, y, z]
bezier_right_time = [x, y, z]
bezier_right_value= [x, y, z]
```

Interpolation reads the handle for the active axis by indexing those vectors.

Current Local shared `keyframeDataSchema` instead advertises:

```text
left_time: number
right_time: number
left_value: vector3 | number
right_value: vector3 | number
```

and `manage_keyframes` directly assigns those scalar time values onto the
vector-valued Blockbench properties. A scalar `bezier_*_time` therefore does not
match the current runtime property contract and can cause per-axis bezier timing
to be ignored or malformed.

This is a keyframe contract/API issue, not a Geometry issue. Cuboid-only scope
remains unchanged.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- animation paste animator creation / Undo recoverability;
- graph-editor curve/easing semantics;
- timeline mutation (`set_length`, `set_fps`, `loop`) Undo/API parity;
- batch keyframe operations;
- animation readback/inspection coverage.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- deterministic Animation + Group targeting on the main keyframe/curve/copy-paste
  paths;
- recoverable/action-specific `manage_keyframes` animator/keyframe mutation;
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

Audit and correct **only the `manage_keyframes` bezier-handle input/runtime
contract**.

Primary files:

```text
mcp/server/tools/animation.ts
mcp/lib/zodObjects.ts   # inspect shared ownership before editing
```

Requirements:

1. first audit all direct uses of shared `keyframeDataSchema`; do not change a
   shared schema blindly if caller ownership cannot be established;
2. align `manage_keyframes` bezier time/value data with current Blockbench's
   per-axis vector properties; do not assign scalar time directly to a vector
   property;
3. preserve `linear`, `catmullrom`, `bezier`, and `step` interpolation values and
   the recoverable `manage_keyframes` transaction just implemented;
4. preserve deterministic Animation/Group targeting and Cuboid-only modelling;
5. do not modify graph-editor easing, animation paste, timeline, batch operations,
   Geometry, or Texture in this slice.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution/Undo
structure only. Actual Blockbench animation playback, bezier curves, keyframe
mutation, Undo/Redo, timeline selection, motion arcs, clipping, bone pivots,
return-to-neutral behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until
local runtime testing resumes.
