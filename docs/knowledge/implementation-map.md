# Implementation Map

Updated: 2026-09-04

Current `Local` source/ownership only. This map contains **no active task status**. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/knowledge/current-validation.md`; asset continuity belongs in `workspace/active/<project>/README.md`.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| GitHub execution/history/CI/security | `GITHUB_RULES.md` |
| stable project facts | root `CONTEXT.md` |
| detailed product flow | `docs/knowledge/flow.md` |
| repository/plugin continuation | `docs/knowledge/next-action.md` |
| current proof state | `docs/knowledge/current-validation.md` |
| active asset continuity | `workspace/active/<project>/README.md` |
| reference preparation specification | `.agents/skills/blockbench-reference-generator/` |
| reference image generation / approval | ChatGPT conversation workflow |
| asset orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR judgement | `.agents/skills/blockit-bedrock-texturing/` |
| animation judgement | `.agents/skills/blockit-bedrock-animation/` |
| complex / ambiguous development contract | `.agents/skills/development-brief/` |
| MCP public/schema/result/transport | `.agents/skills/mcp-server-development/` |
| Blockbench API/lifecycle/UI/Undo | `.agents/skills/blockbench-runtime-development/` |
| MCP TypeScript/Bun implementation mechanics | `mcp/AGENTS.md` + exact affected source/build owner |
| local acceptance procedure | `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated |

Workspace is storage/continuity, not an MCP capability family. Reference evidence, Geometry strategy, Runtime compatibility flags, and authoring phase are distinct concepts; do not turn them into parallel user-facing route systems.

## MCP Source Areas

```text
mcp/gateway/                   stable client boundary + Runtime adapter
mcp/index.ts                   plugin lifecycle
mcp/server/                    Runtime transport/tools/resources/prompts
mcp/server/tools/              authored operations
mcp/lib/                       schemas/factories/identity/result/runtime helpers
mcp/lib/authoringPhase.ts      Core/phase classification + Gateway-aware handoff contract
mcp/lib/registrationProfile.ts internal Runtime family compatibility
mcp/lib/threeDAssistedReferenceAlignment.ts
                               legacy/experimental GLB evidence alignment planning
mcp/ui/                        Blockbench panel/settings
mcp/prompts/                   canonical workflow body + generated manifest
mcp/build/                     build/docs/manifest generation + developer watch policy
mcp/scripts/                   verification/measurement/preparation/local-deploy utilities
mcp/tests/                     contract/integration regressions
mcp/docs/                      generated Runtime API docs; secondary to source

Experimental/primitiveanything-poc/
                               Organic-Complex Geometry scaffold research:
                               approved image → GLB → PrimitiveAnything → Cuboid Scaffold
Experimental/three-d-assisted-hunyuan-poc/
                               shape-GLB generation/evidence research and retained reproducibility
```

The test folder owns test-only CI routing. `verify:mcp` still runs the recursive executable suite when Runtime/Gateway behavior changes.

## Canonical Authoring Taxonomy

```text
REFERENCE
  approved image        required visual authority for reference-driven work
  requested dimensions  numeric envelope authority

GEOMETRY STRATEGY
  Image-Guided
    simple / mostly cuboid / mechanically readable

  Organic-Complex
    organic humanoid/animal or comparable curved form
    with many rotations/bends/non-cuboid volume relationships
    approved image → shape GLB → PrimitiveAnything → Cuboid Scaffold

AUTHORING PHASE
  Geometry → Texturing → Animation when required

CONNECTION
  normal AI client → BlockIT Gateway → BlockIT Runtime

CAPABILITY TIER (internal routing only)
  PRIMARY | SUPPORT | EXPERIMENTAL | MAINTENANCE
```

`complex` for Geometry-strategy selection means **organic-form complexity**, not simply many parts, a large project, or a high Cube count. A mechanically explicit object may contain many parts and remain Image-Guided. A humanoid/animal may qualify as Organic-Complex when its rotations, bends, articulation, irregular silhouette, and curved volume transitions make direct cuboid inference materially harder.

Both Geometry strategies converge into the same production Geometry owner, then the same Texturing, optional Animation, and export flow. Do not create a PrimitiveAnything authoring phase, Hunyuan profile, second Gateway, or separate Texturing path.

Normal authoring has no Standard/Extended profile choice: internal `bedrock_entity` remains the Runtime default, while internal `extended` exists only for Legacy UI Fallback compatibility.

## Gateway / Runtime Boundary

Gateway exposes four stable client tools:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Runtime retains **51 callable tools across authoring phases**. Native phase surfaces remain Geometry 25, Texturing 35, Animation 19. Gateway search ranks Runtime capabilities by primary/support/experimental/maintenance priority without deleting capability or changing the stable client tool list.

Direct Runtime MCP remains for Inspector/conformance/debugging. Normal Codex authoring does not depend on direct Runtime `tools/list` stability.

## Phase Ownership

```text
Core       lifecycle, focused inspection/discovery, selection, read-only UV audit,
           history/recovery, canonical capture, export, phase control
Geometry   Cube/Group/rig/Locator/Null mutation, structural delete/rename,
           UV Layout mutation, Image-Guided authoring, Organic-Complex scaffold cleanup
Texturing  Texture Atlas, Painter, PBR/materials, material instances, Texture Verify
Animation  animation/keyframe/timeline/effect/controller work + inspection
```

Foreign-phase need:

```text
HANDOFF_REQUIRED
→ preserve target_phase + reason + readiness + resume_from
→ switch_authoring_phase through Gateway
→ Gateway refreshes backend catalog
→ continue same task with next specialist
```

`HANDOFF_REQUIRED` stops use of prior-phase mutation tools; it does not require a new chat or normal client reconnect.

## Geometry Strategy Ownership

### Image-Guided

Production owner is the normal Geometry specialist + existing Geometry Runtime capabilities.

```text
approved image
→ semantic Groups/Cubes
→ reference comparison
→ Geometry PASS
```

### Organic-Complex

Current intended preparation boundary:

```text
approved image
→ shape GLB generation/approval
→ PrimitiveAnything decomposition
→ deterministic Cuboid Scaffold conversion
→ native editable Blockbench Groups/Cubes
→ semantic Geometry cleanup/refinement
→ Geometry PASS
```

Authority:

```text
approved image       visual authority
requested dimensions numeric authority
shape GLB            intermediate 3D shape evidence
PrimitiveAnything    intermediate decomposition
Cuboid Scaffold      editable starting geometry, never automatic final authority
```

Current PrimitiveAnything production promotion is **not complete**. The experimental source remains under `Experimental/primitiveanything-poc/` until its scaffold quality, BlockIT integration boundary, dimension/orientation contract, semantic cleanup rules, and downstream UV handoff are explicitly resolved/proven.

## Capability Priority

Primary capabilities are the normal hot path; support capabilities remain available for explicit conditional needs. Current GLB/reference helpers and future PrimitiveAnything scaffold integration remain experimental until promoted. Generic UI fallbacks such as `trigger_action`, `emulate_clicks`, and `fill_dialog` are maintenance/debug capabilities and must not outrank authored BlockIT operations. `risky_eval` and `from_geo_json` remain disabled.

Texturing remains the largest phase. Do **not** consolidate tools only to reduce count. First measure Gateway-routed discovery and Cost to Accepted Result. Consolidation is justified only by repeated selection/call overhead with no capability loss.

## Reference / Scaffold Evidence Ownership

```text
approved image / visual authority        → ChatGPT approval + modelling judgement
requested dimensions / numeric authority → user/project requirement
shape GLB generation/provenance           → Experimental provider owner while unpromoted
PrimitiveAnything decomposition            → Experimental/primitiveanything-poc/
Cuboid conversion                           → Experimental/primitiveanything-poc/
future native scaffold materialization      → Geometry Runtime owner when designed/promoted
visual comparison                           → normal Geometry capture/judgement
production cleanup/export                   → normal Geometry/export owners
```

Do not treat GLB bounds, PrimitiveAnything primitive count, Cuboid count, or converter display scale as final numeric authority.

## Hot-Path Defect Index

For a named defect, inspect the mapped source owner + regression owner first.

| Tool(s) / boundary | Source owner | Primary regression owner |
|---|---|---|
| Gateway stable surface / capability ranking | `mcp/gateway/contract.ts`, `mcp/gateway/backend.ts` | `mcp/tests/gateway-contract.test.ts` |
| authoring phase exposure / `HANDOFF_REQUIRED` | `mcp/lib/authoringPhase.ts`, active specialist Skills | `mcp/tests/authoring-phase-surface.test.ts` |
| developer loop: `dev:watch`, prompt watch regeneration, `deploy:local` | `mcp/build/index.ts`, `mcp/build/watch-policy.ts`, `mcp/scripts/deploy-local.ts` | `mcp/tests/developer-loop.test.ts` |
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `manage_geometry_reference` | `mcp/server/tools/project.ts` | `mcp/tests/geometry-reference-contract.test.ts` |
| GLB evidence alignment math | `mcp/lib/threeDAssistedReferenceAlignment.ts` | `mcp/tests/three-d-assisted-reference-alignment.test.ts` |
| PrimitiveAnything POC | `Experimental/primitiveanything-poc/` | experimental proof only; no production regression owner yet |
| `manage_cubes` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `add_group` | `mcp/server/tools/element.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `inspect_elements` | `mcp/server/tools.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `manage_locator`, `manage_null_object` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |
| `create_texture`, `list_textures`, `get_texture`, `activate_texture` | `mcp/server/tools/texture.ts` | `mcp/tests/context-payload-cleanup.test.ts` |
| `manage_material` | `mcp/server/tools.ts` → `mcp/server/tools/texture.ts` | `mcp/tests/pbr-channel-contract.test.ts` |
| `manage_animation_timeline` | `mcp/server/tools.ts` → animation owners | `mcp/tests/animation-mutation-contract.test.ts` |
| `manage_animation_effects` | `mcp/server/tools/animation-effects.ts` | `mcp/tests/animation-effect-mutation-contract.test.ts` |
| `manage_animation_controller` | `mcp/server/tools/animation-controller.ts` | `mcp/tests/animation-controller-mutation-contract.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |

`three-d-assisted:prepare`, `three-d-assisted:package`, and PrimitiveAnything POC scripts are experimental utilities, not stable MCP callable tools.

## Protected Capability Gaps

Protected gaps remain explicit and must not be bypassed through generic UI/eval fallbacks:

- controller blend-curve mutation;
- TextureMesh direct authoring/inspection;
- native visible bounding-box fields;
- animated textures;
- bone-binding expressions.

Locator/Null coverage is available through `manage_locator` / `manage_null_object`; material instances are available through `manage_material_instances`. Protected gaps require new evidence before architecture expansion.

## Catalog / Generated Inventory

The current Runtime callable union is **51 tools**. Generated API docs enumerate **77 declared source ToolSpecs**, including disabled/source-preserved definitions; that inventory is not an active client surface.

Catalog/static ceilings remain source guardrails only. A smaller tool list is not automatically better authoring.

## Effectiveness / Proof Ownership

```text
Static Footprint
→ mcp/tests/authoring/static-footprint-budget.test.ts
→ instruction/schema/surface compactness only

Capability discovery proxy
→ mcp/tests/tool-discovery-eval.test.ts + Gateway contract tests
→ ranking quality only

Authoring Quality + Authoring Efficiency
→ docs/knowledge/operations/local-acceptance-runbook.md
→ exact current local artifact + runtime/visual evidence
→ Cost to Accepted Result
```

Static Footprint cannot upgrade runtime Authoring Efficiency or visual-quality claims. Source/static taxonomy cleanup cannot prove live Gateway stability or PrimitiveAnything scaffold quality by itself.

## Continuation Boundary

Read `docs/knowledge/next-action.md` for active continuation and `docs/knowledge/current-validation.md` for current proof. Historical rationale and discarded route/profile experiments belong in Git history.