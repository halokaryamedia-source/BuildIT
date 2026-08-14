# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. `Local` is the current product/development authority.

**Project snapshot version: `v0.1`** — pre-local baseline. This project snapshot label is separate from the internal MCP plugin package version.

## Current Status

```text
PRELOCAL_OPTIMIZATION_COMPLETE
```

The current source contract and pre-local optimization closure are static/CI verified. **Installed-plugin freshness, live Blockbench behavior, model quality, runtime call efficiency, and persistence on the current build remain `LOCAL PROOF REQUIRED`.**

**Local acceptance is currently deferred.** Do not activate the local runbook or claim live Blockbench/model-quality improvement without a fresh explicit instruction and actual runtime proof.

## Product Flow

```text
1. PREPARE REFERENCE
2. AUTHOR BEDROCK MODEL
3. FINISH ASSET
```

Reference fidelity is **Minecraft-first**: recognizable Geometry + Texture that can be built cleanly in Blockbench matters more than exact 1:1 reconstruction. Minor reference drift may be resolved into one canonical Minecraft interpretation; unresolved material contradiction remains `BLOCKED`.

Root `AGENTS.md` owns routing. `docs/knowledge/flow.md` owns the detailed product sequence. Tool success is execution evidence, not visual approval.

## Asset Workspace

Persistent asset continuity lives under `workspace/`. **`workspace/README.md` is the full workspace contract.** A named active project owns one compact resume README plus its current editable model and deliberate retained files; Codex should open that named package only. Git history owns old revisions and transient captures/logs do not become project memory.

## Pre-local Optimization Closure

Current static closure includes:

- repository regression preflight before editing and one coherent logical patch;
- known/coherent Cube creation through `place_cube(elements=[...])` without batching uncertainty;
- affected-view-first correction verification with cross-view expansion only when material risk exists;
- meaningful workspace persistence rather than mutation-count checkpoints;
- canonical documentation ownership with historical review/decision residue removed;
- no speculative tool-count, runtime-prompt, router, or registration-profile redesign without installed-client evidence.

These are source/instruction/test improvements, not proof of runtime usage reduction.

## Local Acceptance — Deferred

No local run is active. `docs/knowledge/operations/local-acceptance-runbook.md` remains the single procedure owner but is inactive until `docs/knowledge/next-action.md` explicitly reactivates it after a fresh user instruction.

When reactivated, the acceptance sequence remains:

```text
current Local
→ clean tree + exact HEAD
→ static gate + fresh build
→ record mcp/dist/mcp.js SHA-256
→ load the exact local BlockIT build
→ restart Blockbench + reconnect MCP
→ verify endpoint + 62-tool default surface
→ verify:stateless-local
→ TEST 1 — MCP / CORE MECHANICS
→ persistence / export
→ TEST 2 — REFERENCE MODEL (ELEPHANT)
→ efficiency check
```

## Current Documentation Owners

- Root `AGENTS.md` owns routing and proof discipline.
- `CONTEXT.md` — stable facts
- `docs/knowledge/next-action.md` — repository/plugin continuation and whether local acceptance is active
- `workspace/README.md` — persistent asset workspace rules
- `workspace/active/<project>/README.md` — active asset-specific continuity
- `docs/knowledge/flow.md` — detailed current workflow
- `docs/knowledge/implementation-map.md` — source/tool ownership
- `docs/foundation/validation-report.md` — current proof state
- `docs/foundation/` — durable current policy
- `docs/knowledge/operations/local-acceptance-runbook.md` — local procedure only when explicitly reactivated

Historical audits, reviews, decisions, plans, experiments, retired fixtures, and obsolete model revisions belong in Git history rather than parallel current-owner files.

## Repository Map

```text
.agents/skills/     canonical Codex/agent skills and authoring judgement
mcp/                Blockbench plugin/runtime/build/tests/generated API docs
docs/foundation/    durable current policy + proof state
docs/knowledge/     current flow/repository-continuation/ownership/procedure
workspace/          persistent active/saved Blockbench asset packages
```

## MCP Development

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production output is the local build at `mcp/dist/mcp.js`. `dist/` is generated and not repository authority. **Package version alone is not freshness proof**; a future local acceptance records the exact Git HEAD plus SHA-256 of the built `mcp/dist/mcp.js` actually loaded by Blockbench.

Do **not** use the upstream hosted plugin as BlockIT proof.

Current static surface:

```text
62 enabled tools
76,439 tools/list response characters
53,493 input-schema characters
10,645 description characters
initialize instructions: 386 characters
max per-tool payload: 3,167 characters
runtime workflow prompt: 6,959 characters
```

Serialized character counts are static measurements, not installed-client token/context measurements.

## Runtime / Security Baseline

```text
default profile              bedrock_entity
endpoint                     http://127.0.0.1:3000/bb-mcp
transport                    stateless Streamable HTTP / JSON
Extended MCP Families        OFF by default
risky_eval                   disabled
from_geo_json                disabled
```

Normal asset authoring routes from current intent + known state to the exact MCP tool and active modelling/texturing/animation specialist. Do not broad-scan the repository/workspace, repeatedly rediscover known state, inspect every Cube, or capture after every mutation.

## Protected Capability Gaps

- AnimationController creation/mutation
- existing-animation direct sound/timeline-effect mutation
- TextureMesh direct authoring/inspection
- native Bedrock visible bounding-box fields
- animated-texture authoring
- bone-binding expressions

## Hygiene

One current owner per responsibility. Git history owns removed historical documentation and obsolete asset revisions. Do not add another routing, planning, review, scoring, profile, compatibility, packaging, or workspace-state layer without concrete need.

## License

GPL-3.0-only; see `LICENSE`.
