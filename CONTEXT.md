# BlockIT Workspace Context

Last verified stable facts: 2026-08-28  
Stability: stable

This file owns **stable project facts only**. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/foundation/validation-report.md`; asset continuity belongs in `workspace/active/<project>/README.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local Blockbench MCP workflow for AI-assisted **Minecraft Bedrock Entity** modelling. Default format is `bedrock`; visible geometry is normally Cube/Cuboid based and organized by Groups/bones.

Primary editable output is `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Tool/file/coordinate success is not proof of visual resemblance.

## Stable Terms

- **Source Image** — original visual input, not geometry data.
- **Modelling Brief Draft** — generated multi-view reference before approval.
- **Modelling Brief** — approved visual guide; not a per-Cube blueprint.
- **Requested Dimensions** — user-approved target dimensions; `1 block = 16 Blockbench units`.
- **Handoff Constraints** — compact approved nonvisual facts such as target scale/use/pose override.
- **Asset Workspace** — repository-backed current asset package under `workspace/`; storage/continuity, not MCP runtime policy.
- **Geometry** — 3D form, proportion, topology, attachment, and buildable volume.
- **Route 1 Geometry Reference** — approved shape-only local GLB loaded transiently as supporting 3D evidence for depth/volume/attachment/placement/hidden-side interpretation. It is not target dimensions, production geometry, or a per-Cube blueprint.
- **UV Layout** — geometry-to-atlas coordinate mapping such as `uv_offset`, `autouv`, `mirror_uv`, per-face UV, and `box_uv_region`; it does not contain color/style.
- **Texture Atlas** — bitmap/PNG canvas that stores pixels. `create_texture` creates a Texture Atlas; atlas creation is not UV Layout or Texture Styling.
- **Texture Styling** — authored color, material separation, shading, highlights, contact/edge treatment, identity marks, and controlled detail inside the Texture Atlas.
- **Texture Verify** — fresh visual validation of the Texture Atlas as mapped through final UV Layout onto the model.
- **MCP Core** — cross-phase lifecycle/recovery/discovery/inspection/selection/read-only UV audit/capture/export tools. Structural delete/rename and other model mutation stay phase-owned.
- **Authoring Phase** — exactly one active specialist surface: `geometry`, `texturing`, or `animation`. Geometry also owns rig, Route 1 geometry-reference lifecycle, and UV Layout mutation.
- **HANDOFF_REQUIRED** — deterministic stop response when requested work needs another authoring phase. It preserves `target_phase`, `reason`, current `readiness`, compact `resume_from`, and the setting/reload `action`; it is not permission to search for a foreign-phase tool.

When the distinction matters, do not use one generic “texture” stage to mean UV mapping, atlas creation, styling, and verification at once.

Reference-driven modelling requires the actual approved image visible in active multimodal context. Paths, filenames, README text, manifests, and memory are provenance/context, not visual evidence. An approved Route 1 GLB may supplement that image with 3D evidence; it does not replace the image authority.

## Repository Shape

```text
.agents/skills/    canonical skills
docs/foundation/  durable policy + proof owner
docs/knowledge/   flow, continuation, ownership, local procedures
mcp/              plugin/runtime/build/tests/generated API docs
workspace/        persistent active/saved Blockbench asset packages
```

Root `AGENTS.md` owns task selection; no parallel skill-routing index is active.

## MCP Facts

BlockIT runs inside desktop Blockbench and exposes a loopback request-owned/stateless MCP endpoint. The retained normal Bedrock catalog contains **65 callable tools across authoring phases**, but plugin startup exposes only **MCP Core + exactly one active authoring phase**. The default phase is **Geometry**, whose current exposure is **28 tools**.

Runtime initialize instructions name the active phase and explain that foreign-phase tools are intentionally unavailable. Runtime workflow content is also phase-filtered: Codex receives shared minimum-evidence guidance plus only the current phase workflow, not the full Geometry→Texturing→Animation pipeline at once. A foreign-phase need is not a tool-discovery miss: Codex must return `HANDOFF_REQUIRED` and stop rather than `tool_search`, emulate, rename, or substitute another tool.

Phase ownership is strict: Geometry owns Cube/Group/rig/Locator/Null mutation, transient Route 1 geometry-reference lifecycle, structural delete/rename, and UV Layout correction; `list_textures` is read-only Core so Geometry can perform the global UV audit before handoff. Texturing owns Texture Atlas/Painter/PBR/material-instance work. Animation owns animation/keyframe/effect/controller work. If a downstream phase discovers an upstream structural defect, return to the owning phase instead of crossing the boundary.

Asset authoring loads only the specialist matching MCP `ACTIVE PHASE`. Later-phase specialists are not preloaded; a handoff reloads the MCP phase first, then loads the target specialist. Persistent projects may store one compact `Current handoff state` in their README, but never a tool-call transcript or persistent UUID registry.

An absent authoring-phase setting defaults to Geometry. An explicit invalid phase is a configuration error and must stop MCP startup rather than silently presenting a plausible but incorrect Geometry context.

Current source ownership includes Cube/Group authoring, coherent Cube and Group batching, transient Route 1 GLB reference evidence through the installed Reference Models capability, UV Layout state, Texture Atlas lifecycle, Painter-based Texture Styling, PBR/material instances, Bedrock animation with numeric/Molang values, AnimationController/state inspection and bounded mutation, Locator/Null Object lifecycle, Undo/history, `.bbmodel`, and Bedrock geometry export.

New Bedrock projects use logical UV resolution **128 by default** with explicit **256 opt-in**. Generic fallback families remain opt-in; `risky_eval` and `from_geo_json` remain disabled.

Protected gaps remain controller blend-curve mutation, TextureMesh direct authoring/inspection, native visible bounding-box fields, animated textures, and bone-binding expressions.

## Evidence Boundary

Live/runtime/model-quality proof is owned by `docs/foundation/validation-report.md`. Current continuation is owned by `docs/knowledge/next-action.md`.

Static source/CI evidence never upgrades a live visual/runtime claim. Artifact existence is not visual approval until the relevant image/runtime evidence is actually inspected.

## Navigation

- routing → `AGENTS.md`
- GitHub discipline → `GITHUB_RULES.md`
- product flow → `docs/knowledge/flow.md`
- repository continuation → `docs/knowledge/next-action.md`
- active asset continuity → `workspace/active/<project>/README.md`
- asset workspace rules → `workspace/README.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- proof state → `docs/foundation/validation-report.md`
- local acceptance procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- experimental research → `Experimental/`
