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

`REFERENCE_FIDELITY_ANIMATION_PARTICLE_TIMESTAMP_HARDENED_BONE_TIME_GAP`

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

## Latest Completed Animation Slice — Particle Timestamp Contract

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
7507591e1166b3a7ad8206f8d0f4b9e926e0c29e
fix: validate created animation particle timestamps
```

The source change is limited to the public timestamp-key contract for
`create_animation.particle_effects`. Particle object fields, bone binding,
AnimationCodec/Undo lifecycle, authored readback, other Animation tools,
Geometry, and Texture were not intentionally changed.

### Upstream time behavior used for the decision

Current Bedrock animation import reads particle timestamps with:

```text
parseFloat(timestamp)
→ EffectAnimator.addKeyframe({ channel: "particle", time: ... })
```

`GeneralAnimator.addKeyframe()` constructs/pushes that keyframe without timeline
snapping. `Keyframe.time` itself is a plain numeric property.

However the user-facing Blockbench timeline is non-negative:

```text
Timeline.setTime(...)  → lower bound 0
Timeline.snapTime(...) → lower bound 0
```

and Bedrock keyframe time serialization uses:

```text
Keyframe.getTimecodeString()
→ Timeline.snapTime(this.time, animation)
```

Therefore allowing negative imported particle timestamps would create authored
state that Blockbench's normal timeline/export path normalizes back to zero or
non-negative time.

No arbitrary maximum timestamp was introduced. Current evidence supports a
non-negative lower boundary, but not a new MCP-specific upper cap.

### Public timestamp contract

`particle_effects` still uses timestamp strings as record keys and still accepts
either one particle object or a non-empty particle-object array at each key.

The record now has schema-level `superRefine` validation before tool execution,
therefore before `Undo.initEdit()` and before `codec.loadFile()`.

For every key Local now:

1. trims surrounding whitespace for numeric interpretation;
2. requires a non-empty value;
3. requires both `Number(...)` and `Number.parseFloat(...)` to produce the same
   finite number;
4. rejects negative effective time;
5. tracks effective numeric times and rejects another distinct key that resolves
   to the same number.

Using both numeric parsers intentionally preserves complete numeric forms that the
codec can read while rejecting permissive-prefix cases such as:

```text
1abc
0x10
1e
```

instead of adding an arbitrary regex language.

Equivalent spellings such as:

```text
1
1.0
01
1e0
```

cannot coexist in one particle record because they all resolve to the same
effective imported time.

Collision detection is based on the **raw numeric time used by the importer**,
not on a speculative future snap grid. The native codec does not snap the time
before `GeneralAnimator.addKeyframe()` stores it.

### Diff / proof boundary

The exact source diff contains only:

- one local `bedrockParticleEffectsSchema` wrapper;
- timestamp validity checks;
- effective-time collision checks;
- the existing `particle_effects` field switched to that validated schema.

No execute-path mutation logic changed. GitHub has no registered CI/status checks
for the source commit.

Actual MCP validation messages, codec import, emitter playback, locator binding,
script execution, and save/reopen behavior remain `LOCAL PROOF REQUIRED`.

## Completed High-Value Animation Boundaries Kept In Place

- deterministic Animation + Group identity for mutation/readback paths;
- recoverable `manage_keyframes` mutation and selection lifecycle;
- native-vector Bezier handle contract;
- target-bound recoverable copy/paste;
- axis-aware graph-editor Bezier mutation;
- recoverable persistent timeline settings;
- hardened batch offset/mirror/bake/scale/reverse/smooth operations;
- focused authored Animation transform readback;
- current Bedrock `AnimationCodec` creation / Undo / created identity;
- deterministic `create_animation` bone-to-Group binding;
- native-shaped `create_animation.particle_effects` input;
- authored particle-effect readback;
- validated non-ambiguous particle timestamp keys;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `create_animation` Bone Keyframe Times

The next grounded Animation boundary is **only transform bone-keyframe time
validation and same-channel collision semantics inside `create_animation`** in:

```text
mcp/server/tools/animation.ts
```

Current public bone keyframes still use:

```text
time: z.number()
```

and synthetic Bedrock data is built with:

```text
timeKey = keyframe.time.toString()
(acc.position ??= {})[timeKey] = keyframe.position
(acc.rotation ??= {})[timeKey] = keyframe.rotation
(acc.scale ??= {})[timeKey] = keyframe.scale
```

### Why this is material

The current reduction can silently replace earlier requested data when two
entries on the same bone provide the same effective timestamp for the same
channel.

Examples:

```text
entry A: time 1, rotation [...]
entry B: time 1, rotation [...]
```

The second rotation overwrites the first before the Bedrock codec sees either
request as distinct authored intent.

By contrast, the same time across **different** channels is valid and must not be
rejected merely because the timestamp matches:

```text
entry A: time 1, position [...]
entry B: time 1, rotation [...]
```

The current `z.number()` time contract also does not express the non-negative
Blockbench timeline/export boundary established above.

The next slice must determine the smallest channel-aware preflight that prevents
silent payload overwrite while preserving legitimate same-time multi-channel
keyframes. It must also decide from current source whether bone time should be
only finite/non-negative or additionally normalized before JSON construction.

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

Audit and correct **only `create_animation` bone keyframe time validation and
same-bone/same-channel equivalent-time collision semantics** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the current bone record and keyframe object shape unless direct
   source proof requires a minimal contract correction;
3. establish the finite/non-negative bone-time boundary from current
   Blockbench/Bedrock import and timeline behavior before editing;
4. reject same-bone/same-channel requests that collapse to one effective payload
   timestamp instead of relying on last-write-wins object assignment;
5. preserve legitimate same-time values across different transform channels;
6. keep all validation before Undo / `codec.loadFile()`;
7. do not change `animation_length`, transform coordinate/sign semantics,
   particle/sound/timeline effects, other Animation tools, Geometry, or Texture
   in this slice;
8. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow only. Actual
MCP validation, codec import, authored keyframes, playback, Undo/Redo, motion
arcs, clipping, bone pivots, return-to-neutral behavior, particle behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.