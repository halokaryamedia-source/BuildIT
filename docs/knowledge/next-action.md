# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `REFERENCE_FIDELITY_LOCAL_INSPECTION_IMPLEMENTED`.
- **Execution now:** ChatGPT → GitHub architecture/source work.
- **Local testing:** explicitly deferred by current user priority.
- **G3:** paused.

## Confirmed Failure Evidence

Prior modelling tests showed:

1. Cubes can be placed mainly because they fit/attach, then falsely treated as
   approval even when the whole object is visibly wrong;
2. rotations can become arbitrary/overcomplicated without a reference-visible
   slope/orientation reason;
3. pivots/origins can become abstract or distant because numeric fields are
   filled without a real joint/attachment/transform purpose.

Foundation, modelling skill, and Bedrock prompt rules are hardened against those
behaviors.

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
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

## Observation Layer — Source Implemented

### `inspect_model_bounds`

Uses shared `mcp/lib/renderedModelBounds.ts` based on Blockbench
`Cube.getGlobalVertexPositions()` and current world transforms. Reports raw
whole-Cube envelope facts only; no visual score or correction advice.

### `capture_model_views`

Uses the same shared bounds basis and Blockbench's official offscreen screenshot
preview. Provides canonical labeled 512×512 image content with explicit front
direction and model/explicit-envelope framing. It does not mutate the active
editor camera/project/model and does not judge resemblance.

## Local Authored-State Inspection — Implemented

Audit findings before implementation:

- `find_elements_by_criteria` was useful for locating a target but returned only
  `uuid/name/type/parent` metadata;
- `nodes://{id}` reads runtime `Project.nodes_3d` transform state, not the authored
  Cube/Group fields needed to plan an exact modelling correction;
- broadening either surface would mix discovery/runtime-node data with focused
  authored-state inspection.

### `inspect_element`

New focused read-only tool:

```text
inspect_element { id }
```

Input:

- exact UUID or exact unique name;
- UUID is preferred after locating a target with `list_outline` or
  `find_elements_by_criteria`;
- duplicate exact names fail with candidate UUIDs rather than silently choosing
  one element.

Cube output:

```text
uuid / name / type
parent identity or root/null
from / to / size
origin (pivot)
rotation
visibility
```

Group output:

```text
uuid / name / type
parent identity or root/null
origin (pivot)
rotation
visibility
children_count
```

Boundary:

- active project only;
- no selection dependence or state mutation;
- generic Mesh target is rejected in v1 because the normal fidelity loop is
  explicitly Cuboid/Group Bedrock;
- no claim that a placement, rotation, or pivot is correct;
- no visual PASS/FAIL or automatic correction.

Implementation is isolated in `mcp/server/tools/element-inspection.ts`, registered
as a core Elements tool through `mcp/server/tools.ts`, and merged into the
existing Elements docs category in `mcp/build/docs-manifest.ts`. No duplicate
`elements://` resource was added.

### Bedrock prompt routing

For a diagnosed **local** mismatch the normal route is now:

```text
visual mismatch
→ locate exact target UUID when needed
→ inspect_element
→ classify TRANSLATE / RESIZE / ROTATE / REATTACH / SPLIT / MERGE-REMOVE / genuine ADD MASS
→ derive correction from visual evidence + current authored state
```

The agent must not guess the existing target transform from memory or screenshot.

## Evidence Status

Static source/contract proof is available.

Live behavior remains `LOCAL PROOF REQUIRED` until the user later chooses local
Blockbench testing. Local proof is not the current blocker.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- **G4 old screenshot project restoration:** canonical fidelity capture avoids
  that path.
- **G5 bone-rigging Undo preflight:** held until hierarchy runtime work resumes.
- UV additions, save/open proof, and public-surface reduction remain later.

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

Audit the current **Cube correction mutation surface** before adding a batch tool:
read `mcp/server/tools/cubes.ts` and its direct helpers to determine whether the
existing `modify_cube` path can safely express a coherent correction involving
multiple explicitly identified primary Cubes.

Evaluate only demonstrated correction needs:

```text
heterogeneous updates across several Cube UUIDs
preflight every target before mutation
one recoverable Undo unit
explicit authored fields only
no automatic visual/planning logic
```

If existing `modify_cube` already satisfies this cleanly, reuse it. If repeated
single calls inherently fragment one primary relationship correction, implement
the smallest `modify_cubes_batch` contract. Do not resume G3 or mix hierarchy/UV
changes into that slice.
