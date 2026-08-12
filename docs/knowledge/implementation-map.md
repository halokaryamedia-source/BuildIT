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
mcp/scripts/          isolated verification/measurement utilities
mcp/tests/            contract/integration/static-efficiency gates
mcp/docs/             generated API docs; secondary to source
```

## Default MCP Surface

Accepted live capability baseline remains:

```text
62 enabled tools
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

Fresh GitHub/CI serialized measurement:

```text
initialize instructions: 386 characters
62 tools
74,996 tools/list response characters
74,952 tools-array characters
51,810 input-schema characters
10,885 description characters
per-tool payload: p50 1,082 / p90 2,149 / p95 2,268 / max 3,034
```

The earlier accepted static measurement was 72,775 tools/list characters, 48,674 input-schema characters, and 11,800 description characters. Current descriptions are smaller, while current schema and total serialized characters are larger. Neither measurement is a client token/context measurement.

`mcp/scripts/measure-default-surface.ts` owns the isolated `initialize → tools/list` measurement. CI retains exactly 62 default tools and uses bounded serialized-surface ceilings plus a 700-character initialization-instructions ceiling.

## Deferred MCP Discovery Ownership

Current upstream Codex provides the desired usage architecture when tool search is available:

```text
MCP catalog
→ Deferred exposure
→ Codex tool_search
→ matching tool spec loaded when needed
```

Codex still performs MCP initialization and `tools/list` to build/cache its client-side catalog; that catalog size is therefore not equivalent to model context size. The current Codex MCP adapter uses regular MCP server instructions as the namespace description, and its tool-search text includes tool names, titles/descriptions, namespace description, and top-level schema property names.

BuildIT's owner for this compatibility is `mcp/server/server.ts`. It sends one compact `MCP_SERVER_INSTRUCTIONS` capability summary during initialization. The runtime workflow remains separately owned by `mcp/prompts/bedrock_entity_workflow.md`; the 6k workflow prompt is not copied into initialization.

This design intentionally keeps all 62 Bedrock capabilities. No BuildIT custom search/router, additional MCP profile, or multi-endpoint domain split is currently justified.

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

The actual serialized `tools/list` contract for `manage_locator` / `manage_null_object` currently flattens branch fields into one object shape where only `action` is top-level-required. Branch intent remains client-visible through field descriptions (`name` required for create, `id` required for update), while the original discriminated-union Zod schema remains the runtime validation owner.

### MCP result representation

`mcp/lib/factories.ts` owns request-level normalization. An exact single-text JSON mirror of `structuredContent` is replaced by a short text summary while canonical structured data, meaningful distinct text, and images remain.

### Runtime prompt surface

Only `mcp/prompts/bedrock_entity_workflow.md` is bundled/exposed as the runtime workflow prompt. Maintainer API/eval Markdown remains source-only.

### Toolchain / CI

Root `.bun-version` pins Bun **1.3.14** for the MCP verification workflow. `MCP Verify` owns frozen-lockfile install, typecheck, contract tests, isolated default-surface measurement, production build, generated-doc freshness, and aggregate enforcement.

Active routing integrity is regression-tested against the canonical `.agents/skills/` inventory so active docs cannot silently route to missing repository-owned skills.

## Completed Static Efficiency Hardening

**Source-provable cleanup and GitHub-only pretest hardening are complete** for the requested pre-local phase:

- duplicate structured/text result mirrors removed centrally;
- path export and discovery/read defaults made metadata/summary-first where source ownership proved the boundary;
- project, outline/search, history, and Locator discovery no longer return avoidable normal-path detail;
- asset and repository-development context split across existing owners rather than ritual co-loading;
- stale/non-existent development routing removed and active skill references regression-checked;
- runtime prompt bundle reduced to the one callable workflow;
- Locator/Null branch intent checked on the actual serialized MCP surface without tool/profile proliferation;
- Bun toolchain pinned;
- isolated serialized-surface measurement and regression ceilings added;
- compact MCP server namespace instructions added for native deferred-tool discovery compatibility.

**No new local run is active.** Current upstream Codex source establishes native deferred MCP discovery when tool search is available. The remaining client-only questions are whether the user's installed Codex/model follows that current path and what the real token/latency, co-loading, retry, and image-context costs are. Do not add a router/profile or remove retained native capability without that future evidence.

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