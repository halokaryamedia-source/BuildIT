# GitHub Rules — BlockIT

Canonical GitHub operating rules for AI/ChatGPT in this repository. Root and nearest `AGENTS.md` files may narrow domain behavior, but they must not weaken safety, integrity, proof, efficiency, history, security, or STOP boundaries.

`Local` is the working repository authority unless the user explicitly changes it.

## How to use this file

Apply Core Rules 1–7 in order. Conditional sections apply only when the current task touches that surface.

```text
PIN
→ READ MINIMUM
→ DIAGNOSE
→ TOOL + TRANSFER GATE
→ WRITE ONCE
→ VERIFY + FAILURE POLICY
→ STOP
```

# Core Rules

## 1. PIN — establish exact current authority

Before a material change, know the repository, intended ref, current HEAD when materially relevant, scope, and whether the target is writable.

- **`Local` is the working repository authority. Never silently fall back to another ref.**
- Direct branch/file fetch is current-state authority; search is discovery.
- Every supported write explicitly targets the intended ref.
- `main`, protected, production, release, archived, or read-only refs are not write targets without explicit authority.
- Replacement/deletion uses the current blob/content SHA from the exact target branch.
- Re-check HEAD only when concurrency is plausible or immediately before a final ref move that could overwrite newer work.
- Current source plus relevant proof outranks stale continuation prose.

## 2. READ MINIMUM — read only what can change the decision

After the Development continuity boot, default to:

```text
owner/source files   1–3
history reads        0
broad scans          0
```

The boot defined by root `AGENTS.md` may be reused within the same conversation/development session while repository, branch, GitHub Rules, and continuation authority have not materially changed. Do not reread the full boot set for each subtask merely for reassurance.

- Prefer direct fetch when the exact path is known.
- For a named MCP defect, use `docs/knowledge/implementation-map.md` before broad search.
- Open more only for a concrete unresolved question.
- Truncated, paginated, partial, or capped output is incomplete evidence, not proof of absence.
- Verify exact repository/ref/access once before concluding a missing target is absent.
- Read history only when rationale or regression origin can change the decision.

## 3. DIAGNOSE — fix the first wrong owner

Establish actual vs expected behavior before writing.

```text
requirement / policy / meaning wrong
→ semantic or policy owner

implementation wrong
→ implementation owner — IMPLEMENTATION REGRESSION

implementation correct + assertion stale
→ test owner — STALE TEST

implementation/test correct + CI routing wrong
→ workflow or repository policy — ROUTING FAILURE

runtime/toolchain unavailable
→ environment or capability owner — ENVIRONMENT FAILURE

requested proof missing
→ proof owner — PROOF FAILURE

derived artifact wrong
→ upstream canonical owner
```

- Do not widen maintenance into redesign.
- Do not perform unrelated cleanup, compatibility work, dependency upgrades, framework creation, or documentation synchronization unless required by the same logical outcome.
- CI failure is evidence to diagnose, not permission to change the easiest file.
- Historical TODOs, audits, interrupted candidates, and old experiments are inactive unless reproduced or explicitly reactivated.
- `No change required` is valid.
- Do not add routers, profiles, generic evaluators, alternate transports, persistent registries, compilers/planners, or generalized recovery systems without current evidence.

## 4. TOOL + TRANSFER GATE — choose a method that fits

ChatGPT and Codex/local workspaces are both valid development channels. Choose the simplest capability that can safely deliver the complete intended result.

```text
exact current file / branch state
→ direct GitHub fetch

one bounded UTF-8 file
+ complete current file available
+ one logical delivery
→ GitHub Contents API

coherent multi-file UTF-8 change authored in ChatGPT
+ complete final contents known
+ atomic history required
+ Git-data capability available
→ ChatGPT atomic Git delivery

precise patch iteration / local generator or build needed /
binary / Git LFS / filesystem-heavy work
→ local/Codex git workspace or another fitting capability

final payload cannot be carried safely
→ Manual Handoff

CI diagnosis
→ run → failing job/step → relevant log

Blockbench / browser / visual / local-runtime claim
→ matching runtime capability
```

### ChatGPT atomic Git delivery

Use low-level Git-data operations as an intentional delivery mechanism only after the complete coherent text change is ready.

```text
pin exact Local HEAD + base tree
→ fetch required exact owners
→ finish reasoning/coding before repository mutation
→ prepare all final replacement blobs
→ create one tree from the base tree
→ keep Local unchanged during preparation
→ re-check HEAD once before final movement when concurrency is plausible
→ create one categorized logical commit
→ fast-forward Local once
→ run relevant final verification
→ STOP
```

Requirements:

- Complete intended file set and final contents are known before the first Git object is created.
- Full-file replacement requires exact complete current content; never reconstruct unseen source from snippets.
- One logical change produces one reviewable commit, not candidate/checkpoint/retry commits.
- Unreferenced blobs/tree are allowed only as preparation for that already-complete delivery.
- If required generated artifacts, binaries, runtime outputs, or canonical generators are unavailable, return to this transfer gate before moving `Local`.

### Transfer prohibitions

Connector limitations must not change repository/product architecture.

Never use placeholders, temporary loaders, artificial fragments, base64 stand-ins, transfer-only manifests, temporary branches/workflows, alternate repository structures, generated wrappers, scratch files, or Git-object chains solely to bypass an unsupported payload.

Also:

- Never split `update_file`; it replaces the whole file.
- Keep blob/content SHA, commit SHA, tree SHA, ref, workflow-run ID, artifact ID, and job ID distinct.
- Low-level Git is valid for the bounded atomic-delivery contract above or genuine Git semantics; it is not an iterative scratch editor or retry strategy.
- Never force-push, rewrite history, destructive-reset, or change repository structure to work around stale state, CI failure, connector limits, or messy history.
- GitHub Actions is verification/deployment infrastructure, not a remote shell, source editor, or transfer engine.

### Manual Handoff

Use Manual Handoff only when direct repository delivery is unavailable, unsafe, materially slower, or harmful to history.

Provide the exact final file/package plus:

```text
repository
branch/ref
destination
action: upload | replace | merge | extract
expected result
current repository state
```

Do not claim repository presence until the artifact is actually uploaded.

## 5. WRITE ONCE — deliver one meaningful logical state

Before the first repository mutation:

```text
repo/ref/current state pinned
scope + owners final
complete final contents ready
no scratch/temporary paths
selected method carries whole delivery
expected relevant proof known

any NO
→ DO NOT WRITE
```

- One intentional write per file is the default; one logical task is one commit by default.
- Same-file/overlapping mutations are serial.
- For coherent multi-file work, know the full file set and hardest artifact before any ref movement.
- Do not partially synchronize a baseline that must remain coherent.
- A successful mutation response is usable current state; do not immediately refetch for reassurance.
- If HEAD moves materially, refetch affected state and rebuild from current authority.
- Keep one canonical owner per durable rule/state where practical.
- Update README/status/continuation/proof only when the state it owns actually changes.
- Preserve lockfiles, runtime/version constraints, and pinned action revisions unless they are the actual owner.
- New files, workflows, abstractions, fixtures, reports, branches, PRs, issues, comments, labels, and releases default to zero unless scope proves a need.
- Generated MCP API docs follow canonical source + generator; never hand-edit them to obtain green status.
- `Experimental/` evidence is not production capability or local-acceptance proof.

### Commit discipline

A commit is a categorized logical delivery, not a save, checkpoint, CI trigger, transfer experiment, or proof marker.

```text
prepare complete logical change
→ cheapest relevant pre-commit proof
→ review intended state/diff
→ one categorized logical commit
→ push/ref update once
→ relevant CI
→ STOP
```

Message format:

```text
<type>(<optional-scope>): <concise logical outcome>
```

Use `feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `build`, `release`, or bounded `chore`.

Split commits only for genuinely independent outcomes that can be reviewed/reverted separately. Never split by file, tool call, technical layer, discovery order, or transfer limitation. Do not rewrite published/shared history merely for aesthetics.

## 6. VERIFY + FAILURE POLICY — prove only what matters

Validation is evidence, not ceremony.

- Run the cheapest check that can falsify the changed claim.
- Use targeted checks during iteration.
- Use the full MCP suite once on the final logical state only when executable/public MCP contracts can actually be affected.
- Policy/routing/planning/status-only changes use only repository/static verification that owns those contracts.
- Only completed successful verification is PASS; queued, running, cancelled, skipped, neutral, or superseded is not PASS.
- On failure, inspect the failing job/step and relevant error before editing.
- Do not weaken or bypass a valid verifier merely to get green.
- Regression tests protect material recurring invariants, not cosmetic prose. Do not use exact natural-language wording as a test contract unless the exact string is machine-required.
- Static source/CI evidence proves only what it exercises. It does not prove live Blockbench behavior, visual fidelity, persistence, playback, browser behavior, deployment, or local runtime unless those actually ran.
- User-deferred live/local testing stays deferred until explicitly reactivated.

### Failure / retry matrix

| Failure | Action |
|---|---|
| Known capability mismatch / unsupported transfer | STOP method; **0 retries**; use fitting path |
| Permission/safety denial | STOP; **0 retries** unless condition changes |
| Capability genuinely uncertain | at most **1 bounded probe** |
| 422 malformed but valid method | correct once |
| 404 missing/inaccessible | verify exact repo/ref/target once |
| 409 stale/conflict | refetch current state once, then retry from it |
| 429 rate limit | respect retry/reset guidance |
| 5xx/timeout/unknown mutation | inspect target state before retry |
| Same-cause valid-method failure with new evidence | maximum **2 attempts** |

Transfer experimentation:

```text
strategy                 1 default; 2 maximum only if root limitation is removed
per valid method         <= 2 attempts / about 2 minutes
whole delivery           <= about 3 minutes active experimentation
```

Changing tools, encodings, branches, Git-object types, or representations does not reset the ceiling.

### Interrupted delivery

If current-task writes already occurred before a block, perform at most one bounded recovery pass: identify changed paths/commits, remove only accidental current-task artifacts when safe, preserve legitimate changes, disclose remaining state, then STOP or hand off. Never rewrite published history to hide an interrupted delivery.

## 7. STOP — completion is terminal

Stop when:

```text
requested outcome + relevant proof satisfied
→ STOP

confirmed capability mismatch + valid fallback/handoff delivered
→ STOP

authoritative permission/safety/policy boundary blocks the operation
→ report boundary → STOP
```

Do not automatically audit another layer, synchronize unrelated docs, run another verifier, create proof-of-proof, fix adjacent issues, create GitHub objects for ceremony, promote experimental behavior, resume deferred work, or continue because more tooling exists.

## Default efficiency budget

```text
continuity boot rereads             0 while reusable in-session
owner/source reads                  1–3 after boot
history reads                       0
broad scans                         0
uncertain-capability probe          <= 1
same-cause retry                    <= 2
capability-denial retry             0
transfer strategies                 1 default; 2 maximum
whole-delivery experiment           <= ~3 minutes
intentional writes/file             1
logical commits/task                1 by default
push/ref updates/task               1 by default
relevant CI                         0–1 per affected proof surface
placeholder/transfer hacks          0
adjacent cleanup                    0
high-impact mutations               0 unless explicitly authorized
```

# BlockIT repository boundaries

```text
continuation       → docs/knowledge/next-action.md
proof state        → docs/knowledge/current-validation.md
implementation     → docs/knowledge/implementation-map.md
asset continuity   → workspace/active/<project>/README.md
generated API docs → canonical MCP source + generator
research           → Experimental/
```

- `next-action.md` stores only continuation, blockers, deferrals, and the next meaningful repository action.
- `current-validation.md` owns current proof interpretation; static/CI evidence never upgrades live/visual proof.
- When the user defers source work or local testing, record cross-session deferral once when needed and stop.

# Conditional GitHub surfaces

## API failures and ambiguous mutations

Interpret 401 as authentication, 403 as permission/policy/rate-limit, 404 as missing/inaccessible/stale, 409 as conflict/stale state, 422 as invalid request/policy, 429 as rate limiting, and 5xx/timeout as potentially unknown mutation outcome. Rule 6 owns retry behavior.

Do not create request storms. After an unknown mutation outcome, inspect current target state before retry.

## Special files, generated artifacts, and large transfers

Distinguish regular UTF-8 files from symlinks, submodules, Git LFS pointers, generated artifacts, binaries, and files outside practical tool limits.

- Never hand-edit an LFS pointer as content.
- Do not rewrite symlinks/submodules/binaries through plain-text replacement unless that representation is intended.
- Generated artifacts follow canonical source and generator.
- Compression does not make an unsupported transfer method valid.

## Pull requests, protection, reviews, and merge queues

Before a high-impact PR/merge action, refresh current head/base, mergeability, required reviews/CODEOWNERS, checks, and deployment gates. Repository protection/rules are authority, not errors to bypass.

Branch/tag deletion, PR merge/close, release publication/deletion, environment bypass, settings/permission changes, and history-altering actions require explicit authority and an exact current target.

## GitHub Actions

- Workflows run only on intended events/paths their checks can falsify.
- Correctly skipped irrelevant workflows are not missing proof.
- Required-but-skipped checks are CI/ruleset routing defects, not reasons to change unrelated code.
- Verification workflows are read-only by default and do not commit back to `Local`.
- Do not create one-shot workflows to compensate for missing development/transfer capability.
- Use least-privilege permissions and preserve pinned/trusted action versions.
- Treat event-derived strings as untrusted input.
- Never execute untrusted PR code with secrets/write tokens through `pull_request_target` or privileged persistent runners.

### Approved `Experimental/` runtime exception

An explicitly user-approved bounded repository-owned experimental harness may use Actions as an ephemeral runtime when that runtime is the experiment under test. Keep it under `Experimental/`, read-only by default, bounded to repository-owned inputs, reproducible, artifact-only, and separate from production proof. Artifact existence is not visual approval.

## Sensitive data, releases, and environments

Never commit, paste, echo, or move secrets into source, workflows, issues, PRs, comments, logs, or docs. If protected data is discovered, report location/type without repeating the value. Release/deployment approval gates are authoritative and must not be bypassed.
