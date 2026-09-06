# Local Acceptance Runbook

Updated: 2026-09-06  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Current state: preparation only; GPU/live tests deferred.

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

### Fast path — reuse exact green source proof

Use the full source gate in `GITHUB_RULES.md`: successful `verify:full`, or successful `verify:repository` + `verify:mcp` on the same exact `Local` SHA. CI proof is accepted; the latter is composite evidence, not an executed `verify:full`. Reuse only for a clean matching HEAD with no source/package edits. Do not rerun solely because proof came from CI.

```bash
cd mcp
bun install --frozen-lockfile
```

### Missing source proof

Run `bun run verify:full` once when exact source proof is missing. `verify:closure` is an iteration diagnostic.

Section 4 proves deployment separately. `deploy:local` owns build and copy; do not build twice.

Source tool counts belong to `measure:phases`; installed counts belong to `verify:stateless-local` and live `tools/list` proof.

## 4. Deploy Exact Plugin

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Before cleanup: check unsaved projects and plugin IDs; stop checkout-owned watchers. Delete only verified legacy BlockIT files/cache within checked absolute paths. Preserve assets/settings/credentials/other plugins; no `git clean -xfd`. An unchanged verified bundle can use `scripts/deploy-local.ts` directly.

Reload BlockIT after deployment and prove Gateway lifecycle.

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

A mutation transport interruption may return `OUTCOME_UNKNOWN`; inspect state before retrying.

Animation requires `readiness={geometry_approved:true, uv_layout:"PASS", texture_approved:true, checkpoint:<saved .bbmodel>, no_blockers:true}`. Internal PASS is READY_FOR_USER_REVIEW. Synthetic disposable-test readiness never proves asset approval.

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

Prepare setup/binding/source checks first: `mcp/scripts/three-d-assisted/README.md`. Stop while testing is deferred. GPU/live proof requires approved intake and a stable Gateway/DIRECT baseline.

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ Shape GLB Gate → shape.glb/state
→ PrimitiveAnything
→ Primitive Decomposition Gate → primitive-decomposition.json/state
```

Reference is visual authority; dimensions are numeric authority. External output is intermediate evidence. Allow one diagnosed Hunyuan regeneration; no blind PrimitiveAnything reruns.

## 9. Dedicated Materializer Gate

After decomposition PASS: Gateway → `materialize_3d_assisted_scaffold(workspace_path)`.

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

Classify the first wrong owner before correction; follow `AGENTS.md` failure/retry boundaries.

Update only state owners when their state changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When the requested proof criteria are satisfied, **STOP**.
