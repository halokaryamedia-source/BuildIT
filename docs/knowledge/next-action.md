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

`REFERENCE_FIDELITY_ANIMATION_CREATE_PARTICLE_EFFECTS_HARDENED_PARTICLE_READBACK_GAP`

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

## Latest Completed Animation Slice — `create_animation.particle_effects`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
cf6e88af1097a47d8d18aa45252305e0611246a4
fix: align created animation particle effects
```

The source change is limited to the public `particle_effects` contract used by
`create_animation` and the directly-related requested-particle count.

Bone binding, current Bedrock codec/Undo lifecycle, existing Animation mutation
and readback tools, Geometry, and Texture were not intentionally changed.

### Native Bedrock particle shape restored

Previous Local accepted:

```text
particle_effects: record<string>
```

which treated each timestamp value as a plain effect-name string.

Current Bedrock import instead treats each timestamp as one particle object or an
array of particle objects. Native particle compilation emits the corresponding
Bedrock object fields:

```text
{
  effect: <required effect id>,
  locator: <optional locator>,
  bind_to_actor: <optional boolean>,
  pre_effect_script: <optional script>
}
```

Local now exposes exactly that bounded shape.

A timestamp accepts either:

```text
particle object
```

or:

```text
non-empty particle object[]
```

Every particle requires a non-empty `effect` identifier. `locator`,
`bind_to_actor`, and `pre_effect_script` are optional. No shorthand string form is
kept because that is not the object shape read by the current Bedrock codec.

### Payload ownership

The validated `particle_effects` object is passed directly into the synthetic
Bedrock animation JSON before `codec.loadFile()`.

No post-import mutation or repair layer was added. The codec therefore receives
the already-valid native-shaped particle payload it expects.

### Result count semantics

`requested_particle_effect_count` previously counted timestamp keys. That was
equivalent to particle count only while the contract allowed one string per
timestamp.

Because one timestamp may now contain multiple particles, the result now counts
the actual number of requested particle objects across all timestamps.

### Diff / proof boundary

The source commit contains only:

- a local Bedrock particle Zod schema;
- the `particle_effects` record value contract change;
- directly-related requested particle count logic.

GitHub has no registered CI/status checks for the source commit.

Actual particle import, emitter playback, locator binding, pre-effect script
execution, and Undo/Redo remain `LOCAL PROOF REQUIRED`.

## Completed High-Value Animation Boundaries Kept In Place

- deterministic Animation + Group identity for mutation/readback paths;
- recoverable `manage_keyframes` mutation and selection lifecycle;
- native-vector Bezier handle contract;
- target-bound recoverable copy/paste;
- axis-aware graph-editor Bezier mutation;
- recoverable persistent timeline settings;
- hardened batch offset/mirror/bake/scale/reverse/smooth operations;
- focused authored Animation readback for Animation settings and transform bones;
- current Bedrock `AnimationCodec` creation / Undo / created identity;
- deterministic `create_animation` bone-to-Group binding;
- native-shaped `create_animation.particle_effects` input;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — Particle Authored Readback

The next grounded Animation boundary is **only particle-effect readback in the
existing `inspect_animation` surface**.

Current inspection owner:

```text
mcp/server/tools/animation-inspection.ts
```

Current `inspect_animation` returns:

- Animation UUID/name/loop/length/snapping;
- existing `BoneAnimator` summaries;
- optional detailed rotation/position/scale keyframes for one Group.

It does **not** expose the existing `EffectAnimator.particle` channel.

### Why this is now material

After `create_animation` creates particle effects, the public MCP surface cannot
read those authored particle keyframes back deterministically. A creation success
response is not equivalent to authored-state verification.

Current Blockbench source establishes that `EffectAnimator` owns a `particle`
channel containing normal keyframes. Each particle keyframe has a timestamp and
one or more data points. Bedrock import maps the file's `pre_effect_script` onto
the runtime data-point script property; native compile maps runtime particle data
back to Bedrock fields including `effect`, `locator`, `bind_to_actor`, and
`pre_effect_script`.

The next readback slice should normalize that existing runtime authored state into
a stable Bedrock-facing particle read shape without changing selection, timeline,
preview, or animator state.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- particle timestamp-key validation policy;
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

Audit and implement **only authored particle-effect readback in
`inspect_animation`** in:

```text
mcp/server/tools/animation-inspection.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve deterministic Animation targeting and existing transform readback;
3. inspect only an already-existing `EffectAnimator`; never create one for
   inspection;
4. return stable particle-channel authored data, including keyframe UUID/time and
   every particle data point needed to represent current Bedrock fields
   (`effect`, optional `locator`, optional `bind_to_actor`, and normalized
   `pre_effect_script` from the runtime script property);
5. preserve multiple particle data points at the same keyframe/timestamp and sort
   keyframes deterministically by time then UUID;
6. remain strictly read-only: no selection changes, no timeline movement, no
   preview mutation, no Undo, and no animator/keyframe creation;
7. do not add sound/timeline effect readback, mutation behavior, Geometry, or
   Texture in this slice;
8. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow only. Actual
particle data returned from a live Blockbench project, emitter playback, locator
binding, script behavior, Undo/Redo, motion arcs, clipping, bone pivots,
return-to-neutral behavior, and save/reopen remain `LOCAL PROOF REQUIRED` until
local runtime testing resumes.
