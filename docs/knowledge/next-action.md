# Next Action

Updated: 2026-08-10

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation deterministic, API-correct, recoverable, and inspectable on the
intended Bedrock rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_TIMELINE_RANGE_HARDENED_SELECTION_LIFECYCLE_GAP`

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

## Latest Completed Animation Slice — `animation_timeline.select_range` Input

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
dccd17dc29cfa1b83b3b7b2d4a50c9d75edf1839
fix: validate animation timeline range
```

The exact source diff is limited to a timeline-local range schema and wiring the
`animation_timeline.range` parameter to that schema.

### Current timeline selection range contract

`animation_timeline.select_range` now accepts only:

```text
start: finite and >= 0
end: finite and >= 0
start <= end
```

The interval remains inclusive.

No `1000` upper bound was added because this range filters authored keyframes and
does not call `Timeline.setTime()`.

### Shared schema intentionally unchanged

Repository-wide `timeRangeSchema` remains unchanged. It is still used by other
Animation surfaces such as graph editor ranges, batch selection, and copy ranges.
Those callers were not silently migrated as part of this timeline-only boundary.

### Execute behavior intentionally unchanged

The existing `select_range` execute path still compares:

```text
kf.time >= range.start && kf.time <= range.end
```

No selection/runtime behavior was changed in this completed slice.

GitHub shows only the local schema addition and the timeline `range` wiring; no
registered CI/status checks exist for the source commit.

Actual MCP validation, timeline selection UI, preview, Undo/Redo, and save/reopen
remain `LOCAL PROOF REQUIRED`.

## Completed High-Value Animation Boundaries Kept In Place

- deterministic Animation + Group identity for mutation/readback paths;
- recoverable `manage_keyframes` mutation and selection lifecycle;
- native-vector Bezier handle contract;
- target-bound recoverable copy/paste;
- axis-aware graph-editor Bezier mutation;
- recoverable persistent timeline settings;
- hardened batch offset/mirror/bake/scale/reverse/smooth operations;
- authored transform + particle readback;
- current Bedrock `AnimationCodec` creation / Undo / created identity;
- deterministic `create_animation` bone-to-Group binding;
- native-shaped `create_animation.particle_effects` input;
- validated non-ambiguous particle timestamp keys;
- finite/non-negative, channel-aware transform bone keyframe times;
- explicit scalar `scale: 0` preservation;
- Blockbench-authored coordinate/sign-space parity across create/mutate/readback;
- finite `create_animation` transform values;
- finite/ranged `create_animation.animation_length` with native zero omission;
- finite/ranged persistent `animation_timeline.set_length` input while preserving
  native authored-keyframe floor semantics;
- finite/ranged `animation_timeline.set_time` input matching native playhead range;
- finite/non-negative/ordered `animation_timeline.select_range` input without
  widening shared range semantics;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `animation_timeline.select_range` Selection Lifecycle

The next grounded Animation boundary is **only the runtime selection lifecycle of
`animation_timeline.select_range`** in:

```text
mcp/server/tools/animation.ts
```

Current Local execute path is:

```text
Timeline.keyframes.forEach((kf) => {
  if (kf.time >= range.start && kf.time <= range.end) {
    kf.select();
  } else {
    kf.selected = false;
  }
});
```

### Proved native mismatch

Current Blockbench `Keyframe.select(event)` clears the previous timeline
selection when called without a modifier event:

```text
if (!event || no shift/ctrl modifier) {
  Timeline.selected.forEach(kf => kf.selected = false)
  Timeline.selected.empty()
}
...
Timeline.selected.safePush(this)
this.selected = true
```

Therefore repeatedly calling `kf.select()` with no event is not a valid way to
build a multi-keyframe range selection. Each matching keyframe can clear the
selection established by the previous matching keyframe, leaving only the last
one selected.

The current `else` branch also sets `kf.selected = false` directly without
removing that keyframe from `Timeline.selected`, so a no-match/partial-match path
can leave selection flags and the global selected-array lifecycle dependent on
previous state.

### Existing Local recovery pattern

`manage_keyframes` already has the stronger selection pattern in the same file:

```text
Undo.initSelection({ timeline: true })
Timeline.unselect()
... set selected flags + update Timeline.selected ...
updateKeyframeSelection()
Undo.finishSelection(...)
```

with `Undo.cancelSelection(true)` and `updateKeyframeSelection()` on failure.

The next slice should reuse that ownership model rather than inventing a new
selection abstraction.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- sound/timeline EffectAnimator readback;
- shared `timeRangeSchema` migration;
- graph-editor/batch/copy range cleanup;
- broad batch selection redesign;
- shared Animation/Group resolver refactor;
- local save/reopen and visual playback proof;
- broad public-surface cleanup of generic non-Bedrock tools.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- auxiliary 2D `texture_selection` completeness: parked/non-gating.
- shared `findTextureGroupOrThrow()` hardening: deferred until callers can be exhaustively audited.
- shared `layerBlendModeEnum` cleanup: deferred until callers can be exhaustively audited.
- shared `findGroupOrThrow()` migration: deferred.
- shared `keyframeDataSchema` Bezier contract: unchanged because direct caller ownership could not be exhaustively proven.
- save/reopen proof: later local validation.

## Next Step

Audit and correct **only `animation_timeline.select_range` selection lifecycle**
in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the completed local range validation and inclusive comparisons;
3. stop using repeated no-event `kf.select()` calls to construct the range;
4. establish the range selection through one timeline selection transaction,
   keeping `Timeline.selected` and each keyframe's `selected` flag synchronized;
5. use the existing Blockbench/Local selection lifecycle (`Undo.initSelection`,
   clear existing selection, apply exact range, `updateKeyframeSelection`, finish;
   cancel/recover on failure);
6. preserve current preview and success-result semantics unless source proof
   requires a directly-related correction;
7. do not change `set_time`, `set_length`, create/effects/batch/copy-paste,
   Geometry, or Texture;
8. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

Primary specialist for the next slice: `blockbench-runtime-development`, because
the remaining fault is Blockbench selection/Undo runtime mechanics rather than
the MCP input contract.

## Proof Boundary

ChatGPT → GitHub may prove source/API/control-flow selection lifecycle only.
Actual multi-keyframe range selection, timeline UI state, Undo/Redo, preview, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.