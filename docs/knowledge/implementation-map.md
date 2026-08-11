# Implementation Map

Updated: 2026-08-11

Use this note to answer **where current `Local` behavior lives**. It is a source-ownership map, not an active-task tracker or historical changelog.

## Repository Ownership

| Boundary | Current owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable workspace facts | root `CONTEXT.md` |
| active repository continuation | `docs/knowledge/next-action.md` |
| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |
| product/modelling/reference policy | `docs/foundation/` |
| repository-owned skills | `.agents/skills/` |
| plugin/runtime implementation | `mcp/` source |
| generated MCP API docs | `mcp/docs/` generated from source manifests/schemas |
| model/project packages | `workspace/` |

## Current Default MCP Surface

Pinned-SDK pre-local baseline:

```text
62 enabled tools
72,775 tools/list response characters
48,674 input-schema characters
11,800 tool-description characters
```

Default-contained tools:

```text
list_export_formats   default-disabled; export_model owns fixed product codecs
apply_texture         default-disabled for Bedrock single_texture semantics
filter_by_material    default-disabled because raw face texture identity does not own effective Bedrock texture selection
risky_eval            disabled
from_geo_json         disabled
```

`export_model` remains exposed. Animation, Paint, Texture/PBR, material-instance, Locator/Null Object, project, geometry, camera, history, and other retained Bedrock-relevant families remain available through the default product route.

## Plugin / Transport / Registration

| Area | Source owner |
|---|---|
| plugin lifecycle / startup / unload | `mcp/index.ts` + runtime helpers |
| MCP request/transport handling | `mcp/server/` |
| registration/profile/family gates | `mcp/lib/registrationProfile.ts`, factories, tool registration roots |
| panel/settings | `mcp/ui/` |
| tool definitions/implementations | `mcp/server/tools/` |
| prompts/resources | `mcp/server/prompts.ts`, `mcp/server/resources*`, `mcp/prompts/` |
| generated API documentation | `mcp/build/docs-manifest.ts`, `mcp/build/docs.ts` |

The default endpoint is loopback stateless Streamable HTTP. Live endpoint/client behavior remains a local-proof question.

## Project / Observation

| Capability | Source owner | Current source meaning |
|---|---|---|
| `create_project` | `mcp/server/tools/project.ts` | Bedrock product invariant; returns compact project lifecycle state |
| `get_project_info` | `mcp/server/tools/project.ts` | current project/lifecycle/count/root summary; use only when needed |
| `inspect_model_bounds` | project/rendered-bounds source | finite structural envelope evidence; not visual approval |
| `capture_model_views` | `mcp/server/tools/camera.ts` | bounded named model-view image evidence; observation only |
| `capture_screenshot` | `mcp/server/tools/camera.ts` | current-editor-view read; no hidden project switching |

## Geometry / Elements

| Capability | Source owner | Current source meaning |
|---|---|---|
| `place_cube` | `mcp/server/tools/cubes.ts` | explicit Bedrock Cube authoring; deterministic parent/UV/transform boundaries |
| `modify_cube` | `mcp/server/tools/cubes.ts` | explicit target; exact no-op rejection; Bedrock-relevant before/after + `geometry_effect` |
| `modify_cubes_batch` | `mcp/server/tools/cubes.ts` | bounded coherent multi-Cube mutation with preflight and one transaction |
| `add_group` | `mcp/server/tools/element.ts` | Bedrock-authored Group/bone create state only: name, finite origin/rotation, parent |
| `list_outline` | `mcp/server/tools/element.ts` | bounded structure browsing; targeted discovery is preferred for focused lookup |
| `find_elements_by_criteria` | `mcp/server/tools/element.ts` | non-empty explicit filters/scopes; finite ordered size filters; `parent_group` scopes a descendant subtree |
| `select_all_of_type` | `mcp/server/tools/element.ts` | selection-only helper; subtree scope is explicit and non-empty when supplied |
| duplicate / rename / remove | `mcp/server/tools/element.ts` | explicit identity, bounded mutation/Undo ownership |
| `inspect_element` | `mcp/server/tools/element-inspection.ts` | focused authored Cube/Group/Locator/Null Object state; read-only evidence |

Optional explicit references use omission for documented current/selected fallback; explicit empty strings are rejected where hardened.

## Locator / Null Object

Current direct authored-state ownership remains inside the Elements family:

```text
list_locator_elements
manage_locator
manage_null_object
inspect_element
rename_element
remove_element
```

Source supports finite transforms, explicit parent/identity, and resulting state. Live create/update/inspect/rename/remove plus save/reopen/export round-trip remains `LOCAL PROOF REQUIRED`.

## Texture / Paint / PBR

Primary source owners are `mcp/server/tools/texture.ts`, Paint-related tool modules, and `mcp/server/tools/material-instances.ts`.

Current Bedrock direction:

- `create_texture`, `activate_texture`, `list_textures`, `get_texture` own normal texture lifecycle/evidence;
- `apply_texture` is not a default Bedrock tool;
- Painter tools own pixel changes;
- native TextureGroup/PBR tools own Bedrock material channels/config;
- material-instance tools own native per-face `material_instance` metadata;
- mutation-returned metadata should be reused before redundant rereads.

## Animation / Rig

Primary owners are `mcp/server/tools/animation.ts` and `mcp/server/tools/animation-inspection.ts`.

Retained surface includes animation creation/inspection, keyframe management, graph interpolation, bone rigging, timeline/playback, batch/copy operations, and mapped effects. Protected native gaps such as animation controllers and unsupported sound/timeline-effect ownership are not faked with risky evaluation.

## Export / Lifecycle

`mcp/server/tools/export.ts` owns product artifact export:

```text
bedrock → Minecraft Bedrock geometry JSON
project → editable Blockbench .bbmodel
```

Filesystem writes require deterministic absolute paths, artifact verification, and native lifecycle ownership where applicable. Existing Bedrock multi-model geometry targets are not silently clobbered through a bypass of native overwrite/merge semantics.

## Canonical Agent-Facing Route

- `mcp/prompts/bedrock_entity_workflow.md` — bundled Bedrock workflow prompt.
- `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` — asset orchestrator.
- `.agents/skills/blockbench-bedrock-modelling/SKILL.md` — modelling judgement.
- `.agents/skills/blockit-bedrock-texturing/SKILL.md` — surface work.
- `.agents/skills/blockit-bedrock-animation/SKILL.md` — animation work.

Repository/plugin source changes use `development-brief` plus the relevant engineering specialist instead of the asset orchestrator.

## Proof Boundary

Current source/CI can prove contracts, ownership, generated-doc freshness, and pinned-SDK registration output. It does **not** prove live Blockbench rendering, image delivery, Undo behavior, native Codex deferred/search exposure, visual convergence, or save/reopen persistence.

Those remaining claims are owned by:

[Local Acceptance Runbook](operations/local-acceptance-runbook.md)

## Related

- [Next Action](next-action.md)
- [Validation Report](../foundation/validation-report.md)
- [Source Map](sources/source-map.md)
- [MCP README](../../mcp/README.md)
