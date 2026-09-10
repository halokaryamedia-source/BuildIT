# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Architecture belongs in `flow.md`; reference preparation in `reference-handoff.md`; source ownership in `implementation-map.md`; proof interpretation in `current-validation.md`.

## Current Objective

Documentation-first transition from BlockIT/Navigator terminology to the LazyDesigner architecture.

Canonical product flow is now:

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

## Implementation Order

Do not optimize CI or generated-output cleanup yet. The current implementation sequence is:

```text
1. finish documentation authority cleanup
2. rename current Navigator module/concepts to Control without creating permanent aliases
3. make Control the explicit front-line intake for asset and system-development requests
4. derive capability/domain classification from canonical owners instead of manual duplicate tables
5. implement asset task-intent resolution
6. implement lifecycle readiness projection
7. implement dependency/downstream invalidation projection
8. implement evidence freshness projection
9. implement minimum-context / content-addressed continuation
10. hard-bound discovery and remove avoidable status/context rereads
11. only after architecture stabilizes: migrate remaining BlockIT identifiers/generated output/tests/docs
12. then restore verification/CI closure and run local/live acceptance
```

## Reference Package Work

Before Control implementation is treated as complete, define the practical ChatGPT handoff for representative cases:

```text
simple static prop
complex/asymmetric prop
animated character/creature
existing-asset correction
texture-only correction
animation correction
```

The package must remain adaptive: images are visual authority, compact JSON is preferred for machine-readable requirements, and Markdown is used only when technical explanation materially helps Codex.

## Stop Rules

- Do not create a second persistent state database inside Control.
- Do not duplicate Skill/Tool canonical content into Control.
- Do not force complete reference packages for trivial corrections.
- Do not rename protocol/package identifiers blindly before their dependency map is understood.
- Do not spend effort making CI green while the architecture intentionally remains in active migration.

## Proof Boundary

Current source/documentation work proves design/source intent only. It does not prove installed LazyDesigner activation, live Blockbench behavior, visual quality, or end-to-end usage reduction. Those require later local/live validation.