# GitHub Rules — BlockIT

Canonical operating rules for ChatGPT/AI working with GitHub in this repository. Root and nearest `AGENTS.md` files may narrow domain behavior, but they must not weaken repository integrity, proof boundaries, or STOP rules here.

Apply this file for material GitHub work. Normal asset authoring through BlockIT MCP is not repository development merely because a model changes.

```text
PIN
→ READ MINIMUM
→ DIAGNOSE
→ TOOL FIT
→ PREPARE COMPLETE CHANGE
→ ATOMIC WRITE
→ VERIFY RELEVANT CLAIM
→ STOP
```

## 1. PIN — exact authority first

- `Local` is the working repository authority unless the user explicitly names another ref.
- Never silently fall back to the default branch. Every supported write must explicitly target the intended branch/ref.
- Before a material change, know the repository, current `Local` HEAD, requested scope, current owner, and whether the target is writable.
- Direct branch/file fetch is current-state authority. Search is discovery only.
- Current source plus relevant proof outranks stale continuation prose. If `next-action.md` and current source materially disagree, reconcile the stale owner before continuing.
- Replacement/deletion uses the current content/blob SHA from the exact target ref. Never substitute a commit/tree/ref/workflow ID for a blob/content SHA.
- A stale-state conflict means refetch affected current state and rebuild the intended final change. Force update/history rewrite is not a recovery method.

## 2. READ MINIMUM — only evidence that can change the decision

Default repository/plugin boot:

```text
AGENTS.md
→ this file
→ docs/knowledge/next-action.md when continuing current repository work
→ CONTEXT.md only when stable facts matter
→ nearest AGENTS.md
→ affected owner + primary regression owner
```

For a named MCP-tool defect, use `docs/knowledge/implementation-map.md` Hot-Path Defect Index before broader discovery.

Default budget:

```text
owner/source reads   1–3
history reads        0
broad scans          0
```

Open more only when a concrete unresolved question requires it. Truncated, paginated, capped, missing, or inaccessible search output is not proof of absence.

## 3. DIAGNOSE — change the first wrong owner

```text
requirement/policy wrong
→ semantic/policy owner

requirement correct + implementation wrong
→ implementation owner

implementation correct + regression assertion stale
→ test owner

source/test correct + CI routing wrong
→ workflow owner

generated artifact wrong
→ upstream source/generator owner
```

- Establish actual vs expected behavior before editing.
- Do not turn Maintenance into redesign.
- Do not add routers, profiles, compatibility layers, generic evaluators, telemetry systems, alternate transports, or framework layers unless the current requirement proves they are needed.
- CI failure is evidence to diagnose, not permission to edit the easiest file.
- Historical failures/TODOs are not active work unless reproduced or explicitly promoted by current user intent.
- `No change required` is valid.

## 4. TOOL FIT — use repository semantics that match the operation

```text
current branch / exact file
→ direct GitHub fetch

one small bounded UTF-8 file + one logical delivery
→ Contents API create/update

coherent multi-file logical delivery / commit atomicity matters /
large or precise patch / binary / coordinated refactor
→ known-safe atomic Git operation or local/Codex git workspace

CI diagnosis
→ run → failing job/step → exact relevant log

runtime/model/visual claim
→ environment that actually executes that claim
```

For ChatGPT connector work, a coherent multi-file BuildIT change must not become one repository commit per file merely because Contents API calls are convenient. When atomicity matters and the low-level Git capability is available, use the safe sequence:

```text
pinned HEAD + base tree
→ create required blobs
→ create one tree from the base tree
→ create one commit with pinned HEAD as parent
→ fast-forward Local ref once
```

Rules:

- Prepare the complete intended file set before creating the commit.
- Same-file/overlapping mutations are serial, never parallel.
- Low-level blob/tree/commit/ref operations are for genuine atomic-delivery semantics, not the default editor for single-file work.
- Never full-replace a file from partial context.
- `update_file` replaces the complete file; it is not append/patch semantics.
- Force-push, destructive reset, history rewrite, branch switching, or temporary Git gymnastics are never connector workarounds.
- Permission/capability denial ends that operation unless new evidence changes the condition.

## 5. WRITE ONCE — meaningful state and history

Prepare the intended logical result before the first repository commit.

- One intentional write per file is the default; one categorized logical commit per task is the default.
- A commit is a reviewable/revertable outcome, not a save, checkpoint, tool call, CI trigger, or proof marker.
- Split commits only for genuinely independent outcomes that can land/revert separately.
- Do not split by file, directory, discovery order, or tool call.
- Reuse successful mutation responses and returned identifiers as current state. Do not immediately refetch the same state for reassurance.
- Routine task branches/PRs/issues/comments/labels default to zero. Work directly on `Local` unless the user or repository policy explicitly requests another delivery path.
- Update `next-action.md`, validation/status docs, or README only when the active boundary, blocker, capability, user-facing setup, test entrypoint, or next meaningful objective actually changed.
- Generated MCP API docs are derived. Change their source owner and regenerate; never hand-edit generated entries.
- `Experimental/` is isolated research space. Content there does not become production capability or accepted local proof merely because it exists or CI ran.

Commit messages use the logical repository outcome:

```text
feat:      new capability
fix:       wrong behavior/regression
docs:      documentation/policy-only
refactor:  internal restructuring without intended behavior change
test:      regression-contract-only
ci:        CI/workflow routing/execution
build:     build/dependency/toolchain
chore:     bounded maintenance only when no clearer category fits
```

Avoid vague history such as `update`, `changes`, `fix again`, `final`, `try`, or `misc`.

## 6. VERIFY RELEVANT CLAIM — evidence, not ceremony

- Use the cheapest check that can falsify the changed claim.
- Targeted checks are the default during iteration.
- For `mcp/**` public/runtime contract work, follow `mcp/AGENTS.md`: targeted regression first, then the official full gate when the changed contract can materially affect it.
- Documentation/policy/routing-only changes do not prove or require live Blockbench behavior.
- Only completed successful checks are PASS. Queued, running, cancelled, skipped, neutral, or superseded runs are not PASS.
- On CI failure, inspect the exact failing job/step and relevant error before editing.
- Do not rerun unchanged failures merely to seek green status.
- Do not weaken/delete/bypass a valid test or workflow to make CI pass unless evidence proves that verifier itself is the first wrong owner.
- Same-cause retry budget: at most 2 attempts with new evidence.
- Permission/capability denial retry budget: 0 without new evidence.
- Static source/CI evidence never upgrades a live Blockbench/model/visual claim that was not actually executed.

## 7. GitHub Actions — BuildIT-specific boundary

GitHub Actions is verification infrastructure and may also host an explicitly approved **bounded experimental job** when the experiment itself requires a reproducible ephemeral execution environment.

Normal MCP verification:

- verification workflows are read-only by default;
- use least-privilege token permissions;
- do not auto-commit/push generated verification results back to `Local`;
- preserve declared action/dependency/runtime versions unless version drift is the actual problem;
- do not create commits merely to trigger CI;
- do not use Actions as a generic remote shell or background development engine.

`Experimental/` on-demand Blockbench Web POC exception:

- the workflow may start an ephemeral browser/Blockbench Web runtime because that runtime is the experiment under test;
- keep model authoring scripts/fixtures bounded and repository-owned; do not expose arbitrary shell/eval as a product interface;
- pin external Blockbench/runtime revisions where reproducibility matters;
- runner writes outputs to temporary workspace and GitHub Actions artifacts, not automatically into production source;
- browser/server processes terminate with the job;
- generated `.bbmodel`, PNG previews, logs/proof metadata remain experimental evidence until explicitly promoted;
- artifact existence is not visual approval; ChatGPT must actually retrieve/inspect the relevant image before a visual claim is upgraded;
- failure of the experimental runner does not authorize weakening MCP production security or creating a custom renderer clone.

## 8. STOP — completion is terminal

When requested scope, acceptance criteria, and minimum relevant proof are satisfied, stop.

Do not automatically:

- audit another layer;
- fix adjacent non-blocking issues;
- synchronize unrelated docs;
- add proof-of-proof;
- create branches/PRs/issues/comments for ceremony;
- run unrelated CI;
- promote experimental behavior into production;
- continue simply because more tools are available.

## Default efficiency budget

```text
owner/source reads        1–3
history reads             0
broad scans               0
new abstractions          0 unless required
intentional writes/file   1
logical commits/task      1 by default
intermediate commits      0
CI-trigger commits        0
proof-only commits        0
push/ref updates/task     1 by default
relevant CI               0–1
same-cause retry          <= 2
adjacent cleanup          0
high-impact mutations     0 unless explicitly authorized
```

Exceed a budget only when concrete current evidence requires it.
