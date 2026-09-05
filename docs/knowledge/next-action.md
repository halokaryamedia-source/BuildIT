# Next Action

Updated: 2026-09-06 — REMOTE_GITHUB closure cleanup prepared; generated MCP contract work remains LOCAL_CODE.

Branch: **`Local` only**. Facts → `CONTEXT.md`; proof → `current-validation.md`.

## Status

```text
GATEWAY: SOURCE_READY / LIVE PROOF NEXT
AUTHORING: user-selected DIRECT | 3D_ASSISTED; shared AUTHORING + separate Animation
3D_ASSISTED ORCHESTRATOR: SOURCE_READY / LOCAL GPU PROOF NEXT
3D_ASSISTED MATERIALIZER: ENGINE SOURCE_READY / PUBLIC BINDING LOCAL_CODE REQUIRED
MCP RESOURCE/PROMPT/HANDOFF: AUDITED / LOCAL_CODE IMPLEMENTATION REQUIRED
REMOTE CLOSURE CLEANUP: SOURCE_UPDATED / EXACT CI REQUIRED
ACTIVE ASSET: NONE
```

## Immediate Local Handoff

1. Pin exact `Local`; require `bun run verify:closure` and `bun run verify:mcp` green. On failure, fix the first wrong owner only.
2. Close the MCP contract in one LOCAL_CODE delivery:
   - canonical workflow: Requirement Gate, `DIRECT | 3D_ASSISTED`, no fallback, 3D-Assisted route, coverage invariant, Geometry approval → native production UV → Texture approval → Animation;
   - move Animation prose into the canonical prompt and strengthen `promptContract` override invariants;
   - synchronize `authoringPhase` readiness with approval semantics;
   - synchronize `switch_authoring_phase` with `target_phase + reason + readiness + resume_from` and no normal reconnect instruction;
   - add `animations://{id}` summary Resource;
   - stop advertising bare `validator://checks`; keep `validator://checks/{id}`;
   - do not add duplicate Cube/Group/workspace/capability/material Resources.
3. Regenerate in the same delivery: `prompts:build` → `docs:build` → `docs:check` → `verify:closure` → `verify:mcp`. Commit generated prompt/docs output; never hand-edit it.
4. Deploy exact plugin; prove Gateway lifecycle and a disposable DIRECT flow through Geometry APPROVED → UV Layout PASS → Texture APPROVED → optional Animation → Finalization.
5. Continue 3D_ASSISTED GPU proof, bind the existing materializer as one Geometry capability, regenerate docs, prove atomic Undo, then run end-to-end 3D_ASSISTED.

## Non-Goals

No automatic strategy/provider routing, DIRECT fallback, fifth Gateway tool, `from_geo_json`, resource-per-tool mirror, duplicate workspace/capability registry, or SDK migration bundled into this work.
