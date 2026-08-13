# Local Acceptance Runbook

Updated: 2026-08-13  
Owner: local Codex + Blockbench acceptance procedure  
Active only when `docs/knowledge/next-action.md` points here.

This is the single procedural owner for BlockIT live acceptance. It is inactive during GitHub-only/static work.

## 1. Goal

Prove or disprove claims source/CI cannot establish: local plugin/runtime and stateless MCP behavior, real Codex tool exposure/search behavior, representative Bedrock authoring reachability, reference judgement/correction convergence, persistence/export, and observable call/retry/context behavior.

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

## 3. Environment / Static Gate

Record Local commit SHA, working-tree status, OS, Bun/Codex/Blockbench versions, loaded BlockIT file, MCP endpoint, and Extended MCP Families setting.

From `mcp/`:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run test
bun run measure:surface
bun run build
bun run docs:check
```

Production plugin: `mcp/dist/mcp.js`. A static gate failure is engineering evidence, not runtime proof.

Record the fresh `dist/mcp.js` file hash and exact repository HEAD used for the build. The package version alone is not sufficient proof that Blockbench loaded the current build.

## 4. Load BlockIT / Transport

Load the repository build in desktop Blockbench. Default endpoint:

```text
http://127.0.0.1:3000/bb-mcp
```

Baseline constraints: 62 enabled tools, Extended MCP Families off, `risky_eval` and `from_geo_json` disabled, and no upstream hosted plugin used as BlockIT proof.

With the plugin running, execute `bun run verify:stateless-local` and confirm independent follow-up calls do not rely on a durable server session.

## 5. Native Tool Exposure

Observe whether Codex injects, defers, or searches tool specs; whether relevant Bedrock families become reachable; whether known state is reused without ritual rediscovery; and any retry/context/latency data the client actually exposes.

Unknown telemetry stays `UNVERIFIED`. Do not build a custom router from assumptions.

## 6. Fixture A — Deterministic Mechanics

Create a small Bedrock project with one Group and a few Cubes, including one intentionally rotated Cube with an explicit origin. Verify creation identity, focused inspection, finite bounds, canonical model views, one causal correction with a declared invariant, and Undo/Redo.

Then verify representative downstream reachability when in scope: texture/Painter, PBR/material instances, a small animation, authored Molang transform strings, bounded new-animation sound events, read-only AnimationController/state inspection, and Locator/Null Object lifecycle.

Do not treat controller creation/mutation or existing-animation direct sound/timeline-effect mutation as implemented capability.

## 7. Persistence / Export

Verify editable `.bbmodel` and Bedrock geometry export to explicit absolute paths. When relevant, reopen the `.bbmodel` and confirm the authored state under test survives. Unsupported reopen/merge scenarios remain `LOCAL PROOF REQUIRED`.

## 8. Fixture B — Reference Fidelity

Use a **fresh explicitly approved Modelling Brief that passed the current Reference Generator gate**. Do not treat an old fixture image as approved merely because it exists in the repository.

For articulated subjects, the approved board must already have one locked pose: stable natural neutral stance by default, or the exact user-requested pose. Required limb/appendage count, attachment, ground/support, near/far separation, negative spaces, and pose/limb phase must be consistent across required panels.

Carry material nonvisual Handoff Constraints separately in the active task context. Example: target scale/height belongs in task context, not as image caption text.

```text
actual approved reference + material Handoff Constraints
→ Semantic Form / Primary Form Hypothesis
→ coarse primary geometry
→ fresh corresponding model views
→ difference-first FAIL | UNVERIFIED | PASS
→ causal correction only after diagnosis
```

A front-plausible but side/depth-wrong model cannot receive full 3D `PASS`. A repeated same-cause correction direction that fails twice without new evidence stops as `BLOCKED`. Geometry failure must not be hidden with texture or animation.

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
