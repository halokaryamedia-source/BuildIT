# Skill Activation Matrix

Choose the smallest skill set that covers the active boundary. A skill is used
only when its trigger adds real value.

## Default Skill Budget

| Mode | Default stack |
|---|---|
| Plan | `ponytail` |
| Developing | mandatory `development-brief`; add at most one specialist when it adds real domain value |
| Maintenance | `ponytail` + the smallest diagnostic/specialist that owns the failure |

Discovery, grilling, review, OpenSpec, and navigation tools are conditional
escalations, not always-on layers. Evidence-status escalation is baseline
behavior in root `AGENTS.md`, not another skill.

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

## Repository-Wide Specialist: Blockbench Bedrock Modelling

Use `blockbench-bedrock-modelling` when the **primary semantic owner is the
Bedrock model itself**:

- whole-form interpretation from an approved Model Reference;
- primary/secondary Cuboid geometry;
- silhouette, proportion, orientation, width/depth/footprint, and contacts;
- geometry-vs-texture decisions;
- asset hierarchy/pivots needed for editing or required motion;
- UV/texture scope and visual material/readability decisions;
- required animation from a modelling/rigging standpoint;
- visual correction and completion of the `.bbmodel`.

Canonical path:

`/.agents/skills/blockbench-bedrock-modelling/SKILL.md`

This specialist owns **what model should be built and whether it is visually
coherent**. It does not own the Blockbench API/runtime mechanics used to execute
those decisions.

The historical `blockbench-use` orchestrator is retired as an active pattern.
Its useful modeller responsibility was recovered here, while multi-skill
loading, generic mesh/Hytale/PBR routing, mandatory pre-flight dumps,
checkpoint quotas, and old per-section workflow rules were not recovered.

Do not load this skill for MCP server development or a proved Blockbench runtime
bug. A modelling task may use working MCP tools normally; if a runtime/API defect
blocks modelling, stop and treat that defect as a separate runtime-development
problem rather than stacking specialists.

## Reference Preparation: Workflow, Not Root Skill

Source Image/user intent → five-view Modelling Brief is owned by:

`docs/foundation/04-reference-guide.md`

Use that workflow on an **image-capable ChatGPT / Reference Generator surface**.
Do not add a root `reference-generator` specialist just to mirror the historical
ChatGPT skill.

Boundary:

- Reference Generator surface → create/review the Modelling Brief;
- `blockbench-bedrock-modelling` → consume the approved brief and decide the
  actual model;
- `blockbench-runtime-development` → execute Blockbench runtime mechanics when
  those mechanics are the problem.

If the active surface cannot generate/inspect the required image, preserve the
inputs and hand the task to the image-capable Reference Generator surface. Do not
claim the reference was generated or approved.

The proven historical lineage is `blockbench-reference-studio`; the names
`reference-generator` and `blockbench-reference-generator` are conceptual labels,
not recovered historical skill packages. Do not recreate the old multi-sheet,
manifest/hash/crop-contract, writer-lease, three-approval, or mandatory-ZIP
system without a new proved requirement.

## Repository-Wide Specialist: Blockbench Runtime

Use `blockbench-runtime-development` when the **primary semantic owner is
behavior inside the Blockbench runtime**:

- `BBPlugin` lifecycle, startup, teardown, and runtime permissions;
- Blockbench panels/dialogs/settings/actions and their cleanup;
- embedded panel/component reactivity and lifecycle behavior already used by Local;
- Blockbench globals/APIs and element manipulation mechanics;
- `Undo`, `Canvas`, selection/lookup, events, and runtime state updates;
- behavior that requires live Blockbench to prove.

Canonical path:

`/.agents/skills/blockbench-runtime-development/SKILL.md`

This specialist owns **how Blockbench is manipulated**, not **what model should
be built**. Model shape/proportions/reference interpretation/visual quality stay
with `blockbench-bedrock-modelling`.

Vue is not a separate active specialist. Local uses embedded Blockbench UI
components, not a standalone Vue application architecture. Generic Vue 3,
Vue SFC, Pinia/router, Volar, and `vue-tsc` guidance is retired unless a future
requirement explicitly changes the UI architecture.

If an MCP tool calls Blockbench APIs, choose by the proved owner:

- public MCP contract → `mcp-server-development`;
- correct contract but incorrect Blockbench operation/lifecycle →
  `blockbench-runtime-development`;
- operation works but model shape/quality is wrong →
  `blockbench-bedrock-modelling`.

The old `blockbench-plugins` and `vue-best-practices` packages are retired. Do
not recreate duplicate framework/runtime authorities.

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
- **Evidence escalation:** when a material support/feasibility/compatibility/
  runtime claim is uncertain or disputed, apply root `AGENTS.md` evidence status
  (`CURRENT-PROJECT VERIFIED`, `OFFICIALLY VERIFIED`, `LOCAL PROOF REQUIRED`,
  `UNSUPPORTED`, or `UNKNOWN`). This does not consume the specialist slot.

Do not use critique or evidence labels merely to make routine work look more
rigorous.

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

## Recovery Status

The planned skill/capability recovery pass is complete:

- `blockbench-use` capability → recovered as `blockbench-bedrock-modelling`;
- Reference Generator capability → retained as the `04-reference-guide.md`
  image-capable workflow, not a root Codex skill;
- `evidence-gate` capability → merged into root proof/evidence baseline, not a
  standalone skill.

No additional historical skill should be recreated merely because an old name is
mentioned. New/recovered capabilities require a proved distinct owner and value.

Do not stack overlapping specialists. Choose the semantic owner.

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
- `mcp/.agents/skills/` = retired legacy skill location; there are currently no
  active skills there. Do not repopulate it by default.
- `mcp/.github/skills/` = retired duplicate skill location; do not maintain a
  second active copy of a root canonical skill.
- `mcp/workflow/skills/` = stale historical path; do not recreate it.

Classify each recovered/new capability `KEEP`, `RENAME`, `MERGE`, `MOVE`, `DROP`,
or `RECOVER` based on real function and overlap. A recovered capability may stay
as a baseline/foundation/workflow rather than becoming a skill when that is the
smaller correct owner.

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
