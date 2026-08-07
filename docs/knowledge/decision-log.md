# Decision Log

Use this note for durable decisions whose **reason** must survive future chats.
Active task state belongs in `next-action.md`, not here.

## Current Decisions

### `vue-best-practices` was merged into `blockbench-runtime-development`

- **Audit decision:** `MERGE + DROP`.
- **Old source:** `mcp/.agents/skills/vue-best-practices/`, a generic Vue 3
  best-practices package centered on `vue-tsc`, Volar, `defineModel`, Pinia,
  router typing, SSR/HMR, SFC/script-setup patterns, and other standalone Vue
  application concerns.
- **Actual useful function in BlockIT:** the small embedded reactive UI/lifecycle
  subset used inside Blockbench panels and dialogs.
- **Canonical owner:** `.agents/skills/blockbench-runtime-development/SKILL.md`.
- **Why it was merged instead of kept:** Local does not expose a standalone Vue
  application boundary or Vue-specific build/typecheck toolchain. Its reactive
  component code is embedded in Blockbench runtime surfaces, so a separate Vue
  specialist would compete with the real runtime owner and encourage unrelated
  Vue architecture/tooling changes.
- **Preserved useful rules:** follow the component/lifecycle shape already used
  by Local; pair subscriptions/listeners with existing cleanup; keep panel-local
  state local when sufficient; verify framework-specific behavior from actual
  Blockbench source/runtime rather than copied version assumptions.
- **Removed from the active skill set:** Vue 3/SFC migration guidance,
  Composition API patterns, `vue-tsc`/Volar configuration, Pinia/router advice,
  SSR/HMR guidance, and other framework features with no demonstrated Local
  requirement.
- **Boundary:** embedded Blockbench UI behavior remains part of
  `blockbench-runtime-development`; TypeScript type-system failures remain with
  `typescript-type-safety`. No Vue specialist is loaded merely because a
  `Panel` component has reactive data/computed/methods.
- **Compatibility:** no alias or replacement Vue skill is kept. Reintroduce a
  dedicated Vue skill only if a future product decision creates a real Vue
  application boundary that the Blockbench runtime specialist cannot own
  cleanly.
- **Proof:** compared the old Vue skill/rules with `mcp/package.json`, the actual
  embedded `mcp/ui/index.ts` panel implementation, and the Blockbench runtime
  specialist. The generic Vue package was removed; no MCP runtime source was
  changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Nested repository `skill-creator` was dropped

- **Audit decision:** `DROP`.
- **Old source:** `mcp/.agents/skills/skill-creator/`, a generic skill-authoring
  package containing creation guidance, generic workflow/output examples,
  `init_skill.py`, `quick_validate.py`, `package_skill.py`, and its license.
- **Actual useful function:** generic skill authoring, not a BlockIT-specific
  project domain.
- **Canonical owner:** use the available global/user `skill-creator` capability
  only when a skill itself is being created or materially revised; do not create
  a root repository copy merely for availability.
- **Why:** the nested package contained no Local-specific skill schema, routing,
  validation rule, or authoring behavior that justified a second copy. Keeping
  it would duplicate capability, increase repository/context surface, and make a
  generic initializer/validator look like project authority.
- **Specific risk removed:** its generic initializer automatically scaffolds
  placeholder `scripts/`, `references/`, and `assets/`, while BlockIT policy says
  files/resources should exist only when the active skill actually needs them.
- **Preserved useful ideas:** concise skills, clear trigger descriptions,
  progressive disclosure, concrete usage examples, and iterative real-use
  improvement remain valid authoring principles when using `skill-creator`.
- **Compatibility:** no alias or replacement repository skill is kept.
  Historical references to the nested copy are lineage only. Reintroduce a
  project skill-authoring package only if a future requirement proves a
  BlockIT-only capability unavailable from the global/user skill.
- **Proof:** audited the nested `SKILL.md`, workflow/output references,
  initializer, validator, and packager; no BlockIT-specific behavior was found.
  The package was removed; no MCP runtime source was changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### `blockbench-plugins` was replaced by focused `blockbench-runtime-development`

- **Audit decision:** `RENAME + MOVE + SLIM + DEDUP`.
- **Old name/source:** `blockbench-plugins`, duplicated under
  `mcp/.agents/skills/` and `mcp/.github/skills/` with generic plugin templates
  and copied Blockbench API/event/element references.
- **Actual useful function in BlockIT:** Blockbench runtime/plugin integration —
  `BBPlugin` lifecycle, startup/teardown, UI/settings/actions, runtime globals,
  permissions, `Undo`/`Canvas`, selection/lookup, element mutation mechanics,
  events, state refresh, and cleanup.
- **New canonical name:** `blockbench-runtime-development`.
- **New canonical location:**
  `.agents/skills/blockbench-runtime-development/SKILL.md`.
- **Removed from active skill:** generic plugin starter scaffolding, custom
  codec/format examples unrelated to current Local needs, broad copied API/event/
  element cheat sheets, and duplicate `.agents`/`.github` authorities.
- **Boundary:** this skill owns **how an operation executes inside Blockbench**.
  It does not own model shape, proportions, cuboid decomposition, reference
  interpretation, texture art direction, or visual-quality judgement; those
  belong to the modelling workflow/skill when recovered. MCP public contracts
  stay with `mcp-server-development`; Bun build behavior stays with
  `bun-tooling`; TypeScript type-system problems stay with
  `typescript-type-safety`.
- **Why:** the old skill mixed plugin tutorials, runtime mechanics, and
  modelling-adjacent language. That made it easy for a technically valid API
  operation to be mistaken for a good modelling decision. Two active copies also
  created avoidable drift risk. Local already contains the real plugin patterns,
  installed Blockbench typings, and the runtime source that should be inspected
  first.
- **Preserved useful rules:** lifecycle cleanup, correct runtime owner, reversible
  mutations when appropriate, targeted Canvas/state refresh, permission-aware
  native modules, and live Blockbench proof only when the claim requires it.
- **Compatibility:** no alias or duplicate copy is kept. Historical
  `blockbench-plugins` references are lineage only; active routing uses
  `blockbench-runtime-development`.
- **Proof:** compared both old skill copies with `mcp/index.ts`, `mcp/ui/index.ts`,
  `mcp/server/tools/cubes.ts`, installed Blockbench typing usage, and current
  specialist boundaries. Both old skill packages were removed; no MCP runtime
  implementation was changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### `bun-development` was replaced by focused `bun-tooling`

- **Audit decision:** `RENAME + MOVE + SLIM`.
- **Old name/source:** `bun-development`, a broad generic Bun development guide
  under `mcp/.agents/skills/`.
- **Actual useful function in BlockIT:** Bun-specific build/tooling behavior —
  `Bun.build`, build plugins/loaders, `Bun.file`, `Bun.write`, `Bun.argv`, Bun
  package scripts, `bunx`, dependency resolution, and lockfile behavior when Bun
  is the proved owner.
- **New canonical name:** `bun-tooling`.
- **New canonical location:** `.agents/skills/bun-tooling/SKILL.md`.
- **Removed from active skill:** new-project scaffolding, Bun HTTP/WebSocket/
  SQLite/password examples, Node→Bun migration guidance, generic performance
  advice, broad test-runner tutorials, and unrelated Bun-native API examples.
- **Boundary:** ordinary TypeScript/MCP/Blockbench work does not load this skill
  merely because commands use Bun. MCP/public-contract work stays with
  `mcp-server-development`; TypeScript type-system work stays with
  `typescript-type-safety`; Blockbench runtime/API work stays with
  `blockbench-runtime-development`.
- **Why:** Local genuinely depends on Bun-specific build behavior, including
  `Bun.build` and custom Bun build plugins, so dropping Bun knowledge entirely
  would lose useful capability. The old guide was still far too broad and could
  encourage migrations, new APIs, or performance work unrelated to the actual
  repository.
- **Preserved useful rules:** reuse existing package scripts; inspect the actual
  build/plugin owner; make the smallest Bun-specific change; preserve
  Blockbench packaging compatibility; run only the smallest relevant Bun check
  in Codex local.
- **Compatibility:** no alias skill is kept. Historical `bun-development`
  references are lineage only; active routing uses `bun-tooling`.
- **Proof:** compared the old skill with `mcp/package.json`, `mcp/build/index.ts`,
  `mcp/build/plugins.ts`, and current specialist boundaries. The generic skill
  was removed; no MCP runtime implementation was changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Standalone `zod` skill was merged into `mcp-server-development`

- **Audit decision:** `MERGE + DROP`.
- **Old name/source:** `zod`, a generic Zod best-practices package under
  `mcp/.agents/skills/` with a compiled guide plus 43 rule references.
- **Actual useful function in BlockIT:** MCP input-contract semantics — accepted
  values, defaults/optionality, refinements, shared schemas, untrusted input,
  error clarity, and the build-time/runtime validation boundary.
- **Canonical owner:** `.agents/skills/mcp-server-development/SKILL.md`.
- **Why it was merged instead of renamed:** Local uses Zod primarily as the
  schema mechanism for MCP tool/public inputs and generated MCP documentation.
  Keeping a separate schema skill would split one semantic owner across two
  specialists and compete for the one-specialist Developing budget.
- **Removed from the active skill set:** the generic 43-rule pack, form/i18n
  patterns, Zod-Mini/bundle/performance guidance, branded-type/strict-mode
  advice already owned elsewhere, and framework patterns with no demonstrated
  BlockIT need.
- **Preserved useful rules:** validate untrusted input at the boundary; make
  optional/default/refinement semantics match execution; reuse shared schemas;
  avoid duplicate validation; keep schema construction free of Blockbench
  globals; move live-Blockbench checks into execution; keep errors actionable.
- **Boundary:** TypeScript compiler/type-system problems belong to
  `typescript-type-safety`; Bun-specific build/tooling belongs to `bun-tooling`;
  Blockbench runtime belongs to `blockbench-runtime-development`.
- **Compatibility:** no alias or deprecated Zod skill is kept. Historical `zod`
  skill references are lineage only; ordinary MCP schema work routes through
  `mcp-server-development`.
- **Proof:** compared the old Zod skill/rule pack with `mcp/lib/zodObjects.ts`,
  `mcp/lib/factories.ts`, `mcp/AGENTS.md`, and the current MCP specialist. The
  standalone Zod package was removed; no MCP runtime source was changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### `typescript-expert` was replaced by focused `typescript-type-safety`

- **Audit decision:** `RENAME + MOVE + SLIM`.
- **Old name/source:** `typescript-expert`, a broad generic TypeScript/JavaScript
  expertise package under `mcp/.agents/skills/`.
- **Actual useful function:** difficult TypeScript type-system work — compiler
  type compatibility/inference, generics/unions/narrowing, unsafe assertions,
  declaration/external-library typing, public TypeScript type contracts, and
  compile-time module typing when TypeScript owns the failure.
- **New canonical name:** `typescript-type-safety`.
- **New canonical location:** `.agents/skills/typescript-type-safety/SKILL.md`.
- **Removed from active skill:** proactive use for every TS/JS task, automatic
  project/tooling scans, generic npm validation, Nx/Turborepo/monorepo advice,
  Biome/ESLint migration, JavaScript→TypeScript migration, broad build/type
  performance checklists, generic tsconfig/utility-type reference bundles, and
  the Python TypeScript diagnostic script.
- **Boundary:** normal `.ts` implementation uses the domain owner instead of a
  TypeScript specialist; MCP protocol and MCP input-schema semantics belong to
  `mcp-server-development`; Bun-specific build/tooling belongs to `bun-tooling`;
  Blockbench runtime/API work belongs to `blockbench-runtime-development`.
- **Why:** BlockIT is already a strict TypeScript/Bun project. Loading a generic
  "TypeScript expert" for almost every source edit would consume the one
  specialist slot, overlap more specific owners, and encourage unrelated
  tooling/migration work. TypeScript needs a specialist only when the type
  system itself is the hard part.
- **Preserved useful ideas:** sound narrowing, readable type contracts, minimal
  assertions, fix the shared type owner instead of adding repeated casts, and
  targeted compiler proof when available.
- **Compatibility:** no alias skill is kept. Historical `typescript-expert`
  references are lineage only; active routing uses `typescript-type-safety`.
- **Proof:** audited the old 14 KB skill, reference bundle, diagnostic script,
  current `mcp/tsconfig.json`, and adjacent MCP/Zod/Bun/Blockbench boundaries.
  No MCP runtime source was changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### `mcp-builder` was replaced by focused `mcp-server-development`

- **Audit decision:** `RENAME + MOVE + SLIM`, later expanded only to absorb the
  MCP-owned Zod input-contract rules after the Zod audit.
- **Old name/source:** `mcp-builder`, a generic MCP-server skill package kept
  under `mcp/.agents/skills/`.
- **Actual useful function:** MCP server/public-contract boundary — tools,
  resources, prompts, input schemas, registration, request/result semantics,
  annotations, Streamable HTTP transport/session behavior, and MCP SDK
  compatibility.
- **New canonical name:** `mcp-server-development`.
- **New canonical location:** `.agents/skills/mcp-server-development/SKILL.md`
  so Codex launched from root `BuildIT` can use it as a project specialist.
- **Removed from active skill:** Python/FastMCP guidance, generic external-API
  client scaffolding, pagination-by-default rules, generic Node project
  scaffolding, mandatory broad build/test flow, fixed 10-question MCP evaluation
  workflow, and its Python/XML evaluation scripts.
- **Boundary:** TypeScript type-system issues belong to
  `typescript-type-safety`; Bun-specific build/tooling belongs to `bun-tooling`;
  Blockbench runtime/API mechanics belong to `blockbench-runtime-development`.
  Modelling judgement stays separate. MCP Zod/input-schema semantics stay inside
  this MCP contract owner rather than using another specialist.
- **Why:** the old skill was designed for building arbitrary MCP integrations,
  while BlockIT already has a TypeScript/Bun/official-SDK Blockbench MCP
  architecture. Keeping the generic package would add irrelevant context and
  encourage new scaffolding/evaluations instead of changing the existing owner.
- **Preserved useful ideas:** official MCP SDK, accurate tool descriptions,
  protocol annotations, focused result semantics, protocol-aware transport, and
  concise input-contract rules matched to the actual Local architecture.
- **Compatibility:** do not keep an alias skill. Historical references to
  `mcp-builder` are lineage only; active routing uses
  `mcp-server-development`.
- **Proof:** audited the old skill/package, compared it with `mcp/package.json`,
  `mcp/server/server.ts`, `mcp/server/net.ts`, `mcp/lib/factories.ts`, and
  adjacent specialist scopes. No MCP runtime behavior was changed.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Repository state is the project memory

- **Decision:** new ChatGPT and Codex sessions resume from repository owners,
  not reconstructed chat history.
- **Decision:** `AGENTS.md` owns working behavior; `CONTEXT.md` owns stable facts;
  `docs/knowledge/next-action.md` owns the single active task/state;
  `decision-log.md` owns durable reasons; `docs/foundation/` owns durable
  product/modelling policy; source + relevant proof own runtime truth.
- **Decision:** before asking the user to repeat prior context, the agent must
  follow the repository boot path and recover what the repo already knows.
- **Decision:** before ending material work, update `next-action.md` when goal,
  status, blocker, proof state, or next step changed.
- **Why:** re-explaining old context from memory can introduce drift, omissions,
  and new assumptions. Version-controlled project memory is inspectable,
  correctable, and shared by ChatGPT → GitHub and Codex local.
- **Tradeoff:** repository notes must stay current and concise; stale docs are a
  real defect and must be corrected rather than compensated for with chat lore.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Agent judgment is independent from user-suggested methods

- **Decision:** the user owns the desired outcome, but a suggested technical
  method is not automatically a requirement.
- **Decision:** the agent must reject or redirect a method when evidence shows it
  is invalid, contradicts an authoritative decision, repeats a disproven path,
  creates unsupported behavior, adds disproportionate complexity, or is likely
  to reduce product/output quality.
- **Decision:** rejection must include a concrete reason and the smallest better
  path that still serves the user's goal.
- **Decision:** harmless preferences and equally valid choices should not be
  challenged merely to appear critical.
- **Why:** unconditional agreement is a source of AI slop. Useful agency means
  protecting the result, not maximizing agreement with every proposed method.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Developing supports ChatGPT → GitHub and Codex local

- **Decision:** the same `development-brief` contract applies in both execution
  channels. Goal, Build POV, Acceptance POV, scope, and acceptance criteria do
  not change because the agent surface changes.
- **Decision:** ChatGPT → GitHub prepares repository work using static evidence;
  it must not invent local shell, MCP, Blockbench, or visual/runtime proof.
- **Decision:** Codex local performs final targeted local proof only when the
  claim actually requires the local environment.
- **Decision:** both channels use a **minimum useful proof** budget: choose the
  cheapest check that can falsify the likely failure and stop when acceptance
  has sufficient evidence.
- **Decision:** do not create tests, CI, fixtures, screenshots, builds, or review
  stages solely for ceremony.
- **Why:** forcing local-style validation into GitHub creates fake/blocking work;
  running every available check in Codex wastes time/context without guaranteed
  confidence gain.
- **Tradeoff:** a runtime-related GitHub change can be implemented before live
  proof, so reports must distinguish **implemented** from **verified** when it
  matters.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Developing uses a mandatory Dual-POV development brief

- **Decision:** every Developing task starts with `development-brief`.
- **Decision:** the user does not need to write an expert prompt. The skill
  grounds the real goal, separates goal from suggested method, detects execution
  channel, determines whether development is needed, isolates fixtures from
  generic requirements, chooses Build/Acceptance POVs after owner discovery,
  and defines 2–5 provable acceptance criteria plus proof budget.
- **Decision:** `no change required` is a valid outcome; trivial work uses a fast
  path without pointless specialist loading.
- **Decision:** before `Selesai`, the same brief is rechecked so engineering
  success cannot hide downstream failure or scope drift.
- **Why:** incomplete prompts, premature role selection, method-following,
  fixture overfitting, and technically-correct-but-useless output are recurring
  ways AI can distort a development goal.
- **Validation:** design was stress-tested with `skill-creator` principles and
  three `grilling` rounds. ChatGPT → GitHub use is active; local runtime behavior
  is proven only when Codex performs the relevant local task.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Repository-wide workflow skills live at root

- **Decision:** because Codex is launched from root `BuildIT`, repository-wide
  skills belong under `.agents/skills/`.
- **Decision:** `development-brief` is canonical at
  `.agents/skills/development-brief/SKILL.md`.
- **Decision:** approved project specialists live at root; recover/migrate them
  one at a time only after function/name/overlap is approved.
- **Decision:** `mcp/.agents/skills/` and `mcp/.github/skills/` are now legacy
  locations with no active skills; do not repopulate them merely to preserve an
  old layout.
- **Why:** root-scoped guidance must be available when Codex starts at repository
  root, while duplicate/nested skill roots create discovery ambiguity and drift.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### Skill routing is deliberately lean

- **Decision:** Plan uses `ponytail`; Developing uses mandatory
  `development-brief` plus at most one useful specialist; Maintenance uses
  `ponytail` plus the smallest diagnostic/specialist owning the failure.
- **Decision:** GSD discovery, `grilling`, `code-review`, `evidence-gate`,
  CodeGraph, and OpenSpec are conditional escalations, not default layers.
- **Decision:** skills are audited one at a time and classified `KEEP`, `RENAME`,
  `MERGE`, `MOVE`, `DROP`, or `RECOVER` based on real trigger/function and
  overlap—not upstream naming.
- **Decision:** Karpathy-inspired simplicity/surgical-change principles are
  baseline `AGENTS.md` behavior rather than another skill.
- **Decision:** CodeGraph remains an optional navigation accelerator; Claude-Mem
  is not adopted.
- **Why:** overlapping skill stacks create authority ambiguity, context bloat,
  and ceremony without proving better output.
- **Owner:** workspace agent
- **Date:** 2026-08-08

### The reference is a modelling brief

- **Decision:** the five-view image supplies visual proportions, landmarks,
  silhouette, contacts, and style; declared dimensions supply the numeric
  geometry target.
- **Decision:** image pixels, dimension-line lengths, subject bounds, and image
  aspect are not calibration data.
- **Why:** generated reference sheets are useful visual guides but are not
  guaranteed to be metrically consistent.
- **Tradeoff:** cube decisions require modeller reasoning and visual review.
- **Owner:** Codex
- **Date:** 2026-07-31

### No automatic mesh-to-cuboid modelling

- **Decision:** SF3D/mesh decomposition do not create the geometry path;
  `place_cube` and `modify_cube` remain technical operations.
- **Why:** a rough mesh cannot decide semantic parts, contacts, pivots, or the
  intended cuboid decomposition.
- **Owner:** Codex
- **Date:** 2026-07-31

### SF3D and similarity scoring are rejected

- **Decision:** SF3D is not used for geometry, volume fitting, texture guidance,
  or validation.
- **Decision:** projection/IoU/silhouette/similarity scores are not geometry
  authority, approval, or quality proof.
- **Why:** prior results produced bias and false confidence rather than evidence
  of the intended Blockbench model.
- **Owner:** Codex
- **Date:** 2026-07-31

### Package validity is structural only

- **Decision:** package validation is structural/handoff status; it never proves
  visual correctness or cube accuracy.
- **Owner:** Codex
- **Date:** 2026-07-31

### Visual and structural evidence stay separate

- **Decision:** valid coordinates, hierarchy, bounds, contacts, successful MCP
  calls, and saved files do not constitute visual approval.
- **Why:** a structurally valid model can still be the wrong shape.
- **Owner:** Codex
- **Date:** 2026-07-25

### MCP owns technical geometry operations

- **Decision:** MCP owns elements, groups, parent-child structure, positions,
  pivots, rotations, bounds, and structural inspection.
- **Decision:** MCP does not automatically infer anatomy or semantic cube
  decomposition from an image/mesh.
- **Owner:** Codex
- **Date:** 2026-07-31

## Superseded Decisions

The earlier policy that user approval made the image a metric authority, that
orthographic overlays/numeric similarity could approve geometry, or that SF3D
could produce the Cube Draft is superseded.

`PLAN_READY` replay, per-cube locked transforms, IoU approval, calibration
layers, and the offline Cuboid Blueprint gate were removed after repeated visual
failure and must not be reintroduced as authority.

The earlier universal `ponytail + one specialist` stack is superseded for
Developing by mandatory `development-brief` with at most one useful specialist.

The earlier assumption that all workspace skills are canonically under
`mcp/.agents/skills/` is superseded. Root-wide skills use `.agents/skills/`;
legacy nested skill locations currently contain no active skills.

The generic `mcp-builder` package is superseded by the focused root
`mcp-server-development` specialist.

The generic `typescript-expert` package is superseded by the focused root
`typescript-type-safety` specialist.

The standalone generic `zod` skill is superseded by the MCP input-contract rules
inside `mcp-server-development`.

The generic `bun-development` skill is superseded by the focused root
`bun-tooling` specialist.

The duplicate generic `blockbench-plugins` packages are superseded by the
focused root `blockbench-runtime-development` specialist. Runtime mechanics and
modelling judgement remain separate owners.

The nested generic `skill-creator` package is retired. Skill authoring uses the
available global/user capability unless a future BlockIT-only need is proven.

The generic `vue-best-practices` package is retired. Its relevant embedded UI
lifecycle/reactivity guidance is owned by `blockbench-runtime-development`.

## Rule

- Do not turn a diagnostic number into a modelling decision.
- Do not invent missing geometry from an ambiguous image.
- Do not convert user-suggested methods into requirements without validation.
- Mark unproven runtime behavior as `Needs Validation`.

## Parent

- [Knowledge Dashboard](index.md)
- [Open Spec Guide](decisions/open-spec-guide.md)
