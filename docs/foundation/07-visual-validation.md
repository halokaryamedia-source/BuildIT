# BlockIT — Operating Model Visual Validation

**Status:** Draft  
**Version:** 1.0

## 1. Purpose

Define how Codex should validate a model visually before claiming completion.

Reference images are validated under [`04-reference-guide.md`](04-reference-guide.md); this document applies to model previews and downstream visual checks.

## 2. Core Principle

A valid project structure does not guarantee a correct visual result.

Codex must not claim visual quality only because:

- geometry was created;
- hierarchy is valid;
- `.bbmodel` saves;
- MCP returns no error;
- UV and texture are linked.

## 3. Validation Status

### Structurally Validated

Geometry, hierarchy, pivots, UV, texture links, optional animation data, and save status have been checked.

### Visually Reviewed

The model has been reviewed through a preview image or human inspection.

### Completed

Requirements are met, structural validation is complete, visual review has occurred, critical issues are resolved, and `.bbmodel` is saved.

The visual release gate is internal. Geometry, texture, and required animation
must pass visual-critic review before the result is released. This document does
not claim that a global structural reviewer already exists. The user receives
only a released result; unavailable visual evaluation means `BLOCKED`.

## 4. Reference View Set

The current baseline uses five views in this order:

1. `primary_view` from the active reference package
2. `FRONT`
3. `TOP / FOOTPRINT`
4. `BACK`
5. `FRONT 3/4 PREVIEW`

For the active Zebra package, `primary_view` is `LEFT SIDE`. The first three
angles are construction views; `BACK` verifies the rear, and `FRONT 3/4
PREVIEW` is the final volume and connection check. Three-view generation is
not part of the current workflow. If the primary view is missing or any view
is unusable, stop for brief review rather than inventing a replacement.

This set has two uses: construction uses one active view plus only the
orthogonal view needed to resolve a concrete question; section and full-model
audit use the complete mapped set. The five views must not be treated as equal
simultaneous instructions for every cube.

## 5. Required Checkpoints

### Checkpoint 1 — Base Geometry

Check:

- recognizability;
- major proportion;
- silhouette;
- orientation.

Do not continue if the base form is wrong.

During construction, finish one semantic section from the numeric dimensions
and visual brief. Capture and inspect one fresh viewport screenshot at the
section boundary. Use one orthogonal view when width, depth, or contact remains
uncertain. If capture is available but not inspected, the section cannot
advance; do not report or capture each cube.

### Checkpoint 2 — Completed Geometry

Check:

- all major parts;
- layering;
- symmetry;
- overlap;
- missing or inverted elements;
- detail balance.

Compare the complete geometry with the numeric dimensions and visual brief in
`primary_view`, `FRONT`, `TOP / FOOTPRINT`, and `BACK`. Review
`FRONT 3/4 PREVIEW` last as a visual-only volume and connection check. Then
run the internal visual critic. A local correction reopens only the affected
views. No score is used.

### Checkpoint 3 — Completed Texture

Check:

- pattern direction;
- facial placement;
- material definition;
- gradient;
- UV orientation;
- pixel-density consistency.

### Checkpoint 4 — Animation

Only when required.

Check:

- pivot behavior;
- detached parts;
- clipping;
- unnatural movement;
- broken hierarchy.

### Checkpoint 5 — Final Review

Compare the full result with the reference and report the honest final status.

## 6. Validation Workflow

```text
Obtain preview
↓
Compare with reference
↓
List visible issues
↓
Classify severity
↓
Apply targeted correction
↓
Obtain preview again
↓
Confirm correction
```

This is a repair loop, not a reporting loop. A visible issue must trigger a
targeted geometry or texture correction and a fresh screenshot of the affected
view before the workflow can advance. `ISSUES_FOUND` is the structured result
for a concrete mismatch that needs a targeted correction or section replan; it
is not permission to hand the bad draft to the user.

The visual cadence is section-based: capture SIDE and the declared FRONT or BACK
view together after the section is ready, and capture the same duo after a
correction. TOP or 3/4 is optional only for one explicit unresolved question.

If the reference itself is a generated asset package, use the reference QA and
lock rules in `04-reference-guide.md` first.

## 7. Issue Severity

### Critical

Makes the model unusable or unrecognizable.

### Major

Strongly reduces quality or reference accuracy.

### Minor

Small issue that does not block use.

Critical and major issues must be fixed before final completion.

## 8. Targeted Correction

Fix only the related area.

Do not rebuild the whole model for a local issue unless absolutely necessary.

## 9. Refinement Control

Correct the smallest semantic section responsible for a visible mismatch.
There is no blind retry loop: if the brief or preview cannot support the
decision, stop as `NEEDS REVIEW`.

Before changing a user-highlighted cube, call `get_selection` and use its UUID,
transform, size, pivot, rotation, and parent data. Do not export the complete
project merely to inspect one selected cube.

## 10. When Automatic Preview Is Available

Use screenshots or camera control only after a semantic section is ready for a
useful comparison and during the complete geometry review. Do not capture after
every tool call.

These capabilities must be verified before being treated as available.

Use `show_reference_view` only to show one complete orthographic brief view as an
optional native Blockbench visual aid. Reuse it to switch views; do not
generate per-part image fragments or approve geometry from the image or a
similarity score.

## 11. When Automatic Preview Is Unavailable

1. Perform structural validation.
2. Save safely.
3. Keep the result `BLOCKED` until a visual critic can inspect fresh screenshots.
4. Correct only from concrete visual findings.

## 12. Manual Review

Manual review is not a routine development gate. It is an explicit fallback
only when the product owner chooses to override the internal gate. The normal
workflow must not expose repeated bad drafts to the user.

The visual critic must answer concrete questions:

- Does the shape match the reference?
- Does the global silhouette match the reference?
- Are the major proportions acceptable?
- Are all primary parts present and visually coherent?
- Are visible connections real in the image, not only technically overlapping?
- Is any part inverted?
- Do proportions look wrong?
- Is texture shifted?
- Does animation break the model?

## 13. Final Checklist

- alignment with the active reference;
- correct orientation;
- complete parts;
- readable silhouette;
- no major intersection;
- no missing texture;
- no broken pattern;
- correct facial placement;
- animation works when required;
- project is clean;
- `.bbmodel` is saved;
- status is reported honestly.

## 14. Completion Rule

Use `Completed` only when structural validation and visual-critic review are
both complete. A section `PASS` is invalid unless silhouette, proportion,
major parts, connections, and orientation were all explicitly checked in both
 required views. Technical attachment success is never visual approval.

The Geometry Plan must carry the reference manifest's target dimensions. The
runtime rejects a plan whose dimensions disagree with the manifest and undoes a
mutation that makes the current model exceed any target axis. This is a hard
envelope guard, not a resemblance score. Visual review must also identify the
declared plan items actually inspected in every view and criterion; generic
approval language is insufficient evidence.

Construction has an additional mutation gate: every planned cube must declare
its orientation decision and evidence view, and every `place_cube` or
`modify_cube` call must follow a fresh SIDE plus FRONT/BACK capture for the
active section. A cube name found in the outliner does not count as a placed
plan item. No silent zero-rotation default is permitted.

Otherwise stop at `BLOCKED` or `ISSUES_FOUND`.

## 15. Known Limitations

Do not assume the following without verification:

- automatic viewport screenshot;
- camera switching;
- orthographic preview automation;
- automatic correction from screenshots;
- native reference overlays until the built camera tool is loaded in the live
  Blockbench session.
