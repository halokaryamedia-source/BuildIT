# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation deterministic, API-correct, recoverable, and inspectable on the
intended Bedrock rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_READBACK_HARDENED_CREATE_IMPORTER_GAP`

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

## Latest Completed Animation Slice — Authored Animation Readback

Primary source:

```text
mcp/server/tools/animation-inspection.ts
```

Registration/docs owners:

```text
mcp/server/tools.ts
mcp/build/docs-manifest.ts
```

Source commits:

```text
c37eecff7363a97268ab4b4aebe7352645639036
feat: add authored animation inspection

b9fe0c9f152094de930d493f242443524e64955a
feat: register animation inspection

020cfde4bea9a8a73f9df284d39024d9e4cc2198
docs: register animation inspection surface
```

### Why inspection is a dedicated file

Source inspection showed an existing focused read-only pattern in:

```text
mcp/server/tools/element-inspection.ts
```

The new Animation readback follows that bounded pattern instead of expanding the
large mutation-heavy `animation.ts` file. It remains registered under the
Animation docs category and core tool registration.

This choice avoids touching existing Animation mutation behavior while adding
exactly one public read-only surface.

### Public surface

New tool:

```text
inspect_animation
```

Input:

- `animation_id` — optional exact Animation UUID or exact unique name; omitted
  reference uses the currently selected Animation;
- `bone` — optional exact Group UUID or exact unique Group name.

Animation and Group targeting use the same deterministic semantics as the
existing Animation mutation surface:

```text
exact UUID
→ exact unique name
→ ambiguous/missing error
```

The inspection implementation keeps its resolver local because the existing
mutation resolver is file-local; refactoring mutation targeting into a shared
helper would widen this readback-only slice.

### Read shape

Every call returns structured MCP content containing authored Animation identity
and settings:

```text
uuid
name
loop
length
snapping
```

It also returns stable summaries of existing `BoneAnimator` instances:

```text
animator UUID/name
group UUID/name when the Group still exists
rotation keyframe count
position keyframe count
scale keyframe count
```

When `bone` is provided, `focused_bone` returns detailed authored transform
channels. Keyframes are copied and sorted by time then UUID for deterministic
readback.

Each detailed keyframe exposes:

```text
uuid
time
values for every authored data point
uniform
interpolation
Bezier linked state + left/right time/value vectors when interpolation=bezier
```

A valid Group with no animator returns:

```text
has_animator: false
animator: null
empty rotation/position/scale keyframe arrays
```

so inspection does not need to create missing animation data merely to report
that none exists.

### Strict read-only boundary

`inspect_animation` does not call:

```text
Animation.select()
Timeline.setTime(...)
Animator.preview()
Animation.getBoneAnimator(...)
Undo.*
```

It reads `Animation.all/selected`, `animation.animators`, `Group.all`, and current
keyframe authored properties only.

Therefore inspection does not intentionally:

- change Animation/bone/keyframe selection;
- move the playhead;
- mutate preview state;
- create/register a missing `BoneAnimator`;
- change Geometry or Texture.

### Manifest / registration

The dedicated inspection docs array is merged into the existing `Animation`
category in `mcp/build/docs-manifest.ts`.

`registerAnimationInspectionTools` is added to the existing core registration
list in `mcp/server/tools.ts`.

Generated docs were not hand-edited.

### Diff / proof boundary

Net source changes from the pre-slice HEAD are limited to:

```text
mcp/server/tools/animation-inspection.ts  (new)
mcp/server/tools.ts                       (2 registration lines)
mcp/build/docs-manifest.ts                (Animation docs import/merge)
```

`mcp/server/tools/animation.ts` and all existing Animation mutation paths were
not changed in this slice.

Current Blockbench typings establish:

- `AnimationItem.all` / `AnimationItem.selected`;
- `_Animation.uuid/name/loop/length/snapping/animators`;
- `BoneAnimator` / transform channel ownership;
- `_Keyframe` authored data points, time, interpolation, and Bezier vectors.

Actual values returned from a live project remain `LOCAL PROOF REQUIRED`.

## Animation Mutation / Readback Boundary Now Covered

Current high-value Animation source-hardening includes:

- deterministic Animation + Group target identity;
- recoverable `manage_keyframes` create/edit/delete and selection lifecycle;
- native-vector Bezier handle contract;
- target-bound recoverable copy/paste;
- axis-aware graph-editor Bezier mutation;
- recoverable persistent timeline settings;
- hardened batch offset/mirror/bake/scale/reverse/smooth paths;
- focused authored Animation readback;
- no Mesh/vertex/morph animation expansion.

This remains source/static proof until local Blockbench validation resumes.

## Continuation Audit — `create_animation` Importer / Lifecycle

The next grounded Animation boundary is **only `create_animation`**.

Current Local still builds a Bedrock animation JSON object and calls:

```text
Animator.loadFile({ content: JSON.stringify(...) })
```

Current Blockbench typings explicitly mark `Animator.loadFile()` deprecated and
state that `AnimationCodec` should be used instead.

Current Blockbench Bedrock animation codec owns import through:

```text
AnimationCodec
→ bedrock animation codec
→ codec.loadFile(file, animation_filter)
```

The native Bedrock import flow wraps codec loading in Animation Undo when
animations are imported.

### Why this is a material gap

`create_animation` is currently the only stable Animation creation surface, yet
it depends on a deprecated importer and does not expose a bounded creation
transaction/result identity comparable to the mutation paths that were already
hardened.

The current source also returns only a success string based on the requested
name/bone count; it does not prove which newly created Animation UUID actually
entered `Animation.all`.

### Decisions to audit before editing

The next slice must determine from current Blockbench source/API:

1. the correct Bedrock `AnimationCodec` instance/access path from plugin runtime;
2. the exact outer Undo ownership needed when loading one synthetic in-memory
   animation without opening an import dialog;
3. how to capture the newly created Animation deterministically from codec output
   or before/after Animation identity without guessing;
4. whether duplicate requested Animation names need explicit preflight or whether
   current codec ownership already defines the valid behavior;
5. how to return the created Animation UUID/name without widening into broad
   animation import/export support.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- broad batch selection redesign;
- shared Animation/Group resolver refactor;
- local save/reopen and visual playback proof;
- broad public-surface cleanup of generic non-Bedrock tools.

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

## Next Step

Audit and correct **only `create_animation` current `AnimationCodec` creation /
Undo / created-identity lifecycle** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. replace the deprecated `Animator.loadFile()` creation path with the current
   Blockbench-owned AnimationCodec path only after proving the exact codec API;
3. preserve the current focused Bedrock animation input scope; do not build a
   generic importer/exporter;
4. make creation recoverable through the correct Animation Undo owner without
   nested Undo;
5. deterministically identify the newly created Animation and return at least its
   UUID/name rather than trusting only the requested input name;
6. do not modify existing keyframe/graph/timeline/batch/copy-paste/readback
   behavior in this slice;
7. inspect the exact commit diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow/Undo structure
only. Actual MCP registration, live authored values, codec import behavior,
playback, Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral
behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until local runtime
testing resumes.
