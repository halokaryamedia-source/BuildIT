# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `INSPECT_MODEL_BOUNDS_IMPLEMENTED_CAPTURE_NEXT`.
- **Execution now:** ChatGPT → GitHub architecture/source work.
- **Local testing:** explicitly deferred by current user priority.
- **G3:** paused.
- **Root-cause review:**
  `docs/knowledge/reviews/mcp-reference-fidelity-root-cause.md`.
- **Observation contract:**
  `docs/knowledge/reviews/mcp-reference-fidelity-observation-contract.md`.

## Confirmed Failure Evidence

Prior modelling tests repeatedly showed:

1. the agent can place Cubes mainly because they can be made to fit/attach, then
   treat "all Cubes are placed" as approval even when the model is visibly far
   from the reference;
2. rotation values can become arbitrary/overcomplicated without a clear visible
   slope/orientation reason;
3. pivot/origin values can become abstract or distant because they are filled as
   numeric fields instead of being chosen from a real joint/attachment/transform
   relationship.

Foundation/modelling rules are already hardened against those behaviors.

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
  └─ LOCAL → inspect exact authored state → causal correction
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

## Completed Observation Slice — Shared Bounds + `inspect_model_bounds`

### Shared owner

New canonical runtime helper:

```text
mcp/lib/renderedModelBounds.ts
```

It is intentionally shared so the later `capture_model_views` framing uses the
same bounds definition rather than inventing a second envelope algorithm.

### Bounds authority

The implementation uses Blockbench's own:

```text
Cube.getGlobalVertexPositions()
```

rather than recomputing rotations/hierarchy from raw Cube values.

Official Blockbench implementation transforms inflated/stretched Cube corners
through the Cube preview mesh `matrixWorld`, which carries active Cube/group
transform relationships. Before reading a Cube, Local refreshes the Cube and
parent world matrices with `updateWorldMatrix(true, false)`.

This is materially safer than Sample's standalone rotation-only bounds helper for
the contract we now claim.

### Visibility and unsupported geometry

- only effectively visible Cube preview objects contribute to rendered bounds;
- hidden/non-rendered Cubes are excluded and reported as counts/warnings;
- empty/fully hidden Cube state returns `bounds=null`, not fabricated dimensions;
- v1 rejects a project containing Blockbench `Mesh` elements rather than claiming
  incomplete Cube-only bounds are the whole rendered model;
- no fallback center/size such as `[0,8,0]` / `[16,16,16]` exists.

### Public tool

`mcp/server/tools/project.ts` now exposes:

```text
inspect_model_bounds {}
```

Output facts:

```text
project identity
has_geometry
cube_count / rendered_cube_count / hidden_cube_count
bounds_basis = rendered_current_pose
coordinate axes X/Y/Z
min / max / center
size_xyz
width / height / length
XZ footprint
animation + timeline pose context
warnings
```

It does **not** accept target dimensions and does not return:

```text
PASS / FAIL
within_tolerance
similarity
recommended_scale
correction_delta
reanchor suggestion
visual quality score
```

### Registration/docs integration

No extra registration wiring was required:

- `registerProjectTools()` is already part of the core tool registration list;
- `projectToolDocs` is already imported into the docs manifest;
- the new empty input schema is build-time safe because the shared bounds helper
  touches Blockbench globals only inside runtime function bodies;
- generated docs remain generated and were not hand-edited.

### Bedrock prompt alignment

`mcp/prompts/bedrock.md` now explicitly routes the coarse primary blockout through
`inspect_model_bounds` before visual approval when scale/ground/envelope facts are
useful. It states that matching dimensions are structural evidence only and do
not prove resemblance.

## Static Proof Available

Repository/source proof establishes:

1. one shared runtime bounds owner exists;
2. the public read-only tool is declared and registered through the existing
   Project tool path;
3. tool output contains observation facts only;
4. no target evaluator/correction behavior was added;
5. prompt routing uses the tool as an envelope observation rather than approval;
6. no capture/mutation/G3 implementation changed in this slice.

Runtime claims remain **LOCAL PROOF REQUIRED** until the user later chooses a
Blockbench test, especially:

- current animated/group transforms produce the expected numeric envelope;
- effective visibility matches Blockbench rendering in all intended cases.

Those deferred proofs do not block the current architecture/source sequence.

## Frozen `capture_model_views` Contract

Next implementation must follow the frozen observation contract:

```text
views: 1–5 unique named views
front_direction: +z | -z
framing:
  model
  OR explicit min/max target envelope
```

Named views:

```text
front
back
left
right
top
bottom
front_left_3q
front_right_3q
```

Required behavior:

- active project only; no project selector;
- fixed 512×512 PNG + fixed small padding;
- principal views true axis-aligned orthographic;
- no hidden elevation on front/back/left/right;
- `front_direction` required, no inferred/default front;
- left/right semantics object-relative to front direction;
- 3/4 views stable perspective context only;
- `framing=model` calls the new `readRenderedModelBounds()` helper;
- `framing=explicit` uses exactly the supplied target envelope and never expands
  it to hide out-of-envelope geometry;
- labeled text + actual MCP image content per view;
- snapshot/restore camera in `finally`;
- no project/selection/texture/animation/model-state changes;
- restoration failure means tool failure;
- no custom camera, file output, particle, texture variant, animation/time,
  selected scope, reference comparison, similarity score, or automatic PASS.

## Holds

- **G1/G2:** source corrections remain implemented; local proof deferred.
- **Slice A:** goal-oriented prompt source remains implemented; local proof is not
  the active blocker.
- **G3 annotations:** paused.
- **G4 screenshot restoration:** do not patch separately; canonical capture owns
  strict camera restoration and avoids project switching entirely.
- **G5 bone-rigging Undo preflight:** held until hierarchy runtime work resumes.
- `inspect_element`, `modify_cubes_batch`, mutation safety, UV additions, and
  public-surface reduction remain later slices.

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

Implement **only `capture_model_views`** using the frozen contract and the shared
`readRenderedModelBounds()` basis. Keep the existing low-level screenshot helper
for current-view/diagnostic compatibility; do not replace it or broaden canonical
capture into Sample's multi-purpose preview framework. Do not implement
`inspect_element`, mutation tools, or resume G3 in the same slice.
