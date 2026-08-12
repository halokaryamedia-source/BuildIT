# Implementation Map

Updated: 2026-08-12

Current `Local` source ownership only. Active task state belongs in `next-action.md`; historical rationale belongs in reviews/decisions.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable project facts | root `CONTEXT.md` |
| active continuation | `docs/knowledge/next-action.md` |
| product/modelling policy | `docs/foundation/` |
| MCP package invariants | `mcp/AGENTS.md` |
| MCP public/runtime source | `mcp/` |
| repository change contract | `.agents/skills/development-brief/` |
| MCP public-contract decisions | `.agents/skills/mcp-server-development/` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR | `.agents/skills/blockit-bedrock-texturing/` |
| animation | `.agents/skills/blockit-bedrock-animation/` |
| completed local procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |

## MCP Source Areas

```text
mcp/index.ts          plugin lifecycle
mcp/server/           transport/tools/resources/prompts
mcp/server/tools/     authored operations
mcp/lib/              schemas/factories/identities/result normalization
mcp/ui/               Blockbench panel/settings
mcp/prompts/          one runtime workflow + source-only maintainer references
mcp/build/            build/docs/runtime-manifest generation
mcp/tests/            contract/integration/static-efficiency gates
mcp/docs/             generated API docs; secondary to source
```

## Default MCP Surface

Accepted live capability baseline:

```text
62 enabled tools
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

Historical accepted static measurement was 72,775 tools/list characters, 48,674 input-schema characters, and 11,800 description characters. Those numbers predate later static slimming and are **not** current client-token measurements. Current regressions keep the 62-tool capability count and bound enabled description growth without claiming runtime token savings.

## Bedrock Authoring Ownership

### Project / observation

- `create_project`, `get_project_info` → lifecycle/project summary; root Group output is bounded.
- `inspect_model_bounds` → rendered Cube envelope evidence.
- `capture_model_views` → bounded canonical views.
- `capture_screenshot` → current editor view only.

### Geometry / hierarchy

- `place_cube`, `add_group` → Cube/Group authoring.
- `modify_cube`, `modify_cubes_batch` → bounded mutation with `geometry_effect`.
- `list_outline`, `find_elements_by_criteria` → compact-default discovery with explicit larger bounds.
- `inspect_element` → focused authored state.
- rename/remove/duplicate/history → utility/recovery.

### Texture / surface

`create_texture`, `activate_texture`, `list_textures`, `get_texture`, Painter, TextureGroup/PBR, and material-instance tools own native Bedrock surface work. Generic `apply_texture` and raw `filter_by_material` are not default Bedrock callable concepts.

### Animation

Animation tools own identity, summary/focused inspection, keyframes, graph/batch/copy operations, rigging, and mapped playback/timeline controls. Controllers and unsupported sound/timeline-effect authoring remain protected gaps.

### Locator / Null Object

`list_locator_elements` is **identity/type/parent discovery only**. Detailed transforms, visibility, and Null Object IK read state belong to `inspect_element`; create/update state comes directly from `manage_locator` / `manage_null_object`. Rename/delete use generic element owners.

### MCP result representation

`mcp/lib/factories.ts` owns request-level normalization. An exact single-text JSON mirror of `structuredContent` is replaced by a short text summary while canonical structured data, meaningful distinct text, and images remain.

### Runtime prompt surface

Only `mcp/prompts/bedrock_entity_workflow.md` is bundled/exposed as the runtime workflow prompt. Maintainer API/eval Markdown remains source-only.

## Completed Static Efficiency Hardening

**Source-provable cleanup is complete** for the requested pre-local phase:

- duplicate structured/text result mirrors removed centrally;
- path export and discovery/read defaults made metadata/summary-first where source ownership proved the boundary;
- project, outline/search, history, and Locator discovery no longer return avoidable normal-path detail;
- asset instruction ownership split across routing/orchestrator/domain specialists;
- repository-development context split across root routing, compact development brief, package rules, and at most one specialist;
- stale/non-existent development routing removed;
- runtime prompt bundle reduced to the one callable workflow;
- Locator/Null branch intent clarified without tool/profile proliferation;
- generated state synchronized and static efficiency budgets added.

**No new local run is active.** Client-only questions—schema injection/deferred search, real co-loading, token/latency cost, retry frequency, and realistic image-context cost—remain future evidence questions. Do not add a router/profile or remove retained native capability from static speculation alone.

## Protected Native Gaps

- TextureMesh direct authoring/inspection;
- native Bedrock visible bounding-box fields;
- animation controllers;
- animation sound/timeline effects;
- animated-texture authoring;
- bone-binding expressions.

Do not emulate them with generic Mesh, arbitrary Cubes, risky evaluation, UI automation, Hytale, or another format.

Current proof: [Validation Report](../foundation/validation-report.md).  
Current continuation: [Next Action](next-action.md).
