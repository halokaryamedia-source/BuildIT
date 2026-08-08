# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling, hierarchy, rotation, pivot, and placement
  decisions evidence-backed instead of assumption-driven.
- **Status:** `REFERENCE_FIDELITY_EXPLICIT_EXTENTS_HARDENED`.
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

## Fidelity Safety Implemented In Source

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
- Rotated Cube creation — a new Cube with non-zero rotation must provide an
  explicit origin/pivot; unrotated Cubes may omit origin.

## Initial Cube Geometry Extents — Hardened

### Problem

Shared `cubeSchema` historically provides:

```text
from omitted → [0,0,0]
to omitted   → [1,1,1]
```

Those defaults are useful as a generic compatibility primitive, but unsafe as the
normal `place_cube` modelling contract because a Cube can be created even when
the agent never made an explicit size/placement decision.

That behavior is directly adjacent to the confirmed failure pattern:

```text
Cube can technically be placed
→ Cube gets placed
→ existence is mistaken for modelling progress
```

### Local `place_cube` contract

`mcp/server/tools/cubes.ts` keeps shared `cubeSchema` unchanged globally and
continues to derive a focused `placeCubeElementSchema` for initial modelling.

That focused schema now overrides:

```text
from → required finite [x,y,z]
to   → required finite [x,y,z]
```

So every new Cube must arrive with intentional geometry extents. `place_cube`
no longer supplies the shared default `[0,0,0] → [1,1,1]` when geometry was
omitted.

No ordering or size heuristic was added. The validator does **not** claim whether
an extent is visually correct; it only requires the caller to make the geometry
decision explicitly.

The existing creation rules remain:

```text
rotation omitted / [0,0,0]
+ origin omitted
→ valid neutral unrotated Cube

non-zero rotation
+ origin omitted
→ error

non-zero rotation
+ explicit origin
→ valid
```

### Why shared `cubeSchema` remains unchanged

The generic schema may have other compatibility consumers. The reference-fidelity
requirement belongs specifically to the public initial-placement contract, so the
stricter fields live only in `placeCubeElementSchema`.

### Bedrock prompt routing

Normal modelling guidance now requires the agent to choose explicit finite
`from` and `to` from the Primary Form Hypothesis **before** calling `place_cube`.
The tool is not a scratch operation for creating a default Cube and deciding its
geometry later.

## Static Evidence

Compare from the pre-extent state
`44a45f9ec7f640442171c345397d52743a35db2f` showed only:

```text
mcp/server/tools/cubes.ts
mcp/prompts/bedrock.md
```

changed before this continuity update.

`mcp/lib/zodObjects.ts` was intentionally left unchanged.

Static source establishes the contract. Live MCP schema behavior and Blockbench
creation remain `LOCAL PROOF REQUIRED`; local testing is not the current blocker.

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
- default Cube creation as modelling progress;
- detail generation before whole-form pass;
- dynamic Rework profile/state/lease machinery.

## Next Step

Audit **existing-Cube rotation activation safety** in `modify_cube` and
`modify_cubes_batch`.

Current creation safety guarantees a newly rotated Cube has an explicit pivot.
However an initially unrotated Cube may intentionally omit origin and therefore
use neutral `[0,0,0]`. A later correction can currently apply a non-zero
`rotation` without also supplying `origin`, causing the first rotation to reuse a
pivot that may never have been chosen as a real rotation center.

Determine the smallest contract that distinguishes:

```text
Cube already rotated
→ adjusting rotation may reuse its existing inspected pivot

Cube currently unrotated
→ first non-zero rotation must not silently activate around an unproven neutral pivot
```

Prefer an execution preflight using the inspected current Cube state. Do not
require a new pivot on every rotation adjustment, do not infer pivots, and do not
add a rotation planner. Do not resume G3 or mix UV/hierarchy work into this slice.