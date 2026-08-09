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

`REFERENCE_FIDELITY_ANIMATION_BATCH_MUTATIONS_HARDENED_READBACK_GAP`

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

## Latest Completed Animation Slice — Batch `smooth`

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
bba32caab8ae5137dc6b3a695b9b1ecc1f2710b6
fix: limit batch smooth to transform keyframes
```

The source change is limited to `batch_keyframe_operations.smooth`.

`reverse`, `scale`, `offset`, `mirror`, `bake`, selection modes, timeline,
graph editor, copy/paste, Geometry, and Texture were not intentionally changed.

### Transform-only interpolation parity

Previous Local applied:

```text
kf.interpolation = "catmullrom"
```

to every matched keyframe, including non-transform keyframes.

Current Blockbench interpolation UI exposes interpolation when at least one
selected keyframe is a transform keyframe and mutates only entries where:

```text
kf.transform
```

Local now follows that contract:

1. filter matched keyframes to `kf.transform`;
2. if the filtered set is empty, fail before opening Undo;
3. set `catmullrom` only on those transform keyframes;
4. report the actual number of transform keyframes changed.

Sound/particle/timeline or other non-transform keyframes matched by the batch
selector are left unchanged by `smooth`.

### Recoverability

Smooth now uses a bounded keyframe mutation transaction:

```text
preflight transform targets
→ Undo.initEdit({ keyframes: transformKeyframes })
→ set interpolation = catmullrom
→ Undo.finishEdit("Batch keyframe operation: smooth")
```

Failure after the edit opens runs:

```text
Undo.cancelEdit(true)
→ Animator.preview()
→ updateKeyframeSelection()
→ rethrow
```

Success refreshes preview/keyframe selection after the transaction.

The old generic final batch mutation switch is removed; an unreachable explicit
unsupported-operation error remains as a defensive fallback after all declared
batch operations have returned.

### Diff / proof boundary

The source commit contains one hunk replacing the old generic `smooth` path with
the transform-only recoverable path above.

GitHub has no registered CI/status checks for the source commit.

Actual Blockbench Catmull-Rom playback, interpolation result, and Undo/Redo remain
`LOCAL PROOF REQUIRED`.

## Batch Mutation Boundary Now Covered

The current high-value `batch_keyframe_operations` mutation paths now have the
following source-hardening coverage:

- `offset` → native axis/value offset primitives and bounded rollback;
- `mirror` → native channel-aware `Keyframe.flip(axis)` and bounded rollback;
- `bake` → positive interval safety, pre-mutation sampling, Animation-owned Undo,
  and timeline-time restoration;
- `scale` → native-like time stretch, snapping, Bezier handle-time scaling,
  collision handling, Animation-owned Undo;
- `reverse` → native timestamp/data-point/Bezier reversal semantics and rollback;
- `smooth` → transform-only interpolation semantics and rollback.

This does not claim live Blockbench verification.

## Continuation Audit — Authored Animation Readback

The next grounded Animation boundary is **focused read-only inspection**, not
another broad mutation rewrite.

### Existing Animation tool surface

`mcp/server/tools/animation.ts` currently registers seven Animation-related
surfaces:

```text
create_animation
manage_keyframes
animation_graph_editor
bone_rigging
animation_timeline
batch_keyframe_operations
animation_copy_paste
```

They create, mutate, select, control, or copy Animation state. None is a focused
read-only authored Animation inspection surface.

### Existing generic inspection does not close the gap

`mcp/server/tools/element-inspection.ts` provides `inspect_element`, but its
read-only contract intentionally covers authored **Cube/Group** state only. It
does not return Animation animator/channel/keyframe state.

`mcp/server/tools/project.ts` provides `get_project_info` and
`inspect_model_bounds`. `inspect_model_bounds` records only a small pose context:

```text
selected animation UUID/name
current Timeline.time
```

That is useful for identifying the current rendered pose, but it does not expose
the authored Animation data that produced the pose.

### Why this is now a material fidelity gap

After an MCP mutation succeeds, the current public surface cannot directly and
deterministically read back the exact authored Animation target to answer basic
verification questions such as:

- which Animation UUID/name was changed;
- current loop/length/snapping settings;
- which Group/bone animator UUIDs are present;
- which transform channels exist for a target bone;
- keyframe times and authored XYZ values;
- interpolation mode;
- per-axis Bezier left/right time/value vectors.

A success string or current rendered pose is not equivalent to authored-state
readback. Without focused readback, static/runtime workflows are forced to trust
mutation responses or use generic evaluation/export mechanisms instead of a
bounded Animation inspection contract.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- broad batch selection redesign;
- deprecated `create_animation` importer/lifecycle audit;
- local save/reopen and visual playback proof;
- broad public-surface cleanup of generic non-Bedrock tools.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- deterministic Animation + Group targeting on keyframe/curve/copy-paste paths;
- recoverable/action-specific `manage_keyframes` mutation;
- native-vector Bezier handle input contract for `manage_keyframes`;
- recoverable target-bound copy/paste mutation;
- axis-aware, vector-safe, recoverable graph-editor mutation;
- recoverable native-owned persistent timeline mutations;
- hardened batch offset/mirror/bake/scale/reverse/smooth mutation paths;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions where live Blockbench proof has not been
performed.

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

Audit and implement **only one focused read-only authored Animation inspection
surface** in the existing Animation owner, preferably `mcp/server/tools/animation.ts`
so the current animation tool manifest/registration remains the owner unless
source inspection proves otherwise.

Requirements:

1. keep Geometry Cube/Cuboid-only and do not reopen Texture;
2. resolve an explicit Animation target deterministically using the existing
   UUID-first / exact-unique-name resolver; omitted reference may use the selected
   Animation only if the public contract states that clearly;
3. return stable authored Animation identity/settings needed for verification
   (`uuid`, `name`, `loop`, `length`, `snapping`);
4. expose animator/bone identity and transform-channel keyframes with authored
   time, values, interpolation, and Bezier vectors where applicable;
5. remain strictly read-only: no selection changes, no timeline movement, no
   preview mutation, no implicit animator creation;
6. use structured content suitable for deterministic MCP readback rather than a
   success-only string;
7. do **not** combine this with `create_animation`, batch selector redesign,
   playback changes, Geometry, Texture, or local visual validation.

After implementation, inspect the exact diff immediately and advance to exactly
one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/read-shape/control-flow only.
Actual authored values seen inside a live Blockbench project, playback,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
