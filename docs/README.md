# BlockIT Docs

This folder contains the BlockIT documentation set and the Obsidian knowledge vault used to keep development logic modular.

## Reading Order

The agent boot path is `AGENTS.md` → `CONTEXT.md` →
`knowledge/next-action.md` → matching area index. Do not read all foundation
documents at startup. For foundation work, use this focused order:

1. `foundation/README.md`
2. `foundation/00-agent-policy.md`
3. the specific foundation rule needed for the task
4. `foundation/validation-report.md` when proof status matters

Use `foundation/04-reference-guide.md` or `knowledge/index.md` only when
the task area requires them.

## Document Roles

- `foundation/`: current BlockIT policy, workflow, standards, and validation boundary.
- `knowledge/`: Obsidian vault for development flow, decisions, modules, reviews, and skill notes.

## Entry Points

- [Foundation README](foundation/README.md)
- [Knowledge Dashboard](knowledge/index.md)

## Rule of Use

- `foundation/` remains the product and operating-model source of truth.
- `knowledge/` records how we work, what we decided, and how modules connect.
- `validation-report.md` decides what is verified and what stays `Needs Validation`.
- Anything unverified must stay marked as `Needs Validation`.

