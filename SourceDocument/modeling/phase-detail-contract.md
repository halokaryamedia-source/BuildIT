# Stage Detail Contract

This document defines the four user-visible production stages for Codex + Blockbench MCP.

Use with:

- `../../Engine/codex/BOOTSTRAP.md`
- `mandatory-blockbench-mcp-procedure.md`
- `quality-implementation-rules.md`
- active `state.json`
- approved reference package

## Global Stage Report

Every stage ends with:

```text
Stage:
Goal:
Status: PASS / REVISION_REQUIRED / BLOCKER
Completed:
Preserved:
Skipped:
Evidence:
Issues:
Assumptions:
Next user action: APPROVED or REVISION: ...
```

## Global Gate Rule

A stage advances only when:

- its required output exists;
- required previews/evidence exist;
- no blocker remains;
- stage status is `PASS`;
- the user explicitly approves the stage preview.

Internal passes do not require separate user approval.

## Revision Rule

The one-issue-per-cycle rule applies to revision work.

```text
Stage:
Part:
Issue:
Expected:
Do not change:
Verification:
```

A revision must preserve accepted areas. After two repeated failures on the same issue, stop and use the relevant failure playbook.

# Stage 0 — Reference Intake and Preflight

This is automatic and does not require routine user approval.

## Required Input

- `reference_manifest.json`
- `PRODUCTION_CONTEXT.md`
- `<asset>_reference_visual.png`
- `GEOMETRY.md`
- `TEXTURING.md`
- `ANIMATION.md`
- `VALIDATION.md`
- `CODEX_REFERENCE_HANDOFF.md`

## Required Decisions

- asset identity and target;
- scale, front direction, and neutral pose;
- geometry-vs-texture split;
- required hierarchy/attachments;
- atlas and texture style;
- whether Animation is required;
- manual edits to preserve.

## Preflight Checks

- package integrity;
- active OpenSpec change;
- MCP endpoint and tools;
- one active write session;
- project UUID, format, UV mode, and texture size;
- persistent checkpoint readiness;
- state file exists and is consistent.

## Exit

- `PASS` → enter Geometry;
- `REFERENCE_CONFLICT` → stop before editing;
- `BLOCKER` → report missing runtime requirement.

# Stage 1 — Geometry

## Goal

Create the complete approved physical form before UV, texture painting, animation clips, or export.

## Required Input

- approved reference package;
- `GEOMETRY.md`;
- approved scale envelope;
- build order;
- hierarchy and attachment plan;
- cube-vs-texture decisions;
- Geometry stage checkpoint.

## Internal Pass A — Primary Form

Build:

- root group;
- primary parent structure;
- global envelope;
- main body/object masses;
- major silhouette parts;
- ground/contact parts;
- defining large attachments;
- placeholder colors only.

Initial construction may use a bounded multi-part batch when the parts form one coherent hierarchy or silhouette unit.

## Internal Pass B — Structural Detail

Add only geometry that improves:

- silhouette;
- depth;
- attachment continuity;
- part transition;
- pivot/animation readiness;
- focal identity that texture cannot solve.

Reduce or remove:

- decorative micro-cubes;
- texture-like seams/bands/pixels;
- redundant overlapping masses;
- unsupported floaters;
- z-fighting.

## Forbidden

- UV packing;
- texture painting;
- final palette polish;
- animation clips;
- export;
- broad work outside the approved asset.

## Required Evidence

- Front preview;
- Left Side preview;
- Back preview;
- Top / Footprint preview;
- Front-left 3/4 preview;
- scale envelope;
- cube/group count;
- hierarchy summary;
- attachment/ground-contact summary;
- persistent Geometry checkpoint.

## Geometry Gate

```text
Scale: PASS / REVISION_REQUIRED / BLOCKER
Front silhouette: PASS / REVISION_REQUIRED / BLOCKER
Left Side silhouette: PASS / REVISION_REQUIRED / BLOCKER
Back silhouette: PASS / REVISION_REQUIRED / BLOCKER
Top / Footprint: PASS / REVISION_REQUIRED / BLOCKER
Front-left 3/4: PASS / REVISION_REQUIRED / BLOCKER
Attachment continuity: PASS / REVISION_REQUIRED / BLOCKER
Hierarchy/pivot readiness: PASS / REVISION_REQUIRED / BLOCKER
Floating/collision/z-fighting: PASS / REVISION_REQUIRED / BLOCKER
Cube-purpose check: PASS / REVISION_REQUIRED / BLOCKER
```

## Exit

Stop at `GEOMETRY_REVIEW`.

- `APPROVED` → lock Geometry checkpoint and enter Texture.
- `REVISION: ...` → patch only the named issue and return to Geometry Review.

# Stage 2 — Texture

## Goal

Create the approved atlas, UV layout, material zones, palette, and final pixel-art surface treatment.

## Required Input

- approved Geometry checkpoint;
- `TEXTURING.md`;
- approved Reference Visual;
- atlas target;
- UV strategy;
- material palette and zones.

## Internal Pass A — UV

- configure approved atlas size;
- use Per-face UV unless explicitly overridden;
- pack compactly;
- share/mirror safe repeated areas;
- preserve unique/directional areas;
- reserve sufficient density for focal faces;
- avoid unintended overlap.

## Internal Pass B — Base Texture

- apply broad material colors;
- establish approved material zones;
- preserve base color family;
- keep palette limited and readable;
- avoid detail noise.

## Internal Pass C — Detail Texture

- add stepped shading;
- add edge highlights and overlap shadows;
- add texture-only seams, bands, scars, patterns, symbols, and focal pixels;
- correct visible seams;
- improve focal readability;
- keep pixel edges sharp.

## Forbidden

- broad geometry redesign;
- decorative geometry for pixel details;
- PBR maps;
- Vibrant Visuals dependency;
- animation work;
- export.

## Required Evidence

- texture atlas preview;
- UV summary;
- Front textured preview;
- Left Side textured preview;
- Back textured preview;
- Front-left 3/4 textured preview;
- material/alpha/emissive summary;
- persistent Texture checkpoint.

## Texture Gate

```text
Atlas/UV: PASS / REVISION_REQUIRED / BLOCKER
Palette: PASS / REVISION_REQUIRED / BLOCKER
Material zones: PASS / REVISION_REQUIRED / BLOCKER
Focal details: PASS / REVISION_REQUIRED / BLOCKER
Pixel sharpness: PASS / REVISION_REQUIRED / BLOCKER
Seams: PASS / REVISION_REQUIRED / BLOCKER
Alpha/emissive: PASS / REVISION_REQUIRED / BLOCKER
Classic Bedrock compliance: PASS / REVISION_REQUIRED / BLOCKER
```

## Exit

Stop at `TEXTURE_REVIEW`.

- `APPROVED` → lock Texture checkpoint and enter Animation when required, otherwise Final Validation.
- `REVISION: ...` → patch only the named UV/texture issue and return to Texture Review.

# Stage 3 — Animation (Optional)

## Activation

Run only when required by `reference_manifest.json` or `ANIMATION.md`.

If not required:

```text
stage: ANIMATION_SKIPPED
reason: not required by approved reference package
```

Then proceed to Final Validation.

## Goal

Create the approved animation-ready hierarchy, pivots, and required motion without changing accepted Geometry or Texture.

## Required Input

- approved Geometry and Texture checkpoints;
- `ANIMATION.md`;
- required animation families;
- pivot and parent-child plan;
- neutral pose and ground-contact rules.

## Allowed

- approved groups/bones;
- approved pivots;
- approved motion axes and ranges;
- required clips;
- local clipping fixes that do not redesign the asset;
- neutral-pose recovery.

## Forbidden

- broad geometry redesign;
- texture repaint unrelated to motion;
- new unapproved motion families;
- unapproved root motion;
- export.

## Required Evidence

- hierarchy summary;
- pivot summary;
- required clips or sampled poses;
- neutral pose;
- ground-contact result;
- clipping/deformation result;
- persistent Animation checkpoint.

## Animation Gate

```text
Hierarchy: PASS / REVISION_REQUIRED / BLOCKER
Pivots: PASS / REVISION_REQUIRED / BLOCKER
Allowed axes/ranges: PASS / REVISION_REQUIRED / BLOCKER
Neutral-pose recovery: PASS / REVISION_REQUIRED / BLOCKER
Ground contact: PASS / REVISION_REQUIRED / BLOCKER
Clipping: PASS / REVISION_REQUIRED / BLOCKER
Rigid-cuboid behavior: PASS / REVISION_REQUIRED / BLOCKER
```

## Exit

Stop at `ANIMATION_REVIEW`.

- `APPROVED` → lock Animation checkpoint and enter Final Validation.
- `REVISION: ...` → patch only the named motion/pivot issue and return to Animation Review.

# Stage 4 — Final Validation

## Goal

Prove the final candidate follows the approved reference package and is ready for final user acceptance.

## Required Input

- latest approved stage checkpoints;
- `VALIDATION.md`;
- `.bbmodel` candidate;
- texture files;
- animations when required;
- Blockbench validator output.

## Required Work

- execute all applicable `VALIDATION.md` checks;
- capture five standard views;
- verify dimensions and scale;
- verify hierarchy/pivots;
- verify geometry-vs-texture compliance;
- verify atlas/UV/material behavior;
- verify neutral pose and ground contact;
- verify animation when used;
- verify naming and export readiness.

Codex may repair at most two clearly local failures automatically.

A correction requiring redesign or reopening accepted stage scope must be reported and routed back to the relevant review stage.

## Required Output

- final candidate `.bbmodel`;
- texture files;
- completed `VALIDATION.md`;
- Front preview;
- Left Side preview;
- Back preview;
- Top / Footprint preview;
- Front-left 3/4 preview;
- animation evidence when required;
- Blockbench validator summary;
- concise revision summary;
- persistent Validation PASS checkpoint when successful.

## Results

- `PASS`: ready for final approval.
- `REVISION_REQUIRED`: named correction required.
- `BLOCKER`: safe completion is not currently possible.

## Exit

Stop at `FINAL_REVIEW` and wait for:

- `APPROVED`; or
- `REVISION: ...`.

No automatic continuation after Final Review.
