# Next Action

Updated: 2026-08-09

This is the **single active-task snapshot**. New ChatGPT/Codex sessions read:

`AGENTS.md` → `CONTEXT.md` → this note.

## Active Goal

Improve Reference Image / Modelling Brief → Blockbench fidelity for Minecraft
Bedrock Entity modelling while keeping Geometry **Cube/Cuboid only** and making
Animation operate deterministically on the intended Bedrock rig.

## Current Status

`REFERENCE_FIDELITY_ANIMATION_AUDIT_BLOCKED_TARGET_IDENTITY`

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

## First Animation Source Audit

Primary owner audited:

```text
mcp/server/tools/animation.ts
```

`armature.ts` was not required for this first finding because `animation.ts`
already contains the safe Group identity pattern needed to establish the cause.

The audit checked the high-value Bedrock Cuboid animation surface for:

1. animation and bone/group target identity;
2. keyframe/timing/interpolation API shape;
3. Undo/recoverability boundaries;
4. readback/observability;
5. accidental Mesh/non-Cuboid animation expansion.

The first **major** blocker is target identity, so the audit stops there instead
of mixing several Animation concerns into one source slice.

## Major Finding — Animation / Bone Target Identity

### Bone/group targeting

`animation.ts` already contains a safe file-local resolver used by `bone_rigging`:

```text
resolveRigGroup(reference)
→ exact Group UUID
→ exact unique Group name
→ ambiguous name = error with candidate UUIDs
→ missing = actionable error
```

However the main keyframe/curve/copy-paste paths still use the shared
`findGroupOrThrow()` helper from `mcp/lib/util.ts`.

That shared helper currently does:

```text
Group.all.find(group => group.name === name)
```

Therefore on these Animation paths:

- an exact Group UUID is not accepted by the helper;
- duplicate Group names silently resolve to the first match;
- the MCP can mutate/copy animation data on the wrong Bedrock bone.

Direct affected callers in `animation.ts`:

```text
manage_keyframes
animation_graph_editor
animation_copy_paste (source bone)
animation_copy_paste (target bone)
```

Do **not** harden the shared `findGroupOrThrow()` helper in this slice; it has
other callers and its repository-wide ownership has not been exhaustively
audited. Use the already-proven file-local UUID-first resolver in
`animation.ts` instead.

### Animation targeting

Explicit animation references in the same paths currently use first-match logic:

```text
Animation.all.find(a => a.uuid === reference || a.name === reference)
```

Affected paths:

```text
manage_keyframes.animation_id
animation_graph_editor.animation_id
animation_copy_paste.source.animation
animation_copy_paste.target.animation
```

This means duplicate animation names can silently select the first match.
Current official Blockbench typing exposes Animation collection/selection plus
`uuid` and `name`, so a deterministic resolver can be implemented locally:

```text
explicit reference
→ exact Animation UUID
→ exact unique Animation name
→ ambiguous name = fail with candidate UUIDs
→ missing = fail

reference omitted
→ preserve current selected-animation fallback
```

Explicit empty references must not silently fall back to the current selection.

## Other Animation Findings — Not Yet Active

The audit also observed later boundaries that may deserve separate review, but
they are **not part of the active slice** while target identity is unresolved:

- `manage_keyframes` and animation paste may create/register a `BoneAnimator`
  before their current Undo transaction begins;
- graph-editor interpolation / bezier-handle semantics still require current
  Blockbench parity review;
- timeline mutation (`set_length`, `set_fps`, `loop`) still requires an Undo/API
  audit;
- batch keyframe operations and readback/inspection remain later boundaries.

Do not combine these into the target-identity fix.

## Completed Boundaries Kept In Place

- deterministic Cube/Group geometry correction and Cuboid-only modelling policy;
- frozen high-value Texture/PBR/layer source hardening;
- `bone_rigging` UUID-first Group targeting and bounded rollback;
- no Mesh/vertex/morph animation expansion has been introduced by this audit.

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
- shared `findGroupOrThrow()` migration: do not broaden during the file-local
  Animation target fix.
- save/reopen proof: later local validation.
- broad public-surface reduction/removal of generic non-Bedrock tools: separate
  scope.

## Next Step

Fix **only Animation target identity** in:

```text
mcp/server/tools/animation.ts
```

Requirements:

1. remove `findGroupOrThrow()` usage from the affected Animation paths and use
   the file-local UUID-first / exact-unique-name Group resolution pattern;
2. add one file-local Animation resolver with explicit UUID first, exact unique
   name fallback, actionable ambiguity/missing errors, and selected-animation
   fallback only when the reference is genuinely omitted;
3. apply that resolver consistently to `manage_keyframes`,
   `animation_graph_editor`, and both source/target sides of
   `animation_copy_paste`;
4. when creating a `BoneAnimator` after resolving a UUID reference, use the
   resolved Group identity/name rather than treating the supplied reference text
   as the bone name;
5. keep this slice identity-only: do not change Undo placement, keyframe creation,
   interpolation, timeline mutation, batch operations, or Geometry/Texture.

After the source fix, inspect the commit diff immediately for drift, then advance
to exactly one grounded Animation boundary—likely `manage_keyframes` animator
creation / Undo recoverability if the audit still supports it.

## Proof Boundary

ChatGPT → GitHub may prove source/API/schema/control-flow/target-resolution
structure only. Actual Blockbench animation playback, keyframe mutation,
Undo/Redo, motion arcs, clipping, bone pivots, return-to-neutral behavior, and
save/reopen remain `LOCAL PROOF REQUIRED` until local runtime testing resumes.
