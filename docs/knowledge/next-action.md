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
- modelling/geometry/visual-validation policy is generic, object-agnostic, and
  whole-form-first;
- reference handoff now matches whole-form modelling and no longer contains the
  stale first-Cube/support/section/overlap rules;
- ChatGPT → GitHub vs Codex local proof boundaries are explicit;
- mandatory review/broad validation ceremony was removed.

## Completed Skill Audits / Recoveries

### 1. `mcp-builder` → `mcp-server-development`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical: `.agents/skills/mcp-server-development/SKILL.md`

### 2. `typescript-expert` → `typescript-type-safety`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical: `.agents/skills/typescript-type-safety/SKILL.md`

### 3. `zod` → merged into `mcp-server-development`

**Decision:** `MERGE + DROP`.

### 4. `bun-development` → `bun-tooling`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical: `.agents/skills/bun-tooling/SKILL.md`

### 5. `blockbench-plugins` → `blockbench-runtime-development`

**Decision:** `RENAME + MOVE + SLIM + DEDUP`.

Canonical: `.agents/skills/blockbench-runtime-development/SKILL.md`

Runtime mechanics and modelling judgement are separate owners.

### 6. nested `skill-creator`

**Decision:** `DROP`.

Use the available global/user capability only when creating or materially
revising a skill.

### 7. `vue-best-practices` → merged into `blockbench-runtime-development`

**Decision:** `MERGE + DROP`.

Standalone Vue 3 application tooling is not a separate Local domain.

### 8. `blockbench-use` lineage → `blockbench-bedrock-modelling`

**Decision:** `RECOVER + RENAME + SLIM`.

Canonical: `.agents/skills/blockbench-bedrock-modelling/SKILL.md`

Trusted historical source was established from repository history. The old
`blockbench-use` skill was a broad mandatory orchestrator, and the related
historical `blockbench-modeling` skill mixed Cuboid and freeform/mesh workflows.
Neither package is restored literally.

Recovered capability:

- whole-form Bedrock modelling judgement;
- primary/secondary Cuboid geometry;
- silhouette/proportion/contact correction;
- hierarchy/pivots for actual asset needs;
- geometry-vs-texture decisions;
- UV/texture scope and required animation;
- visual/model completion for an editable `.bbmodel`.

Explicitly not recovered:

- multi-skill loading/orchestration;
- generic Hytale/PBR/mesh routing;
- mandatory outline/texture pre-flight dumps;
- fixed mutation-count checkpoints;
- first-Cube/support/section/overlap construction rules;
- per-Cube/per-section screenshot ceremony.

`blockbench-bedrock-modelling` owns **what model should be built and whether it
is visually coherent**. `blockbench-runtime-development` owns **how Blockbench
runtime operations execute**.

## Current Skill Structure

### Root canonical

- `.agents/skills/development-brief/`
- `.agents/skills/mcp-server-development/`
- `.agents/skills/typescript-type-safety/`
- `.agents/skills/bun-tooling/`
- `.agents/skills/blockbench-runtime-development/`
- `.agents/skills/blockbench-bedrock-modelling/`

### Legacy nested locations

There are currently **no active skills** under `mcp/.agents/skills/` or
`mcp/.github/skills/`. Do not repopulate those locations by default.

### Recovery items

- `reference-generator` ← **next**
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

1. **Recover/audit `reference-generator`** from proven lineage. Determine whether
   it deserves a canonical project skill, a clearer contextual name, or should
   remain a separate Reference Generator surface/workflow. Do not invent an
   exact historical package if one cannot be established.
2. Recover/audit `evidence-gate` and decide whether it remains a distinct
   conditional capability or is better absorbed into baseline proof rules.
3. Re-check the final activation matrix for overlap/context cost.
4. Audit MCP implementation against the cleaned modelling workflow and identify
   only proven runtime gaps.
5. Implement bounded fixes through ChatGPT → GitHub.
6. Final Codex local phase: launch root `BuildIT`, run Blockbench/MCP, perform
   targeted local proof, and fix only demonstrated failures.
7. Validate modelling across multiple object archetypes before generic release
   claims.

## Update Rule

Before ending material work, update this file only when active goal, status,
completed boundary, blocker/proof state, or next step changed. Git history and
the decision log preserve the past.

## Next Step

Recover and audit **`reference-generator`**. First establish its proven lineage
and current workflow boundary; do not assume that an old skill name/package is
the correct canonical Local form.
