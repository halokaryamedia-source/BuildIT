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
- Status: `DOCUMENTATION_CONSOLIDATION`.

## Current Direction

- `Local` remains the product and development authority.
- The official modelling flow is generic and whole-form-first; fixtures and
  Golden Samples are quality/evidence references, not object-specific runtime
  templates.
- Root files stay minimal. Existing documentation owners are reused instead of
  creating parallel planning/state files.
- The normal skill stack is `ponytail + one specialist skill`.
- Use GSD-style requirement discovery only when the user intent is clear but
  high-impact decisions are missing. Do not create a GSD `.planning/` tree.
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

## Repository Truth

- Workspace skill files actually present in `Local` are under
  `mcp/.agents/skills/`.
- Checked-in specialists currently include `mcp-builder`,
  `typescript-expert`, `zod`, `bun-development`, and `blockbench-plugins`.
- `blockbench-use`, `reference-generator`, and `evidence-gate` are named by
  Local policy but their canonical Local copies are still recovery items.
- Older docs that name `mcp/workflow/skills/` or a Local
  `mcp/workflow/reference-generator/` must not be treated as proof that those
  paths exist.
- Ponytail has a verified upstream source at `DietrichGebert/ponytail`.
- Matt Pocock `grilling` has a verified upstream source at
  `mattpocock/skills`.
- Karpathy-inspired guidelines were verified from
  `multica-ai/andrej-karpathy-skills`; their useful rules are now absorbed into
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

1. Finish the docs-vs-repository truth audit and remove stale routing/path
   claims without creating replacement folders speculatively.
2. Recover and audit only the missing skills needed by the current product:
   `blockbench-use`, Reference Generator lineage, and `evidence-gate`.
3. Decide the final canonical skill/reference ownership only after recovery
   evidence is complete.
4. Run a bounded local CodeGraph trial only if broad MCP source discovery is a
   real bottleneck; compare discovery calls, useful source coverage, and
   residual context before adopting it as a standard environment tool.
5. Audit the MCP implementation against the generic modelling flow and identify
   the smallest proven runtime gaps.
6. Implement bounded fixes one cause at a time using `ponytail + one
   specialist`.
7. Validate the modelling workflow across multiple object archetypes before
   claiming general readiness.

## Verification For This Phase

- Root remains limited to the existing minimal entry files/directories.
- `AGENTS.md`, `CONTEXT.md`, the activation matrix, decision log, Open Spec
  Guide, and this task snapshot agree on routing and source ownership.
- Karpathy principles strengthen existing guardrails without creating another
  active skill layer.
- CodeGraph remains optional and uninstalled/uncommitted until a local trial
  proves it improves the specific discovery bottleneck.
- No new planning framework, memory layer, MCP feature, or model-specific rule
  is introduced during documentation consolidation.
- Missing skills are reported as missing/recoverable instead of being silently
  simulated.

## Next Step

Finish the repository-truth and recovery map for `blockbench-use`,
`reference-generator`, and `evidence-gate`; do not change MCP runtime behavior
until that map is complete.
