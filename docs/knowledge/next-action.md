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

`REFERENCE_FIDELITY_ANIMATION_COORDINATE_SPACE_HARDENED_TRANSFORM_FINITE_GAP`

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

## Latest Completed Animation Slice — `create_animation` Transform Coordinate Space

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
60d46648b995b658151db454982e1a88f4ea1819
fix: align created animation transform space
```

The source change is limited to the public transform-space description for
`create_animation` and the synthetic Bedrock payload conversion for position and
rotation.

Keyframe time/collision validation, scalar-zero scale preservation,
`animation_length`, particle/sound/timeline effects, other Animation tools,
Geometry, and Texture were not intentionally changed.

### Public transform-space decision

`create_animation`, `manage_keyframes`, and `inspect_animation` now share one MCP
meaning:

```text
transform vectors are authored Blockbench values
```

This avoids exposing a separate Bedrock-file coordinate convention only for the
creation path.

`manage_keyframes` already writes requested transform values directly into
Blockbench keyframes with `keyframe.set(...)`, and `inspect_animation` reads those
authored data-point values back.

### Native Bedrock conversion proved

Current Blockbench Bedrock import converts file-space arrays into authored
Blockbench space by inverting:

```text
position: X
rotation: X and Y
scale: unchanged
```

Current `Keyframe.compileBedrockKeyframe()` performs the same sign conversion in
the opposite serialization direction, proving that the conversion is the native
Bedrock file-space boundary rather than the intended authored MCP value space.

### Creation payload correction

`create_animation` still uses the current Bedrock `AnimationCodec`, but its
synthetic JSON is now prepared as file-space data before import:

```text
requested Blockbench position [x, y, z]
→ synthetic Bedrock [-x, y, z]
→ codec import
→ authored Blockbench [x, y, z]
```

and:

```text
requested Blockbench rotation [x, y, z]
→ synthetic Bedrock [-x, -y, z]
→ codec import
→ authored Blockbench [x, y, z]
```

Scale is forwarded unchanged because native Bedrock import/export does not apply
the position/rotation sign conversion to scale.

The conversion creates new arrays and does not mutate caller vectors.

### Public descriptions

The local `create_animation` keyframe schema now explicitly describes position,
rotation, and scale as **Blockbench-authored** values. The tool description and
`bones` description state that Bedrock file-space conversion is internal to the
codec creation path.

This makes the public contract consistent with mutation/readback rather than
requiring callers to know Blockbench's Bedrock serializer internals.

### Diff / proof boundary

The exact source diff contains only:

- authored-space descriptions for create position/rotation/scale;
- authored-space wording on `create_animation` / `bones`;
- position X pre-inversion for the synthetic Bedrock payload;
- rotation X/Y pre-inversion for the synthetic Bedrock payload.

Scale payload behavior, including explicit scalar `scale: 0`, remains unchanged.
GitHub has no registered CI/status checks for the source commit.

Actual movement direction, authored values in a live project, playback,
Undo/Redo, motion arcs, clipping, and save/reopen remain
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
- authored Blockbench transform-space parity across create/mutate/readback;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `create_animation` Transform Value Finiteness

The next grounded Animation boundary is **only numeric finiteness of authored
transform values accepted by `create_animation`** in:

```text
mcp/server/tools/animation.ts
```

Current local creation schema still derives vector components from the shared:

```text
vector3Schema = array(z.number()).length(3)
```

and scalar scale uses:

```text
z.number()
```

The project uses Zod 3.25.x, where `.finite()` is available and is already used
locally for keyframe time. The shared vector schema is intentionally generic and
must not be changed merely for this one creation boundary.

### Why this is material

The synthetic Bedrock creation payload is serialized through `JSON.stringify`.
Non-finite JavaScript numbers are not valid JSON numeric values and serialize as
`null` rather than preserving the requested transform number.

That means a non-finite position/rotation component or scalar/vector scale can
cross the current public schema but cannot survive as the authored transform the
caller requested.

The coordinate-space correction also performs numeric sign conversion on
position/rotation, so the creation boundary should reject non-finite authored
numbers before any synthetic payload is built.

### Intended bounded direction

Do not modify shared `vector3Schema` in the next slice. Prefer a local
`create_animation` transform-value contract that requires:

```text
position XYZ: finite numbers
rotation XYZ: finite numbers
scale XYZ or scalar: finite numbers
```

Do not invent arbitrary magnitude limits without source evidence.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- `animation_length` finite/range/zero semantics;
- sound/timeline EffectAnimator readback;
- broad batch selection redesign;
- shared Animation/Group resolver refactor;
- shared `vector3Schema` migration;
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

Audit and correct **only `create_animation` transform-value finiteness** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the newly established Blockbench-authored transform-space contract;
3. keep the correction local to `create_animation`; do not modify shared
   `vector3Schema` or unrelated tool schemas;
4. require every position/rotation vector component and every scalar/vector scale
   value to be finite before execute / synthetic JSON construction;
5. do not add arbitrary magnitude limits or alter sign conversion, keyframe
   time/collision validation, scalar-zero behavior, `animation_length`, effects,
   batch operations, Geometry, or Texture;
6. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/serialization/control-flow parity
only. Actual MCP validation, authored values, movement direction, playback,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.