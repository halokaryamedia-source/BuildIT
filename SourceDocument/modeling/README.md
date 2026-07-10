# Modelling Workflow Index

Use `../../Engine/codex/BOOTSTRAP.md` as the normal local Codex entry point.

This folder contains detailed stage rules and failure playbooks. It is not a mandatory full-read bundle for every edit.

## Approved Reference Package

```text
PRODUCTION_CONTEXT.md
<asset>_reference_visual.png
GEOMETRY.md
TEXTURING.md
ANIMATION.md
VALIDATION.md
reference_manifest.json
CODEX_REFERENCE_HANDOFF.md
```

New sessions do not require legacy numbered reference sheets.

## User-Visible Flow

```text
Reference Intake + Preflight
→ Geometry
→ Geometry Review
→ Texture
→ Texture Review
→ Animation Review when required
→ Final Validation
→ Final Review
```

## Stage 1 — Geometry

Internal passes:

1. Primary Form
   - scale envelope;
   - root hierarchy;
   - primary masses;
   - ground contacts;
   - placeholder colors only.
2. Structural Detail
   - silhouette-critical geometry;
   - attachments and transitions;
   - parent/pivot readiness;
   - cube reduction.

No approval is requested between these internal passes.

Geometry ends with five standard previews and user approval or revision feedback.

## Stage 2 — Texture

Internal passes:

1. UV planning and packing
2. Base materials
3. Detail texturing and focal polish

No approval is requested between these internal passes.

Texture ends with atlas/UV evidence, model previews, and user approval or revision feedback.

## Stage 3 — Animation (Optional)

Run only when required by the approved manifest or `ANIMATION.md`.

When not required, record `ANIMATION_SKIPPED` and continue to Final Validation.

When required, create the approved hierarchy, pivots, and motion. End with clips/samples, neutral-pose recovery, clipping/ground-contact evidence, and user review.

## Stage 4 — Final Validation

Run `VALIDATION.md` against the final candidate.

Codex may repair at most two local failures automatically. Changes that affect approved identity, scale, silhouette, palette, or earlier-stage scope must return to the relevant review stage.

Final output:

- candidate `.bbmodel`;
- textures;
- completed validation report;
- five standard views;
- animation evidence when relevant;
- revision summary;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

Wait for final user approval or requested corrections.

## Execution Rules

- Full preflight runs once before the first session write.
- Re-run only stale or failed checks.
- One asset uses one active write session.
- Save persistent checkpoints per stage.
- Initial construction may use bounded multi-part batches.
- One-issue-per-cycle applies to revision work.
- Do not rebuild accepted areas.
- Texture details must not become decorative micro-cubes.
- Use Per-face UV by default for custom Bedrock Entity atlases unless the approved package says otherwise.

## Minimum Normal Read Set

1. `../../Engine/codex/BOOTSTRAP.md`
2. active `state.json`
3. reference manifest
4. Production Context
5. Reference Visual
6. active-stage category document

## Detailed Documents

Open when relevant:

- `mandatory-blockbench-mcp-procedure.md`: hard execution baseline.
- `phase-detail-contract.md`: detailed four-stage inputs, scope, output, and gates.
- `pre-modelling-gate.md`: one-time readiness gate.
- `reference-package-pass-fail-checklist.md`: reference intake validation.
- `quality-implementation-rules.md`: geometry/texture quality rules.
- `geometry-failure-prevention-playbook.md`: after the same geometry blocker appears twice.
- `common-failure-patterns.md`: targeted diagnosis.
- `visual-qa-checklist.md`: preview and final evidence checks.
