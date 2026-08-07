# Skill Activation Matrix

Choose the smallest skill set that covers the task. A listed skill is loaded
only when its trigger applies.

## Default Skill Budget

| Mode | Default stack |
|---|---|
| Plan | `ponytail` |
| Developing | mandatory `development-brief`; add one specialist only when it adds real domain value |
| Maintenance | `ponytail` + the smallest diagnostic or specialist skill |

Discovery, grilling, review, evidence handling, and optional navigation tools
are conditional stages. They are not extra always-on layers.

The minimal/YAGNI and surgical-change principles in `AGENTS.md` apply to every
mode. Developing does not load Ponytail as another skill.

## Developing Front Door

`development-brief` is mandatory for every Developing request. Its canonical
procedure lives in `mcp/.agents/skills/development-brief/SKILL.md`; do not copy
that procedure into routing notes.

Its job is to make sure implementation starts with the correct goal, authority,
Build/Acceptance POV, input/output boundary, acceptance criteria, and proof. It
also allows `no change required` and a specialist-free fast path for trivial
work.

## Requirement Discovery

Use lightweight **GSD-style discovery** only when high-impact interpretations
remain unresolved after repository inspection. Ask the user for decisions, not
facts the repository can answer. Do not install the full GSD `.planning/`
lifecycle or parallel state hierarchy.

## Grilling

Use `grilling` when the user explicitly asks to stress-test, challenge, or find
holes in a **plan, decision, or idea**. It is a decision-tree interview before
commitment, not a generic code-review skill.

Use `code-review` for implemented changes and `evidence-gate` for unsupported or
disputed proof.

## Behavioral Anti-Slop Complement

Karpathy-inspired coding principles are absorbed into root `AGENTS.md`, not
loaded as another skill: think first, keep solutions simple, make surgical
changes, and define verifiable success.

If a future guideline duplicates an existing Local guardrail, absorb only the
missing rule instead of installing another overlapping skill.

## Specialist Skills

| Task | Skill | Current Local status |
|---|---|---|
| Developing request normalization and final acceptance gate | `development-brief` | checked in; mandatory workflow skill, not an implementation specialist |
| MCP server, tools, prompts, resources, transport | `mcp-builder` | checked in |
| TypeScript types or module structure | `typescript-expert` | checked in |
| Zod schemas and boundary validation | `zod` | checked in |
| Bun runtime, scripts, lockfile, dependencies | `bun-development` | checked in |
| Blockbench modelling and `.bbmodel` workflow | `blockbench-use` | canonical Local copy still being recovered |
| Blockbench plugin lifecycle, UI, runtime API | `blockbench-plugins` | checked in |
| Source Image to modelling-brief package | `reference-generator` | canonical Local copy still being recovered |
| Unsupported claim, rejected result, or repeated failure | `evidence-gate` | canonical Local copy still being recovered |

Use `skill-creator` only when a skill itself is being created or updated.

Do not stack overlapping specialists. Example: a Zod-owned change normally uses
`development-brief + zod`, not `development-brief + zod + typescript-expert`.
A trivial text change may use `development-brief` alone.

## Optional Code Navigation

CodeGraph is an **external navigation accelerator**, not a skill or source of
truth. Use it only for genuinely broad cross-file ownership, call-chain,
dependency, or blast-radius discovery when normal targeted reads would require
repeated broad search.

When used, start with one focused exploration, then inspect the exact source and
validate against tests/runtime. Do not use it for known-file edits, Blockbench
visual judgement, reference comparison, or runtime proof. Do not auto-install
it or commit `.codegraph/` state; standard adoption requires a separate local
trial because large results can consume residual context.

## Diagnostic And Review Skills

- `diagnosing-bugs`: reproducible runtime failure;
- `tdd`: meaningful new behavior or regression coverage where test-first work
  actually reduces risk;
- `research`: external primary-source facts;
- `code-review`: implemented change or existing diff;
- `domain-modeling`: terminology/domain ownership is genuinely unclear;
- `codebase-design`: module/interface ownership is genuinely unclear.

## OpenSpec

Keep `docs/knowledge/decisions/open-spec-guide.md` as the lightweight daily
decision standard.

Use a formal OpenSpec proposal only when a real complexity boundary requires
it, such as a coordinated multi-subsystem contract, public MCP compatibility
change, migration, independently executable multi-phase work, or a durable
architectural tradeoff that the normal decision log cannot represent cleanly.

Do not use the full lifecycle for bounded fixes, schema alignment,
documentation cleanup, or one modelling-workflow correction. When justified,
activate only the smallest OpenSpec stage currently needed.

## Skill Source Rule

Workspace skills actually present in `Local` live under `mcp/.agents/skills/`.
The old `mcp/workflow/skills/` path is not present and must not be recreated just
to match stale documentation.

Global/user skills such as Ponytail and Matt Pocock skills may live outside the
repo; use their installed or verified upstream source. External tools such as
CodeGraph remain optional environment capabilities. If a required skill is
unavailable, state that fact and use only the closest verified Local rule; do
not silently simulate it.

## Edit Gate

Before editing, the active mode must have a clear goal, scope, and proof path.
For Developing, `development-brief` owns that normalization and user-facing
brief.

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
- separate the user goal from a proposed implementation;
- do not turn a test fixture into a product-specific rule;
- allow `no change required` when current behavior already satisfies the goal;
- fix the proved cause once at its shared owner;
- keep changes inside declared scope;
- use the minimum implementation that satisfies observable success criteria;
- do not add speculative files, tools, dependencies, or fallbacks;
- stop the same failed approach after two attempts;
- never claim validation that was not run.
