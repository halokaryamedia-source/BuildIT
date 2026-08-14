# Local Acceptance Runbook

Updated: 2026-08-14  
Owner: local Codex + Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` points here.

This is the single procedure for BlockIT live acceptance.

## 1. Goal

Prove what source/CI cannot: exact local plugin freshness, MCP runtime behavior, real Codex tool exposure, core Bedrock authoring, persistence/export, and one real reference-driven model.

There are only two modelling tests:

```text
TEST 1 — MCP / CORE MECHANICS
→ prove the tools and plugin work correctly

TEST 2 — REFERENCE MODEL (ELEPHANT)
→ prove MCP can turn an approved imperfect reference into a good Minecraft/Blockbench model
```

Do not edit source before a reproducible failure identifies a concrete owner.

## 2. Required Reading

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ this runbook
→ mcp/README.md + mcp/AGENTS.md only when MCP implementation matters
```

Read `CONTEXT.md` only when a stable project fact materially matters. Do not load Git history or the whole foundation set by default.

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

Windows PowerShell:

```powershell
Get-FileHash .\dist\mcp.js -Algorithm SHA256
```

Record:

```text
Local HEAD
mcp/dist/mcp.js SHA-256
Blockbench version
Bun version
Codex/client version when visible
actual BlockIT file/path loaded by Blockbench
MCP endpoint
Extended MCP Families setting
```

If the loaded file/path or artifact freshness cannot be established, classify `ENVIRONMENT / INSTALL` and stop before model-quality claims.

## 4. Load Current BlockIT / Reconnect MCP

Load the fresh repository build in desktop Blockbench. Fully restart/reload Blockbench, then reconnect/restart the MCP client so an old process or cached surface cannot count as proof.

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Required baseline:

```text
62 enabled tools
Extended MCP Families = OFF
risky_eval = disabled
from_geo_json = disabled
local BlockIT build only
```

With the plugin running:

```bash
bun run verify:stateless-local
```

Confirm follow-up MCP calls do not depend on a durable server session.

## 5. Tool Exposure Sanity Check

Confirm relevant Bedrock tool families are reachable and known state is reused without unnecessary discovery. Observe client retry/context/latency only when the client exposes it. Unknown telemetry stays `UNVERIFIED`.

## 6. Test 1 — MCP / Core Mechanics

Purpose: prove **the plugin and MCP tools work**, independent of reference quality.

Create a small Bedrock project with:

- one Group;
- a few Cubes;
- one intentionally rotated Cube with an explicit origin.

Verify only representative core behavior:

```text
create / inspect
→ finite bounds + model views
→ one causal correction
→ Undo / Redo
→ texture / Painter
→ PBR / material instance
→ small animation + authored Molang transform string
→ bounded new-animation sound event
→ read-only AnimationController/state inspection
→ Locator / Null Object
```

Do not treat controller creation/mutation or existing-animation direct sound/timeline-effect mutation as implemented capability.

## 7. Persistence / Export

Verify:

```text
editable .bbmodel
Bedrock geometry export
```

Use explicit absolute paths. Reopen the `.bbmodel` when relevant and confirm the authored state under test survives. Unsupported scenarios remain `LOCAL PROOF REQUIRED`.

## 8. Test 2 — Reference Model (Elephant)

Purpose: prove MCP can use the **approved elephant reference** to make a recognizable, Minecraft-appropriate Geometry + Texture model even when the reference has minor imperfections.

The **actual approved image must be visible to the local modelling context**. Keep nonvisual constraints, such as target height, separately in task context.

For future generated references, the default board is five previews:

```text
SIDE | FRONT | BACK
TOP / FOOTPRINT | FRONT-SIDE 3/4
```

Five previews are coverage, not five engineering-perfect drawings. Do not regenerate an already approved usable reference merely to satisfy panel count.

Reference discrepancy handling:

```text
MINOR
→ choose one canonical Minecraft interpretation
→ user requirement
→ original Source evidence
→ best-supported approved view(s)
→ simplest recognizable Blockbench-buildable form
→ continue

MATERIAL
→ CONFLICTING / BLOCKED
```

Minor differences such as small trunk curl/angle, overlap, contour, texture shade/noise, or non-critical marking drift are not blockers by themselves. Do not average drift.

Geometry acceptance:

```text
recognizable major form
correct important part count / attachment
important negative spaces preserved
clean Blockbench-buildable construction
```

Texture acceptance:

```text
Minecraft-readable palette
major color/material regions
part separation
identity-critical markings
```

Do not require pixel-perfect source copying.

Test sequence:

```text
actual approved reference + material handoff constraints
→ Semantic Form / Primary Form
→ coarse primary geometry
→ fresh model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
→ production texture only after geometry PASS
```

A materially wrong side/depth view cannot receive full 3D `PASS`. A correction that improves one view while materially regressing another is rejected. Two failed attempts in the same causal direction without new evidence → `BLOCKED`.

## 9. Efficiency Check

Record only meaningful calls and observable cost. Flag redundant rereads, capture-per-mutation behavior, unrelated specialist loads, overlapping reads, and retries caused by ambiguous contracts. Do not invent token or latency numbers.

## 10. Failure Classification

```text
ENVIRONMENT / INSTALL
CODEX CLIENT / TOOL EXPOSURE
MCP TRANSPORT / REGISTRATION
BLOCKBENCH RUNTIME / API
PUBLIC SOURCE CONTRACT
MODELLING / VISUAL ROUTING
TEXTURE / PBR
ANIMATION
PERSISTENCE / EXPORT
UNKNOWN
```

For a reproducible failure: identify the exact owner, capture minimum evidence, make the smallest fix, rerun the failing scenario first, then run relevant repository gates.

## 11. Completion

Update only current owners: `validation-report.md` for new live proof and `next-action.md` for continuation. Update `implementation-map.md` only if ownership changed and foundation policy only if a durable product rule changed.

Historical rationale belongs in Git history, not a new review/decision system.
