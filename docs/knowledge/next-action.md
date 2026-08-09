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

`REFERENCE_FIDELITY_ANIMATION_PARTICLE_READBACK_HARDENED_TIMESTAMP_GAP`

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

## Latest Completed Animation Slice — Particle Authored Readback

Primary owner:

```text
mcp/server/tools/animation-inspection.ts
```

Source commit:

```text
86e2c843cebe73ba02485a4088c4f8d7adb39542
feat: expose authored animation particles
```

The source change is limited to the existing read-only `inspect_animation`
surface. Existing creation/mutation behavior, sound/timeline effect channels,
Geometry, and Texture were not intentionally changed.

### Existing EffectAnimator only

Inspection reads:

```text
animation.animators.effects
```

only when that entry already exists.

It never calls an animator creation helper. If the entry is absent, readback
returns an explicit empty particle state:

```text
has_animator: false
animator: null
particle.keyframe_count: 0
particle.particle_count: 0
particle.keyframes: []
```

If an `effects` entry exists but is not an `EffectAnimator`, inspection fails
rather than guessing at incompatible authored state.

### Particle read shape

Existing `EffectAnimator.particle` keyframes are copied and sorted by:

```text
time → UUID
```

for deterministic output.

Each keyframe returns:

```text
uuid
time
particles[]
```

Every authored particle data point is preserved. The normalized Bedrock-facing
read shape is:

```text
effect: string | null
locator: string | null
bind_to_actor: false | null
pre_effect_script: string | null
```

`bind_to_actor` follows native Bedrock compile semantics: runtime default/true is
represented as absent-equivalent `null`, while explicit `false` is preserved.

Runtime `script` is exposed as Bedrock `pre_effect_script`. Empty script content
normalizes to `null`; a non-empty script gets a trailing semicolon when missing,
matching the current native particle compile behavior without mutating the
runtime data point.

The output also reports particle keyframe count and total particle-data-point
count separately, so multiple particles sharing one timestamp remain visible.

### Strict read-only boundary

This slice does not call:

```text
Animation.select()
Timeline.setTime(...)
Animator.preview()
Animation.getBoneAnimator(...)
Undo.*
EffectAnimator.addKeyframe(...)
```

It reads current authored properties only. Existing transform/bone readback is
preserved unchanged.

### Source evidence

Current Blockbench source establishes that:

- `EffectAnimator` owns `particle`, `sound`, and `timeline` channels;
- particle is a normal keyframe array and may contain many data points per
  keyframe;
- particle runtime data points use `effect`, `locator`, `script`, and
  `bind_to_actor` properties;
- native Bedrock particle compilation maps runtime `script` to
  `pre_effect_script`, omits the default actor binding, and preserves explicit
  `bind_to_actor: false`.

GitHub has no registered CI/status checks for the source commit.

Actual particle values returned from a live Blockbench project remain
`LOCAL PROOF REQUIRED`.

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
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — Particle Timestamp Keys

The next grounded Animation boundary is **only the timestamp-key contract for
`create_animation.particle_effects`** in:

```text
mcp/server/tools/animation.ts
```

Current public input is a timestamp-keyed Zod record. The particle object shape is
now correct, but record keys themselves are still arbitrary strings.

Current Bedrock codec imports particle timestamps with logic equivalent to:

```text
for timestamp in particle_effects:
  EffectAnimator.addKeyframe({
    channel: "particle",
    time: parseFloat(timestamp),
    ...
  })
```

### Why this remains a material contract gap

`parseFloat()` is permissive. Without an MCP boundary contract:

- a non-numeric key can become `NaN`;
- a partially numeric key such as `1abc` can silently become `1`;
- two distinct string keys can resolve to the same numeric time;
- caller-visible timestamp spelling may not match the canonical time that
  Blockbench later serializes/snaps.

The next slice must establish the smallest timestamp validation/normalization
policy compatible with current Blockbench/Bedrock behavior before mutation.

Do **not** assume yet that timestamps must be non-negative or that one specific
string regex is correct. Prove the accepted numeric/time boundary from current
Blockbench source first, including how duplicate-equivalent times should be
handled.

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

Audit and correct **only `create_animation.particle_effects` timestamp-key
validation / equivalent-time collision semantics** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the current particle object/array value contract;
3. inspect current Blockbench timeline/keyframe/Bedrock codec behavior to define
   the accepted numeric timestamp boundary before changing schema/runtime logic;
4. reject keys that the codec would parse ambiguously or non-finitely rather than
   relying on permissive `parseFloat()`;
5. detect distinct input keys that resolve to the same effective particle time
   and choose the smallest evidence-backed behavior instead of silently creating
   duplicate-equivalent keyframes;
6. keep validation before Undo / `codec.loadFile()`;
7. do not add sound/timeline effects, change bone binding/importer lifecycle,
   modify other Animation tools, Geometry, or Texture in this slice;
8. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow only. Actual
particle import/readback, emitter playback, locator binding, script behavior,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
