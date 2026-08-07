# Decision Log

Use this note for durable decisions whose **reason** must survive future chats.
Active task state belongs in `next-action.md`, not here.

## Current Decisions

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
- **Boundary:** TypeScript compiler/type-system problems still belong to
  `typescript-type-safety`; Bun tooling and Blockbench runtime remain separate
  pending their own audits.
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
  `mcp-server-development`; Bun tooling belongs to the Bun specialist;
  Blockbench runtime/API work belongs to the Blockbench specialist.
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
  `typescript-type-safety`; Bun tooling belongs to the Bun specialist;
  Blockbench plugin/UI/runtime/model manipulation belongs to the Blockbench
  plugin specialist. MCP Zod/input-schema semantics now stay inside this MCP
  contract owner rather than using another specialist.
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
- **Decision:** audited specialists that must be available project-wide are
  moved to root one at a time after their function/name is approved.
- **Decision:** remaining `mcp/.agents/skills/` specialists stay temporary nested
  copies pending one-by-one audit; do not mass-migrate them.
- **Why:** root-scoped guidance must be available when Codex starts at the
  repository root, while specialist cleanup should not be mixed with an
  unreviewed mass move/rename.
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
`mcp/.agents/skills/` is superseded: root-wide skills use `.agents/skills/`,
while remaining nested specialists are pending one-by-one audit.

The generic `mcp-builder` package is superseded by the focused root
`mcp-server-development` specialist.

The generic `typescript-expert` package is superseded by the focused root
`typescript-type-safety` specialist.

The standalone generic `zod` skill is superseded by the MCP input-contract rules
inside `mcp-server-development`.

## Rule

- Do not turn a diagnostic number into a modelling decision.
- Do not invent missing geometry from an ambiguous image.
- Do not convert user-suggested methods into requirements without validation.
- Mark unproven runtime behavior as `Needs Validation`.

## Parent

- [Knowledge Dashboard](index.md)
- [Open Spec Guide](decisions/open-spec-guide.md)
