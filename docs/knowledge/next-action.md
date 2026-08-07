# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session must
read this after `AGENTS.md` and `CONTEXT.md` and continue from here instead of
asking the user to reconstruct prior chats.

## Active Task

- **Goal:** consolidate BlockIT skills into a small, clear, non-overlapping set
  before MCP implementation work begins.
- **Status:** `SKILL_CONSOLIDATION`.
- **Execution now:** ChatGPT → GitHub.
- **Final runtime environment later:** Codex local from root `BuildIT` with
  Blockbench + MCP.
- **In scope:** recover/audit only missing useful skills now that existing nested
  skill copies have been fully audited.
- **Out of scope now:** MCP feature changes, model-specific fixes, mass skill
  recreation, full GSD/OpenSpec frameworks, Claude-Mem, speculative architecture.

## Continuation Contract

- `AGENTS.md` → working rules and independent judgment.
- `CONTEXT.md` → stable facts/terminology.
- this file → active goal/status/completed boundary/next step.
- `decision-log.md` → durable decisions/reasons.
- `docs/foundation/` → durable product/modelling policy.
- source + relevant proof → runtime truth.

Do not ask the user to repeat old context before reading these owners.

## Development Baseline

- ChatGPT → GitHub prepares design/source/docs with static evidence only.
- Codex local performs final targeted shell/MCP/Blockbench proof only when the
  claim requires it.
- Developing always starts with `.agents/skills/development-brief/SKILL.md`.
- Add at most one specialist when it adds real domain value.
- `no change required` is valid.
- use minimum useful proof, not validation ceremony.
- reject/redirect user-suggested methods when evidence shows they are invalid,
  disproven, unnecessarily complex, unsupported, or harmful to output quality.

## Completed Foundation Hardening

- repository state is explicit project memory across ChatGPT/Codex sessions;
- foundation modelling/geometry/visual-validation policy is generic,
  object-agnostic, and whole-form-first;
- historical support-first/section-first/per-cube/Zebra-specific gates were
  removed from product policy;
- ChatGPT → GitHub vs Codex local proof boundaries are explicit;
- mandatory review/broad validation ceremony was removed.

## Completed Skill Audits

### 1. `mcp-builder` → `mcp-server-development`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical: `.agents/skills/mcp-server-development/SKILL.md`

Keeps the BlockIT MCP server/public-contract boundary and removes generic MCP
server scaffolding/evaluation baggage.

### 2. `typescript-expert` → `typescript-type-safety`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical: `.agents/skills/typescript-type-safety/SKILL.md`

Keeps only genuine TypeScript type-system expertise. Normal `.ts`
implementation does not load this specialist.

### 3. `zod` → merged into `mcp-server-development`

**Decision:** `MERGE + DROP`.

Zod remains the MCP input-schema implementation mechanism, but schema semantics
are owned by the MCP public-contract specialist instead of a separate skill.

### 4. `bun-development` → `bun-tooling`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical: `.agents/skills/bun-tooling/SKILL.md`

Keeps only Bun-specific build/tooling used by Local. Generic Bun project,
runtime migration, unrelated APIs, and performance/tutorial baggage were removed.

### 5. `blockbench-plugins` → `blockbench-runtime-development`

**Decision:** `RENAME + MOVE + SLIM + DEDUP`.

Canonical: `.agents/skills/blockbench-runtime-development/SKILL.md`

Keeps only the Blockbench runtime/plugin boundary. Runtime mechanics and
modelling judgement are separate owners. Duplicate `.agents`/`.github` copies
were removed.

### 6. nested `skill-creator`

**Decision:** `DROP`.

No root replacement is created. The nested package was generic skill-authoring
guidance with no BlockIT-only behavior. Use the available global/user
`skill-creator` capability only when creating or materially revising a skill.

### 7. `vue-best-practices` → merged into `blockbench-runtime-development`

**Decision:** `MERGE + DROP`.

The old skill targeted standalone Vue 3 concerns (`vue-tsc`, Volar,
`defineModel`, Pinia/router, SSR/HMR, SFC patterns) that are not a separate
BlockIT domain.

The only useful Local behavior now lives in `blockbench-runtime-development`:
follow existing embedded panel/component patterns, keep reactive state local when
sufficient, clean subscriptions/listeners through the existing lifecycle, and do
not introduce Vue application architecture/tooling without an explicit need.

The old `mcp/.agents/skills/vue-best-practices/` package is retired.

## Current Skill Structure

### Root canonical

- `.agents/skills/development-brief/`
- `.agents/skills/mcp-server-development/`
- `.agents/skills/typescript-type-safety/`
- `.agents/skills/bun-tooling/`
- `.agents/skills/blockbench-runtime-development/`

### Legacy nested locations

There are currently **no active skills** under `mcp/.agents/skills/` or
`mcp/.github/skills/`. Do not repopulate those locations by default.

### Recovery items

- `blockbench-use` ← **next**
- `reference-generator`
- `evidence-gate`

## Skill Audit Method

For each recovered skill lineage record:

```text
Historical/current name:
Actual function:
Trigger:
Unique value:
Overlap:
Best name:
Best location:
Decision: KEEP | RENAME | MERGE | MOVE | DROP | RECOVER
Migration cost / compatibility note:
```

Rules:

- recover trusted behavior, not historical naming/layout blindly;
- prefer fewer skills with clearer responsibility;
- do not merge distinct expertise merely to reduce count;
- do not retain content already covered by baseline policy or another owner;
- preserve lineage and durable reasoning in the decision log;
- recover one capability at a time.

## Remaining Work Sequence

1. **Recover/audit `blockbench-use`** from its trusted historical source. Separate
   modelling judgement from `blockbench-runtime-development`, align it with the
   current whole-form-first/object-agnostic foundation, choose a contextual name,
   and keep only modelling behavior that adds real value.
2. Recover/audit `reference-generator` from proven lineage; do not invent an
   exact historical package if one cannot be established.
3. Recover/audit `evidence-gate` and decide whether it remains a distinct
   conditional capability or is better absorbed into baseline proof rules.
4. Re-check the final activation matrix for overlap/context cost.
5. Audit MCP implementation against the cleaned modelling workflow and identify
   only proven runtime gaps.
6. Implement bounded fixes through ChatGPT → GitHub.
7. Final Codex local phase: launch root `BuildIT`, run Blockbench/MCP, perform
   targeted local proof, and fix only demonstrated failures.
8. Validate modelling across multiple object archetypes before generic release
   claims.

## Update Rule

Before ending material work, update this file only when active goal, status,
completed boundary, blocker/proof state, or next step changed. Git history and
the decision log preserve the past.

## Next Step

Recover and audit **`blockbench-use`**. First establish the exact trusted
historical source and compare it with the current foundation/modelling boundary;
do not copy or rename it blindly.
