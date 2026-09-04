# BlockIT — Product Requirements

**Status:** Active Policy  
**Version:** 2.0  
**Updated:** 2026-09-05  
**Primary Output:** editable Minecraft Bedrock Entity `.bbmodel`

## 1. Product Objective

A user can create an approved Minecraft/Blockbench reference in ChatGPT, hand it to Codex with a normal message, choose the modelling strategy, and have BlockIT create or revise a clean Bedrock model through explicit stage approval without requiring the user to specify MCP/tool details.

The system must prefer evidence-backed modelling decisions over assumptions and must not silently change user-selected modelling strategy.

## 2. New-Model Required Input

Before Blockbench project authoring begins, a new model requires:

```text
Asset
Approved Reference Image
Requested Dimensions: width × height × length in Minecraft blocks
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

The user owns `Geometry Strategy`. Codex must not infer/default/auto-switch it.

If mandatory values are missing, ask for all missing values in one batch. Ask additional questions only when a material ambiguity would change the asset. Complete, non-conflicting intake authorizes Blockbench project creation without another confirmation step.

## 3. Reference Handoff

Reference-image creation belongs in ChatGPT. Canonical board:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

Normal handoff is only:

```text
actual approved reference image + user message
```

No sidecar JSON, ZIP, manifest, coordinate sheet, or modelling blueprint is required. An image explicitly handed to Codex for modelling is approved unless the user marks it draft/not ready.

## 4. Canonical New-Model Flow

```text
Approved Reference handed to Codex
↓
Active Workspace created
↓
Requirement Gate
↓
create Blockbench project
↓
Geometry using user-selected DIRECT or 3D_ASSISTED
↓
Codex internal verify
↓
READY_FOR_USER_REVIEW
↓
user inspects live Blockbench and explicitly approves
↓
checkpoint save
↓
Texturing
↓
internal verify → user approve → checkpoint save
↓
Animation only when required
↓
internal verify → user approve → checkpoint save
↓
Finalization technical gate
↓
final save → COMPLETE
```

A completed asset remains active until the user explicitly archives it.

## 5. Geometry Strategies

### DIRECT

Normal reference-guided semantic Geometry using native Blockbench Groups/Cubes.

### 3D_ASSISTED

One indivisible package:

```text
Approved Reference
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ deterministic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ final Geometry internal verify
```

There is no normal GLB-only, PrimitiveAnything-only, user-supplied-GLB, provider-selection, or automatic fallback route.

Architecture term: `Shape Reconstruction`. Hunyuan3D is the single v1 implementation; do not add a provider framework until another real implementation is required.

### 3D-Assisted authority

```text
Approved Reference  → visual authority
Requested Dimensions → numeric authority
Shape GLB            → intermediate reconstructed shape
PrimitiveAnything    → intermediate decomposition
Cuboid Scaffold      → editable starting hypothesis
```

Neither GLB nor scaffold is final model authority.

## 6. Internal Readiness vs User Approval

Codex must understand and validate what it authored before requesting review. Internal validation may use current Blockbench state, focused structural reads, and fresh model captures; those captures are for Codex and do not need to be shown to the user.

Use `inspect_model_bounds` only when the numeric whole-model envelope materially matters.

```text
material defect remains → correct internally
same causal correction fails twice without new evidence → BLOCKED
no material blocker remains → READY_FOR_USER_REVIEW
```

Only explicit user approval advances the stage. User reviews the live Blockbench result directly.

## 7. Geometry Quality / Editability

Geometry must preserve recognizable whole form/proportions, requested dimensions, required parts/count/orientation/attachments, important negative spaces, semantic hierarchy/transform ownership, UV readiness, and future editability.

Naturally movable, structurally distinct parts should remain separately transformable even for a static model, without speculative full rigging.

When `Animation Required = YES`, participating hierarchy/Bones/pivots/attachments must be animation-ready before Geometry user approval.

## 8. Texturing

Texturing starts only after Geometry is explicitly approved and checkpointed. Texture must not conceal unresolved Geometry. Codex internally verifies UV/atlas/material/identity readability before user review; user approval is required before advancing.

## 9. Animation

Animation is authored only when `Animation Required = YES`. Required motion must use the prepared Geometry hierarchy/pivots, remain attached/readable, and be internally verified before user review. A material rig/pivot/hierarchy blocker reopens Geometry at the exact owner.

## 10. Downstream Invalidation

An approved upstream stage reopens only for a material blocker owned by that stage. After correction, invalidate only downstream approvals materially affected by the change.

```text
unaffected downstream stage → keep APPROVED
affected downstream stage   → INVALIDATED → repair → user approval again
```

## 11. Finalization / Save

Stage approval triggers checkpoint save. After the last required authored stage is approved, run one technical Finalization gate.

Finalization checks format/current dimensions/references/hierarchy/UV/textures/animation references and absence of unintended temporary/debug state. It must not silently change an approved visual result.

A material Finalization defect reopens its exact owner stage and requires user approval again. If Finalization passes without material change, final save happens automatically; no extra user approval is needed.

## 12. Existing Model Update

```text
recover/create Active Workspace
→ if untracked, persist supplied .bbmodel as current baseline before mutation
→ inspect current model
→ determine affected stage(s)
→ ask only material missing information
→ update smallest owning stage(s)
→ internal verify
→ user approval for affected stage(s)
→ Finalization
```

Reference is required only when success depends on visual/fidelity judgement. A tracked model reuses its stored Geometry Strategy. An untracked external model needs strategy only if Geometry authoring is required. Only the user may change strategy.

## 13. 3D-Assisted Production Requirements

External Shape Reconstruction + PrimitiveAnything belong to local tooling controlled by Codex. Target normal use is one thin resumable orchestrator, not a workflow engine/provider router.

```text
workspace/active/<asset>/3d-assisted/
├─ state.json
├─ shape.glb
└─ primitive-decomposition.json
```

Passed artifacts persist gate-by-gate. A changed Approved Reference removes derived current GLB/decomposition while preserving user-selected strategy.

Target Blockbench materializer is one dedicated Geometry capability behind the existing Gateway. It validates canonical workspace state before mutation and materializes complete scaffold as one atomic Undo transaction. Do not use generic `from_geo_json` or arbitrary primitive payloads.

## 14. Efficiency / Anti-Overdevelopment

- one Gateway;
- two Geometry strategies only;
- no automatic strategy classifier;
- one current editable `.bbmodel` per asset;
- Git history owns old revisions;
- targeted internal captures, not screenshot-per-mutation;
- deferred focused capability discovery;
- no provider framework with one provider;
- no generic importer for a dedicated scaffold contract;
- same causal failure twice without new evidence → stop;
- invalidate smallest downstream scope.

## 15. Proof Boundary

Static source/docs/CI cannot prove live Blockbench behavior, visual quality, external GPU pipeline quality, materializer Undo behavior, or Gateway lifecycle stability. Those remain local/live proof until deliberately tested.
