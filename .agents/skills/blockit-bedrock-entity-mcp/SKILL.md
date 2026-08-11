---
name: blockit-bedrock-entity-mcp
description: Lightweight orchestrator for BlockIT Minecraft Bedrock Entity asset work in Blockbench. Route whole-form/Cube judgement to blockbench-bedrock-modelling, texture/Paint/PBR/material-instance work to blockit-bedrock-texturing, and animation/keyframe work to blockit-bedrock-animation. Keep MCP calls and loaded context minimal without weakening visual validity.
---

# BlockIT Bedrock Entity MCP

Use this skill for **asset authoring**, not repository/plugin development. Target Blockbench format `bedrock`; normal geometry is Cubes organized by Groups/bones. Preserve native Bedrock capability and never substitute generic Mesh, Hytale, `risky_eval`, arbitrary UI automation, or another format for a missing native owner.

## Route By Intent

Load specialists lazily. Start with the one that owns the current decision; do not preload texture or animation because the user eventually wants them.

```text
geometry / silhouette / hierarchy / pivot judgement -> blockbench-bedrock-modelling
texture / UV / Paint / PBR / material_instance       -> blockit-bedrock-texturing
animation / keyframes / particles                    -> blockit-bedrock-animation
```

A proved plugin/API/MCP defect leaves asset authoring and becomes repository work under the corresponding engineering owner.

## Stage-Gated Tool Routing

The catalog is capability, not a checklist. Normal reference-driven geometry lane:

```text
project       get_project_info / create_project only when project state is unknown/needed
find          list_outline / find_elements_by_criteria only when identity/state is unknown
build         place_cube / add_group; batch coherent primary Cubes when already known
observe       capture_model_views; inspect_model_bounds only for numeric envelope/scale/ground questions
correct       inspect_element -> modify_cube / modify_cubes_batch only on a diagnosed mismatch
recover       undo; save_checkpoint only before meaningful risky rework
finish        export_model only when a deliverable is requested
```

Branch-only tools stay branch-only: selection for real editor-selection workflows, `duplicate_element` only for established repetition/symmetry, validator resources for structural diagnostics, `capture_screenshot` only when the current editor view itself matters, Locator/Null Object only for an actual attachment/effect need.

If no current decision requires a branch, stay in the geometry lane.

## Minimum Necessary Evidence

Strict claims do not require ritual calls.

- Do not re-read state this workflow just created or already knows unless it may have changed.
- `create_project` and path-writing `export_model` already return lifecycle state. Do not immediately call `get_project_info` after them unless you need fields they do not return (resolution/counts/root groups) or external state may have changed.
- Do not inspect every newly placed Cube. `inspect_element` is for a diagnosed target, ambiguous identity, or exact authored state needed for correction.
- Do not capture after every mutation. Capture at a meaningful gate; after a local correction, capture only affected reference-corresponding view(s).
- Use `inspect_model_bounds` only when approved numeric dimensions/envelope exist or scale, ground, displacement, or gross placement is the current question.
- `UNVERIFIED` is not a retry command. Seek more evidence only when it can change the decision and is plausibly obtainable.
- Mutation count alone is not a checkpoint trigger. Checkpoint only when rollback value is meaningful.
- Keep progress reporting compact.

## Mutation / Result Discipline

Successful mutation proves authored execution, not resemblance. Use exact identities for destructive geometry operations. `modify_cube` / `modify_cubes_batch` already return before/after and `geometry_effect`; do not add a redundant `inspect_element` after them unless additional state is genuinely needed.

`manage_locator` and `manage_null_object` already return their resulting authored state. Do not automatically re-read them with `inspect_element`; re-inspect only if another required field is missing, state may have changed externally, or the returned result is inconsistent with the intended mutation.

Batch operations only when one coherent, already-understood decision spans multiple targets. Do not batch unknown geometry merely to reduce calls.

## Visual / Blocker Boundary

Reference-driven geometry judgement belongs to `blockbench-bedrock-modelling` and must use its difference-first `FAIL / UNVERIFIED / PASS` Reference Fidelity Verdict. Successful MCP execution, valid bounds, hierarchy, or validator output cannot upgrade the visual verdict.

`BLOCKED` is the correct outcome when valid continuation requires unsupported evidence/capability or repeated speculative correction. Do not continue speculative mutation to avoid reporting a blocker.

## Downstream Readiness

For end-to-end reference-driven work:

- production texture/UV/PBR/material work starts after required geometry is `PASS`;
- production animation starts after the required geometry baseline and participating hierarchy/pivots are suitable;
- material geometry `FAIL` returns upstream;
- required unresolved `UNVERIFIED` becomes `BLOCKED`, not hidden by texture/motion.

For an existing-asset texture-only/animation-only task, current geometry may be the user-provided baseline when remodelling is outside scope; this does **not** upgrade that geometry to `PASS`.

A flat/placeholder texture or diagnostic pose/playback may be provisional/disposable evidence only. If geometry/hierarchy/pivots later change, revalidate only affected downstream state.

## Protected Native Capability Gaps

Current protected gaps include TextureMesh authored-state ownership, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated-texture authoring, and bone-binding expressions. Do not fake them. Native Bedrock PBR and per-face `material_instance` are valid supported domains.

## Export / Completion

`export_model` supports:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

When writing to a path, prefer metadata-only response unless returned file content is explicitly needed. Completion requires fresh evidence for the relevant state: visual comparison for reference geometry, or the active specialist's domain verification for texture/animation. Source/CI evidence is never live Blockbench proof.
