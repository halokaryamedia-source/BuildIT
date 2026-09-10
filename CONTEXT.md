# BlockIT Workspace Context

Last verified stable facts: 2026-09-10  
Stability: stable design contract; implementation/proof tracked separately

This file owns **stable project facts only**. Continuation → `docs/knowledge/next-action.md`; proof → `docs/knowledge/current-validation.md`; ownership → `docs/knowledge/implementation-map.md`; asset continuity → `workspace/active/<asset>/README.md`; routing → `AGENTS.md`.

## Product

BlockIT is a local MCP workflow for AI-assisted **Minecraft Bedrock Entity** authoring in desktop Blockbench. Normal AI-client boundary is the stable **BlockIT Gateway**; the Blockbench plugin is the execution Runtime behind it.

Primary editable output is `.bbmodel`. Tool/file/coordinate success is not proof of visual resemblance.

### Asset-only product scope

BlockIT is an **asset authoring system**, not an add-on development system.

Normal scope includes Geometry, rig/bones/pivots/locators, UV Layout, Texture Atlas/Styling/PBR, texture variants, visual material/render intent, Animation clips, artist-facing Animation Controller composition, effect cues, preview/validation, and native visual-asset export.

Normal scope excludes Behavior Pack components/component groups/events/AI/spawn rules, Script API gameplay logic, server-side behavior animation/controller logic, manifest/pack assembly, addon packaging, and `client_entity`/render-controller file construction as a deliverable.

Resource-Pack semantics are retained only where they affect the Blockbench-authored asset's appearance or export compatibility. Opaque/cutout/blend/emissive knowledge is therefore in scope; building an RP file graph is not. Animation Controller support means clip composition, transition/blend continuity, and artist-facing effect preview. External gameplay state/property integration stays outside the normal authoring boundary.

## Reference-Grounded Authoring

Reference image creation belongs in ChatGPT. A source image may be used directly as the Approved Reference when its evidence is sufficient. When stronger normalized coverage is useful, the optional canonical board is:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

For a new model, Codex requires before Blockbench authoring:

```text
Asset
Approved Reference Image
Dimensions
Animation Required: YES | NO
```

The **Approved Reference Image** is visual authority and requested dimensions are numeric envelope authority (`1 block = 16 Blockbench units`). BlockIT uses one native Geometry authoring path; there is no modelling-strategy selection gate.

### Shared AUTHORING surface and stage ownership

```text
AUTHORING Runtime surface
  Geometry focus  → shape, hierarchy, rig foundation, pivots, UV Layout
  Texturing focus → Texture Atlas, Painter/styling, PBR/materials, Texture Verify

ANIMATION Runtime surface
  Animation       → motion/keyframes/effects/controllers when required
```

Geometry and Texturing retain distinct semantic owners, but both tool families are callable in the same AUTHORING Runtime surface. Geometry↔Texturing correction therefore does not require `switch_authoring_phase`; the setting remains a startup/guidance focus. `HANDOFF_REQUIRED` is reserved for crossing AUTHORING↔Animation through the Gateway.

Codex internally verifies meaningful stage checkpoints. Internal PASS means `READY_FOR_USER_REVIEW`; user inspects live Blockbench and explicitly approves before checkpointing unless autonomous execution was explicitly authorized. Same material causal correction failing twice without new evidence → `BLOCKED`.

Naturally movable structurally distinct parts remain meaningfully transformable even when Animation is not currently required. When Animation is required, needed hierarchy/pivots/attachments must already be animation-ready before Geometry approval.

## Texture vocabulary

- **UV Layout** = geometry-to-atlas mapping.
- **Texture Atlas** = bitmap/PNG canvas that stores pixels.
- **Texture Styling** = authored color/material/shading/detail.
- **Texture Verify** = fresh atlas + mapped-model visual validation.

New Bedrock projects use logical UV resolution **128 by default**, 256 opt-in.

## Persistence

Persistent Asset Model state lives in `workspace/active/<asset>/`. Workspace is created before Blockbench project creation; a new authoritative `.bbmodel` checkpoint first appears after Geometry user approval or the corresponding explicitly authorized autonomous verification boundary.

README owns current intake/stage/next-step/blocker state. Git history owns older revisions. Completed assets remain `active/` until the user explicitly archives them.

## No normal Standard / Extended profiles

Normal authoring has no Standard/Extended choice. Runtime internal `bedrock_entity` remains default; `extended` exists only for **Legacy UI Fallbacks** debug/maintenance compatibility. `risky_eval` and `from_geo_json` remain disabled.

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

Gateway exposes exactly:

```text
status
search_capabilities
describe_capability
invoke_capability
```

Current semantic phase union retains **54 callable Bedrock tools** after retirement of the two legacy 3D-assisted capabilities. Geometry and Texturing startup stages expose the same shared AUTHORING surface; Animation remains a separate runtime surface. Installed evidence is tracked separately in `current-validation.md`. Direct Runtime MCP remains for Inspector/conformance/debugging, not normal AI-client authoring.

Gateway handoff keeps the same task/chat alive and refreshes backend catalog only when crossing AUTHORING↔Animation.

## Repository / Runtime Separation

Repository source/docs/CI work follows `GITHUB_RULES.md`. Static proof never proves live Blockbench/runtime/visual quality.

## Navigation

- routing → `AGENTS.md`
- product flow → `docs/knowledge/flow.md`
- workspace contract → `workspace/README.md`
- continuation → `docs/knowledge/next-action.md`
- ownership → `docs/knowledge/implementation-map.md`
- proof → `docs/knowledge/current-validation.md`
- reference policy → `docs/foundation/04-reference-guide.md`
- research → `Experimental/`
