# Implementation Map

Updated: 2026-09-01

Current `Local` source/ownership only. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/knowledge/current-validation.md`; asset continuity belongs in `workspace/active/<project>/README.md`.

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
| current proof state | `docs/knowledge/current-validation.md` |
| reference preparation | `.agents/skills/blockbench-reference-generator/` |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR judgement | `.agents/skills/blockit-bedrock-texturing/` |
| animation judgement | `.agents/skills/blockit-bedrock-animation/` |
| complex / ambiguous development contract | `.agents/skills/development-brief/` |
| MCP public/schema/result/transport | `.agents/skills/mcp-server-development/` |
| Blockbench API/lifecycle/UI/Undo | `.agents/skills/blockbench-runtime-development/` |
| MCP TypeScript/Bun implementation mechanics | `mcp/AGENTS.md` + exact affected source/build owner |
| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated |

Workspace is storage/continuity, not an MCP capability family. TypeScript and Bun are implementation mechanics inside the selected owner, not standalone root specialist routes.

## MCP Source Areas

```text
mcp/index.ts                   plugin lifecycle
mcp/server/                    transport/tools/resources/prompts
mcp/server/tools/              authored operations
mcp/lib/                       schemas/factories/identity/result helpers
mcp/lib/authoringPhase.ts      Core/phase classification + active-phase/handoff contract
mcp/lib/threeDAssistedReferenceAlignment.ts
                               pure 3D-Assisted Evidence fit-envelope + center/ground planning
mcp/ui/                        Blockbench panel/settings
mcp/prompts/                   canonical workflow body + generated manifest
mcp/build/                     build/docs/manifest generation + developer watch policy
mcp/build/watch-policy.ts      dev:watch production-input routing
mcp/scripts/                   verification/measurement/preparation/local-deploy utilities
mcp/scripts/deploy-local.ts    explicit local Blockbench plugin deployment
mcp/tests/repository/          repository/routing/static verifier regressions
mcp/tests/authoring/           authoring/effectiveness/static verifier regressions
mcp/tests/*.test.ts            executable/default package regressions
mcp/docs/                      generated API docs; secondary to source
```

The test folder owns **test-only CI routing**. `verify:mcp` still runs the recursive full test suite when executable/public MCP source changes, so folder separation does not reduce source-change regression coverage.

## Hot-Path Defect Index

For a named MCP-tool defect, inspect the mapped **source owner + primary regression owner first**. Expand only when that pair cannot explain the defect.

| Tool(s) / boundary | Source owner | Primary regression owner |
|---|---|---|
| authoring phase exposure / `HANDOFF_REQUIRED` | `mcp/lib/authoringPhase.ts`, `mcp/server/server.ts`, active specialist Skills | `mcp/tests/authoring-phase-surface.test.ts` |
| developer loop: `dev:watch`, prompt watch regeneration, `deploy:local` | `mcp/build/index.ts`, `mcp/build/watch-policy.ts`, `mcp/scripts/deploy-local.ts` | `mcp/tests/developer-loop.test.ts` |
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `get_project_info` | `mcp/server/tools/project.ts` | `mcp/tests/authoring/static-footprint-budget.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `manage_geometry_reference` | `mcp/server/tools/project.ts` | `mcp/tests/geometry-reference-contract.test.ts` |
| 3D-Assisted Evidence alignment math | `mcp/lib/threeDAssistedReferenceAlignment.ts` | `mcp/tests/three-d-assisted-reference-alignment.test.ts` |
| 3D-Assisted Evidence quantitative/reconnect evidence | `mcp/server/tools/project.ts`, `mcp/server/resources.ts` | `mcp/tests/geometry-reference-contract.test.ts` |
| 3D-Assisted Evidence reference capture / production cleanup | `mcp/server/tools/camera.ts`, `mcp/server/tools/export.ts` | `mcp/tests/camera-framing-contract.test.ts`, `mcp/tests/geometry-reference-contract.test.ts` |
| 3D-Assisted Evidence Hunyuan MultiView reproducibility | `Experimental/three-d-assisted-hunyuan-poc/generate_multiview_shape.py`, `Experimental/three-d-assisted-hunyuan-poc/README.md` | `mcp/tests/authoring/three-d-assisted-hunyuan-reproducibility.test.ts` |
| 3D-Assisted Evidence fixture preparation / packaging | `mcp/scripts/three-d-assisted-fixture.ts`, `mcp/package.json` | `mcp/tests/three-d-assisted-fixture-preparation.test.ts` |
| `manage_cubes` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `add_group` | `mcp/server/tools/element.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `list_outline`, `find_elements_by_criteria` | `mcp/server/tools/element.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `inspect_elements` facade (`mode=detail`) | `mcp/server/tools.ts` → `mcp/server/tools/element-inspection.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `list_locator_elements`, `manage_locator`, `manage_null_object` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |
| `create_texture`, `list_textures`, `get_texture`, `activate_texture` | `mcp/server/tools/texture.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `manage_animation_effects` | `mcp/server/tools/animation-effects.ts` | `mcp/tests/animation-effect-mutation-contract.test.ts` |
| `manage_animation_controller` | `mcp/server/tools/animation-controller.ts` | `mcp/tests/animation-controller-mutation-contract.test.ts` |
| `inspect_animation` | `mcp/server/tools/animation-inspection.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `get_undo_stack`, `undo`, `redo` | `mcp/server/tools/history.ts` | `mcp/tests/authoring/static-footprint-budget.test.ts` for compact recovery state; targeted history tests for behavior |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |

`three-d-assisted:prepare` and `three-d-assisted:package` are Bun preparation commands, not MCP callable tools. They do not change the retained catalog or active Geometry surface.

## 3D-Assisted Evidence Ownership

The selected 3D-Assisted Evidence production reference path is:

```text
approved image + requested dimensions
+ approved shape-only GLB
→ manage_geometry_reference
→ raw bounds observation
→ threeDAssistedReferenceAlignment fit-envelope plan
→ uniform scale update
→ fresh bounds observation
→ threeDAssistedReferenceAlignment center-X/Z + ground-Y plan
→ origin update
→ canonical aligned captures
→ semantic Groups/Cubes
→ remove transient reference
→ production .bbmodel
```

Ownership is deliberately split:

```text
approved image / visual authority        → reference + modelling judgement
requested dimensions / numeric authority → user/fixture requirement
GLB generation/provenance                 → Experimental/three-d-assisted-hunyuan-poc
GLB lifecycle / live evidence             → mcp/server/tools/project.ts
alignment math                            → mcp/lib/threeDAssistedReferenceAlignment.ts
visual framing                            → mcp/server/tools/camera.ts
production cleanup/export                 → mcp/server/tools/export.ts
semantic Minecraft geometry               → normal Geometry owners
```

The 3D-Assisted Evidence is transient evidence, never production geometry. It remains root-only, locked, `export=false`, and uniformly scaled. Raw GLB bounds do not define target dimensions. No mesh-to-Cube conversion, voxelizer, repair/decimation pipeline, non-uniform scale, or quality score belongs in the 3D-Assisted workflow without a new explicitly evidenced requirement.

The Image Reference Route is the default. The image + 3D-Assisted Evidence workflow is optional and must never block it. Image-only versus image + evidence is **not** an acceptance gate.

## Effectiveness / Footprint Evidence Ownership

```text
Static Footprint
→ mcp/tests/authoring/static-footprint-budget.test.ts
→ instruction/schema/surface compactness only

Authoring Quality + Authoring Efficiency
→ docs/knowledge/operations/local-acceptance-runbook.md
→ exact current local artifact + visual/runtime evidence
→ Cost to Accepted Result
```

Static Footprint cannot upgrade a runtime Authoring Efficiency or visual-quality claim.

## MCP Catalog / Phase Exposure

The current runtime Bedrock catalog retains **51 callable tools across phases**. It is not exposed to Codex all at once.

Generated API docs enumerate **77 declared source ToolSpecs**, including disabled/source-preserved definitions. That documentation inventory is not the retained callable catalog and is not an active client surface.

```text
MCP CORE + exactly one active phase

geometry   = Cube/Group/rig/Locator/Null + 3D-Assisted Evidence lifecycle + structural delete/rename + UV Layout mutation
texturing  = Texture Atlas + Painter + PBR + material instances
animation  = animation/keyframes/timeline/effects/controllers/inspection
```

Default active phase is `geometry`; current Geometry exposure is **25 tools**. `manage_geometry_reference` is Geometry-owned and does not enter Texturing/Animation. `list_textures` is read-only MCP Core because Geometry needs the global UV audit before Texturing handoff. `remove_element` and `rename_element` are Geometry-owned structural mutation, not cross-phase Core.

Runtime initialize instructions name `ACTIVE PHASE`, explain why foreign-phase tools are absent, and require:

```text
foreign-phase need
→ HANDOFF_REQUIRED
→ target_phase + reason + resume_from
→ set MCP Authoring Phase=<target>
→ reload BlockIT MCP
→ STOP
```

A known foreign-phase tool is never a `tool_search` miss and must not be emulated or substituted.

Catalog/static regression ceilings remain:

```text
initialize instructions       <= 700 characters
catalog tools/list budget     <= 82,000 characters
catalog input schemas         <= 58,500 characters
catalog descriptions          <= 11,500 characters
per-tool payload max          <= 3,200 characters
```

`measure:surface` owns catalog serialized values. `authoring-phase-surface.test.ts` owns phase exposure/agent-legibility. Serialized characters are not client token/context measurements and are not Authoring Efficiency proof.

## Authoring Decision / Recovery Ownership

```text
ACTIVE PHASE + intent + known state
→ exact exposed tool when known
→ focused discovery only for an active-phase tool with stale/unknown target/spec
→ execute
→ reuse returned continuation state
→ bounded recovery from actual failure evidence

foreign-phase mutation required
→ HANDOFF_REQUIRED
→ STOP
```

Do not turn a professional sample, reference fixture, or one failed model into a global modelling recipe or runtime invariant without generic evidence.

## Current Bedrock Ownership

- MCP Core: lifecycle, focused discovery/inspection, selection, read-only global UV/atlas audit, history/recovery, canonical capture, export;
- Geometry: `manage_geometry_reference`, 3D-Assisted Evidence alignment planning, `manage_cubes`, `add_group`, structural delete/rename, Locator/Null mutation, `bone_rigging`, UV Layout mutation;
- Texturing: Texture Atlas lifecycle, Painter, PBR, material instances, Texture Verify;
- Animation: numeric/Molang transforms, keyframes/timeline, effect mutation, AnimationController state-machine/state-effect mutation, animation inspection.

Project lifecycle is the implementation owner for `create_project` and `get_project_info`; their phase category is MCP Core. Core observation owns `inspect_model_bounds`, while project lifecycle does not own geometry mutation. This is the intentional boundary—no duplicate Core/Project facade or wrapper is required.

3D-Assisted Evidence is transient authoring state: approved image/dimensions remain authority, raw GLB bounds are observation only, and the tool-owned reference must be removed before production `.bbmodel` export. Runtime ownership survives rename; non-root, unlocked, export-enabled, or non-uniformly scaled evidence references fail closed until removed/reloaded.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Continuation Boundary

This map contains no active task status. Read `docs/knowledge/next-action.md` for continuation and `docs/knowledge/current-validation.md` for current proof. Historical audits, fixture-specific rationale, and discarded approaches belong in Git history.
