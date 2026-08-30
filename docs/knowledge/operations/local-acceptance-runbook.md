# Local Acceptance Runbook

Updated: 2026-08-30  
Owner: local Codex/Opencode + desktop Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly reactivates local testing.

This runbook proves only live/runtime claims that repository CI cannot establish. Do not start it from a historical TODO or deferred state.

## 1. Acceptance Contract

Keep the Development Contract bounded:

```text
Goal
Success Metric
Forbidden Proxy / Non-Goal
First Evidence Required
Proof Required
STOP Condition
```

Required live proof may include:

```text
installed artifact freshness
live MCP phase/tool surface
fresh client registry
representative mutation + Undo
required phase handoff
reference-driven visual quality
Authoring Efficiency only after quality PASS
```

Do not edit source until a reproducible failure identifies the first wrong owner.

## 2. Pin Local State

From repository root:

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

A clean working tree is required before reusing CI proof.

## 3. Source Proof + Local Build

### Fast path — reuse exact green MCP Verify

Use only when all are true:

```text
working tree clean
current Local HEAD known exactly
completed successful MCP Verify exists for that exact HEAD
no local source/package edits exist after that commit
current task is not investigating CI/build/toolchain disagreement
```

When exact current CI status matters, read the workflow run for that commit. `docs/knowledge/current-validation.md` is current proof interpretation, not a substitute for exact run status.

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run build
```

The exact green CI result already owns typecheck/test/surface/docs proof; the local build exists to produce the artifact that will actually be loaded.

### Full path — CI proof cannot be reused

If any fast-path condition is false:

```bash
bun install --frozen-lockfile
bun run verify:mcp
```

`verify:mcp` is the package-owned full gate: typecheck → full tests → surface measurement → production build → generated-doc freshness.

Production artifact:

```text
mcp/dist/blockit_mcp.js
build_identity = sha256:<64 lowercase hex>
```

Record only material environment state: Local HEAD, `build_identity`, Blockbench/Bun/client versions when available, actual plugin path, endpoint, active authoring phase, and Extended MCP Families setting.

If the exact loaded artifact cannot be established, classify `ENVIRONMENT / INSTALL` and STOP.

## 4. Live Server / Registry Gate

Normal Geometry baseline:

```text
endpoint               http://127.0.0.1:3000/bb-mcp
profile                bedrock_entity
active phase           geometry
Geometry exposure      28 tools
retained catalog       65 tools across phases
Extended MCP Families  OFF
risky_eval             disabled
from_geo_json          disabled
```

Load only the freshly built plugin, reconnect, then from `mcp/` run:

```bash
bun run verify:stateless-local
```

For another deliberate phase:

```bash
bun run verify:stateless-local -- texturing
bun run verify:stateless-local -- animation
```

The smoke gate must match the source-owned phase surface and local `build_identity`; direct Geometry mutation schemas remain free of retired `plan_id`. A fresh client connection must then expose the same tool names. Server PASS + stale client registry means `ENVIRONMENT / INSTALL` first.

## 5. Phase Handoff

Runtime exposure remains:

```text
MCP CORE + exactly one ACTIVE PHASE
```

Crossing a phase boundary requires:

```text
HANDOFF_REQUIRED
→ retain target_phase + reason + readiness + resume_from
→ switch MCP Authoring Phase
→ reload/reconnect
→ rerun phase smoke
→ continue
```

Foreign-phase absence is expected; do not treat it as a discovery miss or borrow another phase's mutation tools.

## 6. Representative Runtime Proof

Do not exercise every tool. Prove one bounded path relevant to the requested claim.

Geometry example:

```text
small Bedrock project
→ Groups + Cubes
→ one justified rotated Cube when useful
→ focused inspection only when state is unavailable/stale
→ capture_model_views
→ one causal correction
→ Undo / Redo
→ export when in scope
```

Texturing starts only after Geometry/UV readiness passes. Animation starts only when required and its upstream readiness passes. Structural defects return to Geometry through handoff.

## 7. Visual / Authoring Quality Gate

The actual approved reference must be visible. Filename/path/README/memory is not image evidence.

Judge relevant dimensions such as:

```text
IDENTITY
PRIMARY FORM / PROPORTION
CROSS-VIEW COHERENCE
TOPOLOGY / ATTACHMENT
IMPORTANT NEGATIVE SPACE
MINECRAFT / BLOCKBENCH BUILDABILITY
```

When texture is in scope, also judge palette/material identity, part separation, identity-critical markings, and controlled detail density.

Tool success, valid coordinates, export success, or low call count cannot override **QUALITY FAIL**.

Use difference-first `FAIL | UNVERIFIED | PASS`. Apply a causal correction only after diagnosis. Two failed attempts in the same causal direction without new evidence → `BLOCKED`.

## 8. Authoring Efficiency — Cost to Accepted Result

**Authoring Efficiency is evaluated only after the relevant quality gate passes.** Static Footprint is a separate regression guard and cannot prove runtime efficiency.

Record only observable cost that can change a decision, such as meaningful MCP calls, phase handoffs/reloads, discovery, redundant readbacks, tool-search misses, view captures, correction attempts, Undo/recovery, same-cause retries, and broad repository/state reads.

Classify material work when useful:

```text
NECESSARY
AVOIDABLE
CONTRACT_CAUSED
REASONING_CAUSED
RECOVERY
```

For material corrections record:

```text
IMPROVED
UNCHANGED
REGRESSED
```

Quality must stay accepted while Cost to Accepted Result decreases; otherwise no efficiency improvement is claimed. Do not invent token or latency numbers; unknown values remain `UNVERIFIED`.

## 9. Failure / Completion

Use the first wrong owner:

```text
AGENT_REASONING
SKILL_INSTRUCTION
MCP_PUBLIC_CONTRACT
MCP_RESULT_QUALITY
MCP_PHASE / HANDOFF
STATE_DISCOVERY
VISUAL_FEEDBACK
CORRECTION_CAPABILITY
BLOCKBENCH_RUNTIME
ENVIRONMENT / INSTALL
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure: capture minimum evidence → fix the exact owner → rerun the failing scenario first → run only the relevant repository verifier → STOP.

Update only current owners when their state actually changes:

- `docs/knowledge/current-validation.md` — proof interpretation;
- `docs/knowledge/next-action.md` — continuation;
- `docs/knowledge/implementation-map.md` — ownership.

Historical rationale belongs in Git history. When requested proof and criteria are satisfied, **STOP**.
