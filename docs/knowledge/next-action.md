# Next Action

## Active Task

- Goal: consolidate the `Local` branch as the canonical, minimal, object-agnostic
  BlockIT workspace before further MCP implementation changes.
- In scope: keep root guidance clean, align docs with the repository that
  actually exists, preserve validated Local rules, make skill routing lean,
  recover only necessary missing skills/workflows from trusted sources, and
  keep one continuation path across chats/sessions.
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
- `development-brief` is checked into `mcp/.agents/skills/` and is the mandatory
  Developing front door. It separates goal from suggested solution, checks
  whether development is actually needed, isolates fixtures from generic
  requirements, chooses Build/Acceptance POVs after owner discovery, defines
  expected output and proof, and re-checks the contract before completion.
- Use GSD-style requirement discovery only when high-impact decisions remain
  unresolved after repository inspection. Do not create a GSD `.planning/`
  tree.
- Use `grilling` when the user asks to stress-test a plan, decision, or idea.
  It finds hidden assumptions through a decision-tree interview; it is not the
  code-review stage.
- Karpathy-inspired anti-slop principles are absorbed into `AGENTS.md` rather
  than loaded as another overlapping skill: think before coding, simplicity
  first, surgical changes, and verifiable goals.
- CodeGraph is an optional source-navigation accelerator only for broad
  cross-file ownership, call-chain, dependency, or blast-radius discovery. It
  is not a skill, source of truth, runtime verifier, or visual-quality judge.
- CodeGraph is not auto-installed or committed during this phase. A bounded
  local trial must prove useful navigation gain without unacceptable residual
  context cost before standard adoption.
- Claude-Mem is not adopted; repository-owned context remains the continuity
  authority.
- Use `code-review` for implemented changes. Use `evidence-gate` for disputed
  or unsupported evidence once its canonical Local copy is recovered.
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
9. engineering proof passes but downstream need fails → task is not complete.

Post-implementation review found and corrected two efficiency issues:

- specialist loading is no longer mandatory when a trivial task has no useful
  specialist domain;
- detailed `development-brief` procedure now lives only in its `SKILL.md`;
  routing docs describe the boundary instead of duplicating the procedure.

Current proof status:

- skill frontmatter/path and routing are checked into Local;
- routing/docs agree on the same mandatory Developing boundary;
- design-level fixture simulations passed the intended decision rules;
- root structure remains unchanged except for the required skill subfolder;
- **Needs Validation:** fresh-session Codex trigger/behavior has not yet been
  exercised as a real installed skill run, so runtime skill-selection behavior
  is not claimed as proven yet.

## Repository Truth

- Workspace skill files actually present in `Local` are under
  `mcp/.agents/skills/`.
- Checked-in workflow/specialist skills now include `development-brief`,
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
- CodeGraph was verified from `colbymchenry/codegraph`; it supports Codex and a
  single default `codegraph_explore` MCP tool, but its own multi-turn benchmark
  reports higher residual retrieval context, so it remains optional pending a
  local trial.
- The old `gsd-build/get-shit-done` repo is archived; the active successor is
  `open-gsd/gsd-core`. Only the requirement-discovery discipline is being
  adopted, not its repository lifecycle.
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

1. Validate `development-brief` in a real fresh-session Codex usage when the
   Local workspace is next run through Codex; if trigger/brief behavior differs
   from the contract, fix the skill before expanding it.
2. Audit existing skill names one by one for clarity and overlap. Rename only
   when the current name materially obscures its function; preserve upstream
   lineage/aliases where needed instead of doing a mass rename.
3. Recover and audit the missing product skills: `blockbench-use`, Reference
   Generator lineage, and `evidence-gate`.
4. Decide final canonical skill/reference ownership only after recovery evidence
   is complete.
5. Run a bounded local CodeGraph trial only if broad MCP source discovery is a
   real bottleneck; compare discovery calls, useful source coverage, and
   residual context before adopting it as a standard environment tool.
6. Audit the MCP implementation against the generic modelling flow and identify
   the smallest proven runtime gaps.
7. Implement bounded fixes one cause at a time using the mode-specific skill
   routing.
8. Validate the modelling workflow across multiple object archetypes before
   claiming general readiness.

## Verification For This Phase

- Root remains limited to the existing minimal entry files/directories.
- `AGENTS.md`, development flow, activation matrix, skill map, decision log, and
  this task snapshot agree on mandatory Developing routing.
- `development-brief` is one concise `SKILL.md`; no prompt engine, persona
  registry, test framework, or parallel planning tree was added.
- Specialist loading is conditional on actual domain value, so the mandatory
  brief does not force a second skill for trivial work.
- Karpathy principles strengthen existing guardrails without creating another
  active skill layer.
- CodeGraph remains optional and uninstalled/uncommitted until a local trial
  proves it improves the specific discovery bottleneck.
- No new memory layer, MCP runtime feature, or model-specific rule is introduced
  during this consolidation.
- Missing skills are reported as missing/recoverable instead of being silently
  simulated.

## Next Step

Start the **one-by-one skill naming audit**. Do not mass-rename skills. Evaluate
one name at a time against its real trigger/function, upstream lineage, overlap,
and migration cost before changing it. MCP runtime behavior remains out of scope
until skill consolidation is complete.
