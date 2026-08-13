# Local Acceptance Runbook

Updated: 2026-08-14  
Owner: local Codex + Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` points here.

This is the single procedural owner for BlockIT live acceptance. It is inactive during GitHub-only/static work.

## 1. Goal

Prove or disprove claims source/CI cannot establish: exact local plugin freshness, stateless MCP behavior, real Codex tool exposure/search behavior, representative Bedrock authoring reachability, Minecraft-first reference judgement, persistence/export, and observable call/retry/context behavior.

Establish a baseline before editing source. Reproduce and classify a failure first.

## 2. Required Reading

```text
AGENTS.md
→ docs/knowledge/next-action.md
→ CONTEXT.md only when stable facts matter
→ this runbook
→ mcp/README.md + mcp/AGENTS.md when MCP implementation matters
```

Do not load Git history or the whole foundation set before a concrete failure identifies the boundary.

## 3. Exact Local Build / Freshness Gate

Do not use package version as freshness proof. Record the exact `Local` HEAD and hash of the artifact actually prepared for Blockbench.

From the repository root:

```bash
git switch Local
git pull --ff-only
git status --short
git rev-parse HEAD
```

The working tree must be clean before the acceptance build. Then from `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin: `mcp/dist/mcp.js`.

On Windows PowerShell, record the fresh artifact hash:

```powershell
Get-FileHash .\dist\mcp.js -Algorithm SHA256
```

Record together:

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

A static gate failure is engineering evidence, not runtime proof. If the loaded file/path or artifact freshness cannot be established, classify `ENVIRONMENT / INSTALL` and stop before model-quality claims.

## 4. Load Current BlockIT / Reconnect MCP

Load the fresh repository build in desktop Blockbench, fully reload/restart Blockbench, then reconnect/restart the MCP client so no previous plugin process or cached tool surface is treated as current proof.

Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Baseline constraints: **62 enabled tools**, Extended MCP Families off, `risky_eval` and `from_geo_json` disabled, and no upstream hosted plugin used as BlockIT proof.

With the plugin running, execute:

```bash
bun run verify:stateless-local
```

Confirm independent follow-up calls do not rely on a durable server session.

## 5. Native Tool Exposure

Observe whether Codex injects, defers, or searches tool specs; whether relevant Bedrock families become reachable; whether known state is reused without ritual rediscovery; and any retry/context/latency data the client actually exposes.

Unknown telemetry stays `UNVERIFIED`. Do not build a custom router from assumptions.

## 6. Fixture A — Deterministic Mechanics

Create a small Bedrock project with one Group and a few Cubes, including one intentionally rotated Cube with an explicit origin. Verify creation identity, focused inspection, finite bounds, canonical model views, one causal correction with a declared invariant, and Undo/Redo.

Then verify representative downstream reachability when in scope: texture/Painter, PBR/material instances, a small animation, authored Molang transform strings, bounded new-animation sound events, read-only AnimationController/state inspection, and Locator/Null Object lifecycle.

Do not treat controller creation/mutation or existing-animation direct sound/timeline-effect mutation as implemented capability.

## 7. Persistence / Export

Verify editable `.bbmodel` and Bedrock geometry export to explicit absolute paths. When relevant, reopen the `.bbmodel` and confirm the authored state under test survives. Unsupported reopen/merge scenarios remain `LOCAL PROOF REQUIRED`.

## 8. Fixture B — Minecraft-First Reference Test

Use the **actual user-approved reference image visible to the local modelling context** plus material nonvisual Handoff Constraints.

For newly generated references, the current generator defaults to five broad previews:

```text
SIDE | FRONT | BACK
TOP / FOOTPRINT | FRONT-SIDE 3/4
```

The five previews are coverage evidence, not five engineering-perfect drawings. Do **not** generate a replacement merely to satisfy panel count when an already approved reference provides sufficient evidence for the claims under test. Fewer approved panels are valid when the missing axis is not material; a materially missing axis remains `UNVERIFIED / BLOCKED`.

Reference discrepancy triage:

```text
MINOR
→ choose one canonical Minecraft interpretation
→ explicit user requirement
→ original Source evidence
→ best-supported approved reference view(s)
→ simplest recognizable Blockbench-buildable form
→ continue consistently

MATERIAL
→ CONFLICTING / BLOCKED
```

Minor curl/angle/contour/overlap or texture shade/noise/marking drift is not a blocker by itself. Do not average drift. Material conflict means a difference that changes identity, primary mass/required count, topology/attachment, important negative space, Minecraft buildability, or identity-critical texture/material information.

Geometry acceptance prioritizes recognizable major form, attachments/topology, important negative spaces, and clean Blockbench-buildable construction. Texture acceptance prioritizes Minecraft-readable palette, major material/color regions, part separation, and identity-critical markings rather than pixel-perfect copying.

```text
actual approved reference + material Handoff Constraints
→ Semantic Form / Primary Form Hypothesis
→ coarse primary geometry
→ fresh corresponding model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
→ production texture only after dependent geometry PASS
```

A front-plausible but materially side/depth-wrong model cannot receive full 3D `PASS`. A correction that helps one view while materially regressing another is rejected. A repeated same-cause correction direction that fails twice without new evidence stops as `BLOCKED`. Geometry failure must not be hidden with texture or animation.

## 9. Efficiency Trace

Record only meaningful calls and observable cost. Flag lifecycle rereads, redundant outline/element reads after fresh identity/state, capture-per-mutation behavior, unrelated specialist loads, overlapping resource/tool reads, and retries caused by ambiguous contracts. Do not fabricate token or latency values.

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

For a reproducible failure: identify the exact owner, capture minimum evidence, make the smallest fix, rerun the failing scenario first, then run relevant repository gates. Broaden only if the fix invalidates downstream evidence.

## 11. Completion

Update only current owners: `validation-report.md` for new live proof, `next-action.md` for the next active step, `implementation-map.md` only if ownership changed, and foundation policy only if durable product rules changed.

Historical rationale belongs in the Git commit/issue/PR rather than a new review or decision document.
