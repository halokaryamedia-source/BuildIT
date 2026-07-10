# Phase Quality Insight Matrix (General Marketplace Standard)

Use this as a quality lens during every phase.  
If one row fails, do not advance phase.

This matrix is a general control model and must be reused for all model types, not as shape-specific pattern matching.

## 1. Reference Collection

- Required quality:
  - Target class, scale, front side, and orientation are explicit.
  - Focal areas and attachment logic are identified.
  - Texture-only vs geometry-only decisions are separated.
  - Missing or conflicting refs are marked as `Needs verification`.
- Failure signal:
  - Ambiguous target class or scale.
  - No explicit silhouette priority.
  - No cube budget direction.

## 2. Main Geometry

- Required quality:
  - Silhouette readable from front and side.
  - Major mass blocks exist and are attached.
  - No obvious floating core parts.
  - No micro-cube decoration introduced.
- Hard no's:
  - No detached decorative props.
  - No repeated tiny trim cubes.
- Failure signal:
  - Silhouette unclear.
  - Major part disconnected.
  - Tiny cubes dominate the form.

## 3. Geometry Detailing

- Required quality:
  - Added geometry improves silhouette, structure, or attachment.
  - Pivot/parent logic remains clean.
  - Geometry-to-texture boundary is cleaner than phase 2.
- Failure signal:
  - Decorative cubes added for color.
  - New collisions/overlaps.
  - Attachment logic becomes ambiguous.

## 4. UV Texture

- Required quality:
  - One atlas plan exists for current material strategy.
  - Repeated or mirrored parts reuse UV logically where possible.
  - Focal faces receive sufficient UV area.
  - Hidden faces do not overconsume space.
- Hard no's:
  - No accidental multi-texture drift.
  - No full-repaint without local edit path.
- Failure signal:
  - Empty UV islands too many.
  - Focal areas compressed.
  - UV overlap in important faces.

## 5. Base Texturing

- Required quality:
  - Major materials readable by large face areas.
  - Base color values have 3+ stepped tones.
- Hard no's:
  - No flat single-tone cover on hero faces.
  - No unplanned palette expansion beyond approved material groups.
- Failure signal:
  - Single-tone flat fill on large visible surfaces.
  - Hard edges missing on large flat faces.

## 6. Detail Texturing

- Required quality:
  - Focal details match reference intent.
- Hard no's:
  - No smooth blur.
  - No random pixel noise without directional shading intent.
- Failure signal:
  - No gradient on large readable material areas.
  - Overuse of random micro patterns.
  - Texture-only detail does not support structure.

## 7. Polish

- Required quality:
  - Final pass removes remaining collision and floating artifacts.
  - Texture and geometry are coherent; no contradictory cues.
  - Model quality score is clearly above internal baseline by phase.
- Failure signal:
  - Same defects repeated across front/side/back.
  - Over-polish that breaks phase-approved structure.

## 8. Final Review

- Required quality:
  - User confirms:
    - silhouette,
    - attachment,
    - gradient/material depth,
    - no major float/collision issues,
    - cube budget logic.
- Failure signal:
  - One or more phase failure signals unresolved.

Token-safe scoring check:

- If all hard no's are still unresolved, phase cannot move even if many user requests are "minor adjustments only".

## Decision Rule for MCP

- If scorecard has `BLOCKER`: stay in phase and fix.
- If scorecard has no blocker and up to 2 `NEEDS_MINOR_FIX` items: fix those items and re-check.
- If scorecard has `PASS`: request user approval for next phase.

Phase transition policy:

- Any `BLOCKER` status in the scorecard keeps the same phase.
- `NEEDS_MINOR_FIX` allows only bounded fixes (max 2 critical issues).
- `PASS` is required for handoff approval.

## Acceptance Criteria

- Any unresolved hard no/Failure Signal keeps the phase blocked.
- Scorecard decision is aligned with phase-specific quality matrix before moving forward.
- The matrix is applied to all assets without shape-specific reinterpretation.
- If a blocker repeats, phase reset/re-plan is requested before broad continuation.
