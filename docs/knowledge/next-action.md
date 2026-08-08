# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session must
read this after `AGENTS.md` and `CONTEXT.md` and continue from here instead of
asking the user to reconstruct prior chats.

## Active Task

- **Goal:** finish skill consolidation by running one final overlap/context-cost
  review before MCP implementation audit begins.
- **Status:** `SKILL_CONSOLIDATION_FINAL_REVIEW`.
- **Execution now:** ChatGPT → GitHub.
- **Final runtime environment later:** Codex local from root `BuildIT` with
  Blockbench + MCP.
- **In scope now:** verify that the six canonical root skills, Reference Generator
  workflow, evidence baseline, routing triggers, and skill budget are clear,
  minimal, and non-overlapping.
- **Out of scope now:** MCP feature changes, model-specific fixes, new skill
  recovery, mass framework installation, full GSD/OpenSpec systems, Claude-Mem,
  speculative architecture.

## Continuation Contract

- `AGENTS.md` → working rules, independent judgment, proof/evidence baseline.
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
- use evidence-status labels only for real uncertainty/dispute, not routine work.
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

Canonical owner: `docs/foundation/04-reference-guide.md`.

The image-capable ChatGPT/Reference Generator surface creates and reviews the
five-view Modelling Brief. Codex consumes the approved brief through
`blockbench-bedrock-modelling`. The historical multi-sheet/manifest/hash/lease/
three-approval/mandatory-ZIP machinery was not restored.

### 10. `evidence-gate` lineage → root evidence baseline

**Decision:** `MERGE + DROP AS SKILL`.

No tracked `.agents/skills/evidence-gate/SKILL.md` package exists in Rework. The
useful historical behavior came from an evidence-gate section of the prior
Minecraft Production Reality Core rather than a standalone project skill.

Canonical owner: root `AGENTS.md` → **Evidence Status Escalation**.

Conditional labels retained:

- `CURRENT-PROJECT VERIFIED`;
- `OFFICIALLY VERIFIED`;
- `LOCAL PROOF REQUIRED`;
- `UNSUPPORTED`;
- `UNKNOWN`.

`LOCAL PROOF REQUIRED` replaces the historical `PROTOTYPE REQUIRED` wording for
the current ChatGPT→GitHub / Codex-local workflow. Historical `SIMULATION
REQUIRED` is not kept as another evidence state; Independent Judgment owns the
case where a literal method is unsupported but the user's goal can be redirected
to a smaller supported method.

Evidence status is used only when a material claim is uncertain, disputed,
version-sensitive, or blocking completion. It does not create routine validation
ceremony and does not consume the specialist slot.

## Current Skill Structure

### Root canonical

- `.agents/skills/development-brief/`
- `.agents/skills/mcp-server-development/`
- `.agents/skills/typescript-type-safety/`
- `.agents/skills/bun-tooling/`
- `.agents/skills/blockbench-runtime-development/`
- `.agents/skills/blockbench-bedrock-modelling/`

### Workflow/baseline owners outside skill stack

- `docs/foundation/04-reference-guide.md` — Source Image → approved Modelling
  Brief on an image-capable Reference Generator surface.
- root `AGENTS.md` Evidence Status Escalation — disputed/uncertain material
  evidence claims.

### Legacy nested locations

There are currently **no active skills** under `mcp/.agents/skills/` or
`mcp/.github/skills/`. Do not repopulate those locations by default.

### Recovery status

The planned recovery queue is **complete**. Do not invent another recovery item
from historical names without a current proved requirement.

## Final Skill Review Checklist

For each canonical root skill and non-skill workflow owner, check:

```text
Name/owner is contextual and understandable?
Trigger is narrow enough?
Unique value remains?
Overlap with AGENTS/development-brief/another specialist?
Could the same result use fewer loaded instructions?
Does it accidentally own runtime + modelling + protocol at once?
Does it create validation/review ceremony?
Does Codex launched from root discover only capabilities it can actually use?
```

The expected outcome is not a target skill count. Keep six only if all six still
have distinct value after this final comparison.

## Remaining Work Sequence

1. **Run final activation-matrix / context-cost review** across the six canonical
   root skills plus Reference Generator and evidence baseline owners. Remove or
   merge only proven overlap; do not reopen completed audits without evidence.
2. Audit MCP implementation against the cleaned modelling workflow and identify
   only proven runtime gaps.
3. Implement bounded fixes through ChatGPT → GitHub.
4. Final Codex local phase: launch root `BuildIT`, run Blockbench/MCP, perform
   targeted local proof, and fix only demonstrated failures.
5. Validate modelling across multiple object archetypes before generic release
   claims.

## Update Rule

Before ending material work, update this file only when active goal, status,
completed boundary, blocker/proof state, or next step changed. Git history and
the decision log preserve the past.

## Next Step

Run the **final skill routing / overlap / context-cost review**. Evaluate the six
canonical root skills together with `04-reference-guide.md` and root evidence
status rules, then freeze the skill architecture before starting the MCP
implementation audit.
