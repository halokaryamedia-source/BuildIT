# Next Action

Updated: 2026-09-06 — Contract Closure added; MCP Resource/Prompt refresh still requires LOCAL_CODE regeneration.

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`.

## Status

```text
BLOCKIT GATEWAY: SOURCE_READY / LIVE PROOF NEXT
AUTHORING TAXONOMY: user-selected DIRECT | 3D_ASSISTED
SHARED AUTHORING SURFACE: SOURCE_UPDATED / LOCAL PROOF NEXT
3D_ASSISTED ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER: SOURCE_READY / PUBLIC MCP BINDING LOCAL_CODE REQUIRED
MCP RESOURCE/PROMPT: AUDITED / LOCAL_CODE IMPLEMENTATION REQUIRED
CONTRACT CLOSURE: SOURCE_ADDED / CI VERIFY IN PROGRESS
```

## Immediate Local Handoff

1. Pin exact `Local`; run `bun install --frozen-lockfile` then `bun run verify:closure`.
2. Implement one coherent Resource/Prompt refresh:
   - Prompt: Requirement Gate; explicit user-selected `DIRECT | 3D_ASSISTED`; no fallback; 3D-Assisted route; surface-coverage invariant; Geometry approval before production UV; native UV/template flow; `validator://status` summary-first; Texture approval before Animation.
   - Move Animation workflow prose from `mcp/server/prompts.ts` into canonical prompt; strengthen `mcp/lib/promptContract.ts`.
   - Add read-only `animations://{id}` summary Resource.
   - Remove advertised bare `validator://checks`; retain `validator://checks/{id}`.
   - Do not add duplicate Cube/Group/workspace/capability/material Resources without evidence.
3. Regenerate and verify in the same delivery:
   `bun run prompts:build` → `bun run docs:build` → `bun run docs:check` → `bun run verify:closure` → `bun run verify:mcp`.
   Commit generated prompt/docs output; never hand-edit generated files.
4. Deploy exact plugin, then run disposable DIRECT smoke through Geometry approval → UV PASS → Texture approval → optional Animation → Finalization.
5. Continue 3D_ASSISTED local proof, materializer binding, atomic Undo proof, then end-to-end verification.

## Active Workspace

No active asset project. Industrial Elevator was test data and must not be resumed.

## Non-Goals

No automatic strategy/provider routing, DIRECT fallback, fifth Gateway tool, `from_geo_json`, resource-per-tool mirror, duplicate workspace/capability registry, or SDK migration bundled into this work.
