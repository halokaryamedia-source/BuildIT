# Implementation Map

Updated: 2026-08-12

Current `Local` source ownership only. Active task state belongs in `next-action.md`; historical rationale belongs in reviews/decisions.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| stable project facts | root `CONTEXT.md` |
| active continuation | `docs/knowledge/next-action.md` |
| product/modelling/reference policy | `docs/foundation/` |
| MCP package invariants | `mcp/AGENTS.md` |
| MCP public/runtime source | `mcp/` |
| repository change contract | `.agents/skills/development-brief/` |
| MCP public-contract decisions | `.agents/skills/mcp-server-development/` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling/reference-grounding judgement | `.agents/skills/blockbench-bedrock-modelling/` |
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

## Hot-Path Defect Index

For a repository/plugin defect that names one of these tools, inspect the mapped **source owner + primary regression owner first**. This is a **first-stop index, not exhaustive ownership**; expand to callers/shared helpers/code search only when the mapped pair cannot explain the defect.

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

Do not load every listed test. The mapped regression is the first falsification target for the named tool; adjacent tests load only when the defect crosses that contract boundary. `undo`/`redo` remain source-owned by `mcp/server/tools/history.ts`, but are intentionally not indexed until a real defect justifies a sufficiently specific primary regression owner.

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

Earlier accepted static measurement was 72,775 tools/list characters, 48,674 input-schema characters, and 11,800 description characters. Current descriptions are smaller while schema/total serialized characters are larger. Neither is a client token/context measurement.

`mcp/scripts/measure-default-surface.ts` owns the isolated measurement. CI retains exactly 62 default tools and bounded serialized-surface/instructions ceilings.

## Deferred MCP Discovery Ownership

Current upstream Codex provides the desired architecture when tool search is available:

```text
MCP catalog
→ Deferred exposure
→ Codex tool_search
→ matching tool spec loaded when needed
```

Codex still performs MCP initialization/`tools/list` for its client-side catalog; catalog size is not model context size. BuildIT's compatibility owner is `mcp/server/server.ts`, which sends compact `MCP_SERVER_INSTRUCTIONS`. Runtime workflow remains separately owned by `mcp/prompts/bedrock_entity_workflow.md`.

All 62 Bedrock capabilities remain. No BuildIT custom router, additional profile, or multi-endpoint split is justified by current evidence.

## Authoring Decision / Recovery Ownership

The asset orchestrator owns a compact decision layer, not MCP registration architecture:

```text
intent + known state + stage
→ deterministic semantic route
→ exact tool loaded? call
→ otherwise exact-name native tool_search
→ execute
→ bounded recovery from existing failure signals
```

Static retrieval evidence over 104 human-style cases:

```text
raw semantic stress: Top-1 0.5096 / Top-3 0.7981 / Top-8 0.9231 / MRR 0.6652
exact-name routed:   Top-1 0.8173 / Top-3 0.9808 / Top-8 1.0000 / MRR 0.8990
```

Top-8 presence is routed correctness gate because route already knows the exact tool and upstream search returns up to 8 matches. Installed-client/model behavior remains local proof. Recovery maps validation, ambiguous/not-found identity, stale-known-reference, no-authored-effect, and unsupported capability to bounded same-tool/focused recovery; no global error enum/recovery engine is added.

Repository debugging is separate: named hot-path tools use the table above before code search.

## Reference Grounding / Modelling Ownership

Reference-driven geometry now has explicit evidence ownership before exact Cube numbers:

```text
actual approved image visible to modelling model
→ docs/foundation/04-reference-guide.md
→ Reference Evidence Map (derived claim_id index)
→ View Pair Map (reference label → canonical model view)
→ Semantic Form Contract
→ Primary Form Hypothesis
→ MCP geometry tools
→ capture_model_views
→ actual reference + fresh current model view(s)
→ claim-locked difference-first verdict
```

Ownership rules:

- user brief/approved target → target identity/function;
- actual approved reference image → visible form;
- approved dimensions → numeric whole-model envelope;
- `.agents/skills/blockbench-bedrock-modelling/SKILL.md` → semantic decomposition, orientation/pivot/contact, claim/view-grounded modelling judgement;
- `mcp/prompts/bedrock_entity_workflow.md` → compact runtime workflow;
- `mcp/server/tools/camera.ts::capture_model_views` → deterministic labeled **model** images only; it does not read/score the reference or return PASS/FAIL;
- `docs/foundation/07-visual-validation.md` → claim-locked visual verdict contract.

A Reference Evidence Map is decision state derived from the actual image, not a persisted runtime model, tool schema, or second source of visual truth. Filename/path/manifest/prose/memory is routing/context only. If actual approved image or valid View Pair Map is unavailable, material reference-driven authoring/approval remains `UNVERIFIED/BLOCKED` rather than guessing.

P5/P6 add no image→Cube planner, similarity/IoU/projection authority, vision scorer, self-reported semantic `place_cube` fields, registration profile, or runtime evaluator framework. Static CI proves these contracts exist; it cannot prove model vision accuracy.

## Bedrock Authoring Ownership

### Project / observation

- `create_project`, `get_project_info` → lifecycle/project summary; root Group output bounded.
- `inspect_model_bounds` → rendered Cube envelope evidence.
- `capture_model_views` → bounded canonical **model** views.
- `capture_screenshot` → current editor view only.

### Geometry / hierarchy

- `place_cube`, `add_group` → Cube/Group authoring after grounded modelling decisions.
- `modify_cube`, `modify_cubes_batch` → bounded mutation with `geometry_effect`.
- `list_outline`, `find_elements_by_criteria` → compact-default discovery.
- `inspect_element` → focused authored state.
- rename/remove/duplicate/history → utility/recovery.

### Texture / surface

`create_texture`, `activate_texture`, `list_textures`, `get_texture`, Painter, TextureGroup/PBR, and material-instance tools own native Bedrock surface work. Generic `apply_texture` and raw `filter_by_material` are not default callable concepts.

### Animation

Animation tools own identity, summary/focused inspection, keyframes, graph/batch/copy, rigging, and playback/timeline. Controllers and unsupported sound/timeline-effect authoring remain protected gaps.

### Locator / Null Object

`list_locator_elements` is **identity/type/parent discovery only**. Detailed transforms/visibility/Null IK read state belong to `inspect_element`; create/update state comes from `manage_locator` / `manage_null_object`.

Advertised Locator/Null branch schema remains flattened with only `action` top-level-required; field descriptions expose create/update intent while original Zod schema owns runtime validation.

### MCP result representation

`mcp/lib/factories.ts` owns request-level normalization. An exact single-text JSON mirror of `structuredContent` becomes a short text summary while canonical structured data, meaningful distinct text, and images remain.

### Runtime prompt surface

Only `mcp/prompts/bedrock_entity_workflow.md` is bundled/exposed as runtime workflow. Maintainer Markdown remains source-only.

### Toolchain / CI

Root `.bun-version` pins Bun **1.3.14**. `MCP Verify` owns frozen install, typecheck, contract tests, default-surface measurement, production build, generated-doc freshness, and aggregate enforcement.

Active routing integrity is regression-tested against canonical `.agents/skills/` inventory; **active skill references regression-checked**. The hot-path defect index is also checked for actual source/test ownership.

## Completed Static Efficiency / Modelling Hardening

**Source-provable cleanup and GitHub-only pretest hardening are complete** for the requested non-local phase:

- duplicate structured/text result mirrors removed centrally;
- path export and discovery/read defaults made metadata/summary-first where source ownership proved the boundary;
- project/outline/search/history/Locator normal reads bounded;
- asset and repository-development context split across existing owners;
- stale/missing routing removed and active references checked;
- runtime prompt bundle reduced to one callable workflow;
- Bun toolchain pinned and serialized-surface ceilings added;
- P0–P3 stage lock, exact-name deferred loading, and deterministic recovery prevent discovery/search/retry loops;
- P4 named-tool navigation maps high-value defects to first source/test pair;
- P5 semantic-form/orientation/pivot/contact hardening prevents semantic labels and zero-rotation defaults from silently authorizing geometry;
- P6 requires actual reference image evidence, claim IDs, explicit view pairing, and fresh claim-locked reference↔model comparison before material visual approval.

**No new local run is active.** Remaining client/model questions include installed deferred-search parity, real token/latency/image-context cost, and whether model vision correctly interprets actual references. Do not add a router/profile/scorer or remove retained capability without evidence.

## Protected Native Gaps

- TextureMesh direct authoring/inspection;
- native Bedrock visible bounding-box fields;
- animation controllers;
- animation sound/timeline effects;
- animated-texture authoring;
- bone-binding expressions.
