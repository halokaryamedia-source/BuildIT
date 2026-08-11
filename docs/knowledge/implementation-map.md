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
| `mcp/prompts/` | runtime workflow prompt + source-only maintainer references |
| `mcp/build/` | build/docs/runtime-manifest generation |
| `mcp/tests/` | contract/integration/static-efficiency regression gates |
| `mcp/docs/` | generated API docs; secondary to source |

## Default MCP surface

Historical accepted pinned-SDK baseline:

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

The 62-tool capability count remains contract-locked. Current regression also caps the enabled description surface below 11,500 characters. Historical character counts above are not model-visible token measurements and are not presented as a fresh post-cleanup tools/list measurement.

## Bedrock authoring ownership

### Project / observation

- `create_project`, `get_project_info` → Bedrock project/lifecycle state; project info uses a bounded top-level Group summary.
- `inspect_model_bounds` → rendered Cube envelope evidence.
- `capture_model_views` → bounded canonical model views.
- `capture_screenshot` → current editor view only.

### Geometry / hierarchy

- `place_cube` → finite Bedrock Cube creation.
- `modify_cube`, `modify_cubes_batch` → correction with structural effects.
- `add_group` → Group/bone creation.
- `list_outline`, `find_elements_by_criteria`, `inspect_element` → bounded discovery/inspection; normal defaults are compact and can be raised explicitly.
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

Direct Elements-family ownership includes `list_locator_elements`, `manage_locator`, `manage_null_object`, `inspect_element`, `rename_element`, and `remove_element`. Create/update branch intent is explicit in client-facing descriptions.

### MCP result representation

`mcp/lib/factories.ts` owns request-owned result normalization. Exact single-text JSON mirrors of `structuredContent` are replaced by a short summary while canonical structured data, meaningful text, and images are preserved.

### Runtime prompt surface

Only `bedrock_entity_workflow` is registered and bundled as a runtime MCP prompt. Maintainer API/eval Markdown remains source reference and is excluded from the runtime manifest/docs prompt surface.

## Completed Static Efficiency Hardening

Source-provable cleanup is complete for the current requested phase:

- duplicate result representation;
- clearly oversized normal project/discovery/history defaults with preserved explicit larger bounds;
- repeated active instruction ownership across routing/orchestrator/specialists/runtime prompt;
- stale local-acceptance/current-state routing;
- Locator/Null Object branch guidance;
- disabled maintainer prompt bundling;
- generated output synchronization;
- regression budgets for instruction size/default surface growth.

No new local run is active. Client-only behavior remains deliberately unmodified until the user explicitly requests testing:

- all-schema injection vs deferred/native tool search;
- actual prompt/skill co-loading;
- real token/latency cost;
- actual retry frequency;
- realistic image/context cost.

Do not add a router/profile or remove native capability from static speculation alone.

## Protected native gaps

- TextureMesh direct authoring/inspection;
- native Bedrock visible bounding-box fields;
- animation controllers;
- animation sound/timeline effects;
- animated-texture authoring;
- bone-binding expressions.

Do not fake these with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, Hytale, or another format.

Current proof status: [Validation Report](../foundation/validation-report.md).  
Current execution state: [Next Action](next-action.md).
