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

`REFERENCE_FIDELITY_ANIMATION_BATCH_REVERSE_HARDENED`

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

2D texture-editor utilities are not model geometry and are not an Animation gate.

## Latest Completed Animation Slice — Batch `reverse`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
0a21400907b0738bf2b9ee07d6aa3db378c12548
fix: align batch keyframe reverse
```

The source change is limited to `batch_keyframe_operations.reverse`.

`scale`, `offset`, `mirror`, `smooth`, `bake`, selection modes, timeline,
graph editor, copy/paste, Geometry, and Texture were not intentionally changed.

### Native reversal semantics restored

Previous Local reversed only timestamp position across the selected range.

Current Local follows current Blockbench `reverse_keyframes` semantics:

1. compute selected `startTime` / `endTime`;
2. reflect each selected keyframe with:

```text
endTime + startTime - keyframe.time
```

3. for transform keyframes with multiple data points, reverse `data_points` so
   pre/post transform data follows the reversed time direction;
4. for Bezier interpolation:
   - swap left/right handle-time vectors;
   - swap left/right handle-value vectors;
   - multiply the resulting handle-time vectors by `-1` so temporal tangent
     direction remains valid after reversal.

The implementation snapshots the four Bezier vectors before mutation and writes
the swapped result per axis, preserving the existing vector objects.

### Snapping / collisions intentionally not added

Current native Blockbench `reverse_keyframes` does **not** call
`Timeline.snapTime(...)`, `replaceOthers(...)`, or another collision-removal
step for this command.

Local therefore keeps the exact selected-range reflection intent and does not
invent snapping/collision behavior during reverse.

### Recoverability

Reverse now uses the same keyframe-level mutation owner as native reversal, but
adds bounded failure recovery:

```text
Undo.initEdit({ keyframes })
→ reverse time / multi-point data / Bezier handles
→ Undo.finishEdit("Batch keyframe operation: reverse")
```

Failure after the edit opens runs:

```text
Undo.cancelEdit(true)
→ Animator.preview()
→ updateKeyframeSelection()
→ rethrow
```

Success refreshes preview/keyframe selection after the transaction.

### Diff / proof boundary

The source commit contains one hunk: the old timestamp-only `reverse` switch
case is replaced by the dedicated native-parity/recoverable reverse path.

GitHub has no registered CI/status checks for the source commit.

Actual Blockbench reversed motion, multi-point pre/post behavior, Bezier tangent
shape, playback, and Undo/Redo remain `LOCAL PROOF REQUIRED`.

## Continuation Audit — Batch `smooth`

The next grounded Animation boundary is **only**
`batch_keyframe_operations.smooth`.

Current Local still does:

```text
keyframes.forEach(kf => {
  kf.interpolation = "catmullrom"
})
```

inside the remaining generic batch edit path.

Current Blockbench interpolation UI establishes that interpolation changes apply
only to transform keyframes:

```text
if (kf.transform) {
  kf.interpolation = selectedInterpolation
}
```

The UI condition also requires at least one transform keyframe before exposing
that interpolation action.

Therefore Local `smooth` currently risks assigning transform interpolation
metadata to sound/particle/timeline or other non-transform keyframes selected by
the batch selector. The generic path also has no bounded `Undo.cancelEdit(true)`
recovery if mutation/finish fails.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- broad batch selection redesign;
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
- native axis/value batch offsets and channel-aware keyframe mirroring;
- safe/recoverable batch bake with timeline restoration;
- native-like recoverable batch time stretch with Bezier handle-time scaling;
- native-parity recoverable batch reversal;
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

Audit and correct **only `batch_keyframe_operations.smooth` transform-only
interpolation parity and recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve the existing selection modes and keep Geometry Cube/Cuboid-only;
2. apply `catmullrom` only to keyframes whose current Blockbench contract marks
   them as transform keyframes (`kf.transform`);
3. if the selected/matched batch contains no transform keyframes, fail before
   opening a mutation transaction rather than reporting a false successful
   smooth;
4. bound the smooth mutation with cancel/revert on failure and perform only the
   required preview/selection refresh;
5. do **not** modify batch `reverse`, `scale`, `offset`, `mirror`, `bake`,
   timeline tools, graph editor, copy/paste, Geometry, or Texture in this slice.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/Undo structure only.
Actual Blockbench interpolation result, playback, Undo/Redo, motion arcs,
clipping, bone pivots, return-to-neutral behavior, and save/reopen remain
`LOCAL PROOF REQUIRED` until local runtime testing resumes.