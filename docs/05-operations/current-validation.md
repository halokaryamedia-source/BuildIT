# LazyDesigner Current Validation

Updated: 2026-09-12

This file owns **current proof interpretation only**. Product workflow belongs in `docs/01-product/flow.md`; reference preparation in `docs/02-reference/`; source ownership in `docs/04-system/implementation-map.md`; continuation in `docs/05-operations/next-action.md`.

## Current Source Architecture

```text
ChatGPT Reference Preparation
→ Reference Package
→ LazyDesigner Control
→ Codex
→ Gateway
→ Runtime
→ Plugin
→ Blockbench
```

The current source contract is Bedrock-first and keeps one ownership chain. Geometry and Texturing share AUTHORING; Animation is the only separate authoring Runtime surface.

## Source-Proven Contracts

### Control

```text
ASSET_AUTHORING / SYSTEM_DEVELOPMENT intake
Reference Package + Active Workspace projection
GEOMETRY_CONTEXT / TEXTURE_CONTEXT / ANIMATION_CONTEXT
exactly-one-profile Geometry loading
content-addressed context handles
stage-scoped readiness and bounded invalidation
control_delta continuation
```

Control selects context and lifecycle state; it is not a second Runtime, recovery engine, or persistent authored-state database.

### Gateway

The public AI-client surface remains exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Current source contains:

```text
persistent Gateway process boundary
demand-driven Runtime reconnect
bounded reconnect backoff
Runtime signature/catalog invalidation
catalog fast-path for discovery
serialized Runtime mutations
fail-closed project affinity
phase affinity
structured recovery semantics
OUTCOME_UNKNOWN with no mutation replay
normalized public status
canonical declarative capability effects
```

Plugin reload, Runtime rebuild, authoring phase change, or temporary Runtime loss are designed to recover below the persistent Gateway. Only replacing the Gateway process itself requires client reconnection. This behavior is **source-designed but not live-proven in the current phase**.

### Runtime

Current ownership is split explicitly:

```text
server/net.ts                         Runtime HTTP/MCP transport + operation serialization
server/runtime/registration.ts       registration/profile/surface ownership
server/runtime/consolidatedRoutes.ts consolidated route descriptors
server/runtime/consolidatedTools.ts  routing-only wrappers
server/runtime/phaseControl.ts       AUTHORING↔Animation control capability
server/runtime/bootstrap.ts          exactly-once Runtime intelligence wiring
server/tools/**                       domain Tool implementations
```

Runtime phase/profile changes use granular surface invalidation rather than discarding unrelated resource/prompt/callback caches.

### Plugin / Blockbench Boundary

```text
mcp/index.ts                         plugin orchestration only
mcp/plugin/runtimeHost.ts           native network + listener lifecycle
mcp/plugin/blockbenchIntegration.ts settings/UI/prompts/resources integration
mcp/plugin/devSync.ts               development reload watcher
```

Setup/teardown ownership is explicit and defensive against duplicate setup/reload.

### Tools — Zero Capability Loss

Tool cleanup is **routing/metadata/contract hardening only**.

Source guards preserve:

```text
original executor definitions
original runtime schemas/refinements/defaults
validation before execution
native Blockbench behavior
all consolidated branches
domain intelligence for Geometry / Texture / Animation / Particle
```

Consolidated capabilities delegate to retained original executors. Unknown branches fail instead of silently falling back to another operation.

Family baselines guard Geometry/Element, Texture/Material, Animation, Particle, Inspection and Export surfaces. No implementation algorithm was intentionally simplified for context/tool-count reduction.

### Validation / QA / Gates

Canonical handoff readiness: `mcp/lib/authoringReadiness.ts`.

```text
USER_APPROVED
or
AUTONOMOUS_VERIFIED
```

Animation handoff requires UV Layout PASS, no blockers and a saved checkpoint plus the appropriate approval/authorized-verification evidence.

Canonical Validator projection: `mcp/lib/validationVerdict.ts`.

```text
BLOCKED
REVIEW_REQUIRED
VALIDATOR_CLEAR
```

`VALIDATOR_CLEAR` remains technical evidence only:

```text
approval_claim = false
visual_pass_claim = false
```

Quality-intelligence augmentation remains evidence-only and cannot create approval or phase authorization. Control lifecycle `READY` also does not replace `switch_authoring_phase` readiness.

### Skills / Knowledge / Context

Canonical context loading is owned by:

```text
docs/04-system/ai-context-loading.md
docs/04-system/authoring-stage-context.md
docs/04-system/control/context-projection.md
```

Normal authoring uses one active specialist and only the stage-relevant projection. Geometry may load exactly one selected modelling profile; Texturing/Animation receive only material/motion-relevant projected relationships by default. Shared Stage Context is a semantic contract, not another Skill/router/workflow engine.

Reference Preparation already compiles confirmed user intent before generation and does not pass raw conversation transcript or prompt history as the Codex handoff package.

## Compatibility Boundary

Current product-facing identity is LazyDesigner. These compatibility-bound values remain intentionally unchanged until a separately dependency-mapped migration:

```text
package/server/plugin IDs
blockit_mcp.js
blockit_mcp
blockit-gateway
BLOCKIT_* environment variables
x-blockit-* affinity headers
persisted setting identifiers
build/provenance identities coupled to them
```

Legacy-looking compatibility identifiers are not evidence of stale architecture by themselves.

## Historical Native Evidence

Historical BlockIT native/runtime proof predates the current LazyDesigner hardening. It must **not** be used as proof that the current `Local` source is installed, type-correct, live, or behaviorally accepted.

## Current Proof Ceiling

Safe current claims:

```text
Control/Gateway/Runtime/Plugin ownership         implemented in source
persistent-Gateway recovery architecture        implemented in source
zero-loss Tool routing contracts                implemented + regression-guarded in source
canonical QA/readiness separation               implemented + regression-guarded in source
stage-context/context-loading economy            implemented/guarded in source
Reference Package compact projection            implemented in source
compatibility boundaries                         documented in source
```

Not yet established for the current head:

```text
Bun/typecheck/test execution
canonical generated-output freshness
installed LazyDesigner Runtime freshness
live Gateway survival across reload/rebuild/close-open
native project affinity/rebind behavior
Undo/playback/persistence/export execution
visual/reference acceptance
Minecraft in-game behavior
measured token/latency or whole-task usage savings
```

Tests added during the remote hardening phase are **source regression intent until they are actually executed**.

## Efficiency Interpretation

Authoring Efficiency means **Cost to Accepted Result**, not fewer tools or fewer lines. Source changes target repeated context loading, duplicate routing, unnecessary discovery/readback, phase bouncing, cache churn and recovery ambiguity while preserving accepted quality and capability.

Static character counts or source size alone cannot prove end-to-end usage improvement.

## Proof Rule

Do not strengthen source/static claims into local/live/visual claims without matching evidence from the exact current source SHA.