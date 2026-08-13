# BlockIT Workspace Context

Last verified: 2026-08-13  
Stability: stable

This file owns stable project facts only. Active work belongs in `docs/knowledge/next-action.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local Blockbench MCP workflow for AI-assisted Minecraft Bedrock Entity modelling. Default format is `bedrock`; visible geometry is normally Cube/Cuboid based and organized by Groups/bones.

Primary output is an editable `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Tool/file/coordinate success is not proof of visual resemblance.

## Stable Terms

- Source Image — original visual input, not geometry data.
- Modelling Brief Draft — generated multi-view reference before approval.
- Modelling Brief — approved visual guide, not a per-Cube blueprint.
- Requested Dimensions — user-approved target dimensions; `1 block = 16 Blockbench units`.

## Repository Shape

```text
.agents/skills/    canonical skills
docs/foundation/  durable current policy
docs/knowledge/   current flow, continuation, ownership, local procedure + tiny test-support indexes
mcp/              plugin/runtime/build/tests/generated API docs
workspace/        reusable acceptance fixtures
```

There are **ten repository-owned skill packages** under `.agents/skills/`. Root `AGENTS.md` owns task selection; compact skill indexes under `docs/knowledge/skills/` are secondary/test support only.

## MCP Facts

BlockIT runs inside desktop Blockbench and exposes a loopback request-owned/stateless MCP endpoint. The accepted default surface has **62 enabled tools**. Generic fallback families are opt-in; `risky_eval` and `from_geo_json` remain disabled.

Current ownership includes Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation including Molang transform strings, bounded new-animation sound events and read-only AnimationController/state inspection, Locator/Null Object lifecycle, Undo, `.bbmodel`, and Bedrock geometry export.

Controller creation/mutation, existing-animation direct sound/timeline-effect mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions remain protected gaps.

## Evidence Boundary

The **first bounded Codex + Blockbench local acceptance pass completed** on 2026-08-12. It established representative live proof for the accepted baseline. Later P0–P7, Reference Generator, and PRO-1–PRO-8 changes are static/CI proof unless the validation report explicitly says otherwise. No local run is active.

Current source and current policy own behavior. Git history / GitHub issues and PRs own retired rationale, reviews, decisions, and experiments.

## Navigation

- routing → `AGENTS.md`
- flow → `docs/knowledge/flow.md`
- continuation → `docs/knowledge/next-action.md`
- source ownership → `docs/knowledge/implementation-map.md`
- proof state → `docs/foundation/validation-report.md`
- local acceptance → `docs/knowledge/operations/local-acceptance-runbook.md` only when reactivated
