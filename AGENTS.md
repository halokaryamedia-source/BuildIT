# Workspace Agent Routing

This repository is project memory. Current user intent is the task authority; source and relevant proof own runtime truth.

## Task Class First

Choose the smallest route before loading more context.

### Asset Authoring

Use this route when the user wants to create, revise, texture, animate, inspect, validate, or export a Minecraft Bedrock Entity asset in Blockbench and is **not** asking to change repository/plugin source.

Fast path:

1. use the current user request/reference and any explicitly named workspace asset;
2. load `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md`;
3. load only the current domain specialist (`blockbench-bedrock-modelling`, `blockit-bedrock-texturing`, or `blockit-bedrock-animation`);
4. use BlockIT MCP with minimum necessary evidence.

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, the activation matrix, engineering history, or every foundation document. Read one of them only when the current asset decision actually depends on repository state, a protected capability boundary, an existing workspace package, or a conflicting product rule.

Asset authoring is not software **Developing** merely because it creates or changes a model. Do not route it through `development-brief` unless the user is asking to change source/plugin behavior.

### Repository / Plugin Work

Use this route for source, docs, MCP/plugin implementation, tests, CI, architecture, or repository maintenance.

Boot only what is needed:

1. `CONTEXT.md` for stable project facts when relevant;
2. `docs/knowledge/next-action.md` for active continuation state when continuing project work;
3. the affected source and nearest `AGENTS.md`;
4. one relevant foundation/routing note only when needed.

For a repository create/change task, use `.agents/skills/development-brief/SKILL.md`; add at most one engineering specialist unless a proved cross-domain blocker requires another owner. Maintenance uses the smallest diagnostic/specialist that owns the failure.

## Source Precedence

1. current user instruction — task intent;
2. source + relevant runtime/visual proof — actual behavior;
3. root/nearest `AGENTS.md` — agent behavior;
4. `docs/foundation/` — product/modelling policy;
5. `docs/knowledge/next-action.md` — active repository continuation state;
6. `CONTEXT.md` — stable facts;
7. decision log/history — rationale only.

If material sources conflict, resolve the authority or report the missing evidence; never choose silently.

## Work Discipline

- Inspect the current owner/caller/pattern before editing shared behavior.
- Prefer the minimum complete solution; every changed line must trace to the goal.
- Reuse/extend before creating files or abstractions.
- Do not broaden scope because adjacent issues are visible.
- Do not add compatibility/fallback/framework layers without a proved need.
- Do not turn fixtures, Golden Samples, or named objects into generic runtime rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim a check, runtime result, or visual approval that was not actually obtained.

## Execution Channels

### ChatGPT → GitHub

Repository reads/writes are available. Do not assume local shell, Blockbench runtime, or live visual proof. Static/source work may prepare a runtime change; report remaining local proof rather than inventing it.

### Codex Local

Use available shell/build/MCP/Blockbench capabilities only when they materially test the current claim. Do not run broad checks by ritual.

## Minimum Useful Proof

Use the cheapest evidence that can falsify the likely failure, then stop when the in-scope claim has enough support.

- text/docs/routing → exact changed owner + relevant diff;
- bounded source change → affected source/callers/contracts and an existing targeted gate when informative;
- public/destructive contract → stronger proof before full completion;
- Blockbench/UI/visual claim → live/runtime/visual proof is required;
- local correction → re-check only affected state/view unless it reveals a global problem.

Do not create extra tests, screenshots, builds, fixtures, or reports merely to look rigorous. Source/CI proof never upgrades a live modelling claim.

When a material support/runtime claim needs a label, use only:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Routine work does not need ceremonial status tagging.

## Asset-Authoring Invariants

- Target Minecraft Bedrock Entity (`bedrock`).
- Tool success is execution evidence, not visual fidelity.
- Use `FAIL / UNVERIFIED / PASS` for visual verdicts and `BLOCKED` when valid continuation would require guessing or looping.
- Use the smallest relevant tool/view/evidence set.
- Do not inspect every new Cube or capture after every mutation.
- Do not start production texture/animation to hide unresolved geometry.
- Preserve native Bedrock capability; do not fake gaps with generic Mesh, risky evaluation, UI automation, or another format.

Detailed artistic judgement belongs to `blockbench-bedrock-modelling`; texture/PBR execution to `blockit-bedrock-texturing`; animation execution to `blockit-bedrock-animation`.

## Repository Engineering Invariants

For `mcp/**`, follow `mcp/AGENTS.md`: strict TypeScript, full Zod validation, schemas free of Blockbench runtime globals, `createTool` registration, generated docs freshness, loopback containment, and dangerous-default quarantine.

Do not add commit/build fingerprint metadata to the product/runtime surface. Git owns revision history.

## Communication

Keep progress compact. Explain decisions, blockers, and final evidence; do not narrate every tool call.

Final non-trivial report:

```text
Status: Selesai | Perlu pemeriksaan | Terhenti
Hasil:
Bukti:
Batasan:
Next step:
```

Use one next step.

## Canonical Owners

- stable facts → `CONTEXT.md`;
- active repository continuation → `docs/knowledge/next-action.md`;
- durable rationale → `docs/knowledge/decision-log.md`;
- product/modelling policy → `docs/foundation/`;
- plugin/server behavior → `mcp/` source + proof;
- asset orchestration → `.agents/skills/blockit-bedrock-entity-mcp/`;
- modelling judgement → `.agents/skills/blockbench-bedrock-modelling/`;
- texture/PBR → `.agents/skills/blockit-bedrock-texturing/`;
- animation → `.agents/skills/blockit-bedrock-animation/`;
- repository development contract → `.agents/skills/development-brief/`.

Do not recreate retired generic skills or parallel planning/state systems.
