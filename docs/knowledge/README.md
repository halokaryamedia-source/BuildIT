# LazyDesigner Knowledge Authority

Updated: 2026-09-11

This directory contains current operational knowledge for LazyDesigner. One file owns one concern. Do not duplicate the same current rule across multiple documents.

## Authority Map

| Concern | Canonical owner |
| --- | --- |
| End-to-end product/work flow | `docs/knowledge/flow.md` |
| ChatGPT reference preparation and handoff contract | `docs/knowledge/reference-handoff.md` |
| Skill categories, semantic ownership, and target Skill naming | `docs/knowledge/skill-taxonomy.md` |
| Current source/module ownership | `docs/knowledge/implementation-map.md` |
| Current implementation continuation only | `docs/knowledge/next-action.md` |
| Current proof interpretation only | `docs/knowledge/current-validation.md` |
| Durable modelling/texture/animation standards | `docs/foundation/*` |
| Persistent asset continuity | `workspace/active/<asset>/README.md` |
| Repository-level execution/routing rules | `AGENTS.md`, `GITHUB_RULES.md` |
| Historical rationale/retired architecture | Git history |

## Current Product Identity

```text
PRODUCT NAME: LazyDesigner
FORMER PRODUCT NAME: BlockIT
```

`BlockIT` may still exist temporarily in internal identifiers, filenames, Skill IDs, protocol strings, tests, and generated output during migration. Those compatibility identifiers are implementation details, not the current product name.

Do not create permanent parallel `BlockIT` and `LazyDesigner` product identities.

## Current Architecture

```text
USER
  ↓
CHATGPT REFERENCE PREPARATION
  ↓
REFERENCE PACKAGE
  ↓
LAZYDESIGNER CONTROL
  ↓
CODEX
  ↓
GATEWAY
  ↓
RUNTIME
  ↓
BLOCKBENCH
```

Control is the single front line for Codex work. It performs intake, state/readiness resolution, context projection, dependency routing, and post-operation invalidation. It does not replace Codex reasoning, Runtime execution, or Workspace persistence.

## Skill Categories

All Skills belong primarily to exactly one of:

```text
REFERENCE_PREPARATION
ASSET_AUTHORING
PRODUCT_DEVELOPMENT
```

The exact mapping and migration names are owned only by `docs/knowledge/skill-taxonomy.md`. Do not reproduce a competing Skill taxonomy in `AGENTS.md`, `flow.md`, or Control source.

## Documentation Rule

When a rule belongs to another owner, link to that owner instead of reproducing the full rule.

Examples:

- `flow.md` defines when reference preparation happens; `reference-handoff.md` defines what the package contains.
- `skill-taxonomy.md` defines Skill category/name/semantic owner; individual `SKILL.md` files define their operating instructions.
- `flow.md` defines that Control routes Codex work; implementation details belong in `implementation-map.md`.
- `next-action.md` must contain only what is being implemented next, never another architecture specification.
- `current-validation.md` must report proof status, never define desired future behavior.

This separation is the required baseline before further Control implementation.