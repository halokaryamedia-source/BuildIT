# Local Acceptance Runbook

Updated: 2026-09-04  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly reactivates local testing.

`LIVE_BLOCKBENCH` is an execution capability; it **does not activate** this procedure by itself. Targeted live debugging may use that capability without activating formal Local Acceptance. Use this runbook only for claims repository CI cannot prove. Do not edit source until a reproducible failure identifies the first wrong owner.

## 1. Acceptance Contract

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

Static source/CI never proves installed Blockbench behavior or visual quality. **Static Footprint** is a separate guardrail. **Authoring Efficiency is evaluated only after the relevant quality gate passes** and means Cost to Accepted Result.

## 2. Pin Local State

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Require a clean tree before reusing prior proof.

## 3. Source Proof + Build

### Fast path — reuse exact green MCP Verify

Use only when the current clean HEAD has an exact successful MCP Verify and no local source/package edits follow it. Then:

```bash
cd mcp
bun install --frozen-lockfile
bun run build
```

### Full path

Otherwise:

```bash
cd mcp
bun install --frozen-lockfile
bun run verify:mcp
```

`verify:mcp` owns Runtime/Gateway typecheck, full tests, surface measurements, production build, and generated-doc freshness.

Record only material environment state: Local HEAD, build identity, Blockbench/Bun/client versions when useful, plugin path, Gateway config, Runtime endpoint, and active phase. Unknown loaded artifact identity → `ENVIRONMENT / INSTALL` and STOP.

## 4. Native Runtime Proof

Load the freshly built plugin, then prove the native Runtime contract directly:

```bash
bun run verify:stateless-local
```

For deliberate native phase checks:

```bash
bun run verify:stateless-local -- texturing
bun run verify:stateless-local -- animation
```

This proves the installed Runtime identity/current native `tools/list`; it does **not** prove the normal Gateway connection survives Runtime lifecycle changes.

Current normal Runtime counts are source-owned: 51 callable union, Geometry 25, Texturing 35, Animation 19. Historical counts are not compatibility targets.

## 5. Gateway Stability Gate

Configure the AI client to use the stdio Gateway rather than the direct Runtime endpoint.

Required continuous-session sequence:

```text
1. Start one Codex/client task with Blockbench closed.
2. Gateway remains callable; status reports Runtime offline.
3. Open Blockbench; same task reports Runtime online.
4. Search/describe/invoke a safe current Geometry capability.
5. switch_authoring_phase Geometry → Texturing.
6. Same task discovers current Texturing capabilities; no client reconnect/new chat.
7. switch_authoring_phase Texturing → Geometry and continue.
8. Reload BlockIT plugin; same Gateway process recovers.
9. Close/open Blockbench; same Gateway process recovers.
10. Rebuild/change one Runtime tool surface, reload, and confirm refreshed capability discovery.
```

PASS requires:

```text
Gateway client tools stay fixed
Runtime offline/online transition is truthful
phase handoff invalidates only backend catalog
client_reconnect_required=false
new_chat_required=false
manual MCP reconnect count = 0 after initial Gateway configuration
new chat count = 0
interrupted mutation is never blindly retried
```

A transport interruption after a mutation may return `OUTCOME_UNKNOWN`; inspect current model state before retrying.

## 6. Reference-Grounded Runtime Proof

Exercise only the evidence branch required by the claim.

General visual gate:

```text
approved reference visible
+ fresh affected model evidence
→ IDENTITY
→ PRIMARY FORM / PROPORTION
→ CROSS-VIEW COHERENCE
→ TOPOLOGY / ATTACHMENT
→ IMPORTANT NEGATIVE SPACE
→ MINECRAFT / BLOCKBENCH BUILDABILITY
→ FAIL | UNVERIFIED | PASS
```

Tool success, coordinates, export success, low call count, or scalar scores cannot override **QUALITY FAIL**.

### Optional 3D Evidence sub-gate

Run only when approved 3D Evidence is actually part of the task. It is not a separate authoring route and no image-only A/B run is required.

Detailed generation/alignment procedure remains in `Experimental/three-d-assisted-hunyuan-poc/README.md`.

Minimum live proof:

```text
approved image visible + requested dimensions known
→ manage_geometry_reference(load)
→ observe raw bounds
→ uniform FIT_ENVELOPE scale
→ fresh post-scale bounds
→ center X/Z + ground Y translation
→ fresh aligned evidence
→ canonical captures
→ semantic Groups/Cubes
→ compare approved image + fresh model views
→ remove transient reference
→ export .bbmodel
→ verify no reference_model remains
```

Authority remains:

```text
approved image       = visual authority
requested dimensions = numeric authority
optional GLB         = supporting 3D evidence
raw GLB bounds       = observation only
```

No non-uniform stretch, GLB rewrite, mesh repair/decimation, voxelizer, triangle→Cube conversion, or scalar GLB-quality authority.

## 7. Legacy UI Fallback Proof — Debug Only

Normal authoring has no two-profile proof matrix. Internal `extended` compatibility exists only to expose Legacy UI Fallback families for explicit debug/maintenance needs.

If that fallback is intentionally tested:

```text
normal authored capability remains preferred
→ enable Legacy UI Fallbacks (Debug)
→ verify only the requested fallback behavior
→ risky_eval remains disabled
→ from_geo_json remains disabled
→ disable fallback again when debug need ends
```

Do not use generic UI fallback as a substitute for a missing authored BlockIT capability and do not score it as a normal authoring route.

## 8. Authoring Efficiency

Only after quality PASS, record observable work that can change a decision: meaningful Gateway/Runtime calls, `search_capabilities`/`describe_capability` discovery, capability-search misses, repeated discovery, redundant readbacks, correction attempts, same-cause retries, recovery, phase handoffs, and elapsed workflow cost when measurable.

```text
NECESSARY | AVOIDABLE | CONTRACT_CAUSED | REASONING_CAUSED | RECOVERY
IMPROVED | UNCHANGED | REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases. Do not invent token/latency numbers.

## 9. Failure / Completion

First wrong owner examples:

```text
AGENT_REASONING | SKILL_INSTRUCTION | GATEWAY_ROUTING | MCP_PUBLIC_CONTRACT
MCP_RESULT_QUALITY | MCP_PHASE/HANDOFF | STATE_DISCOVERY | VISUAL_FEEDBACK
BLOCKBENCH_RUNTIME | ENVIRONMENT/INSTALL | OPTIONAL_3D_EVIDENCE
TEXTURE/PBR | ANIMATION | PERSISTENCE/EXPORT | UNKNOWN
```

Update only state owners when their state changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When requested proof and criteria are satisfied, **STOP**.
