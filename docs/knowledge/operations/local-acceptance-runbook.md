# Local Acceptance Runbook

Updated: 2026-08-24  
Owner: local Codex/Opencode + desktop Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` explicitly points here.

This is the single procedure for BlockIT live acceptance.

## 1. Goal

Prove what source/CI cannot: exact local plugin freshness, MCP runtime behavior, client tool exposure, core Bedrock authoring, persistence/export, efficiency observations, and one real reference-driven model.

There are two acceptance lanes:

```text
TEST 1 — MCP / CORE MECHANICS
→ prove representative tools and plugin behavior

TEST 2 — REFERENCE MODEL
→ prove the exact current MCP can build a good Minecraft/Blockbench model from an approved reference
```

Do not edit source before a reproducible failure identifies a concrete owner.

## 2. Required Reading

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ this runbook
→ mcp/README.md + mcp/AGENTS.md only when MCP implementation matters
```

Read `CONTEXT.md` only when a stable project fact materially affects the decision. Do not load Git history or the full foundation set by default.

## 3. Exact Local Build / Freshness Gate

Do not use package version as freshness proof. Record the exact `Local` HEAD and hash of the artifact prepared for Blockbench.

From repository root:

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

Working tree must be clean. Then from `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin:

```text
mcp/dist/mcp.js
```

Record:

```text
Local HEAD
mcp/dist/mcp.js SHA-256
Blockbench version
Bun version
client version when visible
actual BlockIT file/path loaded by Blockbench
MCP endpoint
Extended MCP Families setting
```

If exact artifact freshness cannot be established, classify `ENVIRONMENT / INSTALL` and stop before model-quality claims.

## 4. Load Current BlockIT / Reconnect MCP

Load the fresh repository build in desktop Blockbench. Fully restart/reload Blockbench, then reconnect/restart the MCP client so an old process or cached surface cannot count as proof.

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Required baseline:

```text
64 enabled tools
Extended MCP Families = OFF
risky_eval = disabled
from_geo_json = disabled
local BlockIT build only
```

With the plugin running:

```bash
bun run verify:stateless-local
```

## 5. Tool Exposure Sanity Check

Confirm relevant Bedrock tool families are reachable and known state is reused without unnecessary discovery. Observe retry/context/latency only when the client exposes it. Unknown telemetry stays `UNVERIFIED`.

## 6. Test 1 — MCP / Core Mechanics

Purpose: prove representative plugin/MCP behavior independent of reference quality.

Create a small Bedrock project with one or more Groups, a few Cubes, and one intentionally rotated Cube with an explicit justified origin.

Representative path:

```text
create / inspect
→ coherent Cube/Group batching where appropriate
→ finite bounds + model views
→ one causal correction
→ Undo / Redo
→ texture / Painter
→ PBR / material instance
→ small animation with numeric or authored Molang value
→ representative animation effect mutation
→ one coherent AnimationController batch
→ inspect_animation only when mutation return state is insufficient
→ Locator / Null Object
→ persistence / export
```

Do not try to exercise every tool. A bounded representative pass is sufficient unless the current task names a specific capability.

## 7. Persistence / Export

Verify:

```text
editable .bbmodel
Bedrock geometry export
```

Use explicit absolute paths. Reopen the `.bbmodel` only when persistence of the authored state under test matters.

## 8. Test 2 — Reference Model

Purpose: prove MCP can use **one currently approved reference** to make a recognizable, Minecraft-appropriate Geometry + Texture model.

The actual approved image must be visible to the local modelling context. A filename/path/README/memory is not image evidence. Keep nonvisual constraints such as target height or use separately in task context.

The validation reference is selected by the current user/task. Do **not** hard-code Elephant, chair, katana, windmill, or any other fixture into product policy.

When the approved reference uses the standard reference board, expected coverage is:

```text
SIDE | FRONT | BACK
TOP / FOOTPRINT | FRONT-SIDE 3/4
```

Reference discrepancy handling:

```text
MINOR
→ choose one canonical Minecraft interpretation
→ use best-supported visible evidence
→ continue with simplest recognizable buildable form

MATERIAL
→ CONFLICTING / BLOCKED
```

Geometry acceptance:

```text
recognizable major form
correct important part count / topology / attachment
important negative spaces preserved
clean Blockbench-buildable construction
```

Texture acceptance:

```text
Minecraft-readable palette/material identity
major color/material regions
part separation and form readability
identity-critical markings
```

Do not require pixel-perfect source copying.

Test sequence:

```text
actual approved reference + handoff constraints
→ Semantic Form / Primary Form
→ minimum coherent primary geometry
→ fresh model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
→ production texture only after geometry PASS
```

A materially wrong side/depth view cannot receive full 3D `PASS`. Reject a correction that improves one view while materially regressing another. Two failed attempts in the same causal direction without new evidence → `BLOCKED`.

## 9. Efficiency Check

Record only meaningful calls and observable cost:

```text
Total MCP calls
Discovery calls
Redundant readbacks
tool_search calls / misses
place_cube calls / Cubes authored
add_group calls / Groups authored
controller calls / operations authored
capture_model_views calls / views requested
Correction attempts
Same-cause retries
Broad repository reads
```

Flag capture-per-mutation behavior, fragmented coherent operations, immediate reinspection when returned state was sufficient, unrelated specialist loads, overlapping reads, and retries caused by ambiguous contracts. These counts are session evidence, not a telemetry subsystem. Do not invent token or latency numbers.

## 10. Failure Classification

```text
ENVIRONMENT / INSTALL
CLIENT / TOOL EXPOSURE
MCP TRANSPORT / REGISTRATION
BLOCKBENCH RUNTIME / API
PUBLIC SOURCE CONTRACT
MODELLING / VISUAL ROUTING
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure: identify the exact owner, capture minimum evidence, make the smallest complete fix, rerun the failing scenario first, then run relevant repository gates.

## 11. Completion

Update only current owners:

- `docs/foundation/validation-report.md` when new proof materially changes the boundary;
- `docs/knowledge/next-action.md` when continuation materially changes;
- `docs/knowledge/implementation-map.md` only when ownership changes;
- foundation policy only when a durable product rule changes.

Historical rationale, discarded fixtures, and prior model iterations belong in Git history. When requested proof and criteria are satisfied, **STOP**.
