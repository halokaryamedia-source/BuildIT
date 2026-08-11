# Implementation Map

Updated: 2026-08-12

Use this note to answer **where current `Local` behavior lives**. It is a source-ownership map, not a task tracker.

## Primary owners

| Boundary | Current owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable project facts | root `CONTEXT.md` |
| current repository continuation | `docs/knowledge/next-action.md` |
| completed local procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |
| product/modelling policy | `docs/foundation/` |
| MCP public/runtime implementation | `mcp/` source + `mcp/AGENTS.md` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR | `.agents/skills/blockit-bedrock-texturing/` |
| animation | `.agents/skills/blockit-bedrock-animation/` |

## MCP source areas

| Area | Owns |
|---|---|
| `mcp/index.ts` | plugin entry/lifecycle wiring |
| `mcp/server/` | MCP server, transport, tools, resources, prompts |
| `mcp/server/tools/` | authored model/project/texture/animation operations |
| `mcp/lib/` | schemas, factories, runtime helpers, result normalization |
| `mcp/ui/` | Blockbench panel/settings |
| `mcp/prompts/` | bundled prompt sources |
| `mcp/build/` | build/docs generation |
| `mcp/tests/` | contract/integration regression gates |
| `mcp/docs/` | generated API docs; secondary to source |

## Current default MCP surface

Accepted pinned-SDK baseline:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

These are static measurements, not model-visible token measurements.

## Bedrock authoring ownership

### Project / observation

- `create_project`, `get_project_info` → Bedrock project/lifecycle state. `get_project_info` uses a bounded top-level Group summary.
- `inspect_model_bounds` → rendered Cube envelope evidence.
- `capture_model_views` → bounded canonical model views.
- `capture_screenshot` → current editor view only.

### Geometry / hierarchy

- `place_cube` → finite Bedrock Cube creation.
- `modify_cube`, `modify_cubes_batch` → correction with structural effects.
- `add_group` → Group/bone creation.
- `list_outline`, `find_elements_by_criteria`, `inspect_element` → bounded discovery/inspection. Normal defaults are intentionally compact and can be raised explicitly.
- rename/remove/duplicate/history → utility/recovery paths.

### Texture / surface

- `create_texture`, `activate_texture`, `list_textures`, `get_texture` → Bedrock single-texture lifecycle/evidence.
- Painter tools → pixel edits.
- TextureGroup/PBR tools → native PBR state.
- material-instance tools → per-face `material_instance` metadata.

Generic `apply_texture` and raw `filter_by_material` are not default Bedrock callable concepts.

### Animation

Animation tools own identity, inspection, keyframes, graph/batch/copy operations, rigging, and playback/timeline controls where mapped. Controllers and unsupported sound/timeline-effect authoring remain protected gaps.

### Locator / Null Object

Direct Elements-family ownership includes `list_locator_elements`, `manage_locator`, `manage_null_object`, `inspect_element`, `rename_element`, and `remove_element`.

### MCP result representation

`mcp/lib/factories.ts` owns request-owned result normalization. Exact single-text JSON mirrors of `structuredContent` are replaced by a short summary while canonical structured data, meaningful text, and images are preserved.

## Static cleanup boundary

Current repository work is **static pre-local efficiency cleanup**. Source-provable issues may be changed now, including duplicate payloads, oversized normal read defaults, stale/current-state contradictions, and repeated active instructions with an existing owner.

Do **not** use this phase to infer or redesign around client-only behavior such as:

- whether all 62 schemas are injected;
- deferred/native tool search behavior;
- prompt/skill co-loading;
- actual token/latency cost or retry frequency.

Those become validation questions only after static cleanup is complete. No new local run is currently active.

## Protected native gaps

- TextureMesh direct authoring/inspection;
- native visible bounding-box fields;
- animation controllers;
- animation sound/timeline effects;
- animated-texture authoring;
- bone-binding expressions.

Do not fake these with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, or another format.

Current proof status: [Validation Report](../foundation/validation-report.md).  
Current execution state: [Next Action](next-action.md).
