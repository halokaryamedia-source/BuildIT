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

`REFERENCE_FIDELITY_ANIMATION_TIMELINE_LENGTH_HARDENED_TIME_GAP`

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

## Latest Completed Animation Slice — `animation_timeline.set_length`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
bb35dbc23a20d5c522b05de4d6cd2d01d37d3a56
fix: validate animation timeline length
```

The exact source diff is limited to the public `animation_timeline.length`
schema and directly-related description.

### Current timeline length contract

When supplied, timeline `length` must now be:

```text
finite
>= 0
<= 10000
```

Invalid, negative, and over-limit values therefore fail at the MCP input
boundary before the existing persistent Animation-level Undo transaction opens.

### Native authored-keyframe floor remains owner

The execution path is intentionally unchanged:

```text
animation.setLength(length)
```

Current Blockbench `Animation.setLength(len)` performs:

```text
this.length = limitNumber(len, this.getMaxLength(), 1e4)
```

so an otherwise valid request below the current authored keyframe maximum is not
pre-rejected by MCP. Native Blockbench remains the owner of that runtime floor.

The tool already reports:

```text
animation.length
```

after mutation, so a native floor adjustment remains observable to the caller.

### Recoverability preserved

The existing `set_length` mutation still runs through the same helper:

```text
Undo.initEdit({ animations: [animation] })
animation.setLength(length)
Undo.finishEdit("Change animation length")
```

with `Undo.cancelEdit(true)` on failure.

No mutation, result, or preview behavior changed in this slice.

### Scope preserved

No change was made to:

- `create_animation`;
- transform/keyframe behavior;
- `set_time`, play/pause/stop, FPS, loop, or range selection;
- effects;
- batch operations;
- Geometry or Texture.

GitHub shows a single schema-only source hunk and no registered CI/status checks
for the source commit.

Actual MCP validation, native keyframe-floor clamping, timeline UI state,
Undo/Redo, playback, and save/reopen remain `LOCAL PROOF REQUIRED`.

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
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `animation_timeline.set_time`

The next grounded Animation boundary is **only public input parity for
`animation_timeline.set_time`** in:

```text
mcp/server/tools/animation.ts
```

Current Local timeline schema still accepts:

```text
time: z.number().optional()
```

and the action calls:

```text
Timeline.setTime(time)
```

### Current native time behavior

Current Blockbench `Timeline.setTime(seconds)` begins with:

```text
seconds = limitNumber(seconds, 0, 1000)
```

then writes the normalized value into the playhead / `Timeline.time`, updates the
timecode when appropriate, updates timeline size if needed, and reveals the
requested time.

Therefore native timeline-time input has a stable range boundary:

```text
0..1000 seconds
```

The Local MCP boundary currently does not state that range and can rely on silent
runtime normalization instead.

### Grounded correction direction

The next slice should validate only the stable public invariant:

```text
time must be finite
time must be >= 0
time must be <= 1000
```

Do not clamp against `animation.length`; current `Timeline.setTime()` does not use
the selected Animation length as its upper bound.

After this validation, the existing result string can continue reporting the
requested time because every accepted value is already inside the native range
and therefore is not range-normalized by `Timeline.setTime()`.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- sound/timeline EffectAnimator readback;
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

Audit and correct **only `animation_timeline.set_time` public time validation** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve `Timeline.setTime()` as the runtime owner and do not change playback,
   stop, or preview behavior;
3. make timeline `time`, when provided, finite and within `0..1000` at the MCP
   boundary;
4. do not clamp against the current Animation length; native `Timeline.setTime()`
   has a fixed `0..1000` boundary instead;
5. keep the existing `set_time` result semantics for accepted values;
6. do not change `set_length`, `create_animation`, effects, batch operations,
   Geometry, or Texture;
7. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow parity only. Actual MCP
validation, timeline UI/playhead state, playback, Undo/Redo, and save/reopen remain
`LOCAL PROOF REQUIRED` until local runtime testing resumes.