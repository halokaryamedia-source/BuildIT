# BlockIT Workspace Context

Last verified: 2026-08-13  
Stability: stable  
Owner: workspace agent

This file owns **stable project facts and terminology only**. Active work belongs in `docs/knowledge/next-action.md`; routing belongs in `AGENTS.md`.

## Product

BlockIT is a Blockbench MCP plugin plus repository workflow for AI-assisted Minecraft Bedrock Entity modelling and MCP engineering.

The retained default product is **Minecraft Bedrock Entity** (`bedrock`). Normal authored geometry is Cube/Cuboid based and organized by Groups/bones. Native Bedrock `TextureMesh` is distinct from generic Blockbench `Mesh`; generic Mesh/Hytale capability is not a compatibility requirement merely because upstream code contains it.

Primary asset output is a clean editable `.bbmodel`; Bedrock geometry JSON is the runtime geometry export. Successful tool/file/coordinate output is not proof of visual resemblance to the approved reference.

## Stable Terms

- **Source Image** — original visual input; not geometry data.
- **Modelling Brief Draft** — generated multi-view Minecraft / Blockbench-style reference image before approval.
- **Modelling Brief** — approved multi-view image guide for form, proportions, landmarks, contacts, orientation, and style; not a per-Cube blueprint.
- **Requested Dimensions** — user-approved target dimensions; `1 block = 16 Blockbench units` per axis.
- **Reference Generator** — image-capable Source Image/user intent → one approved Modelling Brief image workflow; active skill `.agents/skills/blockbench-reference-generator/`, policy owner `docs/foundation/04-reference-guide.md`.
- **Blockbench Model** — reviewed editable `.bbmodel`.
- **MCP Modelling** — approved reference → Blockbench model workflow; modelling judgement and MCP execution have separate owners.

## Repository Shape

```text
.agents/skills/    canonical repository-owned skills
docs/foundation/  durable product/reference/modelling policy
docs/knowledge/   continuity, decisions, ownership maps, historical evidence indexes
mcp/              BlockIT plugin/runtime/build/tests/generated API docs
workspace/        model/project packages and fixtures
```

Retired skill roots must not be recreated by default:

```text
mcp/.agents/skills/
mcp/.github/skills/
mcp/workflow/skills/
```

There are **ten repository-owned skill packages**:

```text
reference:   blockbench-reference-generator

asset:       blockit-bedrock-entity-mcp
             blockbench-bedrock-modelling
             blockit-bedrock-texturing
             blockit-bedrock-animation

engineering: development-brief
             mcp-server-development
             blockbench-runtime-development
             typescript-type-safety
             bun-tooling
```

The activation matrix owns selection detail; this file records only the stable inventory.

## MCP Architecture Facts

BlockIT runs inside desktop Blockbench and exposes a loopback MCP endpoint. Tool schemas/docs must construct outside Blockbench, so build-time schema modules cannot depend on Blockbench runtime globals; runtime-only checks belong in execution.

The normal surface is Bedrock-focused with generic fallback families explicitly opt-in. `risky_eval` and `from_geo_json` remain disabled. The accepted baseline has **62 enabled tools**; active efficiency measurements belong in the validation/next-action owners rather than here.

Supported ownership includes Cube/Group authoring, texture/Painter/PBR/material instances, Bedrock animation, Locator/Null Object lifecycle, Undo, `.bbmodel`, and Bedrock geometry export. Protected direct-ownership gaps include TextureMesh authoring, native visible bounding-box fields, animation controllers, animation sound/timeline effects, animated textures, and bone-binding expressions.

Reference image generation is outside the MCP capability surface. It is an image-capable pre-modelling route and must not be simulated through generic MCP/UI tooling.

## Execution Channels

- **Image-capable ChatGPT surface** — Source Image → Modelling Brief image generation/revision.
- **ChatGPT → GitHub** — repository/source/docs/CI/static proof; no invented Blockbench runtime evidence.
- **Codex local** — shell/MCP/Blockbench/runtime/visual proof only when explicitly active and materially required.

## Accepted Functional Baseline

The first bounded Codex + Blockbench local acceptance pass completed on 2026-08-12. It established representative live proof for stateless transport, geometry/correction/Undo, difference-first reference behavior, texture/Paint/PBR/material instances, animation playback, Locator/Null Object lifecycle, and `.bbmodel`/Bedrock export persistence.

That acceptance does not prove optimal Codex context/usage behavior. Active cleanup/testing state must be read from `docs/knowledge/next-action.md`; do not infer a new local run from this historical baseline.

## Engineering Facts

- Untrusted MCP input is validated at the boundary.
- Generated docs/output are secondary to source and regenerated through their owner.
- Current source + relevant proof owns behavior; historical reviews/decisions own rationale, not active execution order.
- Named fixtures/samples never become generic runtime rules by accident.
- Large machine-readable MCP data should not be duplicated across equivalent response representations.

## Navigation

- routing → `AGENTS.md`
- active continuation → `docs/knowledge/next-action.md`
- source ownership → `docs/knowledge/implementation-map.md`
- proof status → `docs/foundation/validation-report.md`
- product/reference/modelling policy → `docs/foundation/`
- MCP engineering → `mcp/README.md` + `mcp/AGENTS.md`
