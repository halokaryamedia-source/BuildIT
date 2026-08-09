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

`REFERENCE_FIDELITY_ANIMATION_BATCH_BAKE_HARDENED`

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

## Latest Completed Animation Slice — Batch `bake`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
3393f26c6967dfe50cd121de55890c7d74598ec0
fix: recover batch keyframe bake
```

The source change is limited to `bake_interval` and the
`batch_keyframe_operations.bake` execution path.

`offset`, `mirror`, `scale`, `reverse`, `smooth`, selection modes, timeline,
graph editor, copy/paste, Geometry, and Texture were not intentionally changed.

### Interval safety

The public `bake_interval` contract is now strictly positive. Runtime also
checks the effective interval with:

```text
Number.isFinite(interval) && interval > 0
```

before the sampling loop begins. This closes the previous negative-interval path
that could decrease `time` forever while the loop condition remained
`time <= endTime`.

When `bake_interval` is omitted, the existing default remains:

```text
1 / Animation.selected.snapping
```

### Sampling is separated from mutation

Bake now samples the existing curve before adding any baked keyframes.

For each affected animator transform channel (`rotation`, `position`, `scale`):

1. determine the existing channel start/end times;
2. snap each candidate time through `Timeline.snapTime(time, animation)`;
3. skip an existing or already-planned snapped keyframe time;
4. temporarily set `Timeline.time` to the sample time;
5. read `animator.interpolate(channel, true)`;
6. store the sampled XYZ values in a bake plan.

No model mutation occurs while the bake plan is being sampled. This prevents
newly-added baked keyframes from becoming inputs to later samples in the same
operation.

### New keyframes are owned by the Animation transaction

Previous Local opened:

```text
Undo.initEdit({ keyframes: selectedOrMatchedKeyframes })
```

then created additional keyframes through `createKeyframe(..., false)`.

Current Local instead opens, only after sampling succeeds:

```text
Undo.initEdit({ animations: [animation] })
```

and adds planned keyframes through the current animator primitive:

```text
animator.addKeyframe(...)
```

with explicit channel, snapped time, sampled XYZ data points, and the same
Blockbench default-keyframe interpolation owner used by the old
`createKeyframe()` path.

The selected Animation snapshot includes animator/keyframe state, so newly-added
baked keyframes are inside the recoverable mutation owner. After additions,
`animation.setLength()` updates the target animation length without nested Undo.

Failure after the Animation edit opens runs `Undo.cancelEdit(true)` before the
error is rethrown.

### Timeline-time restoration

Bake snapshots:

```text
const originalTimelineTime = Timeline.time
```

and restores it in `finally`, so both success and failure return sampling state
to the pre-bake time. The final preview/keyframe-selection refresh also runs
from that restored state.

### Diff / proof boundary

The source commit contains only:

1. the `bake_interval` positive-input contract; and
2. the dedicated `bake` safety/sampling/Undo/time-restoration path.

GitHub has no registered CI/status checks for the source commit.

Actual Blockbench sampled values, generated baked curves, playback, and
Undo/Redo remain `LOCAL PROOF REQUIRED`.

## Continuation Audit — Batch `scale` Time-Stretch Parity

The next grounded Animation boundary is **only**
`batch_keyframe_operations.scale`.

Current Local scale still does:

```text
pivot = parameters.scale_pivot || 0
factor = parameters.scale_factor || 1
kf.time = pivot + (kf.time - pivot) * factor
```

### Why this remains a high-value gap

Current native Blockbench timeline time-stretch behavior proves that scaling
keyframe time is not only a scalar `.time` assignment.

When time-stretching selected keyframes, Blockbench:

- computes a `time_factor`;
- derives each new keyframe time around a stretch anchor;
- snaps the new time with `Timeline.snapTime(...)`;
- for Bezier keyframes, restores the original handle-time vectors and multiplies
  both `bezier_left_time` and `bezier_right_time` by the same `time_factor`;
- handles keyframe collisions/casualties;
- calls `Animation.selected.setLength()`;
- finishes through the timeline/keyframe Undo lifecycle.

Current Local does not scale Bezier handle time vectors, does not snap the scaled
time, does not explicitly handle collisions, and has no bounded cancel/revert
path for this operation.

The current use of `scale_factor || 1` also means an explicit `0` is silently
converted to `1`. Whether zero or negative factors should be supported must be
decided from native behavior/source rather than guessed.

`reverse` is intentionally not part of this next slice.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- batch `reverse` semantic/collision audit;
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

Audit and correct **only `batch_keyframe_operations.scale` time-stretch API,
Bezier-handle timing, collision handling, and recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve existing selection modes and keep Geometry Cube/Cuboid-only;
2. determine valid `scale_factor` semantics from current Blockbench source,
   including zero/negative behavior, instead of relying on `factor || 1`;
3. scale selected keyframe time around the requested pivot using current
   Blockbench snapping semantics;
4. for Bezier keyframes, scale `bezier_left_time` and `bezier_right_time` vectors
   consistently with the time factor, matching native time-stretch behavior;
5. handle resulting keyframe collisions through the current Blockbench
   keyframe/Undo lifecycle and update Animation length;
6. bound mutation with cancel/revert on failure;
7. do **not** modify batch `reverse`, `offset`, `mirror`, `smooth`, `bake`,
   timeline tools, graph editor, copy/paste, Geometry, or Texture in this slice.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/Undo structure only.
Actual Blockbench time-stretch results, Bezier curve preservation, collision
results, playback, Undo/Redo, motion arcs, clipping, bone pivots,
return-to-neutral behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until
local runtime testing resumes.