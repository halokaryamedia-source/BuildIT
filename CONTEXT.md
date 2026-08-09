# MCP-Blockbench Workspace Context

This is the stable context for the BlockIT/MCP-Blockbench workspace. Read this
before detailed project notes. Keep it factual and compact.

Last verified: 2026-08-09
Stability: stable
Owner: workspace agent

## Purpose

BlockIT develops a Blockbench MCP plugin plus the workflow for AI-assisted
Minecraft Bedrock modelling and MCP engineering.

The primary product goal is a clean, editable Blockbench `.bbmodel` that follows
an approved visual modelling brief through the shortest evidence-backed workflow.
The product is object-agnostic: fixtures, Golden Samples, animals, props, or
mechanical objects may validate the workflow but do not become generic runtime
rules.

For the active **Minecraft Bedrock Entity modelling path, geometry is Cube/Cuboid
only**. Meshes, polygons, cylinders, free-form surfaces, and other non-Cuboid
geometry are outside the modelling scope unless the product scope is explicitly
changed. Existing generic MCP tools do not expand the Bedrock modelling contract.

2D texture-editor operations such as rectangle/ellipse pixel selections are
**texture-editing utilities, not model geometry primitives**. Their presence must
not be interpreted as permission to build non-Cuboid Bedrock Entity geometry, and
they must not gate Geometry completion merely because they exist in the paint
surface.

A valid file, successful tool call, or correct coordinates are not proof of
visual resemblance.

## Development Model

BlockIT uses two complementary execution channels:

- **ChatGPT → GitHub:** design, repository inspection, documentation/source
  changes, and preparation for local proof.
- **Codex local from root `BuildIT`:** targeted shell/build/MCP/Blockbench proof
  when the claim requires the local environment.

The task goal, scope, Build POV, Acceptance POV, and acceptance criteria stay the
same across channels. Only available proof changes.

The repository—not chat history—is project memory. New sessions resume from
`AGENTS.md`, this file, and `docs/knowledge/next-action.md`.

## Stable Terms

**Source Image**  
Original user image(s) used to understand target identity. It is input/provenance,
not direct geometry data.

**Modelling Brief Draft**  
Generated five-view visual before user approval.

**Modelling Brief**  
Approved five-view visual guide used for silhouette, visible proportions,
landmarks, contacts, orientation, and style. It is not pixel calibration and
does not define Cube transforms.

**Requested Dimensions**  
User-supplied/approved target height, width, and length. For Bedrock modelling,
`1 block = 16 Blockbench units` on each axis.

**Reference Package**  
The approved Modelling Brief plus small metadata and optional Source Images or
supporting references. It is a handoff container, not a geometry blueprint.

**Blockbench Model**  
The reviewed editable `.bbmodel` produced in Blockbench.

**Reference Generator**  
Image-capable workflow from Source Image/user intent to an approved Modelling
Brief. Canonical policy: `docs/foundation/04-reference-guide.md`. It does not
own Cube authoring.

**MCP Modelling**  
Workflow from an approved Modelling Brief to the reviewed Blockbench Model. The
modelling specialist owns model judgement; MCP/Blockbench runtime code supplies
execution mechanics.

## Stable Structure

- `.agents/skills/` — canonical repository-wide skills discoverable from root
  `BuildIT`.
- `mcp/` — active Blockbench MCP plugin source, build, UI, server, tools,
  resources, prompts, and generated API documentation.
- `mcp/.agents/skills/` and `mcp/.github/skills/` — retired legacy skill
  locations with no active canonical skills; do not repopulate by default.
- `workspace/` — active/saved Blockbench project packages and fixtures.
- `docs/foundation/` — durable product, modelling, reference, texture, and
  validation policy.
- `docs/knowledge/` — continuity, decisions, routing maps, reviews, and
  navigation.

The old `mcp/workflow/skills/` path is stale and must not be recreated merely to
match historical documentation.

## Frozen Skill Architecture

Canonical root skills:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
blockbench-bedrock-modelling
```

Responsibilities:

- `development-brief` → Developing task contract and specialist selection;
- `mcp-server-development` → MCP public/protocol/input contract;
- `typescript-type-safety` → TypeScript type-system problems only;
- `bun-tooling` → Bun-owned build/tooling behavior only;
- `blockbench-runtime-development` → Blockbench API/lifecycle/UI/mutation
  mechanics;
- `blockbench-bedrock-modelling` → what model should be built and whether its
  visual/model result is coherent.

Reference generation remains a foundation workflow, not a Codex root skill.
Evidence-status escalation remains root `AGENTS.md` behavior, not another skill.

Do not change this architecture because an old skill name is encountered. A new
split/merge/skill requires a current demonstrated capability/ownership gap.

## Sources Of Truth

- Current task intent → current user instruction.
- Agent behavior/proof baseline → root/nearest `AGENTS.md`.
- Stable project facts/terms → this file.
- Active task/continuation state → `docs/knowledge/next-action.md`.
- Durable decisions/reasons → `docs/knowledge/decision-log.md`.
- Product/modelling/reference policy → relevant `docs/foundation/` note.
- Skill routing → `docs/knowledge/skills/activation-matrix.md`.
- Skill inventory/lineage → `docs/knowledge/skills/skill-map.md`.
- MCP implementation behavior → `mcp/AGENTS.md`, relevant source, and relevant
  proof.

When material sources conflict, do not guess. Resolve the authority or use
`Needs Validation` / the root evidence-status rules.

## MCP Architecture

The plugin entrypoint wires MCP server, UI, settings, and lifecycle. The server
exposes tools, resources, and prompts. Tool implementations live under
`mcp/server/tools/`; shared factories, schemas, state, and transport helpers live
under `mcp/lib/` and `mcp/server/`.

Tool schemas/documentation are aggregated by the build docs manifest outside
Blockbench, so schema construction must not depend on Blockbench globals.
Runtime-only validation belongs inside tool execution.

## Engineering Invariants

- Inspect the current owner/callers/pattern before editing shared behavior.
- Prefer the smallest complete change; avoid speculative abstractions/dependencies.
- Validate untrusted MCP input at the boundary.
- Keep Blockbench globals out of build-time schema modules.
- Generated output is secondary to source and is regenerated only through the
  documented flow.
- Use minimum useful proof for the risk and execution channel.
- Never claim a check/runtime/visual result that was not actually obtained.
- Distinguish symptom, cause, requirement, incorrect data, and platform
  limitation before changing behavior.
- Stop repeated failed correction directions and re-diagnose rather than patching
  indefinitely.

## Navigation

- Current task: `docs/knowledge/next-action.md`
- Workspace map: `docs/knowledge/workspace-map.md`
- MCP map: `mcp/README.md`
- Foundation entrypoint: `docs/foundation/README.md`
- Knowledge dashboard: `docs/knowledge/index.md`
- Skill routing: `docs/knowledge/skills/activation-matrix.md`
