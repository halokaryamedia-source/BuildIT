# BlockIT — Operating Model Reference

**Status:** Draft  
**Version:** 1.0

## 1. Purpose

This document defines how a visual reference should be prepared before modelling begins.

The reference reduces ambiguity and helps Codex understand form, proportion, silhouette, scale, and style.

This document also governs generated reference packages before they enter the
project workflow.

## 2. Core Principle

The generated five-view image is a visual modelling brief. The user reviews
whether it shows the intended object, useful proportions, visible landmarks,
and the requested style. It is not a metrically calibrated drawing and is not
an automatic source of cube transforms.

ImageGen creates one complete five-view brief in a single generation. The
numeric dimensions supplied by the user are the geometry target. The image
helps the modeller decide which volumes, slopes, contacts, and details to
build; it does not override those dimensions.

Blockbench may display each complete orthographic view as a visual aid. Masks,
polygons, cuboid drafts, pixel ratios, mesh fitting, and similarity scores must
not generate or lock geometry transforms.

## 3. Workflow Boundary

```text
Reference Generator
User request
-> one five-view Modelling Brief
-> user approval
-> Modelling Brief Package

MCP
Modelling Brief Package
-> source-backed construction notes
-> Blockbench Model
-> internal visual critic
-> RELEASED or BLOCKED
```

## 4. Required Views

Ideal reference set:

- front;
- side;
- back;
- top;
- perspective.

## 5. Current Reference Baseline

The current Reference Generator baseline uses the full five-view set:

- left side;
- front;
- back;
- top / footprint;
- front 3/4 preview.

The three-view option is not part of the workflow. Do not create or use a
three-view Golden Sample.

A single image is acceptable only when it clearly contains the shape, proportion, silhouette, scale, and style needed for the task.
If that information is not present, the reference is not complete enough.

An underside view is not required for the current geometry workflow. Ordinary
hidden surfaces are completed from the visible main volumes; no separate
hidden-geometry specification is created. This is a geometry decision only;
texture on unseen surfaces is deferred for separate discussion.

### Hidden Geometry Distinction

Distinguish an unseen surface from an unseen feature:

- **Hidden surface**: an ordinary face of an existing volume, such as the
  underside of a body. It may be completed as part of that volume.
- **Hidden feature**: a distinct protrusion, recess, attachment, or special
  shape that is not shown. Do not create it automatically without evidence.
- A hidden feature explicitly described by the user may be created according
  to that description.

### View Conflict Handling

Keep this handling simple:

- ignore differences caused by lighting or shadows;
- use another view when a part is merely occluded;
- use approved numeric dimensions for size;
- use front, side, back, and top views for relative proportions and landmarks;
- use perspective only to understand volume, not as a precise measurement;
- mark an unusable or misleading brief as `Needs Review` and do not let MCP
  invent geometry to reconcile it.

The Modelling Brief remains under review while a major identity or usability
problem remains. A cross-view scale mismatch is a warning for the modeller,
not a reason to invent calibration.

### Hidden Texture Handling

Texture visible in the Model Reference follows the reference. An ordinary
hidden surface may use a simple continuation of the nearest visible material,
color, or pattern. Do not create a new motif for an unseen surface. A hidden
pattern with a visible analogue may be continued simply from that analogue. A
hidden pattern with no visible analogue is not created; use the nearest base
material or color if needed. A separate Texture Reference is not required.

## 6. Optional Supporting Images

Optional references may include:

- close-ups;
- material references;
- color references;
- animation poses;
- prop references;
- variations.

## 7. Consistency Rules

- All views must represent the same style.
- Do not mix conflicting styles in one reference set.
- If views conflict, do not choose arbitrarily.

## 8. Dimension Information

Requested Dimensions are the numeric geometry target supplied by the user.
The package `dimensions` carries that target to Blockbench.

Example:

```text
Height: 2 blocks
Length: 2.6 blocks
Width: 1 block
```

Convert these targets with `1 block = 16 Blockbench units` on every axis.
Do not derive scale from image pixels, dimension-line lengths, or subject
bounding boxes. Never edit the image to force those targets. Cube dimensions
are chosen by the modeller from the numeric target and the visual proportions.
Texture density remains separate from geometry scale.

## 9. Texture Information

The reference or brief should indicate texture style when known.

## 10. Animation Requirement

The brief should state one of:

- Required;
- Optional;
- Not Required.

## 11. Model Brief

A simple brief is enough.

Example:

```text
Model: Example Object
Target: Minecraft Bedrock
Style: Cuboid
Texture Style: 32×32
Animation: Not Required
Output: .bbmodel
```

## 12. What the Reference Should Show

The reference should communicate:

- overall shape;
- proportion;
- silhouette;
- main volumes;
- important features;
- relation between parts.

It does not need to define:

- hierarchy;
- UV atlas;
- technical implementation.

## 13. Reference Quality

A good reference should be:

- clear;
- complete enough for the model complexity;
- not blurred;
- not cropped;
- consistent across views;
- readable in shape and proportion.

## 14. Review Before Modelling

Codex should be able to answer:

- What is being created?
- What are the primary shapes?
- What is the approximate size?
- What visual style is intended?
- Is animation required?

If a critical answer is missing, Codex should ask for clarification.

## 15. Completion Criteria

The reference is ready when:

- enough views exist for the model complexity;
- perspective is available;
- the brief is available;
- style is defined;
- animation status is defined;
- approximate size is available when relevant;
- no unresolved major conflict remains.

If the reference is still ambiguous after review, stop and ask for clarification before modelling.

## 16. Reference Roles

Use these terms consistently:

- **Source Image**: the original user image used as input by the Reference
  Generator. It is not the direct modelling reference.
- **Source Image**: provenance for the generated brief. It is not a direct
  geometry source.
- **Golden Sample**: the generator's style, layout, lighting, and geometry
  density example. It does not define the target object's anatomy.
- **Modelling Brief**: the approved visual guide consumed by MCP for silhouette,
  pose, proportions, views, and visible priorities.
- **Modelling Brief Draft**: the five-view image before user approval.
- **Cube Draft**: optional temporary geometry created by a modeller. It is not
  generated proof and is not visual authority.
- **Blockbench Model**: the reviewed `.bbmodel` created in Blockbench.
- **Construction Notes**: optional diagnostic suggestions about visible
  sections or contacts. They are not executable cube transforms.
- **Reference Package**: the Modelling Brief, simple metadata, and optional
  Source Images or diagnostics.

The Reference Generator owns Source Image processing, five-view generation,
handoff, and package validation. MCP consumes the resulting Modelling Brief
and owns all cube decisions, technical geometry operations, visual critique,
and the `.bbmodel`.

## 17. Reference-to-MCP Handoff

The reference provides the requirements for the current object. MCP provides
the technical operations used to build and inspect it.

| Reference provides | MCP provides |
|---|---|
| numeric dimensions | preview capture and view navigation |
| visible silhouettes and relative proportions | exact cube placement plus groups and later hierarchy |
| visible landmarks and expected contacts | oriented contact checks and hierarchy inspection |
| complete view crops as visual aids | optional native viewport image display and cube editing |
| style and detail priorities | structural and visual status reporting |

Reference data must not create object-specific MCP profiles or hard-coded
geometry rules. Missing reference data means the related check is unavailable,
not that the model automatically fails.

MCP authors cube coordinates, pivots, rotations, contacts, and hierarchy as a
modeller using the numeric dimensions and visual proportions. The Reference
Generator must not guess those transforms as a prerequisite for modelling.

Non-semantic filler cubes, stepped silhouette tracing, mesh fitting, and any
score-only method must not drive construction. Front 3/4 remains a final visual
review rather than an orthographic tracing view.

### Geometry Construction Flow

```text
MODELLING_BRIEF_DRAFT
-> USER_APPROVAL
-> MODELLING_BRIEF
-> WRITE_MODELLER_PLAN
-> BUILD_SEMANTIC_SECTIONS
-> CHECK_DIMENSIONS_AND_PROPORTIONS
-> OPTIONAL_REFERENCE_VIEW_REVIEW
-> GEOMETRY_APPROVAL
```

Package validation is structural only. Human acceptance of the brief is a
modelling handoff, not a certification of scale, silhouette, image consistency,
or any cube transform. MCP must not turn package validity into geometry
approval.

The reference package must also state whether `FRONT 3/4 PREVIEW` shows the
left or right side. MCP uses that declared camera side and never chooses it.

The crop is the complete fixed-layout panel, including its view label and
dimension lines. It is a visual aid only. There are no subject bounds or
pixel-to-world calibration fields in the package.

During modelling, an optional reference view may be shown as a transparent
foreground image. It does not prove model scale, origin, or visual alignment.

The first cube is the model anchor. Every later cube identifies an existing
cube attachment, uses the attachment point as its pivot, and must have a small
3D overlap of at most `0.5` Blockbench unit. A tool call that creates a gap is
rejected. These checks prove only grid and contact; they do not prove visual
resemblance or modeller decisions.

MCP plans and checks one semantic section internally before moving on. A
section gets at most two screenshot-based adjustments; a repeated failure
reopens the plan instead of adding compensating geometry. The user reviews only
the complete five-view result.

### Final MCP Specification

Create the MCP Specification only after the Modelling Brief passes user
review. The numeric dimensions are authoritative. Never change the image to
make later geometry appear correct.

The specification contains only:

- object name and supported dimensions;
- views actually present in the Modelling Brief;
- neutral pose;
- silhouette priorities;
- volumes, separations, or rotations required by the visible shape;
- details that can remain texture-first;
- animation status.

The user-facing specification must not expose cube counts, transforms, group
names, bone/root structures, pivots, UV layout, or export settings. Those
implementation details remain internal. Non-critical details that are not
visible are omitted. If missing information affects silhouette or proportion,
the status is `BLOCKED`.

### Official Flow

```text
REFERENCE_GENERATOR
SOURCE_IMAGE
-> ONE_FIVE_VIEW_MODEL_REFERENCE_DRAFT
-> MODEL_REFERENCE_REVIEW
-> MODEL_REFERENCE
-> READY_REFERENCE_PACKAGE

MCP
READY_REFERENCE_PACKAGE
-> CUBE_DRAFT
-> BLOCKBENCH_MODEL
```

### Reference Generator Chat Entry

This flow applies only to a new chat in the dedicated Reference Generator
workspace. It is not an instruction for MCP development chats.

The first assistant response is the basic input template, without a trigger
phrase or introductory explanation:

```text
Object Name:
[Type the object name]

Object Dimensions:
Height: [      ] blocks
Width: [      ] blocks
Length: [      ] blocks

Texture Style:
[16×16 or 32×32]

Animation:
[Yes / No]

Additional Notes:
[Optional]
```

The user then uploads the Source Image and fills in any known fields. Empty
fields receive recommendations after the image is analyzed. Pose is always
neutral and is not asked. Anatomy, bones, roots, pivots, UV settings, cube
counts, and hierarchy are MCP responsibilities and are not part of this form.

If the user uploads the image and completed template in the first message,
the generator processes it directly and does not repeat the template.

Use the Golden Sample only to inspect style, layout, background, lighting, and
visual density. Never use its subject pixels as an editable base.

### Golden Sample Guidance

1. Load the bundled Golden Sample as a style and layout example only.
2. Load the Source Image as subject authority.
3. Generate one complete five-view Draft in the Golden Sample layout. Never
   use the Golden Sample's subject pixels as input anatomy.
4. Verify subject identity, silhouette, proportions, neutral pose, and
   consistency across all five panels.
5. Apply title, labels, and dimensions without cropping the subject.
6. Stop at the approved visual modelling brief. Do not create a mesh-derived
   cube draft from this workflow.

If the Source Image or Golden Sample is unavailable, stop. Never substitute
the Golden Sample's subject or an unrelated object.

### Generation Budget and Output

```text
five-view Draft = maximum 1
automatic alternatives = 0
targeted Draft correction = maximum 1
```

Perform Golden Sample parity and texel QA, finalize title/labels/dimensions,
canvas, and compression locally, then show the Modelling Brief for review.

Local-only work may handle title, labels, dimensions, footer, border cleanup,
canvas normalization, and compression.

Output: `1280 x 720` WebP at quality 85-90.

No hash, approval-plan lock, resume state, or mandatory ZIP is required for a
usable Reference Package.
