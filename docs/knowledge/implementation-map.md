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
| modelling/reference-grounding judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR | `.agents/skills/blockit-bedrock-texturing/` |
| animation | `.agents/skills/blockit-bedrock-animation/` |
| repository change contract | `.agents/skills/development-brief/` |
| MCP public/transport/schema/result decisions | `.agents/skills/mcp-server-development/` |
| Blockbench runtime/API/UI mechanics | `.agents/skills/blockbench-runtime-development/` |
| TypeScript type-system boundary | `.agents/skills/typescript-type-safety/` |
| Bun build/package/tooling | `.agents/skills/bun-tooling/` |
| MCP package invariants | `mcp/AGENTS.md` |
| MCP public/runtime source | `mcp/` |
| current proof state | `docs/foundation/validation-report.md` |
| future/non-active work | `docs/knowledge/operations/task-board.md` |
| completed local procedure | `docs/knowledge/operations/local-acceptance-runbook.md` |

## Canonical Routes

### Reference preparation

```text
source image / user intent
→ blockbench-reference-generator
→ one buildable multi-view Modelling Brief image
→ user approval
```

Image-only. No MCP, geometry, ZIP/manifest package, or numeric fidelity score.

### Asset authoring

```text
current request + actual approved reference image
→ blockit-bedrock-entity-mcp
→ only active modelling/texturing/animation specialist
→ BlockIT MCP
```

### Repository / plugin work

```text
AGENTS.md
→ next-action.md when continuing current work
→ CONTEXT.md only when stable facts matter
→ named tool defect? Hot-Path Defect Index
→ affected owner
→ development-brief
→ at most one useful engineering specialist
```

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

## Hot-Path Defect Index

For a repository/plugin defect naming one of these tools, inspect the mapped **source owner + primary regression owner first**. Expand only if that pair cannot explain the defect.

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
| `create_pbr_material`, `configure_material`, `assign_texture_channel` | `mcp/server/tools/texture.ts` | `mcp/tests/pbr-channel-contract.test.ts` |
| `create_animation` | `mcp/server/tools/animation.ts` | `mcp/tests/create-animation-contract.test.ts` |
| `manage_keyframes`, `animation_graph_editor`, `bone_rigging`, `animation_timeline`, `batch_keyframe_operations`, `animation_copy_paste` | `mcp/server/tools/animation.ts` | `mcp/tests/animation-mutation-contract.test.ts` |
| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `get_undo_stack` | `mcp/server/tools/history.ts` | `mcp/tests/static-efficiency-budget.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |

`undo`/`redo` remain source-owned by `mcp/server/tools/history.ts` and are intentionally not indexed until a real defect justifies a specific primary regression owner.

## Default MCP Surface

Accepted baseline:

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

These are serialized characters, not client token/context measurements. `mcp/scripts/measure-default-surface.ts` owns the isolated measurement.

## Deferred MCP Discovery Ownership

Current upstream Codex architecture supports:

```text
MCP catalog
→ deferred exposure
→ native tool_search
→ matching tool spec loaded when needed
```

BuildIT compatibility owner is `mcp/server/server.ts`, which sends compact `MCP_SERVER_INSTRUCTIONS`. Runtime workflow remains separately owned by `mcp/prompts/bedrock_entity_workflow.md`.

All 62 retained Bedrock capabilities remain. No BuildIT custom router/additional profile/multi-endpoint split is justified by current evidence.

## Authoring Decision / Recovery Ownership

The asset orchestrator owns the decision layer:

```text
intent + known state + stage
→ deterministic semantic route
→ exact tool loaded? call
→ otherwise exact-name native tool_search
→ execute
→ bounded recovery from existing failure signals
```

Static retrieval evidence:

```text
raw semantic stress: Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9231 / MRR 0.6652
exact-name routed:   Top-1 0.8173 / Top-3 0.9808 / Top-8 1.0000 / MRR 0.8990
```

Installed-client/model behavior remains direct/local proof.

## Reference Generator Ownership

```text
.agents/skills/blockbench-reference-generator/SKILL.md
```

owns:

```text
actual source image / user intent
→ one Minecraft / Blockbench multi-view Modelling Brief Draft
→ maximum one targeted correction
→ user approval
```

`docs/foundation/04-reference-guide.md` owns durable reference policy.

The generator does not:

- call BlockIT MCP;
- create `.bbmodel` geometry;
- decide Cube count/transforms/pivots;
- create ZIP/manifest/production packages;
- use numeric fidelity scoring.

Static regression owner:

```text
mcp/tests/reference-generator-buildability.test.ts
```

Generated-image quality still requires direct image-capable evidence.

## Reference Grounding / Modelling Ownership

After user approval:

```text
actual approved image visible to modelling model
→ Reference Evidence Map
→ View Pair Map
→ Semantic Form Contract
→ Primary Form Hypothesis
→ MCP geometry tools
→ capture_model_views
→ actual reference + fresh current model view(s)
→ claim-locked difference-first verdict
```

Ownership:

- user brief/approved target → identity/function;
- actual approved reference image → visible form;
- approved dimensions → numeric whole-model envelope;
- `blockbench-bedrock-modelling` → semantic decomposition, orientation/pivot/contact, whole-form/correction judgement;
- `mcp/prompts/bedrock_entity_workflow.md` → compact runtime workflow;
- `capture_model_views` → deterministic labeled **model** images only;
- `docs/foundation/07-visual-validation.md` → visual verdict/convergence contract.

Filename/path/manifest/prose/memory is context only. Missing/ambiguous actual image/view pairing keeps material work `UNVERIFIED/BLOCKED`.

### P5

```text
semantic form
→ explicit orientation state
→ pivot role for rotation
→ contact invariant
→ exact geometry
```

### P6

```text
actual approved image
→ grounded claim IDs + view pairing
→ fresh claim-locked reference/model comparison
```

### P7

```text
pre-correction evidence
→ causal correction
→ fresh affected evidence
→ IMPROVED | UNCHANGED | REGRESSED
```

P5–P7 add no image→Cube planner, similarity/IoU/fidelity authority, self-reported semantic MCP field, registration profile, or runtime evaluator framework.

## Bedrock Authoring Ownership

### Project / observation

- `create_project`, `get_project_info` → lifecycle/project summary.
- `inspect_model_bounds` → rendered Cube envelope facts.
- `capture_model_views` → bounded canonical **model** views.
- `capture_screenshot` → current editor view only.

### Geometry / hierarchy

- `place_cube`, `add_group` → Cube/Group authoring after grounded decisions.
- `modify_cube`, `modify_cubes_batch` → bounded mutation with `geometry_effect`.
- `list_outline`, `find_elements_by_criteria` → compact discovery.
- `inspect_element` → focused authored state.
- rename/remove/duplicate/history → utility/recovery.

### Texture / surface

Texture, Painter, TextureGroup/PBR, and material-instance tools own native Bedrock surface work. Generic `apply_texture` and raw `filter_by_material` are not default callable concepts.

### Animation

Animation tools own identity, focused inspection, keyframes, graph/batch/copy, rigging, and playback/timeline. Controllers and unsupported sound/timeline-effect authoring remain protected gaps.

### Locator / Null Object

`list_locator_elements` is identity/type/parent discovery. Detailed transforms/visibility/Null IK read state belong to `inspect_element`; create/update state comes from `manage_locator` / `manage_null_object`.

## MCP Result / Prompt Ownership

- `mcp/lib/factories.ts` owns request-level result normalization.
- only `mcp/prompts/bedrock_entity_workflow.md` is bundled/exposed as runtime workflow.
- maintainer Markdown remains source-only.

## Toolchain / CI

Root `.bun-version` pins Bun **1.3.14**.

`MCP Verify` owns frozen install, typecheck, contract tests, default-surface measurement, production build, generated-doc freshness, and aggregate enforcement.

## Completed Current Hardening

```text
P0–P4  efficiency/routing/deferred loading/recovery/defect navigation
P5     semantic form/orientation/pivot/contact
P6     actual reference + claim/view grounding
P7     qualitative correction convergence/evaluation integrity
REF    minimal Reference Generator buildability/cross-view route
DOC    post-P7/reference-generator current-state synchronization
```

No local run is active.

Remaining direct/model-facing evidence includes installed deferred-search parity, real token/latency/image-context cost, Reference Generator visual quality, actual-image handoff, and P5–P7 model-facing effectiveness.

## Protected Native Gaps

- TextureMesh direct authoring/inspection;
- native Bedrock visible bounding-box fields;
- animation controllers;
- animation sound/timeline effects;
- animated-texture authoring;
- bone-binding expressions.
