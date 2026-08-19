# BlockIT Workspace Context

Last verified: 2026-08-19  
Stability: stable

This file owns stable project facts only. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; persistent asset continuity belongs in `workspace/active/<project>/README.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local Blockbench MCP workflow for AI-assisted Minecraft Bedrock Entity modelling. Default format is `bedrock`; visible geometry is normally Cube/Cuboid based and organized by Groups/bones.

Primary output is an editable `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Tool/file/coordinate success is not proof of visual resemblance.

## Stable Terms

- Source Image — original visual input, not geometry data.
- Modelling Brief Draft — generated multi-view reference before approval.
- Modelling Brief — approved visual guide, including approved visible form/pose; not a per-Cube blueprint.
- Requested Dimensions — user-approved target dimensions; `1 block = 16 Blockbench units`.
- Handoff Constraints — compact approved nonvisual facts such as target scale/height, target use, or explicit pose override; kept outside image pixels by default and passed explicitly when material to downstream modelling.
- Asset Workspace — repository-backed current asset package storage under `workspace/`; it preserves current `.bbmodel`, intentional references/assets/exports, and compact asset-specific continuity without becoming runtime policy.

For articulated reference preparation, stable default is a natural neutral stance unless the user explicitly requests another pose. Pose/limb integrity is a reference-quality requirement, not an object-specific preset.

## Repository Shape

```text
.agents/skills/    canonical skills
docs/foundation/  durable current policy
docs/knowledge/   current flow, repository continuation, ownership, local procedure
mcp/              plugin/runtime/build/tests/generated API docs
workspace/        persistent active/saved Blockbench asset packages
```

There are **ten repository-owned skill packages** under `.agents/skills/`. Root `AGENTS.md` owns task selection; no parallel skill-routing index is active.

`workspace/active/<project>/README.md` owns only the current asset-specific resume facts for that named project. Stored reference paths are continuity/provenance only until the actual image is visible in the active modelling context.

The Reference Generator remains image-only. Persisting an approved reference into a workspace project is a downstream/local storage action.

## MCP Facts

BlockIT runs inside desktop Blockbench and exposes a loopback request-owned/stateless MCP endpoint. Current `Local` source registers **64 enabled tools** in the default Bedrock Entity surface. Generic fallback families are opt-in; `risky_eval` and `from_geo_json` remain disabled.

Current source ownership includes Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation with numeric/Molang transform values, new-animation particle/sound effects, existing-animation particle/sound/timeline effect mutation, animation-level `anim_time_update` / `blend_weight`, AnimationController/state inspection plus bounded state-machine and state particle/sound mutation, Locator/Null Object lifecycle, Undo, `.bbmodel`, and Bedrock geometry export.

Controller blend-curve mutation, TextureMesh direct authoring, native visible bounding-box fields, animated textures, and bone-binding expressions remain protected gaps.

The 64-tool source state is integrated into `Local`, but canonical Bun/CI verification and generated API/prompt artifact closure for the animation additions remain pending. Source presence is not verification.

## Evidence Boundary

The **first bounded Codex + Blockbench local acceptance pass completed** on 2026-08-12 and remains the accepted live baseline. Later P0–P7, hardened Reference Generator, PRO-1–PRO-8, optimization, AnimationController mutation, and the current animation-effect/Molang closure are static/source proof unless the validation report explicitly says otherwise. No local run is active.

Current source and current policy own behavior. Git history / GitHub issues and PRs own retired rationale, reviews, decisions, experiments, and obsolete asset revisions.

## Navigation

- routing → `AGENTS.md`
- flow → `docs/knowledge/flow.md`
- repository continuation → `docs/knowledge/next-action.md`
- active asset continuity → `workspace/active/<project>/README.md`
- asset workspace rules → `workspace/README.md`
- source ownership → `docs/knowledge/implementation-map.md`
- proof state → `docs/foundation/validation-report.md`
- local acceptance → `docs/knowledge/operations/local-acceptance-runbook.md` only when reactivated
