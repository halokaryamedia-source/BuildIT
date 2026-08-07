# Next Action

This is the **single active-task snapshot**. A new ChatGPT or Codex session must
read this after `AGENTS.md` and `CONTEXT.md` and continue from here instead of
asking the user to reconstruct prior chats.

## Active Task

- **Goal:** harden BlockIT project memory, development flow, and skill routing so
  ChatGPT → GitHub can prepare reliable work that Codex local can prove in the
  Blockbench/MCP environment without context drift or unnecessary ceremony.
- **Status:** `CONTINUITY_AND_FLOW_HARDENING`.
- **In scope:** continuity owners, agent judgment, proof economy, stale workflow
  policy cleanup, lean skill audit/recovery, readiness for later MCP audit.
- **Out of scope now:** MCP feature development, model-specific geometry fixes,
  full GSD/OpenSpec frameworks, Claude-Mem, mass skill rename/migration, and
  speculative architecture.

## Current Working Contract

### Project memory

- `AGENTS.md` → how the agent works.
- `CONTEXT.md` → stable facts/terminology.
- this file → current goal/status/blocker/proof/next step.
- `decision-log.md` → durable decisions and reasons.
- `docs/foundation/` → durable product/modelling policy.
- source + relevant proof → runtime truth.

Chat history or product memory may help, but they are not project authority.
Do not ask the user to repeat old context before reading these owners.

### Development channels

- **ChatGPT → GitHub:** design, inspect, edit, and prepare repository work using
  static evidence. Do not invent local/Blockbench proof.
- **Codex local from root `BuildIT`:** perform final targeted shell/MCP/
  Blockbench proof only when the claim requires the local environment.

Goal, Build POV, Acceptance POV, scope, and acceptance criteria stay the same;
only available proof changes.

### Developing

- mandatory front door: `.agents/skills/development-brief/SKILL.md`;
- at most one specialist when it adds real domain value;
- trivial fast path may use `development-brief` alone;
- `no change required` is valid;
- minimum useful proof only;
- engineering success without Acceptance POV success is not completion.

### Independent judgment

The user owns the goal, not necessarily the method. Reject/redirect a proposed
method when evidence shows it is invalid, disproven, unnecessarily complex,
unsupported, contrary to an authoritative decision, or likely to reduce output
quality. Explain the reason and recommend the smallest better path.

## Completed In This Phase

- `development-brief` was designed with `skill-creator` and three rounds of
  `grilling` stress-test.
- It supports both ChatGPT → GitHub and Codex local execution channels.
- Proof/validation was changed from broad mandatory checks to **minimum useful
  proof**.
- Mandatory `code-review` ceremony was removed from the routing flow.
- `development-brief` was moved from `mcp/.agents/skills/` to repository root
  `.agents/skills/`, matching root `BuildIT` Codex usage.
- `AGENTS.md`, `README.md`, `CONTEXT.md`, `minimal-nav.md`, flow docs, skill map,
  activation matrix, and decision log now treat repository state as the
  continuity authority.
- Independent agent judgment / anti-people-pleasing behavior is now baseline
  policy rather than another skill.

## Known Gaps / Needs Validation

1. **Foundation conflict cleanup:** `docs/foundation/03-modelling-workflow.md`
   and `07-visual-validation.md` still contain older section-first/Zebra-era
   wording and runtime assumptions that may conflict with the current
   object-agnostic, whole-form-first direction.
2. **Specialist discovery/location:** existing specialists still live under
   `mcp/.agents/skills/`. Because Codex starts from root, audit/migrate them one
   by one; do not mass-move before naming/overlap review.
3. **Missing/recovery skills:** `blockbench-use`, `reference-generator`, and
   `evidence-gate` still require trusted-source recovery and naming/overlap
   audit.
4. **MCP/Blockbench live proof:** intentionally deferred until repository rules,
   skills, and implementation are ready for the final Codex local phase.

## Priority Work Sequence

1. **Clean misleading foundation rules first** — audit
   `03-modelling-workflow.md` and `07-visual-validation.md`; preserve only
   generic policy consistent with the current whole-form/object-agnostic
   direction. Do not change MCP runtime yet.
2. **Audit skills one by one** — classify each as `KEEP`, `RENAME`, `MERGE`,
   `MOVE`, `DROP`, or `RECOVER`; start with `mcp-builder`. Do not mass-rename.
3. **Recover missing product skills** — Blockbench modelling, reference
   preparation, and evidence handling; rename/merge only after actual contents
   are understood.
4. **Audit MCP implementation** against the cleaned product/model workflow and
   identify only proven runtime gaps.
5. **Implement through ChatGPT → GitHub** using the smallest bounded changes and
   leave exact local proof steps only where required.
6. **Final Codex local phase** — launch from root `BuildIT`, run Blockbench/MCP,
   execute targeted local proof, and fix only failures demonstrated there.
7. **Model workflow validation** — test across multiple object archetypes before
   claiming generic readiness.

## Stop / Update Rule

Before ending material work, update this file only if the active goal, status,
blocker/proof state, or next step changed. Do not turn it into a history log;
Git history and the decision log hold the past.

## Next Step

Audit and clean the stale/misleading rules in
`docs/foundation/03-modelling-workflow.md` and
`docs/foundation/07-visual-validation.md` before starting the skill-name audit.
