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

`REFERENCE_FIDELITY_ANIMATION_BONE_TIME_HARDENED_SCALE_ZERO_GAP`

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

## Latest Completed Animation Slice — `create_animation` Bone Keyframe Times

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
1f1d23f1ab507a669a94544d26c35ad5df1eec3a
fix: validate created animation bone keyframe times
```

The source diff is limited to the public `create_animation.bones` keyframe schema.
No execute-path mutation, AnimationCodec lifecycle, particle behavior, other
Animation tools, Geometry, or Texture were intentionally changed.

### Upstream time behavior used for the decision

Current Bedrock animation import handles transform-channel timestamp maps with:

```text
for timestamp in b[channel]:
  ba.addKeyframe({
    time: parseFloat(timestamp),
    channel,
    ...
  })
```

`GeneralAnimator.addKeyframe()` stores the supplied time without snapping.
`Keyframe.time` is a numeric property.

The normal Blockbench timeline/export boundary is non-negative:

```text
Timeline.setTime(...)  → lower bound 0
Timeline.snapTime(...) → lower bound 0
Keyframe.getTimecodeString() → Timeline.snapTime(...)
```

Therefore `create_animation` bone keyframe times are now required to be finite and
`>= 0`. No arbitrary maximum and no extra snap-grid normalization were added.

### Channel-aware collision contract

A dedicated `bedrockBoneKeyframesSchema` now validates each bone's keyframe array
before tool execution, therefore before Undo and before `codec.loadFile()`.

For each of:

```text
position
rotation
scale
```

Local tracks the raw numeric times that are actually written into the synthetic
Bedrock timestamp map.

Two entries that define the **same channel at the same numeric time** now fail
validation instead of relying on last-write-wins object assignment.

Example rejected:

```text
{ time: 1, rotation: [...] }
{ time: 1, rotation: [...] }
```

Same-time values across **different channels remain valid**:

```text
{ time: 1, position: [...] }
{ time: 1, rotation: [...] }
```

This preserves legitimate multi-channel poses while preventing silent payload
loss.

The collision check uses raw numeric time, not speculative future snapping,
because the current Bedrock importer does not snap before storing imported
transform keyframes.

### Diff / proof boundary

The exact source commit contains only:

- `bedrockBoneKeyframeSchema` with finite/non-negative `time`;
- `bedrockBoneKeyframesSchema` with per-channel effective-time collision checks;
- the existing `bones` record switched to that validated keyframe-array schema.

The payload builder itself remains unchanged. GitHub has no registered CI/status
checks for the source commit.

Actual MCP validation, codec import, created keyframes, playback, Undo/Redo, and
save/reopen remain `LOCAL PROOF REQUIRED`.

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
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — Scalar `scale: 0` Preservation

The next grounded Animation boundary is **only explicit scalar zero preservation
for `create_animation` scale values** in:

```text
mcp/server/tools/animation.ts
```

Current public keyframe shape intentionally accepts:

```text
scale: vector3 | number
```

The new collision validation correctly treats any scale value other than
`undefined` as authored input, including numeric `0`.

However the synthetic Bedrock payload builder still uses:

```text
if (keyframe.scale) {
  (acc.scale ??= {})[timeKey] = keyframe.scale;
}
```

so an explicit scalar:

```text
scale: 0
```

is silently omitted because `0` is falsy.

### Why `0` is valid input

Current Bedrock animation import explicitly supports channel values whose type is
`number`, and its keyframe-data conversion maps a numeric source uniformly to:

```text
x = source
y = source
z = source
```

There is no native special case excluding numeric zero. Therefore MCP must not
reinterpret `0` as absence when its public schema already permits scalar scale.

This is a presence-check bug, not a reason to redesign scale representation.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- `animation_length` optional/zero semantics;
- transform coordinate/sign-space contract;
- sound/timeline EffectAnimator readback;
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

Audit and correct **only explicit scalar `scale: 0` preservation inside
`create_animation` synthetic Bedrock payload construction** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the existing `scale: vector3 | number` public contract;
3. replace only the falsy presence check that drops numeric zero with an
   explicit-presence check supported by the schema/native codec;
4. do not change vector scale behavior, keyframe time/collision validation,
   `animation_length`, transform coordinate/sign semantics, particle/sound/timeline
   effects, other Animation tools, Geometry, or Texture;
5. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow only. Actual scalar-zero
scale import, resulting authored scale, playback, Undo/Redo, motion, clipping,
and save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.