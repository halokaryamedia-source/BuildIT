# BlockIT Workspace Context

Last verified: 2026-08-12  
Stability: stable  
Owner: workspace agent

This file owns **stable project facts and terminology**. Active task state belongs in `docs/knowledge/next-action.md`.

## Purpose

BlockIT is a Blockbench MCP plugin plus repository-owned workflow for AI-assisted Minecraft Bedrock Entity modelling and MCP engineering.

The retained default product is **Minecraft Bedrock Entity**. Generic inherited Blockbench capability, other formats, and optional fallback families are not compatibility requirements merely because upstream code contains them. Native Bedrock capability must not be removed just to reduce tool count.

The primary outcome is a clean, editable `.bbmodel` that follows an approved visual Modelling Brief through the shortest evidence-backed workflow. A valid file, successful tool call, or correct coordinates are not proof of visual resemblance.

For active Bedrock modelling, normal geometry is Cube/Cuboid based. Native Bedrock `TextureMesh` is distinct from generic Blockbench `Mesh`; generic Mesh workflows are outside the normal BlockIT modelling route, while missing direct `TextureMesh` ownership remains a protected capability gap.

## Execution Channels

- **ChatGPT → GitHub** — repository inspection, documentation/source changes, CI/static proof, and preparation for local runtime checks.
- **Codex local from root `BuildIT`** — targeted shell/MCP/Blockbench/runtime/visual proof.

The repository—not chat history—is project memory. Repository/plugin continuation resumes from `AGENTS.md`, this file when stable facts matter, and `docs/knowledge/next-action.md`.

Normal asset authoring is different: root `AGENTS.md` routes directly to the BlockIT asset orchestrator and only the active domain specialist; it does not automatically load repository continuity/history.

## Stable Terms

**Source Image** — original input used to understand target identity; not geometry data.

**Modelling Brief** — approved multi-view visual guide for silhouette, visible proportions, landmarks, contacts, orientation, and style. It is not a pixel-calibrated Cube blueprint.

**Requested Dimensions** — user-supplied/approved target dimensions. Bedrock modelling uses `1 block = 16 Blockbench units` on each axis.

**Reference Package** — Modelling Brief plus compact metadata and optional source/supporting references.

**Blockbench Model** — reviewed editable `.bbmodel`.

**Reference Generator** — image-capable workflow from user intent/Source Image to an approved Modelling Brief. Policy owner: `docs/foundation/04-reference-guide.md`.

**MCP Modelling** — approved reference → model workflow. Modelling judgement belongs to the modelling specialist; MCP/runtime code supplies execution mechanics.

## Stable Repository Structure

- `.agents/skills/` — only canonical repository-owned skill root;
- `mcp/` — active BlockIT plugin/runtime source, build, UI, tools, resources, prompts, tests, and generated API documentation;
- `workspace/` — model/project packages and fixtures;
- `docs/foundation/` — durable product/modelling/reference/texture/validation policy;
- `docs/knowledge/` — continuity, decisions, source maps, skill routing, reviews, and operations.

Retired/stale skill locations must not be recreated by default:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

## Current Skill Architecture

There are nine repository-owned skill packages, grouped by task class rather than loaded together.

### Asset authoring

```text
blockit-bedrock-entity-mcp        orchestration / smallest active lane
blockbench-bedrock-modelling      whole-form Cube/Group judgement + visual correction
blockit-bedrock-texturing         texture / Paint / PBR / material_instance
blockit-bedrock-animation         BoneAnimator / keyframes / mapped effects
```

### Repository / plugin development

```text
development-brief                 change-task contract / scope / acceptance / proof
mcp-server-development            MCP public/input/result/registration/transport contract
typescript-type-safety            TypeScript type-system problems
bun-tooling                       Bun build/package/tooling problems
blockbench-runtime-development    Blockbench API/lifecycle/UI/Undo/runtime mechanics
```

`blockbench-bedrock-modelling` can also be the repository-development specialist when the source change is specifically about modelling judgement or visual/model policy.

Do not add/rename/merge/split skills merely because old documentation used another layout. A new skill requires a current reusable ownership gap that cannot be represented cleanly by the existing owners.

## Sources Of Truth

1. current user instruction — task intent;
2. current `Local` source + relevant runtime/visual proof — actual behavior;
3. root/nearest `AGENTS.md` — agent behavior and proof discipline;
4. `docs/foundation/` — durable product/modelling policy;
5. `docs/knowledge/next-action.md` — active repository continuation state;
6. this file — stable facts;
7. decision/review history — rationale/evidence only.

When sources materially conflict, resolve authority or report the missing evidence; never choose silently.

## MCP Architecture Facts

BlockIT runs inside desktop Blockbench and exposes a loopback MCP endpoint. Tool schemas/docs must be constructible outside Blockbench, so schema modules cannot depend on Blockbench runtime globals. Runtime-only validation belongs inside execution.

Current default product surface is Bedrock-focused; optional generic fallback families are explicit opt-in. `risky_eval` and `from_geo_json` remain disabled. The accepted default surface is 62 enabled tools; current measurements and any efficiency work belong in `docs/knowledge/next-action.md` and `docs/foundation/validation-report.md`.

## Engineering Invariants

- Inspect the current owner/callers before shared changes.
- Prefer the minimum complete solution; reuse/extend before creating abstractions.
- Validate untrusted MCP input at the boundary.
- Keep Blockbench globals out of build-time schemas.
- Generated docs/output are secondary to source and must be regenerated through their owner.
- Use minimum useful proof; never claim runtime/visual evidence not actually obtained.
- Stop repeated failed directions after two attempts without genuinely new evidence.
- A fixture or named model never becomes generic runtime policy by accident.
- Do not duplicate large machine-readable MCP results across equivalent response representations.

## Accepted Baseline

The first bounded Codex + Blockbench local acceptance pass completed on 2026-08-12. It established representative live proof for runtime transport, geometry/correction/Undo, reference-fidelity behavior, texture/Paint/PBR/material instances, animation playback, Locator/Null Object lifecycle, and `.bbmodel`/Bedrock export persistence.

That functional acceptance does **not** prove optimal Codex context/usage efficiency. Tool-catalog refresh/deferred-search behavior, prompt/skill co-loading, and material client cost of result representations remain evidence questions. Active efficiency or product work must be taken from `docs/knowledge/next-action.md`; do not restart the completed acceptance run merely because this file is read.

## Navigation

- Agent/task routing: `AGENTS.md`
- Active repository state: `docs/knowledge/next-action.md`
- Historical/completed local acceptance procedure: `docs/knowledge/operations/local-acceptance-runbook.md`
- Knowledge dashboard: `docs/knowledge/index.md`
- Foundation entrypoint: `docs/foundation/README.md`
- MCP runtime/build instructions: `mcp/README.md` and `mcp/AGENTS.md`
- Skill routing: `docs/knowledge/skills/activation-matrix.md`
- Current source ownership: `docs/knowledge/implementation-map.md`
