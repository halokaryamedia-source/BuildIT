# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

LazyDesigner Control source implementation is active. Documentation and Reference Preparation architecture are baseline inputs; do not redo those audits unless a concrete source defect requires it.

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

## Completed Control Source Slice

```text
✓ canonical protocol: lazydesigner-control-v1
✓ canonical source path: mcp/gateway/control/
✓ former mcp/gateway/navigator/ source path removed
✓ no permanent Navigator compatibility wrapper
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT task classes
✓ Reference Package + Workspace projections
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
✓ original reference intent separated from current_user_delta
✓ Geometry loads Modelling Skill + exactly one selected profile
✓ Texturing/Animation avoid full profile reload by default
✓ legacy router Skill removed from mandatory authoring context
✓ dynamic current-file SHA-256 context handles
✓ known_context_ids reuse + same-family invalidation
✓ bounded SYSTEM_DEVELOPMENT owner routing
✓ Gateway imports canonical ./control module
✓ capability search/describe metadata uses Control semantics
✓ invoke returns control_delta
✓ active-stage Reference readiness controls blocking
✓ mcp/lib/authoringPhase.ts is single phase/capability classification owner
✓ duplicate Control capability-domain tables removed
✓ effect-aware downstream invalidation with conservative fallback
✓ gateway-control-* regressions replace gateway-navigator-* regressions
✓ measure:control replaces measure:navigator
```

Canonical source ownership:

```text
mcp/gateway/index.ts                    four-tool Gateway + Control wiring
mcp/gateway/control/**                  Control implementation
mcp/lib/authoringPhase.ts               canonical phase/capability classification
mcp/scripts/measure-control-context.ts  static Control payload measurement
```

## Immediate Next Source Work

Continue in this order:

```text
1. audit active remaining BlockIT/blockit-* identifiers by ownership and external compatibility risk
2. migrate user-facing/product-facing LazyDesigner identifiers first
3. keep package/protocol/bundle identifiers unchanged until their dependency/compatibility boundary is explicitly mapped
4. retire the migration-only asset-router Skill only after all active references are proven gone
5. harden lifecycle/readiness only where current Workspace + Reference evidence shows a real gap
6. hard-bound any remaining discovery/status rereads
7. regenerate generated artifacts through canonical generators when LOCAL_CODE is available
8. run local/live acceptance only when explicitly reactivated
```

### Identifier migration categories

```text
SAFE SOURCE/PRESENTATION
→ user-facing names, docs, descriptions, internal class/symbol names with bounded consumers

DEPENDENCY-MAPPED
→ MCP server/package IDs, bundle filenames, plugin IDs, client config names, persisted settings, generated manifests

HISTORICAL
→ Git history / explicitly non-authoritative Experimental material
```

Do not bulk-replace `blockit` across the repository.

## Stop Rules

- No Navigator compatibility alias or second Control path.
- No second persistent state database inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No mandatory migration-only router Skill in normal asset context.
- No all-profile or all-stage context loading as reassurance.
- No full downstream reset when only a bounded dependency is affected.
- No blind BlockIT/package/protocol rename before dependency mapping.
- No local/live acceptance while the user has deferred testing.

## Proof Boundary

Current changes establish source-level Control structure, physical source migration, static regression intent, and routing/context/invalidation contracts only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated-output freshness, installed LazyDesigner activation, live Gateway behavior, visual quality, and measured end-to-end usage savings remain unverified until the appropriate later proof context is activated.
