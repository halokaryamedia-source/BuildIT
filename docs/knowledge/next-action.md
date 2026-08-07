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
- **In scope:** resolve the last missing capability (`evidence-gate`), then run a
  final overlap/context-cost pass across the cleaned routing.
- **Out of scope now:** MCP feature changes, model-specific fixes, mass skill
  recreation, full GSD/OpenSpec frameworks, Claude-Mem, speculative architecture.

## Continuation Contract

- `AGENTS.md` → working rules and independent judgment.
- `CONTEXT.md` → stable facts/terminology.
- this file → active goal/status/completed boundary/next step.
- `decision-log.md` → durable decisions/reasons.
- `docs/foundation/` → durable product/modelling/reference policy.
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
- reference handoff matches whole-form modelling and no longer contains stale
  first-Cube/support/section/overlap rules;
- Reference Generator quality requires buildable Minecraft/Blockbench form, not
  smooth realism with pixel treatment or generic voxel filtering;
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

The old mandatory orchestrator and broad mesh/Hytale/PBR/tool-catalog behavior
were not restored. The recovered specialist owns modeller judgement for the
Bedrock `.bbmodel`; runtime mechanics remain separate.

### 9. Reference Generator lineage → foundation workflow

**Decision:** `RECOVER AS WORKFLOW; NO ROOT SKILL`.

Proven lineage:

- `Rework/engines/chatgpt/skills/blockbench-reference-studio/SKILL.md`;
- first tracked version was the ChatGPT Blockbench reference skill;
- later revisions moved from a multi-sheet package to a single Reference Visual
  workflow.

No tracked `.agents/skills/reference-generator/` or
`.agents/skills/blockbench-reference-generator/` package was found, so those
names are not treated as recovered historical skill identities.

Canonical owner:

`docs/foundation/04-reference-guide.md`

Current boundary:

```text
Image-capable ChatGPT / Reference Generator
Source Image + request
→ five-view Modelling Brief Draft
→ quality gate
→ user approval
→ approved Modelling Brief

Codex + blockbench-bedrock-modelling
approved Modelling Brief
→ actual Cuboid modelling
→ .bbmodel
```

Preserved:

- Golden Sample supplies construction/presentation language, never target anatomy;
- same buildable subject/construction across all views;
- actual Minecraft/Blockbench Cuboid visual language rather than smooth realism,
  pixel-skin-only output, generic voxel filtering, or uniform cube stacking;
- one Draft plus at most one evidence-driven targeted correction;
- simple metadata and honest handoff.

Not restored:

- multi-sheet technical package;
- manifest/schema/hash/crop/region/writer-lease machinery;
- three routine approval gates;
- mandatory ZIP;
- reference-authored Cube transforms or image calibration.

No `.agents/skills/reference-generator/` is created because root skills are the
Codex discovery surface and Codex consumes the approved reference rather than
owning image generation.

## Current Skill Structure

### Root canonical

- `.agents/skills/development-brief/`
- `.agents/skills/mcp-server-development/`
- `.agents/skills/typescript-type-safety/`
- `.agents/skills/bun-tooling/`
- `.agents/skills/blockbench-runtime-development/`
- `.agents/skills/blockbench-bedrock-modelling/`

### Workflow owner outside skill stack

- `docs/foundation/04-reference-guide.md` — Source Image → approved Modelling
  Brief on the image-capable Reference Generator surface.

### Legacy nested locations

There are currently **no active skills** under `mcp/.agents/skills/` or
`mcp/.github/skills/`. Do not repopulate those locations by default.

### Remaining recovery item

- `evidence-gate` ← **next**

## Skill Audit Method

For each recovered capability record:

```text
Historical/current name:
Actual function:
Trigger:
Unique value:
Overlap:
Best owner/name:
Best location:
Decision: KEEP | RENAME | MERGE | MOVE | DROP | RECOVER
Migration cost / compatibility note:
```

Rules:

- recover trusted behavior, not historical naming/layout blindly;
- prefer fewer skills with clearer responsibility;
- a useful capability may remain a foundation/workflow instead of becoming a
  skill when that is the smaller correct owner;
- do not merge distinct expertise merely to reduce count;
- do not retain content already covered by baseline policy or another owner;
- preserve lineage and durable reasoning in the decision log;
- recover one capability at a time.

## Remaining Work Sequence

1. **Recover/audit `evidence-gate`**. Determine whether it has unique conditional
   behavior beyond root minimum-proof, independent-judgment, root-cause, and
   failed-direction rules. Prefer merge/drop if a separate skill adds no value.
2. Re-check the final activation matrix for overlap/context cost.
3. Audit MCP implementation against the cleaned modelling workflow and identify
   only proven runtime gaps.
4. Implement bounded fixes through ChatGPT → GitHub.
5. Final Codex local phase: launch root `BuildIT`, run Blockbench/MCP, perform
   targeted local proof, and fix only demonstrated failures.
6. Validate modelling across multiple object archetypes before generic release
   claims.

## Update Rule

Before ending material work, update this file only when active goal, status,
completed boundary, blocker/proof state, or next step changed. Git history and
the decision log preserve the past.

## Next Step

Recover and audit **`evidence-gate`**. First prove its historical source and
unique behavior; do not create a root skill if the current baseline already owns
that function.
