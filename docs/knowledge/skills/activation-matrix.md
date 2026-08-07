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
channels. Its canonical path is:

`/.agents/skills/development-brief/SKILL.md`

It owns request normalization, execution-channel detection, Build/Acceptance
POV, input/output boundary, development-necessity check, 2–5 acceptance
criteria, minimum useful proof, and the final contract gate.

A trivial fast path may use `development-brief` alone. `No change required` is
a valid Developing result.

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

## Current MCP Specialist Skills

These copies still live under `mcp/.agents/skills/` while the one-by-one naming,
overlap, and location audit is in progress:

| Task | Skill | Status |
|---|---|---|
| MCP server, tools, prompts, resources, transport | `mcp-builder` | checked in; pending naming/location audit |
| TypeScript types/module structure | `typescript-expert` | checked in; pending overlap audit |
| Zod schemas/boundary validation | `zod` | checked in; pending overlap audit |
| Bun runtime/scripts/dependencies | `bun-development` | checked in; pending overlap audit |
| Blockbench plugin lifecycle/UI/runtime API | `blockbench-plugins` | checked in; pending naming/location audit |
| Blockbench modelling/`.bbmodel` workflow | `blockbench-use` | recovery item |
| Source Image → modelling brief | `reference-generator` | recovery item |
| Unsupported/disputed evidence | `evidence-gate` | recovery item |

Because Codex is launched from root `BuildIT`, do not assume the nested
`mcp/.agents/skills/` copies are project-wide auto-discovered. Until each one is
audited/migrated, load the required specialist directly by its documented path
when needed.

Do not stack overlapping specialists. Example: a Zod-owned change should not
also load the general TypeScript skill unless a separate TypeScript boundary is
actually involved.

Use `skill-creator` only when a skill itself is being created/updated.

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

- `.agents/skills/` = repository-wide/root skills for the whole BuildIT
  workspace.
- `mcp/.agents/skills/` = existing MCP specialist copies pending audit/migration.
- `mcp/workflow/skills/` = stale historical path; do not recreate it.

The final specialist names and locations are deliberately not mass-migrated.
Audit one skill at a time and classify it `KEEP`, `RENAME`, `MERGE`, `MOVE`, or
`DROP` based on real function and overlap.

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
