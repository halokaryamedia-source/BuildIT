# Skill Activation Matrix

Choose the smallest skill set that covers the task. A listed skill is loaded
only when its trigger applies.

## Default Skill Budget

The normal task stack is:

```text
ponytail
+
one specialist skill
```

Discovery, grilling, review, evidence handling, and optional navigation tools
are conditional stages. They are not extra always-on layers.

## Modes

| Mode | Use |
|---|---|
| Plan | `ponytail`; use GSD-style requirement discovery first only when high-impact requirements are unresolved; add `domain-modeling` or `codebase-design` only for a real terminology or module-boundary problem |
| Developing | `ponytail` plus exactly one specialist skill |
| Maintenance | `ponytail` plus the smallest diagnostic or specialist skill |

## Requirement Discovery

Use lightweight **GSD-style discovery** when the user's prompt expresses the
intent but leaves multiple high-impact interpretations open.

Before asking the user:

1. read existing project context;
2. inspect the actual code/docs for discoverable facts;
3. preserve decisions already made;
4. identify only unresolved high-impact decisions;
5. recommend a default when evidence supports one;
6. ask only decisions that materially change the result.

Do not install or reproduce the full GSD project lifecycle, `.planning/`
structure, roadmap, state hierarchy, or subagent machinery in this repo. The
resolved task state continues to live in existing Local documentation owners.

## Grilling

Use `grilling` when the user explicitly asks to stress-test, challenge, or find
holes in a **plan, decision, or idea**.

The Matt Pocock skill works as a decision tree: it finds hidden assumptions,
asks the currently unblocked decisions, gives recommendations, and continues
until the design frontier is empty. It is useful before committing to a design
or when a proposed direction needs adversarial scrutiny.

Do not use `grilling` as a generic code-review skill. Use `code-review` for an
implemented change and `evidence-gate` for unsupported or disputed proof.

## Behavioral Anti-Slop Complement

Karpathy-inspired coding guidelines are **absorbed into `AGENTS.md`**, not
loaded as another skill. The useful principles are:

- think before coding and surface unresolved assumptions;
- simplicity first, with no speculative flexibility;
- surgical changes only within the declared goal;
- goal-driven execution with observable success criteria and proof.

These principles strengthen Ponytail but do not add another skill to the task
stack. If a future guideline duplicates Ponytail or `AGENTS.md`, absorb only the
missing rule instead of installing another overlapping skill.

## Specialist Skills

| Task | Skill | Current Local status |
|---|---|---|
| MCP server, tools, prompts, resources, transport | `mcp-builder` | checked in under `mcp/.agents/skills/` |
| TypeScript types or module structure | `typescript-expert` | checked in |
| Zod schemas and boundary validation | `zod` | checked in |
| Bun runtime, scripts, lockfile, dependencies | `bun-development` | checked in |
| Blockbench modelling and `.bbmodel` workflow | `blockbench-use` | canonical Local copy still being recovered |
| Blockbench plugin lifecycle, UI, runtime API | `blockbench-plugins` | checked in |
| Source Image to modelling-brief package | `reference-generator` | canonical Local copy still being recovered |
| Unsupported claim, rejected result, or repeated failure | `evidence-gate` | canonical Local copy still being recovered |

Use `skill-creator` only when a skill itself is being created or updated.

## Optional Code Navigation

CodeGraph is an **external navigation accelerator**, not a specialist skill and
not a source of truth.

Use it only when all of these are true:

- the task needs cross-file structural discovery, call-chain tracing,
  ownership discovery, or blast-radius analysis;
- normal targeted source reads would otherwise require broad repeated search;
- CodeGraph is already installed/available for the environment.

When used:

1. start with one focused `codegraph_explore` question;
2. use the returned paths/symbols to inspect only the exact authoritative
   source needed;
3. validate conclusions against source/tests/runtime before changing behavior.

Do **not** use CodeGraph for a known-file edit, small documentation change,
Blockbench visual judgement, reference comparison, or as proof that runtime
behavior is correct. Do not auto-install it or commit `.codegraph/` generated
state. A separate local trial must prove that the navigation gain outweighs its
residual context cost before it becomes a standard environment dependency.

## Diagnostic And Review Skills

- `diagnosing-bugs`: reproducible runtime failure;
- `tdd`: meaningful new behavior or regression coverage where test-first work
  actually reduces risk;
- `research`: external primary-source facts;
- `code-review`: implemented change or existing diff;
- `domain-modeling`: terminology/domain ownership is genuinely unclear;
- `codebase-design`: module/interface ownership is genuinely unclear.

Do not combine a narrow specialist with a broader overlapping specialist unless
one cannot cover the actual task. A Zod task uses `zod`, not both `zod` and
`typescript-expert` by default.

## OpenSpec

Keep `docs/knowledge/decisions/open-spec-guide.md` as the lightweight daily
decision standard.

Full OpenSpec lifecycle is **not** a default skill stack. Consider an OpenSpec
proposal only when a change is genuinely large enough to need a durable formal
change boundary, for example:

- multiple subsystems must change together;
- a public MCP contract or compatibility promise changes;
- a migration is required;
- work spans several independently executable phases or developers;
- an architectural tradeoff must remain explicit across many sessions.

For bounded fixes, tool improvements, schema alignment, documentation cleanup,
or a single modelling-workflow correction, use the existing Context Contract,
`next-action.md`, and decision log instead of opening a full OpenSpec change.

If a full OpenSpec change is justified, start with the smallest necessary
proposal step. Do not activate explore/propose/apply/sync/archive together just
because those skills exist.

## Skill Source Rule

The workspace skill files actually present in `Local` are under
`mcp/.agents/skills/`. The previously documented `mcp/workflow/skills/` path is
not currently present and its long-term canonical replacement is `Needs
Validation` during skill recovery.

Global/user skills such as Ponytail and Matt Pocock skills may live outside the
repo. Use their actual installed or verified upstream source. External tools
such as CodeGraph remain optional environment capabilities and are not copied
into the workspace merely to make them available. If a required skill is
unavailable, say so and continue only with the closest verified Local rule; do
not silently simulate it.

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

Tool success, valid files, geometry metrics, remembered context, and navigation
graphs are not visual or runtime proof.

## Anti-Slop Rules

- inspect before editing;
- surface unresolved assumptions instead of choosing silently;
- fix the proved cause once at its shared owner;
- keep changes inside declared scope;
- use the minimum implementation that satisfies observable success criteria;
- do not add speculative files, tools, dependencies, or fallbacks;
- stop the same failed approach after two attempts;
- never claim validation that was not run.
