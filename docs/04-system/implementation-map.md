# LazyDesigner Implementation Map

Updated: 2026-09-11

This file maps **current source ownership only**.

Canonical neighboring owners:

```text
product workflow          → docs/01-product/flow.md
reference preparation     → docs/02-reference/README.md
reference handoff         → docs/02-reference/package/handoff.md
AI context loading        → docs/04-system/ai-context-loading.md
current continuation      → docs/05-operations/next-action.md
proof interpretation      → docs/05-operations/current-validation.md
```

## Product Identity

```text
Current product name: LazyDesigner
Former product name: BlockIT
```

Some internal package/runtime identifiers still use legacy `BlockIT` / `blockit-*` values for compatibility. They are migration residue, not a second product.

## Runtime Architecture

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ Gateway
→ Runtime
→ Blockbench native APIs
```

Gateway client surface remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

## Control Ownership

Canonical source path:

```text
mcp/gateway/control/
```

The former `mcp/gateway/navigator/` source path has been removed. No compatibility wrapper or parallel Navigator routing layer remains.

Control owns:

```text
ASSET_AUTHORING / SYSTEM_DEVELOPMENT intake
Runtime/project/phase orientation
Reference Package projection from REFERENCE.json
Active Workspace projection
GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
content-addressed Skill/profile context handles
bounded source/specialist/test routing metadata
stage-scoped readiness/blockers
post-operation control_delta / invalidation
```

Canonical source owners:

```text
mcp/gateway/control/referencePackage.ts   Reference Package projection
mcp/gateway/control/contextProjection.ts stage-specific authoring projection
mcp/gateway/control/packet.ts            task packet/readiness/context selection
mcp/gateway/control/registry.ts          context handles + source-owner mapping
mcp/gateway/control/delta.ts             effect-aware invalidation/delta
mcp/gateway/control/developmentIntent.ts SYSTEM_DEVELOPMENT routing
mcp/gateway/control/snapshot.ts          live Gateway/Runtime orientation
mcp/gateway/control/capabilities.ts      capability decoration
mcp/gateway/control/index.ts             canonical module exports
```

Canonical semantic contracts:

```text
docs/04-system/ai-context-loading.md
docs/04-system/control/context-projection.md
```

Control does not own Skill prose, Tool schemas, full reference content, live model data, persistent asset state, build execution, or Codex creative reasoning.

## Authoring Semantic Ownership

| Domain | Semantic owner | Runtime/source owner |
| --- | --- | --- |
| Geometry / rig / pivots / UV Layout | `.agents/skills/lazydesigner-modelling/SKILL.md` | Geometry/element/rig tool owners |
| Texture / Painter / PBR | `.agents/skills/lazydesigner-texturing/SKILL.md` | Texture/paint/material tool owners |
| Animation / motion / effects/controllers | `.agents/skills/lazydesigner-animation/SKILL.md` | Animation/particle/controller owners |
| Task/stage/context routing | LazyDesigner Control | `mcp/gateway/control/**` |
| Runtime phase/capability classification | `mcp/lib/authoringPhase.ts` | shared by Runtime + Control |
| Reference preparation | `.agents/skills/blockbench-reference-generator/SKILL.md` + `docs/02-reference/` | ChatGPT |

The former `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` router has been removed. Its routing responsibility is now exclusively Control-owned; do not recreate it as an alias or parallel Skill.

## Canonical Phase / Capability Classification

Single canonical owner:

```text
mcp/lib/authoringPhase.ts
```

```text
classifyMcpToolPhaseByName() → import-safe public capability classification
classifyMcpToolPhase()       → Runtime family-aware classification
```

Control consumes this owner and does not maintain a parallel hand-written Geometry/Texturing/Animation catalog.

## Context Loading

```text
Geometry  → .agents/skills/lazydesigner-modelling/SKILL.md + exactly one selected profile when known
Texturing → .agents/skills/lazydesigner-texturing/SKILL.md
Animation → .agents/skills/lazydesigner-animation/SKILL.md
```

Context handles are SHA-256 identities calculated from current canonical files. `known_context_ids` suppresses unchanged content and invalidates changed members of the same context family.

## Readiness / Invalidation

Reference blocking follows active-stage readiness. A future-stage blocker does not block current READY work.

Workspace lifecycle prerequisites:

```text
TEXTURING → Geometry APPROVED + UV Layout PASS
ANIMATION → Geometry APPROVED + UV Layout PASS + Texturing APPROVED
```

Current effect-aware invalidation:

```text
known local Geometry transform      → GEOMETRY
shape/UV-sensitive Geometry change → GEOMETRY + TEXTURING + ANIMATION
hierarchy/pivot structure change   → GEOMETRY + ANIMATION
Texture/material change            → TEXTURING
Animation change                   → ANIMATION
ambiguous structural evidence      → conservative downstream invalidation
```

This marks potentially stale knowledge; it does not itself reset accepted downstream state.

## Gateway Owners

| Concern | Owner |
| --- | --- |
| stable four-tool boundary + Control wiring | `mcp/gateway/index.ts` |
| Control routing/context/delta | `mcp/gateway/control/**` |
| Runtime connection/catalog/queue/project affinity | `mcp/gateway/backend.ts` |
| capability priority/result compaction/runtime signature | `mcp/gateway/contract.ts` |
| project/phase affinity headers | `mcp/gateway/projectAffinity.ts` |
| branch-specific schema reduction | `mcp/gateway/schemaProjection.ts` |
| local vanilla entity support reference | `mcp/gateway/vanillaEntityReference.ts` |

Gateway is not Control. Gateway remains the stable MCP transport boundary; Control selects the minimum task context and routing metadata.

## Runtime / Workspace / Build Owners

```text
Runtime execution          → mcp/server/** + mcp/lib/**
Persistent asset continuity→ workspace/active/<asset>/README.md
Build/generated mechanics  → mcp/build/** + mcp/scripts/** + mcp/distribution/** + mcp/prompts/**
```

Control may project identities/owners from these sources but must not duplicate their persistent state or execution responsibility.

## System Development Routing

```text
User request
→ Control: SYSTEM_DEVELOPMENT
→ resolve problem/feature class
→ bounded source/specialist/test owners
→ minimum development context
→ Codex implementation
→ actual build/generate/deploy owner
```

Unknown or tied intent remains `UNRESOLVED`; Control does not replace uncertainty with a broad repository scan.

## Remaining Migration Debt

```text
legacy BlockIT package/protocol/plugin/environment identifiers outside the Control public contract
remaining PRODUCT_DEVELOPMENT Skill names that have not yet migrated to lazydesigner-* identities
remaining product-facing/runtime strings that can be migrated without compatibility breakage
generated outputs/docs that may encode legacy identifiers until canonical generators run
Experimental Navigator history that must remain explicitly non-authoritative
```

Completed source migrations:

```text
navigator/ → control/
legacy asset-router Skill → removed
ASSET_AUTHORING specialist canonical files → lazydesigner-modelling/texturing/animation
Control capability-domain duplication → removed
metadata-only search/describe status rereads → removed
```

Do not solve remaining debt with permanent aliases or a second routing layer.

## Proof / Efficiency Boundary

Current repository state can establish source ownership and deterministic routing contracts. It does not prove installed Blockbench activation, live Gateway/Runtime behavior, visual fidelity, native playback/persistence, or measured whole-task usage savings.

Efficiency target remains **Cost to Accepted Result**: reduce broad context scans, repeated delivery, discovery/readback loops, wrong-route recovery and unnecessary resets without reducing accepted result quality.
