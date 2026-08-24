# Implementation Map

Updated: 2026-08-25

Current `Local` source/ownership only. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/foundation/validation-report.md`; asset continuity belongs in `workspace/active/<project>/README.md`.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| GitHub execution/history/CI/security | `GITHUB_RULES.md` |
| stable project facts | root `CONTEXT.md` |
| repository/plugin continuation | `docs/knowledge/next-action.md` |
| active asset continuity | `workspace/active/<project>/README.md` |
| asset workspace lifecycle | `workspace/README.md` |
| detailed product flow | `docs/knowledge/flow.md` |
| durable modelling/texture policy | `docs/foundation/` |
| proof state | `docs/foundation/validation-report.md` |
| reference preparation | `.agents/skills/blockbench-reference-generator/` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR judgement | `.agents/skills/blockit-bedrock-texturing/` |
| animation judgement | `.agents/skills/blockit-bedrock-animation/` |
| repository change contract | `.agents/skills/development-brief/` |
| MCP public/schema/result/transport | `.agents/skills/mcp-server-development/` |
| Blockbench API/lifecycle/UI/Undo | `.agents/skills/blockbench-runtime-development/` |
| TypeScript | `.agents/skills/typescript-type-safety/` |
| Bun/build/package tooling | `.agents/skills/bun-tooling/` |
| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated |

Workspace is storage/continuity, not an MCP capability family.

## MCP Source Areas

```text
mcp/index.ts          plugin lifecycle
mcp/server/           transport/tools/resources/prompts
mcp/server/tools/     authored operations
mcp/lib/              schemas/factories/identity/result helpers
mcp/ui/               Blockbench panel/settings
mcp/prompts/          runtime workflow + generated manifest
mcp/build/            build/docs/manifest generation
mcp/scripts/          verification/measurement utilities
mcp/tests/            contract/integration regressions
mcp/docs/             generated API docs; secondary to source
```

## Hot-Path Defect Index

For a named MCP-tool defect, inspect the mapped **source owner + primary regression owner first**. Expand only when that pair cannot explain the defect.

| Tool(s) | Source owner | Primary regression owner |
|---|---|---|
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `get_project_info` | `mcp/server/tools/project.ts` | `mcp/tests/static-footprint-budget.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `place_cube`, `modify_cube`, `modify_cubes_batch` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `add_group` | `mcp/server/tools/element.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `list_outline`, `find_elements_by_criteria` | `mcp/server/tools/element.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `inspect_element` | `mcp/server/tools/element-inspection.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `list_locator_elements`, `manage_locator`, `manage_null_object` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |
| `create_texture`, `list_textures`, `get_texture`, `activate_texture` | `mcp/server/tools/texture.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `manage_animation_effects` | `mcp/server/tools/animation-effects.ts` | `mcp/tests/animation-effect-mutation-contract.test.ts` |
| `manage_animation_controller` | `mcp/server/tools/animation-controller.ts` | `mcp/tests/animation-controller-mutation-contract.test.ts` |
| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `get_undo_stack`, `undo`, `redo` | `mcp/server/tools/history.ts` | `mcp/tests/static-footprint-budget.test.ts` for compact recovery state; targeted history tests for behavior |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |

## Effectiveness / Footprint Evidence Ownership

```text
Static Footprint
→ mcp/tests/static-footprint-budget.test.ts
→ instruction/schema/surface compactness only

Authoring Quality + Authoring Efficiency
→ docs/knowledge/operations/local-acceptance-runbook.md
→ exact current local artifact + visual/runtime evidence
→ Cost to Accepted Result
```

Static Footprint cannot upgrade a runtime Authoring Efficiency or visual-quality claim.

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
from_geo_json                disabled
```

Surface regression ceilings:

```text
initialize instructions       <= 700 characters
tools/list response           <= 82,000 characters
input schemas                 <= 58,000 characters
descriptions                  <= 11,500 characters
per-tool payload max          <= 3,200 characters
```

`measure:surface` owns exact current serialized values. Serialized characters are not client token/context measurements and are not Authoring Efficiency proof.

## Authoring Decision / Recovery Ownership

```text
intent + known state + stage
→ named workspace state when persistent
→ exact tool when known
→ focused discovery only when target/spec is stale or unknown
→ execute
→ reuse returned continuation state
→ bounded recovery from actual failure evidence
```

Do not turn a professional sample, reference fixture, or one failed model into a global modelling recipe or runtime invariant without generic evidence.

## Current Bedrock Ownership

- geometry: `place_cube`, `add_group`, `modify_cube`, `modify_cubes_batch`;
- surface: texture/Painter/PBR/material-instance paths;
- animation: numeric/Molang transforms, effect mutation, AnimationController state-machine/state-effect mutation;
- Locator/Null Object: discovery, focused inspection, direct mutation;
- observation/export: project info, bounds, canonical views, `.bbmodel`, Bedrock geometry export.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Continuation Boundary

This map contains no active task status. Read `docs/knowledge/next-action.md` for continuation and `docs/foundation/validation-report.md` for proof. Historical audits, fixture-specific rationale, and discarded approaches belong in Git history.
