# BlockIT Workspace Context

Last verified stable facts: 2026-09-04  
Stability: stable

This file owns **stable project facts only**. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`; asset continuity belongs in `workspace/active/<project>/README.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local MCP workflow for AI-assisted **Minecraft Bedrock Entity** authoring in desktop Blockbench. The normal AI-client boundary is the stable **BlockIT Gateway**; the Blockbench plugin is the volatile execution Runtime behind it.

Primary editable output is `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Tool/file/coordinate success is not proof of visual resemblance.

## Reference-Grounded Authoring

Normal authoring has one flow, not a matrix of routes and profiles:

```text
Approved Reference
→ Reference Grounding
   approved image = visual authority
   optional 3D Evidence = supporting Geometry evidence only
→ Geometry
→ Texturing
→ Animation when required
→ validated .bbmodel
```

### Reference Grounding

- The **Approved Reference Image** is visual authority for reference-driven modelling when visual fidelity matters; a path, filename, README, manifest, or memory is not a substitute for the actual image.
- **Requested Dimensions** are user-approved numeric target dimensions; `1 block = 16 Blockbench units`.
- **Optional 3D Evidence** is an approved clean GLB, with optional experimental decomposition evidence when useful. It supports depth, volume, attachment, placement, and hidden-side interpretation during Geometry only.
- Optional 3D Evidence is **not a second authoring route**, is never target-size authority, is never production geometry, and must be removed before production `.bbmodel` export.
- Raw GLB bounds/statistics are observations only.

### Authoring phases

```text
Geometry   shape, hierarchy, rig, Locator/Null, UV Layout, optional 3D Evidence lifecycle
Texturing  Texture Atlas, Painter/styling, PBR/material instances, Texture Verify
Animation  authored motion/keyframes/effects/controllers; optional for static assets
```

Phase ownership remains strict because phase-scoped routing materially improves capability selection. A foreign-phase need is a handoff, not a discovery miss.

### No normal Standard / Extended authoring profiles

Normal authoring has **no Standard/Extended profile choice**. The Runtime's internal `bedrock_entity` profile is the implementation default. The source-preserved internal `extended` identifier exists only for compatibility with **Legacy UI Fallbacks** used for debug/maintenance. It is not an authoring mode and does not change the canonical Geometry → Texturing → Animation flow.

`risky_eval` and `from_geo_json` remain disabled.

## Texture vocabulary

- **UV Layout** = geometry-to-atlas mapping such as `uv_offset`, `autouv`, `mirror_uv`, and per-face UV.
- **Texture Atlas** = bitmap/PNG canvas that stores pixels.
- **Texture Styling** = authored color/material/shading/detail.
- **Texture Verify** = fresh atlas + mapped-model visual validation.

New Bedrock projects use logical UV resolution **128 by default** with explicit **256 opt-in**.

## MCP Architecture

```text
AI client
  ↓ stdio
BlockIT Gateway
  ↓ loopback Streamable HTTP
BlockIT Runtime inside Blockbench
  ↓
Blockbench
```

The Gateway exposes exactly four stable client tools:

```text
status
search_capabilities
describe_capability
invoke_capability
```

The Runtime retains **51 callable Bedrock tools across phases**. Native phase surfaces are currently:

```text
Geometry   25 tools
Texturing  35 tools
Animation  19 tools
```

The native Runtime endpoint `http://127.0.0.1:3000/bb-mcp` remains available for Inspector, conformance, and debugging; it is not the normal AI-client boundary.

Gateway phase handoff keeps the client/chat alive: `switch_authoring_phase` changes the Runtime phase, the Gateway invalidates its backend catalog, and the next capability request refreshes automatically.

Capability priority is an internal routing concern: normal authoring favors **primary** capabilities, uses **support** capabilities when needed, exposes **experimental** capabilities only for matching intent, and de-prioritizes **maintenance** fallbacks. This tiering does not remove Runtime capability.

Generated MCP API docs are secondary to canonical source and generator output; generated entries are not hand-authored.

## Repository Shape

```text
.agents/skills/    canonical skills
docs/foundation/  durable authoring policy
docs/knowledge/   flow, continuation, ownership, current proof, local procedures
mcp/              Gateway + plugin/runtime/build/tests/generated API docs
workspace/        persistent active/saved asset packages
Experimental/     bounded research/proof harnesses only
```

No parallel skill-routing, route-selection, authoring-profile, or continuation system is active.

## Repository / Runtime Separation

Normal asset authoring through BlockIT is not repository development merely because a model changes. Repository source/docs/CI work follows `GITHUB_RULES.md`. Live Blockbench/runtime/visual acceptance requires matching live capability and is never inferred from repository state alone.

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
- optional 3D Evidence generation/reproducibility → `Experimental/three-d-assisted-hunyuan-poc/README.md`
- experimental research → `Experimental/`
