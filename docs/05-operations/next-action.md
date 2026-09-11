# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

The AI-first documentation optimization phase is complete enough to be the active navigation/context baseline. Do **not** automatically resume Control/source implementation or local/live testing. Both remain deferred until the user explicitly requests the next development phase.

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
✓ replaced foundation/knowledge split with domain hierarchy
✓ added root docs/README.md AI router
✓ grouped Reference image and package contracts
✓ grouped Authoring standards and modelling profiles
✓ grouped System ownership/Control docs
✓ grouped Operations continuation/proof/runbook docs
✓ updated root README / AGENTS / CONTEXT / GITHUB_RULES routing
✓ updated active Skills and MCP operational docs to current owners
✓ updated workflow path routing and stale regression owners
✓ removed fixed-five-view Reference test authority in favor of Unified Reference System
✓ compressed top-level Product Flow and Reference Policy to avoid duplicate domain rules
```

## Completed Context / Authority Audit

```text
✓ AI Documentation Consumption Audit
  → docs/README.md routes by task domain
  → domain README files route to minimum owners
  → no normal read-all-docs boot

✓ Skill ↔ Docs Authority Audit
  → Docs own durable semantic policy/contracts
  → Skills own execution procedure
  → Control owns context selection/projection
  → Skill taxonomy points to current hierarchy

✓ Context Budget Design
  → REFERENCE_PREPARATION
  → GEOMETRY
  → TEXTURING
  → ANIMATION
  → SYSTEM_DEVELOPMENT
  each has REQUIRED / CONDITIONAL / EXCLUDED loading rules

✓ Documentation Contract Protection
  → mcp/tests/repository/documentation-architecture.test.ts
  protects hierarchy, owner resolution, context-loading contract, and legacy-path removal
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

These are complementary:
- `ai-context-loading.md` decides which owners belong in AI context;
- `control/context-projection.md` defines the stage-specific data subset Control projects for asset authoring.

## Deferred Development Work

When the user explicitly resumes Control/source development, continue from current source rather than redoing documentation architecture:

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
10. regenerate generated artifacts through their canonical generator owners when LOCAL_CODE is available
11. run local/live acceptance only when explicitly reactivated
```

## Stop Rules

- Do not recreate `docs/foundation/` or `docs/knowledge/` as compatibility authorities.
- Do not add redirect/stub copies that make AI see two active owners.
- Do not duplicate durable Docs policy into Skills or Control.
- Do not create a second persistent state database inside Control.
- Do not load PRODUCT_DEVELOPMENT Skills during normal asset authoring.
- Do not send all stage contexts when one owner is known.
- Do not preload sibling domains as reassurance.
- Do not rename protocol/package identifiers blindly before dependency mapping.
- Do not automatically resume Control/source work after documentation cleanup.
- Do not run local/live acceptance while the user has explicitly postponed testing.

## Proof Boundary

This phase establishes the intended source/documentation hierarchy, authority split, AI loading contract, and static regression owner on `Local`. No local/runtime/visual verification was executed. Installed LazyDesigner activation, generated-output freshness, live Blockbench behavior, visual quality, and measured end-to-end usage reduction remain separate future proof tasks.
