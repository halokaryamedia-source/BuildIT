# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Architecture belongs in `flow.md`; reference preparation in `reference-handoff.md`; Skill categories/naming in `skill-taxonomy.md`; source ownership in `implementation-map.md`; proof interpretation in `current-validation.md`.

## Current Objective

Documentation-first transition from BlockIT/Navigator terminology to the LazyDesigner architecture, with Skill ownership clarified before further Control implementation.

Canonical product flow is:

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

Control is the former Navigator role, expanded into the single Codex front line for both `ASSET_AUTHORING` and `SYSTEM_DEVELOPMENT`.

## Current Skill Architecture

The semantic taxonomy is now fixed as:

```text
REFERENCE_PREPARATION
ASSET_AUTHORING
PRODUCT_DEVELOPMENT
```

`docs/knowledge/skill-taxonomy.md` owns the exact current-to-target Skill mapping and naming. Legacy physical names remain temporarily until routing/Control migration can rename them coherently without parallel aliases.

## Implementation Order

Do not optimize CI or generated-output cleanup yet. The current implementation sequence is:

```text
1. audit and complete missing ASSET_AUTHORING modelling profiles
2. upgrade REFERENCE_PREPARATION to emit the Reference Package contract
3. rename current Navigator module/concepts to Control without permanent aliases
4. make Control the explicit front-line intake for asset and product-development requests
5. derive capability/domain classification from canonical owners instead of manual duplicate tables
6. implement asset task-intent resolution
7. implement lifecycle readiness projection
8. implement dependency/downstream invalidation projection
9. implement evidence freshness projection
10. implement minimum-context / content-addressed continuation
11. hard-bound discovery and remove avoidable status/context rereads
12. migrate remaining BlockIT Skill/package/protocol identifiers only after dependency mapping is stable
13. then restore generated-output/tests/CI closure
14. finally run local/live acceptance
```

## Immediate Design Work

Before touching Control implementation further, define the modelling-profile layer that complements the current technical modelling core:

```text
PROP
FURNITURE
VEHICLE
MECHANICAL
HUMANOID
CREATURE
PLANT_CUTOUT
GENERIC
```

Profiles are lightweight authoring knowledge overlays, not fixed geometry presets. They may describe semantic assemblies, articulation concerns, useful view relationships, common pivot/hierarchy concerns, and geometry-vs-texture decisions. They must not prescribe fixed cube counts or coordinates.

After these profiles are defined, upgrade the ChatGPT Reference Preparation contract so it can selectively use the same profile vocabulary and pass only decision-critical technical guidance to Codex.

## Stop Rules

- Do not create a second persistent state database inside Control.
- Do not duplicate Skill/Tool canonical content into Control.
- Do not load PRODUCT_DEVELOPMENT Skills during normal asset authoring.
- Do not keep a permanent router Skill after Control becomes canonical routing authority.
- Do not force complete reference packages for trivial corrections.
- Do not rename protocol/package identifiers blindly before their dependency map is understood.
- Do not spend effort making CI green while the architecture intentionally remains in active migration.

## Proof Boundary

Current source/documentation work proves design/source intent only. It does not prove installed LazyDesigner activation, live Blockbench behavior, visual quality, or end-to-end usage reduction. Those require later local/live validation.