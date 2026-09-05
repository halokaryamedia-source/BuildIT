# Local Acceptance Runbook

Updated: 2026-09-06  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Current state: reactivated by `docs/knowledge/next-action.md` for local/Codex handoff.

This procedure is active only when `docs/knowledge/next-action.md` explicitly reactivates local testing. `LIVE_BLOCKBENCH` is an execution capability; it does not activate this procedure by itself. Targeted live debugging may use that capability without formal Local Acceptance.

Use this runbook only for claims repository CI cannot prove. Do not edit source until a reproducible local failure identifies the first wrong owner.

## 1. Acceptance Contract

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

Static source/CI never proves installed Blockbench behavior or visual quality. Static Footprint is a guardrail. Authoring Efficiency is evaluated only after the relevant quality gate passes and means Cost to Accepted Result.

## 2. Pin Local State

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Require a clean tree before reusing proof.

## 3. Source Closure + Build

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:closure
bun run verify:mcp
```

An exact current green CI result may be reused only when the local tree is unchanged from that exact commit. Otherwise run the commands above. `verify:closure` protects semantic mirrors/generated freshness; `verify:mcp` owns Runtime/Gateway typecheck, recursive tests, surface measurements, production build, and generated-doc freshness.

Do **not** hardcode phase tool counts in this runbook. Source counts belong to `measure:phases`; installed counts belong to `verify:stateless-local` and live `tools/list` proof.

## 4. Deploy Exact Plugin

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Reload the plugin in Blockbench after manual deployment. Deployment alone does not prove Gateway lifecycle.

## 5. Native Runtime Smoke

With the freshly built plugin loaded:

```bash
bun run verify:stateless-local
```

This proves installed Runtime identity/current native `tools/list`; it does not prove normal Gateway survival or visual fidelity.

## 6. Gateway Stability Gate

Configure Codex to use the stdio Gateway, not the direct Runtime endpoint.

Required continuous-session sequence:

```text
1. Start one Codex task with Blockbench closed; Gateway stays callable and reports Runtime offline.
2. Open Blockbench; the same task reports Runtime online.
3. Search/describe/invoke one safe Geometry capability.
4. In the same AUTHORING surface, verify one current Texturing capability is discoverable without a phase switch.
5. Geometry↔Texturing stays on the shared AUTHORING surface; do not call switch_authoring_phase for this correction boundary.
6. When Animation is required and Texturing is approved, switch_authoring_phase AUTHORING → Animation.
7. Same task sees Animation capabilities; no client reconnect/new chat.
8. Switch Animation → Geometry/AUTHORING and continue the same task.
9. Reload BlockIT; the same Gateway process recovers.
10. Close/open Blockbench; the same Gateway process recovers.
```

PASS requires:

```text
Gateway client tools stay fixed
Runtime offline/online is truthful
Geometry/Texturing share AUTHORING without phase bounce
AUTHORING↔Animation invalidates backend catalog only
client_reconnect_required=false
new_chat_required=false
manual MCP reconnect count = 0 after initial configuration
new chat count = 0
interrupted mutation is never blindly retried
```

A mutation transport interruption may return `OUTCOME_UNKNOWN`; inspect current model state before retrying.

## 7. DIRECT Smoke Gate

Use one small disposable normal asset:

```text
Approved Reference visible
+ requested dimensions
+ Geometry Strategy = DIRECT
+ Animation Required = YES | NO
→ Geometry internal verify
→ user Geometry APPROVED
→ checkpoint
→ native production UV Layout
→ UV Layout PASS
→ Texturing + Texture Verify
→ user Texture APPROVED
→ checkpoint
→ optional AUTHORING→Animation handoff + user Animation approval
→ Finalization
→ editable .bbmodel
```

Tool success, export success, low call count, or a scalar score cannot override QUALITY FAIL.

## 8. 3D_ASSISTED External Pipeline Gate

Run only after Gateway/DIRECT baseline is stable.

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ Shape GLB Gate → shape.glb/state
→ PrimitiveAnything
→ Primitive Decomposition Gate → primitive-decomposition.json/state
```

Approved image is visual authority; requested dimensions are numeric authority. `shape.glb` and PrimitiveAnything output are intermediate evidence only. Maximum one targeted Hunyuan regeneration for a diagnosed reconstruction issue; no blind PrimitiveAnything reruns.

## 9. Dedicated Materializer Gate

Only after the external decomposition gate passes:

```text
Active Workspace path
→ validate strategy + state schema + current hashes
→ prevalidate complete decomposition
→ one atomic Undo transaction
→ one temporary pa_<id> Group/Bone + Cube per primitive
→ complete scaffold OR no accepted scaffold state
```

Required proof: valid decomposition creates expected native editable Cubes; invalid/stale hash fails before mutation; partial conversion is not accepted; one Undo restores pre-materialization state; no production Mesh, generic UI import, or `from_geo_json`.

## 10. End-to-End 3D_ASSISTED Gate

```text
Approved Reference + Dimensions + 3D_ASSISTED
→ external pipeline PASS
→ materializer PASS
→ Semantic Geometry Cleanup
→ remove live Shape GLB/reference_model
→ internal Geometry verify
→ user Geometry APPROVED
→ native production UV Layout → UV Layout PASS
→ Texturing + Texture Verify → user Texture APPROVED
→ optional Animation → user Animation APPROVED
→ Finalization
→ final editable .bbmodel
```

`manage_geometry_reference` may support comparison during cleanup, but it is not a separate route and must not remain in production export.

## 11. Legacy UI Fallback Proof — Debug Only

Internal `extended` exists only for explicit Legacy UI Fallback debugging/maintenance. Do not use generic UI fallback as a substitute for a missing authored BlockIT capability.

## 12. Authoring Efficiency

Only after quality PASS, record observable work that can change a decision: Gateway/Runtime calls, discovery, capability-search misses, redundant readbacks, correction attempts, same-cause retries, recovery, phase handoffs, and elapsed workflow cost when measurable.

```text
NECESSARY | AVOIDABLE | CONTRACT_CAUSED | REASONING_CAUSED | RECOVERY
IMPROVED | UNCHANGED | REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases. Do not invent token/latency numbers.

## 13. Failure / Completion

First wrong owner examples:

```text
AGENT_REASONING | SKILL_INSTRUCTION | GATEWAY_ROUTING | MCP_PUBLIC_CONTRACT
MCP_RESULT_QUALITY | MCP_PHASE/HANDOFF | STATE_DISCOVERY | VISUAL_FEEDBACK
BLOCKBENCH_RUNTIME | ENVIRONMENT/INSTALL | SHAPE_RECONSTRUCTION
PRIMITIVE_DECOMPOSITION | MATERIALIZER | TEXTURE/PBR | ANIMATION
PERSISTENCE/EXPORT | UNKNOWN
```

Update only state owners when their state changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When the requested proof criteria are satisfied, **STOP**.
