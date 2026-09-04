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
| MCP TypeScript/Bun implementation mechanics | `mcp/AGENTS.md` + exact affected source/build owner |

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

There is no automatic strategy classifier. Object category, complexity, available GLB, or failed modelling never changes strategy without explicit user choice.

## Source Areas

```text
mcp/gateway/                   stable client boundary + Runtime adapter
mcp/index.ts                   plugin lifecycle
mcp/server/                    Runtime transport/resources/prompts
mcp/server/tools/              authored operations
mcp/lib/                       schemas/factories/runtime helpers
mcp/lib/authoringPhase.ts      Core/phase classification + handoff contract
mcp/lib/registrationProfile.ts internal Runtime compatibility
mcp/ui/                        Blockbench panel/settings
mcp/prompts/                   canonical workflow + generated manifest
mcp/build/                     build/docs/manifest generation + developer watch policy
mcp/scripts/                   verification/measurement/preparation/local-deploy utilities
mcp/tests/                     contract/integration regressions
mcp/docs/                      generated API docs; secondary to source
Experimental/                  bounded research only
```

Developer-loop owner remains: **developer loop: `dev:watch`, prompt watch regeneration, `deploy:local`** → `mcp/build/`, `mcp/scripts/` with regression `mcp/tests/developer-loop.test.ts`.

## Geometry Strategy Ownership

### DIRECT

Current production path uses normal Geometry specialists + Runtime capabilities.

### 3D_ASSISTED — target production contract

```text
Approved Board
→ deterministic LEFT/FRONT/BACK extraction
→ Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ dedicated atomic Cuboid Materialization
→ Cuboid Materialization Gate
→ Semantic Geometry Cleanup
→ final Geometry internal verify
```

Execution boundary:

```text
extraction + Shape Reconstruction + PrimitiveAnything → external local tooling controlled by Codex
Cuboid materialization + semantic production cleanup  → Geometry Runtime / Blockbench
```

Architecture term = `Shape Reconstruction`; Hunyuan3D is the single v1 implementation. Do not create provider router/interface until another implementation is actually required.

Canonical 3D-Assisted workspace:

```text
workspace/active/<asset>/3d-assisted/
├─ state.json
├─ shape.glb
└─ primitive-decomposition.json
```

Target external orchestrator: one thin resumable normal-use entrypoint; current `Experimental/three-d-assisted-hunyuan-poc/` + `Experimental/primitiveanything-poc/` remain research/implementation evidence only.

Target scaffold materializer: one dedicated Geometry Runtime capability behind the existing Gateway; Active Workspace path only, canonical state/hash validation, one atomic Undo transaction, one temporary Group/Bone + Cube per primitive. Do not revive `from_geo_json` or accept arbitrary primitive arrays.

**Current status:** orchestrator/state contract and dedicated production materializer are design-locked but not yet production-implemented/promoted.

## Phase / Approval Ownership

```text
Core       lifecycle, focused inspection, recovery, capture, export, phase control
Geometry   shape/hierarchy/rig foundation/pivots/UV Layout/future editability
Texturing  Texture Atlas/Painter/PBR/materials/Texture Verify
Animation  motion/keyframes/effects/controllers
```

Internal stage PASS means ready for user review, not approval. Normal forward phase handoff waits for explicit user approval + checkpoint save. Reopen upstream only for a material owner defect and invalidate only materially dependent downstream approvals.

## Gateway / Runtime Boundary

Gateway remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Current Runtime callable union is **51 tools**; current native phase surfaces remain Geometry 25, Texturing 35, Animation 19 until executable source deliberately changes. Generated API inventory contains **77 declared source ToolSpecs**, including disabled/source-preserved definitions; that is not the active client surface.

A future scaffold materializer is a Geometry Runtime capability behind the existing Gateway, not a fifth Gateway tool.

## Hot-Path Defect Index

| Tool(s) / boundary | Source owner | Primary regression owner |
|---|---|---|
| Gateway stable surface / ranking | `mcp/gateway/contract.ts`, `mcp/gateway/backend.ts` | `mcp/tests/gateway-contract.test.ts` |
| phase exposure / `HANDOFF_REQUIRED` | `mcp/lib/authoringPhase.ts`, active Skills | `mcp/tests/authoring-phase-surface.test.ts` |
| `create_project` | `mcp/server/tools/project.ts` | `mcp/tests/p1-core-ownership.test.ts` |
| `inspect_model_bounds` | `mcp/server/tools/project.ts` | `mcp/tests/rendered-model-bounds-numeric-safety.test.ts` |
| `manage_geometry_reference` | `mcp/server/tools/project.ts` | `mcp/tests/geometry-reference-contract.test.ts` |
| `manage_cubes` | `mcp/server/tools/cubes.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `inspect_elements` | `mcp/server/tools.ts` | `mcp/tests/model-effectiveness-correction-accuracy.test.ts` |
| `capture_model_views` | `mcp/server/tools/camera.ts` | `mcp/tests/camera-framing-contract.test.ts` |
| `export_model` | `mcp/server/tools/export.ts` | `mcp/tests/prelocal-generic-semantics.test.ts` |
| future 3D-Assisted orchestrator | production owner not yet created; current `Experimental/` | new static + later local proof |
| future scaffold materializer | Geometry Runtime owner not yet created | new targeted contract + live Undo proof |

## Protected Boundary

`risky_eval` and `from_geo_json` remain disabled. Generic UI/eval fallback does not become normal authoring or scaffold import. Internal `extended` remains Legacy UI Fallback compatibility, not an authoring profile.

## Effectiveness / Proof Ownership

**Authoring Quality** = accepted result quality. **Authoring Efficiency** = Cost to Accepted Result. **Static Footprint** = instruction/schema/surface guardrail only.

**Static Footprint cannot upgrade** Authoring Efficiency or visual-quality claims. Smaller tool/skill/schema size is not improvement when work is displaced or accepted quality regresses.

Design/source/static proof cannot establish external GPU quality, PrimitiveAnything scaffold quality, atomic materializer Undo behavior, live Gateway lifecycle, or final visual fidelity.
