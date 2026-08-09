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

`REFERENCE_FIDELITY_ANIMATION_CREATE_LENGTH_HARDENED_TIMELINE_LENGTH_GAP`

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

## Latest Completed Animation Slice — `create_animation.animation_length`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
decc44629a278b80003e6f35ed631e2aebfd1a28
fix: validate created animation length
```

The exact source diff is limited to the public `create_animation.animation_length`
schema and its directly-related description.

### Current creation length contract

When supplied, `animation_length` must now be:

```text
finite
>= 0
<= 10000
```

Invalid, negative, and over-limit values therefore fail at the MCP input boundary
before `codec.loadFile()` instead of reaching JSON or relying on native clamping.

### Zero semantics kept native

The existing synthetic Bedrock payload still uses:

```text
...(animation_length && { animation_length })
```

so explicit numeric `0` is accepted by the public schema but omitted from the
Bedrock payload.

This is intentional. Current native Bedrock compile emits `animation_length` only
when `animation.length` is truthy, so zero is export-omission-equivalent rather
than a distinct persistent Bedrock representation.

### No invented keyframe-length rule

The slice does **not** reject an explicit creation length merely because a
requested transform/effect keyframe occurs later.

Current Bedrock import constructs the Animation with `a.animation_length` before
adding keyframes. Imported keyframes are added with `GeneralAnimator.addKeyframe()`
and the codec does not perform a post-keyframe `setLength()` normalization pass.

Therefore enforcing `animation_length >= last requested keyframe` in the MCP
creation schema would invent behavior that current native import does not own.

### Scope preserved

No change was made to:

- transform finiteness;
- Blockbench-authored position/rotation sign conversion;
- keyframe-time/collision validation;
- scalar `scale: 0` preservation;
- deterministic Group binding;
- particle payload/timestamp behavior;
- AnimationCodec / Undo lifecycle;
- other Animation tools;
- Geometry or Texture.

GitHub has no registered CI/status checks for the source commit.

Actual MCP validation, codec creation, authored length, playback, Undo/Redo, and
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
- explicit scalar `scale: 0` preservation;
- Blockbench-authored coordinate/sign-space parity across create/mutate/readback;
- finite `create_animation` transform values;
- finite/ranged `create_animation.animation_length` with native zero omission;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `animation_timeline.set_length`

The next grounded Animation boundary is **only public input parity for persistent
`animation_timeline.set_length`** in:

```text
mcp/server/tools/animation.ts
```

Current Local timeline schema still accepts:

```text
length: z.number().optional()
```

and the `set_length` action calls:

```text
animation.setLength(length)
```

inside the existing recoverable Animation-level Undo transaction.

### Current native length mutation behavior

Current Blockbench `Animation.setLength(len)` performs:

```text
this.length = limitNumber(len, this.getMaxLength(), 1e4)
```

Therefore mutation has two distinct native constraints:

1. upper boundary: `10000` seconds;
2. lower boundary at runtime: `animation.getMaxLength()`.

`getMaxLength()` is derived from the Animation's existing authored keyframes.
Consequently requesting `set_length: 0` on an Animation whose authored keyframes
extend to 3 seconds does not produce length 0; native Blockbench clamps the
result to at least the authored maximum.

The existing tool already returns the actual resulting `animation.length`, so
that native floor is observable and should remain the runtime owner.

### Grounded correction direction

The next slice should validate only what is stable at the MCP input boundary:

```text
length must be finite
length must be >= 0
length must be <= 10000
```

Do **not** pre-reject a value merely because it is below `getMaxLength()`. Let the
current `Animation.setLength()` own that authored-keyframe floor and keep returning
the actual resulting value.

This prevents `NaN`, infinities, negative values, or over-limit requests from
being silently normalized while preserving Blockbench's real mutation semantics.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- sound/timeline EffectAnimator readback;
- `animation_timeline.set_time` range semantics;
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

Audit and correct **only `animation_timeline.set_length` public length validation**
in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the existing recoverable Animation-level Undo mutation path;
3. make timeline `length`, when provided, finite and within `0..10000` at the MCP boundary;
4. do not pre-reject values below current `animation.getMaxLength()`; native `Animation.setLength()` remains owner of that runtime floor;
5. keep the result reporting the actual resulting `animation.length`;
6. do not change `create_animation`, playback/time actions, effects, batch operations, Geometry, or Texture;
7. inspect the exact source diff immediately and advance to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow parity only. Actual MCP
validation, native length clamping against authored keyframes, timeline UI state,
playback, Undo/Redo, and save/reopen remain `LOCAL PROOF REQUIRED` until local
runtime testing resumes.