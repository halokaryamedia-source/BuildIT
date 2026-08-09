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

`REFERENCE_FIDELITY_ANIMATION_BATCH_SCALE_HARDENED`

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

## Latest Completed Animation Slice — Batch `scale` Time Stretch

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
05c056b1fa7f4b4b458e3636a9fee0f008a9b32b
fix: align batch keyframe time stretch
```

The source change is limited to `batch_keyframe_operations.scale`.

`reverse`, `offset`, `mirror`, `smooth`, `bake`, selection modes, timeline,
graph editor, copy/paste, Geometry, and Texture were not intentionally changed.

### Scale-factor semantics are now explicit in runtime behavior

The old path used:

```text
factor = parameters.scale_factor || 1
pivot = parameters.scale_pivot || 0
```

so an explicit factor `0` was silently replaced by `1`.

Current native Blockbench timeline time-stretch calculates a `time_factor` and
does not clamp it to positive values before applying it. Zero and negative
factors are therefore reachable native time-stretch states.

Local now uses nullish defaults:

```text
factor = parameters.scale_factor ?? 1
pivot = parameters.scale_pivot ?? 0
```

and preflights both values with `Number.isFinite(...)` before opening Undo.

Consequences are deterministic:

- `factor = 1` keeps relative spacing while still using Blockbench snapping;
- `factor = 0` collapses selected keyframes to the pivot, after which native
  collision replacement resolves duplicate times;
- `factor < 0` reverses relative ordering around the requested pivot;
- non-finite factor/pivot values fail before mutation.

The existing MCP pivot remains the explicit anchor; this slice does not replace
that contract with Blockbench's mouse-selected min/max drag anchor.

### Native snapping and Bezier-handle timing

Each selected keyframe now derives its new time from the original pre-stretch
time and applies:

```text
Timeline.snapTime(pivot + (originalTime - pivot) * factor, animation)
```

For Bezier keyframes, Local snapshots the original
`bezier_left_time` / `bezier_right_time` vectors before mutation and multiplies
each component by the same time factor. This mirrors current Blockbench
 time-stretch behavior, which restores original handle-time vectors and scales
them with `time_factor` rather than leaving curve timing unchanged.

Bezier value handles are intentionally not scaled because native time stretching
scales handle **time**, not transform value.

### Collision handling and recoverability

After all selected times are transformed, Local calls current Blockbench
`Keyframe.replaceOthers(...)` for each stretched keyframe. `replaceOthers()`
removes another keyframe on the same animator/channel when the transformed time
collides.

Because collision replacement may delete a keyframe that was not part of the
original selected list, the MCP scale operation uses:

```text
Undo.initEdit({ animations: [animation] })
```

rather than assuming a selected-keyframe-only snapshot can restore every
casualty. The Animation undo copy owns animator/keyframe structure and animation
length.

Mutation flow:

```text
preflight finite pivot/factor
→ snapshot original times + Bezier handle times
→ Undo.initEdit({ animations: [animation] })
→ snap transformed times
→ scale Bezier handle-time vectors
→ replace time collisions
→ animation.setLength()
→ Undo.finishEdit("Batch keyframe operation: scale")
```

Failure after the edit opens runs:

```text
Undo.cancelEdit(true)
→ Animator.preview()
→ updateKeyframeSelection()
→ rethrow
```

Success also refreshes preview/keyframe selection after the transaction.

### Diff / proof boundary

The source commit contains one source hunk: the old scalar-time `scale` switch
case is replaced by the dedicated recoverable time-stretch path above.

GitHub has no registered CI/status checks for the source commit.

Actual Blockbench stretch results, collision outcome, Bezier curve preservation,
playback, and Undo/Redo remain `LOCAL PROOF REQUIRED`.

## Continuation Audit — Batch `reverse`

The next grounded Animation boundary is **only**
`batch_keyframe_operations.reverse`.

Current Local still performs only:

```text
minTime = min(selected times)
maxTime = max(selected times)
kf.time = maxTime - (kf.time - minTime)
```

Current Blockbench has a native `reverse_keyframes` action with additional
semantics that materially affect Bedrock animation fidelity.

For each selected keyframe, native Blockbench:

1. reflects time with `end + start - kf.time`;
2. if a transform keyframe has multiple data points, reverses `data_points` so
   pre/post transform data follows the reversed timeline direction;
3. for Bezier interpolation, swaps left/right handle time vectors and value
   vectors;
4. multiplies the resulting left/right **handle-time** vectors by `-1` so handle
   direction remains valid after temporal reversal;
5. wraps the operation in keyframe Undo and refreshes keyframe/animation preview.

Local currently does none of items 2–4 and also lacks bounded rollback for this
operation. A reverse that only changes `.time` can therefore preserve the wrong
pre/post data and wrong Bezier tangent direction even though the timestamps look
reversed.

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

Audit and correct **only `batch_keyframe_operations.reverse` native reversal
parity and recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve existing selection modes and keep Geometry Cube/Cuboid-only;
2. keep the existing selected-range time reflection intent, but verify whether
   Blockbench snapping/collision handling is required for this deterministic
   command rather than assuming it;
3. reverse multi-point transform `data_points` exactly where current native
   `reverse_keyframes` does;
4. swap Bezier left/right time and value vectors, then invert handle-time vector
   signs according to current Blockbench reversal semantics;
5. bound the reverse mutation with cancel/revert on failure and perform only the
   required preview/selection refresh;
6. do **not** modify batch `scale`, `offset`, `mirror`, `smooth`, `bake`, timeline
   tools, graph editor, copy/paste, Geometry, or Texture in this slice.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/Undo structure only.
Actual Blockbench reverse results, pre/post data behavior, Bezier tangent
preservation, playback, Undo/Redo, motion arcs, clipping, bone pivots,
return-to-neutral behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until
local runtime testing resumes.