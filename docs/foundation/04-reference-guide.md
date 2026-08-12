# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 1.4  
**Updated:** 2026-08-12

## Purpose

Define Source Image → approved visual Modelling Brief handoff for Minecraft
Bedrock modelling.

The reference should reduce ambiguity about identity, silhouette, proportion,
major masses, visible contacts, orientation, and style. It must **not** become a
pixel-calibrated Cube blueprint.

## Core Principle

The approved five-view image is a **visual Modelling Brief**.

```text
Source Image / user intent
↓
Modelling Brief Draft
↓
user review / targeted correction when needed
↓
Approved Modelling Brief
↓
Reference Fidelity modelling workflow
```

Approval means the brief is useful enough to model from. It does not certify
metric image consistency and does not approve Cube transforms.

## Actual Image Evidence Boundary

For reference-driven modelling, the **actual approved reference image must be available as multimodal input to the model performing geometry reasoning and visual comparison**. A filename, filesystem path, manifest, package metadata, textual description, previous observation summary, or memory may identify/contextualize the reference but is not visual evidence.

If the active modelling model cannot actually inspect the approved image, do not reconstruct visible form from prose or generic object knowledge. Material reference-driven geometry/approval is `BLOCKED` until the image is available.

Keep authority separate:

```text
user brief / approved target → target identity + requested function
approved reference image     → visible form
approved numeric dimensions  → whole-model scale/envelope
Reference Evidence Map       → derived working index; never image authority
```

## Canonical Terms

- **Source Image** — original user image(s); identity/provenance authority, not
  direct geometry data.
- **Golden Sample** — layout/lighting/presentation/construction-language example;
  never target anatomy authority.
- **Modelling Brief Draft** — generated five-view reference before approval.
- **Modelling Brief** — approved visual guide consumed by modelling.
- **Requested Dimensions** — approved numeric width/height/length target.
- **Reference Package** — Modelling Brief + small metadata + optional Source
  Images/support references.
- **Reference Evidence Map** — run-local material claim index derived from the actual approved image; never a Cube blueprint or replacement for the image.

## View Baseline

Normal generated-reference baseline:

- side;
- front;
- back;
- top / footprint;
- front 3/4 volume preview.

Orthographic views carry the main shape/proportion evidence. The 3/4 view helps
read volume and identity; it is not metric calibration.

A different view set is allowed when the actual object requires it. Do not turn
one Golden Sample's panels into permanent anatomy rules.

### View Pair Map

Before any reference view can approve a model view, map the reference label/orientation to the matching canonical `capture_model_views` view:

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching front_left_3q/front_right_3q
```

The sheet's actual orientation owns the mapping. Ambiguous/mirrored front/back, left/right, or 3/4 side remains `UNVERIFIED`; do not compare whichever view looks most convenient.

## Cross-View Consistency

Before modelling, the required views must describe one compatible object.

Use axis evidence deliberately:

```text
width  ← front/back + top when visible
height ← front/back + side
length ← side + top
```

Placement/orientation should rely on the views that actually reveal that
relationship.

If primary-mass evidence materially conflicts across views, mark the reference
`NOT READY / NEEDS REVIEW` rather than silently averaging contradictory shapes.

## Reference Evidence Map

Before exact geometry, derive only the **material observable claims** needed for current modelling decisions:

```text
claim_id
kind: identity | mass | landmark | count | topology/contact | orientation | negative_space | representation
observable claim
supporting reference view(s)
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Run-local IDs may look like `mass:torso`, `orientation:neck`, `contact:neck_torso`, `count:legs`, `negative_space:handle_opening`.

Rules:

- claim text describes what is visible, not what the object “usually” has;
- user-provided identity/function may clarify intent, but generic world knowledge cannot invent hidden form;
- no Cube coordinates/count/pivot plan belongs in this map;
- no pixel-derived dimension is promoted to model space;
- material Semantic Form decisions should trace to one or more claim IDs;
- unresolved material claims remain provisional/unverified or `BLOCKED`; they are not filled with confidence.

The map is a compact decision aid, not another manifest ceremony. If the actual image changes or contradicts the map, re-ground the affected claim; the image remains authority.

## Axis Evidence States

Do not let one strong view silently provide information about an axis it does not actually show. For every material primary-mass dimension or relationship that affects the 3D blockout, classify the evidence before treating it as reference-backed:

```text
SUPPORTED    one or more relevant views directly constrain the claim
PROVISIONAL  a working value is needed to build, but evidence is weak/incomplete
CONFLICTING  relevant views materially disagree
UNAVAILABLE  the required axis/relationship cannot be observed from the package
```

Typical evidence directions remain:

```text
width  <- front/back + top when visible
height <- front/back + side
length/depth <- side + top
```

These are guidance, not a fixed camera law. A view only constrains what it actually reveals.

Rules:

- A front view may support width/height but cannot by itself certify depth.
- A perspective 3/4 view may help interpret volume but must not override clearer orthographic evidence.
- `PROVISIONAL` values may be used for a coarse working blockout when necessary, but they remain hypotheses and cannot become verified merely because Blockbench accepted the Cube.
- `CONFLICTING` evidence **must not be averaged** into a fake compromise. If the conflict materially changes the primary form and the approved brief/user intent cannot resolve it, modelling is **BLOCKED** until the reference is clarified.
- `UNAVAILABLE` evidence leaves the affected claim `UNVERIFIED`; do not invent hidden dimensions/features and then report them as matched.

The goal is not to produce a large manifest. Keep only the small axis/relationship evidence map needed for current primary modelling decisions.

## Dimensions

When dimensions are approved:

`1 block = 16 Blockbench units`

Use dimensions as the numeric whole-model target/envelope. Individual Cube
transforms remain modeller decisions based on the target envelope + visible
proportions.

Never derive scale/transforms from:

- pixels;
- subject bounding boxes in the image;
- dimension-line lengths;
- canvas/panel size;
- perspective projection;
- masks/mesh fitting/similarity score.

## Golden Sample Rule

Use a Golden Sample for:

- layout;
- background/lighting;
- labeling/presentation;
- Minecraft/Blockbench construction language;
- approximate visual density.

Rule:

```text
COPY THE CONSTRUCTION LANGUAGE AND QUALITY BAR.
REPLACE THE SUBJECT.
```

The Source Image/user intent owns target identity and recognizable features.

## Draft Quality Bar

A good generated Draft should show:

- clear primary/secondary rectangular masses;
- purposeful size variation;
- stepped transitions where useful;
- limited purposeful rotations only where an angled form requires them;
- consistent construction and identity across views;
- usable orthographic silhouettes;
- coherent visible contacts;
- a distinct 3/4 volume read.

Reject Drafts that are mainly:

- smooth/realistic forms with pixelated skin;
- generic voxel filters;
- uniform Cube stacking;
- inconsistent subjects between panels;
- cropped/missing/ambiguous required views.

The Draft is a **buildable visual target**, not an exact Cube plan.

## Hidden Geometry Rule

Distinguish:

- **hidden surface** of a known visible volume — may be completed consistently;
- **hidden feature** such as an unseen protrusion/recess/attachment — do not
  invent without evidence or user requirement.

## Metadata

Keep the package small. Typical metadata:

```text
Model
Target: Minecraft Bedrock Entity
Approved reference image/file identity
Requested dimensions (when relevant)
Texture style: 16×16 / 32×32 / other requested style
Animation: required / not required
Additional notes
```

A file path identifies which image must be attached/read; the path itself is not visual evidence. Do not ask the user for Cube counts, bones, pivots, UV layout, or MCP operations.

## Generation Budget

Default:

```text
five-view Draft       = maximum 1
targeted correction   = maximum 1
automatic alternatives = 0
```

Create another Draft only for a concrete defect. Do not generate variants to
simulate progress.

Do not revive the old multi-sheet/manifest/hash/ZIP machinery unless a future
requirement proves it necessary.

## Reference Generator Boundary

Reference generation belongs to an **image-capable ChatGPT/Reference Generator
surface**, not a root Codex skill.

Codex consumes the approved Modelling Brief through the Bedrock modelling
workflow. The approved image must still be supplied as actual multimodal evidence to the modelling model. If the active surface cannot inspect/generate the required image, do not fake a completed reference.

## Handoff To Modelling

The approved reference feeds:

```text
actual approved image available
↓
View Pair Map + Cross-view consistency
↓
Reference Evidence Map
↓
Semantic Form Contract
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Explicit coarse primary Cubes
↓
Structural + visual observation
↓
actual reference ↔ fresh model claim-locked comparison
```

The Modelling Brief provides visual requirements. The modeller decides Cube
count, exact transforms, hierarchy, pivots, UVs, texture, and optional animation.

No package field may hard-code object-specific MCP profiles or geometry rules.

## Completion Criteria

Reference is ready when:

- target identity/style are clear;
- the actual approved image is available to the modelling model;
- required views describe one compatible object;
- view pairing is resolvable;
- whole-form primary masses/proportions are understandable;
- requested dimensions are available when needed;
- animation scope is known;
- no unresolved major cross-view conflict remains;
- user has approved the brief for modelling.

Reference/package validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
