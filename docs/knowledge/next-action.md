# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `REFERENCE_FIDELITY_BATCH_CORRECTION_IMPLEMENTED`.
- **Execution now:** ChatGPT → GitHub architecture/source work.
- **Local testing:** explicitly deferred by current user priority.
- **G3 annotations:** paused.

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
                    │
                    ├─ one Cube → modify_cube by confirmed UUID
                    └─ one relationship / several Cubes → modify_cubes_batch
↓
FRESH AFFECTED EVIDENCE
↺ until primary form passes or hypothesis is abandoned
↓
SECONDARY GEOMETRY / HIERARCHY / TEXTURE / OPTIONAL ANIMATION
```

## Implemented Fidelity Instruments

### `inspect_model_bounds`

Read-only whole-Cube rendered envelope based on Blockbench
`Cube.getGlobalVertexPositions()` and active world transforms. Returns raw
structural facts only; no visual score or correction advice.

### `capture_model_views`

Canonical labeled 512×512 image observation using Blockbench's offscreen preview,
with explicit front direction and model/explicit-envelope framing. It does not
judge resemblance or change the active editor camera/project/model.

### `inspect_element`

Focused authored-state read for one explicit Cube/Group. Duplicate names fail;
UUID is preferred. It exposes Cube from/to/size/origin/rotation/visibility or
Group origin/rotation/visibility/parent/child count without visual judgement.

## Multi-Cube Correction — Implemented

Audit of existing `modify_cube` showed it could affect multiple Cubes only by
applying the **same** update to all matching/selected Cubes. A correction such as:

```text
body  → resize
head  → translate
front → rotate
```

therefore required several tool calls and several Undo entries even when those
changes represented one primary relationship correction.

### `modify_cubes_batch`

Implemented in `mcp/server/tools/cubes.ts`.

Public shape:

```text
modify_cubes_batch {
  updates: [
    {
      id: <exact Cube UUID>,
      from?: [x,y,z],
      to?: [x,y,z],
      origin?: [x,y,z],
      rotation?: [x,y,z],
      visibility?: boolean
    }
  ]
}
```

Contract:

- 1–32 update items;
- UUID-only targeting; no names and no selection fallback;
- every UUID must be unique in the batch;
- every item must change at least one authored field;
- numeric vectors must be finite;
- **all targets are resolved before `Undo.initEdit`**;
- each Cube may receive a different patch;
- one `Undo.initEdit` / one successful `Undo.finishEdit` for the relationship;
- mutation failure calls official Blockbench `Undo.cancelEdit(true)` and refreshes
  Canvas, reverting the opened edit;
- result returns final authored state for every modified Cube;
- no UV/color/shade/inflate/reparent/planning/similarity/PASS behavior.

Sample's batch implementation was used only as evidence. Local intentionally does
not copy its broad UV/appearance surface or first-name-match targeting.

### Prompt routing

`mcp/prompts/bedrock.md` now says:

```text
one diagnosed Cube correction
→ inspect_element
→ modify_cube using the confirmed exact UUID

one causal relationship spanning several Cube UUIDs
→ inspect_element as needed
→ modify_cubes_batch
→ fresh affected canonical views
```

Do not batch unrelated cleanup or speculative changes.

## Static Evidence

Source proof establishes:

1. `modify_cube` did not provide heterogeneous per-Cube updates in one call;
2. `modify_cubes_batch` preflights all UUID targets before Undo;
3. its important schema refinements live inside the registered `updates` field,
   compatible with Local `createTool()` shape extraction;
4. official Blockbench Undo types expose `cancelEdit(true)` for reverting an
   unfinished edit;
5. the batch tool changes only explicit authored geometry/visibility fields;
6. `cubeToolDocs` already feeds the existing Cubes docs category, so no new docs
   framework/registration surface was needed.

Live Undo/runtime behavior remains `LOCAL PROOF REQUIRED` until the user later
chooses local Blockbench testing. It is not the current blocker.

## Current Safety Gap Exposed By The Same Audit

The new batch path is stricter than two older Cube mutation paths.

### `modify_cube`

Current behavior when `id` is provided:

```text
Cube.all.filter(cube.uuid === id || cube.name === id)
```

Therefore a duplicated exact name can silently modify several Cubes. If `id` is
omitted, it falls back to current selection. This is legacy convenience but is
unsafe as the normal reference-fidelity correction path unless exact targeting is
made explicit.

### `place_cube`

Current provided group resolution ends with:

```text
...find(group name/uuid) ?? "root"
```

So a misspelled/nonexistent requested group silently places new Cubes at root.
That behavior directly conflicts with the new rule that structural attachment is
not approval and that authored placement must not be assumption-driven.

Also keep failure/preflight ordering under review so an error that can be known
before mutation is discovered before opening Undo.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- **G4 old screenshot project restoration:** canonical fidelity capture avoids
  that path.
- **G5 bone-rigging Undo preflight:** held until hierarchy runtime work resumes.
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

Harden **existing Cube mutation targeting only** in `mcp/server/tools/cubes.ts`:

1. when `modify_cube.id` is supplied, resolve UUID first and require an exact
   unique name if name compatibility is retained; never silently mutate multiple
   same-name Cubes;
2. keep selection fallback only if preserving existing compatibility requires it,
   but the Bedrock fidelity prompt must continue to use confirmed UUIDs;
3. when `place_cube.group` is explicitly supplied, fail if that group does not
   exist instead of silently falling back to root; omitted group may still mean
   root;
4. move resolvable target/group preflight before `Undo.initEdit`;
5. use the smallest existing Undo cancellation pattern only where a mutation can
   still fail after Undo starts.

Do not change hierarchy tools, UV behavior, camera, G3, or broaden the Cube API in
this slice.