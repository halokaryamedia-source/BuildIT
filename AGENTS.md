# Workspace Agent Routing

Read only the smallest context needed:

1. `CONTEXT.md`
2. `docs/knowledge/next-action.md`
3. the affected module note or `docs/foundation/` rule
4. `docs/knowledge/skills/activation-matrix.md` when choosing a workflow

Use `docs/knowledge/minimal-nav.md` only as the navigation index. Do not read
the whole vault at startup.

## Mode Selection

Infer the mode from the user's intent:

- unclear problem or idea: Plan;
- request to create or change: Developing;
- bug, review, cleanup, or upkeep: Maintenance.

The user can override this with `Plan:`, `Develop:`, or `Maintain:`. If the
mode is unclear and editing would be risky, use Plan first.

## Task Authority

The user's prompt is the task source. It defines intent but does not have to be
a complete technical specification. Normalize it before editing, then use
`docs/knowledge/next-action.md` as the single active-task snapshot. Update that
snapshot only when goal, scope, status, decision, blocker, verification, or next
step changes. Keep parallel work in the affected module's `.tmp/` or the task
board; do not turn Obsidian into a second tracker.

`CONTEXT.md` contains stable facts, not task state or skill routing. When sources
disagree, mark the conflict `Needs Validation` instead of choosing a fact
silently.

An empty snapshot is not a blocker: if the prompt is clear, infer the task and
update the snapshot after scope stabilizes. If the prompt is ambiguous, use Plan
and `Needs Validation`. If an old snapshot conflicts with the current prompt,
the current prompt wins.

## Prompt Assistance

A user prompt defines intent; it does not have to be a complete specification.
Before asking the user for more detail:

1. inspect the existing docs and source for facts that can be established;
2. preserve decisions that are already authoritative;
3. identify only unresolved decisions that materially change the result;
4. use the existing project pattern for low-impact ambiguity;
5. ask the user only for high-impact decisions, with a recommended default;
6. capture the resolved decision in its existing documentation owner.

For **Developing**, `development-brief` is the mandatory front door that performs
this normalization, detects the execution channel, chooses the Build and
Acceptance POVs, separates the goal from a suggested solution, and defines the
minimum useful proof before implementation begins.

Use lightweight GSD-style requirement discovery only when a prompt is missing
high-impact decisions or the scope has several plausible interpretations. Do
not install or create a second GSD planning tree, `.planning/` hierarchy, or
parallel state system in this repository.

## Source Precedence

- Runtime behavior: source code plus test/proof.
- Product/model policy: `docs/foundation/`.
- Agent behavior: this `AGENTS.md` and the nearest nested guidance.
- Skill routing: `docs/knowledge/skills/activation-matrix.md`.
- Active task: current user prompt, then `next-action.md`.
- Stable facts: `CONTEXT.md` unless contradicted by the source above.

Resolve conflicts instead of silently editing to match stale context.

## User-Facing Workflow

- Use plain language by default; explain technical terms in one short sentence
  when they are necessary.
- For an ambiguous request, ask only high-value questions about decisions that
  repository inspection cannot establish. Do not ask the user for facts that
  the repository can answer.
- For **Developing**, let `development-brief` produce the simple pre-work summary:

```text
Tujuan:
Cara berpikir:
Hasil yang dituju:
Tidak diubah:
Cara memastikan benar:
```

- For a trivial Developing task, compress that summary to one short line.
- For Plan or Maintenance, use the smallest equivalent context statement needed
  for the task; do not force the Developing brief format onto other modes.
- Keep detailed technical contracts internal unless they affect a user decision.
- If the request cannot be safely patched, say: `Ini bukan patch kecil karena
  ...` and explain whether the blocker is a requirement, data, platform
  capability, or unverified cause.

## Root-Cause Gate

Do not patch a symptom without evidence. Before changing code for an issue,
establish how it occurs, where it is caused, why the proposed change addresses
that cause, and how the result will be proved. If any part is missing, do not
guess, add an unverified fallback, or repeat the same patch; use `Perlu
pemeriksaan` or `Terhenti` and state the missing evidence.

## Behavioral Anti-Slop Guard

Apply these principles as baseline agent behavior; do not load a second
"Karpathy" skill just to repeat them:

- **Think before coding:** surface unresolved assumptions, inconsistencies, and
  meaningful tradeoffs before choosing an interpretation. Inspect discoverable
  facts instead of asking the user or guessing.
- **Simplicity first:** implement the minimum behavior that solves the proved
  problem. Do not add speculative flexibility, single-use abstractions, or
  impossible-case handling.
- **Surgical changes:** every changed line must trace to the declared goal.
  Avoid unrelated cleanup, formatting churn, or refactors outside scope.
- **Goal-driven execution:** define observable success criteria and a proof path
  before editing non-trivial behavior. A plausible implementation is not done
  until the relevant proof succeeds.

These guardrails provide the minimal/YAGNI baseline in every mode. Developing
does not load Ponytail as an extra skill on top of `development-brief` and any
specialist that is actually needed.

## User-Facing Result

Use `Selesai`, `Perlu pemeriksaan`, or `Terhenti` in the final report. Include
the result, actual proof, limitations, and exactly one next step. Technical
details are optional and should appear only when they help a decision or
debugging.

## Modes And Skill Budget

- **Plan:** use `ponytail`. Use GSD-style requirement discovery first only when
  high-impact requirements are genuinely unresolved. Add `domain-modeling` or
  `codebase-design` only for a real terminology or module-boundary problem.
- **Developing:** always use `development-brief`. Add one relevant specialist
  only when the implementation has a real specialist domain. The fast path may
  use `development-brief` alone for trivial changes where another skill adds no
  value. Never stack overlapping specialists.
- **Maintenance:** use `ponytail` plus the smallest diagnostic or specialist
  skill; keep fixes minimal and leave regression proof.
- **Critique / stress-test:** use `grilling` when the user asks to challenge a
  plan, decision, or idea. `grilling` is a decision-tree interview that looks
  for hidden assumptions before action; it is not a substitute for code review.
  Use `code-review` for implemented changes when critique adds value.

Discovery, grilling, review, evidence handling, and optional navigation
accelerators are conditional stages, not always-on layers to stack together.

## Context Contract

For Plan and Maintenance, keep the internal contract as small as the task
requires. For Developing, `development-brief` extends the contract with the
Build POV, Acceptance POV, execution channel, input authority, expected output,
acceptance criteria, and proof budget.

The baseline fields are:

```text
Goal:
In scope:
Out of scope:
Affected area:
Existing pattern reused:
Assumptions:
Validation:
```

The contract is the edit gate for low-risk, bounded work; manual approval is
not required when it is complete and no public contract, dependency, or
destructive operation changes.

## Execution Channels

BlockIT development must support both workflows:

- **ChatGPT → GitHub:** repository inspection and GitHub writes are available.
  Do not assume a local shell, Blockbench runtime, or local test execution.
- **Codex local:** local shell/build/test/runtime capabilities may be available.
  Verify availability before relying on them.

The repository and skill contract stay the same across both channels. Only the
available proof changes. Never convert an unavailable runtime check into a fake
GitHub validation step.

## Develop File Creation Gate

Before creating or moving a file during Develop:

- Search existing helpers, modules, tests, documentation, and canonical folders first.
- Create a new file only when the existing source cannot satisfy the need, its canonical owner is clear, it is within scope, and the reason is recorded in the Context Contract.
- Do not create README files, indexes, configs, abstractions, tests, caches, or folders for hypothetical future use.
- Keep temporary files in the affected module's `.tmp/`; remove them after the
  task and never create temporary folders at the workspace root.
- Keep build and generated output in the established output folders.

Use this decision order:

```text
Existing file/helper works?
→ reuse it.

Existing file needs a small extension?
→ extend it.

No suitable owner exists?
→ define the canonical owner before creating a file.

Only needed during execution?
→ use the affected module's .tmp/, then remove it.
```

## Skill Sources And Routing

The workspace skill files that are actually checked into the current `Local`
branch live under `mcp/.agents/skills/`. Older documentation that named
`mcp/workflow/skills/` is not proof that the missing directory exists. Do not
create a directory merely to satisfy stale documentation.

Currently checked in:

- Developing prompt/task normalization: `development-brief`
- MCP/server/tools/transports: `mcp-builder`
- TypeScript: `typescript-expert`
- Zod schemas: `zod`
- Bun: `bun-development`
- Blockbench plugin lifecycle/UI/runtime API: `blockbench-plugins`

Required workflow skills whose canonical Local copy is still being recovered:

- Blockbench modelling: `blockbench-use`
- Source Image to modelling brief: `reference-generator`
- Unsupported claims or repeated failure: `evidence-gate`

If a named skill is unavailable, state that fact and use the closest verified
Local rule; never silently simulate a missing skill. Use global/user skills from
their actual installed or upstream source when available. Use `skill-creator`
only when a skill itself is being created or updated.

Detailed triggers and the OpenSpec threshold live in
`docs/knowledge/skills/activation-matrix.md`.

## Optional Code Navigation Accelerator

CodeGraph may be used when it is already available and a task genuinely needs
cross-file structural discovery: unknown ownership, a call chain, dependency
flow, or blast-radius analysis.

- Start with one focused exploration question; do not broad-query the whole
  repository by default.
- Use normal targeted reads/search for known-file or small bounded changes.
- Treat graph output as navigation evidence only. Actual source, tests, and
  runtime proof remain authoritative.
- Do not use CodeGraph to judge Blockbench visual quality, modelling intent, or
  reference similarity.
- Do not install CodeGraph, commit `.codegraph/`, or add it as a project
  dependency automatically. Adoption requires a separate local trial because
  large graph responses can reduce remaining context headroom even when they
  reduce discovery tool calls.

CodeGraph is a tool accelerator, not another specialist skill, so it does not
increase the current mode's skill budget.

## Guardrails

- Inspect callers, helpers, types, patterns, and tests before changing shared
  code.
- Mark missing facts as `Needs Validation`; never turn an unverified guess into
  a requirement, API, type, or behavior.
- Do not activate every skill in a category; choose the narrowest match.
- Do not use TDD unless meaningful behavior or a bug needs a test.
- Treat `docs/knowledge/` as context and decisions, not the task tracker.
- Treat the task board as task/spec status; temporary files are not a tracker.
- Do not claim validation without running the relevant check.
- Do not add unrelated fixes, speculative abstractions, cosmetic tests, or
  documentation that duplicates an existing note.
- Do not add configuration, abstraction, dependency, fallback, test, CI step,
  fixture, or validation artifact merely for future protection or ceremony.
- Stop patch churn after the same approach fails twice; re-diagnose or state
  that the issue is not a small patch.

## Minimum Useful Proof

Validation must be proportional to risk **and** possible in the active execution
channel. Use the cheapest check that can disprove the likely failure, then stop
when the acceptance criteria have sufficient evidence.

- **Trivial text/docs/routing:** inspect the exact diff plus relevant paths/links.
- **Bounded source change through ChatGPT → GitHub:** inspect the changed source,
  directly affected callers/contracts, and existing GitHub checks only when they
  are already available and materially relevant. Do not invent local execution.
- **Bounded source change through Codex local:** start with one targeted check or
  reproduction. Add build/typecheck/test only when that boundary makes the check
  informative.
- **Public contract / serialization / destructive behavior:** require stronger
  proof before claiming completion; if the active channel cannot produce it,
  implement only when safe and report the exact remaining proof as
  `Perlu pemeriksaan`.
- **UI / Blockbench / visual behavior:** runtime or visual proof is required for
  a visual/runtime success claim. GitHub-only work may still prepare the change,
  but must not pretend static inspection proves the live result.
- **Cross-module change:** verify only the boundaries actually changed; do not
  run unrelated suites merely because the task spans files.

Do not repeat an unchanged test/build/check after it already established the
required proof. More validation is not automatically more confidence.

## Source Of Truth

- Product and operating policy: `docs/foundation/`
- Working context and decisions: `docs/knowledge/`
- Runtime implementation: source files under the affected module
- Skill routing: `docs/knowledge/skills/activation-matrix.md`
- Current checked-in workspace skills: `mcp/.agents/skills/`
