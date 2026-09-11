# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

The REMOTE_GITHUB pre-local hardening phase is complete enough to freeze safely. A bounded controller consistency defect discovered after the initial freeze was corrected without reopening a general cleanup phase: controller inspection schema/docs now match, zero/null semantics are guarded, and controller source ownership is explicit. Further optimization that would change the stable Gateway status contract or depend on measured Runtime behavior is deferred to `LOCAL_CODE`; installed/native/visual proof remains deferred to `LIVE_BLOCKBENCH`.

## Completed Baseline

```text
✓ canonical LazyDesigner Control at mcp/gateway/control/
✓ former navigator/ source removed with no alias
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT routing
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
✓ exactly-one-profile Geometry loading
✓ content-addressed context reuse
✓ single capability-phase owner in mcp/lib/authoringPhase.ts
✓ single search fallback owner in mcp/gateway/control/routingPolicy.ts
✓ stable four-tool Gateway surface
✓ Geometry + Texturing shared AUTHORING surface
✓ Animation isolated as the only foreign authoring surface
✓ Particle retained as Animation-specialist asset support; no extra phase
✓ generic import/ui fallback remains extended opt-in only
✓ focused consolidated public tools keep legacy executors hidden
✓ canonical lazydesigner-* primary Skills
✓ legacy primary Skill paths removed
✓ Experimental Navigator authority pointers retired and guarded
✓ orphan mcp/gateway/control/contextCache.ts removed
✓ registry.ts owns content-addressed context-handle caching
✓ packet.ts owns known/cached/invalidated context delivery
✓ context ownership regression guard added
✓ Gateway/Control envelope overlap instrumented in measure-control-context.ts
✓ stable Gateway status contract left intact pending local measurement
✓ Runtime/catalog/project/interruption recovery owned by Gateway backend
✓ Workspace/Reference readiness recovery owned by Control projection
✓ OUTCOME_UNKNOWN mutation interruption remains no-auto-retry
✓ deterministic recovery ownership regression guard added
✓ Bedrock-first authoring contract regression guard added
✓ compatibility-bound BlockIT identifiers intentionally preserved
✓ no speculative receipt/result compaction without execution evidence
✓ inspect_animation controller selectors/docs aligned to actual schema
✓ controller numeric zero / explicit null semantics regression-guarded
✓ manage_animation_controller remains the single controller mutation surface
✓ controller native/resource intelligence remains extension wiring, not extra tools
✓ controller source ownership documented in implementation-map.md
```

## Remote Freeze State

```text
Control / Gateway policy ownership     COMPLETE IN SOURCE
Tool-routing / source ownership        COMPLETE IN SOURCE
Animation Controller ownership         COMPLETE IN SOURCE
Controller inspection contract         HARDENED IN SOURCE
Controller nullish/zero semantics      REGRESSION-GUARDED
Dead-code / obsolete helper sweep      COMPLETE ENOUGH TO FREEZE
Context economy source audit           COMPLETE ENOUGH FOR LOCAL MEASUREMENT
Error/recovery ownership               COMPLETE IN SOURCE
Bedrock-first contract audit           COMPLETE IN SOURCE
Repository regression guards           UPDATED

REMOTE_GITHUB SOURCE HARDENING         FROZEN
```

Do not add another remote-only cleanup phase merely to keep changing source. Reopen remote mutation only for a newly identified concrete source defect with bounded ownership.

## Next Meaningful Context

```text
LOCAL_CODE
→ run bun/typecheck/repository verification
→ run controller inspection/mutation/native-composition tests
→ run docs:build + docs:check from canonical generators
→ run measure:control
→ compare full Gateway envelope vs cached-context envelope
→ inspect any failing regression/type owner
→ change source only when execution evidence identifies a concrete defect

LIVE_BLOCKBENCH
→ deploy/reload the matching current LazyDesigner build
→ verify Gateway/Runtime project affinity
→ verify Geometry/Texturing/Animation surfaces live
→ exercise inspect_animation → manage_animation_controller → focused re-inspection
→ verify controller Undo/persistence/native blend/nested composition behavior
→ exercise Reference Package + Control continuation
→ verify interrupted/recovery behavior where safely reproducible
→ run representative Bedrock model quality/efficiency acceptance
```

Generated API-doc presentation freshness remains a `LOCAL_CODE` task because generated output must be produced by the canonical generator rather than hand-edited.

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
internal compatibility symbols/DOM/event keys where rename has no current value
```

Canonical boundary: `docs/04-system/compatibility-identifiers.md`.

Compatibility-bound identifier migration is a separate future task and must be dependency-mapped atomically before any serialized value changes.

## Stop Rules

- No Navigator compatibility alias or second Control path.
- No replacement asset-router Skill.
- No legacy primary Skill aliases.
- No second persistent state DB inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No duplicate Gateway search default outside `CONTROL_ROUTING_POLICY`.
- No new authoring phase merely to classify Particle or another supporting capability.
- No second Animation Controller mutation tool/profile; extend `manage_animation_controller` only when ownership is coherent.
- No mutation behavior inside `inspect_animation`; it remains read-only.
- No all-profile/all-stage loading as reassurance.
- No full downstream reset for a bounded dependency.
- No blind package/protocol/plugin/environment rename.
- No speculative Gateway status-contract compaction from static character counts alone.
- No automatic retry for outcome-unknown mutation interruption.
- No speculative mutation-receipt compaction without recovery evidence.
- No hand-editing generated docs/output.
- No claim of Bun/typecheck/CI/local/live PASS until that context actually executes it.

## Proof Boundary

Current remote work establishes source contracts, ownership, and regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated freshness, installed LazyDesigner activation, live controller behavior, visual quality, and measured whole-task savings remain unverified until their corresponding proof contexts are activated.
