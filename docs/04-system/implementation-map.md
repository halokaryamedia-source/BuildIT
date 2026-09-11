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

Internal package/runtime identifiers may still contain legacy `BlockIT` / `blockit-*` values only where `docs/04-system/compatibility-identifiers.md` retains them.

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

## Canonical Skill Ownership

### Reference Preparation

```text
Reference Preparation → .agents/skills/lazydesigner-reference-preparation/SKILL.md
Prompt normalization  → .agents/skills/lazydesigner-prompt-compiler/SKILL.md
Particle reference    → .agents/skills/lazydesigner-particle-reference-authoring/SKILL.md
```

The Particle reference Skill is ChatGPT-side preparation only. It does not own MCP runtime mutation.

### Asset Authoring

| Domain | Semantic owner |
| --- | --- |
| Geometry / rig / pivots / UV Layout | `.agents/skills/lazydesigner-modelling/SKILL.md` |
| Texture / Painter / PBR | `.agents/skills/lazydesigner-texturing/SKILL.md` |
| Animation / motion / effects/controllers | `.agents/skills/lazydesigner-animation/SKILL.md` |
| Task/stage/context routing | LazyDesigner Control |

### Product Development

| Concern | Canonical Skill |
| --- | --- |
| MCP public/schema/result/transport contract | `.agents/skills/lazydesigner-mcp-development/SKILL.md` |
| Blockbench plugin/runtime/API/lifecycle mechanics | `.agents/skills/lazydesigner-blockbench-development/SKILL.md` |
| complex/ambiguous cross-owner development design | `.agents/skills/lazydesigner-development-brief/SKILL.md` |

Clear bounded changes go directly to the exact source owner; `lazydesigner-development-brief` is not a mandatory preamble.

## Control Ownership

Canonical source path: `mcp/gateway/control/`.

Control owns:

```text
ASSET_AUTHORING / SYSTEM_DEVELOPMENT intake
Runtime/project/phase orientation
Reference Package projection
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

Control does not own Skill prose, Tool schemas, full reference content, live model data, persistent asset state, build execution, or Codex creative reasoning.

## Reference Package / Particle Handoff Ownership

One canonical package entry point is used for both model and Particle handoff:

```text
REFERENCE.json
schema = lazydesigner-reference-v1
```

Base package authority:

```text
docs/02-reference/package/schema.md
```

Particle specialization:

```text
docs/02-reference/package/particle-handoff.md
```

Model package:

```text
asset.kind = MODEL
asset.profile = modelling profile
```

Legacy model packages with a recognized profile and no `asset.kind` remain backward compatible.

Particle package:

```text
asset.kind = PARTICLE
asset.profile = omitted
particle.identifier
particle.particle_json
particle.texture_reference
particle.texture_png
particle.texture_state
particle.recommended_locator
particle.recommended_animation
particle.trigger
particle.bind_to_actor
particle.review_state
```

Control projection:

```text
mcp/gateway/control/referencePackage.ts
→ projects asset_kind + particle handoff metadata

mcp/gateway/control/packet.ts
→ exposes the compact particle projection in ControlPacket.reference
→ Codex receives handoff intent without rereading the ChatGPT transcript
```

The handoff metadata is recommendation/reference authority, not live runtime proof. Codex/MCP must inspect current model/animation/locator state before destructive integration.

Do not add a `PARTICLE` modelling profile, `PARTICLE_HANDOFF.json`, second Reference Package schema, or direct runtime-state database inside the reference package.

## Canonical Phase / Capability Classification

Single canonical owner: `mcp/lib/authoringPhase.ts`.

```text
classifyMcpToolPhaseByName() → import-safe capability classification
classifyMcpToolPhase()       → Runtime family-aware classification
```

Control consumes this owner and does not maintain a parallel Geometry/Texturing/Animation catalog.

## Context Loading

```text
Geometry  → lazydesigner-modelling + exactly one selected profile when known
Texturing → lazydesigner-texturing
Animation → lazydesigner-animation
```

Particle-only Reference Packages do not load a fake modelling profile. Particle resource/integration intent arrives through the Reference Package projection, while actual authoring continues through the existing Texturing/Animation owners.

Context handles are SHA-256 identities calculated from current canonical files. `known_context_ids` suppresses unchanged content and invalidates changed members of the same context family.

## Readiness / Invalidation

```text
TEXTURING → Geometry APPROVED + UV Layout PASS
ANIMATION → Geometry APPROVED + UV Layout PASS + Texturing APPROVED
```

```text
known local Geometry transform      → GEOMETRY
shape/UV-sensitive Geometry change → GEOMETRY + TEXTURING + ANIMATION
hierarchy/pivot structure change   → GEOMETRY + ANIMATION
Texture/material change            → TEXTURING
Animation change                   → ANIMATION
ambiguous structural evidence      → conservative downstream invalidation
```

## Particle Workflow Ownership

Particle remains **Animation-specialist support**, not a fourth authoring phase and not a second texture system.

Canonical source ownership:

```text
inspect_particle / manage_particle
→ mcp/server/tools/particle.ts
→ Bedrock particle JSON inspect/create/patch/write/native preview

canonical particle resource layout
→ mcp/lib/particleResourceLayout.ts
→ particles/*.particle.json
→ textures/particle/*.png

particle texture canvas / painting
→ existing Texturing capabilities
→ create_texture + paint tools

final external PNG persistence
→ existing paint_texture_transaction optional output
→ mcp/lib/paintTransaction.ts + mcp/server/tools/prelocal-wiring.ts
→ verified temporary write / replace / rollback

particle animation timing + locator attachment
→ manage_animation_effects
→ mcp/server/tools/animation-effects.ts
```

Generated particle texture continuation is explicit:

```text
manage_particle texture_dependency.state=missing
→ REQUIRES_TEXTURING
→ create_texture
→ existing paint capabilities
→ paint_texture_transaction with canonical textures/particle/... PNG output
→ resume manage_particle with texture_dependency.state=ready
→ Runtime verifies PNG exists and is non-empty
→ particle JSON write / preview may proceed
→ manage_animation_effects owns explicit time/effect/locator binding
```

Failure/recovery rules:

```text
texture missing / PNG save failure → remain in Texturing; do not write/bind particle
particle validation error          → no particle write or preview
generated state=ready but no PNG  → fail; return to Texturing
particle asset ready               → binding still requires manage_animation_effects
outcome-unknown mutation           → no automatic retry
```

Do not add `create_particle_texture`, `save_particle_texture`, a Particle phase, or a parallel particle painting system.

## Animation Controller Source Ownership

Animation Controller support is one public capability surface, not parallel controller systems:

```text
inspect_animation
→ mcp/server/tools/animation-inspection.ts
→ read-only Animation / AnimationController inspection

manage_animation_controller
→ mcp/server/tools/animation-controller.ts
→ core controller/state/transition/animation-link/sound/particle mutation

same manage_animation_controller tool
→ mcp/server/tools/animation-controller-native-intelligence.ts
→ nested AnimationController links + native blend curves

same manage_animation_controller / inspect_animation tools
→ mcp/server/tools/animation-runtime-resource-intelligence.ts
→ bounded file-backed runtime-resource compatibility/diagnostics branch
```

`mcp/server/server.ts` wires the native/resource intelligence into the already-registered controller capability; these extensions must not create another public MCP tool or registration profile. `inspect_animation` remains read-only and focused; mutation ownership remains `manage_animation_controller`.

## Gateway / Runtime / Workspace Owners

| Concern | Owner |
| --- | --- |
| stable four-tool boundary + Control wiring | `mcp/gateway/index.ts` |
| Control routing/context/delta | `mcp/gateway/control/**` |
| Runtime connection/catalog/queue/project affinity | `mcp/gateway/backend.ts` |
| capability/result/runtime signature | `mcp/gateway/contract.ts` |
| project/phase affinity headers | `mcp/gateway/projectAffinity.ts` |
| Runtime execution | `mcp/server/**` + `mcp/lib/**` |
| persistent asset continuity | `workspace/active/<asset>/README.md` |
| build/generated mechanics | `mcp/build/**` + `mcp/scripts/**` + `mcp/distribution/**` + `mcp/prompts/**` |

## Remaining Migration Debt

```text
compatibility-bound BlockIT package/protocol/plugin/environment identifiers
remaining safe user-facing Runtime/Gateway BlockIT strings
generated outputs/docs until canonical generators run
Experimental Navigator history, explicitly non-authoritative
```

Completed source migrations:

```text
navigator/ → control/
legacy asset-router Skill → removed
REFERENCE_PREPARATION Skill → lazydesigner-reference-preparation
ASSET_AUTHORING specialists → lazydesigner-modelling/texturing/animation
PRODUCT_DEVELOPMENT specialists → lazydesigner-mcp-development/blockbench-development/development-brief
Control capability-domain duplication → removed
metadata-only search/describe status rereads → removed
```

Do not solve remaining debt with permanent aliases or a second routing layer.

## Proof / Efficiency Boundary

Current repository state can establish source ownership and deterministic routing/contracts. It does not prove installed Blockbench activation, live Gateway/Runtime behavior, visual fidelity, native playback/persistence, filesystem behavior, or measured whole-task usage savings.

Efficiency target remains **Cost to Accepted Result**: reduce broad context scans, repeated delivery, discovery/readback loops, wrong-route recovery and unnecessary resets without reducing accepted result quality.
