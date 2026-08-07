# Skill Activation Matrix

Choose the smallest skill set that covers the task. A listed skill is loaded
only when its trigger applies.

## Modes

| Mode | Use |
|---|---|
| Plan | `ponytail`; add `domain-modeling` or `codebase-design` only for a real terminology or module-boundary problem |
| Developing | `ponytail` plus exactly one workspace skill |
| Maintenance | `ponytail` plus the smallest diagnostic or workspace skill |

Use `grilling` only when the user explicitly asks to stress-test a decision.

## Workspace Skills

| Task | Skill |
|---|---|
| MCP server, tools, prompts, resources, transport | `mcp-builder` |
| TypeScript types or module structure | `typescript-expert` |
| Zod schemas and boundary validation | `zod` |
| Bun runtime, scripts, lockfile, dependencies | `bun-development` |
| Blockbench modelling and `.bbmodel` workflow | `blockbench-use` |
| Blockbench plugin lifecycle, UI, runtime API | `blockbench-plugins` |
| Source Image to modelling-brief package | `reference-generator` |
| Unsupported claim, rejected result, or repeated failure | `evidence-gate` |

Canonical files live only in `mcp/workflow/skills/`. Use the global
`skill-creator` when creating or updating a skill.

## Selection Rules

- Choose the narrowest skill. A Zod task uses `zod`, not both Zod and the
  broader TypeScript skill.
- Blockbench UI uses `blockbench-plugins`; this workspace has no separate Vue
  application skill.
- Reference Generator ends at an accepted modelling brief. Blockbench
  modelling starts with `blockbench-use`.
- `evidence-gate` is not always-on ceremony or a second implementation skill.
  Pause the active workflow and apply it when evidence is disputed, missing,
  visual acceptance is claimed, or an approach has failed twice.
- Use `diagnosing-bugs` for a reproducible runtime failure, `tdd` for meaningful
  behavior or regression coverage, `research` for primary-source facts, and
  `code-review` for an existing change.

## Edit Gate

Before editing, state:

```text
Goal:
In scope:
Out of scope:
Affected area:
Existing pattern reused:
Assumptions:
Validation:
```

Stop with `Needs Validation` when the source of truth, caller, public contract,
or required proof is unknown.

## Proof

| Change | Minimum proof |
|---|---|
| Text or routing | inspect links, paths, and diff |
| Schema, parser, branch, transform | targeted test |
| Public MCP surface | targeted test, build, generated docs |
| Blockbench lifecycle or UI | build and live runtime check |
| Visual model quality | fresh screenshots, concrete visual critic findings, and internal release gate |

Tool success, valid files, geometry metrics, and remembered context are not
visual proof.

## Anti-Slop Rules

- inspect before editing;
- fix the proved cause once at its shared owner;
- keep changes inside declared scope;
- do not add speculative files, tools, dependencies, or fallbacks;
- stop the same failed approach after two attempts;
- never claim validation that was not run.
