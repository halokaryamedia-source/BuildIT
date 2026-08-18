# GitHub Rules — BlockIT

Canonical operating rules for AI/ChatGPT working with GitHub in this repository. Root/nearest `AGENTS.md` may narrow domain behavior but never weaken safety, integrity, proof, history, security, or STOP boundaries.

## How to use this file

Apply Core Rules 1–7. Read a Conditional GitHub Surface only when the task touches it.

```text
PIN
→ READ MINIMUM
→ DIAGNOSE
→ TOOL FIT
→ WRITE ONCE
→ VERIFY MINIMUM
→ STOP
```

# Core Rules

## 1. PIN — establish exact current authority

Before a material change, know repository, intended ref, current HEAD, scope, and writability.

- `Local` is the working repository authority. Never silently fall back to another branch.
- `main`, protected, production, and release refs are read-only unless explicitly authorized.
- Every write targets the intended ref; direct branch/file fetch is current-state authority.
- Re-check HEAD when concurrent movement is plausible or immediately before an atomic ref move.
- Replacement/deletion uses the current blob/content SHA from the exact branch.
- Current source + relevant proof outranks stale continuation prose.

## 2. READ MINIMUM — read only what can change the decision

```text
owner/source files   1–3
history reads        0
broad scans          0
```

The Developing continuity boot is allowed. Otherwise:
- open more only for a concrete unresolved question;
- use `docs/knowledge/implementation-map.md` Hot-Path Defect Index for named MCP-tool defects;
- truncated/partial output is incomplete evidence, not absence;
- verify exact repo/ref/access once before concluding a target is missing.

## 3. DIAGNOSE — fix the first wrong owner

```text
requirement/policy wrong
→ semantic or policy owner

requirement correct + implementation wrong
→ implementation owner — IMPLEMENTATION REGRESSION

implementation correct + assertion stale
→ test owner — STALE TEST

implementation/test correct + CI routing wrong
→ workflow/policy — ROUTING FAILURE

implementation/test/routing correct + runtime unavailable
→ environment/capability — ENVIRONMENT FAILURE

requested proof missing
→ proof owner — PROOF FAILURE

generated artifact wrong
→ upstream canonical owner
```

- Do not widen Maintenance into redesign.
- CI failure is evidence to diagnose, not permission to edit the easiest file.
- Historical failures/TODOs are inactive unless reproduced or explicitly promoted.
- `No change required` is valid.
- Do not add routers, profiles, generic evaluators, compatibility layers, telemetry, alternate transports, or registries without current evidence.

## 4. TOOL FIT — use repository semantics that match the operation

```text
current branch / exact file
→ direct GitHub fetch

small bounded UTF-8 file + complete final contents
→ GitHub Contents API

coherent multi-file delivery / atomicity / large file / precise patch / binary
→ local/Codex git or known-safe atomic Git capability

CI diagnosis
→ run → failing job/step → exact relevant log

browser / Blockbench / visual / runtime claim
→ actual matching capability
```

Contents API is an authored-state mutation, never a scratch/probe/preflight mechanism. Never create placeholder/test files on `Local`.

For atomic connector work:

```text
pinned HEAD + base tree
→ create required blobs
→ create one tree
→ keep ref unchanged while blobs/tree are prepared
→ create one commit with pinned HEAD as parent
→ fast-forward intended ref once
```

- Exact full-blob replacement is valid when partial editing is unavailable; review the candidate diff before moving the ref.
- After one confirmed capability limitation, do not repeatedly probe equivalent DNS/download/CLI/transport routes without new evidence.
- Orphan blobs/trees/commits are valid preflight artifacts while the working ref stays unchanged.
- Public-schema work blocked only by a canonical generator may be prepared unreferenced; never hand-edit generated entries.

Hard stops:
- never full-replace from partial context;
- never split `update_file` into chunks;
- keep blob/content SHA, commit SHA, tree SHA, ref, workflow-run ID, artifact ID, and job ID distinct;
- never rewrite history to hide CI/tooling mistakes;
- permission/capability denial ends that operation unless new evidence changes it;
- do not reshape repository architecture merely for connector convenience.

## 5. WRITE ONCE — deliver meaningful repository state

Transaction gate:

```text
repo/ref/HEAD pinned
scope + owners final
complete final contents ready
no scratch/temporary paths
expected proof known

any NO → DO NOT WRITE
```

- One intentional write per file is the default, but WRITE ONCE does not mean COMMIT EVERY WRITE.
- Same-file/overlapping mutations are serial.
- Reuse successful mutation results as current state unless proof/concurrency requires refetch.
- Atomic multi-file work prepares blobs/tree first, re-checks HEAD, then moves the ref once.
- Keep one canonical owner per durable rule/state.
- Preserve lockfiles, version files, dependency constraints, and action revisions unless they are the proved owner.
- New files/workflows/branches/PRs/issues/reports default to zero unless the current scope proves a need.
- Generated MCP API docs follow their generator.
- `Experimental/` is isolated research evidence, not production capability.

### Commit discipline — history must remain meaningful

A commit is a categorized logical delivery, not a save/checkpoint/tool call/CI trigger.

```text
prepare complete logical change
→ cheapest relevant proof
→ review intended diff
→ one categorized logical commit
→ push/ref update once
→ relevant CI
→ STOP
```

Commit gate:

```text
one coherent outcome?
primary category clear?
intended file set complete?
message explains repository outcome?
reviewable/revertable as one unit?

any NO → DO NOT COMMIT YET
```

Message: `<type>(<optional-scope>): <concise logical outcome>`.

Categories: `feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `build`, `release`, `chore`.

- A `fix:` may include tests/docs that prove the same fix.
- Split only genuinely independent deliveries; never split by file/tool call/work order.
- Avoid vague history such as `update`, `changes`, `fix again`, `final`, `try`, or `misc`.
- Never rewrite published/shared history for aesthetics without explicit authority.

## 6. VERIFY MINIMUM — validation follows the claim

- Run the cheapest check that can falsify the changed claim.
- Targeted checks are default during iteration; full MCP verification is for executable/public contract changes.
- Only a completed successful run is PASS.
- Do not rerun unchanged checks or chase unrelated verifiers.
- On CI failure, inspect only the exact failing job/step/error first; the first useful failure should identify the invariant, owner, and expected condition.
- Do not weaken, delete, bypass, or broaden a valid test/workflow merely to get green.
- Same-cause retry budget: maximum 2 attempts, each requiring new evidence.
- Permission/capability denial retry budget: 0 without new evidence.
- Exact natural-language prose should not be a test contract unless the string is itself required.
- Static source/CI evidence proves only what it exercises. It does not prove Blockbench behavior, browser rendering, model quality, persistence, playback, visual fidelity, or deployment success unless those ran.

## 7. STOP — completion is a valid terminal state

When the requested outcome, acceptance criteria, and minimum proof are satisfied, stop. Do not automatically audit another layer, sync unrelated docs, create proof-of-proof, create branches/PRs/issues for ceremony, or continue because more tooling exists.

## Default efficiency budget

```text
owner/source reads        1–3 after continuity boot
history reads             0
broad scans               0
new files/workflows       0 unless required
new abstractions          0
intentional writes/file   1
logical commits/task      1 by default
CI-trigger commits        0
proof-only commits        0
push/ref updates/task     1 by default
relevant CI               0–1 per proof surface
same-cause retry          <= 2
capability-denial retry   0
adjacent cleanup          0
high-impact mutations     0 unless authorized
```

# Conditional GitHub Surfaces

## API failures, pagination, rate limits, and ambiguous mutations

```text
401        authentication problem
403        permission / policy / rate limit
404        missing OR inaccessible / stale target
409        conflict / stale state → refetch target
422        invalid request / policy failure
429        rate limited → respect retry/reset guidance
5xx/timeout mutation outcome may be unknown → inspect current state before retry
```

Do not create request storms. If mutation outcome is unknown, refetch target state first. Retry only after confirming the intended mutation is absent.

## Special files, Git LFS, binaries, submodules, and generated artifacts

Distinguish regular text from symlinks, submodules, Git LFS pointers, binaries, and generated artifacts.
- Never hand-edit an LFS pointer as large-file content.
- Do not rewrite symlinks/submodules/binaries as plain text unless intended.
- Generated artifacts follow canonical source/generator.

## Pull requests, branch protection, rulesets, reviews, and merge queues

- Refresh PR head/base, mergeability, required reviews/CODEOWNERS, checks, and environment gates before a high-impact action.
- New commits can stale approvals/check assumptions.
- Protection/rules/signatures/linear history/merge queues are authority, not errors to work around.
- Branch/tag deletion, PR merge/close, releases, environment bypass, settings/permission changes, and history-altering actions require explicit authority.
- Perform only the requested high-impact mutation.

## GitHub Actions

GitHub Actions is verification/deployment infrastructure, not a background development engine.

- Automatic workflows run only on intended events/paths.
- Correct skips are not missing proof.
- Prefer fail-fast when downstream checks are meaningless.
- Verification workflows use read-only repository permissions by default and do not push back to `Local`.
- Do not create temporary one-use workflows merely because another capability is missing.
- Do not rerun unchanged failed workflows merely to seek green.
- Use least privilege. Do not widen permissions, expose protected data, or switch credentials merely to pass CI.
- Preserve declared action/runtime versions unless version drift is the actual issue.
- For new third-party actions, use trusted sources and prefer immutable/pinned revisions; never move to `latest`, `main`, or `master` for convenience.
- Treat event-derived strings as untrusted input.
- `pull_request_target` is a security boundary; never run untrusted PR code with privileged secrets/write tokens.
- Never route untrusted PR code to a privileged or persistent self-hosted runner for convenience.

### Approved `Experimental/` runtime exception

A repository-owned, user-approved bounded experimental harness may use Actions as an ephemeral runtime when that runtime is the experiment. It is not a generic remote-execution surface.

For the on-demand Blockbench Web POC:
- keep harness/scripts/fixtures under `Experimental/`;
- use read-only repository permissions unless separately approved;
- expose bounded repository-owned inputs, never general code execution;
- pin Blockbench/browser/runtime revisions when reproducibility matters;
- write outputs to temporary workspace and GitHub Actions artifacts, not production source;
- terminate browser/server processes with the job;
- `.bbmodel`, PNG previews, logs, and proof metadata remain experimental;
- artifact existence is not visual approval; ChatGPT must retrieve and inspect relevant image evidence;
- runner failure does not authorize weakening MCP security or cloning production rendering;
- retain one stable reusable harness instead of per-run workflows.

## Sensitive data, releases, and deployment environments

- Do not place credentials/protected values in source, workflows, issues, PRs, comments, logs, or docs.
- Report affected location/type without repeating protected values.
- Redaction is not permission to print protected values.
- Release/deployment approval gates are authoritative constraints; do not bypass required reviewers/protection.
