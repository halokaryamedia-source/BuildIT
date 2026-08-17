# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## Branch and boot

- `Local` is the working authority; never silently use another ref. `main` changes only on explicit user request.
- Choose the smallest sufficient boot. Material GitHub work follows `GITHUB_RULES.md`.

### Observe / recover context

For read-only `amati`, inspect, understand, audit, or context recovery:

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ smallest needed owner
→ report → STOP
```

Do not edit, run CI, advance `next-action`, activate local acceptance, start an experiment, or execute a recorded next step unless the user also asks to continue/change something.

### Repository / Plugin Work

```text
AGENTS.md
→ GITHUB_RULES.md Core Rules
→ CONTEXT.md
→ docs/knowledge/next-action.md
→ .agents/skills/development-brief/SKILL.md
→ affected source + nearest AGENTS.md
→ at most one useful engineering specialist
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` **Hot-Path Defect Index** before broad code search.

### Bounded Maintenance

A concrete bug, stale rule, CI-routing defect, or behavior-preserving cleanup may start from the exact defect/owner when stable context cannot change the decision. Fix the first wrong owner; do not widen Maintenance into redesign.

## Task Class First

### Reference Preparation

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ readiness → one Draft → visual gate → user approval
```

### Asset Authoring

```text
current request / actual approved reference
→ named workspace package when persistent
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ active modelling/texturing/animation specialist
→ BlockIT MCP
```

`workspace/active/<project>/README.md` owns persistent asset continuity.

For normal asset authoring, **do not automatically load** `CONTEXT.md`, `docs/knowledge/next-action.md`, `development-brief`, Git history, secondary indexes, or the foundation set. Asset authoring is not software **Developing** merely because a model changes. Do not route it through `development-brief` unless repository/plugin behavior changes.

## GitHub Work

`GITHUB_RULES.md` owns branch/ref authority, tool fit, atomic delivery, history, CI/API/security, retries, experimental Actions, and STOP behavior. One coherent multi-file change stays one logical commit.

## Source Precedence

1. current user instruction;
2. current source + relevant runtime/visual proof;
3. root/nearest `AGENTS.md`;
4. current `docs/foundation/` policy;
5. `docs/knowledge/next-action.md`;
6. `CONTEXT.md`;
7. Git history/issues/PRs only when rationale can change the decision.

If `next-action.md` disagrees materially with current source/state, verify the current owner, reconcile the stale record, then continue from actual state.

## Work Discipline

- Inspect the owner/caller/pattern before shared changes.
- Make the minimum complete change; reuse before adding a layer.
- Do not broaden scope because adjacent issues are visible.
- No fallback/framework/profile/compatibility layer without proved need.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is valid. Never claim proof not obtained.
- Update README/status/continuity only when its owned state changed.

## Execution / Proof

**ChatGPT → GitHub:** repository/source/docs/CI evidence. An approved bounded `Experimental/` Actions job may provide browser/runtime artifacts only for what it executes.

**Codex local / Blockbench desktop:** local runtime/model/visual proof only when explicitly active and required.

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades a live visual/runtime claim. Artifact existence is not visual approval until the image is inspected.

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains default. Tool/file/coordinate success is not visual fidelity.

For `mcp/**`, `mcp/AGENTS.md` owns package-specific engineering rules.

## Canonical Owners

- GitHub execution/history/CI/security → `GITHUB_RULES.md`
- product flow → `docs/knowledge/flow.md`
- repository continuation → `docs/knowledge/next-action.md`
- active asset continuity → `workspace/active/<project>/README.md`
- stable facts → `CONTEXT.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- proof state → `docs/foundation/validation-report.md`
- durable policy → `docs/foundation/`
- local procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- experimental research → `Experimental/`

Do not create duplicate navigation, review archives, decision logs, roadmaps, or parallel planning/state systems.
