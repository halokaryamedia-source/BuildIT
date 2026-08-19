# Implementation Map

Updated: 2026-08-18

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

Workspace is storage/continuity, not an MCP capability family.

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
| `manage_animation_effects` | `mcp/server/tools/animation-effects.ts` | `mcp/tests/animation-effect-mutation-contract.test.ts` |
| `manage_animation_controller` | `mcp/server/tools/animation-controller.ts` | `mcp/tests/animation-controller-mutation-contract.test.ts` |
| `manage_keyframes`, `animation_graph_editor`, `bone_rigging`, `animation_timeline`, `batch_keyframe_operations`, `animation_copy_paste` | `mcp/server/tools/animation.ts` | `mcp/tests/animation-mutation-contract.test.ts` |
| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `get_undo_stack` | `mcp/server/tools/history.ts` | `mcp/tests/static-efficiency-budget.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |

Controller inspection additionally lives in `mcp/tests/animation-controller-inspection-contract.test.ts`; state-effect mutation additionally lives in `mcp/tests/animation-controller-effects-mutation.test.ts`.

`undo`/`redo` remain source-owned by `mcp/server/tools/history.ts` and are intentionally not indexed until a real defect justifies a specific primary regression owner.

## Default MCP Surface

```text
64 enabled tools
export_model                  exposed
manage_animation_effects      exposed
manage_animation_controller   exposed
list_export_formats           not exposed
apply_texture                 not exposed
filter_by_material            not exposed
risky_eval                    disabled
from_geo_json                 disabled
```

Surface regression ceilings:

```text
initialize instructions       <= 700 characters
tools/list response           <= 80,500 characters
input schemas                 <= 56,500 characters
descriptions                  <= 11,500 characters
per-tool payload max          <= 3,200 characters
```

`measure:surface` owns exact current serialized values. Serialized characters are not client token/context measurements.

## Deferred MCP Discovery Ownership

Current upstream Codex architecture supports catalog → deferred exposure → native `tool_search` → matching spec loading. BuildIT keeps all 64 retained Bedrock capabilities and a compact server namespace. No custom router/additional profile/multi-endpoint split is justified by current evidence.

## Authoring Decision / Recovery Ownership

```text
intent + known state + stage
→ named workspace state when persistent
→ deterministic semantic route
→ exact tool loaded? call
→ otherwise exact-name native tool_search
→ execute
→ reuse returned continuation state
→ bounded recovery from existing failure signals
```

Known controller/effect state returned by mutation tools is continuation state; do not immediately rediscover it with `inspect_animation` unless more detail is needed.

Installed-client/model behavior remains direct/local proof.

## Current Bedrock Ownership

- geometry: `place_cube`, `add_group`, `modify_cube`, `modify_cubes_batch`;
- surface: native texture/Painter/PBR/material-instance paths;
- animation: numeric/Molang transform keys, graph/batch/copy, rig/timeline, new-animation sound/particle effects, existing-animation particle/sound/timeline effects, animation-level `anim_time_update` / `blend_weight`, read-only controller inspection, and batched AnimationController state-machine plus state sound/particle mutation;
- Locator/Null Object: compact discovery, focused inspection, and direct mutation;
- observation/export: project info, bounds, canonical views, `.bbmodel`, and Bedrock geometry export.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Reference Preparation Ownership

Reference preparation is instruction/policy owned, not an MCP tool family. Current hardened contract keeps visual and nonvisual authority separate:

```text
approved image       → visible form + approved pose
Handoff Constraints  → approved nonvisual scale/use/pose-override facts
```

## Completed Current Hardening

```text
P0–P7  routing / grounding / convergence
REF    reference preparation/readiness + pose/limb/handoff integrity
PRO-1–PRO-8 professional construction/sample-driven bounded closures
U1–U7  pre-local usage/documentation optimization
CTRL   bounded AnimationController state-machine mutation
ANIM   existing-effect, controller-effect, and animation-level Molang mutation closure
```

No local run is active. Remaining runtime/model-facing claims stay direct/local proof.
