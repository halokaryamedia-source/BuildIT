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

`REFERENCE_FIDELITY_ANIMATION_GRAPH_EDITOR_HARDENED`

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

## Latest Completed Animation Slice — Graph Editor Axis / Bezier / Undo

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commits:

```text
23863f32496bbe580f2dab22d390dd067835839f
fix: align graph editor axis handles

fdca13c766694e76a19af9a1f56289adf17a0619
chore: preserve animation source file ending
```

The second commit only restores the pre-existing no-final-newline byte ending
after the full-file source write. Net behavior changes remain scoped to
`animation_graph_editor`.

### Axis now has real Bezier semantics

Current Blockbench graph editing owns Bezier handle time/value as per-axis
vectors and indexes them by graph-editor axis.

Local now treats:

```text
axis = x → mutate handle component 0
axis = y → mutate handle component 1
axis = z → mutate handle component 2
axis = all → explicitly apply the same handle change to components 0, 1, and 2
```

`linear`, `step`, and `catmullrom` remain keyframe-level interpolation modes;
Local does not invent per-axis interpolation because Blockbench does not expose
that model.

The public axis description now states this distinction.

### Scalar-to-vector corruption removed

The old graph-editor path assigned values such as:

```text
kf.bezier_left_time = 0
kf.bezier_right_time = duration
```

which replaced Blockbench vector properties with scalars.

Local now mutates only selected vector components:

```text
bezier_left_time[axis]
bezier_left_value[axis]
bezier_right_time[axis]
bezier_right_value[axis]
```

For the existing ease presets, the previous timing-ratio intent is retained, but
left-handle offsets now use the native non-positive time direction instead of a
positive left offset.

### Custom-curve contract clarified

`custom_curve.control_point_1` is now explicitly the left handle offset
`[time, value]`; its time must be `<= 0`.

`custom_curve.control_point_2` is the right handle offset `[time, value]`; its
time must be `>= 0`.

These conditions are preflighted before Undo opens. The scalar pair is applied
to the requested axis component, or copied to all three components when
`axis=all`; it is not assigned over the vector object itself.

### Recoverability

Graph-editor target/keyframe/range/custom-input validation now completes before
the mutation transaction.

Mutation uses:

```text
Undo.initEdit({ animations: [animation] })
→ mutate interpolation / Bezier vector components
→ Undo.finishEdit("Modify animation curves")
```

Failure after the edit opens runs:

```text
Undo.cancelEdit(true)
→ Animator.preview()
→ updateKeyframeSelection()
→ rethrow
```

The Animation snapshot remains target-bound even when MCP resolves an explicit
animation that is not the currently selected editor animation.

### Diff / proof boundary

Net source changes from the pre-slice HEAD affect only
`mcp/server/tools/animation.ts`; no Geometry, Texture, copy/paste, timeline, or
batch-operation source was intentionally changed.

No CI/status checks are registered for the source commit.

Actual graph curves, ease appearance, Bezier playback, and Undo/Redo remain
`LOCAL PROOF REQUIRED`.

## Continuation Audit — Persistent `animation_timeline` Mutations

The next grounded Animation boundary is limited to persistent timeline settings:

```text
set_length
set_fps
loop
```

Current Local still performs direct mutations:

```text
Animation.selected.length = length
Animation.selected.snapping = fps
Animation.selected.loop = loop_mode
```

with no edit transaction or rollback path.

Current official Blockbench behavior establishes:

- animation length changes use `Undo.initEdit({ animations: [animation] })`,
  `animation.setLength(...)`, then `Undo.finishEdit(...)`;
- `Animation.setLength()` owns length limiting plus selected-timeline UI refresh;
- `Animation.setLoop(value, undo)` is the native loop mutation helper and can
  own its Animation Undo transaction;
- animation property edits, including `snapping`, are wrapped in Animation Undo.

Therefore direct persistent assignment is not at parity with current Blockbench
mutation ownership.

Playback (`play`, `pause`, `stop`), scrubbing (`set_time`), and keyframe
`select_range` are intentionally not part of this next persistent-setting slice.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- `batch_keyframe_operations` API/Undo/value-write parity;
- animation readback/inspection coverage;
- local save/reopen and visual playback proof.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- deterministic Animation + Group targeting on keyframe/curve/copy-paste paths;
- recoverable/action-specific `manage_keyframes` mutation;
- native-vector Bezier handle input contract for `manage_keyframes`;
- recoverable target-bound copy/paste mutation;
- axis-aware, vector-safe, recoverable graph-editor mutation;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
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
- shared `keyframeDataSchema` Bezier contract: unchanged because direct caller
  ownership could not be exhaustively proven.
- save/reopen proof: later local validation.
- broad public-surface reduction/removal of generic non-Bedrock tools: separate
  scope.

## Next Step

Audit and correct **only persistent `animation_timeline` mutation API/Undo parity**
in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep `play`, `pause`, `stop`, `set_time`, and `select_range` unchanged in this
   slice;
2. `set_length` must use current Blockbench `Animation.setLength(...)` inside a
   recoverable Animation Undo transaction instead of direct `.length` assignment;
3. `set_fps` / snapping must be validated against current Blockbench limits and
   mutated inside Animation Undo, with required timeline/interface refresh only;
4. `loop` must use the current Blockbench loop mutation lifecycle rather than
   untracked direct assignment; avoid nested Undo if using `setLoop(..., undo)`;
5. failure after an edit opens must cancel/revert before rethrow;
6. preserve Cuboid-only Geometry and frozen Texture; do not touch graph editor,
   copy/paste, manage-keyframes, or batch operations.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution/Undo
structure only. Actual Blockbench playback, graph curves, timeline settings,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
