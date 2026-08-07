# Decision Log

Use this note for the why behind the current direction.

## Current Decisions

### Skill routing is deliberately lean

- Decision: the normal task stack is `ponytail + one specialist skill`.
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
  workflow, and the existing Local Open Spec Guide.
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

## Rule

- Do not turn a diagnostic number into a modelling decision.
- Do not invent missing geometry from an ambiguous image.
- Mark unproven runtime behaviour as `Needs Validation`.

## Parent

- [Knowledge Dashboard](index.md)
- [Open Spec Guide](decisions/open-spec-guide.md)
