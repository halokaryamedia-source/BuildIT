# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; Skill taxonomy/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

Finish the AI-first documentation hierarchy migration and stale-path cleanup before resuming Control/source implementation.

Canonical documentation entry point:

```text
docs/README.md
```

Canonical product flow:

```text
USER
→ ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ Gateway
→ Runtime
→ Blockbench
→ Control Delta
→ Verify / Review / Continue
```

## Current Documentation Hierarchy

```text
docs/
├── 01-product/      product identity, requirements, end-to-end flow
├── 02-reference/    ChatGPT reference preparation, image system, package contracts
├── 03-authoring/    modelling, profiles, texture, animation, validation, finalization
├── 04-system/       Control, implementation ownership, Skill taxonomy
└── 05-operations/   current continuation, proof, local acceptance
```

Rules:

```text
one domain → one index
one concern → one canonical owner
README files route; they do not duplicate policy
AI loads only the minimum relevant domain owner
```

## Current Skill Architecture

Semantic taxonomy:

```text
REFERENCE_PREPARATION
ASSET_AUTHORING
PRODUCT_DEVELOPMENT
```

Canonical modelling profiles:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Profile selection owner:

```text
docs/03-authoring/modelling/profiles/README.md
```

Control stage projection owner:

```text
docs/04-system/control/context-projection.md
```

with canonical outputs:

```text
GEOMETRY_CONTEXT
TEXTURE_CONTEXT
ANIMATION_CONTEXT
```

## Completed Documentation Work

```text
✓ replaced foundation/knowledge split with domain hierarchy
✓ added root docs/README.md AI router
✓ grouped Reference image and package contracts
✓ grouped Authoring standards and modelling profiles
✓ grouped System ownership/Control docs
✓ grouped Operations continuation/proof/runbook docs
✓ updated primary root routing files
✓ updated Reference Preparation Skill to new owners
✓ compressed top-level Product Flow and Reference Policy
```

## Immediate Next Work

Before any further Control implementation:

```text
1. remove remaining active references to docs/knowledge/** and docs/foundation/**
2. update AI-facing Skills and MCP operational docs first
3. update static tests/fixtures that intentionally read canonical docs
4. leave generated documentation to its generator owner rather than hand-editing generated output
5. audit that no active owner points at a removed path
```

After stale-path cleanup, resume source implementation in this order:

```text
1. migrate current Navigator module/concepts to Control without permanent aliases
2. make Control the explicit front-line intake for ASSET_AUTHORING and SYSTEM_DEVELOPMENT
3. implement GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT projections
4. derive capability/domain classification from canonical owners instead of duplicate tables
5. implement task-intent and lifecycle readiness projection
6. implement dependency/evidence invalidation projection
7. implement minimum-context/content-addressed continuation
8. hard-bound discovery and avoid status/context rereads
9. migrate remaining BlockIT identifiers only after dependency mapping is stable
10. restore generated-output/tests/CI closure
11. run local/live acceptance later
```

## Stop Rules

- Do not recreate `docs/foundation/` or `docs/knowledge/` as compatibility authorities.
- Do not add redirect/stub copies that make AI see two active owners.
- Do not duplicate Skill/Tool canonical content into Control.
- Do not create a second persistent state database inside Control.
- Do not load PRODUCT_DEVELOPMENT Skills during normal asset authoring.
- Do not send all stage contexts when one owner is known.
- Do not rename protocol/package identifiers blindly before dependency mapping.
- Do not spend effort on local/live testing while the user has explicitly postponed testing.

## Proof Boundary

Documentation/source cleanup can prove path/ownership consistency in repository source. It does not prove installed LazyDesigner activation, live Blockbench behavior, visual quality, or end-to-end usage reduction. Those require later local/live validation.
