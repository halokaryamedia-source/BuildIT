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

`REFERENCE_FIDELITY_ANIMATION_CREATE_SCALE_ZERO_HARDENED_COORDINATE_SPACE_GAP`

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

## Latest Completed Animation Slice — Scalar `scale: 0` Preservation

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
505a0f8085edaa0519d2d2e2095ae66444daa158
fix: preserve zero scale in animation creation
```

The exact source diff is one presence-check correction inside the synthetic
Bedrock payload builder:

```text
if (keyframe.scale)
```

became:

```text
if (keyframe.scale !== undefined)
```

No schema, AnimationCodec lifecycle, time/collision validation, coordinate/sign
logic, effect behavior, other Animation tool, Geometry, or Texture was changed.

### Why the change is required

The public `create_animation` keyframe contract intentionally accepts:

```text
scale: vector3 | number
```

and current Bedrock animation import accepts numeric channel values, mapping one
number uniformly to X/Y/Z. Numeric zero is not excluded by the native importer.

The old truthy check therefore confused a valid authored value with absence:

```text
scale: 0
```

was omitted before the Bedrock codec ever saw it.

The explicit `!== undefined` check now preserves scalar zero while leaving all
non-zero scalar and vector scale behavior unchanged.

### Diff / proof boundary

GitHub shows exactly one changed line in the source commit. There are no
registered CI/status checks for the commit.

Actual scalar-zero import, resulting authored scale, playback, Undo/Redo, motion,
clipping, and save/reopen remain `LOCAL PROOF REQUIRED`.

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
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `create_animation` Transform Coordinate Space

The next grounded Animation boundary is **only transform coordinate/sign-space
parity for `create_animation`** in:

```text
mcp/server/tools/animation.ts
```

### Current inconsistency

`manage_keyframes` writes authored transform values directly into Blockbench
keyframes:

```text
x → keyframe.set("x", value)
y → keyframe.set("y", value)
z → keyframe.set("z", value)
```

and `inspect_animation` reads those authored Blockbench data-point values back.

`create_animation`, however, currently forwards caller vectors directly into a
synthetic **Bedrock animation JSON**, then imports that JSON through the Bedrock
codec.

Current Bedrock codec converts file-space transform arrays during import:

```text
position:
  X is inverted

rotation:
  X is inverted
  Y is inverted

scale:
  unchanged
```

Therefore an identical input vector sent through `create_animation` and
`manage_keyframes` does not currently have the same authored Blockbench meaning
for position X or rotation X/Y.

### Why this is material

The MCP surface should have one explicit transform-space contract. Without one,
a model author can create an Animation through `create_animation`, inspect it in
Blockbench space, then get opposite signs compared with a later
`manage_keyframes` edit using the same requested vector.

This directly affects motion direction and reference fidelity; it is not merely a
serialization detail.

### Decision still to prove in the next slice

Do not assume the fix yet. Audit the existing public descriptions/callers and
current Bedrock compile/import symmetry to choose exactly one contract:

1. **Blockbench-authored transform values** across MCP Animation tools, with
   `create_animation` converting values into Bedrock file space before codec
   import; or
2. an explicitly Bedrock-file-space `create_animation` contract if repository
   evidence proves that is intentionally different from mutation/readback tools.

The preferred direction should be the one that preserves deterministic
round-trip parity with existing `manage_keyframes` + `inspect_animation` without
inventing another coordinate system.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- `animation_length` finite/range/zero semantics;
- transform scalar/vector value finiteness beyond the proven coordinate issue;
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

Audit and correct **only `create_animation` transform coordinate/sign-space
parity** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the current Cuboid bone rig and deterministic Group binding;
3. compare `create_animation`, `manage_keyframes`, `inspect_animation`, and current
   Bedrock import/compile sign conversion before choosing the public transform
   space;
4. make position/rotation values round-trip consistently with the chosen MCP
   authored-space contract; scale must remain unaffected by sign conversion;
5. do not change keyframe time/collision validation, scalar-zero scale handling,
   `animation_length`, particle/sound/timeline effects, batch operations, Geometry,
   or Texture in this slice;
6. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/serialization/control-flow parity
only. Actual movement direction, playback, authored Blockbench values,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.