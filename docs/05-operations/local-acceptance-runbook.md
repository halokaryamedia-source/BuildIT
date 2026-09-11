# Local Acceptance Runbook

Updated: 2026-09-10  
Owner: `LIVE_BLOCKBENCH` formal acceptance procedure  
Current state: native BlockIT authoring path only.

This procedure activates only when `docs/knowledge/next-action.md` explicitly reactivates local testing. `LIVE_BLOCKBENCH` is an execution capability; it does not activate this procedure by itself. Targeted live debugging may use that capability without formal Local Acceptance.

Use only for native residue; prepare source proof and deterministic fixtures first.

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

Source/CI is not visual proof. Static Footprint is a guardrail; Authoring Efficiency measures Cost to Accepted Result after the quality gate passes. User-stopped tests stay stopped.

## 2. Pin Local State

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Require a clean tree before reusing proof. Do not reuse source checks from another SHA.

## 3. Source Closure

Use the full source gate in `GITHUB_RULES.md`: successful `verify:full`, or successful `verify:repository` + `verify:mcp` on the same exact `Local` SHA. Reuse only for a clean matching HEAD with no source/package edits.

Install pinned local verifier dependencies once:

```bash
cd mcp
bun install --frozen-lockfile
```

If exact source proof is missing or checkout changed, run once:

```bash
bun run verify:full
```

## 4. Deploy Exact Plugin

A successful `MCP Verify` may publish `blockit-mcp-verified` containing `blockit_mcp.js` and provenance. Prefer a matching exact-SHA artifact when available.

```bash
bun run deploy:verified -- /absolute/path/to/artifact-dir /absolute/path/to/blockit_mcp.js
```

Fallback for intentionally unpushed local source:

```bash
bun run deploy:local -- /absolute/path/to/blockit_mcp.js
```

Preserve unsaved projects/assets/settings/credentials/other plugins. Do not use `git clean -xfd`.

## 5. Native Runtime Preflight

Geometry/Texturing/Animation/Persistence/quality-fixture live verifiers share one preflight: installed `build_identity`, stable instance/startup identity, phase, stateless transport, initialize contract, `tools/list`, required tools, and forbidden-tool absence.

`verify:stateless-local` is diagnostic only when that shared preflight fails or exact full-surface diagnosis is explicitly required. Do not run it automatically before every live verifier.

## 6. Prepared Native Sequence

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
→ AUTHORING→Animation handoff
→ verify:animation-live -- --confirm-disposable
→ verify:persistence-live -- --prepare --confirm-disposable
→ one native close/reopen
→ verify:persistence-live -- --verify --confirm-disposable
```

Geometry↔Texturing stays on the shared AUTHORING surface; no phase bounce. The readiness preflights are workflow checks, not new harness commands or approval states.

Synthetic readiness never proves user asset approval. Tool/export success, low call count, or a scalar score cannot override **QUALITY FAIL**.

## 7. Representative quality fixture

A committed sample asset is **only a representative test fixture** for BlockIT/MCP workflow quality. It is not a product target and **must not create LIFT-specific tool behavior**, schema, thresholds, workflow law, or acceptance rules. Another suitable fixture may replace it without changing production Runtime semantics.

Never mutate the approved fixture source for system testing. Use a disposable copy.

Visual/reference `PASS` still requires the approved reference plus fresh comparable model evidence. Static metrics or automatic similarity scores cannot create visual PASS.

## 8. Gateway Stability

Only when lifecycle proof is requested: use one continuous client task and prove offline→online recovery, AUTHORING↔Animation catalog handoff, plugin reload recovery, and close/open recovery without a new chat. Geometry↔Texturing remains shared AUTHORING. After `OUTCOME_UNKNOWN`, inspect state before retry.

## 9. Authoring Efficiency

After the quality gate passes, compare calls, discovery, capability-search misses, redundant readbacks, correction attempts, same-cause retries, recovery, handoffs and available elapsed cost.

```text
NECESSARY | AVOIDABLE | CONTRACT_CAUSED | REASONING_CAUSED | RECOVERY
IMPROVED | UNCHANGED | REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases. Do not invent token/latency numbers.

## 10. Failure / Completion

Targeted quality work uses disposable face/contact, adjoining texture and limb-cycle fixtures under the current specialist gates. Keep rejected assets frozen. Native and user visual proof remain separate from source tests.

Classify the first wrong owner before correction. If a live verifier exposes a source defect, return only that defect to the appropriate development context; do not restart the entire GitHub audit.

Update only changed owners:
- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — source ownership.

When requested proof criteria are satisfied, **STOP**.
