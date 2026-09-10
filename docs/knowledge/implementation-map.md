# LazyDesigner Implementation Map

Updated: 2026-09-11

This file maps **current source ownership only**. Product workflow belongs in `flow.md`; reference preparation in `reference-handoff.md`; current implementation continuation in `next-action.md`; proof interpretation in `current-validation.md`.

## Product Identity

```text
Current product name: LazyDesigner
Former product name: BlockIT
```

The repository and some internal identifiers still use legacy `BlockIT` / `blockit-*` names during migration. Do not interpret those compatibility identifiers as a second product.

## Runtime Architecture

Target architecture:

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ Gateway
→ Runtime
→ Blockbench native APIs
```

Current executable path after Control routing reaches Codex/Gateway remains:

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

`LazyDesigner Control` is the architectural name for the front-line intake/context/routing layer.

The current implementation is still physically located under the legacy path:

```text
mcp/gateway/navigator/
```

This path is **temporary migration state**, not a separate Navigator architecture.

Current files:

```text
mcp/gateway/navigator/packet.ts
mcp/gateway/navigator/snapshot.ts
mcp/gateway/navigator/workspace.ts
mcp/gateway/navigator/registry.ts
mcp/gateway/navigator/capabilities.ts
mcp/gateway/navigator/developmentIntent.ts
mcp/gateway/navigator/delta.ts
mcp/gateway/navigator/routingPolicy.ts
mcp/gateway/navigator/contextCache.ts
mcp/gateway/navigator/types.ts
```

Planned cleanup is to migrate these responsibilities into a `Control` naming surface without keeping permanent duplicate aliases.

Control owns only:

```text
request intake metadata
operational orientation
readiness projection
context projection
owner/dependency routing
capability routing metadata
post-operation invalidation/delta
```

Canonical stage-specific authoring projection contract:

```text
docs/knowledge/control-context-projection.md
```

This contract defines `GEOMETRY_CONTEXT`, `TEXTURE_CONTEXT`, and `ANIMATION_CONTEXT`. Control owns selecting/projecting these subsets. Domain Skills consume them but must not rebuild parallel projection contracts.

Control does not own canonical Skill prose, Tool schemas, live model data, persistent asset state, build execution, or Codex creative reasoning.

## Reference Preparation Ownership

ChatGPT owns reference preparation before Codex when it reduces ambiguity.

Canonical handoff contract:

```text
docs/knowledge/reference-handoff.md
```

Reference package data may include images, compact JSON metadata, and conditional Markdown guidance. Images remain visual authority. Control consumes/projects the package; it does not author the reference content itself.

## Authoring Semantic Ownership

| Domain | Semantic owner | Runtime/source owner |
| --- | --- | --- |
| Geometry / rig / pivots / UV Layout | `.agents/skills/blockbench-bedrock-modelling/SKILL.md` | `mcp/server/tools/cubes.ts`, `mcp/server/tools/element.ts`, `mcp/server/tools/locators.ts`, relevant rig owners |
| Texture / Painter / PBR | `.agents/skills/blockit-bedrock-texturing/SKILL.md` | `mcp/server/tools/texture.ts`, `mcp/server/tools/paint.ts`, material owners |
| Animation / motion / effects/controllers | `.agents/skills/blockit-bedrock-animation/SKILL.md` | `mcp/server/tools/animation*.ts`, particle/controller owners |
| Current asset routing / phase classification | `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` | `mcp/lib/authoringPhase.ts`, `mcp/server/tools.ts` |
| Reference generation/preparation | `.agents/skills/blockbench-reference-generator/SKILL.md` + `reference-handoff.md` | ChatGPT; no Runtime authoring owner |
| Stage-specific Codex context projection | `docs/knowledge/control-context-projection.md` | LazyDesigner Control (`mcp/gateway/navigator/**` during migration) |

Legacy Skill package names will be migrated separately. Do not duplicate their content into Control during the rename.

## Canonical Phase / Capability Classification

The canonical Runtime phase classification already exists in:

```text
mcp/lib/authoringPhase.ts
```

`classifyMcpToolPhase()` owns Runtime classification semantics.

Current `mcp/gateway/navigator/registry.ts` still contains manual capability-domain sets. This is migration debt because it creates a second classification table. The Control implementation should derive or generate routing metadata from canonical owners instead of maintaining a parallel hand-written catalog.

## Gateway Owners

| Concern | Owner |
| --- | --- |
| stable four-tool stdio boundary | `mcp/gateway/index.ts` |
| Runtime connection/catalog/queue/project affinity | `mcp/gateway/backend.ts` |
| capability priority/result compaction/runtime signature | `mcp/gateway/contract.ts` |
| project/phase affinity headers | `mcp/gateway/projectAffinity.ts` |
| branch-specific schema reduction | `mcp/gateway/schemaProjection.ts` |
| local vanilla entity support reference | `mcp/gateway/vanillaEntityReference.ts` |

Gateway is not Control. Control decides/project routes; Gateway remains the stable MCP client boundary.

## Runtime Owners

Runtime capability implementation lives primarily under:

```text
mcp/server/tools.ts
mcp/server/tools/**
mcp/lib/**
```

Runtime owns actual Blockbench-facing execution, not user-intent classification or persistent workflow state.

## Workspace Ownership

Persistent asset continuity remains:

```text
workspace/active/<asset>/README.md
```

Control may project/cache fingerprints from this owner but must not create a parallel persistent asset-state database.

## Build / Generated Ownership

Build and generated-output mechanics are owned by actual build sources:

```text
mcp/build/**
mcp/scripts/**
mcp/distribution/**
mcp/prompts/**
```

Developer loop currently includes:

```text
dev:watch
prompt regeneration
deploy:local
dev:sync
```

Control may resolve which build/generate/deploy path is needed for a system-development task, but the build system performs the work.

## System Development Routing

For MCP/plugin/build/runtime changes:

```text
User request
→ Control: SYSTEM_DEVELOPMENT
→ resolve problem/feature class
→ resolve exact source owner(s)
→ resolve direct dependency/impact boundary
→ project minimum development context to Codex
→ Codex implementation
→ build/generate/deploy owner
```

The current `developmentIntent.ts` is an initial implementation of this routing idea and should be evolved under the Control architecture rather than expanded into a separate development navigator.

## Known Migration Debt

Current architecture work should explicitly remove these sources of ambiguity:

```text
legacy BlockIT product labels
legacy Navigator naming/path
manual duplicate capability-domain tables
Experimental Navigator documentation that could be mistaken for current authority
old flow/proof documents that describe superseded architecture
generated output/tests that still encode retired names or paths
```

Do not solve migration debt by introducing compatibility layers that become permanent second systems.

## Proof / Efficiency Boundary

Source structure can prove ownership and deterministic routing contracts. It cannot prove installed Blockbench activation, visual fidelity, native playback/persistence, or whole-task usage savings.

Efficiency target remains:

```text
Cost to Accepted Result
```

Control should reduce avoidable context scans, repeated context delivery, discovery/readback loops, and wrong-route recovery while preserving accepted result quality.