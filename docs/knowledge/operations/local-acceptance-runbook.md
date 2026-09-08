# Local Acceptance Runbook

Updated: 2026-09-08  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Current state: DIRECT disposable tests only; GPU/3D_ASSISTED deferred.

This procedure activates only when `docs/knowledge/next-action.md` explicitly reactivates local testing. `LIVE_BLOCKBENCH` is an execution capability; it does not activate this procedure by itself. Targeted live debugging may use that capability without formal Local Acceptance.

Use this runbook only for residue repository CI cannot prove. GitHub completes source/static/CI work and prepares deterministic harness/provenance first. Do not edit source locally until a reproducible local failure identifies the first wrong owner.

## 1. Acceptance Contract

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
GitHub-completed
Higher-context residue
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

Require a clean tree before reusing proof. Do not reuse source checks from another SHA.

## 3. Source Closure — Fast path from exact green GitHub proof

Use the full source gate in `GITHUB_RULES.md`: successful `verify:full`, or successful `verify:repository` + `verify:mcp` on the same exact `Local` SHA. The latter is composite evidence, not an executed `verify:full`. Reuse only for a clean matching HEAD with no source/package edits; do not rerun solely because proof came from CI.

`verify:authoring` owns committed representative-fixture static contracts such as `verify:fixture-static`; reuse its exact-SHA CI result rather than repeating deterministic asset checks locally.

Install pinned local verifier dependencies once:

```bash
cd mcp
bun install --frozen-lockfile
```

If exact source proof is missing or checkout changed, run once:

```bash
bun run verify:full
```

## 4. Deploy Exact Plugin — prefer verified CI artifact

A successful `MCP Verify` may publish `blockit-mcp-verified` containing `blockit_mcp.js` and `blockit-build-provenance.json`.

Prefer that exact-run artifact and deploy **without rebuilding**:

```bash
bun run deploy:verified -- /absolute/path/to/artifact-dir /absolute/path/to/blockit_mcp.js
```

`deploy:verified` fails closed unless repository/ref/source SHA matches current checkout and bundle SHA-256 + embedded `build_identity` match provenance.

Fallback only when no matching artifact exists or intentionally testing unpushed local source:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

`deploy:local` owns build + copy; do not build twice. Preserve unsaved projects/assets/settings/credentials/other plugins; no `git clean -xfd`. Reload BlockIT and reconnect.

## 5. Native Runtime Preflight

Geometry/Texturing/Animation/Persistence/quality-fixture live verifiers share one preflight: installed `build_identity`, stable `instance_id`/`startup_time`, phase, stateless transport, initialize contract, `tools/list` count, required tools, and forbidden-tool absence.

`verify:stateless-local` is diagnostic only when that shared preflight fails or exact full-surface diagnosis is explicitly required:

```bash
bun run verify:stateless-local
```

Do not run it automatically before every live verifier.

## 6. Prepared DIRECT Native Sequence

Use the repository-owned disposable harness; do not redesign tests in Blockbench.

```text
shared AUTHORING
→ verify:geometry-live -- --confirm-disposable
→ UV readiness preflight
→ user Geometry APPROVED
→ UV Layout PASS
→ verify:texturing-live -- --confirm-disposable
→ Texturing → Texture APPROVED
→ Animation readiness preflight
→ one AUTHORING→Animation handoff
→ verify:animation-live -- --confirm-disposable
→ verify:persistence-live -- --prepare --confirm-disposable
→ one native close/reopen
→ verify:persistence-live -- --verify --confirm-disposable
```

The readiness preflights are workflow checks, not new harness commands or approval states: reuse fresh state, inspect only affected UV-risk or participating motion cohorts when needed, and correct blockers before the next gate/handoff.

Geometry↔Texturing stays on the shared AUTHORING surface; no phase bounce. The harness owns thin per-face UV, native 16x template/repack, semantic pixel preservation, Painter target/clip, A-vs-selected-B animation targeting, Undo/Redo and persistence assertions.

Synthetic readiness never proves user asset approval. Tool/export success, low call count, or a scalar score cannot override **QUALITY FAIL**.

## 7. Representative quality fixture — current Lift example

The current Lift workspace is **only a representative test fixture** for BlockIT/MCP workflow quality. It is not a product target and must not create LIFT-specific tool behavior, schema, thresholds, workflow law, or acceptance rules. Another suitable fixture may replace it without changing production Runtime semantics.

Never mutate the approved fixture source for system testing. Open a disposable copy; for the current example:

```bash
BLOCKIT_LIFT_DISPOSABLE_PATH=/absolute/path/to/lift-copy.bbmodel \
  bun run verify:lift-quality-live -- --confirm-disposable
```

This example records reference/view/atlas evidence around one native 16x padded repack and Undo-restores original state. Fixture observations are evidence about generic MCP/workflow behavior, not product requirements. A `<=512` result is only a packing candidate.

Visual/reference `PASS` still requires the approved reference plus fresh comparable model evidence. Static metrics or automatic similarity scores cannot create visual PASS.

## 8. Gateway Stability

Only when lifecycle proof is requested: use one continuous client task and prove offline→online recovery, AUTHORING↔Animation catalog handoff, plugin reload recovery, and close/open recovery without a new chat. Geometry↔Texturing remains shared AUTHORING. After `OUTCOME_UNKNOWN`, inspect state before retry.

## 9. 3D_ASSISTED — deferred unless explicitly resumed

Setup/binding/source checks live in `mcp/scripts/three-d-assisted/README.md`. Do not execute GPU/native work while deferred.

```text
Approved Reference Board
→ LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ materialize_3d_assisted_scaffold
→ Semantic Geometry Cleanup
→ UV readiness preflight
→ user Geometry APPROVED
→ UV Layout PASS
→ Texture APPROVED
→ Animation readiness preflight when Animation Required=YES
```

External output is intermediate evidence. Materialization requires current hashes, complete preflight, one atomic Undo transaction, and no accepted partial scaffold. `manage_geometry_reference` is comparison evidence only and must not survive production export.

## 10. Authoring Efficiency

After quality PASS, compare calls, discovery, capability-search misses, redundant readbacks, correction attempts, same-cause retries, recovery, handoffs and available elapsed cost.

```text
NECESSARY | AVOIDABLE | CONTRACT_CAUSED | REASONING_CAUSED | RECOVERY
IMPROVED | UNCHANGED | REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases. Do not invent token/latency numbers.

## 11. Failure / Completion

Classify the first wrong owner before correction. If a live verifier exposes a source defect, return only that defect to the appropriate development context; do not restart the entire GitHub audit.

Update only changed owners:
- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When requested proof criteria are satisfied, **STOP**.