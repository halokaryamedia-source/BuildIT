# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

LazyDesigner Control source implementation is active. Documentation/Reference architecture and all primary LazyDesigner Skill naming are now source baselines. Local/live Blockbench testing remains deferred until explicitly reactivated.

## Completed Baseline

```text
✓ AI-first docs + minimum-context contract
✓ Reference Preparation / typed authority / package contracts
✓ canonical LazyDesigner Control source at mcp/gateway/control/
✓ former navigator/ source removed with no alias
✓ legacy asset-router Skill removed
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT routing
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
✓ exactly-one-profile Geometry loading
✓ dynamic content-addressed context reuse
✓ canonical capability classification in mcp/lib/authoringPhase.ts
✓ effect-aware downstream invalidation
✓ Workspace lifecycle readiness
✓ metadata-only search/describe status rereads removed
✓ compact Control packet with self-contained stage_context
✓ canonical REFERENCE_PREPARATION:
  - lazydesigner-reference-preparation
  - lazydesigner-prompt-compiler
✓ canonical ASSET_AUTHORING:
  - lazydesigner-modelling
  - lazydesigner-texturing
  - lazydesigner-animation
✓ canonical PRODUCT_DEVELOPMENT:
  - lazydesigner-mcp-development
  - lazydesigner-blockbench-development
  - lazydesigner-development-brief
✓ old primary Skill paths physically removed
✓ root/docs/CI/regressions route to canonical Skill identities
✓ compatibility identifier boundary documented + guarded
```

## Identifier Migration Boundary

Do **not** bulk-replace `blockit`. Compatibility-bound identifiers intentionally retained:

```text
package name / MCP server IDs
bundle filename blockit_mcp.js
BBPlugin id blockit_mcp
GATEWAY_NAME blockit-gateway
BLOCKIT_* environment variables
x-blockit-* affinity headers
persisted setting IDs
build/provenance identities coupled to the above
```

Canonical boundary: `docs/04-system/compatibility-identifiers.md`.

## Immediate Next Source Work

```text
1. audit user-facing Runtime/Gateway messages for stale BlockIT presentation language
2. migrate only human-readable strings that do not alter compatibility-bound values
3. keep package/plugin/env/header/persisted identifiers stable until a dedicated migration exists
4. audit remaining active regressions for retired docs/symbols only when concrete evidence appears
5. regenerate generated artifacts only when LOCAL_CODE/generator execution is reactivated
6. run local/live acceptance only when explicitly reactivated
```

## Stop Rules

- No Navigator compatibility alias or second Control path.
- No replacement asset-router Skill.
- No legacy primary Skill aliases.
- No second persistent state DB inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No all-profile/all-stage loading as reassurance.
- No full downstream reset for a bounded dependency.
- No blind package/protocol/plugin/environment rename.
- No local/live acceptance while user testing remains deferred.

## Proof Boundary

Current work establishes source contracts and regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated freshness, installed LazyDesigner activation, live behavior, visual quality, and measured whole-task savings remain unverified until their proof context is explicitly activated.
