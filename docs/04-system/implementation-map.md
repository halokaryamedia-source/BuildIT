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

Some internal identifiers still use legacy `BlockIT` / `blockit-*` names during migration. They are compatibility residue, not a second product.

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

Current executable path after Control routing reaches Gateway remains:

```text
Codex / AI client
→ mcp/gateway/index.ts
→ mcp/gateway/backend.ts
→ loopback Runtime transport
→ mcp/server/**
→ Blockbench native APIs
```

Gateway client surface remains four tools:

```text
status
search_capabilities
describe_capability
invoke_capability
```

## Control Ownership

LazyDesigner Control is now the active semantic/public routing contract (`lazydesigner-control-v1`). Its source is still physically located under the temporary legacy path:

```text
mcp/gateway/navigator/
```

The physical path is migration residue only. There is no active parallel Navigator architecture.

Current Control implementation owns:

```text
ASSET_AUTHORING / SYSTEM_DEVELOPMENT intake
Runtime/project/phase orientation projection
Reference Package projection from REFERENCE.json
Active Workspace projection
GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
content-addressed Skill/profile context handles
bounded source/capability routing metadata
stage-scoped readiness/blockers
post-operation Control delta/invalidation
```

Implemented source owners:

```text
mcp/gateway/navigator/referencePackage.ts   Reference Package projection
mcp/gateway/navigator/contextProjection.ts stage-specific authoring projection
mcp/gateway/navigator/packet.ts            task packet/readiness/context selection
mcp/gateway/navigator/registry.ts          context handles + source-owner mapping
mcp/gateway/navigator/delta.ts             post-operation invalidation/delta
mcp/gateway/navigator/developmentIntent.ts SYSTEM_DEVELOPMENT routing
```

Canonical contracts:

```text
docs/04-system/ai-context-loading.md
docs/04-system/control/context-projection.md
```

Control does not own canonical Skill prose, Tool schemas, full reference content, live model data, persistent asset state, build execution, or Codex creative reasoning.

## Reference Preparation Ownership

ChatGPT owns reference preparation. Control consumes/projects the resulting package; it does not author or reinterpret reference truth.

```text
docs/02-reference/README.md
docs/02-reference/package/schema.md
docs/02-reference/package/load-contract.md
```

Images remain visible-design authority; confirmed numeric/player-relative scale keeps its own typed authority.

## Authoring Semantic Ownership

| Domain | Semantic owner | Runtime/source owner |
| --- | --- | --- |
| Geometry / rig / pivots / UV Layout | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `mcp/server/tools/cubes.ts`, `mcp/server/tools/element.ts`, `mcp/server/tools/locators.ts`, relevant rig owners |
| Texture / Painter / PBR | `.agents/skills/blockit-bedrock-texturing/SKILL.md` | `mcp/server/tools/texture.ts`, `mcp/server/tools/paint.ts`, material owners |
| Animation / motion / effects/controllers | `.agents/skills/blockit-bedrock-animation/SKILL.md` | `mcp/server/tools/animation*.ts`, particle/controller owners |
| Task/stage/context routing | LazyDesigner Control | `mcp/gateway/navigator/**` during physical-path migration |
| Runtime phase classification | `mcp/lib/authoringPhase.ts` | shared by Runtime + Control |
| Reference generation/preparation | `.agents/skills/blockbench-reference-generator/SKILL.md` + `docs/02-reference/` | ChatGPT |

The legacy `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` is migration-only routing residue and is no longer mandatory Control context.

## Canonical Phase / Capability Classification

Single canonical owner:

```text
mcp/lib/authoringPhase.ts
```

Functions:

```text
classifyMcpToolPhaseByName() → import-safe high-frequency public capability classification
classifyMcpToolPhase()       → full Runtime family-aware classification
```

Control `registry.ts` consumes `classifyMcpToolPhaseByName()` and no longer maintains separate Geometry/Texturing/Animation capability sets.

## Context Loading

Normal Geometry context:

```text
Modelling Skill
+ exactly one selected profile from REFERENCE.json
```

Normal Texturing:

```text
Texturing Skill
```

Normal Animation:

```text
Animation Skill
```

Handles are SHA-256 identities calculated from current canonical repository files at runtime. `known_context_ids` suppresses unchanged content and invalidates changed members of the same family.

## Readiness / Invalidation

Reference blockers are stage-scoped through stage-specific readiness. A blocker belonging to another stage must not block current READY work.

Current mutation dependency direction:

```text
Geometry → Geometry + potentially dependent Texture/Animation
Texture  → Texture + potentially dependent Animation
Animation→ Animation
```

This marks affected knowledge, not an unconditional full rebuild. Further field-level invalidation refinement remains source work.

## Gateway Owners

| Concern | Owner |
| --- | --- |
| stable four-tool stdio boundary + Control status wiring | `mcp/gateway/index.ts` |
| Runtime connection/catalog/queue/project affinity | `mcp/gateway/backend.ts` |
| capability priority/result compaction/runtime signature | `mcp/gateway/contract.ts` |
| project/phase affinity headers | `mcp/gateway/projectAffinity.ts` |
| branch-specific schema reduction | `mcp/gateway/schemaProjection.ts` |
| local vanilla entity support reference | `mcp/gateway/vanillaEntityReference.ts` |

Gateway is not Control. Control selects/routes context; Gateway remains the stable MCP client boundary.

## Runtime / Workspace / Build Owners

Runtime execution:

```text
mcp/server/tools.ts
mcp/server/tools/**
mcp/lib/**
```

Persistent asset continuity:

```text
workspace/active/<asset>/README.md
```

Build/generated mechanics:

```text
mcp/build/**
mcp/scripts/**
mcp/distribution/**
mcp/prompts/**
```

Control may project fingerprints/owners but must not duplicate these states or execute their responsibilities.

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

Unknown/tied intent remains `UNRESOLVED`; Control does not replace uncertainty with a broad repository scan.

## Remaining Migration Debt

```text
physical `mcp/gateway/navigator/` path and Navigator-prefixed internal symbols/tests/scripts
legacy BlockIT product/package/protocol identifiers outside the Control public contract
legacy asset-router Skill package
field-level downstream invalidation refinement
generated output/tests/docs that still encode retired identifiers
Experimental Navigator history that must remain non-authoritative
```

Do not solve migration debt with permanent aliases or a second routing layer.

## Proof / Efficiency Boundary

Current repository changes prove source-contract intent only. They do not prove installed Blockbench activation, live Gateway behavior, visual fidelity, native playback/persistence, or measured whole-task usage savings.

Efficiency target remains **Cost to Accepted Result**: reduce broad context scans, repeated delivery, discovery/readback loops, wrong-route recovery and unnecessary resets without reducing accepted result quality.
