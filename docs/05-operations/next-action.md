# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

The REMOTE_GITHUB pre-local hardening phase is complete enough to freeze safely. Bounded source defects found after the initial freeze were corrected without reopening a general cleanup phase: controller inspection schema/docs match, zero/null semantics are guarded, Particle is classified and invalidated through its Animation ownership, direct capability source ownership is more precise, `duplicate_element` invalidates dependent authoring evidence, canonical name-only phase coverage matches Runtime classification for exposed non-Core tools, Texture invalidation distinguishes authored mutations from focus-only state, and the Particle workflow now has one explicit generated-texture handoff, canonical resource layout, transactional PNG finalization, recovery semantics, Animation/Locator continuation, and a unified ChatGPT Reference → Codex/MCP handoff through the canonical `REFERENCE.json` package.

The user has explicitly chosen **not to enter `LOCAL_CODE` yet**. Do not run local/Bun/typecheck/live Blockbench work until that boundary is changed explicitly.

## Completed Baseline

```text
✓ canonical LazyDesigner Control at mcp/gateway/control/
✓ former navigator/ source removed with no alias
✓ ASSET_AUTHORING / SYSTEM_DEVELOPMENT routing
✓ GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
✓ exactly-one-profile Geometry loading
✓ content-addressed context reuse
✓ single capability-phase owner in mcp/lib/authoringPhase.ts
✓ exposed non-Core capability name coverage aligned with Runtime family classification
✓ single search fallback owner in mcp/gateway/control/routingPolicy.ts
✓ stable four-tool Gateway surface
✓ Geometry + Texturing shared AUTHORING surface
✓ Animation isolated as the only foreign authoring surface
✓ Particle retained as Animation-specialist asset support; no extra phase
✓ inspect_particle / manage_particle classified through canonical Animation ownership
✓ generated particle texture dependency routes to existing Texturing, not a new tool
✓ canonical generated particle texture reference stays under textures/particle/ and omits .png
✓ generated texture output path must resolve to the same textures/particle/... PNG
✓ particle texture state explicitly transitions missing → ready
✓ ready generated texture is verified as an existing non-empty PNG before particle write/preview
✓ paint_texture_transaction owns optional verified PNG persistence for final texture bitmap
✓ texture PNG persistence uses temporary write / replace / rollback inside the existing paint transaction
✓ PNG save failure rolls back the paint transaction and does not authorize particle resume
✓ pending particle texture dependency is a Control handoff, not an Animation mutation
✓ particle validation errors block particle write and preview
✓ particle binding remains owned by manage_animation_effects with explicit effect/time and locator when needed
✓ no create_particle_texture / save_particle_texture / fourth Particle phase
✓ manage_particle invalidates Animation evidence only after an actual completed particle mutation
✓ ChatGPT Particle Reference Authoring remains upstream Reference Preparation, not MCP Runtime
✓ Particle downstream handoff reuses canonical REFERENCE.json; no PARTICLE_HANDOFF.json
✓ REFERENCE.json asset.kind supports MODEL | PARTICLE
✓ MODEL profile remains model-only; no fake PARTICLE modelling profile
✓ Particle handoff block carries resource paths/readiness + locator/animation/trigger recommendations only
✓ Control referencePackage.ts projects Particle handoff metadata
✓ Control packet exposes asset_kind + particle metadata directly to Codex
✓ legacy model packages without asset.kind remain backward compatible when profile is recognized
✓ Particle handoff recommendations do not claim live locator/animation/runtime existence
✓ generic import/ui fallback remains extended opt-in only
✓ focused consolidated public tools keep legacy executors hidden
✓ canonical lazydesigner-* primary Skills
✓ legacy primary Skill paths removed
✓ Experimental Navigator authority pointers retired and guarded
✓ SYSTEM_DEVELOPMENT control/navigator wording resolves to canonical Control owners, not a retired navigator path
✓ orphan mcp/gateway/control/contextCache.ts removed
✓ registry.ts owns content-addressed context-handle caching
✓ packet.ts owns known/cached/invalidated context delivery
✓ direct source owners cover identified texture, paint, locator, selection, render-profile and element support capabilities
✓ consolidated wrappers remain owned by mcp/server/tools.ts where that wrapper is the real implementation boundary
✓ context ownership regression guard added
✓ support capability source-owner regression guard added
✓ Gateway/Control envelope overlap instrumented in measure-control-context.ts
✓ stable Gateway status contract left intact pending local measurement
✓ Runtime/catalog/project/interruption recovery owned by Gateway backend
✓ Workspace/Reference readiness recovery owned by Control projection
✓ OUTCOME_UNKNOWN mutation interruption remains no-auto-retry
✓ duplicate_element is tracked as a Geometry mutation and invalidates Geometry/Texturing/Animation dependent evidence
✓ authored gradient/copy/layer/material-import Texture changes invalidate Texture evidence
✓ activate_texture no longer invalidates authored Texture evidence because it only changes active focus
✓ Control phase-name coverage and Texture-mutation precision regression guards added
✓ Particle texture dependency / handoff / end-to-end static regression guards added
✓ Particle Reference projection + packet delivery regression guards added
✓ deterministic recovery ownership regression guard added
✓ Bedrock-first authoring contract regression guard added
✓ compatibility-bound BlockIT identifiers intentionally preserved
✓ no speculative receipt/result compaction without execution evidence
✓ inspect_animation controller selectors/docs aligned to actual schema
✓ controller numeric zero / explicit null semantics regression-guarded
✓ manage_animation_controller remains the single controller mutation surface
✓ controller native/resource intelligence remains extension wiring, not extra tools
✓ controller source ownership documented in implementation-map.md
✓ Particle workflow + Reference handoff ownership documented in implementation-map.md
```

## Remote Freeze State

```text
Control / Gateway policy ownership     COMPLETE IN SOURCE
Canonical capability phase coverage    HARDENED IN SOURCE
Tool-routing / source ownership        HARDENED FOR IDENTIFIED DIRECT OWNERS
Animation Controller ownership         COMPLETE IN SOURCE
Particle Control ownership             COMPLETE / FROZEN IN SOURCE
Particle texture dependency flow       COMPLETE / FROZEN IN SOURCE
Particle resource path contract        COMPLETE / FROZEN IN SOURCE
Particle error/recovery contract       COMPLETE / FROZEN IN SOURCE
Particle Animation/Locator binding     COMPLETE / FROZEN IN SOURCE
Particle Reference→MCP handoff         COMPLETE / FROZEN IN SOURCE
Reference package kind projection      COMPLETE / FROZEN IN SOURCE
Element mutation invalidation          HARDENED IN SOURCE
Texture mutation invalidation          HARDENED / MINIMIZED IN SOURCE
Controller inspection contract         HARDENED IN SOURCE
Controller nullish/zero semantics      REGRESSION-GUARDED
Dead-code / obsolete helper sweep      COMPLETE ENOUGH TO FREEZE
Context economy source audit           COMPLETE ENOUGH FOR LOCAL MEASUREMENT
Error/recovery ownership               COMPLETE IN SOURCE
Bedrock-first contract audit           COMPLETE IN SOURCE
Repository regression guards           UPDATED

REMOTE_GITHUB SOURCE HARDENING         FROZEN
LOCAL_CODE                             EXPLICITLY DEFERRED BY USER
LIVE_BLOCKBENCH                        EXPLICITLY DEFERRED BY USER
```

Do not add another remote-only cleanup phase merely to keep changing source. Reopen remote mutation only for a newly identified concrete source defect with bounded ownership. Capability phase ownership remains single-sourced in `mcp/lib/authoringPhase.ts`; do not create a second Control mapping table.

## Next Meaningful Context

```text
REMOTE_GITHUB
→ no open Particle Runtime or Particle Reference-handoff task remains
→ only reopen for a newly identified bounded source defect
→ keep ChatGPT Reference Authoring and MCP Runtime as separate authorities connected by REFERENCE.json
→ do not add a new Particle tool, save tool, phase, modelling profile, handoff manifest, or parallel texture pipeline

LOCAL_CODE — DEFERRED UNTIL USER EXPLICITLY REQUESTS IT
→ run bun/typecheck/repository verification
→ run Particle texture dependency/path/output/recovery tests
→ run Particle Reference projection + packet delivery tests
→ run Control particle handoff/invalidation tests
→ run Animation effect binding tests
→ run Control phase-name coverage regression test
→ run Control routing/invalidation/source-owner regression tests
→ run controller inspection/mutation/native-composition tests
→ run docs:build + docs:check from canonical generators
→ run measure:control
→ compare full Gateway envelope vs cached-context envelope
→ inspect any failing regression/type owner
→ change source only when execution evidence identifies a concrete defect

LIVE_BLOCKBENCH — DEFERRED UNTIL AFTER LOCAL_CODE / USER REQUEST
→ deploy/reload the matching current LazyDesigner build
→ verify generated particle texture create → paint → PNG save → ready resume
→ verify particle JSON write + native preview
→ verify REFERENCE.json Particle handoff reaches the intended runtime task without transcript dependence
→ verify manage_animation_effects particle keyframe with explicit locator
→ verify Gateway/Runtime project affinity
→ verify Geometry/Texturing/Animation surfaces live
→ exercise inspect_animation → manage_animation_controller → focused re-inspection
→ verify controller Undo/persistence/native blend/nested composition behavior
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
- No `create_particle_texture` or `save_particle_texture`; generated Particle bitmaps reuse existing Texturing tools.
- No second Particle painting or PNG persistence system outside the existing Texturing pipeline.
- No `PARTICLE` modelling profile; Particle is an asset kind / reference specialization, not Geometry profile ownership.
- No `PARTICLE_HANDOFF.json`; downstream handoff reuses canonical `REFERENCE.json`.
- No concurrent ChatGPT-reference and MCP-runtime authoring on the same Particle revision without an explicit handoff/correction boundary.
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

Current remote work establishes source contracts, ownership, path/recovery policy, Reference handoff projection, packet delivery, and regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated freshness, installed LazyDesigner activation, actual filesystem write behavior in Blockbench, native particle preview, live locator attachment, live Reference-package consumption, visual quality, and measured whole-task savings remain unverified until their corresponding proof contexts are activated.
