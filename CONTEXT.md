# BlockIT Workspace Context

Last verified stable facts: 2026-09-05  
Stability: stable design contract; implementation status remains separately tracked

This file owns **stable project facts only**. Repository/plugin continuation belongs in `docs/knowledge/next-action.md`; proof state belongs in `docs/knowledge/current-validation.md`; source ownership belongs in `docs/knowledge/implementation-map.md`; asset continuity belongs in `workspace/active/<asset>/README.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a local MCP workflow for AI-assisted **Minecraft Bedrock Entity** authoring in desktop Blockbench. The normal AI-client boundary is the stable **BlockIT Gateway**; the Blockbench plugin is the volatile execution Runtime behind it.

Primary editable output is `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Tool/file/coordinate success is not proof of visual resemblance.

## Reference and Intake

Operational reference-image creation belongs in **ChatGPT**. The canonical modelling board is fixed:

```text
UPPER: LEFT | FRONT | BACK
LOWER: TOP  | FRONT-LEFT 3/4
```

An image explicitly handed to Codex for modelling is treated as the Approved Reference unless the user marks it draft/not ready.

For a **new model**, authoring cannot begin until these five values are known:

```text
Asset
Approved Reference
Dimensions
Geometry Strategy: DIRECT | 3D_ASSISTED
Animation Required: YES | NO
```

Geometry Strategy is always chosen by the user. Codex never infers, defaults, or automatically changes it.

## Geometry Strategies

There is one downstream authoring pipeline and exactly two user-selected Geometry strategies:

```text
DIRECT
→ normal reference-guided Geometry

3D_ASSISTED
→ Approved Reference
→ Shape Reconstruction
→ Shape GLB
→ PrimitiveAnything decomposition
→ deterministic Cuboid materialization
→ semantic Geometry cleanup
```

`3D_ASSISTED` is one indivisible package. There is no normal GLB-only, PrimitiveAnything-only, user-provided-GLB, provider-selection, or automatic fallback mode.

Authority remains:

```text
Approved Reference  → visual authority
Requested Dimensions → numeric envelope authority
Shape GLB            → intermediate reconstructed 3D shape
PrimitiveAnything    → intermediate decomposition
Cuboid Scaffold      → temporary editable starting hypothesis
```

The Shape GLB may support cleanup as a locked non-export reference but must be removed from live Blockbench before final Geometry verification/user review. The canonical GLB file may remain in the workspace.

### 3D-Assisted implementation boundary

Shape Reconstruction + PrimitiveAnything run as **external local tooling controlled by Codex**. The architecture calls the stage `Shape Reconstruction`; Hunyuan3D is the v1 implementation, not a user-facing route and not a provider framework.

The approved target contract requires one resumable external orchestrator plus one dedicated atomic Geometry Runtime materializer that consumes only validated canonical workspace artifacts. These production pieces are **design-locked but not yet implemented/promoted** in current source.

## Authoring Stages and Approval

```text
Geometry → Texturing → Animation when required → Finalization
```

Codex owns internal readiness; user owns final stage approval.

```text
AUTHOR
→ internal technical/visual verification
→ READY_FOR_USER_REVIEW
→ user inspects live Blockbench
→ explicit approve
→ checkpoint save
→ next required stage
```

Internal model captures are working evidence for Codex and do not need to be shown to the user. Work that still has a clear material defect must not be sent to user review. Same causal correction failing twice without new evidence becomes `BLOCKED`.

An upstream approved stage reopens only for a material blocker owned by that stage, and only materially dependent downstream approvals are invalidated.

Geometry is always built for future editability. Naturally movable, structurally distinct parts receive meaningful transform ownership even when Animation is not currently required. If Animation is required, participating hierarchy/pivots/attachments must already be animation-ready before Geometry approval; do not build a speculative full rig for static-only scope.

## Persistence

Each persistent Asset Model uses one Active Workspace:

```text
workspace/active/<asset>/
```

The workspace is created after reference handoff and before Blockbench project creation. A new `.bbmodel` checkpoint does not exist until Geometry is explicitly approved.

README stores current intake/stage/next-step/blocker state only. `3d-assisted/state.json` stores only machine-readable external 3D-Assisted gate/artifact state. Git history owns prior revisions; do not accumulate duplicate versioned `.bbmodel` files.

A completed asset remains in `workspace/active/` until the user explicitly requests moving it to `workspace/saved/`.

## Existing Models

For an external `.bbmodel`, store the supplied file as the single current baseline before first mutation. Determine affected stages first. An Approved Reference is required only when the requested success condition depends on visual/fidelity judgement.

A tracked asset reuses its stored Geometry Strategy. An untracked external model needs a strategy only if Geometry authoring is required. Only the user may change strategy.

## No Normal Standard / Extended Profiles

Normal authoring has **no Standard/Extended profile choice**. Runtime internal `bedrock_entity` remains the implementation default; internal `extended` exists only for Legacy UI Fallback compatibility/debugging.

`risky_eval` and `from_geo_json` remain disabled.

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

Gateway exposes exactly four stable client tools:

```text
status
search_capabilities
describe_capability
invoke_capability
```

The current Runtime retains **51 callable Bedrock tools across phases**. Native phase surfaces are currently Geometry 25, Texturing 35, Animation 19. The direct Runtime endpoint remains for Inspector/conformance/debugging; it is not the normal AI-client boundary.

Gateway phase handoff keeps the same task/chat alive. Capability priority remains an internal routing concern: primary, support, experimental, maintenance.

## Navigation

- routing → `AGENTS.md`
- detailed product flow → `docs/knowledge/flow.md`
- workspace contract → `workspace/README.md`
- repository continuation → `docs/knowledge/next-action.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- current proof state → `docs/knowledge/current-validation.md`
- reference policy → `docs/foundation/04-reference-guide.md`
- experimental research → `Experimental/`
