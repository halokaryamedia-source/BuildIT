# Decision Log

Use this note for the why behind the current direction.

## Current Decisions

### Developing uses a mandatory Dual-POV development brief

- Decision: every **Developing** task starts with the checked-in
  `development-brief` skill. Add one implementation specialist only when the
  task has a real specialist domain; trivial fast-path work may use
  `development-brief` alone.
- Decision: the user is not required to write an expert prompt. The skill must
  ground the request in repository evidence, separate the real goal from a
  suggested implementation, and decide whether development is actually needed.
- Decision: the Build POV is chosen only after the actual problem owner is
  understood; the Acceptance POV represents the downstream beneficiary. An
  intermediate MCP/API/agent consumer is recorded as an interface constraint,
  not another persona.
- Decision: a named object, fixture, Golden Sample, or bug example is evidence,
  not a generic runtime requirement unless the user explicitly requests
  object-specific behavior.
- Decision: 2-5 provable acceptance criteria and a proof path are defined before
  non-trivial implementation. The same brief is checked again before `Selesai`
  so engineering success cannot hide downstream failure or scope drift.
- Decision: `no change required` is a valid Developing outcome when existing
  behavior already satisfies the goal. Trivial changes use a fast path rather
  than a full visible ceremony.
- Why: incomplete prompts, premature expert-role selection, solution-following,
  fixture overfitting, and technically-correct-but-useless outputs are recurring
  ways an AI can distort the development goal even when individual code changes
  look plausible.
- Tradeoff: Developing always pays the small cost of one normalization skill,
  but it does not load Ponytail as an extra layer and does not load a specialist
  when that specialist adds no domain value.
- Validation: the design was stress-tested with `skill-creator` principles and
  three rounds of `grilling`, including vague prompts, user-suggested wrong
  methods, already-existing features, technical interface changes, docs/source
  conflicts, object-specific fixtures, trivial edits, scope growth, and
  engineering-pass/acceptance-fail cases. Post-implementation review also
  removed duplicated procedure text from routing docs and added a
  specialist-free trivial fast path. The checked-in skill still needs a real
  fresh-session Codex usage trial before claiming runtime trigger behavior is
  fully proven.
- Owner: Codex
- Date: 2026-08-08

### Anti-slop complements do not expand the default skill stack

- Decision: Karpathy-inspired guidelines are absorbed into root `AGENTS.md` as
  behavioral guardrails instead of being installed or loaded as a separate
  skill.
- Decision: CodeGraph is an optional external navigation accelerator for
  cross-file structural discovery, call-chain tracing, ownership discovery,
  and blast-radius analysis. It is not a specialist skill, source of truth,
  runtime verifier, or visual-quality judge.
- Decision: CodeGraph is not auto-installed and `.codegraph/` state is not
  committed during this consolidation phase. A separate local trial must prove
  that fewer discovery calls outweigh its residual-context cost before it can
  become a standard environment dependency.
- Decision: Claude-Mem is not adopted. Repository-owned context and decisions
  remain the continuity authority.
- Why: the useful Karpathy rules overlap with Local guardrails, so a second
  skill would add instruction noise. CodeGraph adds a distinct navigation
  capability but its own multi-turn measurements show that large graph
  responses can leave more retrieval context resident even when they reduce
  tool-call throughput.
- Tradeoff: cross-module investigation may still use ordinary source search
  when CodeGraph is unavailable or the task is small; continuity requires
  maintaining the existing explicit docs instead of relying on automatic
  memory.
- Validation: compared Local routing with the upstream Karpathy-inspired
  guideline repository, CodeGraph MCP/tool documentation and context-occupancy
  benchmark, and Claude-Mem architecture/configuration.
- Owner: Codex
- Date: 2026-08-08

### Skill routing is deliberately lean

- Decision: skill routing is mode-specific instead of using one universal stack:
  Plan uses `ponytail`; Developing always uses `development-brief` and at most
  one specialist when needed; Maintenance uses `ponytail + the smallest
  diagnostic/specialist`.
- Decision: GSD-style discovery is used only when the user's prompt leaves
  unresolved high-impact decisions; the full GSD `.planning/` lifecycle is not
  introduced into this repo.
- Decision: `grilling` is used to stress-test a plan, decision, or idea when the
  user asks for adversarial scrutiny. It is not a replacement for code review.
- Decision: implemented changes use `code-review`; unsupported or disputed
  evidence uses `evidence-gate` when that skill is available.
- Decision: the lightweight Local Open Spec Guide remains the default decision
  discipline. A full OpenSpec lifecycle is reserved for genuinely cross-cutting
  contract, migration, or multi-phase changes.
- Decision: current checked-in workspace skills are read from
  `mcp/.agents/skills/`. The long-term canonical home for recovered skills is
  `Needs Validation`; no missing directory is created just to match stale docs.
- Why: more simultaneously loaded skills create overlapping authority, context
  bloat, and extra ceremony without proving better modelling or MCP behavior.
- Tradeoff: some large changes may need an explicit escalation to GSD discovery,
  grilling, OpenSpec, or review rather than receiving those layers by default.
- Validation: routing was compared with the current Local repository, the
  upstream Ponytail source, Matt Pocock `grilling`, active GSD Core discussion
  workflow, `skill-creator`, and the existing Local Open Spec Guide.
- Owner: Codex
- Date: 2026-08-08

### The reference is a modelling brief

- Decision: the five-view image supplies visual proportions, landmarks,
  silhouette, contacts, and style.
- Decision: the declared dimensions are the numeric geometry target.
- Decision: image pixels, dimension-line lengths, subject bounds, and image
  aspect are not calibration data.
- Why: generated reference sheets are useful visual guides but are not
  guaranteed to be metrically consistent.
- Tradeoff: cube decisions require a modeller plan and visual review.
- Owner: Codex
- Date: 2026-07-31

### No automatic mesh-to-cuboid modelling

- Decision: SF3D and mesh decomposition do not create the geometry path.
- Decision: `place_cube` and `modify_cube` remain technical operations only.
- Why: a rough mesh can provide volume but cannot decide semantic parts,
  contacts, pivots, or the intended cuboid decomposition.
- Tradeoff: geometry creation is deliberate and cannot be falsely reported as
  automatic reconstruction.
- Owner: Codex
- Date: 2026-07-31

### SF3D and similarity scoring are rejected

- Decision: SF3D is not used for geometry, volume fitting, texture guidance,
  or validation.
- Decision: projection, IoU, silhouette, similarity, and other numeric scores
  are not used for geometry selection, rejection, approval, or reporting.
- Why: the available results produced bias and false confidence rather than
  proof of the intended Blockbench model.
- Tradeoff: visual review must be performed directly in Blockbench; there is no
  automatic similarity shortcut.
- Owner: Codex
- Date: 2026-07-31

### Package status is a handoff label

- Decision: package validation is structural only; human acceptance of the
  brief is a modelling handoff.
- Decision: package validity never proves visual correctness or cube accuracy.
- Why: structural package validation cannot judge modelling quality.
- Owner: Codex
- Date: 2026-07-31

### Visual and structural evidence stay separate

- Decision: valid coordinates, hierarchy, bounds, contacts, and successful MCP
  calls do not constitute visual approval.
- Why: a structurally valid model can still be the wrong shape.
- Owner: Codex
- Date: 2026-07-25

### MCP owns technical geometry operations

- Decision: MCP owns elements, groups, parent-child structure, positions,
  pivots, rotations, bounds, and structural inspection.
- Decision: MCP does not infer object anatomy or semantic cube decomposition
  from a mesh or image automatically.
- Owner: Codex
- Date: 2026-07-31

## Superseded Decisions

The earlier policy that user approval made the image a visual authority, that
orthographic overlays were the geometry comparison gate, and that SF3D could
produce a Cube Draft is superseded. Those assumptions created false confidence
and must not be reintroduced.

The `PLAN_READY` replay, per-cube locked transforms, IoU approval, calibration
layer, and offline Cuboid Blueprint gate were removed after repeated visual
failure. They must not be reintroduced as geometry authority.

The earlier universal default `ponytail + one specialist` is superseded for
Developing mode by mandatory `development-brief` with at most one specialist
when needed. Ponytail remains the Plan default and a Maintenance baseline; its
minimal/YAGNI principles also remain absorbed into root guardrails.

## Rule

- Do not turn a diagnostic number into a modelling decision.
- Do not invent missing geometry from an ambiguous image.
- Mark unproven runtime behaviour as `Needs Validation`.

## Parent

- [Knowledge Dashboard](index.md)
- [Open Spec Guide](decisions/open-spec-guide.md)
