# Next Action

## Active Task

- Goal: consolidate the `Local` branch as the canonical, minimal, object-agnostic
  BlockIT workspace before further MCP implementation changes.
- In scope: keep root guidance clean, align docs with the repository that
  actually exists, preserve validated Local rules, make skill routing lean,
  support both ChatGPT → GitHub and Codex local development, recover only
  necessary missing skills/workflows from trusted sources, and keep one
  continuation path across chats/sessions.
- Out of scope: model-specific geometry fixes, Zebra-specific runtime rules,
  MCP feature development, full GSD installation, full OpenSpec lifecycle,
  Claude-Mem adoption, wholesale Rework/Sample merges, and speculative
  architecture.
- Status: `SKILL_ROUTING_CONSOLIDATION`.

## Current Direction

- `Local` remains the product and development authority.
- The official modelling direction is generic and whole-form-first; fixtures
  and Golden Samples are quality/evidence references, not object-specific
  runtime templates.
- Root files stay minimal. Existing documentation owners are reused instead of
  creating parallel planning/state files.
- Skill routing is mode-specific:
  - Plan → `ponytail`;
  - Developing → mandatory `development-brief`, plus at most one specialist
    when it adds real domain value; trivial fast-path work may use
    `development-brief` alone;
  - Maintenance → `ponytail + smallest diagnostic/specialist`.
- `development-brief` supports both execution channels:
  - **ChatGPT → GitHub:** repository inspection/writes only; no invented local
    shell, Blockbench runtime, or local test proof;
  - **Codex local:** local build/test/runtime proof only when available and
    materially useful.
- Both channels use the same goal, Build POV, Acceptance POV, scope, and
  acceptance criteria. Only the available proof changes.
- Validation uses a **minimum useful proof** budget. Do not create or run tests,
  CI, builds, fixtures, screenshots, or review stages merely for ceremony.
- GitHub-only work may safely prepare a runtime-related change without fake
  local validation; any material live/runtime claim that remains unproven is
  reported as `Perlu pemeriksaan` with one exact local proof step.
- For ChatGPT → GitHub, repo-local skills are invoked through the repository
  boot path (`README` → `AGENTS` → `CONTEXT` → `next-action` → relevant skill),
  not by assuming that a GitHub `SKILL.md` is installed as a ChatGPT product
  Skill.
- Use GSD-style requirement discovery only when high-impact decisions remain
  unresolved after repository inspection. Do not create a GSD `.planning/`
  tree.
- Use `grilling` when the user asks to stress-test a plan, decision, or idea.
- Karpathy-inspired anti-slop principles remain baseline guardrails rather than
  another skill layer.
- CodeGraph remains an optional source-navigation accelerator for broad
  cross-file discovery only.
- Claude-Mem is not adopted; repository-owned context remains the continuity
  authority.
- Use `code-review` only when independent critique adds real value beyond the
  final `development-brief` gate. Use `evidence-gate` for disputed/unsupported
  proof once its canonical Local copy is recovered.
- Keep the lightweight Local Open Spec Guide. Use a full OpenSpec proposal only
  for a genuinely cross-cutting public contract, migration, or multi-phase
  change.

## Development Brief Validation

The first mandatory Developing skill was designed with `skill-creator`
principles and stress-tested through three `grilling` rounds.

Covered adversarial prompt cases:

1. vague problem statement → do not select a solution/POV prematurely;
2. user suggests a technically plausible but rejected method → preserve the
   goal and treat the method as a suggestion;
3. requested feature already exists → allow a verified no-code outcome;
4. technical MCP output used for modeller benefit → modeller remains Acceptance
   POV while Codex/MCP consumption is an interface constraint;
5. docs/source conflict → stop at `Needs Validation` rather than choose silently;
6. Zebra/Rhino/model example → fixture does not become generic runtime policy;
7. trivial typo → fast path without ceremony or pointless specialist loading;
8. investigation expands scope → reframe rather than silently widen;
9. engineering proof passes but downstream need fails → task is not complete;
10. GitHub-only execution → do not fabricate local/runtime proof;
11. Codex local execution → do not run broad checks merely because they exist.

Post-implementation review corrected these efficiency issues:

- specialist loading is not mandatory when a trivial task has no useful
  specialist domain;
- detailed `development-brief` procedure lives only in its `SKILL.md`;
- proof is now execution-channel aware rather than assuming local test access;
- `code-review` and broad validation are conditional, not automatic stages.

Current proof status:

- skill frontmatter/path and routing are checked into Local;
- ChatGPT → GitHub repository flow is being exercised in this session;
- routing/docs agree on the same mandatory Developing boundary and proof budget;
- root structure remains minimal;
- **Needs Validation:** Codex-local skill discovery/execution behavior still
  needs one normal local usage trial when work next moves to Codex; this does
  not block the current ChatGPT → GitHub workflow.

## Repository Truth

- Workspace skill files actually present in `Local` are under
  `mcp/.agents/skills/`.
- Checked-in workflow/specialist skills include `development-brief`,
  `mcp-builder`, `typescript-expert`, `zod`, `bun-development`, and
  `blockbench-plugins`.
- `blockbench-use`, `reference-generator`, and `evidence-gate` are named by
  Local policy but their canonical Local copies are still recovery items.
- Older docs that name `mcp/workflow/skills/` or a Local
  `mcp/workflow/reference-generator/` must not be treated as proof that those
  paths exist.
- Ponytail has a verified upstream source at `DietrichGebert/ponytail`.
- Matt Pocock `grilling` has a verified upstream source at
  `mattpocock/skills`.
- Karpathy-inspired guidelines were verified from
  `multica-ai/andrej-karpathy-skills`; their useful rules are absorbed into
  Local behavior instead of creating another skill dependency.
- CodeGraph was verified from `colbymchenry/codegraph`; it remains optional.
- The old `gsd-build/get-shit-done` repo is archived; the active successor is
  `open-gsd/gsd-core`. Only the requirement-discovery discipline is adopted.
- Rework still contains the Black Rhinoceros Golden Sample and the historical
  `blockbench-reference-studio`; they are recoverable reference material, not
  authority over Local.

## Preserved Findings From The Geometry Investigation

- Zebra is a test fixture only; no Zebra anatomy belongs in runtime rules.
- Basic MCP primitives, groups, rotations, screenshots, undo, framing, and the
  single-active-session lifecycle have been live-proven in Local.
- The H1-H12 and transition experiments showed that locally valid cubes and
  contacts do not guarantee a coherent global silhouette.
- The central unresolved modelling problem is generic: translating an approved
  visual reference into a coherent whole-form cuboid composition without
  unsupported guesses or compensating geometry.
- The durable conclusions and failure modes remain documented in
  `docs/knowledge/reviews/mcp-geometry-ai-slop-audit.md`; the previous detailed
  experiment timeline remains available in Git history.

## Work Sequence

1. Continue the current **ChatGPT → GitHub** workflow using the channel-aware
   `development-brief` and minimum useful proof budget.
2. Audit existing skill names one by one for clarity and overlap. Rename only
   when the current name materially obscures its function; preserve upstream
   lineage/aliases where needed instead of doing a mass rename.
3. Recover and audit the missing product skills: `blockbench-use`, Reference
   Generator lineage, and `evidence-gate`.
4. Decide final canonical skill/reference ownership only after recovery evidence
   is complete.
5. Run a bounded local CodeGraph trial only if broad MCP source discovery is a
   real bottleneck.
6. Audit the MCP implementation against the generic modelling flow and identify
   the smallest proven runtime gaps.
7. Implement bounded fixes one cause at a time using the mode/channel-specific
   routing.
8. When development next moves to Codex local, perform one normal usage trial of
   `development-brief`; do not create a dedicated test harness just for skill
   discovery unless a real failure appears.
9. Validate the modelling workflow across multiple object archetypes before
   claiming general readiness.

## Verification For This Phase

- Root remains limited to the existing minimal entry files/directories.
- `README`, `AGENTS.md`, development flow, activation matrix, decision log, and
  this task snapshot agree on the two execution channels.
- `development-brief` remains one concise repo-owned skill; no prompt engine,
  persona registry, test framework, or parallel planning tree was added.
- Validation is proportional to risk and channel capability; broad or duplicate
  checks are explicitly discouraged.
- No new memory layer, MCP runtime feature, or model-specific rule is introduced
  during this consolidation.
- Missing skills are reported as missing/recoverable instead of being silently
  simulated.

## Next Step

Start the **one-by-one skill naming audit** through the current ChatGPT → GitHub
workflow. Do not mass-rename skills. Evaluate one name at a time against its real
trigger/function, upstream lineage, overlap, and migration cost before changing
it. MCP runtime behavior remains out of scope until skill consolidation is
complete.
