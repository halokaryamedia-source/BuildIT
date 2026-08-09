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

`REFERENCE_FIDELITY_ANIMATION_CREATE_TRANSFORM_FINITE_HARDENED_LENGTH_GAP`

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

## Latest Completed Animation Slice — `create_animation` Transform Finiteness

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
06f2e3260a401e238004a67d8490473c7da4f5f4
fix: require finite created animation transforms
```

The source change is limited to the local public schema used by
`create_animation` transform values.

### Local finite transform contract

A dedicated creation-only schema now requires every position/rotation/scale
vector component to be a finite number:

```text
finiteCreateAnimationVector3Schema
= array(z.number().finite()).length(3)
```

`position` and `rotation` use that schema directly.

`scale` still accepts the existing two authored forms:

```text
[x, y, z]
```

or:

```text
uniform scalar
```

but both vector components and the scalar must now be finite.

This prevents `NaN`, `Infinity`, and `-Infinity` from reaching synthetic Bedrock
JSON, where they cannot remain valid numeric authored transform values.

### Scope preservation

The shared repository-wide `vector3Schema` was **not** changed. This avoids
silently changing unrelated MCP tools that also import that shared schema.

The following existing `create_animation` behavior remains unchanged:

- finite/non-negative keyframe time and per-channel collision validation;
- deterministic Group binding;
- Blockbench-authored transform-space contract;
- pre-codec position X and rotation X/Y sign conversion;
- scalar `scale: 0` preservation;
- particle object/timestamp contract;
- current Bedrock `AnimationCodec` / Undo lifecycle.

No execute-path mutation logic changed in this slice.

### Diff / proof boundary

The exact source diff contains only:

- one local finite 3D-vector schema;
- `position` and `rotation` switched from shared `vector3Schema` to that local
  creation-only schema;
- vector/scalar `scale` switched to finite-number equivalents;
- directly-related public descriptions.

GitHub has no registered CI/status checks for the source commit.

Actual MCP rejection behavior, codec-created authored transforms, playback,
Undo/Redo, motion direction, clipping, and save/reopen remain
`LOCAL PROOF REQUIRED`.

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
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `create_animation.animation_length`

The next grounded Animation boundary is **only the public `animation_length`
contract and its synthetic Bedrock payload semantics** in:

```text
mcp/server/tools/animation.ts
```

Current Local still accepts:

```text
animation_length: z.number().optional()
```

and writes it with:

```text
...(animation_length && { animation_length })
```

### Current native behavior

Current Bedrock animation import passes the file value into the Animation
constructor as:

```text
length: a.animation_length
```

Current `Animation.setLength(len)` clamps through:

```text
limitNumber(len, this.getMaxLength(), 1e4)
```

so the normal Blockbench setter has an upper boundary of `10000` seconds and does
not preserve a negative requested length.

During Bedrock import, however, the Animation is constructed **before** transform
and effect keyframes are added. Imported keyframes use
`GeneralAnimator.addKeyframe()`, which creates/pushes a keyframe but does not call
`Animation.setLength()`.

After import, the codec recalculates snapping and scope, but does not perform a
post-import `setLength()` pass.

Therefore the next MCP slice must **not invent** a rule that an explicit
`animation_length` must be at least the final imported keyframe/effect time. The
current native importer can represent an explicit length that is shorter than a
later imported keyframe timestamp.

### Zero semantics

Current native Bedrock compile emits:

```text
animation_length
```

only when `animation.length` is truthy.

Therefore explicit numeric `0` is normal export-omission-equivalent state. Local's
current truthy synthetic-payload check also omits `0`, so zero must not be treated
as a distinct persistent Bedrock representation merely to preserve the caller's
spelling.

The remaining gap is instead that Local currently accepts values that Blockbench
would clamp or that JSON cannot preserve as a valid finite number.

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
- shared `findTextureGroupOrThrow()` hardening: deferred until callers can be
  exhaustively audited.
- shared `layerBlendModeEnum` cleanup: deferred until callers can be exhaustively
  audited.
- shared `findGroupOrThrow()` migration: deferred.
- shared `keyframeDataSchema` Bezier contract: unchanged because direct caller
  ownership could not be exhaustively proven.
- save/reopen proof: later local validation.

## Next Step

Audit and correct **only `create_animation.animation_length` finite/range/zero
semantics** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve transform finiteness, authored coordinate/sign conversion,
   keyframe-time collision handling, scalar-zero scale handling, deterministic
   Group binding, particle behavior, and codec/Undo lifecycle;
3. make `animation_length`, when provided, a finite number in the native
   Blockbench range `0..10000` so invalid/over-limit input fails before
   `codec.loadFile()` instead of being serialized/clamped silently;
4. preserve `0` as valid omission-equivalent Bedrock state; do not invent a
   persistent distinction that native compile itself removes;
5. do **not** reject an explicit length merely because a requested transform or
   effect keyframe timestamp is later than that length; current Bedrock import
   does not perform a post-keyframe `setLength()` normalization;
6. do not add sound/timeline effect support or change any other Animation tool,
   Geometry, or Texture in this slice;
7. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/serialization/control-flow parity
only. Actual MCP validation, imported length, playback cut-off/wrapping behavior,
authored transforms, particle behavior, Undo/Redo, motion arcs, clipping, bone
pivots, return-to-neutral behavior, and save/reopen remain
`LOCAL PROOF REQUIRED` until local runtime testing resumes.
