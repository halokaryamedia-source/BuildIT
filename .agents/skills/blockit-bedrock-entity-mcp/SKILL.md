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
