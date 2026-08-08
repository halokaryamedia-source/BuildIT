# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling, hierarchy, rotation, and pivot decisions
  evidence-backed instead of assumption-driven.
- **Status:** `REFERENCE_FIDELITY_GROUP_PIVOT_HARDENED`.
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

The active solution is a Reference Fidelity Loop, not additional automatic
geometry inference.

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

## Fidelity Instruments Already Implemented In Source

- `inspect_model_bounds` — raw rendered Cube envelope facts only.
- `capture_model_views` — canonical labeled 512×512 reference-comparison images.
- `inspect_element` — focused authored Cube/Group state by explicit target.
- `modify_cubes_batch` — heterogeneous exact-UUID Cube correction in one
  recoverable Undo unit.
- `modify_cube` / `place_cube` — explicit target/group resolution hardened;
  missing/ambiguous targets no longer silently mutate multiple Cubes or fall back
  to root.

## Group / Pivot Authoring — Hardened

### `add_group`

`mcp/server/tools/element.ts` now treats neutral transforms as the default rather
than forcing the agent to invent pivot/rotation values:

```text
origin   optional → [0,0,0]
rotation optional → [0,0,0]
parent   optional → intentional root
```

The neutral default is **not** claimed to be the correct articulated pivot. It
means an organizational/non-articulated Group does not need a fabricated
transform story.

When a parent is supplied:

```text
exact Group UUID
→ otherwise exact unique name
→ duplicate name = error with candidate UUIDs
→ missing target = error
```

Parent resolution happens before Undo. Group creation/addTo failure cancels the
opened edit with `Undo.cancelEdit(true)`.

### `bone_rigging`

`mcp/server/tools/animation.ts` keeps the existing experimental tool but hardens
it instead of adding a new pivot/rigging framework.

All action-specific required targets/inputs are preflighted **before Undo**.
Existing Group/child targets resolve UUID-first or by exact unique name; missing
or ambiguous targets fail rather than being ignored.

Key action rules:

- `create` — bone name must be unique; omitted origin/rotation remain neutral;
  parent omitted means intentional root; supplied parent/children/IK target must
  resolve before mutation; duplicate child references fail.
- `parent` — exact target + explicit parent are required; use `unparent` for root;
  self-parenting fails.
- `rename` — uses explicit `new_name` and keeps Group names unique; it no longer
  abuses `children[0]` or invents `new_name`.
- `set_pivot` — exact Group target + explicit origin required. It now calls
  Blockbench `Group.transferOrigin(origin)` rather than assigning `origin`
  directly.
- `set_ik` — enabling IK requires a valid resolved IK target.
- `mirror` — mirror axis must be explicit; no implicit X-axis assumption.
- mutation failures cancel/revert the open Undo edit.

Official Blockbench types document `Group.transferOrigin(origin)` as moving a
bone origin without visually affecting the position of its contents. This is the
right runtime primitive for a **pivot-only** change; live behavior in the user's
installed Blockbench remains `LOCAL PROOF REQUIRED`.

### Bedrock prompt routing

The normal Bedrock workflow now says:

- create organizational Groups with neutral defaults rather than invented
  pivots/angles;
- use exact Group UUIDs for intended hierarchy targets;
- inspect an existing Group before a material pivot change;
- call `bone_rigging(action="set_pivot")` only when an actual joint/attachment/
  transform-center reason exists;
- re-observe affected attachment/orientation after material hierarchy/pivot work;
- no ambiguous names, implicit parent targets, or implicit mirror axes.

## Static Evidence

Compare from the pre-pivot state
`ffe585ffddb333d4cd9d049bc79aeff74fa3c092` showed only the intended owners were
changed before this continuity update:

```text
mcp/server/tools/element.ts
mcp/server/tools/animation.ts
mcp/prompts/bedrock.md
```

No Cube correction implementation, camera/observation implementation, UV,
save/open, transport, or G3 source changed in this slice.

Live Blockbench behavior remains `LOCAL PROOF REQUIRED`; local proof is not the
current blocker because the user has explicitly deferred local testing.

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

Audit **Cube origin/pivot mutation semantics only** in
`mcp/server/tools/cubes.ts` against Blockbench's official Cube API.

Current correction paths can set `cube.origin` through `cube.extend(...)`.
Blockbench also exposes `Cube.transferOrigin(origin, update?)`, which is designed
to move a Cube's origin while preserving its visual position.

Determine the smallest correct rule for:

```text
pivot-only Cube correction
vs
origin changed together with from/to/rotation as an authored geometry rewrite
```

Use `transferOrigin` only where its semantics match the modelling intent. Do not
add a new pivot planner/tool unless the existing Cube mutation surface cannot
express the required distinction. Do not resume G3 or mix UV/hierarchy work into
this slice.
