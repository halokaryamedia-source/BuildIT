# BlockIT — Operating Model Visual Validation

**Status:** Draft  
**Version:** 1.1

## 1. Purpose

Define the minimum visual evidence required before BlockIT claims that a
Blockbench model looks correct for the requested scope.

Reference preparation/QA belongs to [`04-reference-guide.md`](04-reference-guide.md).
This document validates the Blockbench result, not the source image package.

## 2. Core Principle

Structural success is not visual success.

The following are **not** proof of visual correctness by themselves:

- a successful MCP call;
- valid geometry coordinates/bounds;
- hierarchy/contact/overlap checks;
- a saved/reopenable `.bbmodel`;
- linked UV/texture data;
- a numeric similarity/projection score.

Visual claims require fresh visual evidence from the current model revision.

## 3. Validation States

### Structurally Validated

The relevant structural requirement has been inspected/proven.

### Visually Reviewed

Fresh Blockbench visual evidence from the required reference views has been
inspected against concrete criteria.

### Completed

The requested scope is satisfied, required structural proof is complete,
required visual review is complete, no unresolved critical/major issue remains,
and the project is saved when save is part of scope.

If required live/visual evidence is unavailable, do not substitute static proof.
Use `BLOCKED`, `NEEDS_REVIEW`, or user-facing `Perlu pemeriksaan` as appropriate.

## 4. Reference View Use

Use the view set declared by the active Model Reference package. The package may
define a primary view plus orthographic/preview views; this policy does not
hardcode Zebra, LEFT SIDE, or any fixture-specific camera order.

During construction:

- use the primary/most-informative view for the current whole-form question;
- add one orthogonal or depth/footprint view only when it resolves a real
  ambiguity;
- do not treat all reference views as simultaneous per-cube instructions;
- do not capture every cube/tool call.

During full geometry review, inspect the complete declared reference view set
needed to judge silhouette, proportion, volume, and major connections.

## 5. Required Visual Gates

### Gate 1 — Primary Geometry / Whole Form

Purpose: catch global mistakes before detail work.

Check:

- recognizability;
- global silhouette;
- major proportion relationships;
- orientation;
- primary mass placement;
- major visible contacts/attachments.

If the whole form is wrong, correct primary relationships. Do not add detail or
compensating Cubes to hide the problem.

### Gate 2 — Complete Geometry

Purpose: confirm that primary + secondary geometry forms one coherent model.

Check where relevant:

- all required major parts are present and oriented correctly;
- silhouette/proportions remain coherent across the full view set;
- width/depth/footprint are plausible from the reference;
- visible connections are actually coherent in the image, not merely
  technically overlapping;
- no major inverted/intersecting/unnecessary geometry remains;
- hierarchy/pivots support the intended organization/motion where required.

### Gate 3 — Texture

Only when texture is in scope.

Check where relevant:

- UV orientation/alignment;
- pixel-density consistency;
- pattern/material direction;
- facial/identity placement;
- missing or visibly broken surfaces.

### Gate 4 — Animation

Only when animation is required.

Check:

- pivot behavior;
- clipping/detachment;
- hierarchy integrity;
- intended motion/readability.

### Gate 5 — Final Review

Review the current saved/release candidate against the requested output. Do not
reuse visual evidence from an older model revision after material geometry,
texture, or animation changes.

## 6. Visual Repair Loop

```text
Fresh preview
↓
Compare against concrete reference criteria
↓
Name the visible mismatch
↓
Fix the smallest responsible relationship/area
↓
Fresh preview of the affected view(s)
↓
Confirm improvement or replan
```

Rules:

- this is a repair loop, not a reporting loop;
- one concrete issue gets one targeted correction direction;
- reopen only the affected views/relationships unless the correction changed the
  global form;
- if the same correction direction fails twice without new evidence, stop and
  replan rather than producing patch churn;
- do not score similarity as a substitute for visual judgement.

## 7. Issue Severity

### Critical

Makes the model unusable, unrecognizable, or materially inconsistent with the
requested asset.

### Major

Strongly reduces reference fidelity, readability, or required function.

### Minor

Small issue that does not block intended use.

Critical and major issues must be resolved before visual completion.

## 8. Evidence Economy

Capture only when a screenshot/view can answer a concrete question.

Good reasons to capture:

- primary whole-form gate;
- full geometry gate;
- after a targeted correction;
- texture gate;
- required animation/final gate.

Bad reasons to capture:

- after every cube merely because capture exists;
- to create a larger evidence package without a decision it informs;
- to repeat an unchanged view after it already established the criterion.

More screenshots are not automatically more proof.

## 9. Selected-Part Inspection

When a user or critic identifies a specific part, inspect the smallest relevant
source/runtime state available for that part before modifying it. Do not export
or rescan the whole project merely to inspect one selected element when a
narrower verified operation exists.

Exact MCP selection/tool behavior remains implementation/runtime truth and must
be verified before being treated as guaranteed capability.

## 10. Preview Capability Boundary

Automatic screenshot, camera, reference-display, or correction capability is
usable only when verified in the current implementation/session.

If automatic visual evidence is unavailable:

1. complete only the structural/repository work that can be proven safely;
2. preserve/save the project when that operation is verified and appropriate;
3. leave one exact visual/runtime proof step for Codex/human review;
4. do not label the result visually complete.

ChatGPT → GitHub may prepare a visual/runtime change but cannot prove the live
Blockbench result from static repository inspection.

## 11. Visual Critic Questions

The critic should answer concrete questions, not provide generic praise:

- Does the **whole silhouette** read like the intended reference?
- Are the major mass proportions/placements plausible?
- Are required primary parts present and oriented correctly?
- Are visible contacts/connections coherent?
- Is any major part inverted, floating, or obviously intersecting incorrectly?
- Does texture placement materially match the intended identity/style?
- If animation is required, does motion break the model?

Only ask criteria relevant to the current gate/scope.

## 12. Completion Rule

Use visual `PASS` only when fresh evidence from the current revision was
actually inspected against the relevant gate criteria.

Do not require:

- per-cube screenshot approval;
- per-cube orientation declarations in product policy;
- universal SIDE + FRONT/BACK capture after every mutation;
- numeric resemblance scores;
- a full-review restart after every local correction;
- a fixture-specific view order.

Those patterns add ceremony or false confidence without proving the whole model.

## 13. Final Checklist

Use only applicable items:

- whole silhouette and orientation are acceptable;
- major proportions/masses are coherent;
- required parts and visible contacts are present;
- no unresolved critical/major geometry issue remains;
- UV/texture are visually acceptable when required;
- animation works visually when required;
- project is clean/saved when required;
- final status distinguishes structural proof from visual/runtime proof.

## 14. Known Boundary

Any Blockbench/MCP camera, screenshot, selection, save, undo, or visual-helper
capability not proven in the current implementation/session is `Needs
Validation`. Documentation must not convert a historical experiment into a
permanent runtime guarantee.
