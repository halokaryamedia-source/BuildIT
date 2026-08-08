# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session reads
this after `AGENTS.md` and `CONTEXT.md` and continues from here instead of
reconstructing prior chats.

## Active Task

- **Goal:** solve gross Reference Image / Modelling Brief → Blockbench geometry
  divergence by making modelling decisions evidence-backed instead of
  assumption-driven.
- **Status:** `REFERENCE_FIDELITY_CUBE_TARGETING_HARDENED`.
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

## Fidelity Instruments Implemented In Source

### `inspect_model_bounds`

Read-only whole-Cube rendered envelope using Blockbench global Cube vertices and
active world transforms. Returns raw structural facts only.

### `capture_model_views`

Canonical labeled 512×512 image observation using Blockbench offscreen preview,
explicit front direction, and model/explicit-envelope framing. It does not judge
resemblance.

### `inspect_element`

Focused authored-state read for one explicit Cube/Group. Duplicate names fail;
UUID is preferred. Exposes the current authored transforms without deciding
whether they are correct.

### `modify_cubes_batch`

Heterogeneous updates across several exact Cube UUIDs in one recoverable Undo
unit. All UUIDs are preflighted before mutation and mutation failure reverts the
opened edit.

## Cube Mutation Targeting — Hardened

### `modify_cube`

When `id` is supplied:

```text
UUID exact match
→ otherwise exact unique name
→ duplicate exact name = error with candidate UUIDs
→ missing target = error
```

It no longer silently modifies every Cube sharing the same exact name.

The no-`id` selected-Cube fallback remains only for legacy compatibility. The
normal Bedrock fidelity prompt uses confirmed UUIDs and must not rely on
selection.

### `place_cube`

Hierarchy target is resolved **before Undo opens**:

```text
group omitted       → intentional root
group = "root"      → intentional root
exact Group UUID     → that Group
exact unique name    → that Group
missing name/UUID    → error
ambiguous exact name → error with candidate UUIDs
```

The old `find(...) ?? "root"` behavior is removed. A misspelled/assumed group can
no longer make a Cube appear successfully at root and masquerade as correct
placement.

Texture and hierarchy target preflight both happen before `Undo.initEdit`.
`place_cube` and `modify_cube` now cancel/revert the opened edit when mutation
fails after Undo starts. UI refresh is outside the successful Undo transaction so
a post-commit Canvas refresh error does not attempt to cancel a completed edit.

### Prompt routing

`mcp/prompts/bedrock.md` now requires:

- exact Group UUID when a specific parent/bone is intended;
- omitted group/explicit `root` only for intentional root placement;
- exact confirmed Cube UUID for normal `modify_cube` corrections;
- no reliance on guessed group names, duplicate Cube names, or selection state.

## Static Evidence

Source proof establishes:

1. legacy `modify_cube` multi-name targeting is replaced by UUID-first / unique-
   name resolution;
2. explicit `place_cube.group` can no longer silently fall back to root;
3. target/group lookup happens before Undo;
4. public tool descriptions match the stricter behavior;
5. no camera, observation, UV, hierarchy implementation, or G3 source changed in
   this targeting slice.

Live Blockbench behavior remains `LOCAL PROOF REQUIRED` until the user later
chooses runtime testing. Local proof is not the current blocker.

## Holds

- **G1/G2:** source corrections implemented; local proof deferred.
- **G3 annotations:** paused.
- **G4 old screenshot project restoration:** canonical fidelity capture avoids
  that path.
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

Audit the current **Group / pivot authoring surface** because arbitrary pivots and
rotations remain a confirmed modelling failure pattern.

Inspect only the current owners, primarily:

```text
mcp/server/tools/element.ts      → add_group inputs / parent resolution
mcp/server/tools/animation.ts    → bone_rigging pivot/hierarchy actions
```

Questions to answer before changing anything:

1. does `add_group` force callers to invent rotation/pivot values that should be
   optional/defaulted instead;
2. can a requested parent/group target silently fall back or resolve ambiguously;
3. does `bone_rigging` preflight every action target before `Undo.initEdit`;
4. can pivot changes be made only against an explicit Group UUID/unique target;
5. what is the smallest change that makes pivot/hierarchy authoring causal and
   recoverable without creating a new rigging framework.

If an existing path already satisfies a requirement, keep it. Do not add a new
pivot planner, automatic joint inference, G3 work, UV changes, or animation
framework in the same slice.
