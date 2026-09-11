# LazyDesigner Current Validation

Updated: 2026-09-11

This file owns **current proof interpretation only**. Product workflow belongs in `docs/01-product/flow.md`; reference preparation belongs in `docs/02-reference/`; source ownership belongs in `docs/04-system/implementation-map.md`; continuation belongs in `docs/05-operations/next-action.md`.

## Product Rename Boundary

Current product name is **LazyDesigner**. Historical executable/runtime evidence was produced under the former BlockIT identity.

The last user-identified local executable baseline remains BlockIT MCP `v0.2.0` at commit `b6c29c5d9edb7bb5058c42bbce123efe9dc02ed8`. That prior native evidence must not be relabeled as proof that current LazyDesigner source is installed or active.

Compatibility-bound package/server/plugin IDs, bundle filename, `BLOCKIT_*` environment variables, `x-blockit-*` affinity headers and persisted setting IDs remain intentionally stable.

Safe human-facing presentation strings now use LazyDesigner in current source for MCP initialize/server instructions, Gateway backend errors/status, plugin lifecycle/dev-sync/install messages, Blockbench panel/status bar, install guidance, and `mcp/llms.txt`.

## Current Source Architecture State

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ exactly one active specialist
→ Gateway
→ Runtime
→ Blockbench
```

Canonical Control source: `mcp/gateway/control/`.

Canonical REFERENCE_PREPARATION Skills:

```text
.agents/skills/lazydesigner-reference-preparation/SKILL.md
.agents/skills/lazydesigner-prompt-compiler/SKILL.md
```

Canonical ASSET_AUTHORING Skills:

```text
.agents/skills/lazydesigner-modelling/SKILL.md
.agents/skills/lazydesigner-texturing/SKILL.md
.agents/skills/lazydesigner-animation/SKILL.md
```

Canonical PRODUCT_DEVELOPMENT Skills:

```text
.agents/skills/lazydesigner-mcp-development/SKILL.md
.agents/skills/lazydesigner-blockbench-development/SKILL.md
.agents/skills/lazydesigner-development-brief/SKILL.md
```

Removed legacy routing/specialist paths include:

```text
mcp/gateway/navigator/
mcp/gateway/control/contextCache.ts
.agents/skills/blockbench-reference-generator/SKILL.md
.agents/skills/blockit-bedrock-entity-mcp/SKILL.md
.agents/skills/blockbench-bedrock-modelling/SKILL.md
.agents/skills/blockit-bedrock-texturing/SKILL.md
.agents/skills/blockit-bedrock-animation/SKILL.md
.agents/skills/mcp-server-development/SKILL.md
.agents/skills/blockbench-runtime-development/SKILL.md
.agents/skills/development-brief/SKILL.md
```

Current Control protocol: `lazydesigner-control-v1`.

## Implemented Source Contracts

```text
ASSET_AUTHORING / SYSTEM_DEVELOPMENT
Reference Package + Active Workspace projection
GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
selected-profile Geometry context
content-addressed Skill/profile handles
bounded system-development owner routing
stage-scoped Reference readiness
Workspace lifecycle readiness
Control capability/source-owner metadata
control_delta continuation
effect-aware bounded invalidation with conservative fallback
single phase classification owner in mcp/lib/authoringPhase.ts
single search-policy owner in mcp/gateway/control/routingPolicy.ts
bounded search/describe without metadata-only status rereads
summary-only top-level Workspace/Reference output
self-contained active-stage detail in stage_context
deterministic recovery ownership between Gateway backend and Control
Bedrock-first registration/authoring contract guards
```

Accurate boundary:

```text
CONTROL SEMANTIC CONTRACT: IMPLEMENTED IN CURRENT SOURCE
NAVIGATOR→CONTROL MIGRATION: COMPLETE IN SOURCE
LEGACY ASSET ROUTER SKILL: REMOVED IN SOURCE
REFERENCE_PREPARATION SKILL NAMING: COMPLETE IN SOURCE
ASSET_AUTHORING SKILL NAMING: COMPLETE IN SOURCE
PRODUCT_DEVELOPMENT SKILL NAMING: COMPLETE IN SOURCE
SAFE PRESENTATION BRANDING: MIGRATED IN CURRENT SOURCE
ACTIVE REPOSITORY REGRESSION OWNERSHIP: SYNCHRONIZED TO CURRENT ARCHITECTURE
CONTROL PACKET COMPACTION: IMPLEMENTED IN SOURCE
REMOTE PRE-LOCAL HARDENING: COMPLETE ENOUGH TO FREEZE SOURCE
SOURCE EXECUTION PROOF: NOT RUN IN THIS PHASE
CONTROL LIVE PROOF: NOT ESTABLISHED
LAZYDESIGNER INSTALLED PROOF: NOT ESTABLISHED
```

Current stale-regression cleanup includes `current-doc-sync`, `repository-github-discipline`, `repository-supply-chain`, `control-source-migration`, routing-policy ownership, canonical authoring Skill ownership, context ownership, recovery ownership, and Bedrock-first contract guards. Their current source contracts use the hierarchical docs owners, canonical LazyDesigner Skills, Control, and deferred-local proof model rather than retired `docs/knowledge`, `docs/foundation`, old Skill paths, or `3D_ASSISTED` expectations.

## Lifecycle Source Contract

```text
GEOMETRY
→ no downstream prerequisite gate

TEXTURING
→ Geometry APPROVED
→ UV Layout PASS

ANIMATION
→ Geometry APPROVED
→ UV Layout PASS
→ Texturing APPROVED
```

When Workspace lifecycle state is unavailable, Control returns orientation-required rather than inventing an upstream failure. Reference readiness remains independently stage-scoped.

## Context / Efficiency Source Contract

```text
REFERENCE.json → compact typed Control projection
active stage → one self-contained stage_context
workspace top-level → availability/fingerprint/asset summary only
reference top-level → availability/fingerprint/asset/profile summary only
Geometry → lazydesigner-modelling + exactly one selected profile when known
Texturing → lazydesigner-texturing only by default
Animation → lazydesigner-animation only by default
known_context_ids → unchanged context reuse by SHA-256 identity
context-handle cache → registry.ts only
known/cached/invalidated context delivery → packet.ts only
SYSTEM_DEVELOPMENT → bounded source/specialist/test projection
search/describe → no second getStatus() call for decorative metadata
legacy routing/specialist aliases → absent
```

`measure-control-context.ts` now reports both Control packet size and full Gateway status+Control envelope size, including the repeated normalized orientation projection. That overlap is measured rather than removed remotely because the top-level Gateway status is a stable contract and static character count is not sufficient evidence for a breaking compaction. Static context/payload measurements are supporting diagnostics only; whole-task savings remain unproven.

## Recovery Ownership Source Contract

```text
Runtime offline / transport failure / catalog refresh / queue pressure
→ Gateway backend

project affinity lost / explicit rebind
→ Gateway backend

interrupted read-only call
→ Gateway backend classification + explicit safe_to_retry

interrupted mutation / unknown outcome
→ Gateway backend OUTCOME_UNKNOWN
→ no automatic retry
→ inspect current model state before retrying

Workspace unavailable/stale lifecycle projection
→ Control orientation/readiness

Reference path/not-found/unreadable/invalid/stage-blocked
→ Control reference projection/readiness
```

Control does not call the Runtime transport and does not become a second recovery engine.

## Bedrock-First Source Contract

```text
normal registration profile → bedrock_entity
generic import/ui fallback → extended opt-in only
16 Blockbench units = 1 Minecraft block
Geometry/Texturing → shared AUTHORING surface
Animation → isolated runtime authoring surface
Particle → Animation-specialist asset-only route
client-entity/gameplay wiring → outside normal particle authoring
Bedrock export family → retained in normal profile
```

The LazyDesigner abstraction therefore remains Bedrock-specific at the authoring boundary rather than becoming a generic 3D workflow.

## Compatibility Boundary

The following legacy-looking values are intentionally retained and must not be interpreted as stale presentation branding:

```text
package/server/plugin IDs
blockit_mcp.js
blockit_mcp
blockit-gateway
BLOCKIT_* environment variables
x-blockit-* affinity headers
persisted setting identifiers
build/provenance identities coupled to the above
internal compatibility symbols/event/DOM keys where migration has no current value
```

Generated API output may still contain stale presentation text until the canonical generator can run under `LOCAL_CODE`; generated files must not be hand-edited.

## Invalidation State

```text
known local Geometry transform      → GEOMETRY
shape/UV-sensitive Geometry change → GEOMETRY + TEXTURING + ANIMATION
hierarchy/pivot structure change   → GEOMETRY + ANIMATION
Texture/material change            → TEXTURING
Animation change                   → ANIMATION
ambiguous structural evidence      → conservative downstream invalidation
```

This is affected-knowledge metadata, not proof that live downstream authored state was rebuilt or revalidated.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh current-revision model evidence at comparable view/scale. Tool/source/static success cannot create visual PASS by itself.

## Authoring Efficiency

Authoring Efficiency means **Cost to Accepted Result**. Current source aims to reduce repeated context delivery, broad discovery, duplicate routing knowledge, status/readback chatter, phase bouncing and stale-context recovery. Removing router/legacy Skill aliases and the orphan context-cache helper reduces mandatory context/ownership ambiguity; packet compaction removes repeated Workspace/Reference output detail. Whole-task savings remain **UNKNOWN** until comparable accepted work is measured.

## Current Proof Ceiling

Safe statement:

```text
LazyDesigner presentation identity: active in current source/docs
AI-first docs hierarchy: implemented
Reference Package + Control parser: implemented in source
Control semantic protocol + canonical source path: implemented
Navigator active source path: removed
orphan contextCache helper: removed
legacy asset-router Skill: removed
canonical lazydesigner-* primary Skills: implemented in source
legacy primary Skill paths: removed
safe Gateway/Runtime/UI presentation strings: migrated to LazyDesigner in source
active repository regressions audited and aligned to current owners in source
stage-specific + lifecycle readiness projection: implemented in source
canonical phase classification sharing: implemented in source
canonical routing/search policy ownership: implemented in source
effect-aware invalidation: implemented with conservative fallback
metadata-only search/describe status rereads: removed in source
top-level Workspace/Reference duplicate detail: compacted in source
Gateway/Control orientation overlap: instrumented for local measurement, not remotely removed
deterministic recovery ownership: guarded in source
Bedrock-first authoring boundary: guarded in source
compatibility-bound BlockIT identifiers: intentionally retained pending dedicated migration
generated-output freshness/presentation: pending local generator proof
Bun/typecheck/test execution for current source: not run in this phase
installed/live Blockbench validation: pending
usage-savings benchmark: pending
```

Do not strengthen these claims without matching source/local/live evidence.
