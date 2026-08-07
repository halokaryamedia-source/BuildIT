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

### Project memory

- `AGENTS.md` → agent working rules and independent judgment.
- `CONTEXT.md` → stable facts/terminology.
- this file → active goal/status/blocker/proof/next step.
- `decision-log.md` → durable decisions and reasons.
- `docs/foundation/` → durable product/modelling policy.
- source + relevant proof → runtime truth.

Do not ask the user to repeat old context before reading these owners.

### Development channels

- **ChatGPT → GitHub:** design, inspect, edit, and prepare repository work using
  static evidence; no invented local/Blockbench proof.
- **Codex local:** final targeted shell/MCP/Blockbench proof only when required
  by the claim.

Goal, Build POV, Acceptance POV, scope, and acceptance criteria stay the same;
only available proof changes.

### Developing

- mandatory front door: `.agents/skills/development-brief/SKILL.md`;
- at most one specialist when it adds real domain value;
- trivial fast path may use `development-brief` alone;
- `no change required` is valid;
- use minimum useful proof;
- engineering success without Acceptance POV success is not completion.

### Independent judgment

The user owns the goal, not necessarily the method. Reject/redirect a proposed
method when evidence shows it is invalid, disproven, unnecessarily complex,
unsupported, contrary to an authoritative decision, or likely to reduce output
quality. Explain why and recommend the smallest better path.

## Completed Foundation Hardening

- repository state is now the explicit project memory across ChatGPT/Codex
  sessions;
- mandatory boot path and session handoff are documented;
- `development-brief` moved to root `.agents/skills/` for root `BuildIT` Codex
  usage;
- ChatGPT → GitHub vs Codex local execution/proof boundary is explicit;
- validation changed to **minimum useful proof** rather than broad ceremony;
- mandatory code-review/review stage was removed from the routing flow;
- independent anti-people-pleasing judgment is baseline policy, not another
  skill;
- `docs/foundation/README.md` now uses task-specific loading rather than asking
  agents to read the entire foundation;
- `00-agent-policy.md` now contains only BlockIT-specific product constraints;
  generic working rules remain in root `AGENTS.md`;
- `02-product-requirements.md` now matches the whole-form-first product flow and
  simple-user / professional-agent contract;
- `03-modelling-workflow.md` now uses generic **whole-form-first** modelling and
  removes universal support-first/section-first/per-cube construction ceremony;
- `05-geometry-standard.md` now evaluates Cuboids by whole-model purpose and no
  longer treats historical support order, section review, or exact grid/rotation
  conventions as universal product law;
- `07-visual-validation.md` now removes Zebra-specific view rules, section-first
  cadence, per-cube screenshot/mutation gates, and unverified runtime claims;
- whole-form visual review now checks global silhouette/proportion first and uses
  targeted corrections plus evidence economy.

## Current Skill Structure

### Root repository-wide

- `.agents/skills/development-brief/` — canonical mandatory Developing workflow.

### MCP specialist copies pending one-by-one audit

- `mcp-builder`
- `typescript-expert`
- `zod`
- `bun-development`
- `blockbench-plugins`

These still live under `mcp/.agents/skills/`. Do not mass-move them. Because
Codex starts from root, their final root/module location must be decided during
each skill audit.

### Recovery items

- `blockbench-use`
- `reference-generator`
- `evidence-gate`

Recover only from trusted source/history, then audit function/name/overlap before
adoption.

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
- do not merge distinct expertise merely to reduce the count;
- do not retain a skill whose useful content is already baseline policy;
- preserve upstream lineage in the decision log when renamed/merged;
- change one skill at a time so routing remains understandable.

## Remaining Work Sequence

1. **Audit `mcp-builder` first** — real function, overlap, clearer name, and
   final root/module location.
2. Audit remaining checked-in specialists one by one.
3. Recover/audit `blockbench-use`, `reference-generator`, and `evidence-gate`.
4. Re-check the final activation matrix for overlap/context cost.
5. Audit the MCP implementation against the cleaned modelling workflow and find
   only proven runtime gaps.
6. Implement bounded fixes through ChatGPT → GitHub.
7. Final Codex local phase: launch root `BuildIT`, run Blockbench/MCP, perform
   targeted local proof, and fix only demonstrated failures.
8. Validate modelling across multiple object archetypes before generic release
   claims.

## Update Rule

Before ending material work, update this file only when active goal, status,
blocker/proof state, or next step changed. Do not turn it into a history log;
Git history and the decision log preserve the past.

## Next Step

Audit **`mcp-builder`** as the first specialist skill. Do not rename or move it
until its actual contents, overlap, and downstream role are understood.
