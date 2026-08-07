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

The user's prompt is the task source. Normalize it into the Context Contract,
then use `docs/knowledge/next-action.md` as the single active-task snapshot.
Update that snapshot only when goal, scope, status, decision, blocker,
verification, or next step changes. Keep parallel work in the affected
module's `.tmp/` or the task board; do not turn Obsidian into a second tracker.

`CONTEXT.md` contains stable facts, not task state or skill routing. When
sources disagree, mark the conflict `Needs Validation` instead of choosing a
fact silently.

An empty snapshot is not a blocker: if the prompt is clear, infer the task,
write the Context Contract, and update the snapshot after scope stabilizes. If
the prompt is ambiguous, use Plan and `Needs Validation`. If an old snapshot
conflicts with the current prompt, the current prompt wins.

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
- For an ambiguous request, ask at most three high-value questions about the
  goal, expected result, and constraints. Do not ask the user for facts that
  repository inspection can establish.
- Before editing, show this short contract in user language:

```text
Tujuan:
Yang akan dikerjakan:
Yang tidak akan diubah:
Risiko atau hal yang belum pasti:
Cara pemeriksaan:
```

- Keep the detailed internal Context Contract for agent reasoning.
- If the request cannot be safely patched, say: `Ini bukan patch kecil karena
  ...` and explain whether the blocker is a requirement, data, platform
  capability, or unverified cause.

## Root-Cause Gate

Do not patch a symptom without evidence. Before changing code for an issue,
establish how it occurs, where it is caused, why the proposed change addresses
that cause, and how the result will be proved. If any part is missing, do not
guess, add an unverified fallback, or repeat the same patch; use `Perlu
pemeriksaan` or `Terhenti` and state the missing evidence.

## User-Facing Result

Use `Selesai`, `Perlu pemeriksaan`, or `Terhenti` in the final report. Include
the result, actual proof, limitations, and exactly one next step. Technical
details are optional and should appear only when they help a decision or
debugging.

## Modes

- **Plan:** use `ponytail`; use `domain-modeling` or `codebase-design` only
  when triggered by unstable terminology or an unclear module seam; use
  `grilling` only when the user explicitly asks to stress-test a decision.
- **Developing:** use `ponytail` and exactly one relevant workspace skill;
  validate before review.
- **Maintenance:** use `ponytail` and the smallest task-specific skill; keep
  fixes minimal and leave regression proof.

## Context Contract

Before editing, state:

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

## Local Skill Routing

- MCP/server/tools/transports: `mcp/workflow/skills/mcp-builder`
- TypeScript: `mcp/workflow/skills/typescript-expert`
- Zod schemas: `mcp/workflow/skills/zod`
- Bun: `mcp/workflow/skills/bun-development`
- Blockbench modelling: `mcp/workflow/skills/blockbench-use`
- Blockbench plugins: `mcp/workflow/skills/blockbench-plugins`
- Reference generation: `mcp/workflow/skills/reference-generator`
- Unsupported claims or repeated failure: `mcp/workflow/skills/evidence-gate`
- Skill packaging: global `skill-creator`

## Guardrails

- Inspect callers, helpers, types, patterns, and tests before changing shared
  code.
- Mark missing facts as `Needs Validation`; never turn an unverified guess into
  a requirement, API, type, or behavior.
- Do not activate every skill in a category; choose the narrowest match.
- Do not use TDD unless meaningful behavior or a bug needs a test.
- Treat `docs/knowledge/` as context and decisions, not the task tracker.
- Treat the task board as task/spec status; temporary files are not a tracker.
- If a named skill is unavailable, say so and continue with the closest local
  skill; do not simulate that skill silently.
- Do not claim validation without running the relevant check.
- Do not add unrelated fixes, speculative abstractions, cosmetic tests, or
  documentation that duplicates an existing note.
- Do not add configuration, abstraction, dependency, or fallback merely for
  future protection.
- Stop patch churn after the same approach fails twice; re-diagnose or state
  that the issue is not a small patch.

## Risk-Based Proof

- Trivial text/config: inspect the diff and check paths/links.
- Branch, loop, parser, transform, or schema: run a targeted test/check.
- Public API, tool, or resource: build/typecheck and validate the contract.
- UI: build and perform visual/manual verification.
- Bug fix: reproduce before the fix and prove the regression is covered.
- Cross-module change: validate each boundary, then review the change.

## Source of Truth

- Product and operating policy: `docs/foundation/`
- Working context and decisions: `docs/knowledge/`
- Runtime implementation: source files under the affected module
- Workspace-specific skill guidance: `mcp/workflow/skills/`
