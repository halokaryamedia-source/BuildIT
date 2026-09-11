# LazyDesigner Current Validation

Updated: 2026-09-11

This file owns **current proof interpretation only**. Product workflow belongs in `docs/01-product/flow.md`; reference preparation belongs in `docs/02-reference/`; source ownership belongs in `docs/04-system/implementation-map.md`; continuation belongs in `docs/05-operations/next-action.md`; active asset continuity remains in `workspace/active/<asset>/README.md`.

## Product Rename Boundary

Current product name is **LazyDesigner**. Historical executable/runtime evidence was produced under the former BlockIT identity.

The last user-identified local executable baseline remains BlockIT MCP `v0.2.0` at commit `b6c29c5d9edb7bb5058c42bbce123efe9dc02ed8`.

Prior native evidence established that historical build running in Blockbench 5.1.6 with matching Gateway/Runtime identity at the time of that run. This evidence must not be relabeled as proof that the current LazyDesigner migration source is installed or active.

## Current Source Architecture State

Canonical product boundary:

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ Gateway
→ Runtime
→ Blockbench
```

The active Control semantic/public protocol in current source is:

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
content-addressed current-file Skill/profile handles
bounded system-development source-owner routing
stage-scoped Reference readiness/blocking
Control capability metadata
control_delta post-operation continuation
canonical phase classification shared from mcp/lib/authoringPhase.ts
```

The implementation is still physically located under legacy path:

```text
mcp/gateway/navigator/
```

Therefore the accurate boundary is:

```text
CONTROL SEMANTIC CONTRACT: IMPLEMENTED IN CURRENT SOURCE
CONTROL PHYSICAL/SYMBOL MIGRATION: IN PROGRESS
CONTROL SOURCE EXECUTION PROOF: NOT RUN IN THIS PHASE
CONTROL LIVE PROOF: NOT ESTABLISHED
LAZYDESIGNER INSTALLED PROOF: NOT ESTABLISHED
```

Do not describe the old Experimental Navigator proposal as current architecture. Historical proposal material is superseded by current authority under `docs/01-product/`, `docs/02-reference/`, and `docs/04-system/`.

## Reference / Context Source Proof

Current source now establishes these intended contracts:

```text
REFERENCE.json → compact typed Control projection
active authoring stage → one stage context only
Geometry → Modelling Skill + exactly one selected profile when known
Texturing → Texturing Skill without full modelling profile by default
Animation → Animation Skill without full modelling profile by default
known_context_ids → unchanged context reuse by SHA-256 identity
SYSTEM_DEVELOPMENT → bounded source/specialist/test owner projection
```

The former asset-router Skill is no longer mandatory authoring context in Control source.

Source regression files were added/updated for these semantics, including stage-scoped Reference readiness and canonical phase classification. They have **not** been executed in a local Bun environment during this phase.

## Invalidation State

Current source expresses dependency direction:

```text
Geometry → Geometry + potentially dependent Texture/Animation
Texture  → Texture + potentially dependent Animation
Animation→ Animation
```

This is currently domain-level affected-knowledge metadata. Field/effect-aware minimum invalidation is still pending, so do not claim that downstream invalidation is fully minimal yet.

## 3D-Assisted Retirement

The previous 3D-assisted/Hunyuan/PrimitiveAnything modelling route remains retired from current product semantics. Current authoring intent is one native Geometry path.

Generated compatibility residue and tests/docs may still contain retired identifiers until later migration cleanup. Their presence does not reactivate the retired route.

## Current Surface Counts

Previously documented source targets:

```text
phase-union callable tools   54
AUTHORING tools              47
Animation tools              20
```

Treat these as source-era documented counts, not installed Runtime proof, until post-migration generated/runtime surfaces are rebuilt and verified.

## Documentation Proof

Current repository intent is separated into canonical domains and owners:

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

Documentation/source structure is not live execution proof.

## Visual / Reference Proof Rule

A visual/reference `PASS` requires the actual approved reference image plus fresh evidence from the current model/revision at a comparable view/scale.

Tool success, source/CI success, hashes, coordinates, export, scalar metrics, UV occupancy, or clean structural diagnostics cannot create visual PASS by themselves.

If corresponding live evidence is unavailable, report `UNVERIFIED` or `LOCAL PROOF REQUIRED`.

## Authoring Efficiency

Authoring Efficiency means **Cost to Accepted Result**.

Current Control source is explicitly designed to reduce repeated context loading, router duplication, broad discovery, readback, phase bouncing, and stale-context recovery. Whole-task savings remain **UNKNOWN** until measured on comparable accepted work after current source is built and exercised.

Static payload/context measurements are supporting diagnostics only; they are not equivalent to end-to-end token/cost savings.

## Current Proof Ceiling

Safe statement now:

```text
LazyDesigner product naming: introduced in source/docs
AI-first docs hierarchy: implemented in source
Reference Package contract: documented + Control parser implemented
Control semantic/public protocol: implemented in current source
stage-specific Control projection: implemented in current source
canonical phase classification sharing: implemented in current source
physical Navigator→Control path/symbol migration: pending
field/effect-aware minimum invalidation: pending
generated-output freshness: pending local generator proof
Bun/typecheck/test execution for current Control source: not run in this phase
installed/live Blockbench validation: pending
usage-savings benchmark: pending
```

Do not strengthen these claims without matching source/local/live evidence.
