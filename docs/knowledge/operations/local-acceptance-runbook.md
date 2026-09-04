# Local Acceptance Runbook

Updated: 2026-09-05  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Current state: **reactivated by `docs/knowledge/next-action.md` for local/Codex handoff**.

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

Static source/CI never proves installed Blockbench behavior or visual quality. Static Footprint is a separate guardrail. Authoring Efficiency is evaluated only after the relevant quality gate passes and means Cost to Accepted Result.

## 2. Pin Local State

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Require a clean tree before reusing proof.

## 3. Source Proof + Build

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`verify:mcp` owns Runtime/Gateway typecheck, recursive tests, surface measurements, production build, and generated-doc freshness.

Record only material environment state: Local HEAD, build identity, Blockbench/Bun/Codex versions when useful, plugin path, Gateway config, Runtime endpoint, active phase. Unknown loaded artifact identity → `ENVIRONMENT / INSTALL` and STOP.

## 4. Deploy Exact Plugin

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Reload the plugin in Blockbench after deployment. Deployment does not prove the Gateway lifecycle.

## 5. Native Runtime Smoke

With the freshly built plugin loaded:

```bash
bun run verify:stateless-local
```

For deliberate native phase debugging only:

```bash
bun run verify:stateless-local -- texturing
bun run verify:stateless-local -- animation
```

This proves installed Runtime identity/current native `tools/list`; it does not prove normal Codex Gateway survival.

Current source-owned counts:

```text
callable Runtime union 51
Geometry              25
Texturing             35
Animation             19
```

## 6. Gateway Stability Gate

Configure Codex to use the stdio Gateway, not the direct Runtime endpoint.

Required continuous-session sequence:

```text
1. Start one Codex task with Blockbench closed.
2. Gateway remains callable; status reports Runtime offline.
3. Open Blockbench; same task reports Runtime online.
4. Search/describe/invoke one safe current Geometry capability.
5. switch_authoring_phase Geometry → Texturing.
6. Same task sees current Texturing capabilities; no client reconnect/new chat.
7. switch_authoring_phase Texturing → Geometry and continue.
8. Reload BlockIT plugin; same Gateway process recovers.
9. Close/open Blockbench; same Gateway process recovers.
10. Rebuild/reload a Runtime surface and confirm refreshed discovery when deliberately testing catalog invalidation.
```

PASS requires:

```text
Gateway client tools stay fixed
Runtime offline/online is truthful
phase handoff invalidates backend catalog only
client_reconnect_required=false
new_chat_required=false
manual MCP reconnect count = 0 after initial configuration
new chat count = 0
interrupted mutation is never blindly retried
```

A mutation transport interruption may return `OUTCOME_UNKNOWN`; inspect current model state before retrying.

## 7. DIRECT Smoke Gate

Before 3D-Assisted implementation, prove one small disposable normal asset through the current product path.

```text
Approved Reference visible
+ requested dimensions
+ Geometry Strategy = DIRECT
+ Animation Required = NO
→ Geometry
→ internal verify
→ user approve
→ checkpoint
→ Texturing
→ internal verify
→ user approve
→ checkpoint
→ Finalization
→ editable .bbmodel
```

This gate proves route/handoff/persistence behavior, not broad model-quality superiority.

Visual PASS still requires the actual approved reference + fresh current model evidence. Tool success, export success, low call count, or a scalar score cannot override QUALITY FAIL.

## 8. 3D_ASSISTED External Pipeline Gate

Run only after Gateway/DIRECT baseline is stable.

Canonical external sequence:

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ Shape GLB Gate
→ workspace/.../3d-assisted/shape.glb
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ primitive-decomposition.json + state.json
```

Authority:

```text
approved image       = visual authority
requested dimensions = numeric authority
shape.glb            = intermediate reconstructed shape
PrimitiveAnything    = intermediate decomposition
```

Gate rules:

- maximum one targeted Hunyuan regeneration for a diagnosed reconstruction issue;
- no blind PrimitiveAnything reruns to chase a prettier result;
- invalid/bad external output must stop before Runtime materialization;
- external state persists only accepted gate artifacts/hashes; temp crops/renders/logs stay in `.cache/`.

## 9. Dedicated Materializer Gate

Do this only after the external decomposition gate passes.

Target Runtime behavior:

```text
Active Workspace path
→ validate strategy + state schema + current hashes
→ validate complete decomposition before mutation
→ one atomic Undo transaction
→ one temporary pa_<id> Group/Bone + Cube per primitive
→ complete scaffold OR no accepted scaffold state
```

Required proof:

```text
valid decomposition → expected native editable Cubes
invalid/stale hash  → fail before mutation
partial conversion  → not accepted
Undo                → one operation restores pre-materialization state
no production Mesh
no generic UI import
no from_geo_json
```

## 10. End-to-End 3D_ASSISTED Gate

```text
Approved Reference + Dimensions + 3D_ASSISTED
→ external pipeline PASS
→ materializer PASS
→ Semantic Geometry Cleanup
→ remove live Shape GLB/reference_model
→ Geometry internal PASS
→ user approve/checkpoint
→ Texturing approve/checkpoint
→ optional Animation approve/checkpoint
→ Finalization
→ final editable .bbmodel
```

Shape GLB may be loaded through `manage_geometry_reference` as supporting comparison during semantic cleanup, but it is not a separate route and must not remain in production export.

## 11. Legacy UI Fallback Proof — Debug Only

Normal authoring has no two-profile proof matrix. Internal `extended` compatibility exists only for explicit Legacy UI Fallback debugging/maintenance.

Do not use generic UI fallback as a substitute for a missing authored BlockIT capability.

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
