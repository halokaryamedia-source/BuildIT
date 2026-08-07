# BlockIT Workspace

BlockIT is an AI-assisted Minecraft Bedrock modelling workspace. The user gives a simple request and an approved visual reference; the agent reasons about the model as a modeller, then uses the Blockbench MCP as a focused execution, inspection, and recovery interface.

## Product Goal

Produce a clean, editable `.bbmodel` that follows the approved reference with the shortest evidence-backed workflow.

The product is **object-agnostic**. Test fixtures, animals, props, mechanical objects, and Golden Samples may validate the workflow but must never become object-specific runtime rules unless explicitly required.

## Official Modelling Direction

```text
User request
→ Approved Model Reference
→ Reference buildability check
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
- correct one proved visual problem at its owner; if the same direction fails twice, replan instead of adding compensating geometry;
- MCP success or a valid file is not visual proof.

## Repository Is Project Memory

Do not rely on a previous chat as the source of truth. A new ChatGPT or Codex session should recover project state from the repository before asking the user to explain the project again.

Canonical continuity owners:

- `AGENTS.md` — how the agent must work;
- `CONTEXT.md` — stable project facts and terminology;
- `docs/knowledge/next-action.md` — single active task/state and next step;
- `docs/knowledge/decision-log.md` — durable decisions and why;
- `docs/foundation/` — durable product/modelling policy;
- source + relevant proof — actual implementation behavior.

## Development Channels

The same task contract supports both workflows:

- **ChatGPT → GitHub:** design, inspect, edit, and prepare the repository for local proof. Do not pretend static GitHub inspection is Blockbench/MCP runtime proof.
- **Codex local:** perform the final targeted build/runtime/Blockbench proof when the claim actually requires the local environment.

The goal, Build POV, Acceptance POV, scope, and acceptance criteria stay the same. Only the available proof changes. Validation is proportional to risk; more checks are not automatically better.

## Repository Map

- `.agents/skills/` — repository-wide skills available from root `BuildIT`; `development-brief` is canonical here.
- `mcp/` — active Blockbench MCP plugin source, tools, runtime, UI, build, prompts, and resources.
- `mcp/.agents/skills/` — existing MCP specialist skills pending one-by-one naming/overlap/location audit.
- `workspace/` — active/saved Blockbench project packages and fixtures.
- `docs/foundation/` — product, modelling, reference, and validation policy.
- `docs/knowledge/` — project continuity, decisions, maps, reviews, and workflow knowledge.

## Mandatory Session Boot

For both ChatGPT → GitHub and Codex local:

1. read `AGENTS.md`;
2. read `CONTEXT.md`;
3. read `docs/knowledge/next-action.md`;
4. read only the relevant foundation rule/source;
5. for Developing, apply `.agents/skills/development-brief/SKILL.md`;
6. load at most one specialist when it materially helps the active boundary.

Do not broad-read the entire vault or ask the user to reconstruct old context before following this boot path.

## Branch Roles

- `Local` — current product and development authority.
- `Rework` — historical architecture/reference material only.
- `Sample` — external implementation/reference material only.

Do not merge behavior from `Rework` or `Sample` merely because it is more elaborate. Adopt only a bounded pattern that solves a demonstrated `Local` problem and can be proved.
