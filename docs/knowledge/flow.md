# BlockIT Flow

Updated: 2026-09-05

This file is the **single detailed product flow**. Root `AGENTS.md` owns task routing, `workspace/README.md` owns persistent asset continuity, and `docs/knowledge/next-action.md` owns implementation continuation.

## 1. Product Boundary

```text
REFERENCE CREATION  → ChatGPT
ASSET AUTHORING     → Codex → BlockIT Gateway → BlockIT Runtime → Blockbench
PERSISTENT STATE    → workspace/active/<asset>/
FINAL USER REVIEW   → user inspects the live Blockbench result
```

The normal client still sees only the four stable Gateway tools:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Do not create a second Gateway, Standard/Extended authoring mode, PrimitiveAnything phase, provider route, or alternate Texturing/Animation path.

## 2. Reference Creation and Handoff

Reference-image generation belongs in **ChatGPT**, not normal Codex authoring.

Canonical board layout:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

The layout uses fixed normalized regions; image resolution may vary. No panel labels, borders, dimensions, or technical metadata are required in the pixels. The actual board remains the visual authority.

```text
SOURCE IMAGE + USER INTENT
→ ChatGPT creates canonical five-view board
→ user reviews/corrects
→ user approves
→ user sends the actual approved image to Codex
```

Handoff is intentionally simple:

```text
ACTUAL APPROVED REFERENCE IMAGE
+
USER MESSAGE
```

No JSON sidecar, ZIP, modelling blueprint, coordinate sheet, or manifest is required. An image explicitly sent by the user for modelling is treated as the **Approved Reference** unless the user marks it draft/not ready.

## 3. New Model Intake

Codex creates the **Active Workspace before the Blockbench project**, then performs one mandatory intake gate.

```text
Approved Reference arrives
→ create workspace/active/<asset>/
→ store reference + current continuity
→ no .bbmodel yet
→ REQUIREMENT GATE
```

Five fields are mandatory for a new model:

```text
1. Asset
2. Approved Reference
3. Dimensions — width × height × length in Minecraft blocks
4. Geometry Strategy — DIRECT | 3D_ASSISTED
5. Animation Required — YES | NO
```

The user is the authority for `Geometry Strategy`. Codex must **not infer, default, or auto-switch** strategy from object category, apparent complexity, failed modelling, or available tooling.

If fields are missing, ask for **all missing mandatory fields in one batch**. Ask follow-up only for fields still unresolved. Additional technical questions are allowed only when a material ambiguity would change the model.

```text
missing/conflicting required input
→ AUTHORING BLOCKED
→ ask user

all required input complete + non-conflicting
→ proceed automatically
```

There is no redundant “ready to start?” confirmation after the gate passes.

## 4. Create Blockbench Project

Only after the Requirement Gate passes:

```text
create Blockbench project
→ start GEOMETRY
```

Before this point there must be no authored `.bbmodel`, Cubes, Groups, Shape GLB generation, or PrimitiveAnything execution.

## 5. Stage Lifecycle and Approval

Each authored stage uses the same lifecycle:

```text
IN_PROGRESS
→ INTERNAL VERIFY
→ READY_FOR_USER_REVIEW
→ USER REVIEW IN LIVE BLOCKBENCH
   ├─ revision request → IN_PROGRESS
   └─ explicit “approve” → APPROVED
→ CHECKPOINT SAVE
→ next required stage
```

`INTERNAL VERIFY` is transient working state; persistent workspace stage state stays compact.

Codex must use actual current Blockbench state and internal visual captures when needed to understand what it authored. Internal captures are **not** the user approval surface. The user performs final stage judgement directly in Blockbench.

Codex must not send obviously unfinished or materially broken work to the user for approval. If the same material causal correction fails twice without new evidence, the stage becomes `BLOCKED`; Codex explains the blocker and requests user direction instead of looping or marking it ready.

`READY_FOR_USER_REVIEW` is not `APPROVED`. Only an explicit user approval advances the stage.

### Checkpoint policy

```text
Geometry APPROVED  → checkpoint save + workspace update
Texturing APPROVED → checkpoint save + workspace update
Animation APPROVED → checkpoint save + workspace update
```

Do not save/checkpoint after every mutation, capture, or successful tool call.

## 6. Geometry Strategy

There are exactly two user-selected Geometry strategies.

### 6.1 DIRECT

```text
Approved Reference + Dimensions + Requirements
→ normal BlockIT Geometry authoring
→ internal structural + visual verification
→ READY_FOR_USER_REVIEW
```

`DIRECT` is not synonymous with “simple” or “mechanical”. It means the user chose normal reference-guided Geometry without the 3D-Assisted preparation package.

### 6.2 3D_ASSISTED

`3D_ASSISTED` is **one indivisible Geometry package**:

```text
Approved Reference Board
→ deterministic LEFT / FRONT / BACK extraction
→ extraction validation
→ Shape Reconstruction
→ Shape GLB Gate
→ persist shape.glb
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ persist primitive-decomposition.json
→ dedicated Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ remove live Shape GLB reference
→ final Geometry internal verify
→ READY_FOR_USER_REVIEW
```

There is no normal GLB-only, PrimitiveAnything-only, user-supplied-GLB, skip-PrimitiveAnything, or automatic fallback path.

The architecture calls the first stage **Shape Reconstruction**. The v1 implementation is Hunyuan3D, but Hunyuan is not a user-facing route and v1 does not need a provider interface/router.

### 6.3 View extraction

The approved board is canonical authority. For 3D-Assisted, Codex/local tooling deterministically extracts the fixed normalized `LEFT`, `FRONT`, and `BACK` regions. `TOP` and `FRONT-LEFT 3/4` remain additional validation evidence.

Extraction must be validated for usable uncropped subject coverage. If extraction is unusable, do not invent a different crop, detect alternate panels, substitute another view, or continue with damaged input. `3D_ASSISTED` becomes `BLOCKED` and the user is asked to repair/regenerate the board in ChatGPT.

### 6.4 External 3D-Assisted orchestrator

Shape Reconstruction and PrimitiveAnything belong to **external local tooling controlled by Codex**, not the Blockbench Runtime.

Normal use has one thin canonical orchestrator:

```text
extract views
→ Shape Reconstruction
→ GLB Gate
→ persist valid GLB
→ PrimitiveAnything
→ Decomposition Gate
→ persist valid decomposition
→ READY_FOR_BLOCKBENCH_MATERIALIZATION
```

It must be resumable from the last valid gate. Individual Hunyuan/PrimitiveAnything scripts remain implementation/debug tools, not normal authoring steps.

Machine resume state lives only in:

```text
3d-assisted/state.json
```

It stores current reference identity/hash, gate state, canonical artifact identity/hash, and last valid external resume point. It is not a second project-state system and does not own Blockbench stage approval.

### 6.5 Canonical 3D-Assisted artifacts

Persistent:

```text
3d-assisted/state.json
3d-assisted/shape.glb
3d-assisted/primitive-decomposition.json
```

`shape.glb` is persisted only after Shape GLB Gate PASS. `primitive-decomposition.json` is persisted only after Primitive Decomposition Gate PASS. The Cuboid Scaffold is **not** a separate canonical file; after materialization it lives only as current Blockbench geometry.

Temporary renders, processed meshes, extraction crops, contact sheets, logs, and debugging output belong in `.cache/`.

If the Approved Reference changes, `Geometry Strategy` remains the user’s current choice, but dependent Shape GLB and decomposition artifacts are invalidated and removed from the canonical workspace. Git history owns older versions.

### 6.6 Internal gates

**Shape GLB Gate** evaluates structural 3D fidelity to the Approved Reference: identity, primary masses, required part count, attachment, major pose/orientation, useful depth/volume, and absence of material hallucination. It does not require Minecraft/blocky styling.

**Primitive Decomposition Gate** evaluates whether PrimitiveAnything preserves useful primary-mass separation, identity-critical parts, major orientations/bends, attachments, important negative spaces, and a decomposition useful for later scaffold cleanup. Primitive count alone is not a pass/fail threshold.

**Cuboid Materialization Gate** evaluates only faithful conversion from the accepted decomposition into native editable Blockbench `Group/Bone + Cube` scaffold: complete expected primitives, no missing/duplicate primitive, preserved translation/rotation/scale/spatial relationships, correct orientation, and no production Mesh elements. It does not judge final Minecraft quality.

No user approval is required at these internal gates. A failed internal gate blocks the 3D-Assisted package; it does not silently switch strategy.

### 6.7 Bounded retry

```text
Shape quality failure
→ initial generation + maximum one targeted regeneration
→ still fail = BLOCKED

PrimitiveAnything quality failure
→ no blind quality rerun
→ BLOCKED

confirmed transient technical/environment failure
→ maximum one safe retry when prior execution is known incomplete
→ same failure again = BLOCKED
```

### 6.8 Dedicated Blockbench materialization

Target production contract: one dedicated **Geometry** Runtime capability consumes the current Active Workspace, reads only the canonical validated `3d-assisted/state.json` + `primitive-decomposition.json`, and materializes the complete temporary scaffold.

It must not accept arbitrary primitive arrays or arbitrary decomposition file paths. Full schema/hash validation occurs before mutation. Materialization is one atomic reversible Blockbench Undo transaction: complete scaffold or no accepted scaffold state.

Each decomposition primitive initially becomes:

```text
pa_<id> [temporary Group/Bone]
└─ Cube
```

This preserves transform fidelity. Merge/simplify/semantic restructuring belongs later to Semantic Geometry Cleanup.

**Implementation status:** this dedicated production capability and the canonical external orchestrator are design-locked but not yet implemented/promoted in current Runtime source.

### 6.9 Semantic Geometry Cleanup

After Materialization PASS, Codex may substantially rewrite the scaffold:

```text
rename / reparent / merge / delete / split
resize / translate / rotate / replace
add missing Cubes
build semantic Groups/Bones
repair pivots and transform ownership
```

The scaffold is a starting hypothesis, not authority. Final authority remains user requirements + Approved Reference + requested dimensions + current Blockbench result.

During cleanup the passed Shape GLB may remain loaded as a locked, non-export supporting 3D reference. The Approved Reference Image remains visual authority. Remove the live GLB reference before final Geometry internal verification and before user review; keep the canonical GLB file in the workspace.

Cleanup is ready for final Geometry verify only when silhouette/primary parts/dimensions/attachments/orientation/hierarchy/editability/UV readiness are coherent and temporary `pa_*` structure has been removed or converted into meaningful production structure.

## 7. Geometry Readiness and Future Animation

Geometry must be designed for future editability regardless of `Animation Required`.

For every asset:

- use meaningful semantic hierarchy;
- isolate structurally distinct naturally movable parts;
- give those parts sensible transform/pivot ownership;
- avoid structures that would require destructive rebuild merely to animate later;
- do not build a speculative full rig when animation is not required.

If `Animation Required = YES`, Geometry must additionally be animation-ready before user Geometry approval: participating hierarchy, Groups/Bones, pivots, attachments, and transform ownership must support the required motion.

## 8. Texturing

After explicit Geometry approval and checkpoint save:

```text
switch to Texturing through Gateway
→ author UV/Texture/PBR state
→ internal technical + visual verify
→ correct material defects
→ READY_FOR_USER_REVIEW
→ user reviews live Blockbench
→ explicit approve
→ checkpoint save
```

A structural Geometry/UV blocker may reopen Geometry only when it is a material owner defect that prevents correct Texturing. Prevent upstream problems before handoff; do not bounce phases for optional improvements.

## 9. Animation

If `Animation Required = NO`, skip Animation after Texturing approval.

If `YES`:

```text
Texturing APPROVED
→ Animation
→ author motion
→ internal technical + visual verify/playback
→ READY_FOR_USER_REVIEW
→ user reviews live Blockbench
→ explicit approve
→ checkpoint save
```

Return to Geometry only for a material rig/pivot/hierarchy blocker. Do not reopen Geometry for an optional nicer structure.

## 10. Downstream Invalidation

An approved upstream stage may be reopened only when a downstream stage finds a **material blocker owned by that upstream stage**.

After an upstream correction, perform an impact check:

```text
downstream unaffected → keep APPROVED
downstream materially affected → INVALIDATED → repair → approval again
```

Invalidate the smallest dependent scope. Do not reset all downstream stages automatically.

## 11. Finalization

After every required authored stage is `APPROVED`:

```text
FINALIZATION
→ technical validation only
→ verify correct project/format/current dimensions
→ verify hierarchy/references/UV/textures/animation references
→ no live Shape GLB/reference_model
→ no unintended temporary/debug elements
→ workspace state consistent
```

Finalization must not silently change an approved visual/material result. If a material defect is found, reopen its exact owning stage, repair it, internally verify it, obtain user approval again, then return to Finalization.

If Finalization passes without material changes:

```text
Final Save
→ project status COMPLETE
→ remain in workspace/active/
```

No extra user approval is required after the last required stage approval. A completed project moves to `workspace/saved/` only on explicit user instruction.

## 12. Existing Model / Improvement Flow

```text
user supplies .bbmodel + requested change
→ recover known Active Workspace OR create one
→ if external/untracked: persist supplied .bbmodel as initial baseline before mutation
→ inspect current model
→ determine affected stage(s)
→ ask only material missing information
→ update smallest owning stage(s)
→ internal verify
→ user review/approval for affected stage(s)
→ checkpoint/finalization as applicable
```

Use one current editable `.bbmodel`; Git history owns older baselines.

An Approved Reference is required only when success depends on visual/fidelity judgement. Deterministic instructions such as explicit numeric movement, color change, or timing change may proceed from current model + explicit instruction alone.

For an existing tracked asset, reuse its stored Geometry Strategy even for a major Geometry overhaul. Codex may recommend another strategy but never switches it automatically.

For an external `.bbmodel` with unknown strategy:

```text
update does not touch Geometry → strategy may remain unknown
update touches Geometry        → STRATEGY_REQUIRED → ask user
```

### Strategy change

Only the user may change strategy.

Before current Geometry approval:

```text
user changes strategy
→ discard all unapproved Geometry from old strategy
→ if leaving 3D_ASSISTED, remove its current canonical artifacts/state
→ recreate Blockbench project from clean state using the same intake/workspace
→ start Geometry with new strategy
```

Active Workspace, Approved Reference, dimensions, animation requirement, and user constraints remain.

After Geometry has already been approved, keep the approved production Geometry. Persist the user’s new strategy for future Geometry work; do not destroy already approved geometry merely because the method changed.

## 13. Workspace Continuity

`workspace/README.md` is the canonical persistence contract. Active project README stores only current resume-critical state, including mandatory intake, strategy, stage states, current model, next step, and blocker. `3d-assisted/state.json` owns only machine-readable external 3D-Assisted gate/artifact state.

Do not store tool-call transcripts, screenshot histories, speculative plans, or duplicate versioned `.bbmodel` files.

## 14. Development Safety

Before adding capability or architecture, ask whether the requirement fits the existing model:

```text
Gateway
+ Active Workspace
+ DIRECT | 3D_ASSISTED Geometry Strategy
+ Geometry / Texturing / Animation
+ internal capability tier
```

If yes, do not add another route/profile/phase/client boundary/provider framework.

Current production source still lacks the target 3D-Assisted orchestrator/state contract and dedicated atomic scaffold materializer. Implement those exact missing owners before claiming 3D-Assisted production readiness. Live Gateway/Blockbench proof remains separate and must not be inferred from this design contract.
