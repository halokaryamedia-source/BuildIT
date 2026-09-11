# LazyDesigner Current Validation

Updated: 2026-09-11

This file owns **current proof interpretation only**. Product workflow belongs in `docs/01-product/flow.md`; reference preparation belongs in `docs/02-reference/`; source ownership belongs in `docs/04-system/implementation-map.md`; continuation belongs in `docs/05-operations/next-action.md`.

## Product Rename Boundary

Current product name is **LazyDesigner**. Historical executable/runtime evidence was produced under the former BlockIT identity.

The last user-identified local executable baseline remains BlockIT MCP `v0.2.0` at commit `b6c29c5d9edb7bb5058c42bbce123efe9dc02ed8`. That prior native evidence must not be relabeled as proof that current LazyDesigner source is installed or active.

Current user-facing/source documentation identity is LazyDesigner. Compatibility-bound identifiers such as package/server/plugin IDs, bundle filename, `BLOCKIT_*` environment variables, `x-blockit-*` affinity headers and persisted setting IDs are intentionally not bulk-renamed.

## Current Source Architecture State

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ active specialist
→ Gateway
→ Runtime
→ Blockbench
```

Canonical Control source:

```text
mcp/gateway/control/
```

Former active `mcp/gateway/navigator/` source path is removed. The migration-only `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` asset-router Skill is also removed; active routing now uses Control + exactly one stage specialist.

Current Control protocol:

```text
lazydesigner-control-v1
```

Current source expresses:

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
bounded search/describe without metadata-only status rereads
summary-only top-level Workspace/Reference output
self-contained active-stage detail in stage_context
```

Accurate boundary:

```text
CONTROL SEMANTIC CONTRACT: IMPLEMENTED IN CURRENT SOURCE
CONTROL PHYSICAL NAVIGATOR→CONTROL MIGRATION: COMPLETE IN SOURCE
LEGACY ASSET ROUTER SKILL: REMOVED IN SOURCE
CONTROL PACKET COMPACTION: IMPLEMENTED IN SOURCE
CONTROL SOURCE EXECUTION PROOF: NOT RUN IN THIS PHASE
CONTROL LIVE PROOF: NOT ESTABLISHED
LAZYDESIGNER INSTALLED PROOF: NOT ESTABLISHED
```

## Lifecycle Source Contract

Current Control source uses persisted Workspace gates as stage prerequisites when Workspace state is available:

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

Regression owner:

```text
mcp/tests/gateway-control-lifecycle-readiness.test.ts
```

This regression has not been executed locally in this phase.

## Context / Efficiency Source Contract

Current source expresses:

```text
REFERENCE.json → compact typed Control projection
active stage → one self-contained stage_context
workspace top-level → availability/fingerprint/asset summary only
reference top-level → availability/fingerprint/asset/profile summary only
Geometry → Modelling Skill + exactly one selected profile when known
Texturing → Texturing Skill only by default
Animation → Animation Skill only by default
known_context_ids → unchanged context reuse by SHA-256 identity
SYSTEM_DEVELOPMENT → bounded source/specialist/test projection
search/describe → no second getStatus() call for decorative metadata
legacy asset-router Skill → absent
```

Full Workspace/Reference projections still exist internally for lifecycle/readiness/context identity; source compaction removes duplicated emitted detail rather than weakening decisions.

Static regressions/measurement owners include:

```text
mcp/tests/gateway-control-*.test.ts
mcp/tests/authoring/*
mcp/tests/repository/*
mcp/scripts/measure-control-context.ts
```

Static payload size is diagnostic only; whole-task savings remain unproven.

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

## Current Surface Counts

Previously documented source targets:

```text
phase-union callable tools   54
AUTHORING tools              47
Animation tools              20
```

Treat these as source-era documented counts, not installed Runtime proof, until post-migration generator/build/runtime surfaces are verified.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh current-revision model evidence at comparable view/scale. Tool/source/static success cannot create visual PASS by itself.

## Authoring Efficiency

Authoring Efficiency means **Cost to Accepted Result**. Current source aims to reduce repeated context delivery, broad discovery, duplicate routing knowledge, status/readback chatter, phase bouncing and stale-context recovery. Removing the router Skill removes one mandatory authoring context layer; packet compaction removes repeated Workspace/Reference output detail. Whole-task savings remain **UNKNOWN** until comparable accepted work is measured.

## Current Proof Ceiling

Safe statement:

```text
LazyDesigner presentation identity: active in source/docs
AI-first docs hierarchy: implemented
Reference Package + Control parser: implemented in source
Control semantic protocol + canonical source path: implemented
Navigator active source path: removed
legacy asset-router Skill: removed
stage-specific + lifecycle readiness projection: implemented in source
canonical phase classification sharing: implemented in source
effect-aware invalidation: implemented with conservative fallback
metadata-only search/describe status rereads: removed in source
top-level Workspace/Reference duplicate detail: compacted in source
compatibility-bound BlockIT identifiers: intentionally pending dependency-mapped migration
generated-output freshness: pending local generator proof
Bun/typecheck/test execution for current source: not run in this phase
installed/live Blockbench validation: pending
usage-savings benchmark: pending
```

Do not strengthen these claims without matching source/local/live evidence.
