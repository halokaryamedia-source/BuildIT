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

`REFERENCE_FIDELITY_ANIMATION_CREATE_CODEC_HARDENED_BONE_BINDING_GAP`

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

## Latest Completed Animation Slice — `create_animation` Codec / Lifecycle

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
4e37069aa414dbe994b0d761be7ec823a6ce75f1
fix: use current animation codec for creation
```

The source change is limited to the `create_animation` execution path.
Existing manage-keyframe, graph-editor, timeline, batch, copy/paste, inspection,
Geometry, and Texture behavior were not intentionally changed.

### Deprecated importer removed

Previous Local built one Bedrock animation JSON object and called:

```text
Animator.loadFile(...)
```

Current Blockbench typings explicitly mark `Animator.loadFile()` deprecated and
state that `AnimationCodec` should be used instead.

Current Local now resolves the runtime codec through:

```text
globalThis.AnimationCodec.getCodec()
```

and requires the resulting codec to be the current `bedrock` codec with a
`loadFile()` implementation. A missing project or non-Bedrock codec fails before
opening Undo.

This preserves the existing focused Bedrock animation JSON input instead of
expanding into a generic importer/exporter.

### Native codec ownership and Undo

Current Blockbench `AnimationCodec.getCodec()` returns the active format's
animation codec (or the Bedrock codec for animation-file formats).

The current Bedrock animation codec's native import flow uses:

```text
Undo.initEdit({ animations: [] })
→ codec.loadFile(file, animation_filter)
→ Undo.finishEdit(..., { animations: new_animations })
```

and `bedrock.loadFile()` returns its `new_animations` array.

Local now follows that ownership without nested Undo:

```text
preflight Project + Bedrock codec
→ build synthetic one-animation Bedrock JSON
→ snapshot existing Animation UUIDs
→ Undo.initEdit({ animations: [] })
→ codec.loadFile(..., [requestedAnimationName])
→ verify exactly one returned Animation is new and present in Animation.all
→ Undo.finishEdit("Create animation", { animations: createdAnimations })
```

### Created identity is now explicit

The tool no longer trusts only the requested input name.

The successful result is structured MCP output containing the actual created
Animation state:

```text
animation.uuid
animation.name
animation.loop
animation.length
animation.snapping
requested_name
requested_bone_count
requested_particle_effect_count
```

This matters because native `Animation.add()` calls `createUniqueName()`. If the
requested Animation name collides with an existing one, current Blockbench owns
the unique-name adjustment and Local reports the actual final name instead of
pretending the requested name was retained.

No duplicate-name preflight was added because that would replace current native
name ownership with a new MCP policy.

### Failure recovery

If codec creation fails after the edit begins, Local identifies every Animation
UUID that appeared during the attempt, removes those newly-created Animations,
then cancels/reverts the opened edit before rethrowing the error.

This covers partial codec creation instead of assuming that an initial
`animations: []` snapshot alone can remove a newly-added Animation that never
reached the successful final Undo aspects.

### Diff / proof boundary

The source commit contains only `create_animation` changes in:

```text
mcp/server/tools/animation.ts
```

No other Animation source path changed. GitHub has no registered CI/status
checks for the source commit.

Actual codec execution, Animation creation, duplicate-name result, Undo/Redo,
and structured MCP response in a live Blockbench project remain
`LOCAL PROOF REQUIRED`.

## Completed High-Value Animation Boundaries Kept In Place

- deterministic Animation + Group target identity on existing mutation paths;
- recoverable `manage_keyframes` create/edit/delete and selection lifecycle;
- native-vector Bezier handle contract;
- target-bound recoverable copy/paste;
- axis-aware graph-editor Bezier mutation;
- recoverable persistent timeline settings;
- hardened batch offset/mirror/bake/scale/reverse/smooth paths;
- focused read-only authored Animation inspection;
- current Bedrock `AnimationCodec` creation / Undo / created-identity lifecycle;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

## Continuation Audit — `create_animation` Bone Binding

The next grounded Animation boundary is **only deterministic bone binding inside
`create_animation`**.

The current public `bones` input is a record whose keys become Bedrock animation
bone names. The Bedrock codec currently resolves each imported bone with logic
equivalent to:

```text
lowercase_bone_name = bone_name.toLowerCase()
group = Group.all.find(group.name.toLowerCase() == lowercase_bone_name)
uuid = group ? group.uuid : guid()
new BoneAnimator(uuid, animation, bone_name)
```

### Why this remains a material fidelity gap

This codec behavior is useful for generic file import, but it is unsafe as the
only target-validation layer for an MCP tool that is supposed to animate the
intended existing Bedrock rig:

- a missing Group name does not fail; it creates a `BoneAnimator` with a fresh
  random UUID that is not bound to the intended Group;
- multiple Groups whose names collide under case-insensitive comparison allow
  the codec to silently take the first match;
- `create_animation` therefore can report successful creation while authored
  keyframes are attached ambiguously or to an orphan animator.

This conflicts with the deterministic targeting already established for the
other Animation mutation/readback surfaces.

The codec itself consumes **bone names**, not MCP Group UUID references, so the
next slice must not blindly replace record keys with UUIDs. It must first define
the smallest preflight/canonicalization contract that guarantees each payload
bone name binds to exactly one existing Group before codec mutation begins.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- `create_animation.particle_effects` payload/schema parity audit;
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

Audit and correct **only deterministic `create_animation` bone-to-Group binding
before Bedrock codec creation** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. preserve the existing Bedrock `bones` record input shape unless source proof
   shows a contract change is required;
3. preflight every requested bone key against existing `Group.all` before Undo
   and before `codec.loadFile()`;
4. determine from current codec behavior whether compatibility should use exact
   unique names or unique case-insensitive matching plus canonical Group names;
5. reject missing or ambiguous bone targets instead of allowing an orphan/random
   `BoneAnimator` or first-match binding;
6. ensure the JSON sent to the codec uses a canonical bone name that is guaranteed
   to bind to the preflighted Group;
7. do not modify particle effects, existing mutation/readback tools, batch
   selection, Geometry, or Texture in this slice;
8. inspect the exact source diff immediately and advance to exactly one grounded
   Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow/Undo structure
only. Actual codec binding, created keyframes, playback, Undo/Redo, motion arcs,
clipping, bone pivots, return-to-neutral behavior, and save/reopen remain
`LOCAL PROOF REQUIRED` until local runtime testing resumes.
