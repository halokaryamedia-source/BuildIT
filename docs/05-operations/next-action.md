# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

LazyDesigner Control source implementation is active. Documentation/Reference architecture is baseline; do not redo those audits without a concrete defect. Local/live Blockbench testing remains deferred until explicitly reactivated.

## Completed Baseline

```text
✓ AI-first docs + minimum-context contract
✓ Reference Preparation / typed authority / package contracts
✓ canonical LazyDesigner Control source at mcp/gateway/control/
✓ former active navigator/ source removed with no permanent alias
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT routing
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
✓ exactly-one-profile Geometry loading
✓ dynamic content-addressed context reuse
✓ canonical capability classification in mcp/lib/authoringPhase.ts
✓ effect-aware downstream invalidation with conservative fallback
✓ Workspace lifecycle readiness for Texturing / Animation
✓ metadata-only search/describe status rereads removed
✓ gateway-control-* regressions + measure:control
✓ MCP presentation docs use LazyDesigner identity
```

## Lifecycle Readiness

Persisted Workspace gates now bound legal stage continuation:

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

When Workspace state is unavailable, Control returns orientation-required instead of inventing a failure. Reference readiness remains separately stage-scoped.

## Identifier Migration Boundary

Current product-facing identity is LazyDesigner. Do **not** bulk-replace `blockit`.

Compatibility-bound identifiers intentionally retained until dependency mapping is complete:

```text
package name / MCP server IDs
bundle filename blockit_mcp.js
BBPlugin id blockit_mcp
GATEWAY_NAME blockit-gateway
BLOCKIT_* environment variables
x-blockit-* affinity headers
persisted setting IDs
legacy blockit-* Skill package paths
build/provenance identities coupled to the above
```

## Immediate Next Source Work

```text
1. map active compatibility-bound BlockIT identifiers to exact producers/consumers
2. migrate only bounded internal symbols and user-facing Runtime messages that cannot break compatibility
3. retire migration-only blockit-bedrock-entity-mcp Skill after all active references are explicitly migrated
4. audit Control packet/result payload for any remaining redundant fields/context
5. regenerate generated artifacts only when LOCAL_CODE/generator execution is reactivated
6. run local/live acceptance only when explicitly reactivated
```

## Stop Rules

- No Navigator compatibility alias or second Control path.
- No second persistent state DB inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No all-profile/all-stage loading as reassurance.
- No full downstream reset for a bounded dependency.
- No blind package/protocol/plugin/environment rename.
- No local/live acceptance while user testing remains deferred.

## Proof Boundary

Current work establishes source contracts and regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated freshness, installed LazyDesigner activation, live behavior, visual quality, and measured whole-task savings remain unverified until their proof context is explicitly activated.
