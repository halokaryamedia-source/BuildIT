# Workspace Agent Routing

Current intent owns the task; current source and relevant proof own behavior.

## GitHub Operating Discipline

For ChatGPT ↔ GitHub work, use this sequence and stop when it is satisfied:

```text
PIN
→ READ MINIMUM
→ DIAGNOSE
→ TOOL FIT
→ WRITE ONCE
→ VERIFY MINIMUM
→ STOP
```

This section is the canonical repository-working discipline. Domain sections below only narrow it; they do not add extra ceremony.

### 1. PIN — establish current authority

Before a material repository change, know the repository, working branch, current HEAD, and requested scope.

- Use direct branch/file fetches for current state; search is for discovery, not authority.
- Work on the branch explicitly owned by the task. Do not silently fall back to the default branch.
- Do not repeatedly poll HEAD. Re-check only when concurrent movement is plausible or immediately before a material write that could overwrite newer work.

### 2. READ MINIMUM — load only what can change the decision

Start from the smallest authoritative path.

- Root rules + current continuation when relevant + the smallest likely owner are enough by default.
- Default read budget: **1–3 owner files, 0 history reads, 0 broad repository scans**.
- Open Git history, review archives, secondary indexes, or additional owners only when a concrete unresolved question requires them.
- Current source beats stale documentation/history. `No change required` is valid.

### 3. DIAGNOSE — find the first wrong owner

Before writing, establish what is actually wrong and where the correction belongs.

```text
meaning / requirement wrong
→ semantic owner

meaning correct + implementation wrong
→ implementation owner

implementation correct + test stale
→ test

implementation/test correct + CI routing wrong
→ workflow

derived artifact wrong
→ upstream canonical owner
```

- Maintenance does not become redesign because adjacent issues are visible.
- Do not perform unrelated cleanup, compatibility work, refactors, framework creation, or documentation synchronization unless they block the requested result.
- Do not write while still guessing at the cause.

### 4. TOOL FIT — use the channel that natively fits the operation

Tool availability is a constraint, not a challenge to work around.

```text
current branch / exact file state
→ direct GitHub fetch

small bounded UTF-8 edit + complete current file available
→ GitHub Contents API / update_file

large file / many precise hunks / coordinated multi-file refactor /
atomic multi-file requirement / binary work / true patch semantics
→ Local or Codex-style git workspace

CI diagnosis
→ run → failing job/step → exact relevant log

Blockbench / browser / audio / local runtime claim
→ the actual matching capability
```

Hard stops:

- never full-replace a file from partial file context;
- never split `update_file` into chunks; it replaces the whole file, it does not append or patch;
- keep blob/content SHA, commit SHA, and tree SHA distinct;
- a permission, safety, or capability denial ends that operation immediately; do not retry it through Git gymnastics, helper files, or temporary workflows;
- do not change repository structure merely to make the connector easier to use;
- if the current channel cannot do the work safely, report the required channel instead of forcing completion.

### 5. WRITE ONCE — commit meaningful state, not thought steps

Prepare the intended final state before the first write.

- One intentional write per file is the default. Same-file writes are serial, never parallel.
- Prefer one coherent logical change over chains of `try`, `rerun`, `trigger`, `sync`, or `final proof` commits.
- Do not create commits only to trigger CI, align proof, rerun a workflow, or make the connector easier to operate.
- Do not treat intermediate connector commits as independent milestones that each require validation.
- Update README/current-state documentation only when the user-facing setup, current capability boundary, active test entrypoint, milestone, blocker, or next meaningful objective actually changed.
- New files, workflows, abstractions, persistent reports, and compatibility layers default to **zero** unless the current requirement proves a durable need.

### 6. VERIFY MINIMUM — validation follows the claim

Validation is evidence, not ceremony.

- Run the cheapest check that can falsify the changed claim.
- Targeted checks are the default during iteration. Use a full suite only when the changed executable/public contract can actually be affected and a final full gate is materially useful.
- Do not rerun unchanged checks or chase every verifier to green when they cannot falsify the current change.
- CI failure means `diagnose first`, not `edit first`: inspect the failing job/step and only the relevant error, then identify the first wrong owner.
- Same-cause retry budget: **maximum 2 attempts**. A permission/capability denial has **0 retries** unless new evidence changes the condition.
- Regression tests are for material, realistically recurring invariants—not every typo, one-time migration, cosmetic wording change, or temporary state.
- Do not use exact natural-language prose as a test contract unless the exact string itself is a machine requirement.
- Historical failures are not active work unless the current system still reproduces their root cause.

### GitHub Actions rules

GitHub Actions is verification infrastructure, not a background development engine.

- Automatic workflows run only on the working branch and paths their checks can actually falsify.
- Documentation, routing, planning, status, or unrelated Markdown changes do not justify a full executable suite unless a check explicitly owns them.
- Prefer fail-fast gates when downstream checks are meaningless after an upstream failure.
- Cancel superseded runs when repeated pushes can overlap.
- Verification workflows are read-only: they do not commit or push back into the working branch.
- Publishing/release bundling is an explicit release action, not a side effect of every development push.
- Do not create one-shot test/publish workflows to compensate for a missing local capability.
- Do not rerun an unchanged failed workflow merely to seek a green badge.

### 7. STOP — completion is a valid terminal state

When the requested outcome, relevant acceptance criteria, and minimum relevant proof are satisfied, **stop**.

Do not automatically:

- audit another layer;
- synchronize unrelated documentation;
- run another verifier;
- create proof-of-proof;
- fix adjacent non-blocking issues;
- continue because more tooling is available.

Use evidence labels only when material uncertainty remains:

```text
CURRENT-PROJECT VERIFIED
OFFICIALLY VERIFIED
LOCAL PROOF REQUIRED
UNSUPPORTED
UNKNOWN
```

Source/CI proof never upgrades a live Blockbench/model/visual/runtime claim.

### Default efficiency budget

```text
owner reads               1–3
history reads             0
new files                 0
new workflows             0
new abstractions          0
intentional writes/file   1
relevant CI               0–1
same-cause retry          <= 2
capability-denial retry   0
adjacent cleanup          0
```

Exceed a budget only because the current task produces concrete evidence that more work is necessary—not because extra work feels safer.

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
→ named workspace package when persistent
→ .agents/skills/blockit-bedrock-entity-mcp/SKILL.md
→ only the active modelling/texturing/animation specialist
→ BlockIT MCP
```

For persistent work, `workspace/active/<project>/README.md` owns asset continuity. Read only that package and needed current files; never scan all active projects. Stored paths/prose are not visual evidence.

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

## Product Boundary

Minecraft Bedrock Entity (`bedrock`) remains the default. Reference generation creates a visual brief, not geometry. Tool success is execution evidence, not visual fidelity. Reference judgement uses `FAIL / UNVERIFIED / PASS`; `BLOCKED` is valid when continuation would require guessing.

Reference generation → `blockbench-reference-generator`; modelling judgement → `blockbench-bedrock-modelling`; texture/PBR → `blockit-bedrock-texturing`; animation → `blockit-bedrock-animation`.

For `mcp/**`, `mcp/AGENTS.md` owns package-specific engineering rules.

## Canonical Owners

- detailed current flow → `docs/knowledge/flow.md`
- repository/plugin continuation → `docs/knowledge/next-action.md`
- active asset continuity → `workspace/active/<project>/README.md`
- saved/parked assets → `workspace/saved/`
- asset workspace rules → `workspace/README.md`
- stable facts → `CONTEXT.md`
- source/tool ownership → `docs/knowledge/implementation-map.md`
- current proof state → `docs/foundation/validation-report.md`
- durable policy → `docs/foundation/`
- local procedure → `docs/knowledge/operations/local-acceptance-runbook.md` only when explicitly reactivated
- historical rationale → Git history / GitHub issues and PRs

Do not recreate duplicate navigation, review archives, decision logs, roadmaps, or parallel planning/state systems in the active tree.
