# Implementation Map

Updated: 2026-08-14

Current `Local` source/ownership only. Repository/plugin active task state belongs in `next-action.md`; persistent asset continuity belongs in `workspace/active/<project>/README.md`; Git history owns retired rationale and experiments.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable project facts | root `CONTEXT.md` |
| repository/plugin continuation | `docs/knowledge/next-action.md` |
| active asset continuity | `workspace/active/<project>/README.md` |
| asset workspace lifecycle/rules | `workspace/README.md` |
| saved/parked asset packages | `workspace/saved/` |
| detailed current flow | `docs/knowledge/flow.md` |
| product/reference/modelling policy | `docs/foundation/` |
| current proof state | `docs/foundation/validation-report.md` |
| reference preparation | `.agents/skills/blockbench-reference-generator/` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR | `.agents/skills/blockit-bedrock-texturing/` |
| animation | `.agents/skills/blockit-bedrock-animation/` |
| repository change contract | `.agents/skills/development-brief/` |
| MCP public/schema/result/transport | `.agents/skills/mcp-server-development/` |
| Blockbench runtime/API/UI | `.agents/skills/blockbench-runtime-development/` |
| TypeScript | `.agents/skills/typescript-type-safety/` |
| Bun tooling | `.agents/skills/bun-tooling/` |
| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` only when reactivated |

Workspace is **storage/continuity, not an MCP capability family**. Reference Generator output remains image-only; persistence of an approved image into a project package is downstream/local asset storage.

## MCP Source Areas

```text
mcp/index.ts          plugin lifecycle
mcp/server/           transport/tools/resources/prompts
mcp/server/tools/     authored operations
mcp/lib/              schemas/factories/identity/result helpers
mcp/ui/               Blockbench panel/settings
mcp/prompts/          runtime workflow + source-only maintainer notes
mcp/build/            build/docs/manifest generation
mcp/scripts/          verification/measurement utilities
mcp/tests/            contract/integration/static-efficiency gates
mcp/docs/             generated API docs; secondary to source
```

## Hot-Path Defect Index

For a named MCP-tool defect, inspect the mapped **source owner + primary regression owner first**. **Expand only if that pair cannot explain the defect.**

| Tool(s) | Source owner | Primary regression owner |
|---|---|---|
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `get_project_info` | `mcp/server/tools/project.ts` | `mcp/tests/static-efficiency-budget.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `place_cube`, `modify_cube`, `modify_cubes_batch` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `add_group` | `mcp/server/tools/element.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `list_outline`, `find_elements_by_criteria` | `mcp/server/tools/element.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `inspect_element` | `mcp/server/tools/element-inspection.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `list_locator_elements`, `manage_locator`, `manage_null_object` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |
| `create_texture`, `list_textures`, `get_texture`, `activate_texture` | `mcp/server/tools/texture.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `create_animation` | `mcp/server/tools/animation.ts` | `mcp/tests/create-animation-contract.test.ts` |
| `manage_keyframes`, `animation_graph_editor`, `bone_rigging`, `animation_timeline`, `batch_keyframe_operations`, `animation_copy_paste` | `mcp/server/tools/animation.ts` | `mcp/tests/animation-mutation-contract.test.ts` |
| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `get_undo_stack` | `mcp/server/tools/history.ts` | `mcp/tests/static-efficiency-budget.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |

Controller-specific `inspect_animation` coverage additionally lives in `mcp/tests/animation-controller-inspection-contract.test.ts`.

`undo`/`redo` remain source-owned by `mcp/server/tools/history.ts` and are intentionally not indexed until a real defect justifies a specific primary regression owner.

## Default MCP Surface

```text
62 enabled tools
export_model          exposed
list_export_formats   not exposed
apply_texture         not exposed
filter_by_material    not exposed
risky_eval            disabled
from_geo_json         disabled
```

Current serialized measurement:

```text
initialize instructions:       386 characters
tool count:                     62
tools/list response:            76,439 characters
tools array:                    76,395 characters
input schemas:                  53,493 characters
descriptions:                   10,645 characters
per-tool payload max:           3,167 characters
```

These are serialized characters, not client token/context measurements.

## Deferred MCP Discovery Ownership

Current upstream Codex architecture supports catalog → deferred exposure → native `tool_search` → matching spec loading. BuildIT keeps all 62 retained Bedrock capabilities and a compact server namespace. No custom router/additional profile/multi-endpoint split is justified by current evidence.

## Authoring Decision / Recovery Ownership

```text
intent + known state + stage
→ named workspace state when persistent
→ deterministic semantic route
→ exact tool loaded? call
→ otherwise exact-name native tool_search
→ execute
→ bounded recovery from existing failure signals
```

A known named workspace package should reduce rediscovery, not create a new discovery ritual. Read its compact README and only needed current files; do not scan all active projects or treat stored prose as visual evidence.

Installed-client/model behavior remains direct/local proof.

## Current Bedrock Ownership

- geometry: `place_cube`, `add_group`, `modify_cube`, `modify_cubes_batch`; PRO-3 adds per-element parent/initial inflate and PRO-5 adds Box-UV batch parity;
- surface: native texture/Painter/PBR/material-instance paths;
- animation: numeric/Molang transform keys, graph/batch/copy, rig/timeline, bounded new-animation sound effects, and read-only AnimationController/state inspection;
- Locator/Null Object: compact discovery, focused inspection, and direct mutation;
- observation/export: project info, bounds, canonical views, `.bbmodel`, and Bedrock geometry export.

Protected gaps remain controller creation/mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Reference Preparation Ownership

Reference preparation is instruction/policy owned, not an MCP tool family. Current hardened contract keeps visual and nonvisual authority separate:

```text
approved image       → visible form + approved pose
Handoff Constraints  → approved nonvisual scale/use/pose-override facts
```

Articulated subjects use a stable natural neutral stance by default or the exact user-requested pose; limb count/attachment/support and cross-view pose phase are locked before approval. No object-specific anatomy preset, manifest layer, or geometry planner was added.

## Completed Current Hardening

```text
P0–P7  routing / grounding / convergence
REF    reference preparation/readiness + pose/limb/handoff integrity
PRO-1–PRO-8 professional construction/sample-driven bounded closures
DOC    current-state + repository-hygiene synchronization
```

No local run is active. Remaining runtime/model-facing claims stay direct/local proof.
