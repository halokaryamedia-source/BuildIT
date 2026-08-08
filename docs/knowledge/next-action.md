# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling, hierarchy, rotation, pivot, and placement
  decisions evidence-backed instead of assumption-driven.
- **Status:** `REFERENCE_FIDELITY_ROTATED_CUBE_CREATION_HARDENED`.
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

## Fidelity Instruments / Safety Already Implemented In Source

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
- Cube pivot-only correction — `Cube.transferOrigin()` preserves visual position;
  origin combined with from/to/rotation remains an intentional authored rewrite.

## Rotated Cube Creation — Hardened

### Problem proved by the previous contract

Shared `cubeSchema` historically supplied:

```text
origin   omitted → [0,0,0]
rotation omitted → [0,0,0]
```

That neutral origin is harmless for an unrotated Cube. But when a caller supplied
non-zero rotation and omitted origin, schema defaulting erased the distinction
between:

```text
origin [0,0,0] intentionally chosen
```

and:

```text
origin forgotten by the agent
```

For a rotated Cube that ambiguity can create a distant/abstract rotation center.

### Local `place_cube` contract

The shared `cubeSchema` was **not changed globally**. `mcp/server/tools/cubes.ts`
now derives a focused `placeCubeElementSchema` for `place_cube` only.

Rules:

```text
rotation omitted / [0,0,0]
+ origin omitted
→ valid
→ runtime uses neutral [0,0,0]

any non-zero rotation
+ origin omitted
→ schema error before tool execution / Undo

any non-zero rotation
+ explicit origin
→ valid
```

The rule is per Cube inside the `elements` array, so one invalid rotated Cube
rejects the request rather than allowing that Cube to inherit an accidental
pivot.

`origin` and `rotation` use finite-vector schemas in this focused creation
contract.

### Why the refinement is nested

Local `createTool()` extracts the top-level Zod object shape for MCP
registration. Therefore the cross-field rotation/origin refinement is kept on
`placeCubeElementSchema`, which remains inside the registered `elements` field,
rather than relying on a top-level refinement that the factory would unwrap.

### Runtime behavior

For an accepted unrotated Cube whose origin was omitted, creation supplies the
neutral `[0,0,0]` origin. A rotated Cube cannot reach creation without an explicit
origin under the focused schema.

No automatic center-pivot calculation, attachment inference, pivot planner, or
new mode/tool was added.

### Bedrock prompt routing

Normal Bedrock guidance now states:

```text
unrotated Cube
→ no pivot ceremony
→ neutral origin may be omitted

rotated Cube
→ rotation must already have reference/form/motion evidence
→ explicit origin required
→ pivot must have a visible attachment / rotation-center reason
```

Copied pivots, arbitrary multi-axis rotation, and rotation used to compensate for
wrong size/placement remain invalid modelling reasoning.

## Static Evidence

This slice changed only:

```text
mcp/server/tools/cubes.ts
mcp/prompts/bedrock.md
```

before this continuity update.

`mcp/lib/zodObjects.ts` was intentionally left unchanged, so the compatibility
meaning of shared `cubeSchema` outside the focused `place_cube` contract did not
change.

Static source establishes the contract and registration path. Live MCP schema
behavior and Blockbench creation remain `LOCAL PROOF REQUIRED`; local testing is
not the current blocker because it is explicitly deferred.

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

Audit **initial Cube geometry extent safety** in `place_cube` only.

The focused creation schema still inherits shared `cubeSchema` defaults:

```text
from omitted → [0,0,0]
to omitted   → [1,1,1]
```

That means a Cube can still be technically created even when the agent never
made an explicit size/placement decision. This is directly adjacent to the
confirmed failure pattern: "place a Cube because it can be placed, then treat
its existence as progress/approval."

Determine the smallest compatibility-safe `place_cube` contract so initial
modelling requires intentional geometry extents without changing shared
`cubeSchema` globally.

Preferred question:

```text
Should place_cube require explicit finite `from` and `to` for every new Cube,
while retaining neutral defaults only for fields whose omission is genuinely
non-semantic (for example unrotated origin/rotation)?
```

Do not add automatic Cube sizing, inferred extents, minimum-size heuristics, or
reference-to-coordinate automation. Do not resume G3 or mix UV/hierarchy work
into this slice.
