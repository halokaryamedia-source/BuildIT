# Bedrock Entity Capability Surface Matrix

Updated: 2026-08-11  
Status: current capability guardrail; live integration remains subject to Local Acceptance

This matrix prevents capability pruning from being mistaken for optimization. Absence from the default route or a missing direct owner is **not evidence that the native Bedrock capability may be removed**. A native capability that is missing or partially mapped is a protected gap, not permission to replace it with generic Mesh/UI/risky-eval behavior.

Primary current owners:

- official Blockbench Bedrock source/docs for native capability semantics;
- `mcp/lib/registrationProfile.ts` for default registration families;
- `mcp/server/` for current tools/resources/prompts;
- `docs/foundation/validation-report.md` for proof state;
- `docs/knowledge/operations/local-acceptance-runbook.md` for live verification.

## Matrix

| Bedrock Entity capability | Current BlockIT owner/mapping | Current state |
|---|---|---|
| Project format/lifecycle | `create_project`, `get_project_info`, `export_model` | mapped/narrowed; local persistence proof required |
| Cube/Cuboid geometry | `place_cube`, `modify_cube`, `modify_cubes_batch`, `inspect_element` | strong mapping |
| Group hierarchy/bones | `add_group`, rigging tools, outline/inspection | strong mapping |
| Cube UV / box UV / face UV | Cube authoring state + texture workflow | retained Bedrock capability; do not replace with generic Mesh UV |
| Texture lifecycle | `create_texture`, `activate_texture`, `list_textures`, `get_texture` | mapped/narrowed for native `single_texture` |
| Painter | Paint family | mapped; runtime-heavy/local proof required |
| PBR / TextureGroup | texture/PBR family | mapped; preserve native Bedrock behavior |
| Per-face `material_instance` | material-instance family | mapped native Bedrock metadata |
| Animation / BoneAnimator | animation create/inspect/keyframe/graph/batch/playback tools | mapped; live playback proof required |
| Particle animation effects | mapped animation effect state | mapped where current source owns it |
| Sound/timeline animation effects | no complete direct owner | **MCP GAP — protected** |
| Animation controllers | no direct current authoring owner | **MCP GAP — protected** |
| Locators | `manage_locator`, `list_locator_elements`, `inspect_element`, rename/remove | **Mapped / local proof required** |
| Null Objects in Bedrock workflow | `manage_null_object`, `inspect_element`, rename/remove | **Mapped base state / IK mutation deferred** |
| TextureMesh | no direct current authoring/inspection owner | **MCP GAP — protected**; distinct from generic Mesh |
| Native Bedrock bounding-box fields | no direct full authored-state owner | **MCP GAP — protected**; `inspect_model_bounds` is observation, not field authoring |
| Animated textures | partial metadata visibility, no complete authored workflow proven | **MCP GAP — protected** |
| Bone binding expression | no direct current owner | **MCP GAP — protected** |
| Editable project output | `export_model(codec_id=project)` | mapped; save/reopen local proof required |
| Bedrock geometry output | `export_model(codec_id=bedrock)` | mapped/narrowed |
| Export-format discovery | `list_export_formats` definition retained but default-disabled | not needed in normal authoring; codecs are explicit |
| Undo/history | history + mutation transaction owners | mapped; live Blockbench Undo proof required |
| Validator evidence | validator resources | support evidence only, never visual approval |
| Canonical visual observation | `capture_model_views`, `inspect_model_bounds`, focused inspection | mapped BlockIT workflow support |
| Generic `nodes://{id}` observation | transitional resource | **Transitional / deferred** while direct TextureMesh inspection remains absent |
| Reference Models integration | conditional resource | optional external integration, not baseline Bedrock capability |

## Default-surface semantics

Current pinned-SDK baseline:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Explicit containment:

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

`apply_texture` is not default-callable because Bedrock Entity is a native `single_texture` format and generic per-face texture application is not the owner of effective texture selection. `filter_by_material` is not default-callable because raw face texture identity is likewise not the effective Bedrock texture selector. Native per-face differentiation remains `material_instance`.

## Protected-gap rule

Protected native gaps currently include:

```text
TextureMesh direct authoring/inspection
Native Bedrock bounding-box fields
Animation controllers
animation sound/timeline effects
Animated textures
Bone binding expression
```

When one becomes necessary, first reproduce the real workflow need and verify native Blockbench semantics. Do not reintroduce generic Mesh, arbitrary Cube substitutes, risky evaluation, UI automation, or another format as a shortcut.

## Current next boundary

There is **no next source-reduction slice implied by this matrix**. The current next step is the repository's Local Acceptance Runbook. Use live failures to decide whether any mapped capability needs correction or any protected gap becomes an actual product requirement.

## Related

- [Validation Report](../../foundation/validation-report.md)
- [Implementation Map](../implementation-map.md)
- [Review Index](review-graph.md)
- [Local Acceptance Runbook](../operations/local-acceptance-runbook.md)
