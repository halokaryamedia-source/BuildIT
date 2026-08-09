# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation deterministic, API-correct, and recoverable on the intended Bedrock
rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_MANAGE_BEZIER_HANDLES_HARDENED`

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

The existing 2D texture-selection utilities are not model geometry and are not
an Animation gate.

## Latest Completed Animation Slice — `manage_keyframes` Bezier Handles

Primary owner:

```text
mcp/server/tools/animation.ts
```

Source commit:

```text
352805e2419ae8482cfcdf49f55004d499722e1d
fix: align manage keyframe bezier handles
```

### Root cause

Current Blockbench keyframes own Bezier handles as per-axis vectors:

```text
bezier_left_time   = [x, y, z]
bezier_left_value  = [x, y, z]
bezier_right_time  = [x, y, z]
bezier_right_value = [x, y, z]
```

The interpolation implementation indexes the time/value handles by active axis.
The previous shared MCP `keyframeDataSchema` instead allowed scalar
`left_time/right_time`, and scalar values were assigned directly onto vector
properties by `manage_keyframes`.

### Shared-schema ownership decision

The active task required auditing all direct callers before changing shared
`mcp/lib/zodObjects.ts::keyframeDataSchema`.

GitHub code search could not establish exhaustive ownership and, in fact, did not
return the known `animation.ts` usage. An empty search result was therefore not
treated as proof that no other caller exists.

Accordingly:

- shared `keyframeDataSchema` remains unchanged;
- `mcp/lib/zodObjects.ts` remains unchanged;
- no unknown caller inherits a breaking contract change.

### Current Local contract

`animation.ts` now derives a file-local schema:

```text
manageKeyframeDataSchema = keyframeDataSchema.extend(...)
```

For `manage_keyframes`, all four Bezier handle fields are now exact `vector3`
inputs:

```text
left_time   : [x, y, z]
left_value  : [x, y, z]
right_time  : [x, y, z]
right_value : [x, y, z]
```

This is intentionally native-parity rather than preserving the previous scalar
shorthand. A scalar time/value is rejected at the MCP boundary for this tool
instead of being written into a Blockbench vector property.

The existing create/edit runtime assignments are therefore now fed only
per-axis vector data. The recoverable `manage_keyframes` transaction, target
identity, keyframe creation, selection lifecycle, and interpolation enum were
not changed in this slice.

### Diff proof

The source commit changes only `mcp/server/tools/animation.ts`:

- adds the file-local `manageKeyframeDataSchema` override;
- changes `manageKeyframesParameters.keyframes` to use that local schema.

Net source diff: **15 additions / 1 deletion**. No unrelated runtime path changed.
No CI/status checks are registered for the source commit.

Actual Bezier curve behavior and playback remain `LOCAL PROOF REQUIRED`.

## Continuation Audit — `animation_copy_paste` Mutation Recoverability

The next grounded high-value Animation boundary is `animation_copy_paste`,
specifically `paste` and `mirror_paste`.

Current Local already has deterministic Animation and Group target identity, but
its mutation flow still remains:

```text
resolve target Animation + Group
→ read target animator
→ if missing:
   new BoneAnimator(...)
   targetAnimation.animators[group.uuid] = animator
→ Undo.initEdit({ animations: [targetAnimation], keyframes: [] })
→ create pasted keyframes
→ Undo.finishEdit(...)
→ Animator.preview()
```

### Why this remains a recoverability/API gap

1. A missing target animator is registered **before** the Undo snapshot. Failure
   later in paste can therefore leave animator structure outside the intended
   transaction boundary.
2. The paste path has no try/catch + `Undo.cancelEdit(true)` recovery after the
   edit is opened.
3. It still uses `GeneralAnimator.createKeyframe()`. Current Blockbench
   `createKeyframe()` calls `Animation.selected.setLength()`, so an explicit
   target animation that is not the selected animation can update the wrong
   animation length.
4. Current copied Bezier handle data originates from real Blockbench keyframe
   vector properties. Do not reopen the just-completed `manage_keyframes`
   Bezier-input contract while fixing paste lifecycle.

The `copy` action itself is read-only and should not be widened into a mutation
rewrite.

## Other Animation Findings — Not Yet Active

Do not combine these into the next slice:

- graph-editor curve/easing semantics and vector handle parity;
- timeline mutation (`set_length`, `set_fps`, `loop`) Undo/API parity;
- batch keyframe operations;
- animation readback/inspection coverage.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- deterministic Animation + Group targeting on keyframe/curve/copy-paste paths;
- recoverable/action-specific `manage_keyframes` animator/keyframe mutation;
- native-vector Bezier handle input contract for `manage_keyframes`;
- no Mesh/vertex/morph animation expansion.

These are source/static conclusions only where live Blockbench proof has not been
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
- shared `keyframeDataSchema` Bezier contract: left unchanged because direct
  caller ownership could not be exhaustively proven.
- save/reopen proof: later local validation.
- broad public-surface reduction/removal of generic non-Bedrock tools: separate
  scope.

## Next Step

Audit and correct **only `animation_copy_paste` paste / mirror-paste animator
creation and Undo recoverability** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. preserve deterministic target Animation/Group resolution and the Cuboid-only
   modelling contract;
2. keep `copy` read-only behavior unchanged unless direct evidence requires a
   minimal correction;
3. open the recoverable Animation mutation transaction before a missing target
   animator is registered;
4. use current Blockbench-owned animator/keyframe primitives without relying on
   `Animation.selected` when an explicit target animation is supplied;
5. ensure failure after mutation begins cancels/reverts the edit and refreshes
   only required Animation/timeline state before rethrow;
6. preserve pasted interpolation and vector Bezier-handle data;
7. do not modify graph editor, timeline, batch operations, Geometry, or Texture.

After the source fix, inspect the commit diff immediately for drift and advance
to exactly one grounded Animation boundary.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution/Undo
structure only. Actual Blockbench animation playback, pasted keyframes, Bezier
curves, Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior,
and save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
