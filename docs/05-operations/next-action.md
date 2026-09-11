# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

LazyDesigner Control source implementation is now active. Documentation and Reference Preparation architecture are baseline inputs; do not redo those audits unless a concrete source defect requires it.

Local/live Blockbench testing remains deferred until explicitly reactivated.

## Completed Baseline

```text
✓ AI-first documentation hierarchy
✓ minimum-context loading contract
✓ Skill ↔ Docs authority split
✓ Reference Preparation content audit
✓ typed visual / scale / JSON / stage authority
✓ Unified Reference image system
✓ Reference Package load contract
✓ static documentation/reference regression guards
```

## Implemented Control Slice

The active semantic/public contract is now:

```text
lazydesigner-control-v1
```

Physical source remains temporarily under:

```text
mcp/gateway/navigator/
```

That path is migration residue only; there is no second Navigator architecture.

Implemented:

```text
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT task classes
✓ Gateway status wired to LazyDesigner Control
✓ reference_package_path input
✓ current_user_delta input
✓ REFERENCE.json compact projection
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT projection
✓ original reference intent preserved separately from user delta
✓ Geometry loads Modelling Skill + exactly one selected profile
✓ Texturing loads only Texturing Skill by default
✓ Animation loads only Animation Skill by default
✓ former router Skill removed from mandatory authoring context
✓ context handles use current-file SHA-256 instead of hard-coded hashes
✓ known_context_ids reuse + same-family invalidation retained
✓ SYSTEM_DEVELOPMENT routes bounded source/specialist/test owners
✓ system-development base context no longer loads development-brief by default
✓ capability search/describe metadata renamed to Control semantics
✓ invoke returns control_delta
✓ reference blockers respect active stage readiness
✓ capability phase/domain classification now derives from mcp/lib/authoringPhase.ts
✓ duplicate Geometry/Texturing/Animation capability sets removed from Control registry
```

Canonical source ownership:

```text
mcp/gateway/index.ts
  → public four-tool Gateway + Control status wiring

mcp/gateway/navigator/referencePackage.ts
  → REFERENCE.json projection

mcp/gateway/navigator/contextProjection.ts
  → stage-specific Control context

mcp/gateway/navigator/packet.ts
  → task packet/readiness/context selection

mcp/gateway/navigator/registry.ts
  → dynamic context handles + source owner projection

mcp/gateway/navigator/delta.ts
  → post-operation invalidation

mcp/gateway/navigator/developmentIntent.ts
  → SYSTEM_DEVELOPMENT owner routing

mcp/lib/authoringPhase.ts
  → single canonical phase/capability classification owner
```

## Added / Updated Regression Owners

```text
mcp/tests/gateway-navigator.test.ts
mcp/tests/gateway-navigator-active-contract.test.ts
mcp/tests/gateway-navigator-development.test.ts
mcp/tests/gateway-navigator-routing.test.ts
mcp/tests/gateway-control-reference-readiness.test.ts
mcp/tests/gateway-control-phase-classification.test.ts
```

Legacy test filenames containing `navigator` are path/name migration residue, not semantic authority.

## Immediate Next Source Work

Continue in this order:

```text
1. map every remaining direct import/path dependency on mcp/gateway/navigator/**
2. physically rename navigator/ → control/ in one coherent migration with no permanent alias
3. rename Navigator-prefixed internal symbols/tests/scripts only where dependency mapping is complete
4. refine Control delta from domain-level affected knowledge toward field/effect-aware minimum invalidation
5. strengthen lifecycle readiness projection using current Workspace + Reference stage state
6. hard-bound remaining discovery/status rereads
7. migrate remaining BlockIT identifiers only after Control path/symbol migration is stable
8. regenerate generated artifacts through canonical generators when LOCAL_CODE is available
9. run local/live acceptance only when explicitly reactivated
```

Known direct legacy consumer already identified:

```text
mcp/scripts/measure-navigator-context.ts
```

GitHub code-search indexing is not reliable for the `Local` branch, so physical rename must use direct source/tree evidence rather than assuming zero search results means zero dependencies.

## Invalidation Direction

Current Control delta marks affected knowledge by dependency direction:

```text
Geometry mutation
→ Geometry + potentially dependent Texture/Animation

Texture mutation
→ Texture + potentially dependent Animation

Animation mutation
→ Animation
```

This is an affected-domain signal, not permission to reset all downstream work. Next refinement should use mutation/effect fields to minimize actual invalidation.

## Stop Rules

- No permanent Navigator compatibility alias after physical migration.
- No second persistent state database inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No mandatory legacy router Skill in normal asset context.
- No all-profile or all-stage context loading as reassurance.
- No full downstream reset when only a bounded dependency is affected.
- No blind BlockIT/package/protocol rename before dependency mapping.
- No local/live acceptance while the user has deferred testing.

## Proof Boundary

Current changes establish source-level Control contracts and static regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated-output freshness, installed LazyDesigner activation, live Gateway behavior, visual quality, and measured end-to-end usage savings remain unverified until the appropriate later proof context is activated.
