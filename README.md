# BlockIT Workspace

BlockIT is an AI-assisted Minecraft Bedrock modelling workspace. The user gives a
simple request and an approved visual reference; the agent reasons about the
model as a modeller, then uses the Blockbench MCP as a focused execution,
inspection, and recovery interface.

## Product Goal

Produce a clean, editable `.bbmodel` that follows the approved reference with the
shortest evidence-backed workflow.

The product is **object-agnostic**. Test fixtures, animals, props, mechanical
objects, and Golden Samples may validate the workflow but must never become
object-specific runtime rules unless explicitly required.

## Official Modelling Direction

```text
User request
→ Approved Modelling Brief
→ Whole-form interpretation
→ Primary Geometry Pass
→ Primary visual gate
→ Secondary geometry / hierarchy / pivots
→ Full geometry review
→ UV / texture
→ Optional animation
→ Final validation
→ Save .bbmodel
```

Key rules:

- understand the whole form before optimizing individual Cubes;
- use the minimum useful geometry for silhouette, volume, attachment, or motion;
- do not add detail before the primary form is recognizable;
- correct one proved visual problem at its owner; if the same direction fails
  twice, replan instead of adding compensating geometry;
- MCP success or a valid file is not visual proof.

## Repository Is Project Memory

Do not rely on a previous chat as the source of truth. A new ChatGPT or Codex
session recovers project state from the repository first.

Canonical continuity owners:

- `AGENTS.md` — agent behavior, proof/evidence baseline, frozen skill architecture;
- `CONTEXT.md` — stable project facts and terminology;
- `docs/knowledge/next-action.md` — single active task/state and next step;
- `docs/knowledge/decision-log.md` — durable decisions and why;
- `docs/foundation/` — durable product/modelling/reference policy;
- source + relevant proof — actual implementation behavior.

## Development Channels

- **ChatGPT → GitHub:** design, inspect, edit, and prepare repository work for
  local proof. Static GitHub inspection is not Blockbench/MCP runtime proof.
- **Codex local:** perform the final targeted build/runtime/Blockbench proof when
  the claim requires the local environment.

Goal, Build POV, Acceptance POV, scope, and acceptance criteria stay the same.
Only available proof changes.

## Repository Map

- `.agents/skills/` — frozen canonical root skills discoverable from `BuildIT`;
- `mcp/` — active Blockbench MCP plugin source, tools, runtime, UI, build,
  prompts, and resources;
- `mcp/.agents/skills/` and `mcp/.github/skills/` — retired legacy skill
  locations, not active authorities;
- `workspace/` — active/saved Blockbench project packages and fixtures;
- `docs/foundation/` — product, modelling, reference, and validation policy;
- `docs/knowledge/` — project continuity, decisions, maps, reviews, and routing.

Canonical root skills:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
blockbench-bedrock-modelling
```

Reference generation is owned by `docs/foundation/04-reference-guide.md` on an
image-capable surface. Evidence-status escalation is owned by `AGENTS.md`.
Neither is another root skill.

## Mandatory Session Boot

For both ChatGPT → GitHub and Codex local:

1. read `AGENTS.md`;
2. read `CONTEXT.md`;
3. read `docs/knowledge/next-action.md`;
4. read only the relevant foundation/source;
5. for Developing, apply `.agents/skills/development-brief/SKILL.md`;
6. load at most one specialist when it materially helps the active boundary.

Do not broad-read the entire vault or ask the user to reconstruct old context
before following this boot path.

## Branch Roles

- `Local` — current product and development authority.
- `Rework` — historical architecture/reference material only.
- `Sample` — external implementation/reference material only.

Do not merge behavior from `Rework` or `Sample` merely because it is more
elaborate. Adopt only a bounded pattern that solves a demonstrated `Local`
problem and can be proved.
