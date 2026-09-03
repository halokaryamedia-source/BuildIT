# BlockIT Workspace Context

Last verified stable facts: 2026-08-30  
Stability: stable

This file owns **stable project facts only**. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`; asset continuity belongs in `workspace/active/<project>/README.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local Blockbench MCP workflow for AI-assisted **Minecraft Bedrock Entity** authoring. Default format is `bedrock`; visible production geometry is normally Cube/Cuboid based and organized by Groups/bones.

Primary editable output is `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Tool/file/coordinate success is not proof of visual resemblance.

Root `AGENTS.md` owns task selection.

## Stable Authoring Boundaries

- **Source Image** is visual authority for reference-driven modelling when visual fidelity matters; a path, filename, README, manifest, or memory is not a substitute for the actual image.
- **Requested Dimensions** are user-approved target dimensions; `1 block = 16 Blockbench units`.
- **3D-Assisted Evidence** is transient approved GLB/Primitive Decomposition evidence used only for depth/volume/attachment/placement/hidden-side interpretation. Raw GLB bounds/statistics are observations, not target dimensions or production geometry.
- **UV Layout** is geometry-to-atlas mapping such as `uv_offset`, `autouv`, `mirror_uv`, and per-face UV. It is distinct from bitmap styling.
- **Texture Atlas** stores pixels; **Texture Styling** owns authored color/material/detail; **Texture Verify** is fresh visual validation after final mapping.
- Static source/CI evidence never upgrades a live Blockbench, runtime, or visual-quality claim.
- The Image Reference Route is the default object-agnostic authoring route; the 3D-Assisted Route is optional and must not block it.

## Canonical Naming

- **Image Reference Route** is the default authoring route using an approved image reference.
- **3D-Assisted Route** is the optional authoring route using **3D-Assisted Evidence**.
- **3D-Assisted Evidence** is one combined category: an approved clean GLB, with optional Primitive Decomposition when useful. GLB and Primitive Decomposition are not separate routes.
- **Standard MCP Profile** is the normal public MCP surface; **Extended MCP Profile** is the explicit opt-in expanded surface.
- Authoring phases always remain **Geometry → Texture → Animation**; Animation is optional when the asset has no motion requirement.
- The final deliverable is the validated Blockbench `.bbmodel`; the main flow ends at the Blockbench file.

## Repository Shape

```text
.agents/skills/    canonical skills
docs/foundation/  durable authoring policy
docs/knowledge/   flow, continuation, ownership, current proof, local procedures
mcp/              plugin/runtime/build/tests/generated API docs
workspace/        persistent active/saved asset packages
Experimental/     bounded research/proof harnesses only
```

No parallel skill-routing or continuation system is active.

## MCP Architecture

BlockIT runs inside desktop Blockbench and exposes a loopback request-owned/stateless MCP endpoint.

The retained normal Bedrock catalog contains **51 callable tools across authoring phases**, but startup exposes only **MCP Core + exactly one active authoring phase**. Default phase is **Geometry**, with current exposure of **25 tools**.

Phase ownership is strict:

```text
Core       lifecycle, focused discovery/inspection, selection,
           read-only global UV audit, history, canonical capture, export
Geometry   Cube/Group/rig/Locator/Null mutation, structural delete/rename,
           UV Layout mutation, transient 3D-Assisted Evidence lifecycle
Texturing  Texture Atlas, Painter, PBR, material-instance work
Animation  animation/keyframe/effect/controller work
```

A foreign-phase need is not a discovery miss. Runtime returns `HANDOFF_REQUIRED` with compact resume-critical state; the active phase is changed/reloaded rather than emulating a foreign mutation.

`manage_geometry_reference` reuses Blockbench Reference Models. 3D-Assisted Evidence remains transient authoring evidence and must not become Bedrock production geometry or remain in final production `.bbmodel` output.

Generated MCP API docs are secondary to canonical source and generator output; generated entries are not hand-authored.

New Bedrock projects use logical UV resolution **128 by default** with explicit **256 opt-in**. Generic fallback families remain opt-in; `risky_eval` and `from_geo_json` remain disabled.

Protected capability gaps are tracked by the current source/implementation map rather than duplicated here.

## Repository / Runtime Separation

Normal asset authoring through BlockIT MCP is not repository development merely because a model changes.

Repository source/docs/CI work may be performed through ChatGPT/GitHub or a local/Codex workspace according to `GITHUB_RULES.md`. Live Blockbench/runtime/visual acceptance requires an actual matching runtime capability and is never inferred from repository state alone.

## Navigation

- routing → `AGENTS.md`
- GitHub discipline → `GITHUB_RULES.md`
- product flow → `docs/knowledge/flow.md`
- repository continuation → `docs/knowledge/next-action.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- current proof state → `docs/knowledge/current-validation.md`
- active asset continuity → `workspace/active/<project>/README.md`
- asset workspace rules → `workspace/README.md`
- local acceptance procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- 3D-Assisted procedure/reproducibility → `Experimental/three-d-assisted-hunyuan-poc/README.md`
- experimental research → `Experimental/`
