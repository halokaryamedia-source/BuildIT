# BlockIT

BlockIT is an AI-assisted **Minecraft Bedrock Entity** modelling workspace built around a local Blockbench MCP plugin. `Local` is the current product/development authority.

**Project snapshot version: `v0.1`** — pre-local baseline. This project snapshot label is separate from the internal MCP plugin package version.

## Current Status

```text
PRELOCAL_CONTROLLER_MUTATION_READY
```

The current source contract includes the pre-local optimization closure, bounded AnimationController mutation, existing-animation particle/sound/timeline effect mutation, controller-state particle/sound mutation, and animation-level `anim_time_update` / `blend_weight` mutation. These are source/static capabilities; current canonical CI/build/generated-doc freshness is still pending for the 64-tool source state. **Installed-plugin freshness, live Blockbench behavior, controller execution, model quality, runtime call efficiency, and persistence on the current build remain `LOCAL PROOF REQUIRED`.**

**Local acceptance is currently deferred.** Do not activate the local runbook or claim live Blockbench/model-quality improvement without a fresh explicit instruction and actual runtime proof.

## Product Flow

```text
1. PREPARE REFERENCE
2. AUTHOR BEDROCK MODEL
3. FINISH ASSET
```

Reference fidelity is **Minecraft-first**: recognizable Geometry + Texture that can be built cleanly in Blockbench matters more than exact 1:1 reconstruction. Minor reference drift may be resolved into one canonical Minecraft interpretation; unresolved material contradiction remains `BLOCKED`.

Root `AGENTS.md` owns routing and task-class boot. `GITHUB_RULES.md` owns ChatGPT ↔ GitHub execution/history/CI discipline. `docs/knowledge/flow.md` owns the detailed product sequence. Tool success is execution evidence, not visual approval.

## Asset Workspace

Persistent asset continuity lives under `workspace/`. **`workspace/README.md` is the full workspace contract.** A named active project owns one compact resume README plus its current editable model and deliberate retained files; Codex should open that named package only. Git history owns old revisions and transient captures/logs do not become project memory.

## Experimental Research

`Experimental/` is an isolated non-production research surface. `Experimental/README.md` owns the detailed On-Demand Blockbench Web Authoring POC contract.

Experimental source, workflows, `.bbmodel` files, screenshots, or artifacts do **not** become product capability, local-acceptance proof, or visual PASS merely because they exist or a workflow ran.

## Current Static Closures

Pre-local optimization keeps:

- regression preflight before editing and one coherent logical patch;
- known/coherent Cube creation through `place_cube(elements=[...])`;
- affected-view-first correction verification;
- meaningful workspace persistence rather than mutation-count checkpoints;
- canonical documentation ownership;
- no speculative tool-count, runtime-prompt, router, or registration-profile redesign without installed-client evidence.

Animation authoring now includes:

- `manage_animation_controller` for bounded state-machine mutation, including controller-state particle/sound lifecycle;
- `manage_animation_effects` for existing-animation particle/sound/timeline effects;
- `animation_timeline` support for `anim_time_update` and `blend_weight`.

These are source/instruction/test improvements, not proof of runtime usage reduction or live controller behavior.

## Local Acceptance - Reactivated

Reactivated by explicit user instruction on 2026-08-23; execution state, deployed artifact hash, and the pending plugin-enable step are owned by `docs/knowledge/next-action.md`. `docs/knowledge/operations/local-acceptance-runbook.md` remains the single procedure owner.

When reactivated, the acceptance sequence targets the current source surface:

```text
current Local
→ clean tree + exact HEAD
→ static gate + fresh build
→ record mcp/dist/mcp.js SHA-256
→ load the exact local BlockIT build
→ restart Blockbench + reconnect MCP
→ verify endpoint + 64-tool default surface
→ verify:stateless-local
→ TEST 1 — MCP / CORE MECHANICS
→ persistence / export
→ TEST 2 — REFERENCE MODEL (ELEPHANT)
→ efficiency check
```

## Current Documentation Owners

- Root `AGENTS.md` — task class, boot, routing, source/proof discipline
- `GITHUB_RULES.md` — GitHub branch/ref, tool-fit, commit/history, CI/API/security, retries, STOP
- `CONTEXT.md` — stable facts
- `docs/knowledge/next-action.md` — repository/plugin continuation and whether local acceptance is active
- `Experimental/README.md` — current bounded experimental research contract
- `workspace/README.md` — persistent asset workspace rules
- `workspace/active/<project>/README.md` — active asset-specific continuity
- `docs/knowledge/flow.md` — detailed current workflow
- `docs/knowledge/implementation-map.md` — source/tool ownership
- `docs/foundation/validation-report.md` — current proof state
- `docs/foundation/` — durable current policy
- `docs/knowledge/operations/local-acceptance-runbook.md` — local procedure only when explicitly reactivated

Historical audits, reviews, decisions, retired experiments, plans, fixtures, and obsolete model revisions belong in Git history rather than parallel current-owner files.

## Repository Verification

Verification is split by proof surface:

```text
repository/policy/routing changes
→ .github/workflows/repository-verify.yml
→ targeted static repository-contract tests

mcp/** executable/public contract changes
→ .github/workflows/mcp-verify.yml
→ typecheck + full contracts + surface + build + generated-doc freshness
```

Both verification workflows are read-only and path-scoped. A repository-only policy change should not trigger the full MCP executable suite merely for ceremony.

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

Production output is `mcp/dist/mcp.js`. `dist/` is generated and not repository authority. **Package version alone is not freshness proof.**

Current source surface contract:

```text
64 enabled tools
initialize instructions          <= 700 characters
tools/list response              <= 80,500 characters
input schemas                    <= 56,500 characters
descriptions                     <= 11,500 characters
max per-tool payload             <= 3,200 characters
runtime workflow prompt          < 7,000 characters
```

`measure:surface` must confirm the exact current serialized measurements before canonical PASS is claimed. These are static characters, not installed-client token/context measurements. The max-per-tool ceiling was **not increased** for the animation effect closure.

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

- AnimationController blend-curve mutation
- TextureMesh direct authoring/inspection
- native Bedrock visible bounding-box fields
- animated-texture authoring
- bone-binding expressions

## Hygiene

One current owner per responsibility. Git history owns removed historical documentation and obsolete asset revisions. Do not add another routing, planning, review, scoring, profile, compatibility, packaging, or workspace-state layer without concrete need.

## License

GPL-3.0-only; see `LICENSE`.
