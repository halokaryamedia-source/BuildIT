# Implementation Map

Updated: 2026-08-13

Current `Local` source/ownership only. Active task state belongs in `next-action.md`; durable rationale belongs in decisions/reviews.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable project facts | root `CONTEXT.md` |
| active continuation | `docs/knowledge/next-action.md` |
| compact task/product flow | `docs/knowledge/flow.md` |
| product/reference/modelling policy | `docs/foundation/` |
| reference image generation | `.agents/skills/blockbench-reference-generator/` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR | `.agents/skills/blockit-bedrock-texturing/` |
| animation | `.agents/skills/blockit-bedrock-animation/` |
| repository change contract | `.agents/skills/development-brief/` |
| MCP public/schema/result/transport | `.agents/skills/mcp-server-development/` |
| Blockbench runtime/API/UI | `.agents/skills/blockbench-runtime-development/` |
| TypeScript boundary | `.agents/skills/typescript-type-safety/` |
| Bun tooling | `.agents/skills/bun-tooling/` |
| MCP package invariants | `mcp/AGENTS.md` |
| current proof state | `docs/foundation/validation-report.md` |
| future/non-active work | `docs/knowledge/operations/task-board.md` |
| completed local procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |

## Canonical Routes

```text
REFERENCE PREPARATION
source image / user intent → blockbench-reference-generator → approved Modelling Brief

ASSET AUTHORING
current request + actual approved reference → blockit-bedrock-entity-mcp → active specialist → BlockIT MCP

REPOSITORY / PLUGIN WORK
AGENTS.md → next-action.md when continuing → affected owner → development-brief
```

## MCP Source Areas

```text
mcp/index.ts          plugin lifecycle
mcp/server/           transport/tools/resources/prompts
mcp/server/tools/     authored operations
mcp/lib/              schemas/factories/identity/result helpers
mcp/ui/               Blockbench panel/settings
mcp/prompts/          runtime workflow + source-only references
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

`inspect_animation` controller-specific regression coverage additionally lives in `mcp/tests/animation-controller-inspection-contract.test.ts`.

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

Fresh GitHub/CI serialized measurement:

```text
initialize instructions:       386 characters
tool count:                     62
tools/list response:            76,439 characters
tools array:                    76,395 characters
input schemas:                  53,493 characters
descriptions:                   10,645 characters
per-tool payload:               p50 1,082 / p90 2,149 / p95 2,268 / max 3,167
```

These are serialized characters, not client token/context measurements.

## Deferred MCP Discovery Ownership

Current upstream Codex architecture supports catalog → deferred exposure → native `tool_search` → matching spec loading. BuildIT keeps all 62 retained Bedrock capabilities and a compact server namespace. No custom router/additional profile/multi-endpoint split is justified by current evidence.

## Authoring Decision / Recovery Ownership

The asset orchestrator owns:

```text
intent + known state + stage
→ deterministic semantic route
→ exact tool loaded? call
→ otherwise exact-name native tool_search
→ execute
→ bounded recovery from existing failure signals
```

Installed-client/model behavior remains direct/local proof.

## Reference / Modelling Ownership

After user approval:

```text
actual approved image
→ Reference Evidence Map + View Pair Map
→ Semantic Form Contract
→ Primary Form Hypothesis
→ MCP geometry
→ capture_model_views
→ claim-locked difference-first verdict
```

User-approved target owns identity/function; actual approved image owns visible form; approved dimensions own whole-model numeric envelope. Filename/path/manifest/prose/memory is context only, never visual proof.

P5–P7 retain semantic-form, actual-image grounding, and qualitative convergence without an image→Cube planner, similarity scorer, or runtime evaluator framework.

## Bedrock Authoring Ownership

### Project / observation

`create_project`, `get_project_info`, `inspect_model_bounds`, `capture_model_views`, and focused inspection own lifecycle/observation.

### Geometry / hierarchy

`place_cube` / `add_group` own creation; `modify_cube` / `modify_cubes_batch` own correction. PRO-3 adds per-element parent + initial inflate; PRO-5 gives batch Cube Box-UV state parity.

### Texture / surface

Native Bedrock texture, Painter, TextureGroup/PBR, and material-instance tools own surface work. Generic `apply_texture` and raw `filter_by_material` are not default callable concepts.

### Animation

Animation tools own identity, numeric or explicit Molang transform keyframes, graph/batch/copy, rigging, playback/timeline, and bounded new-animation sound effects. `manage_keyframes` preserves Molang strings without evaluating them. `inspect_animation` also owns read-only AnimationController/state inspection and preserves authored external animation keys. Controller creation/mutation and existing-animation direct sound/timeline-effect mutation remain protected gaps.

### Locator / Null Object

`list_locator_elements` owns compact discovery; `inspect_element` owns focused read state; `manage_locator` / `manage_null_object` own authored mutation.

## Toolchain / CI

Root `.bun-version` pins Bun **1.3.14**. `MCP Verify` owns frozen install, typecheck, contract tests, surface measurement, production build, generated-doc freshness, and aggregate enforcement.

## Completed Current Hardening

```text
P0–P4  efficiency/routing/deferred loading/recovery/defect navigation
P5     semantic form/orientation/pivot/contact
P6     actual reference + claim/view grounding
P7     qualitative correction convergence/evaluation integrity
REF    minimal Reference Generator buildability/cross-view route
PRO-1  professional representation/transform/hierarchy/detail reasoning
PRO-2  professional-sample authoring-expressiveness validation
PRO-3  place_cube parent + initial inflate completeness
PRO-4  nine-sample geometry/texturing/animation forensic audit
PRO-5  modify_cubes_batch Box-UV parity
PRO-6  manage_keyframes authored Molang transform-string support
PRO-7  create_animation + inspect_animation Bedrock sound-effect closure
PRO-8  inspect_animation read-only AnimationController/state closure
DOC    current-state synchronization
```

No local run is active. Remaining direct/model-facing evidence includes installed deferred-search parity, real token/latency/image-context cost, Reference Generator visual quality, actual-image handoff, P5–P7 model-facing effectiveness, and live persistence/preview/export behavior for Molang keyframes, sound events, and controller inspection.

## Protected Native Gaps

- TextureMesh direct authoring/inspection;
- native Bedrock visible bounding-box fields;
- animation controller creation/mutation;
- existing-animation direct sound/timeline-effect mutation;
- animated-texture authoring;
- bone-binding expressions.
