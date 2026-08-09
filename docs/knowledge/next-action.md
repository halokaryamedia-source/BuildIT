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

`REFERENCE_FIDELITY_ANIMATION_TIMELINE_TIME_HARDENED_SELECT_RANGE_GAP`

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

## Latest Completed Animation Slice — `animation_timeline.set_time`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
aa037f3c5cc801c961f485529609549c0d24bb13
fix: validate animation timeline time
```

The exact source diff is limited to the public `animation_timeline.time` schema
and directly-related description.

### Current timeline time contract

When supplied, timeline `time` must now be:

```text
finite
>= 0
<= 1000
```

Invalid, negative, and over-limit values therefore fail at the MCP input
boundary before `Timeline.setTime()` can silently normalize them.

### Native playhead behavior preserved

The execution path remains:

```text
Timeline.setTime(time)
```

Current Blockbench `Timeline.setTime(seconds)` begins with:

```text
seconds = limitNumber(seconds, 0, 1000)
```

then updates the playhead, `Timeline.time`, timecode, timeline sizing, and reveal
position.

The MCP boundary now matches that stable native range instead of accepting a
wider input surface and relying on runtime clamping.

### No animation-length clamp invented

The schema does **not** clamp or reject against `animation.length`.

Current native `Timeline.setTime()` uses its own fixed `0..1000` playhead range,
not the selected Animation length. Accepted values may therefore be beyond the
current authored animation length exactly as the native API permits.

The existing result string remains unchanged and reports the accepted requested
value. Since every accepted value is already within the native range, no range
normalization occurs after schema validation.

### Scope preserved

No change was made to:

- `set_length`, play/pause/stop, FPS, loop, or range selection;
- `create_animation`;
- transform/keyframe behavior;
- effects;
- batch operations;
- Geometry or Texture.

GitHub shows one schema-only source hunk and no registered CI/status checks for
the source commit.

Actual MCP validation, timeline UI/playhead state, preview, playback, Undo/Redo,
and save/reopen remain `LOCAL PROOF REQUIRED`.

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
- finite/ranged `animation_timeline.set_time` input matching native playhead
  range;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `animation_timeline.select_range`

The next grounded Animation boundary is **only action-local range validation for
`animation_timeline.select_range`** in:

```text
mcp/server/tools/animation.ts
```

Current timeline parameters still use the shared:

```text
timeRangeSchema
```

for `range`.

The shared schema currently accepts:

```text
{
  start: z.number(),
  end: z.number()
}
```

without finiteness, non-negative, or ordering constraints.

The `select_range` action then performs direct comparisons:

```text
kf.time >= range.start && kf.time <= range.end
```

and reports success after walking the timeline keyframes.

### Why this is material

A reversed range such as:

```text
start: 5
end: 2
```

cannot match the intended inclusive interval but currently reaches execution and
can produce an empty selection while still returning a successful result.

Non-finite values also do not represent a stable authored time interval.

### Shared-schema boundary

Do **not** harden repository-wide `timeRangeSchema` merely for this action.
It is also consumed by other Animation surfaces such as graph-editor ranges,
batch selection, and copy ranges. A shared migration would widen the scope and
must be audited separately.

The next slice should therefore keep the correction local to
`animation_timeline.select_range`.

### Intended local range contract

For timeline selection only:

```text
start: finite and >= 0
end: finite and >= 0
start <= end
```

Do not add an upper bound of `1000` merely because `set_time` has one. Timeline
range selection is not a call to `Timeline.setTime()`, and authored keyframe
selection should not inherit the playhead limit without source evidence.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- sound/timeline EffectAnimator readback;
- broad batch selection redesign;
- shared `timeRangeSchema` migration;
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

Audit and correct **only `animation_timeline.select_range` local range validation**
in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. do not modify shared `timeRangeSchema` or other range consumers;
3. make the range used by `animation_timeline.select_range` require finite,
   non-negative `start` and `end` with `start <= end`;
4. do not add a `1000` upper bound merely from playhead semantics;
5. preserve current inclusive selection comparisons, selection behavior, preview,
   and result semantics for accepted ranges;
6. do not change `set_time`, `set_length`, `create_animation`, effects, batch,
   copy/paste, Geometry, or Texture;
7. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow parity only. Actual MCP
validation, timeline keyframe selection, selection UI, preview, Undo/Redo, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.