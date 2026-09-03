# Local Acceptance Runbook

Updated: 2026-09-01  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly reactivates local testing.

`LIVE_BLOCKBENCH` is an execution capability; it does not activate this procedure by itself. Targeted live debugging may use that capability without activating formal Local Acceptance. Use this runbook only for claims repository CI cannot prove. Do not edit source until a reproducible failure identifies the first wrong owner.

## 1. Acceptance Contract

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

Static source/CI never proves installed Blockbench behavior or visual quality. **Static Footprint** is a separate guardrail and cannot prove runtime efficiency. **Authoring Efficiency is evaluated only after the relevant quality gate passes** and means Cost to Accepted Result.

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

`verify:mcp` owns typecheck, full tests, surface measurements, production build, and generated-doc freshness. Do not separately repeat commands it already runs unless diagnosing a specific failure.

Record only material environment state: Local HEAD, build identity, Blockbench/Bun/client versions when useful, plugin path, endpoint, active phase, and current runtime profile/setting names. If exact loaded artifact identity is unknown → `ENVIRONMENT / INSTALL` and STOP.

## 4. Live Registry / Phase Gate

Load only the freshly built plugin, reconnect, then:

```bash
bun run verify:stateless-local
```

For deliberate phase checks:

```bash
bun run verify:stateless-local -- texturing
bun run verify:stateless-local -- animation
```

Runtime source is authority for current counts. Do not preserve historical 28/43/24 or 65 counts after consolidation merely to satisfy old measurements.

Foreign-phase mutation remains:

```text
HANDOFF_REQUIRED
→ target_phase + reason + readiness + resume_from
→ switch phase / reload / reconnect
→ continue
```

Same-phase future BASE ↔ EXTENDED routing must not be treated as a phase handoff.

## 5. Representative Runtime Proof

Exercise only the path needed by the claim. Reuse returned state; avoid confirmation rereads. A successful tool call proves execution only.

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

## 6. 3D-Assisted Route — Selected Image + Evidence Test

The product choice is already locked:

```text
approved image + requested dimensions + approved shape-only GLB
```

Do **not** run image-only A/B again. Detailed generation/alignment contract lives in `Experimental/three-d-assisted-hunyuan-poc/README.md`.

Required local path:

```text
1. approved image visible; fixture dimensions/front direction known
2. manage_geometry_reference(load): origin=[0,0,0], uniform_scale=1
3. record raw world bounds
4. plan uniform FIT_ENVELOPE with mcp/lib/threeDAssistedReferenceAlignment.ts
5. update uniform_scale only
6. obtain FRESH post-scale bounds
7. plan center X/Z + ground Y translation
8. update origin only
9. obtain FRESH aligned evidence
10. capture FRONT / SIDE / TOP / ISOMETRIC
11. author one coherent semantic Group/Cube blockout
12. judge approved image + fresh model views
13. remove transient reference
14. export editable .bbmodel
15. verify no reference_model state remains
```

Authority:

```text
approved image       = visual authority
requested dimensions = numeric authority
GLB                   = supporting 3D evidence
raw GLB bounds        = observation only
```

Acceptance requires uniform scale only, fresh measurement after scale, intended center/ground, shared coordinate frame, and reference cleanup before export. Unused envelope space on one/two axes is valid.

Non-goals: image-only comparison, extra 3D formats, non-uniform stretch, GLB rewrite, mesh repair/decimation, voxelizer, triangle→Cube conversion, semantic mesh parser, cuboid solver, new alignment tool/modes, Reference Models fork, scalar GLB quality authority.

Failure → identify first wrong owner → fix only that owner → rerun failing step first → rerun the 3D-Assisted Route → STOP.

## 7. Standard / Extended MCP Profile Local Proof

Before broad implementation, resolve the legacy registration-profile naming collision with capability `EXTENDED` and prove how same-phase EXTENDED definitions are reachable with the current client/transport.

Do not combine owner consolidation with an SDK/transport migration. Consider protocol/SDK changes only if the current mechanism cannot satisfy:

```text
BASE direct route → zero lookup
first EXTENDED need → bounded lookup/load
same EXTENDED capability again → reuse, zero second lookup
BASE ↔ EXTENDED same phase → no reload/reconnect/reset
foreign phase → HANDOFF_REQUIRED
```

After Core/Geometry/Texturing/Animation owners are consolidated, regenerate prompts/docs and run one final `bun run verify:mcp`, then live-test representative BASE, EXTENDED, reuse, and cross-phase handoff paths.

## 8. Authoring Efficiency

Only after quality PASS, record observable work that can change a decision: meaningful MCP calls, discovery/lookups, repeated lookup, tool-search misses, **redundant readbacks**, correction attempts/rebuilds, same-cause retries, recovery, phase handoffs/reloads, and elapsed workflow cost when measurable.

Classify material work when useful:

```text
NECESSARY | AVOIDABLE | CONTRACT_CAUSED | REASONING_CAUSED | RECOVERY
IMPROVED | UNCHANGED | REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases. Do not invent token/latency numbers.

## 9. Failure / Completion

First wrong owner examples:

```text
AGENT_REASONING | SKILL_INSTRUCTION | MCP_PUBLIC_CONTRACT | MCP_RESULT_QUALITY
MCP_PHASE / HANDOFF | STATE_DISCOVERY | VISUAL_FEEDBACK | BLOCKBENCH_RUNTIME
ENVIRONMENT / INSTALL | THREE_D_ASSISTED_ALIGNMENT | TEXTURE / PBR | ANIMATION
PERSISTENCE / EXPORT | UNKNOWN
```

Update only state owners when their state changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When requested proof and criteria are satisfied, **STOP**.
