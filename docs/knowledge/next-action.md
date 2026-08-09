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

`REFERENCE_FIDELITY_ANIMATION_CREATE_BONE_BINDING_HARDENED_PARTICLE_EFFECTS_GAP`

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

## Latest Completed Animation Slice — Deterministic `create_animation` Bone Binding

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
0d457681b39de4155ab083022879f2b91deb67b6
fix: bind created animation bones deterministically
```

The source change is limited to the `create_animation` `bones` contract and its
preflight/canonicalization/postcondition path.

Particle effects, existing keyframe/graph/timeline/batch/copy-paste/readback
surfaces, Geometry, and Texture were not intentionally changed.

### Why codec-name parity matters

Current Bedrock animation import resolves imported bone names case-insensitively:

```text
lowercase_bone_name = bone_name.toLowerCase()
group = Group.all.find(group.name.toLowerCase() == lowercase_bone_name)
uuid = group ? group.uuid : guid()
```

A missing imported bone name therefore produces an orphan/random animator UUID,
and a case-insensitive name collision can silently choose the first Group.

That behavior is acceptable for generic file import but is not deterministic
enough for an MCP command intended to animate an existing authored Bedrock rig.

### Public `bones` contract

The record shape is preserved.

Each record key is now documented and executed as either:

```text
exact Group UUID
or
Group name unique under case-insensitive Bedrock animation matching
```

Runtime preflight happens before Undo and before `codec.loadFile()`.

For every entry Local now:

1. resolves exact UUID first;
2. otherwise performs case-insensitive Group-name matching because that is the
   codec's actual compatibility boundary;
3. rejects missing targets;
4. rejects case-insensitive ambiguous names;
5. verifies that the resolved Group's canonical name itself has exactly one
   case-insensitive match in `Group.all`;
6. rejects two input record keys that resolve to the same Group UUID.

The UUID form cannot bypass an unsafe name collision because the downstream
Bedrock codec still consumes a **name**. If `LeftArm` and `leftarm` both exist,
Local fails before mutation even when one UUID was supplied, instead of passing
a canonical name that the codec cannot distinguish safely.

### Canonical payload

The synthetic Bedrock JSON no longer forwards the caller's record key directly.
After successful preflight it writes:

```text
resolved Group.name → requested keyframes
```

This guarantees the codec receives the canonical existing Group name associated
with the preflighted target.

### Postcondition before commit

After the codec returns the newly created Animation, Local verifies every
preflighted Group UUID has a `BoneAnimator` in:

```text
createdAnimation.animators[group.uuid]
```

If any expected binding is absent or is not a `BoneAnimator`, creation fails
inside the already-open transaction and the existing creation rollback path
removes Animations produced during the attempt and cancels/reverts the edit.

### Diff / proof boundary

The source commit contains only:

- the `bones` schema description update;
- `create_animation` Group target preflight/canonicalization;
- canonical `Group.name` JSON keys;
- post-codec animator binding verification.

GitHub has no registered CI/status checks for the source commit.

Actual codec binding, created keyframes, playback, and Undo/Redo remain
`LOCAL PROOF REQUIRED`.

## Completed High-Value Animation Boundaries Kept In Place

- deterministic Animation + Group identity for mutation/readback paths;
- recoverable `manage_keyframes` mutation and selection lifecycle;
- native-vector Bezier handle contract;
- target-bound recoverable copy/paste;
- axis-aware graph-editor Bezier mutation;
- recoverable persistent timeline settings;
- hardened batch offset/mirror/bake/scale/reverse/smooth operations;
- focused authored Animation readback;
- current Bedrock `AnimationCodec` creation / Undo / created identity;
- deterministic `create_animation` bone-to-Group binding;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `create_animation.particle_effects`

The next grounded Animation boundary is **only the `particle_effects` input and
synthetic Bedrock payload used by `create_animation`**.

Current Local schema still declares:

```text
particle_effects: record<string>
```

with timestamps as keys and effect-name strings as values. The object is then
passed directly into the synthetic Bedrock animation JSON.

Current Bedrock codec does not treat a particle timestamp value as a plain effect
name string. During import it does, in effect:

```text
particles = particle_effects[timestamp]
if not array → [particles]
for each particle:
  particle.script = particle.pre_effect_script
EffectAnimator.addKeyframe({ channel: "particle", data_points: particles })
```

Therefore the native importer expects particle **objects** (or arrays of
objects), not Local's current string-only contract.

Current native non-transform keyframe compilation emits particle entries shaped
as:

```text
{
  effect: <required effect id>,
  locator: <optional locator>,
  bind_to_actor: false <optional; omitted means default behavior>,
  pre_effect_script: <optional script>
}
```

and can return either one object or an array when multiple particle data points
share a timestamp.

### Why this is material

The current string contract cannot represent locator, actor binding, or
pre-effect script and is not the shape the current codec reads. Passing a string
through the codec's object-oriented particle import path is therefore not a
reliable Bedrock creation contract.

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

Audit and correct **only `create_animation.particle_effects` Bedrock payload
parity** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve timestamp-keyed particle effects, but replace the current string-only
   value contract with the smallest current Bedrock-compatible structured shape;
3. require an `effect` identifier per particle and support only current native
   fields that are materially owned by this path (`locator`, `bind_to_actor`,
   `pre_effect_script`) unless source proves another required field;
4. determine from current codec behavior whether each timestamp should accept one
   particle object, an array of particle objects, or both; do not invent a
   different representation;
5. ensure the synthetic JSON passed to the Bedrock codec is already in the shape
   that codec reads; do not add mutation after import merely to repair malformed
   input;
6. do not modify bone binding, importer lifecycle, existing Animation mutation or
   readback tools, batch selection, Geometry, or Texture in this slice;
7. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow only. Actual
particle import, emitter playback, locator binding, script behavior, Undo/Redo,
motion arcs, clipping, bone pivots, return-to-neutral behavior, and save/reopen
remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
