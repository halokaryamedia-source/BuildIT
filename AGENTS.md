# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Task Class First

### Reference Preparation

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ readiness → one Draft → visual gate → user approval
```

Image-capable work only. Generation is output, not discovery. Detailed sequence: `docs/knowledge/flow.md`; durable policy: `docs/foundation/04-reference-guide.md`.

### Asset Authoring

```text
current request / actual approved reference
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, Git history, secondary skill indexes, or the whole foundation set. Asset authoring is not software **Developing** merely because a model changes. Do not route it through `development-brief` unless repository/plugin behavior changes.

### Repository / Plugin Work

```text
this file
→ docs/knowledge/next-action.md when continuing current work
→ CONTEXT.md only when stable facts matter
→ affected source + nearest AGENTS.md
→ .agents/skills/development-brief/SKILL.md
→ at most one relevant engineering specialist
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad code search.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. current `docs/foundation/` policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. Git history / GitHub issues or PRs only when historical rationale can change the decision.

## Work Discipline

- Inspect the current owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before adding a layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Fixtures and samples are evidence, not generic product rules.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid.
- Never claim proof that was not obtained.
- When a repository change alters user-facing setup, current product status, capability boundaries, or the active test entrypoint, update the relevant `README.md` in the same change. Do not churn README files for internal changes that leave those facts unchanged.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence only.

**Codex local / Blockbench:** runtime/model/visual proof only when explicitly active and required.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades a live visual/runtime claim.

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains the default. Reference generation creates a visual brief, not geometry. Tool success is execution evidence, not visual fidelity. Reference judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing.

Reference generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`.

For `mcp/**`, `mcp/AGENTS.md` owns package-specific engineering rules.

## Canonical Owners

- detailed current flow → `docs/knowledge/flow.md`
- active continuation → `docs/knowledge/next-action.md`
- stable facts → `CONTEXT.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- current proof state → `docs/foundation/validation-report.md`
- durable policy → `docs/foundation/`
- local procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- historical rationale → Git history / GitHub issues and PRs

Do not recreate duplicate navigation, review archives, decision logs, roadmaps, or parallel planning/state systems in the active tree.
