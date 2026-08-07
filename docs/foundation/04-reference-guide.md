# BlockIT — Operating Model Reference

**Status:** Draft  
**Version:** 1.2

## 1. Purpose

Define how a visual reference is prepared and handed to Minecraft Bedrock
modelling in Blockbench.

The reference reduces ambiguity about form, proportion, silhouette, scale, and
style. It does **not** generate or lock Blockbench geometry.

## 2. Core Principle

The approved five-view image is a **visual Modelling Brief**.

It supplies:

- visible silhouette and proportions;
- major masses and landmarks;
- visible contacts/attachments;
- orientation and style;
- the views needed to reason about the whole object.

Declared dimensions supply the numeric geometry target. Image pixels, panel
sizes, dimension-line lengths, masks, polygons, mesh fitting, and similarity
scores are not calibration data and must not author Cube transforms.

## 3. Reference Roles

Use these terms consistently:

- **Source Image** — original user image or images used to understand the target.
  It is provenance/input for reference preparation, not direct geometry data.
- **Golden Sample** — style/layout/lighting/visual-density example for generated
  reference sheets. Its subject anatomy is never target authority.
- **Modelling Brief Draft** — generated five-view reference before user review.
- **Modelling Brief** — approved visual guide consumed by modelling.
- **Reference Package** — Modelling Brief plus simple metadata and optional Source
  Images/supporting references.
- **Blockbench Model** — reviewed editable `.bbmodel` produced from the approved
  scope.

Reference preparation owns the Source Image → Modelling Brief handoff. Bedrock
modelling owns geometry, hierarchy, pivots, UV/texture, optional animation, and
visual judgement. Blockbench runtime tooling owns only the mechanics of applying
those decisions.

## 4. Workflow Boundary

```text
Source Image / user description
↓
Reference preparation
↓
Five-view Modelling Brief Draft
↓
User review
↓
Approved Modelling Brief + metadata
↓
Bedrock modelling
↓
Blockbench Model
```

Approval means the brief is useful enough to model from. It is not certification
of metric image accuracy and does not approve any Cube transform.

## 5. Required View Baseline

Current generated-reference baseline:

- side;
- front;
- back;
- top / footprint;
- front 3/4 perspective preview.

A single image may be sufficient only when it clearly communicates the required
shape, proportions, silhouette, scale, and style. The normal generated workflow
uses the five-view set; do not invent a three-view Golden Sample workflow.

Perspective helps understand volume and identity. Orthographic views carry the
main cross-view shape/proportion evidence. The 3/4 preview is not a tracing or
metric-calibration view.

## 6. Dimensions

Requested dimensions are the numeric geometry target supplied or approved for
the task.

Example:

```text
Height: 2 blocks
Width: 1 block
Length: 2.6 blocks
```

Use `1 block = 16 Blockbench units` on each axis when converting an approved
Bedrock target. Choose individual Cube dimensions through modeller reasoning
from the numeric target plus visual proportions.

Never derive scale from:

- image pixels;
- subject bounding boxes;
- dimension-line lengths;
- panel/canvas size;
- perspective projection.

## 7. View Conflict Handling

Keep conflict handling simple:

- ignore lighting/shadow differences that do not change form;
- use another view when a part is merely occluded;
- use approved numeric dimensions for overall size;
- use front/side/back/top for relative proportions and landmarks;
- use perspective to understand volume, not exact measurement;
- if two views materially disagree about identity/form and the conflict cannot be
  resolved safely, mark the reference `Needs Review` rather than inventing a
  compromise geometry.

Cross-view scale variation is a modeller warning, not a reason to create pixel
calibration.

## 8. Hidden Geometry And Texture

Distinguish **hidden surface** from **hidden feature**:

- an ordinary unseen face of an existing visible volume may be completed as part
  of that volume;
- a distinct unseen protrusion, recess, attachment, or special feature must not
  be invented without evidence or explicit user description.

For hidden texture surfaces, continue the nearest visible base material/color or
a clearly established pattern when appropriate. Do not invent a new motif for an
unseen surface.

An underside reference is not mandatory for ordinary hidden surfaces.

## 9. Optional Supporting References

Use only when they materially reduce ambiguity:

- close-ups;
- material/color references;
- animation poses;
- prop/accessory references;
- approved variations.

Do not create supporting references as default ceremony.

## 10. Simple Modelling Brief Metadata

Keep metadata small. Typical fields:

```text
Model: Example Object
Target: Minecraft Bedrock Entity
Dimensions: Height / Width / Length
Texture Style: 16×16 or 32×32
Animation: Required / Optional / Not Required
Output: .bbmodel
Additional Notes: optional
```

The user is not required to provide anatomy, Cube counts, group names, pivots,
UV layout, bone structure, or MCP instructions. Those are modelling/runtime
implementation decisions.

## 11. Reference Quality Gate

Before modelling begins, the agent should be able to determine:

- what asset is being created;
- the intended overall form and major masses;
- the numeric target dimensions when relevant;
- the intended visual style;
- whether animation is required;
- whether any unresolved view conflict would materially change the model.

A reference is ready when it is clear enough for **whole-form interpretation**.
Do not require per-Cube plans, semantic-section plans, contact-anchor plans, or
precomputed transforms.

If a missing detail only affects minor implementation, use modeller judgement.
If it materially changes silhouette, major proportion, identity, or required
function, stop for clarification/reference correction.

## 12. Reference-To-Modelling Handoff

The reference provides visual requirements. The modelling specialist authors the
actual model.

| Reference provides | Modelling decides |
|---|---|
| numeric target dimensions | Cube dimensions/placement/rotation |
| silhouettes/proportions | whole-form primary masses |
| visible landmarks | geometry vs texture representation |
| visible contacts | hierarchy/pivot/attachment implementation |
| style/material cues | UV/texture decisions |
| animation requirement | hierarchy/pivots/motion needed for that requirement |

No reference package field may create object-specific MCP profiles or hard-coded
geometry rules.

The modelling handoff is:

```text
APPROVED MODELLING BRIEF
↓
WHOLE-FORM INTERPRETATION
↓
PRIMARY GEOMETRY PASS
↓
PRIMARY VISUAL GATE
↓
SECONDARY GEOMETRY / HIERARCHY / PIVOTS
↓
FULL GEOMETRY REVIEW
↓
UV / TEXTURE
↓
OPTIONAL ANIMATION
↓
FINAL VALIDATION
```

Detailed construction and visual-review rules belong to
`03-modelling-workflow.md`, `05-geometry-standard.md`,
`06-texture-standard.md`, and `07-visual-validation.md`.

Do **not** reintroduce historical rules such as first-Cube anchors, mandatory
support/section-first construction, fixed Cube-to-Cube overlap limits,
per-section screenshot quotas, or pixel/similarity calibration as reference
requirements.

## 13. Reference Generator Entry

Reference generation is an **image-capable ChatGPT / Reference Generator
workflow**, not a Codex root skill. Codex consumes the approved Modelling Brief;
it does not need to generate the reference before modelling.

For a dedicated Reference Generator conversation, a minimal user input is enough:

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

The user may provide the Source Image and completed fields in the first message.
Do not repeat the template when enough information is already present. Missing
low-impact fields may receive a recommended default; ask only when a missing
high-impact decision cannot be recovered safely.

Pose defaults to neutral unless the user requests otherwise. Do not ask the user
for bones, pivots, hierarchy, UV settings, or Cube counts.

If the active surface cannot generate or inspect the required image, do not fake
a completed Modelling Brief. Preserve the inputs and hand the task to the
image-capable Reference Generator surface.

## 14. Golden Sample Use

Use a Golden Sample only for:

- layout;
- background;
- lighting;
- labeling/presentation;
- Minecraft/Blockbench construction language and visual density.

Never reuse its subject anatomy as the target. The Source Image/user intent owns
the target identity, recognizable features, proportions, markings, and required
attachments.

The rule is:

```text
COPY THE CONSTRUCTION LANGUAGE AND QUALITY BAR.
REPLACE THE SUBJECT.
```

## 15. Generated Draft Quality Bar

A generated reference must depict a form that a Minecraft Bedrock modeller can
reasonably reconstruct with Blockbench Cuboids. Pixel-art styling alone is not
enough.

The Draft should show:

- clear primary and secondary rectangular masses;
- purposeful variation in Cuboid width/height/depth rather than uniform blocks;
- stepped transitions where they help explain taper or silhouette;
- limited purposeful rotations only where an angled form clearly needs them;
- one consistent subject identity and construction across every view;
- usable orthographic silhouettes plus a distinct 3/4 volume preview;
- visible contacts/attachments that are coherent enough for modeller judgement.

Reject a Draft when its main form is:

- smooth/realistic organic geometry with only a pixelated surface treatment;
- a generic voxel filter rather than intentional Blockbench-style construction;
- uniform cube stacking with no mass/proportion planning;
- visually inconsistent between views as if each panel shows a different model;
- cropped, missing a required view, or too ambiguous for whole-form modelling.

Do not turn this quality bar into a Cube blueprint. The Draft communicates a
**buildable visual target**; the modelling specialist still owns the actual Cube
count, transforms, hierarchy, pivots, UVs, and implementation choices.

## 16. Generation Budget

Default generated-reference budget:

```text
five-view Draft = maximum 1
automatic alternatives = 0
targeted Draft correction = maximum 1
```

Generate another draft only when a concrete reference defect needs correction.
Do not create alternatives merely to show more work.

Local finishing may handle title, labels, dimensions, footer/border cleanup,
canvas normalization, and compression when needed.

Current presentation target: `1280 × 720` WebP around quality `85–90`.

Do not create the old multi-sheet technical package, executable manifest, crop
contracts, hashes, or mandatory ZIP unless a future requirement proves that
those artifacts are needed again.

## 17. Completion Criteria

Reference preparation is complete when:

- target identity and style are clear;
- the required view set is usable;
- the Draft passes the Minecraft/Blockbench buildability quality bar;
- requested dimensions are present when needed;
- animation status is known;
- no unresolved major cross-view/identity conflict remains;
- the brief is approved for modelling.

Package/file validation proves handoff structure only. It never proves model
geometry or visual correctness.