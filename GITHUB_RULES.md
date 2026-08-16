# GitHub Rules

Universal operating rules for AI/ChatGPT working with a GitHub repository.

Read this file before any material GitHub read/write. Repository-specific `AGENTS.md` rules may narrow repository behavior, but they must not weaken the safety boundaries here.

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

## 1. PIN — establish exact current authority

Before a material change, know the repository, intended working branch/ref, current HEAD, requested scope, and whether the repository/target is writable.

- Use direct branch/file fetches for current state. Search is discovery, not current-state authority.
- Never silently fall back to the default branch.
- Every GitHub write must explicitly target the intended branch/ref when the tool supports it.
- Treat repository-designated default, protected, production, or release branches as read-only unless repository policy or explicit user instruction authorizes the write.
- An archived/read-only repository is not a write target. Do not search for a bypass.
- Re-check HEAD only when concurrent movement is plausible or immediately before a write that could overwrite newer work.
- For replacement/deletion, use the current blob/content SHA from the exact target branch. If GitHub rejects a stale SHA, refetch once and rebuild the intended final state; never guess or substitute another SHA type.

## 2. READ MINIMUM — read only what can change the decision

Default budget:

```text
owner files      1–3
history reads    0
broad scans      0
```

- Open more only when a concrete unresolved question requires it.
- Do not read history, review archives, generated output, or adjacent owners merely to feel safer.
- Search/list output that is truncated, paginated, partial, or capped is incomplete evidence, not proof that an item does not exist.
- Continue pagination or narrow a query only when the unseen portion can materially change the decision; do not exhaustively page through data by default.
- A `404` or missing search result can mean missing, stale ref, or inaccessible. Verify the exact repository/ref/access once before concluding absence; do not guess alternate branches or paths.

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
→ workflow / repository policy

derived artifact wrong
→ upstream canonical owner
```

- Do not widen Maintenance into redesign.
- Do not perform unrelated cleanup, refactors, compatibility work, documentation synchronization, dependency upgrades, or framework creation unless they block the requested result.
- CI failure is evidence to diagnose, not permission to change whatever is easiest.
- `No change required` is valid when current behavior already satisfies the requirement.

## 4. TOOL FIT — use a tool that natively fits the operation

```text
current branch / exact file state
→ direct GitHub fetch

small bounded UTF-8 edit + complete current regular file available
→ GitHub Contents API / update_file

large file / many precise hunks / coordinated multi-file refactor /
atomic multi-file change / binary / Git LFS / true patch semantics
→ Local or Codex-style git workspace with the required capability

CI diagnosis
→ run → failing job/step → exact relevant log

browser / audio / local runtime claim
→ actual matching capability
```

### Special files and Contents API

Before treating repository content as ordinary UTF-8 text, distinguish regular files from symlinks, submodules, Git LFS pointers, generated artifacts, binaries, and files outside the practical limits of the active API/tool.

- Never hand-edit a Git LFS pointer as though it were the large-file content.
- Do not rewrite a symlink/submodule/binary through a plain text replacement path unless that representation is explicitly the intended source.
- Generated/derived artifacts follow their canonical source; fix the source and regenerate unless repository policy explicitly defines the artifact as authored source.

### Hard stops

- Never full-replace a file from partial file context.
- Never split `update_file` into chunks. It replaces the whole file; it does not append or patch.
- Keep blob/content SHA, commit SHA, tree SHA, tag/ref, workflow-run IDs, and other GitHub identifiers distinct; use only the identifier required by the operation.
- Low-level Git blob/tree/commit/ref operations are not the default editor. Use them only when the task genuinely requires those semantics and the capability is known to be available.
- Force-push, history rewrite, destructive reset, or equivalent ref manipulation is never a workaround for stale SHA, CI failure, connector limits, or messy commit history.
- Permission, safety, or capability denial ends that operation immediately. Do not retry through Git gymnastics, helper files, temporary workflows, or branch switching.
- Do not use GitHub Actions as a remote shell or as a substitute for missing local/browser/audio/runtime capability.
- Do not change repository structure merely to make the connector easier to use.
- If the current channel cannot perform the change safely, report the required channel instead of forcing completion.

### API failure and rate-limit discipline

Classify failures before retrying:

```text
401        authentication problem
403        permission / policy / rate-limit investigation
404        missing OR inaccessible / stale target
409        conflict / stale state → refetch relevant state
422        invalid request / policy failure → fix request, do not repeat blindly
429        rate limited → respect Retry-After/reset before another request
5xx/timeout mutation outcome may be unknown → inspect current state before retry
```

- Do not create request storms or parallel mutation bursts.
- Respect GitHub retry/rate-limit signals instead of repeatedly probing.
- If a mutating request times out or returns an ambiguous server error, first refetch the target state. Retry only when the intended mutation is confirmed absent; this prevents duplicate branches, issues, comments, releases, or writes.

## 5. WRITE ONCE — write meaningful final state

Prepare the intended final state before the first write.

- One intentional write per file is the default.
- Same-file and overlapping repository mutations are serial, never parallel.
- Prefer one coherent logical change over chains of `try`, `rerun`, `trigger`, `sync`, or `final proof` commits.
- Do not create commits only to trigger CI, align proof, rerun a workflow, clean history, or make tooling easier to operate.
- Do not treat intermediate connector commits as independent milestones requiring separate validation.
- For a coordinated multi-file change, establish the intended complete patch before the first write. If HEAD moves materially during the change, refetch affected state and reassess; do not blindly overwrite, merge, or rebase around concurrent work.
- Keep one canonical owner for each durable rule/state where practical; do not copy the same contract across many docs and create synchronization cascades.
- Update status/continuity/release metadata only when the milestone, blocker, next meaningful objective, capability boundary, or actual release state changed—not after every micro-step.
- Preserve repository-declared lockfiles, runtime/version files, dependency constraints, and action references. Change versions/lockfiles only when dependency/version drift is the actual first wrong owner or the task explicitly requests the upgrade.
- New files, workflows, abstractions, compatibility layers, fixtures, reports, branches, PRs, issues, comments, labels, releases, and other persistent side effects default to zero unless the current task/repository workflow proves a real need.

## 6. VERIFY MINIMUM — validation follows the claim

Validation is evidence, not ceremony.

- Run the cheapest check that can falsify the changed claim.
- Targeted checks are the default during iteration.
- Use a full suite only when the changed executable/public contract can actually be affected and a final full gate is materially useful.
- When CI is relevant, prefer the relevant gate on the final logical state; do not treat an intermediate commit/run as final proof.
- A workflow that correctly does not trigger because changed paths are outside its scope is not missing technical proof. Do not manufacture unrelated changes merely to trigger it.
- If that skipped workflow is configured as a required merge check, a pending/missing required check is a CI/ruleset-routing problem, not a reason to change unrelated code.
- Path filters have platform limits and can be unreliable for very large diffs. For unusually large changes, do not infer correctness solely from the absence of a workflow run.
- Only a completed successful run is PASS. `queued`, `in_progress`, `pending`, `cancelled`, `skipped`, neutral, or superseded runs are not PASS.
- Superseded runs do not need to be waited on when a newer relevant run replaces them.
- Do not rerun unchanged checks or chase every verifier to green when they cannot falsify the current change.
- On CI failure, inspect the failing job/step and only the relevant error before editing.
- Do not weaken, delete, bypass, or broaden a valid test/workflow merely to obtain a green result. Change a test/workflow only when evidence shows it is itself the first wrong owner.
- Same-cause retry budget: maximum 2 attempts.
- Permission/capability denial retry budget: 0 unless new evidence changes the condition.
- Regression tests are for material, realistically recurring invariants—not every typo, one-time migration, cosmetic wording change, or temporary state.
- Do not use exact natural-language prose as a test contract unless the exact string itself is a machine requirement.
- Historical failures are not active work unless the current system still reproduces their root cause.
- Static inspection and CI prove only the contracts they actually exercise. They do not prove browser visuals, audio quality, local runtime behavior, installed-plugin freshness, deployment success, or other capabilities that were not actually executed.

### Pull requests and merge readiness

When a task actually involves a PR or merge decision:

- Refresh the PR's current head SHA, base branch, mergeability, required reviews/CODEOWNERS state, required checks, and relevant deployment/environment gates before the high-impact action.
- A new commit can make prior approvals/check assumptions stale. Do not act from an old PR snapshot.
- Required human review, CODEOWNERS approval, branch protection, rulesets, signed-commit requirements, linear-history rules, or deployment requirements are repository authority—not errors to bypass.
- If the repository uses a merge queue, required GitHub Actions must support the repository's merge-queue event/contract (for example `merge_group`) when necessary. Fix CI routing rather than bypassing the queue.

## GitHub Actions — verification, not development

GitHub Actions is verification/deployment infrastructure, not a background development engine.

### Trigger and execution discipline

- Automatic workflows run only on intended branches/events and paths their checks can actually falsify.
- Documentation, routing, planning, status, or unrelated Markdown changes do not justify a full executable suite unless a check explicitly owns them.
- Prefer fail-fast gates when downstream checks are meaningless after an upstream failure.
- Cancel superseded runs when repeated pushes can overlap and older results are no longer useful.
- Verification workflows are read-only by default: they do not commit or push back into the working branch.
- Publishing/release bundling is an explicit release action, not a side effect of every development push.
- Do not create temporary/one-shot workflows to compensate for a missing capability.
- Do not rerun an unchanged failed workflow merely to seek a green badge.
- Do not assume an event created by automation will always retrigger—or never retrigger—another workflow. Understand the event and credential (`GITHUB_TOKEN`, GitHub App token, PAT, etc.) semantics before designing automation.

### Permissions and supply-chain safety

- Use least-privilege `GITHUB_TOKEN`/workflow permissions. Verification is read-only unless a specific job genuinely requires write access.
- Do not widen workflow permissions, expose secrets, or switch credentials merely to make a failing workflow pass.
- Preserve repository-declared action versions. For newly introduced third-party actions, prefer trusted sources and immutable/pinned revisions where practical; never move to `latest` as an opportunistic CI fix.
- Treat issue/PR titles and bodies, branch names, labels, commit messages, workflow inputs, and other event-derived strings as untrusted input. Do not interpolate untrusted values directly into privileged shell/script code; pass them through safe environment/argument handling.

### Privileged events, forks, and runners

- Treat `pull_request_target` and similar base-context privileged workflows as a security boundary. Never execute or checkout untrusted PR code in a privileged secret/write-token context without an explicitly safe design.
- Fork PRs may intentionally lack secrets or write tokens. Do not weaken secret/token policy merely to make fork CI green.
- Do not route untrusted PR code to a privileged/persistent self-hosted runner merely to gain capabilities unavailable on GitHub-hosted runners. Runner trust and cleanup are security boundaries.

## Repository governance and safety

Repository rulesets, branch protection, CODEOWNERS/review requirements, merge queue, environments/deployment protection, and permission policy are authoritative constraints.

- Never disable, weaken, bypass, or rewrite governance merely to finish the current task unless changing that governance is itself explicitly requested and justified.
- Force-push/history rewrite, branch/tag deletion, pull-request merge/close, release/tag publication or deletion, environment/deployment bypass, repository settings changes, permission/ruleset changes, and similar destructive or externally visible mutations require explicit task authority and an exact current target.
- Perform only the requested high-impact mutation. Do not create, merge, close, publish, delete, bypass, or reconfigure GitHub objects as cleanup, ceremony, proof, or workaround.
- Environment/release/deployment approval gates are not ordinary CI failures. Do not bypass reviewers or protection rules for convenience.

### Secrets

- Never commit, paste, echo, or move secrets such as API keys, access tokens, passwords, private keys, authorization headers, or `.env` credentials into source, workflows, issues, pull requests, comments, logs, or documentation.
- If a secret is discovered, do not reproduce its value. Report only the affected location/type and treat exposure as a security issue.
- Masking/redaction in logs is not a reason to print a secret intentionally.

## 7. STOP — completion is a valid terminal state

When the requested outcome, relevant acceptance criteria, and minimum relevant proof are satisfied, stop.

Do not automatically:

- audit another layer;
- synchronize unrelated documentation;
- run another verifier;
- create proof-of-proof;
- fix adjacent non-blocking issues;
- create branches/PRs/issues/comments merely to document work already completed;
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
repository side effects   0 unless required
high-impact mutations     0 unless explicitly authorized
```

Exceed a budget only when the current task provides concrete evidence that more work is necessary.
