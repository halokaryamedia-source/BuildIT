# Next Action

Updated: 2026-09-05 — approved authoring-flow contract

Working branch: **`Local` only**. Continuation only; stable facts → `CONTEXT.md`, proof → `current-validation.md`, ownership → `implementation-map.md`.

## Current Status

```text
BLOCKIT GATEWAY: SOURCE_READY
DIRECT AUTHORING FLOW: SOURCE_READY
USER-SELECTED STRATEGY CONTRACT: DESIGN_LOCKED
REFERENCE GENERATION OWNERSHIP: CHATGPT
ACTIVE WORKSPACE CONTRACT: DESIGN_LOCKED
STAGE USER-APPROVAL CONTRACT: DESIGN_LOCKED
3D_ASSISTED TARGET PIPELINE: DESIGN_LOCKED / PRODUCTION IMPLEMENTATION PENDING
LIVE GATEWAY PROOF: PENDING
```

Canonical user mental model:

```text
ChatGPT Reference
→ Codex Active Workspace + Requirement Gate
→ user selects DIRECT | 3D_ASSISTED
→ create Blockbench project
→ Geometry → user approve
→ Texturing → user approve
→ Animation when required → user approve
→ Finalization → final save
```

The user owns Geometry Strategy and final stage approval. Codex owns internal readiness and must not send materially broken work to user review.

## Locked New-Model Intake

Before Blockbench authoring:

```text
Asset
Approved Reference
Dimensions
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

Ask all missing mandatory values in one batch. Do not infer/default strategy and do not ask for redundant final confirmation when intake is complete and non-conflicting.

## Locked 3D-Assisted Target

`3D_ASSISTED` is one indivisible package:

```text
Approved Reference Board
→ fixed LEFT/FRONT/BACK extraction + validation
→ Shape Reconstruction
→ Shape GLB Gate
→ persist shape.glb
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ persist primitive-decomposition.json
→ dedicated atomic Cuboid Materialization
→ Materialization Gate
→ Semantic Geometry Cleanup
→ remove live GLB reference
→ final Geometry internal verify
→ user Geometry approval
```

Architecture term: `Shape Reconstruction`. V1 implementation: Hunyuan3D only. Do not add provider abstraction/router.

External Shape Reconstruction + PrimitiveAnything belong to local tooling controlled by Codex. Blockbench Runtime owns materialization/production Geometry.

## Production Implementation Still Required

Do **not** claim 3D-Assisted production readiness until these exact missing owners are implemented:

### 1. Canonical external orchestrator

One thin resumable local entrypoint that:

```text
reads current Active Workspace
→ validates fixed board extraction
→ runs Shape Reconstruction
→ bounded GLB gate/retry
→ persists canonical shape.glb + hash/state
→ runs PrimitiveAnything
→ decomposition gate
→ persists canonical primitive-decomposition.json + hash/state
```

Canonical machine state:

```text
workspace/active/<asset>/3d-assisted/state.json
```

It must not become a general workflow engine or provider framework.

### 2. Dedicated Geometry scaffold materializer

One Runtime capability behind the existing Gateway that:

- receives Active Workspace project path only;
- reads only canonical validated `state.json` + `primitive-decomposition.json`;
- fully validates before mutation;
- materializes one temporary Group/Bone + Cube per primitive;
- uses one atomic reversible Undo transaction;
- leaves complete scaffold or no accepted scaffold state;
- does not revive generic `from_geo_json` or accept arbitrary primitive payloads.

Capability name/schema should be chosen during implementation at the narrow MCP/Runtime owner; do not prebuild extra abstraction now.

### 3. Routing / regression alignment

After executable owners exist:

- expose materializer only in Geometry;
- keep Gateway client surface at four tools;
- classify it experimental until production proof;
- add only targeted regressions for workspace validation, atomic materialization, phase exposure, and stale artifact rejection;
- update generated MCP docs through canonical generators.

## Existing Project Flow

Existing `.bbmodel` update remains shorter than new-model flow:

```text
recover/create Active Workspace
→ persist external baseline before first mutation when untracked
→ inspect current model
→ determine affected stage(s)
→ ask only material missing information
→ update + internal verify
→ user approve affected stage(s)
→ invalidate only materially dependent downstream approvals
→ Finalization
```

Tracked models reuse stored Geometry Strategy. Untracked external models require strategy only if Geometry authoring is needed.

## Save / Lifecycle Contract

```text
stage approve → checkpoint save
last required stage approve → Finalization
Finalization PASS → final save → COMPLETE
COMPLETE remains in workspace/active/
move to workspace/saved/ only on explicit user request
```

## Local / Live Proof

The user has explicitly deferred local/live testing for now. **Do not start the formal Local Acceptance or live Gateway gate unless the user explicitly requests it.**

When later requested, separate these proof tracks:

```text
A. Gateway lifecycle / phase refresh / interrupted mutation recovery
B. 3D-Assisted external orchestrator runtime
C. atomic scaffold materialization + Undo + stale-artifact rejection
D. end-to-end DIRECT and 3D_ASSISTED authoring with user stage approval
```

Static/source design work must not be reported as those live proofs.

## Do Not Expand

Do not add:

```text
third Geometry strategy
automatic strategy classifier
GLB-only route
PrimitiveAnything-only route
user-supplied GLB v1 path
provider registry/router
fifth Gateway tool
generic JSON/geo importer
parallel project-state database
screenshot/tool-call history in workspace
```

unless a future evidenced requirement explicitly changes the product contract.
