# LazyDesigner Next Action
Updated: 2026-09-11
Branch: `Local` only.

This file owns **current implementation continuation only**. Product architecture belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; AI context/Skill/source ownership in `docs/04-system/`; proof interpretation in `docs/05-operations/current-validation.md`.

## Current Objective

The current REMOTE_GITHUB source-cleanup phase is complete enough to stop safely. Documentation/Reference architecture, Control, primary Skill naming, safe human-facing branding, and active repository routing regressions are source baselines. Local/live Blockbench testing remains deferred until explicitly reactivated.

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
✓ safe presentation branding migrated to LazyDesigner in:
  - MCP initialize/server instructions
  - Gateway backend human-readable errors/status
  - plugin lifecycle/install/dev-sync messages
  - Blockbench panel + status bar
  - local install docs + mcp/llms.txt
✓ compatibility identifier boundary documented + guarded
✓ stale repository regressions repaired:
  - current-doc-sync
  - repository-github-discipline
  - repository-supply-chain
  - control-source-migration
✓ no speculative Texture/Animation result compaction added without evidence
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
internal compatibility symbols/DOM/event keys where rename has no current value
```

Canonical boundary: `docs/04-system/compatibility-identifiers.md`.

## Deferred Higher-Context Residue

No further REMOTE_GITHUB mutation is required merely to continue the rename/cleanup. The next meaningful residue needs a context that can execute canonical generators and tests:

```text
LOCAL_CODE
→ update generated API-doc presentation source where still stale
→ bun run docs:build
→ bun run docs:check
→ run the relevant source verifier(s)
→ commit canonical source + generated output together

LIVE_BLOCKBENCH
→ only when installed/runtime/native/visual proof is explicitly reactivated
```

Compatibility-bound identifier migration is a separate future task and must be dependency-mapped atomically before any serialized value changes.

## Stop Rules

- No Navigator compatibility alias or second Control path.
- No replacement asset-router Skill.
- No legacy primary Skill aliases.
- No second persistent state DB inside Control.
- No duplicate capability-domain table outside `mcp/lib/authoringPhase.ts`.
- No all-profile/all-stage loading as reassurance.
- No full downstream reset for a bounded dependency.
- No blind package/protocol/plugin/environment rename.
- No speculative receipt compaction without recovery-state evidence.
- No hand-editing generated docs/output.
- No local/live acceptance while user testing remains deferred.

## Proof Boundary

Current work establishes source contracts and regression intent only. No Bun/typecheck/CI/local Runtime/Blockbench execution was performed in this phase. Generated freshness, installed LazyDesigner activation, live behavior, visual quality, and measured whole-task savings remain unverified until their proof context is explicitly activated.
