# Next Action

Updated: 2026-09-05 — user-driven authoring contract

Working branch: **`Local` only**. Continuation only; facts → `CONTEXT.md`, proof → `current-validation.md`, ownership → `implementation-map.md`.

## Current Status

```text
BLOCKIT GATEWAY: SOURCE_READY
AUTHORING TAXONOMY: DESIGN_LOCKED — user-selected DIRECT | 3D_ASSISTED
DIRECT AUTHORING: SOURCE_READY
3D_ASSISTED TARGET PIPELINE: DESIGN_LOCKED / IMPLEMENTATION PENDING
OPTIONAL 3D EVIDENCE: RETIRED — replaced by 3D_ASSISTED package
REFERENCE GENERATION: CHATGPT
STAGE APPROVAL: USER IN LIVE BLOCKBENCH
LEGACY UI FALLBACKS: DEBUG/MAINTENANCE ONLY
LIVE GATEWAY PROOF: PENDING
```

Canonical flow:

```text
ChatGPT reference → Active Workspace + Requirement Gate
→ user selects DIRECT | 3D_ASSISTED
→ create Blockbench project
→ Geometry → approve/checkpoint
→ Texturing → approve/checkpoint
→ Animation when required → approve/checkpoint
→ Finalization → final save
```

## Implementation Still Required

3D-Assisted is not production-ready until both exist:

1. **Thin resumable external orchestrator**
   fixed LEFT/FRONT/BACK extraction → Shape Reconstruction/Hunyuan3D v1 → bounded GLB gate → `shape.glb` → PrimitiveAnything/decomposition gate → `primitive-decomposition.json` + `state.json`.

2. **Dedicated Geometry scaffold materializer**
   Active Workspace path only → validate canonical state/schema/hashes → one temporary Group/Bone + Cube per primitive → one atomic Undo transaction → complete scaffold or no accepted scaffold.

Keep Gateway at four tools. No `from_geo_json`, arbitrary primitive payload, provider router, or automatic strategy classifier. Materializer remains experimental until proof; update generated MCP docs through canonical generators.

## Existing Model Contract

Tracked `.bbmodel` reuses strategy. Untracked model asks strategy only for Geometry work. Persist external baseline before first mutation. Reopen/approve only affected stages; invalidate only materially dependent downstream approvals.

## Local / Live Proof

User deferred local/live testing. **Do not activate formal Local Acceptance or live Gateway/3D-Assisted proof until explicitly requested.**

Later proof tracks stay separate: Gateway lifecycle; external orchestrator; atomic materialization/Undo/stale rejection; end-to-end DIRECT/3D_ASSISTED approval.
