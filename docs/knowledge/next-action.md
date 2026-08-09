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

`REFERENCE_FIDELITY_ANIMATION_BATCH_VALUE_MUTATIONS_HARDENED`

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

## Latest Completed Animation Slice — Batch Value Mutation / Mirror

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commits:

```text
eef0d5b890e862eec7d5156e6eecb5d03cc83c40
fix: align batch keyframe value mutations

46f83d3e31bf7fe01bc152119f800aba82b60b5a
fix: limit batch value offsets to transforms
```

The source change is intentionally limited to
`batch_keyframe_operations` operations:

```text
offset
mirror
```

`scale`, `reverse`, `smooth`, `bake`, selection modes, timeline, graph editor,
copy/paste, Geometry, and Texture remain outside this source slice.

### `offset_values` now uses Blockbench keyframe primitives

Previous Local synthesized a property that current Blockbench does not own:

```text
kf.set("values", [...])
```

Current Blockbench `Keyframe.set()` / `Keyframe.offset()` operate on axis keys
`x`, `y`, and `z`.

Local now applies vector offsets through:

```text
kf.offset("x", dx)
kf.offset("y", dy)
kf.offset("z", dz)
```

This preserves current Blockbench expression-aware offset behavior instead of
converting values through an invented aggregate property.

`offset_values` is now applied only when `kf.transform` is true so effect/sound/
timeline keyframes do not receive synthetic transform state. Existing
`offset_time` behavior remains applicable to the selected keyframes.

For a uniform transform keyframe:

- equal XYZ offsets preserve uniform mode and apply one native uniform offset;
- differing XYZ offsets explicitly disable uniform mode before applying each
  axis independently.

### `mirror` now uses native channel-aware semantics

Previous Local negated one component from `kf.getArray()` for every transform
channel. That is incorrect for current Blockbench mirroring because rotation and
position use different component rules.

Local now preflights `mirror_axis` before Undo and calls:

```text
kf.flip(axisIndex)
```

Current Blockbench `Keyframe.flip(axis)` owns the mirror behavior:

- position → invert the requested axis;
- rotation → invert the two axes perpendicular to the mirror axis;
- scale / non-transform → no transform flip;
- Bezier transform value handles are mirrored consistently with the channel.

This keeps Bedrock bone rotation mirroring aligned with Blockbench rather than
using a generic array negation.

### Recoverability

Only the affected `offset` / `mirror` mutation path was moved into the bounded
transaction:

```text
preflight
→ Undo.initEdit({ keyframes })
→ mutate through Keyframe APIs
→ Undo.finishEdit(...)
```

Failure after the edit opens runs:

```text
Undo.cancelEdit(true)
→ Animator.preview()
→ updateKeyframeSelection()
→ rethrow
```

The existing `scale`, `reverse`, `smooth`, and `bake` transaction/control flow
was intentionally not rewritten in this slice.

### Diff / proof boundary

Net source changes from the pre-slice HEAD affect only
`mcp/server/tools/animation.ts` inside the batch `offset` / `mirror` area.
GitHub has no registered CI/status checks for the source commits.

Actual Blockbench offset/mirror results, expression handling, playback, and
Undo/Redo remain `LOCAL PROOF REQUIRED`.

## Continuation Audit — `batch_keyframe_operations.bake`

The next grounded Animation boundary is **only the batch `bake` operation**.

Current Local still has three high-impact lifecycle/safety gaps.

### 1. `bake_interval` can be negative

The MCP schema currently accepts any number for `bake_interval`, and runtime uses:

```text
interval = bake_interval || 1 / Animation.selected.snapping
```

followed by:

```text
for (time = startTime; time <= endTime; time += interval)
```

A negative explicit interval therefore decreases `time` while the loop condition
continues to require `time <= endTime`, creating a normal path to a non-terminating
bake loop. Interval validity must be preflighted before mutation.

### 2. Newly baked keyframes are outside the obvious current Undo capture

Current batch Undo begins with:

```text
Undo.initEdit({ keyframes: selectedOrMatchedKeyframes })
```

but `bake` then creates additional keyframes through:

```text
animator.createKeyframe(..., false)
```

Current Blockbench `GeneralAnimator.createKeyframe()` pushes a new keyframe,
replaces collisions, and updates `Animation.selected.setLength()`. With
`undo=false` it does not open its own transaction. The new additions therefore
need an outer mutation owner that can actually restore the pre-bake animation
structure; do not assume the original selected-keyframe list captures additions.

### 3. `Timeline.time` is used as sampling state and not restored

Current bake changes `Timeline.time` for each sampled time and leaves the final
sample time behind on success. Failure can also leave the playhead changed.
The pre-bake timeline time must be restored on both success and failure without
turning playback/scrub behavior into a broader timeline rewrite.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- batch `scale` / `reverse` semantic audit;
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

Audit and correct **only `batch_keyframe_operations.bake` interval safety,
keyframe-creation/Undo ownership, and timeline-time restoration** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve existing selection modes and keep Geometry Cube/Cuboid-only;
2. validate the effective bake interval as finite and strictly positive before
   entering the sampling loop;
3. replace or bound `createKeyframe(..., false)` with current Blockbench-owned
   primitives/Undo scope that can restore newly-added baked keyframes and any
   replaced collisions on failure/Undo;
4. keep the bake target bound to the currently selected Animation and update its
   length through the correct owner without nested Undo;
5. snapshot and restore `Timeline.time` on both success and failure;
6. do **not** modify batch `offset`, `mirror`, `scale`, `reverse`, `smooth`,
   timeline tools, graph editor, copy/paste, Geometry, or Texture in this slice.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/Undo structure only.
Actual Blockbench bake sampling, generated keyframes, interpolation result,
playhead restoration, playback, Undo/Redo, motion arcs, clipping, bone pivots,
return-to-neutral behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until
local runtime testing resumes.