# BlockIT Workspace

BlockIT is an AI-assisted Minecraft Bedrock Entity modelling workspace. The agent reasons about an approved visual reference as a modeller, then uses the BlockIT Blockbench MCP as a focused execution, inspection, texture, animation, validation, and export interface.

## Product Goal

Produce a clean, editable `.bbmodel` that follows the approved reference through the shortest evidence-backed workflow.

The product is **object-agnostic**. Fixtures and Golden Samples may test the workflow but never become generic runtime rules.

## Task Class First

Start with [`AGENTS.md`](AGENTS.md). It owns session routing.

### Asset authoring

For creating/revising a Bedrock Entity asset without changing repository/plugin source:

```text
current request/reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

Do not automatically load repository history, `CONTEXT.md`, `next-action.md`, or `development-brief` for ordinary asset authoring.

### Repository / plugin work

For source, docs, CI, MCP/plugin implementation, or repository maintenance:

```text
AGENTS.md
→ CONTEXT.md when stable project facts matter
→ docs/knowledge/next-action.md when continuing current work
→ affected source + nearest AGENTS.md
→ development-brief for a create/change task
```

The current continuation is **local Codex + Blockbench acceptance**. Use [`docs/knowledge/operations/local-acceptance-runbook.md`](docs/knowledge/operations/local-acceptance-runbook.md) when `next-action.md` points there.

## Repository Is Project Memory

Do not reconstruct project state from chat history. Canonical owners are:

- `AGENTS.md` — behavior, task routing, proof rules;
- `CONTEXT.md` — stable facts and terminology;
- `docs/knowledge/next-action.md` — single active continuation snapshot;
- `docs/knowledge/operations/local-acceptance-runbook.md` — local acceptance procedure;
- `docs/knowledge/decision-log.md` — durable decisions/reasons;
- `docs/foundation/` — durable product/modelling policy;
- current `Local` source + relevant proof — implementation truth.

## Repository Map

- `.agents/skills/` — canonical repository-owned skills;
- `mcp/` — active Blockbench MCP plugin/runtime source, tools, prompts, resources, UI, build, and generated API docs;
- `workspace/` — project/model packages and fixtures;
- `docs/foundation/` — durable product, modelling, reference, texture, and visual-validation policy;
- `docs/knowledge/` — continuity, source maps, skill routing, reviews, operations, and decisions.

## Current Skill Surface

Asset-authoring workflow:

```text
blockit-bedrock-entity-mcp
├─ blockbench-bedrock-modelling
├─ blockit-bedrock-texturing
└─ blockit-bedrock-animation
```

Repository-maintenance specialists:

```text
development-brief
mcp-server-development
typescript-type-safety
bun-tooling
blockbench-runtime-development
```

`blockbench-bedrock-modelling` may also be selected during repository work when the changed contract is specifically modelling judgement/policy.

Retired nested skill roots under `mcp/` are not authorities and must not be repopulated.

## Branch Roles

- `Local` — current product/development authority.
- `Rework` — historical architecture/reference material only.
- `Sample` — external implementation/reference material only.

Do not copy behavior from historical/reference branches unless a concrete `Local` failure proves the need.

## Official Modelling Direction

```text
Approved Modelling Brief
→ whole-form interpretation
→ primary geometry
→ difference-first visual gate
→ secondary geometry / hierarchy / pivots
→ full geometry review
→ texture / PBR when required
→ animation when required
→ final validation
→ save/export
```

Tool success is execution evidence, not visual approval. Visual verdicts use `FAIL / UNVERIFIED / PASS`; use `BLOCKED` when valid continuation would require guessing or repeated failed work.
