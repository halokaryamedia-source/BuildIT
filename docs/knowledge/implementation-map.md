# Implementation Map

Updated: 2026-09-05

Current `Local` source/ownership only. This map contains **no active task status**; continuation belongs in `next-action.md`, proof in `current-validation.md`, asset continuity in `workspace/active/<asset>/README.md`.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof discipline | root `AGENTS.md` |
| GitHub execution/history/CI/security | `GITHUB_RULES.md` |
| stable project facts | `CONTEXT.md` |
| detailed product flow | `docs/knowledge/flow.md` |
| continuation | `docs/knowledge/next-action.md` |
| proof state | `docs/knowledge/current-validation.md` |
| active asset continuity | `workspace/README.md` + `workspace/active/<asset>/README.md` |
| reference-generation spec | `.agents/skills/blockbench-reference-generator/` |
| actual reference generation / approval | ChatGPT |
| asset/Gateway orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| modelling judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| texture/PBR judgement | `.agents/skills/blockit-bedrock-texturing/` |
| animation judgement | `.agents/skills/blockit-bedrock-animation/` |
| architecture/redesign contract | `.agents/skills/development-brief/` |
| MCP public/schema/result/transport | `.agents/skills/mcp-server-development/` |
| Blockbench API/lifecycle/UI/Undo | `.agents/skills/blockbench-runtime-development/` |
| MCP TypeScript/Bun implementation mechanics | `mcp/AGENTS.md` + exact source/build owner |

## Canonical Authoring Taxonomy

```text
REFERENCE
  Approved Reference Image = visual authority
  Requested Dimensions     = numeric authority

GEOMETRY STRATEGY — user selected
  DIRECT
  3D_ASSISTED

AUTHORING
  Geometry → Texturing → Animation when required → Finalization

APPROVAL
  Codex internal readiness → user explicit stage approval

CONNECTION
  AI client → BlockIT Gateway → BlockIT Runtime → Blockbench

CAPABILITY TIER — internal only
  PRIMARY | SUPPORT | EXPERIMENTAL | MAINTENANCE
```

There is no automatic strategy classifier. Object category, complexity, generated GLB, or failed modelling never changes strategy without explicit user choice.

## MCP Source Areas

```text
mcp/gateway/                   stable client boundary + Runtime adapter
mcp/index.ts                   plugin lifecycle
mcp/server/                    Runtime transport/resources/prompts
mcp/server/tools/              authored public operations
mcp/server/threeDAssistedMaterializer.ts
                               internal atomic 3D-Assisted Blockbench materializer engine
mcp/lib/threeDAssistedProduction.ts
                               canonical external state/decomposition/materialization-plan schemas
mcp/lib/                       other schemas/factories/runtime helpers
mcp/lib/authoringPhase.ts      Core/phase classification + handoff contract
mcp/lib/registrationProfile.ts internal Runtime compatibility
mcp/ui/                        Blockbench panel/settings
mcp/prompts/                   canonical workflow + generated manifest
mcp/build/                     build/docs/manifest generation + developer watch policy
mcp/scripts/three-d-assisted-run.ts
                               production external 3D-Assisted orchestrator
mcp/scripts/three-d-assisted/  deterministic reference extraction + operator contract
mcp/scripts/                   other verification/measurement/deploy utilities
mcp/tests/                     contract/integration regressions
mcp/docs/                      generated API docs; secondary to source
Experimental/                  pinned external implementation backends/research
```

Developer-loop owner remains: **developer loop: `dev:watch`, prompt watch regeneration, `deploy:local`** → `mcp/build/`, `mcp/scripts/` with regression `mcp/tests/developer-loop.test.ts`.

## Geometry Strategy Ownership

### DIRECT

Current production path uses normal Geometry specialists + Runtime capabilities.

### 3D_ASSISTED

```text
Approved Board
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ atomic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ final Geometry internal verify
```

External production owner is `mcp/scripts/three-d-assisted-run.ts`. It consumes only an absolute Active Workspace, persists accepted artifacts under `workspace/active/<asset>/3d-assisted/`, is resumable from validated hashes, and stops for explicit Shape/Decomposition gates. Hunyuan/PrimitiveAnything scripts remain pinned implementation backends under `Experimental/`; do not add a provider router until a second real implementation is required.

Canonical state/data semantics are owned by `mcp/lib/threeDAssistedProduction.ts`. Canonical persistent files are `state.json`, `shape.glb`, and `primitive-decomposition.json`; candidates/previews stay in `.cache/`.

Blockbench conversion engine is `mcp/server/threeDAssistedMaterializer.ts`: Active Workspace only, strict schema/provenance/hash/dimension validation, full preflight before mutation, one native Undo transaction, one temporary `pa_<id>` Group/Bone + Cube per accepted primitive, rollback on exception.

**Public materializer ToolSpec binding is the narrow LOCAL_CODE handoff.** It must expose the existing engine as one Geometry Runtime capability accepting only `workspace_path`, keep the Gateway at four tools, and use canonical `docs:build`/`docs:check` before completion. Do not hand-edit generated API docs and do not revive `from_geo_json`.

## Phase / Approval Ownership

```text
Core       lifecycle, focused inspection, recovery, capture, export, phase control
Geometry   shape/hierarchy/rig foundation/pivots/UV Layout/future editability
Texturing  Texture Atlas/Painter/PBR/materials/Texture Verify
Animation  motion/keyframes/effects/controllers
```

Internal stage PASS means ready for user review, not approval. Forward handoff waits for explicit user approval + checkpoint. Reopen upstream only for a material owner defect and invalidate only materially dependent downstream approvals.

## Gateway / Runtime Boundary

Gateway remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Current Runtime callable union is **51 tools**; current native phase surfaces remain Geometry 25, Texturing 35, Animation 19 until the local public materializer binding deliberately changes Geometry/union counts. Generated API inventory contains **77 declared source ToolSpecs**, including disabled/source-preserved definitions; that inventory is not the active client surface. A materializer is a Runtime capability behind the existing Gateway, never a fifth Gateway tool.

## Hot-Path Defect Index

| Tool(s) / boundary | Source owner | Primary regression owner |
|---|---|---|
| Gateway stable surface / ranking | `mcp/gateway/contract.ts`, `mcp/gateway/backend.ts` | `mcp/tests/gateway-contract.test.ts` |
| phase exposure / `HANDOFF_REQUIRED` | `mcp/lib/authoringPhase.ts`, active Skills | `mcp/tests/authoring-phase-surface.test.ts` |
| developer loop | `mcp/build/`, `mcp/scripts/` | `mcp/tests/developer-loop.test.ts` |
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `manage_geometry_reference` | `mcp/server/tools/project.ts` | `mcp/tests/geometry-reference-contract.test.ts` |
| `manage_cubes` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `inspect_elements` | `mcp/server/tools.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `manage_locator`, `manage_null_object` | `mcp/server/tools/locators.ts` | `mcp/tests/bedrock-locator-coverage.test.ts` |
| `manage_animation_controller` | `mcp/server/tools/animation-controller.ts` | `mcp/tests/animation-controller-mutation-contract.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |
| external 3D-Assisted state/orchestration | `mcp/lib/threeDAssistedProduction.ts`, `mcp/scripts/three-d-assisted-run.ts` | `mcp/tests/three-d-assisted-production-contract.test.ts` |
| atomic scaffold materializer engine | `mcp/server/threeDAssistedMaterializer.ts` | `mcp/tests/three-d-assisted-production-contract.test.ts` + later live Undo proof |

## Protected Capability Map

Protected gaps remain explicit and must not be bypassed through generic UI/eval fallback:

- controller blend-curve mutation;
- TextureMesh direct authoring/inspection;
- native visible bounding-box fields;
- animated textures;
- bone-binding expressions.

Locator/Null is available through `manage_locator` / `manage_null_object`; material instances are available through `manage_material_instances`; animation controller lifecycle is available through `manage_animation_controller`.

## Protected Boundary

`risky_eval` and `from_geo_json` remain disabled. Generic UI/eval fallback does not become normal authoring or scaffold import. Internal `extended` remains Legacy UI Fallback compatibility, not an authoring profile.

## Effectiveness / Proof Ownership

**Authoring Quality** = accepted result quality. **Authoring Efficiency** = Cost to Accepted Result. **Static Footprint** = instruction/schema/surface guardrail only.

**Static Footprint cannot upgrade** Authoring Efficiency or visual-quality claims. Source/static proof cannot establish external GPU quality, PrimitiveAnything quality, installed Gateway lifecycle, native materializer Undo behavior, or final visual fidelity.
