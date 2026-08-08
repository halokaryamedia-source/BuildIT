# BlockIT — Product Overview

**Status:** Active Policy  
**Version:** 1.1  
**Updated:** 2026-08-08

## Purpose

BlockIT helps an AI modeller create or revise clean, editable Minecraft Bedrock
Entity models in Blockbench through MCP from an approved visual Modelling Brief.

The product is designed for users who can describe what they want without
knowing MCP, Blockbench internals, or professional 3D-modelling terminology.

## Primary Output

```text
<model-name>.bbmodel
```

The model should remain understandable and editable by a downstream Bedrock
modeller/developer.

## Problem BlockIT Solves

The main failure is not that MCP cannot create Cubes. The proven failure is that
an agent can create technically valid Cubes while the whole object is visually
wrong.

Typical failure patterns:

- Cubes are placed because they can fit or attach;
- existence/attachment is mistaken for approval;
- exact coordinates are guessed before a coherent 3D interpretation exists;
- rotation is added without a reference-visible slope/function reason;
- pivots/origins are distant or arbitrary;
- detail is added to hide a wrong primary form;
- tool/build/save success is reported as visual success.

## Product Goal

Turn a visual reference into a coherent Bedrock Cuboid model through the
shortest **evidence-backed** loop:

```text
Approved Modelling Brief
↓
Whole-form spatial reasoning
↓
Intentional primary Cube authoring
↓
Structural + visual observation
↓
Global/local diagnosis
↓
Causal correction
↓
Secondary structure only after primary form is sound
```

## Current Architecture

BlockIT uses the **Reference Fidelity Loop**:

1. verify cross-view consistency;
2. establish coordinate frame/front/ground and target envelope;
3. form a temporary Primary Form Hypothesis;
4. author the minimum coherent primary Cubes with explicit extents;
5. require intentional rotation/pivot where rotation is used;
6. inspect rendered bounds;
7. capture stable canonical model views;
8. compare reference ↔ model directly;
9. rebuild the hypothesis for global failure or inspect/correct the exact target
   for local failure;
10. add hierarchy, pivots, texture, and optional animation only when justified.

See [Modelling Workflow](03-modelling-workflow.md).

## Responsibility Split

### AI / Modeller

Owns visual and spatial judgement:

- whole-form interpretation;
- primary masses and relationships;
- proportion/silhouette/orientation decisions;
- global vs local failure classification;
- causal correction choice;
- visual approval.

### MCP / Blockbench Runtime

Owns deterministic mechanics:

- model/project observation;
- exact element mutation;
- UUID/parent targeting;
- Undo/recovery;
- camera capture;
- save/runtime operations where supported.

MCP does not automatically infer anatomy, reconstruct an image into Cuboids, or
issue visual `PASS`.

## Target User

Primary user:

- can provide a simple request and reference;
- may not understand Blockbench/MCP/3D modelling;
- expects the system to choose professional modelling steps without requiring an
  expert prompt.

Downstream user:

- Bedrock modeller/developer who needs a clean, editable `.bbmodel` rather than
  an opaque screenshot-only result.

## Success Criteria

BlockIT succeeds when:

- simple user intent can be converted into a clear modelling contract;
- approved reference drives visible form honestly;
- primary whole form is recognizable before detail expands;
- Cube placement/rotation/pivot decisions are intentional rather than defaults;
- structural evidence and visual evidence are kept separate;
- visual completion uses fresh current-revision evidence;
- required hierarchy/UV/texture/animation are purposeful;
- runtime capability is not claimed without appropriate proof;
- the final project remains editable and understandable.

## Product Constraints

- Source Image/reference pixels are not metric geometry calibration.
- Declared dimensions are the numeric target when available.
- A successful MCP call does not prove model quality.
- A saved file does not prove visual correctness or reopen fidelity.
- No automatic image→Cuboid reconstruction, SF3D, IoU, or similarity score is
  modelling authority.
- Local Blockbench behavior remains `LOCAL PROOF REQUIRED` until actually tested.

## Related

- [Product Requirements](02-product-requirements.md)
- [Reference Guide](04-reference-guide.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
