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

`REFERENCE_FIDELITY_ANIMATION_TIMELINE_MUTATIONS_RECOVERABLE`

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

## Latest Completed Animation Slice — Persistent Timeline Mutations

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
50bdd64bf5f9171e3c750ac72ebf20f2df99efe5
fix: recover persistent animation timeline edits
```

The source change is limited to the public FPS/snapping contract and persistent
`animation_timeline` actions:

```text
set_length
set_fps
loop
```

`play`, `pause`, `stop`, `set_time`, and `select_range` remain behaviorally
unchanged.

### `set_length`

Previous Local assigned:

```text
Animation.selected.length = length
```

Current Local uses the Blockbench-owned mutation lifecycle:

```text
Undo.initEdit({ animations: [animation] })
→ animation.setLength(length)
→ Undo.finishEdit("Change animation length")
```

`Animation.setLength()` owns the current Blockbench length constraints and
selected-timeline length UI update. The returned MCP text now reports the actual
post-`setLength()` value instead of blindly repeating an input that Blockbench
may clamp.

### `set_fps` / animation snapping

Current Blockbench animation snapping is constrained to **10–500** in its
Animation data/property path. The MCP contract previously advertised `1–120`.

Local now validates:

```text
fps >= 10
fps <= 500
```

and mutates through the same Animation property owner used by current
Blockbench animation properties:

```text
Undo.initEdit({ animations: [animation] })
→ animation.extend({ snapping: fps })
→ Undo.finishEdit("Change animation snapping")
→ Timeline.setTimecode(Timeline.time)
```

The timecode refresh keeps the currently displayed frame number aligned with the
new snapping rate.

### `loop`

Previous Local directly assigned:

```text
Animation.selected.loop = loop_mode
```

Current Local uses:

```text
Undo.initEdit({ animations: [animation] })
→ animation.setLoop(loop_mode, false)
→ Undo.finishEdit("Change animation loop mode")
```

The outer MCP transaction owns Undo, so `setLoop(..., false)` deliberately avoids
the native helper opening a nested transaction. If `loop_mode` is omitted or
already equals the current mode, no persistent edit is opened and the current
mode is returned.

### Recoverability

The three persistent actions share one function-local transaction wrapper.
Failure after `Undo.initEdit()` runs:

```text
Undo.cancelEdit(true)
→ Animator.preview()
→ rethrow
```

The final existing `Animator.preview()` on success remains in place.

### Diff / proof boundary

The source commit contains only two source hunks:

1. `animationTimelineParameters.fps` contract: `10–500` plus clarified
   snapping/FPS description;
2. `animation_timeline` persistent mutation lifecycle described above.

No graph-editor, copy/paste, manage-keyframes, batch-operation, Geometry, or
Texture behavior was intentionally changed. GitHub has no registered CI/status
checks for the source commit.

Actual Blockbench timeline settings, UI refresh, playback, and Undo/Redo remain
`LOCAL PROOF REQUIRED`.

## Continuation Audit — Batch Value Mutation Parity

The next grounded Animation boundary is intentionally narrower than the entire
`batch_keyframe_operations` tool.

Current Local `offset` with `offset_values` and `mirror` still call:

```text
kf.set("values", ...)
```

but current Blockbench `Keyframe.set()` accepts an axis (`x`, `y`, or `z`), not a
synthetic `values` property. This is the same API mismatch already corrected in
`manage_keyframes`.

The `mirror` path also manually multiplies one array component by `-1` for every
transform channel. Current Blockbench already owns channel-aware mirroring via:

```text
Keyframe.flip(axis)
```

where transform semantics differ by channel (for example rotation does not use
the same component rule as position). Reimplementing mirror as a generic array
negation therefore risks producing incorrect Bedrock bone rotation data even if
the request succeeds syntactically.

The batch tool also opens `Undo.initEdit({ keyframes })` without a bounded
try/catch + `Undo.cancelEdit(true)` recovery path. This should be corrected in the
same value-mutation slice only where needed to keep the affected operation
recoverable.

`bake`, time scaling/reverse mechanics, broad selection behavior, and animation
readback remain separate boundaries and must not be pulled into the next slice.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- `batch_keyframe_operations` bake/create-keyframe lifecycle;
- batch time scale/reverse semantic audit beyond what the value-mutation slice
  requires;
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
- recoverable native-owned persistent timeline mutations;
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

Audit and correct **only `batch_keyframe_operations` value mutation / mirror API
parity and recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve the existing selection modes and keep Geometry Cube/Cuboid-only;
2. for `offset_values`, stop calling `Keyframe.set("values", ...)`; use current
   Blockbench axis/value primitives and handle transform values without inventing
   a synthetic property;
3. for `mirror`, audit and use current `Keyframe.flip(axis)` semantics rather than
   generic one-component negation where that is the correct owner;
4. bound the affected mutation transaction with cancel/revert on failure;
5. do **not** modify `bake`, broad time scale/reverse semantics, timeline,
   graph-editor, copy/paste, Geometry, or Texture in this slice.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution/Undo
structure only. Actual Blockbench batch transforms, mirroring, playback,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.