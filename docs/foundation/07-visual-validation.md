# BlockIT — Operating Model Visual Validation

**Status:** Draft  
**Version:** 1.2

## 1. Purpose

Define the minimum visual evidence required before BlockIT claims that a
Blockbench model looks correct for the requested scope.

Reference preparation/QA belongs to [`04-reference-guide.md`](04-reference-guide.md).
This document validates the Blockbench result, not the source image package.

## 2. Core Principle

Structural success is not visual success.

The following are **not** proof of visual correctness by themselves:

- a successful MCP call;
- all planned Cubes existing;
- Cubes touching/overlapping/being parented successfully;
- valid geometry coordinates/bounds;
- hierarchy/contact/overlap checks;
- rotations/pivots being syntactically valid;
- a saved/reopenable `.bbmodel`;
- linked UV/texture data;
- a numeric similarity/projection score.

Visual claims require fresh visual evidence from the current model revision.

A model must never receive visual `PASS` merely because geometry was placed
without error or because every part is technically connected.

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

## 4. Reference-To-Model View Pairing

Use the view set declared by the active Model Reference package. The package may
define a primary view plus orthographic/preview views; this policy does not
hardcode Zebra, LEFT SIDE, or any fixture-specific camera order.

Whenever practical, compare like with like:

```text
REFERENCE SIDE  ↔ MODEL SIDE
REFERENCE FRONT ↔ MODEL FRONT
REFERENCE TOP   ↔ MODEL TOP
REFERENCE 3/4   ↔ MODEL 3/4
```

The comparison does not need pixel alignment or numeric scoring. The purpose is
to keep view identity explicit so the reviewer cannot silently compare different
orientations/framing and rationalize a mismatch.

During construction:

- use the primary/most-informative view for the current whole-form question;
- add one orthogonal or depth/footprint view only when it resolves a real
  ambiguity;
- do not treat all reference views as simultaneous per-cube instructions;
- do not capture every cube/tool call.

During full geometry review, inspect the complete declared reference view set
needed to judge silhouette, proportion, volume, major connections, important
rotations, and meaningful pivots.

## 5. Structural Envelope Evidence

Camera framing can hide gross scale/position errors. When target dimensions are
available and runtime inspection supports it, pair visual evidence with a simple
model-bounds/envelope check.

Useful structural questions include:

- Is overall width/height/length near the approved target envelope?
- Is the model grounded/displaced as intended?
- Is the model mirrored or oriented opposite the declared front direction?
- Is a primary mass far outside the whole envelope?

This evidence catches scale/placement catastrophes. It **cannot** approve
silhouette, resemblance, rotation quality, or pivot quality by itself.

## 6. Required Visual Gates

### Gate 1 — Primary Geometry / Whole Form

Purpose: catch global mistakes before detail work.

Check:

- recognizability;
- global silhouette;
- major proportion relationships;
- primary mass placement;
- important orientation/slopes;
- major visible contacts/attachments.

For every material mismatch, name:

```text
criterion that failed
responsible primary mass/relationship when identifiable
observed mismatch
reference/model view(s) showing it
severity: critical | major | minor
```

Generic statements such as "looks good", "all Cubes are attached", "the body is
complete", or "the coordinates are valid" do not answer the gate and cannot
produce `PASS`.

#### Primary-pass rejection rule

Reject/invalidate the current primary hypothesis when:

- the whole object is not recognizable as the intended target; or
- several primary relationships fail together, such as silhouette + proportions
  + placement/orientation; or
- the proposed repair depends on adding compensating detail instead of correcting
  the responsible primary masses.

When this rule triggers, rebuilding/revising the coarse primary form is preferred
to a chain of local patches.

If the whole form is sound and one bounded relationship is wrong, a targeted
correction is appropriate.

### Gate 2 — Complete Geometry

Purpose: confirm that primary + secondary geometry forms one coherent model.

Check where relevant:

- all required major parts are present and oriented correctly;
- silhouette/proportions remain coherent across the full view set;
- width/depth/footprint are plausible from the reference;
- visible connections are actually coherent in the image, not merely
  technically overlapping;
- rotations correspond to visible slopes/form or required articulation;
- meaningful pivots correspond to intended joints/attachments/transform centers;
- no arbitrary/distant pivot causes an implausible transform relationship;
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

A pivot that only appears acceptable in the static pose but produces an
implausible rotation arc under intended motion is not approved.

### Gate 5 — Final Review

Review the current saved/release candidate against the requested output. Do not
reuse visual evidence from an older model revision after material geometry,
texture, pivot, hierarchy, or animation changes.

## 7. Visual Repair Loop

```text
Fresh paired model/reference view
↓
Name concrete mismatch
↓
Classify GLOBAL or LOCAL
↓
GLOBAL → revise/rebuild primary hypothesis
LOCAL  → inspect responsible authored state
↓
Choose causal correction
↓
Fresh affected view(s)
↓
Confirm improvement or replan
```

### Global failure

Examples:

- object is not recognizable;
- whole silhouette is wrong;
- several primary mass ratios/placements are wrong together;
- major front/back/up orientation is wrong.

Do not preserve the current blockout just because many Cubes have already been
placed.

### Local failure

Examples:

- one otherwise-correct mass is slightly too long/high/wide;
- one attachment is misplaced;
- one clearly-required slope/rotation is wrong;
- one pivot is wrong while the underlying primary form remains sound.

Inspect the smallest relevant authored state before modifying it.

Rules:

- this is a repair loop, not a reporting loop;
- correct relationships, not symptoms;
- do not default to adding another Cube;
- use the causal edit vocabulary from `05-geometry-standard.md`;
- reopen only the affected views/relationships unless the correction changed the
  global form;
- if the same correction direction fails twice without new evidence, stop and
  replan rather than producing patch churn;
- do not score similarity as a substitute for visual judgement.

## 8. Rotation And Pivot Review

Rotation/pivot quality must be reviewed as modelling decisions, not merely as
valid numeric fields.

For a material rotation, the reviewer should be able to answer:

- Which reference view shows the intended slope/orientation?
- Does the rotated mass improve the intended silhouette rather than compensate
  for wrong placement/size?
- Is the rotation simpler than a stepped Cuboid approximation?
- Did the rotation damage visible attachment or model bounds?

For a meaningful pivot, the reviewer should be able to answer:

- What rotation/joint/attachment/parent-transform purpose does this pivot serve?
- Is it located near the intended transform relationship rather than at an
  arbitrary distant point?
- Does the resulting transform preserve visible attachment/articulation?

If those questions cannot be answered, the rotation/pivot is not approved merely
because Blockbench accepts it.

## 9. Issue Severity

### Critical

Makes the model unusable, unrecognizable, or materially inconsistent with the
requested asset.

### Major

Strongly reduces reference fidelity, readability, or required function.

### Minor

Small issue that does not block intended use.

Critical and major issues must be resolved before visual completion.

## 10. Evidence Economy

Capture only when a screenshot/view can answer a concrete question.

Good reasons to capture:

- primary whole-form gate;
- full geometry gate;
- after a targeted correction;
- texture gate;
- required animation/final gate.

Bad reasons to capture:

- after every cube merely because capture exists;
- to prove that a Cube was technically placed;
- to create a larger evidence package without a decision it informs;
- to repeat an unchanged view after it already established the criterion.

More screenshots are not automatically more proof.

## 11. Selected-Part Inspection

When a user or critic identifies a specific part, inspect the smallest relevant
source/runtime state available for that part before modifying it. Do not export
or rescan the whole project merely to inspect one selected element when a
narrower verified operation exists.

For local rotation/pivot corrections, inspect the current parent, bounds, origin,
rotation, and relevant child/contact relationship before choosing new values.

Exact MCP selection/tool behavior remains implementation/runtime truth and must
be verified before being treated as guaranteed capability.

## 12. Preview Capability Boundary

Automatic screenshot, camera, reference-display, bounds-inspection, or
correction capability is usable only when verified in the current
implementation/session.

If automatic visual evidence is unavailable:

1. complete only the structural/repository work that can be proven safely;
2. preserve/save the project when that operation is verified and appropriate;
3. leave one exact visual/runtime proof step for Codex/human review;
4. do not label the result visually complete.

ChatGPT → GitHub may prepare a visual/runtime change but cannot prove the live
Blockbench result from static repository inspection.

## 13. Visual Critic Questions

The critic should answer concrete questions, not provide generic praise:

- Does the **whole silhouette** read like the intended reference?
- Are the major mass proportions/placements plausible?
- Are required primary parts present and oriented correctly?
- Are visible contacts/connections coherent?
- Does every important rotation correspond to a visible slope/form/motion need?
- Does every meaningful pivot correspond to a real transform/joint/attachment
  need?
- Is any major part inverted, floating, or obviously intersecting incorrectly?
- Does texture placement materially match the intended identity/style?
- If animation is required, does motion break the model?

Only ask criteria relevant to the current gate/scope.

## 14. Completion Rule

Use visual `PASS` only when fresh evidence from the current revision was
actually inspected against the relevant gate criteria.

`PASS` is invalid when its main justification is any variation of:

```text
all Cubes are present
all Cubes are attached
tool calls succeeded
coordinates are valid
hierarchy is valid
rotation/pivot values exist
validator has no error
```

Do not require:

- per-cube screenshot approval;
- per-cube orientation declarations in product policy;
- universal SIDE + FRONT/BACK capture after every mutation;
- numeric resemblance scores;
- a full-review restart after every local correction;
- a fixture-specific view order.

Those patterns add ceremony or false confidence without proving the whole model.

## 15. Final Checklist

Use only applicable items:

- whole silhouette and orientation are acceptable;
- major proportions/masses are coherent;
- required parts and visible contacts are present;
- material rotations have a reference/form/function reason;
- meaningful pivots have a transform/articulation/attachment reason;
- no unresolved critical/major geometry issue remains;
- UV/texture are visually acceptable when required;
- animation works visually when required;
- project is clean/saved when required;
- final status distinguishes structural proof from visual/runtime proof.

## 16. Known Boundary

Any Blockbench/MCP camera, screenshot, selection, bounds, save, undo, or visual-
helper capability not proven in the current implementation/session is `Needs
Validation`. Documentation must not convert a historical experiment into a
permanent runtime guarantee.
