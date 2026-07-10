# Modelling Workflow Index

Use:

```text
Engine/codex/BOOTSTRAP.md
```

as the normal local Codex entry point.

This folder contains detailed stage rules and conditional failure playbooks. It is not a mandatory full-read bundle for every edit.

## Runtime Contracts

```text
Engine/codex/GOVERNANCE.md
Engine/codex/STATE_MACHINE.md
Engine/codex/EVIDENCE_CONTRACT.md
Engine/codex/CHECKPOINT_RECOVERY.md
Engine/codex/stage-profiles.json
```

Runtime authority:

```text
SavedData/sessions/<asset>/state.json
```

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
Reference Intake + One-Time Preflight
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
   - placeholder/untextured geometry.
2. Structural Detail
   - silhouette-critical geometry;
   - attachments and transitions;
   - parent/pivot readiness;
   - cube reduction.

No approval is requested between internal passes.

Geometry review uses:

- `save_project_checkpoint`;
- `capture_standard_views`;
- five standard previews;
- dimensions/hierarchy/cube report.

## Stage 2 — Texture

Internal passes:

1. UV planning and packing;
2. Base materials;
3. Detail texturing and focal polish.

No approval is requested between internal passes.

Texture review uses:

- persistent Texture checkpoint;
- atlas and UV summary;
- Front, Left Side, Back, and Front-left 3/4 previews.

## Stage 3 — Animation (Optional)

Run only when required by the approved manifest or `ANIMATION.md`.

When not required, record `ANIMATION_SKIPPED` and continue to Final Validation.

When required, create only the approved hierarchy, pivots, and motion. End with clips/samples, neutral-pose recovery, clipping/ground-contact evidence, and user review.

## Stage 4 — Final Validation

Run `VALIDATION.md` against the final candidate.

Codex may repair at most two local failures automatically. Changes affecting approved identity, scale, silhouette, palette, or earlier-stage scope must return to the relevant review stage.

Final output:

- candidate `.bbmodel`;
- textures;
- completed validation report;
- five standard views;
- final atlas;
- Animation evidence when relevant;
- revision summary;
- `PASS`, `REVISION_REQUIRED`, or `BLOCKER`.

Wait for final user approval or requested corrections.

## Execution Rules

- OpenSpec preserves agreed goal, scope, stages, non-goals, and acceptance criteria.
- Ponytail chooses the smallest complete work batch required now.
- Full preflight runs once before the first session write.
- Re-run only stale or failed checks.
- One asset uses one active write session.
- Save persistent checkpoints at review and approval boundaries.
- Initial construction may use bounded multi-part batches.
- One-issue-per-cycle applies to revision work.
- Do not rebuild accepted areas.
- Texture details must not become decorative micro-cubes.
- Use Per-face UV by default for custom Bedrock atlases unless the approved package says otherwise.
- Capture screenshots at review gates or after meaningful revision batches, not every micro-edit.

## Minimum Normal Read Set

1. `Engine/codex/GOVERNANCE.md`;
2. active OpenSpec summary;
3. active `state.json`;
4. reference manifest;
5. Production Context;
6. Reference Visual;
7. active-stage category document.

## Detailed Documents

Open only when relevant:

- `mandatory-blockbench-mcp-procedure.md`: hard execution baseline.
- `phase-detail-contract.md`: detailed four-stage inputs, scope, output, and gates.
- `pre-modelling-gate.md`: one-time readiness gate.
- `reference-package-pass-fail-checklist.md`: reference intake validation.
- `quality-implementation-rules.md`: Geometry/Texture quality rules.
- `phase-quality-insight-matrix.md`: four-stage quality lens.
- `geometry-failure-prevention-playbook.md`: after the same Geometry blocker appears twice.
- `common-failure-patterns.md`: targeted diagnosis.
- `visual-qa-checklist.md`: preview and final evidence checks.

Legacy/historical classification is recorded in:

```text
Engine/codex/LEGACY_WORKFLOW_AUDIT.md
```
