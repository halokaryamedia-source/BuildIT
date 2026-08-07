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
- **In scope:** audit existing skill function/name/overlap/location one by one,
  recover only missing useful skills, keep workflow/context concise.
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

## Development Channels

- **ChatGPT → GitHub:** design, inspect, edit, and prepare repository work using
  static evidence; no invented local/Blockbench proof.
- **Codex local:** final targeted shell/MCP/Blockbench proof only when required
  by the claim.

Goal, Build POV, Acceptance POV, scope, and acceptance criteria stay the same;
only available proof changes.

## Developing Baseline

- mandatory front door: `.agents/skills/development-brief/SKILL.md`;
- at most one specialist when it adds real domain value;
- trivial fast path may use `development-brief` alone;
- `no change required` is valid;
- use minimum useful proof;
- engineering success without Acceptance POV success is not completion;
- reject/redirect user-suggested methods when evidence shows they are invalid,
  disproven, unnecessarily complex, unsupported, or harmful to output quality.

## Completed Foundation Hardening

- repository state is explicit project memory across ChatGPT/Codex sessions;
- mandatory boot path/session handoff is documented;
- ChatGPT → GitHub vs Codex local proof boundary is explicit;
- validation uses **minimum useful proof** rather than broad ceremony;
- independent anti-people-pleasing judgment is baseline policy;
- foundation modelling/geometry/visual-validation policy is generic,
  object-agnostic, and whole-form-first;
- historical support-first/section-first/per-cube/Zebra-specific gates were
  removed from product policy.

## Completed Skill Audits

### 1. `mcp-builder` → `mcp-server-development`

**Decision:** `RENAME + MOVE + SLIM`.

Canonical replacement:

`.agents/skills/mcp-server-development/SKILL.md`

Function:

- MCP tools/resources/prompts and registration;
- MCP request/result semantics and annotations;
- Streamable HTTP transport/session behavior;
- MCP SDK/protocol compatibility.

Removed from the active skill:

- Python/FastMCP;
- generic external-API scaffolding/pagination defaults;
- generic Node project scaffolding;
- mandatory broad build/test flow;
- fixed 10-question MCP evaluation workflow;
- Python/XML evaluation scripts.

The old `mcp/.agents/skills/mcp-builder/` package is retired and must not be
recreated or routed to.

## Current Skill Structure

### Root canonical

- `.agents/skills/development-brief/`
- `.agents/skills/mcp-server-development/`

### Nested copies pending one-by-one audit

Repository truth currently shows:

- `typescript-expert` ← **next**
- `zod`
- `bun-development`
- `blockbench-plugins`
- `skill-creator` — nested copy newly discovered; likely overlap candidate but
  not yet audited
- `vue-best-practices` — newly discovered; relevance not yet audited

These remain under `mcp/.agents/skills/` until their individual audit decides
function, name, overlap, and final location.

### Recovery items

- `blockbench-use`
- `reference-generator`
- `evidence-gate`

Recover only from trusted source/history, then audit before adoption.

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
- do not retain content already covered by baseline policy;
- preserve upstream lineage in the decision log when renamed/merged;
- change one skill at a time.

## Remaining Work Sequence

1. **Audit `typescript-expert`** for unique value vs baseline TypeScript/project
   rules, overlap with Zod/Bun/MCP specialist, clearer name, and root location.
2. Audit the remaining nested copies one by one, including the newly discovered
   `skill-creator` and `vue-best-practices` rather than leaving them invisible.
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
completed boundary, blocker/proof state, or next step changed. Do not turn it
into a history log; Git history and the decision log preserve the past.

## Next Step

Audit **`typescript-expert`**. Do not rename, merge, move, or delete it until its
actual contents and overlap with the current Local architecture are understood.
