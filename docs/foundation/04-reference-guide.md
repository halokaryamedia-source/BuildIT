# BlockIT — Reference Guide

**Status:** Active Policy  
**Version:** 1.8  
**Updated:** 2026-08-13

## Purpose

Define Source Image → approved visual Modelling Brief handoff for Minecraft Bedrock modelling.

The active image-generation owner is `.agents/skills/blockbench-reference-generator/SKILL.md`. This policy defines what a usable reference image means; it does not turn the generator into an MCP/geometry subsystem.

The reference should reduce ambiguity about identity, silhouette, proportion, major masses, pose, visible contacts, orientation, and style. It must **not** become a pixel-calibrated Cube blueprint.

## Core Principle

The approved multi-view image is a **visual Modelling Brief**.

```text
Source Image / user intent
↓
AI-Assisted Intake Resolution (usually silent)
↓
Internal Generation Brief
↓
Pose / articulation lock when applicable
↓
Pre-Generation Readiness Gate
↓ READY
Modelling Brief Draft
↓
user review / targeted correction when needed
↓
Approved Modelling Brief image
+
retained nonvisual Handoff Constraints
↓
Reference Fidelity modelling workflow
```

**Generation is output, not discovery.** The AI must understand the material target before the first image-generation call. Approval means the image is useful enough to model from; it does not certify metric image consistency and does not approve Cube transforms.

## Actual Image Evidence Boundary

For reference-driven modelling, the **actual approved reference image must be available as multimodal input to the model performing geometry reasoning and visual comparison**. A filename, filesystem path, manifest, package metadata, textual description, previous observation summary, or memory may identify/contextualize the reference but is not visual evidence. **A path itself is not visual evidence.**

If the active modelling model cannot actually inspect the approved image, do not reconstruct visible form from prose or generic object knowledge. Material reference-driven geometry/approval is `BLOCKED` until the image is available.

Keep authority separate:

```text
user brief / approved target → target identity + requested function
approved reference image     → visible form + approved pose
approved numeric dimensions  → whole-model scale/envelope
Handoff Constraints          → nonvisual user facts carried outside image
Reference Evidence Map       → derived working index; never image authority
```

## Canonical Terms

- **Source Image** — original user image(s); identity/provenance authority, not direct geometry data.
- **Golden Sample** — layout/lighting/presentation/construction-language example; never target anatomy authority.
- **Internal Generation Brief** — AI-resolved pre-generation understanding of subject, visible form, pose, views, and buildable construction language; not a user-facing form or Cube blueprint.
- **Modelling Brief Draft** — generated multi-view reference image before approval.
- **Modelling Brief** — approved visual image guide consumed by modelling.
- **Requested Dimensions** — optional approved numeric width/height/length target.
- **Handoff Constraints** — compact user-supplied nonvisual facts such as target scale/height, use, or must-preserve requirement; kept outside image pixels and passed to modelling in active task context.
- **Reference Evidence Map** — run-local material claim index derived from the actual approved image; never a Cube blueprint or replacement for the image.

The default Reference Generator deliverable is the **image only**. Handoff Constraints are not a ZIP/manifest/package. If modelling occurs in a separate session, pass the relevant facts explicitly alongside the approved image; do not assume image metadata or conversation memory will persist them automatically.

## AI-Assisted Intake Resolution

Reference preparation is **assistive, not form-filling**. The user should not need modelling terminology or answers to optional questions before the AI can proceed.

Default behavior is **zero clarification**:

```text
explicit user fact      → use as a constraint
directly visible fact   → AI may resolve from source
optional unknown        → leave unset
material ambiguity      → one compact clarification round
```

Rules:

- if the user says they do not know, **do not repeat** the same question;
- explain unfamiliar concepts in plain language;
- resolve directly visible identity/features/asymmetry/attachments/current state only when clear;
- never infer numeric dimensions or scale from image pixels;
- never invent hidden features, unseen asymmetry, unseen attachments, or other non-visible facts;
- optional unknowns remain unset;
- an AI recommendation is a **working interpretation**, **not a user-provided fact** until accepted.

If a material ambiguity remains, ask in **one compact round with at most three material items**. Explain the issue, what the image appears to show, and one recommended interpretation. The user may simply say **use your recommendation**. If identity/buildability is still materially unresolved, return `NEEDS REVIEW`.

## Pre-Generation Readiness Gate

A usable source image alone is not sufficient. Before the first generation call, the Internal Generation Brief must lock:

- intended subject / identity;
- material visible silhouette and major masses;
- defining visible features and important negative spaces;
- visible attachments/contacts and visible asymmetry;
- required view set;
- Blockbench/Cuboid construction interpretation;
- for articulated subjects: required limb/appendage count, attachment regions, one pose state, support/ground relation, and whether the pose is neutral or explicitly user-requested.

Optional values may remain unset. `READY` means **no unresolved material ambiguity** could still change identity, major form, required visible feature, pose integrity, or buildability.

```text
material understanding complete?
├─ YES → READY → generate one Draft
└─ NO  → use the existing one-round clarification budget
         → still material? NEEDS REVIEW → do not generate
```

Do not use generation to discover the target or compare speculative alternatives. The single targeted correction after generation is for a **concrete visual defect** against an already-ready Internal Generation Brief, not for **missing pre-generation understanding**.

## Pose / Articulation Integrity

For articulated animals, humanoids, robots, or other limb-bearing subjects, pose is a structural contract, not decoration.

### Default pose

Unless the user explicitly requests another pose:

```text
STABLE NATURAL NEUTRAL STANCE
```

A dynamic pose visible in the Source Image does **not** automatically become the modelling pose. Normalize it when a neutral stance provides clearer, more stable modelling evidence.

Neutral does not mean robotic symmetry. Mild natural offsets are allowed when anatomically plausible, but the subject must not read as being mid-gait or mid-action.

If the user explicitly requests a dynamic pose, preserve that **exact pose and limb phase** across every required panel.

### Limb / appendage contract

For each required limb or load-bearing appendage, lock:

```text
identity
→ plausible attachment region
→ coherent chain direction
→ stable relative length/proportion
→ terminal part
→ contact/support relation when applicable
```

Rules:

- required count is invariant across panels;
- near/far limbs remain distinguishable even when partially occluded;
- load-bearing feet/terminal supports share one coherent ground plane;
- no floating or ground-penetrating load-bearing foot;
- no limb may originate from an implausible torso region;
- no duplicated, missing, merged, relocated, or independently re-posed limb;
- required negative spaces between limbs/body remain consistent.

A board with a material limb, attachment, stance, or ground-contact error is `NOT READY / NEEDS REVIEW`, even if texture and overall presentation look attractive.

### View authority

Orthographic views own structural pose truth. The 3/4 view helps read volume but **must not redesign anatomy, attachment, limb position, or gait phase**.

TOP / FOOTPRINT must preserve the same body width, head/appendage placement, limb footprint, separation, and relevant negative spaces as the orthographic side/front/back views.

## View Baseline

Normal generated-reference baseline:

```text
UPPER: LEFT SIDE | FRONT | BACK
LOWER: TOP / FOOTPRINT | FRONT-LEFT 3/4
```

Orthographic views carry primary shape/proportion/pose evidence. The 3/4 view helps volume and identity; it is not metric calibration.

Add RIGHT SIDE only when material asymmetry cannot be represented honestly without it. A different view set is allowed when the actual object requires it. **Do not add views for completeness** or turn one Golden Sample's panels into anatomy rules.

### View Pair Map

Before any reference view can approve a model view:

```text
REFERENCE FRONT ↔ MODEL front
REFERENCE BACK  ↔ MODEL back
REFERENCE SIDE  ↔ MODEL matching left/right
REFERENCE TOP   ↔ MODEL top
REFERENCE 3/4   ↔ MODEL matching front_left_3q/front_right_3q
```

The sheet's actual orientation owns the mapping. **Ambiguous front/back**, left/right, or 3/4 pairing remains `UNVERIFIED`; do not compare whichever view looks most convenient.

## Cross-View Consistency

Before modelling, required views must describe one compatible object **and one compatible pose**.

```text
width        ← front/back + top when visible
height       ← front/back + side
length/depth ← side + top
limb phase   ← side/front/back/top agreement
ground       ← side/front/back shared baseline
```

If primary-mass, pose, limb, contact, or negative-space evidence materially conflicts across views, mark the reference `NOT READY / NEEDS REVIEW` rather than averaging contradictory shapes.

## Reference Evidence Map

Before exact geometry, derive only material observable claims needed for current modelling:

```text
claim_id
kind: identity | mass | landmark | count | topology/contact | orientation | negative_space | representation
observable claim
supporting reference view(s)
evidence: SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Run-local IDs may look like `mass:torso`, `count:legs`, `contact:foot_ground`, `orientation:neck`, `negative_space:leg_gap`.

Rules:

- **claim text describes what is visible**, not what the object “usually” has;
- user-provided identity/function may clarify intent, but generic world knowledge cannot invent hidden form;
- no Cube coordinates/count/pivot plan belongs in this map;
- no pixel-derived dimension is promoted to model space;
- material Semantic Form decisions trace to one or more claim IDs;
- unresolved material claims remain provisional/unverified or `BLOCKED`.

The map is a compact decision aid, not another manifest ceremony. If the actual image contradicts it, re-ground the affected claim; the image remains authority.

## Axis Evidence States

For material primary-mass dimensions/relationships:

```text
SUPPORTED    relevant views directly constrain the claim
PROVISIONAL  working value needed but evidence weak/incomplete
CONFLICTING  relevant views materially disagree
UNAVAILABLE  required axis/relationship cannot be observed
```

A front view may support width/height but cannot by itself certify depth. Perspective 3/4 may interpret volume but cannot override clearer orthographic evidence. `PROVISIONAL` remains a hypothesis. `CONFLICTING` evidence **must not be averaged**; if material and unresolved, modelling is `BLOCKED`. `UNAVAILABLE` remains `UNVERIFIED`.

## Dimensions / Handoff Constraints

When dimensions are approved:

`1 block = 16 Blockbench units`

Use dimensions as numeric whole-model target/envelope. Individual Cube transforms remain modeller decisions.

Never derive scale/transforms from pixels, subject image bounds, dimension-line lengths, panel size, perspective projection, masks, mesh fitting, or similarity score.

Target dimensions are optional for reference generation. By default they remain **Handoff Constraints outside the image**. Do not print target height, scale notes, use notes, or other user facts into the board unless the user explicitly wants those facts visible in the image.

## Draft Quality Bar

A good generated Draft should show:

- clear primary/secondary rectangular masses and purposeful size variation;
- limited purposeful rotations;
- one locked model and pose across views;
- correct limb/appendage count and plausible attachments;
- coherent shared ground contact/support;
- usable orthographic silhouettes and truthful TOP / FOOTPRINT;
- important negative spaces preserved;
- a distinct 3/4 volume read without anatomy redesign;
- clean technical-board presentation.

Reject Drafts with:

- smooth/realistic forms with pixelated skin;
- generic voxel filters, uniform Cube stacking, micro-Cube clutter, or arbitrary rotation noise;
- duplicated/missing/merged/floating/re-posed limbs;
- inconsistent subjects, pose, part count, or ground relation between panels;
- cropped/missing/ambiguous required views;
- cinematic/environment presentation that hides construction.

The Draft is a **buildable visual target**, not an exact Cube plan.

## Hidden Geometry Rule

- **hidden surface** of a known visible volume — may be completed consistently;
- **hidden feature** such as unseen protrusion/recess/attachment — do not invent without evidence or user requirement.

## Image Content / Handoff Rule

The image is the visual deliverable. **Only view labels may appear** by default.

Retain only short nonvisual Handoff Constraints that materially affect downstream modelling, for example:

```text
Asset name (optional)
Requested dimensions / target height (optional)
Target use (optional)
Must-preserve requirement (optional)
Material asymmetry note (optional)
Explicit pose override (optional)
```

Keep these facts in the active handoff context; do not render them as captions, dimensions, notes, extra panels, or decorative text unless explicitly requested. Do not create a manifest just to store them.

Do not ask the user for Cube counts, bones, pivots, UV layout, animation plans, MCP operations, or package metadata.

## Generation Budget

```text
multi-view Draft       = maximum 1
targeted correction    = maximum 1
automatic alternatives = 0
```

Generation starts only after readiness passes. Correct only a concrete visible defect. If one targeted correction still leaves a material conflict, mark `NOT READY / NEEDS REVIEW`; do not generate variants to simulate progress.

Do not revive multi-sheet/manifest/hash/ZIP machinery without a future proved need.

## Reference Generator Boundary

Reference generation belongs to an image-capable surface and returns **one Modelling Brief image only**. It does not call BlockIT MCP, author `.bbmodel` geometry, create Codex handoff packages, or emit Geometry/Texture/Animation/Validation documents.

After user approval, Codex/BlockIT consumes the actual Modelling Brief image plus any explicitly carried Handoff Constraints through the normal Bedrock modelling workflow. If the active modelling surface cannot inspect the image or does not receive a material nonvisual constraint needed for the task, do not fake that knowledge.

## Handoff To Modelling

```text
actual approved image + relevant Handoff Constraints available
↓
View Pair Map + Cross-view consistency
↓
Reference Evidence Map
↓
Semantic Form Contract
↓
Coordinate frame + target envelope when supplied
↓
Primary Form Hypothesis
↓
Explicit coarse primary Cubes
↓
Structural + visual observation
↓
actual reference ↔ fresh model claim-locked comparison
```

The Modelling Brief owns visual requirements. Handoff Constraints own approved nonvisual facts. The modeller decides Cube count, exact transforms, hierarchy, pivots, UVs, texture, and optional animation.

No reference-generation rule may hard-code object-specific MCP profiles or geometry plans.

## Completion Criteria

Reference is ready when:

- target identity is clear and recognizable;
- construction reads as Minecraft / Blockbench Cuboid form;
- required views describe one compatible object and pose;
- articulated subjects have correct limb/appendage count, plausible attachment, support/ground contact, separation, and cross-view pose lock;
- view pairing is resolvable;
- whole-form masses/proportions/contacts are understandable;
- important asymmetry and negative spaces are represented;
- no unresolved major cross-view conflict remains;
- user has approved the image for modelling.

Reference validity never proves final model fidelity.

## Related

- [Modelling Workflow](03-modelling-workflow.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
