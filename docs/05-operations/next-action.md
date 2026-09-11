# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

The AI-first documentation and Reference Preparation content audit are complete enough to be the active baseline. Do **not** automatically resume Control/source implementation or local/live testing. Both remain deferred until the user explicitly requests the next development phase.

Canonical documentation entry point:

```text
docs/README.md
```

Canonical AI context-loading contract:

```text
docs/04-system/ai-context-loading.md
```

## Current Documentation Hierarchy

```text
docs/
├── 01-product/      product identity, requirements, end-to-end flow
├── 02-reference/    ChatGPT reference preparation, image system, package contracts
├── 03-authoring/    modelling, profiles, texture, animation, validation, finalization
├── 04-system/       AI context loading, Control, implementation ownership, Skill taxonomy
└── 05-operations/   current continuation, proof, local acceptance
```

Rules:

```text
one domain → one index
one concern → one canonical semantic owner
Docs = durable policy/contracts
Skills = execution procedure
Control = context selection/projection
README files route; they do not duplicate policy
AI loads only minimum sufficient context
```

## Completed AI Documentation Work

```text
✓ domain hierarchy replaces foundation/knowledge split
✓ docs/README.md is the AI router
✓ Reference image/package contracts grouped by domain
✓ Authoring standards/profiles grouped by stage
✓ System and Operations ownership separated
✓ root routing files and active Skills point to current owners
✓ workflow routing and static regressions no longer depend on removed doc paths
✓ top-level Product Flow / Reference Policy compressed to avoid duplicate authority
```

## Completed Context / Authority Audit

```text
✓ AI Documentation Consumption Audit
  → task domain first
  → minimum owner load
  → no normal read-all-docs boot

✓ Skill ↔ Docs Authority Audit
  → Docs = durable semantic policy/contracts
  → Skills = execution procedure
  → Control = context selection/projection

✓ Context Budget Design
  → REFERENCE_PREPARATION
  → GEOMETRY
  → TEXTURING
  → ANIMATION
  → SYSTEM_DEVELOPMENT
  each has REQUIRED / CONDITIONAL / EXCLUDED loading rules

✓ Documentation Contract Protection
  → mcp/tests/repository/documentation-architecture.test.ts
```

## Completed Reference Preparation Content Audit

Canonical Reference baseline now includes:

```text
✓ typed authority model
  → visual authority owns visible design
  → numeric dimensions own numeric envelope
  → player-relative scale owns world/interaction relationship
  → JSON owns structured facts/readiness/unknowns
  → stage Markdown owns stage-specific consequences

✓ player-relative scale is part of REFERENCE.json
  → dimensions_blocks
  → player_relative_scale
  → no invented conversion between them

✓ optional stage Markdown remains truly optional
  → images.used_by = GEOMETRY | TEXTURE | ANIMATION
  → Codex can resolve stage-relevant image evidence even when stage Markdown is omitted

✓ Reference handoff was reduced to boundary semantics
  → no duplicate full schema / profile / module documentation

✓ GEOMETRY.md now supports numeric + player-relative scale explicitly

✓ Unified Image Standard now locks identity + scale

✓ Prompt Contract / Master Templates preserve Scale Lock

✓ old pre-hierarchy reference paths/file names removed from active Reference docs

✓ reference-specific regression protection added
  → mcp/tests/repository/reference-content-contract.test.ts
```

## Current Context Architecture

Asset-authoring projections remain:

```text
GEOMETRY_CONTEXT
TEXTURE_CONTEXT
ANIMATION_CONTEXT
```

Projection owner:

```text
docs/04-system/control/context-projection.md
```

Overall task-loading owner:

```text
docs/04-system/ai-context-loading.md
```

Reference package consumption owner:

```text
docs/02-reference/package/load-contract.md
```

These are complementary:
- `ai-context-loading.md` decides which owners belong in AI context;
- `package/load-contract.md` decides how Codex consumes a Reference Package;
- `control/context-projection.md` defines the stage-specific data subset Control eventually projects.

## Deferred Development Work

When the user explicitly resumes Control/source development, continue from current source rather than redoing documentation/reference architecture:

```text
1. migrate current Navigator module/concepts to Control without permanent aliases
2. make Control the explicit front-line intake for ASSET_AUTHORING and SYSTEM_DEVELOPMENT
3. implement GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT projections
4. derive capability/domain classification from canonical owners instead of duplicate tables
5. implement task-intent and lifecycle readiness projection
6. implement dependency/evidence invalidation projection
7. implement minimum-context/content-addressed continuation using the new context-loading contract
8. hard-bound discovery and avoid status/context rereads
9. migrate remaining BlockIT identifiers only after dependency mapping is stable
10. regenerate generated artifacts through canonical generator owners when LOCAL_CODE is available
11. run local/live acceptance only when explicitly reactivated
```

## Stop Rules

- Do not recreate `docs/foundation/` or `docs/knowledge/` as compatibility authorities.
- Do not add redirect/stub copies that create two active owners.
- Do not duplicate durable Docs policy into Skills or Control.
- Do not create a second persistent state database inside Control.
- Do not load PRODUCT_DEVELOPMENT Skills during normal asset authoring.
- Do not send all stage contexts when one owner is known.
- Do not preload sibling domains as reassurance.
- Do not rename protocol/package identifiers blindly before dependency mapping.
- Do not automatically resume Control/source work after this audit.
- Do not run local/live acceptance while the user has explicitly postponed testing.

## Proof Boundary

This phase establishes source/documentation hierarchy, Reference content contracts, authority split, AI loading rules, and static regression owners on `Local`. No local/runtime/image-generation/live Blockbench verification was executed. Generated-output freshness, installed LazyDesigner activation, live visual quality, and measured end-to-end usage reduction remain future proof tasks.