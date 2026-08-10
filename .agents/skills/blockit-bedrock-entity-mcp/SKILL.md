---
name: blockit-bedrock-entity-mcp
description: Mandatory orchestrator for using the BlockIT MCP to create, revise, texture, animate, inspect, validate, or export Minecraft Bedrock Entity assets in Blockbench. Route modelling judgement to blockbench-bedrock-modelling, texture/Paint/PBR/material-instance work to blockit-bedrock-texturing, and animation work to blockit-bedrock-animation. Do not use generic Mesh, Hytale, risky evaluation, arbitrary UI automation, or non-Bedrock project formats as substitutes.
---

# BlockIT Bedrock Entity MCP

Use this skill before substantive BlockIT MCP asset work. It owns **workflow orchestration and tool-surface discipline**, not the artistic judgement of the modelling specialist.

## Product Boundary

- Target Blockbench format: `bedrock` (Minecraft Bedrock Entity).
- Normal geometry: Cubes/Cuboids organized by Groups/bones.
- Preserve native Bedrock capabilities even when their direct MCP mapping is incomplete.
- Generic Blockbench Mesh, Hytale, arbitrary project formats, and arbitrary model codecs are not compatibility requirements.
- `risky_eval` and `from_geo_json` are quarantined; do not design a workflow around them.
- `capture_app_screenshot` and arbitrary `set_camera_angle` are not normal BlockIT observation paths.

## Route By Intent

| Intent | Specialist |
|---|---|
| Whole-form interpretation, Cube geometry, hierarchy/pivot judgement, silhouette/proportion correction | `blockbench-bedrock-modelling` |
| Texture creation/application, Paint, layers/selections, PBR TextureGroups, per-face material instances | `blockit-bedrock-texturing` |
| Bedrock BoneAnimator transforms, keyframes, curves, rigs, particle effects, animation inspection | `blockit-bedrock-animation` |
| Plugin/runtime implementation defect | `blockbench-runtime-development` |
| MCP server/schema/registration implementation | `mcp-server-development` |

Load every relevant domain specialist before a multi-domain task, but keep one domain responsible for each decision.

## Stage-Gated Tool Routing

Do not treat the exposed MCP catalog as a checklist. Choose the smallest tool lane that answers the current modelling decision and stay in that lane until a concrete stage/intent requires branching.

Normal **reference-driven geometry lane**:

```text
project        get_project_info / create_project
orient/find    list_outline / find_elements_by_criteria
build          place_cube / add_group
whole-form     inspect_model_bounds / capture_model_views
local correct  inspect_element -> modify_cube / modify_cubes_batch
remove         remove_element only after MERGE/REMOVE diagnosis
recover        undo; save_checkpoint only before meaningful risky multi-step rework
finish         export_model only when a deliverable/explicit artifact is requested
```

Branch only when the task actually enters that domain:

```text
texture / UV / Paint / PBR / material_instance -> blockit-bedrock-texturing
animation / keyframes / particle effects        -> blockit-bedrock-animation
Locator / Null Object                           -> explicit attachment/effect need
selection helpers                               -> only when an editor-selection workflow requires them
duplicate_element                               -> only after repetition/symmetry is reference/design-backed
capture_screenshot                              -> only when the current editor view itself is evidence
validator resources                             -> structural diagnostics, never resemblance approval
```

Do not call specialist tools merely because they are available. Texture, Paint, animation, material-instance, Locator, selection, validator, and export work must not interrupt an unresolved primary-geometry `FAIL`/`UNVERIFIED` state.

## Downstream Readiness Gate

Do not let downstream work create false completion confidence.

For an **end-to-end reference-driven asset**:

- production texture/UV/PBR/material work starts only after the complete geometry review is `PASS` for the geometry that surface work depends on;
- production animation starts only after the geometry baseline for the requested motion is accepted and the participating Group/bone hierarchy and pivots are inspected and suitable;
- a material geometry `FAIL` returns to modelling before downstream production work;
- a material geometry claim that remains `UNVERIFIED` and is required by the downstream work must be resolved or reported `BLOCKED`; do not cover it with texture or motion.

For an **existing-asset texture-only or animation-only task**, the current model may be treated as the user-provided baseline when geometry fidelity is outside the requested scope. This does **not** upgrade that geometry to `PASS`. Inspect only the prerequisites needed by the requested domain, and report a concrete geometry/hierarchy blocker if one prevents valid work instead of silently expanding into speculative remodelling.

Temporary aids are allowed only when their purpose is explicit:

- a flat/placeholder texture may be used to make geometry readable during observation;
- a small diagnostic pose/playback may be used to test a pivot or rig relationship.

These aids are provisional/disposable and are never production texture/animation progress or completion evidence.

If material geometry, hierarchy, or pivots change after downstream work has begun, revalidate the affected downstream state. Changed Cube surfaces can stale UV/texture/material assumptions; changed bones/pivots can stale animation keyframes, attachments, and motion arcs. Do not preserve wrong geometry merely because texture or animation work already exists.

## Preflight

1. Call `get_project_info` before mutation when an existing project is open.
2. If no project exists and creation is requested, use `create_project`; BlockIT accepts only `bedrock`.
3. Confirm the intended project is actually `bedrock`. Do not silently convert another format.
4. Inspect only the state needed for the next decision:
   - Cube/Group structure: `list_outline`, `find_elements_by_criteria`, `inspect_element`;
   - Locator/Null Object structure: `list_locator_elements`, then `inspect_element`;
   - textures/materials: `list_textures`, `get_texture`, `list_materials`, `get_material_info`;
   - animation: `inspect_animation`;
   - whole-form envelope: `inspect_model_bounds`.
5. Prefer exact UUIDs after discovery. Exact unique names are a convenience, not a durable identity contract.

## Mutation Discipline

- For three or more material mutations, or any risky multi-step rework, create a `save_checkpoint` first when recovery value is meaningful.
- Use `modify_cube` for one diagnosed Cube correction.
- Use `modify_cubes_batch` only when one causal correction genuinely spans several explicit Cube UUIDs.
- Use `manage_locator` for native Bedrock Locator parent/position/rotation/`ignore_inherited_scale` authoring under an explicit Group/bone.
- Use `manage_null_object` only for base Null Object parent/position authoring. Its IK metadata is inspectable but intentionally not mutated by this minimum capability owner.
- Use existing `rename_element` / `remove_element` for Locator/Null Object rename/delete instead of inventing duplicate tool paths.
- Do not use selection as an implicit mutation target when a tool supports explicit identity.
- Do not compensate for a wrong primary form with extra detail, texture, or animation.
- Use `undo`/`redo` rather than generic UI actions.

## Observation Discipline

For reference-driven modelling:

- use `inspect_model_bounds` for structural envelope facts;
- use `capture_model_views` for deterministic labeled views with explicit `front_direction`;
- use `capture_screenshot` only when the current editor view itself is useful;
- successful capture or validator execution is observation evidence, not a resemblance PASS.

For Locator/Null Object work, re-read the exact element with `inspect_element` after mutation. A Null Object is not interchangeable with a normal Locator: Blockbench uses a `_null_` locator-entry convention for Bedrock geometry round-trip while its IK metadata remains editor/animation state.

## Protected Native Capability Gaps

If a request needs a native Bedrock capability that has no direct exposed authoring/inspection tool, **stop at the capability boundary rather than synthesizing a fake substitute**.

Protected examples currently include direct authored-state owners for:

- TextureMesh;
- native visible bounding-box fields;
- animation controllers;
- sound/timeline animation effects;
- animated-texture authoring;
- bone-binding expressions.

Do not emulate these with generic Mesh, arbitrary Cubes, `risky_eval`, UI clicks, or another model format. Existing data should be preserved where the normal project/Bedrock codecs preserve it. Record the gap for MCP implementation audit.

## Visual Verdict Boundary

For reference-driven modelling, route visual judgement to `blockbench-bedrock-modelling` and require its `FAIL / UNVERIFIED / PASS` Reference Fidelity Verdict. Missing reference/view evidence means UNVERIFIED for that claim, not PASS. Do not let successful MCP execution, bounds, hierarchy, or validator output upgrade the visual verdict.

## Blocker Escalation

Do not convert persistent failure into repeated tool calls. `BLOCKED` is the correct task outcome when the current evidence/capability cannot support a valid result.

For modelling, stop and report `BLOCKED` when `blockbench-bedrock-modelling` reaches its cross-view/runtime/loop-stop threshold. Keep `FAIL / UNVERIFIED / PASS` for visual verdicts; do not use them to hide an execution/reference blocker.

A blocker report must identify the blocker, the evidence or tool failure that proves it, what cannot be validated, what bounded attempts were made, and what specifically is needed to unblock. Do not continue speculative mutation after that point.

## Texture And PBR Boundary

Native Bedrock PBR and per-face `material_instance` are valid BlockIT capabilities. Route those tasks to `blockit-bedrock-texturing`; do not classify them as generic Mesh/PBR shortcuts.

## Animation Boundary

Route animation work to `blockit-bedrock-animation`. Particle effects are directly mapped today. Do not invent sound/timeline/controller authoring through generic actions when no direct owner exists.

## Export

Export only when the user wants a deliverable or an explicit validation artifact.

`export_model` supports:

- `bedrock` — native Minecraft Bedrock geometry JSON;
- `project` — editable Blockbench `.bbmodel`.

Do not ask for OBJ/glTF as an intermediate escape hatch for normal Bedrock Entity work. Bedrock animation/controller file ownership is separate from generic model export.

## Completion

A task is complete only when the relevant state is re-observed after mutation. For reference-driven geometry this means fresh visual comparison; for texture/animation work, use the domain specialist's verification checks. Never report live Blockbench proof from source/CI evidence alone.
