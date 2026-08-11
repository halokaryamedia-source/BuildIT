---
name: blockit-bedrock-entity-mcp
description: Lightweight orchestrator for BlockIT Minecraft Bedrock Entity asset authoring. Route geometry judgement to blockbench-bedrock-modelling, texture/Paint/PBR/material-instance work to blockit-bedrock-texturing, and animation/keyframe work to blockit-bedrock-animation while keeping MCP calls and loaded context minimal.
---

# BlockIT Bedrock Entity MCP

Use for **asset authoring**, not plugin/repository development. Target Blockbench `bedrock`; normal geometry is Cubes organized by Groups/bones.

## Route By Stage

Load specialists lazily. Load only the owner of the current decision:

```text
geometry / silhouette / hierarchy / pivots → blockbench-bedrock-modelling
texture / Paint / PBR / material_instance  → blockit-bedrock-texturing
animation / keyframes / particles           → blockit-bedrock-animation
```

A reproduced MCP/plugin defect leaves asset authoring and becomes repository work.

## Tool Lane Discipline

The catalog is capability, not a checklist.

```text
project  → get_project_info / create_project only when state is unknown or needed
find     → list_outline / find_elements_by_criteria only when identity is unknown
build    → place_cube / add_group; batch only coherent known geometry
observe  → capture_model_views; bounds only for numeric envelope/scale/ground questions
correct  → inspect_element only when exact state is needed → modify_cube / modify_cubes_batch
recover  → undo; save_checkpoint only for meaningful risky rework
finish   → export_model only when a deliverable is requested
```

Selection, duplication, validator resources, current-view screenshots, Locator/Null Object tools, and other branch helpers stay branch-only unless the current task requires them.

## Minimum Necessary Evidence

- Reuse state returned by creation/mutation instead of rereading it by ritual.
- `create_project` and path-writing `export_model` already return lifecycle state. **Do not immediately call `get_project_info`** unless missing fields or external change matter.
- **Do not inspect every newly placed Cube.** Use `inspect_element` for a diagnosed target, ambiguous identity, or numeric correction state.
- **Do not capture after every mutation.** Capture at a meaningful gate; after a local correction, capture only affected reference-corresponding view(s).
- **Use `inspect_model_bounds` only when** numeric envelope, scale, ground, displacement, or gross placement is the current question.
- `UNVERIFIED` is not a retry command; seek more evidence only when it can change the decision.
- **Mutation count alone is not a checkpoint trigger.** Checkpoint only when rollback value is meaningful.

## Mutation / Result Discipline

Successful mutation proves execution, not resemblance. Prefer exact UUIDs for destructive geometry operations.

`modify_cube` / `modify_cubes_batch` already return before/after and `geometry_effect`; do not immediately add `inspect_element` unless additional state is needed. `manage_locator` and `manage_null_object` already return resulting authored state. **Do not automatically re-read them with `inspect_element`** unless the returned state is insufficient, stale, or inconsistent.

Batch only one coherent decision spanning known targets. Do not batch unknown geometry merely to reduce calls.

## Visual / Blocker Boundary

Reference fidelity belongs to `blockbench-bedrock-modelling` and uses difference-first **`FAIL / UNVERIFIED / PASS`**. Tool success, bounds, hierarchy, or validator success cannot upgrade the verdict.

Use **`BLOCKED`** when valid continuation requires unsupported evidence/capability or repeated speculative correction. **Do not continue speculative mutation** merely to avoid a blocker.

## Downstream / Export

For end-to-end reference work, production texture waits for the geometry it depends on to pass; production animation waits for accepted participating geometry/hierarchy/pivots. Existing-asset texture-only or animation-only tasks may treat current geometry as the user baseline without certifying it.

`export_model` supports: Bedrock geometry JSON (`bedrock`) and editable `.bbmodel` (`project`). When writing a path, prefer metadata-only output unless returned file content is actually required.

Missing native capability must remain explicit rather than being emulated through generic Mesh, `risky_eval`, arbitrary UI automation, Hytale, or another format.
