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
- **In scope:** audit one skill at a time for real function, overlap, name, and
  canonical location; recover only missing useful skills.
- **Out of scope now:** MCP feature changes, model-specific fixes, mass skill
  migration/rename, full GSD/OpenSpec frameworks, Claude-Mem, speculative
  architecture.

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

Keeps only Bun-specific tooling actually used by Local:

- `Bun.build` and build plugins;
- `Bun.file`, `Bun.write`, and `Bun.argv`;
- Bun-owned package scripts and `bunx`;
- dependency/lockfile behavior when Bun is the proved owner;
- Bun/Blockbench packaging compatibility.

Removed from the active skill:

- new Bun project scaffolding;
- HTTP/WebSocket/SQLite/password API examples;
- Node→Bun migration guidance;
- generic performance advice and broad test tutorials.

Normal MCP/TypeScript/Blockbench work does **not** load this specialist merely
because commands use Bun. The old `bun-development` package is retired.

## Current Skill Structure

### Root canonical

- `.agents/skills/development-brief/`
- `.agents/skills/mcp-server-development/`
- `.agents/skills/typescript-type-safety/`
- `.agents/skills/bun-tooling/`

### Nested copies pending one-by-one audit

- `blockbench-plugins` ← **next**
- `skill-creator`
- `vue-best-practices`

### Recovery items

- `blockbench-use`
- `reference-generator`
- `evidence-gate`

## Skill Audit Method

For each skill record:

```text
Current name:
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

- judge function, not upstream name;
- prefer fewer skills with clearer responsibility;
- do not merge distinct expertise merely to reduce count;
- do not retain content already covered by baseline policy or another owner;
- preserve upstream lineage in the decision log when renamed/merged;
- change one skill at a time.

## Remaining Work Sequence

1. **Audit `blockbench-plugins`** for its real Blockbench runtime/plugin API
   value, overlap with future modelling skill, duplicated `.github/skills/`
   copy, clearer name, and canonical location.
2. Audit `skill-creator` and `vue-best-practices` one by one.
3. Recover/audit `blockbench-use`, `reference-generator`, and `evidence-gate`.
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

Audit **`blockbench-plugins`**. Do not rename, merge, move, or delete it until
its actual runtime/plugin responsibility, overlap with modelling guidance, and
duplicate repository copies are understood.
