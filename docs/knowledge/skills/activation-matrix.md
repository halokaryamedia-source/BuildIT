# Skill Activation Matrix

Choose the smallest skill set that covers the active boundary. A skill is used
only when its trigger adds real value.

## Default Skill Budget

| Mode | Default stack |
|---|---|
| Plan | `ponytail` |
| Developing | mandatory `development-brief`; add at most one specialist when it adds real domain value |
| Maintenance | `ponytail` + the smallest diagnostic/specialist that owns the failure |

Discovery, grilling, review, evidence handling, OpenSpec, and navigation tools
are conditional escalations, not always-on layers.

The simplicity, surgical-change, independent-judgment, and minimum-proof rules
in root `AGENTS.md` apply to every mode; do not duplicate them as extra skills.

## Developing Front Door

`development-brief` is mandatory for every Developing request in both execution
channels. Canonical path:

`/.agents/skills/development-brief/SKILL.md`

It owns request normalization, execution-channel detection, Build/Acceptance
POV, input/output boundary, development-necessity check, 2–5 acceptance
criteria, minimum useful proof, and the final contract gate.

A trivial fast path may use `development-brief` alone. `No change required` is
a valid Developing result.

## Repository-Wide Specialist: MCP Server And Input Contract

Use `mcp-server-development` when the **primary semantic owner is the MCP
server/public contract**:

- MCP tools/resources/prompts and registration;
- MCP input schemas, validation, defaults, optionality, and refinements;
- MCP request/result semantics and structured output;
- tool annotations and protocol-facing errors;
- Streamable HTTP transport/session behavior;
- MCP SDK/protocol compatibility.

Canonical path:

`/.agents/skills/mcp-server-development/SKILL.md`

Zod is an implementation mechanism inside this boundary, not a separate active
skill. The old generic `zod` skill is retired.

Do not load `mcp-server-development` for a TypeScript type-system-only issue,
Bun tooling issue, Blockbench runtime/API issue, or 3D modelling task unless the
MCP/public contract itself is the primary change.

## Repository-Wide Specialist: TypeScript Type Safety

Use `typescript-type-safety` only when the **difficult part of the task is the
TypeScript type system itself**:

- compiler/type compatibility or inference problems;
- generics, unions, narrowing, or unsafe assertions;
- declaration/external-library typing;
- public TypeScript type contracts;
- compile-time module typing when TypeScript owns the failure.

Canonical path:

`/.agents/skills/typescript-type-safety/SKILL.md`

Do **not** load it merely because the implementation file ends in `.ts`.
Normal MCP implementation stays with `mcp-server-development`; Bun-specific
build/tooling stays with `bun-tooling`; Blockbench runtime/API work stays with
`blockbench-runtime-development`.

## Repository-Wide Specialist: Bun Tooling

Use `bun-tooling` only when the **problem is specifically Bun-owned**:

- `Bun.build` configuration or build failure;
- Bun build plugins/loaders/resolvers;
- `Bun.file`, `Bun.write`, `Bun.argv`, or another Bun API already used by Local;
- Bun-owned package scripts, `bunx`, dependency resolution, or `bun.lock`;
- Bun/Blockbench packaging compatibility when Bun is the proved owner.

Canonical path:

`/.agents/skills/bun-tooling/SKILL.md`

Do not load it merely because a command uses `bun run` or the project uses Bun.
Ordinary MCP/TypeScript/Blockbench work stays with its semantic owner. The old
broad `bun-development` skill is retired.

## Repository-Wide Specialist: Blockbench Runtime

Use `blockbench-runtime-development` when the **primary semantic owner is
behavior inside the Blockbench runtime**:

- `BBPlugin` lifecycle, startup, teardown, and runtime permissions;
- Blockbench panels/dialogs/settings/actions and their cleanup;
- Blockbench globals/APIs and element manipulation mechanics;
- `Undo`, `Canvas`, selection/lookup, events, and runtime state updates;
- behavior that requires live Blockbench to prove.

Canonical path:

`/.agents/skills/blockbench-runtime-development/SKILL.md`

This specialist owns **how Blockbench is manipulated**, not **what model should
be built**. Shape, proportions, cuboid decomposition, reference interpretation,
texture art direction, and visual-quality judgement belong to the modelling
workflow/skill when recovered.

If an MCP tool calls Blockbench APIs, choose by the proved owner: public MCP
contract → `mcp-server-development`; correct contract but incorrect Blockbench
operation/lifecycle → `blockbench-runtime-development`.

The old `blockbench-plugins` packages under both `mcp/.agents/skills/` and
`mcp/.github/skills/` are retired. Do not recreate duplicate authorities.

## Requirement Discovery

Use lightweight GSD-style discovery only when high-impact interpretations
remain unresolved after repository inspection. Ask the user for decisions, not
facts the repository can answer. Do not install a parallel `.planning/` state
hierarchy.

## Critique And Evidence

- `grilling`: stress-test a plan, decision, or idea before commitment when
  adversarial scrutiny is requested or materially useful.
- `code-review`: implemented change where independent critique adds value beyond
  the normal final contract gate.
- `evidence-gate`: unsupported/disputed proof or a repeatedly failing direction,
  once its canonical Local copy is recovered.

Do not use these merely to make routine work look more rigorous.

## Skill Authoring

Use the available global/user `skill-creator` capability only when a skill itself
is being created or materially revised.

Do **not** keep a repository copy of generic skill-authoring guidance just to make
it available locally. BlockIT-specific skill behavior belongs in the actual
repository skill being authored plus the Knowledge decisions/routing that govern
it.

The retired nested `mcp/.agents/skills/skill-creator/` package must not be
recreated unless a future requirement proves a Local-only authoring capability
that the available global/user skill cannot provide.

## Nested Specialist Copies Pending Audit

These copies still live under `mcp/.agents/skills/` while their one-by-one
audit is in progress:

| Task | Skill | Status |
|---|---|---|
| Vue guidance | `vue-best-practices` | **next audit** |
| Blockbench modelling/`.bbmodel` workflow | `blockbench-use` | recovery item |
| Source Image → modelling brief | `reference-generator` | recovery item |
| Unsupported/disputed evidence | `evidence-gate` | recovery item |

Because Codex is launched from root `BuildIT`, do not assume remaining nested
copies are canonical project-wide skills. Audit/migrate them one at a time.

Do not stack overlapping specialists. Choose the semantic owner. For example,
a Bun command that only launches an MCP workflow is still MCP-owned unless the
Bun command/build behavior itself is the problem.

## Optional Code Navigation

CodeGraph is an external navigation accelerator, not a skill or source of truth.
Use it only for genuinely broad ownership/call-chain/dependency/blast-radius
questions when targeted source reads would otherwise become repetitive.

Start with one focused exploration, then return to authoritative source. Do not
use it for known-file edits, runtime proof, or visual/model judgement. Do not
auto-install or commit `.codegraph/` state.

## Other Conditional Specialists

- `diagnosing-bugs`: reproducible runtime failure;
- `tdd`: meaningful behavior/regression where test-first materially reduces
  risk;
- `research`: external primary-source facts;
- `domain-modeling`: terminology/domain ownership genuinely unclear;
- `codebase-design`: module/interface ownership genuinely unclear.

## OpenSpec

Keep `docs/knowledge/decisions/open-spec-guide.md` as the lightweight daily
decision standard.

Use a formal OpenSpec proposal only for a real complexity boundary: coordinated
multi-subsystem/public-contract change, migration, independently executable
multi-phase work, or a durable architectural tradeoff that the normal decision
log cannot represent cleanly.

Do not use the full lifecycle for bounded fixes, schema alignment, docs cleanup,
or one modelling-workflow correction. Activate only the smallest stage needed.

## Skill Location Rule

- `.agents/skills/` = canonical repository-wide skills discoverable from root
  `BuildIT`.
- `mcp/.agents/skills/` = remaining legacy/nested copies pending one-by-one
  audit.
- `mcp/.github/skills/` = legacy duplicate skill location; do not maintain a
  second active copy of a root canonical skill.
- `mcp/workflow/skills/` = stale historical path; do not recreate it.

Audit one skill at a time and classify it `KEEP`, `RENAME`, `MERGE`, `MOVE`,
`DROP`, or `RECOVER` based on real function and overlap.

## Proof Economy

Use the minimum useful proof available in the active execution channel.

| Change | ChatGPT → GitHub | Codex local |
|---|---|---|
| Text/docs/routing | exact diff + relevant paths/links | same; no extra command required |
| Bounded source change | changed source + directly affected callers/contracts; existing checks only when directly relevant | one targeted check/reproduction first; add build/typecheck/test only if informative |
| Public/destructive contract | safe static implementation may proceed, but unavailable material runtime proof remains `Perlu pemeriksaan` | targeted contract/runtime proof before full completion |
| Blockbench/UI/visual behavior | prepare repository change; do not claim live/visual success from static inspection | live runtime/visual proof when required by the claim |

Do not create tests, CI, fixtures, screenshots, builds, or validation artifacts
solely for ceremony. Do not repeat unchanged proof after it already established
the acceptance criteria.

## Anti-Slop Routing Rules

- inspect before editing;
- separate goal from user-suggested method;
- reject a bad method while preserving the valid goal;
- do not turn a fixture into product policy;
- fix the proved owner once rather than patching symptoms repeatedly;
- keep scope bounded;
- use the smallest skill set and smallest proof set that can produce a reliable
  result;
- stop a failed direction after two attempts without new evidence;
- never claim proof that was unavailable or not run.
