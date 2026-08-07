# Minimal Navigation

Use this as the single boot navigation index for every new BuildIT session.

## Resume First

1. `AGENTS.md` — working rules and authority.
2. Root [`CONTEXT.md`](../../CONTEXT.md) — stable facts and terminology.
3. [Next Action](next-action.md) — one active goal, current state, blocker/proof
   status, and next step.

Do **not** ask the user to reconstruct previous chats before reading these three
owners.

## Then, Only If Needed

- [Decision Log](decision-log.md) — read only the relevant durable decision when
  the active task depends on its reason or a conflict must be resolved.
- [Foundation README](../foundation/README.md) — open only the product/modelling
  rule relevant to the task.
- [Activation Matrix](skills/activation-matrix.md) — open only when selecting a
  workflow/skill.
- [Workspace Map](workspace-map.md) — use when ownership/location is unclear.
- affected source/module docs — only after identifying the active boundary.

For Developing, the repository-wide front door is
`../../.agents/skills/development-brief/SKILL.md`.

## Continuity Rule

Chat history and product memory may help, but repository state is authoritative.
Before ending material work, update `next-action.md` when goal/status/blocker/
proof/next-step changed; record durable reasoning in the decision log rather
than duplicating task history across notes.

## Stop Rule

- If the answer is not in the boot context, open one relevant source next.
- Do not broad-scan the vault, archive, generated output, dependencies, or old
  chats by default.
