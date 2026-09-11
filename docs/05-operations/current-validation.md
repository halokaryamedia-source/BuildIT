# LazyDesigner Current Validation

Updated: 2026-09-11

This file owns **current proof interpretation only**. Product workflow belongs in `docs/01-product/flow.md`; reference preparation belongs in `docs/02-reference/`; source ownership belongs in `docs/04-system/implementation-map.md`; continuation belongs in `docs/05-operations/next-action.md`; active asset continuity remains in `workspace/active/<asset>/README.md`.

## Product Rename Boundary

Current product name is **LazyDesigner**. Historical executable/runtime evidence was produced under the former BlockIT identity.

The last user-identified local executable baseline remains BlockIT MCP `v0.2.0` at commit `b6c29c5d9edb7bb5058c42bbce123efe9dc02ed8`.

Prior native evidence established that historical build running in Blockbench 5.1.6 with matching Gateway/Runtime identity at the time of that run. This evidence must not be relabeled as proof that current LazyDesigner source is installed or active.

## Current Source Architecture State

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ Gateway
→ Runtime
→ Blockbench
```

Canonical Control source is now:

```text
mcp/gateway/control/
```

The former active `mcp/gateway/navigator/` source path has been removed. Current Control protocol:

```text
lazydesigner-control-v1
```

Current source implements:

```text
ASSET_AUTHORING / SYSTEM_DEVELOPMENT task classes
Reference Package projection from REFERENCE.json
Active Workspace projection
GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
selected-profile context loading for Geometry
content-addressed Skill/profile handles
bounded system-development source-owner routing
stage-scoped Reference readiness/blocking
Control capability/source-owner metadata
control_delta post-operation continuation
effect-aware bounded invalidation with conservative fallback
canonical phase classification shared from mcp/lib/authoringPhase.ts
```

Accurate proof boundary:

```text
CONTROL SEMANTIC CONTRACT: IMPLEMENTED IN CURRENT SOURCE
CONTROL PHYSICAL NAVIGATOR→CONTROL MIGRATION: COMPLETE IN SOURCE
CONTROL SOURCE EXECUTION PROOF: NOT RUN IN THIS PHASE
CONTROL LIVE PROOF: NOT ESTABLISHED
LAZYDESIGNER INSTALLED PROOF: NOT ESTABLISHED
```

Historical Experimental Navigator material is not current architecture authority.

## Reference / Context Source Proof

Current source expresses:

```text
REFERENCE.json → compact typed Control projection
active authoring stage → one stage context only
Geometry → Modelling Skill + exactly one selected profile when known
Texturing → Texturing Skill without full modelling profile by default
Animation → Animation Skill without full modelling profile by default
known_context_ids → unchanged context reuse by SHA-256 identity
SYSTEM_DEVELOPMENT → bounded source/specialist/test owner projection
```

The former asset-router Skill is no longer mandatory normal authoring context.

Static regression owners now use canonical `gateway-control-*` naming. They have **not** been executed in a local Bun environment during this phase.

## Invalidation State

Current source performs effect-aware affected-knowledge projection:

```text
known local Geometry transform      → GEOMETRY
shape/UV-sensitive Geometry change → GEOMETRY + TEXTURING + ANIMATION
hierarchy/pivot structure change   → GEOMETRY + ANIMATION
Texture/material change            → TEXTURING
Animation change                   → ANIMATION
ambiguous structural evidence      → conservative downstream invalidation
```

This is invalidation metadata, not proof that live downstream authored state was actually rebuilt or revalidated.

## Current Surface Counts

Previously documented source targets:

```text
phase-union callable tools   54
AUTHORING tools              47
Animation tools              20
```

Treat these as source-era documented counts, not installed Runtime proof, until post-migration generator/build/runtime surfaces are verified.

## Documentation Proof

Current canonical documentation owners include:

```text
docs/README.md                           → AI documentation router
docs/01-product/flow.md                  → end-to-end workflow
docs/02-reference/                       → Reference Preparation/package contracts
docs/03-authoring/                       → asset-authoring standards
docs/04-system/ai-context-loading.md     → minimum AI context contract
docs/04-system/implementation-map.md     → source/module ownership
docs/05-operations/next-action.md        → continuation
docs/05-operations/current-validation.md → proof interpretation
```

Source/documentation structure is not live execution proof.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision at comparable view/scale.

Tool success, source/CI success, hashes, coordinates, export, scalar metrics, UV occupancy, or clean structural diagnostics cannot create visual PASS by themselves.

If corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

Authoring Efficiency means **Cost to Accepted Result**.

Current Control source is designed to reduce repeated context loading, broad discovery, duplicate routing knowledge, readback, phase bouncing, and stale-context recovery. Whole-task savings remain **UNKNOWN** until measured on comparable accepted work after current source is built and exercised.

Static context/payload measurements are supporting diagnostics only.

## Current Proof Ceiling

Safe statement now:

```text
LazyDesigner product naming: introduced in source/docs
AI-first docs hierarchy: implemented in source
Reference Package contract: documented + Control parser implemented
Control semantic/public protocol: implemented in current source
Control canonical source path: mcp/gateway/control/
Navigator active source path: removed
stage-specific Control projection: implemented in current source
canonical phase classification sharing: implemented in current source
effect-aware invalidation: implemented in current source with conservative fallback
legacy BlockIT/package/Skill identifier migration: pending
generated-output freshness: pending local generator proof
Bun/typecheck/test execution for current Control source: not run in this phase
installed/live Blockbench validation: pending
usage-savings benchmark: pending
```

Do not strengthen these claims without matching source/local/live evidence.
