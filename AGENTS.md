# Workspace Agent Routing

This repository is the project memory. Chat history is useful context, but it is
never the authority for project state.

## Mandatory Boot

At the start of every BuildIT session, whether ChatGPT → GitHub or Codex local:

1. read `CONTEXT.md` for stable facts;
2. read `docs/knowledge/next-action.md` for the single active task/state;
3. read only the relevant `docs/foundation/` rule or affected source;
4. read `docs/knowledge/skills/activation-matrix.md` only when selecting a
   workflow/skill.

Use `docs/knowledge/minimal-nav.md` as the navigation index. Do not broad-scan
the vault, archives, generated output, dependencies, or old chats by default.

## Session Continuity

A new session must resume from repository state before asking the user to
reconstruct previous work.

- `CONTEXT.md` owns stable facts and terminology.
- `docs/knowledge/next-action.md` owns the current goal, status, blockers,
  completed boundary, and next step.
- `docs/knowledge/decision-log.md` owns durable decisions and why they were made.
- `docs/foundation/` owns durable product/modelling policy.
- source + relevant proof own actual runtime behavior.

Before ending a material task, update `next-action.md` when goal, status,
blocker, proof state, or next step changed. Record a durable decision only when
its reason must survive future sessions.

Do not ask the user to repeat old context that can be recovered from these
owners. If the current user instruction conflicts with stored project state,
the current instruction wins as task intent, but reconcile the conflict instead
of silently rewriting history.

## Mode Selection

Infer mode from intent:

- unclear problem or idea → **Plan**;
- create/change request → **Developing**;
- bug/review/cleanup/upkeep → **Maintenance**.

The user may explicitly override the mode. If editing would be risky and the
mode is genuinely unclear, use Plan first.

## Prompt Assistance

The user's prompt defines intent, not necessarily a complete specification.
Before asking the user for more detail:

1. inspect docs/source for discoverable facts;
2. preserve already-authoritative decisions;
3. identify only unresolved decisions that materially change the result;
4. use the existing project pattern for low-impact ambiguity;
5. ask only high-impact decisions, with a recommended default;
6. capture the resolved decision in its existing owner.

Use lightweight GSD-style discovery only when high-impact ambiguity remains
after inspection. Do not create a second `.planning/` hierarchy or parallel
state system.

## Independent Judgment

The user owns the **goal**. The agent is responsible for the quality and safety
of the **method**.

Do not agree with a proposed method merely because the user requested it. Reject
or redirect a method when available evidence shows that it is technically
invalid, contradicts an authoritative decision, repeats a disproven approach,
adds disproportionate complexity, creates unsupported behavior, or is likely to
reduce product/output quality.

When rejecting a method:

1. state the concrete reason in plain language;
2. identify the evidence or project rule behind the objection;
3. recommend the smallest better path that still serves the user's goal.

Do not be oppositional about harmless preferences or equally valid choices.
Challenge the method only when doing so materially protects the result.

## Source Precedence

- Current task intent: current user instruction.
- Runtime behavior: source code + relevant proof.
- Product/model policy: `docs/foundation/`.
- Agent behavior: root/nearest `AGENTS.md`.
- Skill routing: `docs/knowledge/skills/activation-matrix.md`.
- Active task state: `docs/knowledge/next-action.md`.
- Stable facts: `CONTEXT.md` unless contradicted by a higher authority.

Material conflicts are `Needs Validation`; never choose silently.

## Developing Front Door

Every Developing task uses `.agents/skills/development-brief/SKILL.md`.

`development-brief` must:

- separate the real goal from a suggested solution;
- detect ChatGPT → GitHub vs Codex local execution;
- determine whether development is actually necessary;
- choose Build POV and Acceptance POV after owner discovery;
- isolate fixtures/examples from generic requirements;
- define expected output, minimal scope, 2–5 provable acceptance criteria, and
  the minimum useful proof;
- re-check the same contract before completion.

Add at most one specialist when it provides real domain value. A trivial fast
path may use `development-brief` alone. Never stack overlapping specialists.

## Mode Skill Budget

- **Plan:** `ponytail`; add `domain-modeling` or `codebase-design` only for a
  real domain/module-boundary problem.
- **Developing:** mandatory `development-brief`; add at most one relevant
  specialist when useful.
- **Maintenance:** `ponytail` + the smallest diagnostic/specialist that owns the
  failure.
- **Critique:** `grilling` for a plan/decision/idea when adversarial scrutiny is
  requested or clearly needed before commitment.

`code-review`, `evidence-gate`, GSD-style discovery, OpenSpec, and CodeGraph are
conditional escalations, not default layers.

Detailed triggers live in `docs/knowledge/skills/activation-matrix.md`.

## Execution Channels

The same project contract supports both workflows:

### ChatGPT → GitHub

Repository reads/writes are available. Do not assume a local shell, Blockbench
runtime, local skill installation, or arbitrary local test execution.

Static repository work may prepare a runtime change. If the material claim
requires live Blockbench/MCP proof, report the exact remaining local proof rather
than inventing a GitHub substitute.

### Codex local

Local shell/build/test/runtime capabilities may be available. Verify availability
before relying on them. Run only checks that materially test the changed
boundary.

The goal, scope, POVs, and acceptance criteria do not change between channels;
only the available proof changes.

## Root-Cause And Edit Gate

Before changing behavior, establish:

- what actually happens;
- where the relevant owner/cause is;
- why the proposed change addresses that cause;
- what proof can falsify the change.

If a cause/contract is still unknown, do not patch around it. Use `Perlu
pemeriksaan` or `Terhenti` and state the missing evidence.

Before creating or moving a file:

- search existing owners/helpers/tests/docs first;
- reuse or extend before creating;
- create only when the canonical owner is clear and the file is required now;
- do not create README/index/config/cache/test/fallback/abstraction for a
  hypothetical future need;
- keep temporary files in the affected module's `.tmp/` and remove them after
  use.

## Anti-Slop Baseline

- Think before coding; surface assumptions and tradeoffs.
- Prefer the minimum complete solution.
- Every changed line must trace to the declared goal.
- Do not widen scope because adjacent issues are visible.
- Do not turn a fixture, Golden Sample, or named object into generic policy.
- Do not add compatibility/fallback layers without a proved need.
- Do not produce repeated cosmetic patch churn instead of fixing the owner.
- Stop the same failed direction after two attempts without new evidence.
- `No change required` is a valid result.
- Never claim a check, runtime result, or visual approval that was not actually
  obtained.

Karpathy-style simplicity/surgical-change principles are baseline behavior; do
not load another duplicate skill for them.

## Minimum Useful Proof

Validation is evidence, not ceremony. Use the cheapest check that can disprove
the likely failure, then stop when the acceptance criteria have enough evidence.

- **Text/docs/routing:** exact diff + relevant paths/links.
- **ChatGPT → GitHub bounded source change:** changed source + directly affected
  callers/contracts; use existing GitHub checks only when already available and
  directly relevant.
- **Codex local bounded source change:** one targeted check/reproduction first;
  add build/typecheck/test only when that boundary makes the check informative.
- **Public/destructive contract:** require stronger proof before claiming full
  completion; unavailable material local proof remains `Perlu pemeriksaan`.
- **Blockbench/UI/visual behavior:** live/runtime/visual proof is required for a
  live/visual success claim. Static inspection can prepare but cannot prove it.
- **Cross-module:** verify only boundaries that actually changed.

Do not create tests, CI, fixtures, screenshots, builds, or validation artifacts
solely to look rigorous. Do not re-run an unchanged check after it already
established the required evidence.

## User-Facing Communication

Keep reports simple and decision-oriented. Explain decisions, not internal
machinery.

For non-trivial Developing work, show:

```text
Tujuan:
Cara berpikir:
Hasil yang dituju:
Tidak diubah:
Cara memastikan benar:
```

For trivial work, one short line is enough.

Final report:

```text
Status: Selesai | Perlu pemeriksaan | Terhenti
Hasil:
Bukti:
Batasan:
Next step:
```

Use exactly one next step. Do not narrate the full process unless requested.

## Skill Locations During Consolidation

- `.agents/skills/` = repository-wide skills discoverable from root `BuildIT`.
  `development-brief` is canonical here.
- `mcp/.agents/skills/` = existing MCP/module specialist skill copies pending
  one-by-one naming/overlap/location audit.

Because Codex is launched from root `BuildIT`, repository-wide skills belong at
`.agents/skills/`. Until each MCP specialist is audited/migrated, load its
`mcp/.agents/skills/<skill>/SKILL.md` directly when routing requires it; do not
pretend nested specialist auto-discovery from root has already been proven.

Current MCP specialists still present there include `mcp-builder`,
`typescript-expert`, `zod`, `bun-development`, and `blockbench-plugins`.
Recovery items remain `blockbench-use`, `reference-generator`, and
`evidence-gate` until verified.

## Source Of Truth

- stable facts/terminology → `CONTEXT.md`;
- active continuation state → `docs/knowledge/next-action.md`;
- durable decisions/reasons → `docs/knowledge/decision-log.md`;
- product/modelling policy → `docs/foundation/`;
- workflow map → `docs/knowledge/flow.md`;
- skill routing → `docs/knowledge/skills/activation-matrix.md`;
- actual behavior → affected source + relevant proof.
