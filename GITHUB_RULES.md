# GitHub Rules

Universal operating rules for AI/ChatGPT working with a GitHub repository.

Read this file before any material GitHub write. Repository-specific `AGENTS.md` rules may narrow repository behavior, but they must not weaken the safety boundaries here.

## Default workflow

```text
PIN
→ READ MINIMUM
→ DIAGNOSE
→ TOOL FIT
→ WRITE ONCE
→ VERIFY MINIMUM
→ STOP
```

## 1. PIN — use the current repository state

Before a material change, know the repository, working branch, current HEAD, and requested scope.

- Use direct branch/file fetches for current state.
- Search is for discovery, not current-state authority.
- Never silently fall back to the default branch.
- Re-check HEAD only when concurrent movement is plausible or immediately before a write that could overwrite newer work.

## 2. READ MINIMUM — read only what can change the decision

Default budget:

```text
owner files      1–3
history reads    0
broad scans      0
```

Open more only when a concrete unresolved question requires it. Do not read history, review archives, generated output, or adjacent owners merely to feel safer.

## 3. DIAGNOSE — fix the first wrong owner

Before writing, establish actual vs expected behavior and identify the first owner that is wrong.

```text
requirement / meaning wrong
→ semantic owner

requirement correct + implementation wrong
→ implementation owner

implementation correct + test stale
→ test

implementation/test correct + CI routing wrong
→ workflow

derived artifact wrong
→ upstream canonical owner
```

Do not widen Maintenance into redesign. Do not perform unrelated cleanup, refactors, compatibility work, documentation synchronization, or framework creation unless they block the requested result.

## 4. TOOL FIT — use a tool that natively fits the operation

```text
current branch / exact file state
→ direct GitHub fetch

small bounded UTF-8 edit + complete current file available
→ GitHub Contents API / update_file

large file / many precise hunks / coordinated multi-file refactor /
atomic multi-file change / binary work / true patch semantics
→ Local or Codex-style git workspace

CI diagnosis
→ run → failing job/step → exact relevant log

browser / audio / local runtime claim
→ actual matching capability
```

Hard stops:

- Never full-replace a file from partial file context.
- Never split `update_file` into chunks. It replaces the whole file; it does not append or patch.
- Keep blob/content SHA, commit SHA, and tree SHA distinct.
- Permission, safety, or capability denial ends that operation immediately. Do not retry through Git gymnastics, helper files, or temporary workflows.
- Do not change repository structure merely to make the connector easier to use.
- If the current channel cannot perform the change safely, report the required channel instead of forcing completion.

## 5. WRITE ONCE — write meaningful final state

Prepare the intended final state before the first write.

- One intentional write per file is the default.
- Same-file writes are serial, never parallel.
- Prefer one coherent logical change over chains of `try`, `rerun`, `trigger`, `sync`, or `final proof` commits.
- Do not create commits only to trigger CI, align proof, rerun a workflow, or make tooling easier to operate.
- Do not treat intermediate connector commits as independent milestones requiring separate validation.
- New files, workflows, abstractions, compatibility layers, fixtures, reports, and persistent state default to zero unless the current requirement proves a durable need.

## 6. VERIFY MINIMUM — validation follows the claim

Validation is evidence, not ceremony.

- Run the cheapest check that can falsify the changed claim.
- Targeted checks are the default during iteration.
- Use a full suite only when the changed executable/public contract can actually be affected and a final full gate is materially useful.
- Do not rerun unchanged checks or chase every verifier to green when they cannot falsify the current change.
- On CI failure, inspect the failing job/step and only the relevant error before editing.
- Same-cause retry budget: maximum 2 attempts.
- Permission/capability denial retry budget: 0 unless new evidence changes the condition.
- Regression tests are for material, realistically recurring invariants—not every typo, one-time migration, cosmetic wording change, or temporary state.
- Do not use exact natural-language prose as a test contract unless the exact string itself is a machine requirement.
- Historical failures are not active work unless the current system still reproduces their root cause.

## GitHub Actions

GitHub Actions is verification infrastructure, not a background development engine.

- Automatic workflows run only on the working branch and paths their checks can actually falsify.
- Documentation, routing, planning, status, or unrelated Markdown changes do not justify a full executable suite unless a check explicitly owns them.
- Prefer fail-fast gates when downstream checks are meaningless after an upstream failure.
- Cancel superseded runs when repeated pushes can overlap.
- Verification workflows are read-only: they do not commit or push back into the working branch.
- Publishing/release bundling is an explicit release action, not a side effect of every development push.
- Do not create temporary/one-shot workflows to compensate for a missing capability.
- Do not rerun an unchanged failed workflow merely to seek a green badge.

## 7. STOP — completion is a valid terminal state

When the requested outcome, relevant acceptance criteria, and minimum relevant proof are satisfied, stop.

Do not automatically:

- audit another layer;
- synchronize unrelated documentation;
- run another verifier;
- create proof-of-proof;
- fix adjacent non-blocking issues;
- continue because more tooling is available.

## Default efficiency budget

```text
owner reads               1–3
history reads             0
broad scans               0
new files                 0
new workflows             0
new abstractions          0
intentional writes/file   1
relevant CI               0–1
same-cause retry          <= 2
capability-denial retry   0
adjacent cleanup          0
```

Exceed a budget only when the current task provides concrete evidence that more work is necessary.
