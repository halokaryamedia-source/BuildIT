# Implementation Map

Updated: 2026-08-12

Use this note to answer **where current `Local` behavior lives**. It is a source-ownership map, not a task tracker.

## Primary owners

| Boundary | Current owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable project facts | root `CONTEXT.md` |
| current repository continuation | `docs/knowledge/next-action.md` |
| completed local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |
| product/modelling policy | `docs/foundation/` |
| MCP public/runtime implementation | `mcp/` source + `mcp/AGENTS.md` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR | `.agents/skills/blockit-bedrock-texturing/` |
| animation | `.agents/skills/blockit-bedrock-animation/` |
| project/reference fixtures | `workspace/` |

## MCP source areas

| Area | Owns |
|---|---|
| `mcp/index.ts` | plugin entry/lifecycle wiring |
| `mcp/server/` | MCP server, transport, tools, resources, prompts |
| `mcp/server/tools/` | authored model/project/texture/animation operations |
| `mcp/lib/` | shared schemas/factories/runtime helpers and request-owned result normalization |
| `mcp/ui/` | Blockbench panel/settings |
| `mcp/prompts/` | bundled prompt sources |
| `mcp/build/` | build/docs generation |
| `mcp/tests/` | contract/integration regression gates |
| `mcp/docs/` | generated API docs; secondary to source |

## Current default MCP surface

Pinned-SDK accepted baseline:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Default containment:

```text
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

These character counts are static measurements, not proof of model-visible token cost.

## Current Bedrock authoring map

### Project / observation

- `create_project`, `get_project_info` → Bedrock project/lifecycle state.
- `inspect_model_bounds` → structural rendered Cube envelope evidence.
- `capture_model_views` → bounded named model views.
- `capture_screenshot` → current editor view only.

### Geometry / hierarchy

- `place_cube` → explicit finite Bedrock Cube creation.
- `modify_cube`, `modify_cubes_batch` → bounded correction with structural-effect result.
- `add_group` → Bedrock-authored Group/bone create state.
- `list_outline`, `find_elements_by_criteria`, `inspect_element` → bounded discovery/inspection.
- `duplicate_element`, rename/remove/history operations → bounded utility/recovery paths.

### Texture / surface

- `create_texture`, `activate_texture`, `list_textures`, `get_texture` → normal Bedrock single-texture lifecycle/evidence.
- Painter tools → pixel edits.
- TextureGroup/PBR tools → native Bedrock PBR state.
- material-instance tools → native per-face `material_instance` metadata.

Generic per-face `apply_texture` and raw `filter_by_material` are not default Bedrock callable concepts.

### Animation

Bedrock animation tools cover animation identity, inspection, keyframes, graph/batch/copy operations, rigging, and playback/timeline controls where mapped. Animation controllers and unsupported sound/timeline-effect authoring remain protected gaps.

### Locator / Null Object

Direct Elements-family ownership includes:

```text
list_locator_elements
manage_locator
manage_null_object
inspect_element
rename_element
remove_element
```

Representative live Locator/Null Object lifecycle and `.bbmodel` persistence were verified in the completed local acceptance pass.

### MCP result representation

`mcp/lib/factories.ts` owns request-owned registration and result normalization. When a tool returns `structuredContent` plus a single `content.text` entry containing the exact same compact JSON, the boundary keeps `structuredContent` and replaces the duplicate mirror with a short text summary. Concise non-duplicate text and image content remain unchanged.

This removes duplicate representation without deleting legitimate authored fields or changing tool capability.

## Canonical runtime-facing prompt

```text
mcp/prompts/bedrock_entity_workflow.md
```

It is the enabled Bedrock Entity workflow prompt. Maintainer/reference prompts do not replace it.

## Protected native gaps

- TextureMesh direct authoring/inspection;
- native visible bounding-box fields;
- animation controllers;
- animation sound/timeline effects;
- animated-texture authoring;
- bone-binding expressions.

Do not fake these with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, or another format.

## Proof boundary

Static source/CI proves contracts, ownership, buildability, and focused regressions. The completed local acceptance pass separately established representative live Blockbench rendering/Undo/playback, image delivery, reference-fidelity behavior, and save/reopen/export persistence.

Client efficiency questions remain distinct: native tool-search/deferred exposure, prompt/skill co-loading, real context/token/latency cost, and fresh-task catalog behavior require a fresh Codex trace. Do not downgrade existing live product proof merely because those efficiency measurements are still `UNKNOWN`.

Current proof status: [Validation Report](../foundation/validation-report.md).  
Current execution state: [Next Action](next-action.md).
