# BlockIT Workspace Context

Last verified stable facts: 2026-09-05  
Stability: stable design contract; implementation/proof tracked separately

This file owns **stable project facts only**. Continuation → `docs/knowledge/next-action.md`; proof → `current-validation.md`; ownership → `implementation-map.md`; asset continuity → `workspace/active/<asset>/README.md`; routing → `AGENTS.md`.

## Product

BlockIT is a local MCP workflow for AI-assisted **Minecraft Bedrock Entity** authoring in desktop Blockbench. Normal AI-client boundary is the stable **BlockIT Gateway**; Blockbench plugin is the execution Runtime behind it.

Primary editable output is `.bbmodel`. Tool/file/coordinate success is not proof of visual resemblance.

## Reference-Grounded Authoring

Reference image creation belongs in ChatGPT. Canonical approved board:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

For a new model, Codex requires before Blockbench authoring:

```text
Asset
Approved Reference Image
Dimensions
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

The **Approved Reference Image** is visual authority and requested dimensions are numeric envelope authority (`1 block = 16 Blockbench units`). Geometry Strategy is always chosen by the user; Codex never infers/defaults/auto-switches it.

### Geometry Strategies

```text
DIRECT
→ normal reference-guided Geometry

3D_ASSISTED
→ Approved Reference
→ Shape Reconstruction
→ Shape GLB
→ PrimitiveAnything decomposition
→ deterministic Cuboid Scaffold
→ semantic Geometry cleanup
```

`3D_ASSISTED` is one indivisible package. There is no normal GLB-only, PrimitiveAnything-only, user-provided-GLB v1, provider-selection, or automatic fallback mode.

Authority inside 3D-Assisted:

```text
Approved Reference → visual authority
Dimensions         → numeric authority
Shape GLB          → intermediate reconstructed shape
PrimitiveAnything  → intermediate decomposition
Cuboid Scaffold    → temporary editable starting hypothesis
```

Shape GLB may remain locked/non-export during semantic cleanup but must be removed from live Blockbench before final Geometry verification/user review.

Architecture term is `Shape Reconstruction`; Hunyuan3D is the single v1 implementation. Do not build provider abstraction until another real implementation is required.

### Authoring phases

```text
Geometry   shape, hierarchy, rig foundation, pivots, UV Layout, future editability
Texturing  Texture Atlas, Painter/styling, PBR/material instances, Texture Verify
Animation  motion/keyframes/effects/controllers when required
```

Codex internally verifies each stage. Internal PASS means `READY_FOR_USER_REVIEW`; user inspects live Blockbench and explicitly approves before checkpoint/handoff. Same material causal correction failing twice without new evidence → `BLOCKED`.

Naturally movable structurally distinct parts remain meaningfully transformable even when Animation is not currently required. When Animation is required, needed hierarchy/pivots/attachments must already be animation-ready before Geometry approval.

## Texture vocabulary

- **UV Layout** = geometry-to-atlas mapping.
- **Texture Atlas** = bitmap/PNG canvas.
- **Texture Styling** = authored color/material/shading/detail.
- **Texture Verify** = fresh atlas + mapped-model visual validation.

New Bedrock projects use logical UV resolution **128 by default**, 256 opt-in.

## Persistence

Persistent Asset Model state lives in `workspace/active/<asset>/`. Workspace is created before Blockbench project creation; a new authoritative `.bbmodel` checkpoint first appears after Geometry user approval.

README owns current intake/stage/next-step/blocker state. `3d-assisted/state.json` owns only external pipeline gate/artifact hashes. Git history owns older revisions. Completed assets remain `active/` until user explicitly archives them.

## 3D-Assisted implementation boundary

External local tooling controlled by Codex owns view extraction + Shape Reconstruction + PrimitiveAnything. Target production flow requires one thin resumable orchestrator.

BlockIT Geometry Runtime owns target dedicated atomic Cuboid materialization + production cleanup. The orchestrator/state contract and dedicated materializer are **design-locked but not yet production-implemented/promoted**.

Do not revive generic `from_geo_json` or add a provider router to implement this target.

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

Current Runtime retains **51 callable Bedrock tools across phases**: Geometry 25, Texturing 35, Animation 19. Direct Runtime MCP remains for Inspector/conformance/debugging, not normal AI-client authoring.

Gateway phase handoff keeps the same task/chat alive and refreshes backend catalog only.

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
