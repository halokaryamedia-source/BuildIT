# Local Acceptance Runbook

Updated: 2026-09-06  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Current state: DIRECT disposable tests only; GPU/3D_ASSISTED deferred.

This procedure activates only when `docs/knowledge/next-action.md` explicitly reactivates local testing. `LIVE_BLOCKBENCH` is an execution capability; it does not activate this procedure by itself. Targeted live debugging may use that capability without formal Local Acceptance.

Use this runbook only for residue repository CI cannot prove. GitHub must finish source/static/CI work and prepare deterministic harness/provenance first. Do not edit source locally until a reproducible local failure identifies the first wrong owner.

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

Require a clean tree before reusing proof. Do not repeat accepted source checks from another SHA.

## 3. Source Closure — Fast path from exact green GitHub proof

Use the full source gate in `GITHUB_RULES.md`: successful `verify:full`, or successful `verify:repository` + `verify:mcp` on the same exact `Local` SHA. The latter is composite evidence, not an executed `verify:full`. Reuse only for a clean matching HEAD with no source/package edits. Do not rerun solely because proof came from CI.

`verify:authoring` also owns committed representative-fixture static contracts such as `verify:fixture-static`; reuse its exact-SHA CI result instead of rechecking deterministic repository artifacts on desktop.

Install pinned local script dependencies once:

```bash
cd mcp
bun install --frozen-lockfile
```

### Missing source proof

Run `bun run verify:full` once only when exact source proof is genuinely missing or the checkout changed after that proof. `verify:closure` is an iteration diagnostic.

## 4. Deploy Exact Plugin — prefer verified CI artifact

A successful `MCP Verify` may publish artifact `blockit-mcp-verified` containing:

```text
blockit_mcp.js
blockit-build-provenance.json
```

Prefer that exact-run artifact for acceptance. Extract it to an absolute local directory, then deploy **without rebuilding**:

```bash
bun run deploy:verified -- /absolute/path/to/artifact-dir /absolute/path/to/blockit_mcp.js
```

`deploy:verified` fails closed unless provenance repository/ref/source SHA matches the current checkout and bundle SHA-256 + embedded `build_identity` match the artifact.

Fallback only when no matching CI artifact exists or intentionally testing unpushed local source:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

`deploy:local` owns build + copy; do not build twice. Preserve unsaved projects/assets/settings/credentials/other plugins before cleanup; no `git clean -xfd`.

Reload BlockIT after deployment and reconnect the client.

## 5. Native Runtime Preflight — no duplicate smoke ritual

Normal Geometry/Texturing/Animation/Persistence/quality-fixture live verifiers share one preflight that checks installed `build_identity`, stable `instance_id`/`startup_time`, phase, stateless transport, initialize contract, `tools/list` count, required tools, and forbidden tool absence.

`verify:stateless-local` is **diagnostic only** when that shared preflight fails or exact full-surface diagnosis is explicitly required. Do not run it automatically before every live verifier. This leaves local acceptance focused on native behavior source/CI cannot prove.

## 6. Prepared DIRECT Native Sequence

Use the repository-owned disposable harness; do not redesign tests in Blockbench.

```text
shared AUTHORING
→ verify:geometry-live -- --confirm-disposable
→ user Geometry APPROVED
→ UV Layout PASS
→ verify:texturing-live -- --confirm-disposable
→ Texturing → Texture APPROVED
→ one AUTHORING→Animation handoff
→ verify:animation-live -- --confirm-disposable
→ verify:persistence-live -- --prepare --confirm-disposable
→ one native close/reopen
→ verify:persistence-live -- --verify --confirm-disposable
```

Geometry↔Texturing stays on the shared AUTHORING surface; no phase bounce. The disposable harness owns thin per-face UV, native 16x template/repack, semantic pixel preservation, Painter target/clip, A-vs-selected-B animation targeting, Undo/Redo and persistence assertions.

Synthetic disposable-test readiness never proves user asset approval. Tool success, export success, low call count, or a scalar score cannot override **QUALITY FAIL**.

## 7. Representative quality fixture — current Lift example

The current Lift workspace is **only a representative test fixture** for BlockIT/MCP workflow quality. It is not a product target and must not create LIFT-specific tool behavior, schema, thresholds, workflow law, or acceptance rules. Another suitable fixture may replace it without changing production Runtime semantics.

Never mutate the approved fixture source for system testing. Open an exact disposable copy and, for the current example, set:

```bash
BLOCKIT_LIFT_DISPOSABLE_PATH=/absolute/path/to/lift-copy.bbmodel \
  bun run verify:lift-quality-live -- --confirm-disposable
```

That example verifier hashes references, captures comparable before/candidate views + atlas, runs one native 16x padded repack candidate, records native size, then Undo-restores the original state. Its fixture-specific observations are evidence about generic MCP/workflow behavior, not product requirements. A `<=512` result is only a packing candidate.

Visual/reference `PASS` still requires the actual approved reference plus fresh comparable model evidence. No source/static metric or automatic similarity score may create visual PASS.

## 8. Gateway Stability — only when lifecycle proof is requested

Gateway lifecycle is separate from normal live authoring harness. When explicitly required, use one continuous client task and prove offline→online recovery, AUTHORING↔Animation catalog handoff, plugin reload recovery, and close/open recovery without a new chat. Geometry↔Texturing remains shared AUTHORING.

A mutation interruption may return `OUTCOME_UNKNOWN`; inspect state before retrying. Do not blindly repeat a destructive request.

## 9. 3D_ASSISTED — deferred unless explicitly resumed

Setup/binding/source checks live in `mcp/scripts/three-d-assisted/README.md`. Do not execute GPU/native work while deferred.

When resumed:

```text
Approved Reference Board
→ deterministic LEFT/FRONT/BACK extraction
→ Hunyuan3D v1 Shape Reconstruction
→ Shape GLB Gate
→ PrimitiveAnything
→ Primitive Decomposition Gate
→ materialize_3d_assisted_scaffold
→ Semantic Geometry Cleanup
→ user Geometry APPROVED
→ UV Layout PASS
→ Texture APPROVED
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

Classify the first wrong owner before correction; follow `AGENTS.md` retry boundaries. If a live verifier exposes a source defect, return only that defect to the appropriate development context; do not restart the entire GitHub audit.

Update state owners only when state changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When requested proof criteria are satisfied, **STOP**.
