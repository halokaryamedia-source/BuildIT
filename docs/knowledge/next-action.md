# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling, hierarchy, rotation, and pivot decisions
  evidence-backed instead of assumption-driven.
- **Status:** `REFERENCE_FIDELITY_CUBE_PIVOT_SEMANTICS_HARDENED`.
- **Execution now:** ChatGPT → GitHub architecture/source work.
- **Local testing:** explicitly deferred by current user priority.
- **G3 annotations:** paused.

## Confirmed Failure Evidence

Prior modelling tests showed:

1. Cubes could be placed mainly because they fit/attach, then falsely treated as
   approval even when the whole object was visibly wrong;
2. rotations could become arbitrary/overcomplicated without a reference-visible
   slope/orientation reason;
3. pivots/origins could become abstract or distant because numeric fields were
   filled without a real joint/attachment/transform purpose.

The active solution remains a **Reference Fidelity Loop**, not automatic
image-to-Cube fitting.

## Reference Fidelity Loop v1

```text
APPROVED REFERENCE
↓
CROSS-VIEW CONSISTENCY
↓
COORDINATE FRAME + TARGET ENVELOPE
↓
NORMALIZED PRIMARY FORM HYPOTHESIS
↓
COARSE PRIMARY BLOCKOUT
↓
inspect_model_bounds
↓
capture_model_views
↓
REFERENCE ↔ MODEL COMPARISON
↓
GLOBAL OR LOCAL FAILURE?
  │
  ├─ GLOBAL → revise/rebuild primary hypothesis
  │
  └─ LOCAL → inspect_element → causal correction
                    │
                    ├─ one Cube → modify_cube by confirmed UUID
                    └─ one relationship / several Cubes → modify_cubes_batch
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / PIVOTS
↓
TEXTURE / OPTIONAL ANIMATION
```

## Fidelity Instruments Implemented In Source

- `inspect_model_bounds` — raw rendered Cube envelope facts only.
- `capture_model_views` — canonical labeled 512×512 comparison images.
- `inspect_element` — focused authored Cube/Group state by explicit target.
- `modify_cubes_batch` — heterogeneous exact-UUID Cube correction in one
  recoverable Undo unit.
- `modify_cube` / `place_cube` — explicit target/group resolution hardened;
  missing/ambiguous targets no longer silently mutate multiple Cubes or fall back
  to root.
- `add_group` / `bone_rigging` — neutral Group defaults, action-specific preflight,
  unique targets/names, rollback, and Group pivot transfer semantics.

## Cube Pivot Mutation Semantics — Hardened

Audit compared Local `mcp/server/tools/cubes.ts` with official Blockbench Cube
API/source.

Official Blockbench documents:

```text
Cube.transferOrigin(origin, update?)
```

as transferring the origin to a new position **while updating `from` and `to` to
keep the same visual position**. The source implementation uses the Cube preview
mesh quaternion to calculate the compensating shift before setting the new
origin.

Therefore Local now distinguishes two intents without adding a new mode/tool.

### Pivot-only Cube correction

Per Cube/update:

```text
origin supplied
from omitted
to omitted
rotation omitted
```

means:

```text
PIVOT-ONLY CORRECTION
→ preflight Cube preview mesh before Undo
→ Cube.transferOrigin(origin)
→ preserve visual Cube position
```

Other non-transform fields such as visibility/name may still be updated in the
same single-Cube call; they do not change this pivot-only classification.

If a Cube has no preview mesh, the pivot-only operation fails before Undo rather
than allowing Blockbench `transferOrigin()` to return without proving the
preserving transform occurred.

### Authored geometry rewrite

If `origin` is supplied together with any of:

```text
from
to
rotation
```

then Local treats the request as an intentional authored transform rewrite and
uses the explicit transform fields directly. It does **not** compensate the
origin by `transferOrigin`, because the caller is explicitly redefining the
geometry/pivot relationship.

### Single- and multi-Cube paths

The same semantic rule now applies to:

- `modify_cube`;
- every independent item in `modify_cubes_batch`.

For batch corrections all target UUIDs and all pivot-only preview-mesh
requirements are preflighted before Undo opens. A later mutation failure still
uses `Undo.cancelEdit(true)`.

`Canvas.updateAll()` is outside the successful batch Undo transaction, so a
post-commit refresh problem does not attempt to cancel an already finished edit.

### Bedrock prompt routing

The normal Bedrock workflow now tells the agent:

```text
Cube geometry visually correct, pivot alone wrong
→ inspect exact Cube
→ modify origin without from/to/rotation
→ pivot-transfer semantics preserve visual position

Cube geometry/rotation and pivot intentionally change together
→ send the actual origin + from/to/rotation changes together
→ authored rewrite
```

A pivot-only correction must never be used as a disguised way to move geometry.

## Static Evidence

Compare from the pre-Cube-pivot state
`c971475aef0e7fb222c320f8bbde857104ed3c78` showed only:

```text
mcp/server/tools/cubes.ts
mcp/prompts/bedrock.md
```

changed before this continuity update.

Official Blockbench types/source are the authority for the `transferOrigin`
semantics. Live behavior in the user's installed Blockbench remains
`LOCAL PROOF REQUIRED`; local testing is not the current blocker.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- old screenshot project-restoration issue is outside canonical fidelity capture.
- UV additions, save/open proof, and final public-surface reduction remain later.

## Do Not Reintroduce

- per-Cube approval/planning ceremony;
- first-Cube/support/section-first rules;
- automatic image→Cube conversion;
- SF3D/mesh decomposition;
- IoU/projection/similarity authority;
- all-in-one Bedrock builder;
- arbitrary rotation/pivot helpers;
- detail generation before whole-form pass;
- dynamic Rework profile/state/lease machinery.

## Next Step

Audit **initial Cube creation rotation/pivot safety** in `place_cube` / shared
`cubeSchema`.

Current shared schema uses neutral defaults:

```text
origin   omitted → [0,0,0]
rotation omitted → [0,0,0]
```

Neutral origin is harmless for an unrotated Cube, but a caller can currently
supply a non-zero rotation while omitting origin; after schema defaults are
applied the runtime can no longer tell whether `[0,0,0]` was an intentional pivot
or an accidental default. This can create exactly the kind of distant/abstract
rotation seen in prior modelling tests.

Determine the smallest compatibility-safe contract so:

```text
unrotated Cube
→ no pivot ceremony required

rotated Cube
→ pivot/origin must be intentional and evidence-backed
```

Do not impose a universal center pivot, infer a pivot automatically, or add a
pivot planner. Prefer a schema/runtime preflight that makes missing intent fail
clearly. Do not resume G3 or mix UV/hierarchy work into this slice.
