# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

LazyDesigner Control source implementation is active. Documentation/Reference architecture and ASSET_AUTHORING specialist naming are now source baselines. Local/live Blockbench testing remains deferred until explicitly reactivated.

## Completed Baseline

```text
✓ AI-first docs + minimum-context contract
✓ Reference Preparation / typed authority / package contracts
✓ canonical LazyDesigner Control source at mcp/gateway/control/
✓ former active navigator/ source removed with no permanent alias
✓ migration-only asset-router Skill retired and removed
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT routing
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
✓ exactly-one-profile Geometry loading
✓ dynamic content-addressed context reuse
✓ canonical capability classification in mcp/lib/authoringPhase.ts
✓ effect-aware downstream invalidation with conservative fallback
✓ Workspace lifecycle readiness for Texturing / Animation
✓ metadata-only search/describe status rereads removed
✓ summary-only top-level Workspace/Reference projections
✓ self-contained active-stage stage_context
✓ canonical ASSET_AUTHORING Skills:
  - lazydesigner-modelling
  - lazydesigner-texturing
  - lazydesigner-animation
✓ old modelling/texturing/animation Skill paths physically removed
✓ Control/docs/CI/regressions route to canonical specialist names
✓ compatibility identifier boundary documented + regression guarded
```

## Lifecycle Readiness

```text
GEOMETRY
→ no downstream prerequisite gate

TEXTURING
→ Geometry APPROVED
→ UV Layout PASS

ANIMATION
→ Geometry APPROVED
→ UV Layout PASS
→ Texturing APPROVED
```

Missing Workspace state requests orientation instead of inventing downstream failure. Reference readiness remains separately stage-scoped.

## Control Packet Economy

```text
workspace top-level
→ availability / fingerprint / asset summary

reference top-level
→ availability / fingerprint / asset/profile summary

stage_context
→ one self-contained active-stage decision projection
```

Full Workspace/Reference projections remain internal Control inputs for readiness, lifecycle and context identity.

## Identifier Migration Boundary

Current product-facing identity is LazyDesigner. Do **not** bulk-replace `blockit`.

Compatibility-bound identifiers intentionally retained:

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
1. audit PRODUCT_DEVELOPMENT Skill naming and direct consumers
2. migrate only non-compatibility Skill/package presentation identities atomically
3. continue bounded user-facing Runtime/Gateway BlockIT → LazyDesigner string cleanup
4. keep package/plugin/env/header/persisted identifiers stable until a dedicated migration exists
5. audit remaining active regressions for retired docs/symbols only when concrete evidence appears
6. regenerate generated artifacts only when LOCAL_CODE/generator execution is reactivated
7. run local/live acceptance only when explicitly reactivated
```

## Stop Rules

- No Navigator compatibility alias or second Control path.
- No replacement asset-router Skill.
- No legacy ASSET_AUTHORING specialist aliases.
- No second persistent state DB inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No all-profile/all-stage loading as reassurance.
- No full downstream reset for a bounded dependency.
- No blind package/protocol/plugin/environment rename.
- No local/live acceptance while user testing remains deferred.

## Proof Boundary

Current work establishes source contracts and regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated freshness, installed LazyDesigner activation, live behavior, visual quality, and measured whole-task savings remain unverified until their proof context is explicitly activated.
