# Implementation Map

Updated: 2026-09-05

This file maps **current source ownership and target implementation boundaries**. It does not claim a design-locked target is already implemented.

## Primary Owners

| Boundary | Owner |
|---|---|
| task routing / proof | `AGENTS.md` |
| GitHub execution/history/CI | `GITHUB_RULES.md` |
| stable facts | `CONTEXT.md` |
| detailed product flow | `docs/knowledge/flow.md` |
| continuation | `docs/knowledge/next-action.md` |
| proof state | `docs/knowledge/current-validation.md` |
| asset continuity | `workspace/README.md` + `workspace/active/<asset>/README.md` |
| reference-generation spec | `.agents/skills/blockbench-reference-generator/` |
| actual reference generation/approval | ChatGPT |
| asset/Gateway orchestration | `.agents/skills/blockit-bedrock-entity-mcp/` |
| Geometry judgement | `.agents/skills/blockbench-bedrock-modelling/` |
| Texturing judgement | `.agents/skills/blockit-bedrock-texturing/` |
| Animation judgement | `.agents/skills/blockit-bedrock-animation/` |
| architecture/redesign brief | `.agents/skills/development-brief/` |
| MCP public contract | `.agents/skills/mcp-server-development/` |
| Blockbench API/Undo/runtime | `.agents/skills/blockbench-runtime-development/` |
| MCP package mechanics | `mcp/AGENTS.md` + exact source owner |

Do not turn workspace state, Geometry Strategy, authoring phase, capability tier, or internal registration profile into duplicate route systems.

## Canonical Taxonomy

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
  AI client → Gateway → Runtime → Blockbench
```

There is **no automatic strategy classifier**. Complexity, object category, available GLB, or failed modelling never changes strategy without the user.

## Reference Boundary

Canonical ChatGPT board:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

Codex receives the actual approved image + normal user message. No sidecar is required.

## New-Model Gate

Before `create_project`:

```text
Asset
Approved Reference
Dimensions
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

Active Workspace may exist while intake is incomplete; model authoring may not.

## MCP Source Areas

```text
mcp/gateway/              stable client boundary + Runtime adapter
mcp/index.ts              plugin lifecycle
mcp/server/               Runtime transport/resources/prompts
mcp/server/tools/         authored Blockbench operations
mcp/lib/                  schemas/factories/runtime helpers
mcp/lib/authoringPhase.ts Core/phase classification
mcp/ui/                   Blockbench UI/settings
mcp/prompts/              canonical Runtime workflow
mcp/scripts/              promoted repository/local tooling
mcp/tests/                regressions
mcp/docs/                 generated API docs

Experimental/three-d-assisted-hunyuan-poc/  current Shape Reconstruction research
Experimental/primitiveanything-poc/          current PrimitiveAnything/scaffold research
```

## DIRECT Ownership

Current production path:

```text
Approved Reference + Dimensions
→ normal Geometry Runtime capabilities
→ internal verify
→ user Geometry approval
```

## 3D_ASSISTED Target Ownership

One user-facing strategy:

```text
Approved Board
→ fixed LEFT/FRONT/BACK extraction
→ Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Decomposition Gate
→ dedicated atomic Cuboid Materialization
→ Materialization Gate
→ Semantic Geometry Cleanup
→ final Geometry internal verify
```

Execution boundary:

```text
extraction + Shape Reconstruction + PrimitiveAnything
→ external local tooling controlled by Codex

Cuboid materialization + production cleanup
→ Geometry Runtime / Blockbench
```

Architecture term is `Shape Reconstruction`; Hunyuan3D is the single v1 implementation. Do not build a provider interface/router yet.

### Workspace artifacts

```text
workspace/active/<asset>/3d-assisted/
├─ state.json
├─ shape.glb
└─ primitive-decomposition.json
```

README owns asset/stage/user-approval state. `state.json` owns only external 3D-Assisted gate/artifact identity.

### Target external orchestrator — not yet production implemented

One thin resumable entrypoint should perform fixed extraction/validation → Shape Reconstruction → bounded GLB gate → persist GLB/state → PrimitiveAnything → decomposition gate → persist decomposition/state.

Individual Hunyuan/PrimitiveAnything scripts remain debug/development helpers. Do not turn this into a workflow engine/provider registry.

### Target scaffold materializer — not yet production implemented

One dedicated Geometry Runtime capability should:

- accept Active Workspace path only;
- read canonical validated `state.json` + `primitive-decomposition.json`;
- validate schema/hash/reference identity before mutation;
- reject stale/unverified state;
- materialize one temporary Group/Bone + Cube per primitive;
- execute as one atomic reversible Undo transaction;
- return complete scaffold or no accepted scaffold state;
- remain experimental until proof.

Do not revive `from_geo_json`, accept arbitrary primitive arrays, or add a fifth Gateway tool.

## Phase / Approval Ownership

```text
Geometry   shape/hierarchy/rig foundation/pivots/UV Layout/future editability
Texturing  Texture Atlas/Painter/PBR/material state
Animation  motion/keyframes/effects/controllers
```

Internal stage `PASS` means ready for user review, not user approval. Normal forward phase handoff waits for explicit approval + checkpoint save.

Approved upstream stage reopens only for a material blocker owned by it. Invalidate only materially dependent downstream approvals.

## Gateway Boundary

Gateway remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Current Runtime callable union remains **51 tools** at this source baseline; phase surfaces remain Geometry 25, Texturing 35, Animation 19 until executable source deliberately changes.

Future scaffold materialization is a Geometry Runtime capability behind this Gateway.

## Capability Priority

`PRIMARY | SUPPORT | EXPERIMENTAL | MAINTENANCE` remains internal routing only. Do not delete/consolidate capability merely to reduce count. Current GLB helpers and future 3D-Assisted production integration remain experimental until matching proof.

## Hot-Path Defect Index

| Boundary | Source owner | Regression/proof owner |
|---|---|---|
| Gateway surface/ranking | `mcp/gateway/contract.ts`, `backend.ts` | `mcp/tests/gateway-contract.test.ts` |
| phase exposure/handoff | `mcp/lib/authoringPhase.ts`, Skills | `mcp/tests/authoring-phase-surface.test.ts` |
| project / GLB reference | `mcp/server/tools/project.ts` | project/reference contract tests |
| future external 3D-Assisted orchestrator | production owner not yet created; current `Experimental/` | new static + later local proof |
| future scaffold materializer | Geometry Runtime owner not yet created | new targeted contract + live Undo proof |
| Cubes/Groups | `mcp/server/tools/cubes.ts`, `element.ts` | modelling/ownership tests |
| visual capture | `mcp/server/tools/camera.ts` | camera framing contract |
| textures/materials | texture owners under `mcp/server/tools*` | texture/PBR contracts |
| animation | animation owners under `mcp/server/tools*` | animation mutation contracts |
| export | `mcp/server/tools/export.ts` | prelocal generic semantics |

## Protected Boundary

`risky_eval` and `from_geo_json` remain disabled. Generic UI/eval fallback does not become normal authoring or scaffold import.

## Effectiveness / Proof Ownership

**Authoring Quality** asks whether the accepted result is correct. **Authoring Efficiency** is Cost to Accepted Result. **Static Footprint** is only an instruction/schema/surface guardrail.

Static Footprint cannot upgrade runtime **Authoring Efficiency** or visual-quality claims. A smaller tool/skill/schema is not an improvement if work is merely displaced or accepted quality regresses.

Design/source/static proof cannot establish external GPU runtime quality, PrimitiveAnything scaffold quality, atomic materializer Undo behavior, live Gateway lifecycle stability, or final visual fidelity.

Read `docs/knowledge/current-validation.md` for proof and `docs/knowledge/next-action.md` for continuation.
