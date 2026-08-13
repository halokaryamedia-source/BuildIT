# BlockIT — Modelling Workflow

**Status:** Active Policy  
**Version:** 1.5  
**Updated:** 2026-08-13

## Purpose

Define the canonical object-agnostic workflow for creating/revising Minecraft Bedrock Entity models through MCP. It prevents **locally plausible but globally wrong** models without encoding fixture-specific anatomy, presets, section order, Cube count, hierarchy depth, or per-Cube approval ceremony.

Professional `.bbmodel` samples are evidence for modelling decisions only. Reference preparation belongs to [04-reference-guide.md](04-reference-guide.md).

## Canonical Reference Fidelity Loop

```text
Understand request
↓
actual approved Modelling Brief image available
↓
Cross-view consistency + View Pair Map
↓
Reference Evidence Map
↓
Semantic Form Contract
↓
construction decision + transform ownership
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Prepare/open Bedrock project
↓
coarse primary Cubes + required primary Groups/pivots
↓
inspect_model_bounds only when envelope/scale/ground evidence matters
↓
capture only reference-corresponding views needed for the gate
↓
actual reference + fresh model images → claim-locked primary visual gate
↓
GLOBAL failure?
  ├─ decomposition wrong → revise Semantic Form
  ├─ spatial hypothesis wrong → revise/rebuild Primary Form
  └─ no
      ↓
LOCAL failure?
  ├─ yes → inspect only if needed → causal correction → fresh affected views
  └─ no
      ↓
identity-weighted secondary geometry + neutral organization
↓
complete geometry review
↓
UV / texture when required
↓
animation when required
↓
final validation / save
```

## Minimum Necessary Evidence

The workflow is strict about claims, not ritualistic about calls.

```text
no per-Cube inspect by default
no screenshot per mutation
no automatic full-view capture
no bounds call without an envelope/scale/ground question
no repeated discovery of fresh known state
no checkpoint based only on mutation count
local correction → affected view/state only
UNVERIFIED → preserve uncertainty unless material obtainable evidence can change it
```

A global failure reopens the owning whole-form hypothesis. A local failure should not trigger full-project ceremony.

## 1. Understand Request

Identify intended asset, Bedrock Entity target, expected output, supplied dimensions, texture/animation scope, and only unresolved decisions that materially affect the result.

The user does not need to provide Cube counts, transforms, hierarchy, or professional modelling terminology.

## 2. Review The Approved Modelling Brief

Reference-driven geometry requires the **actual approved reference image visible to the model doing geometry reasoning**. Filename/path/manifest/prose/prior observation/memory is context, not visual evidence. If unavailable, `BLOCKED`.

Read the reference as one coherent 3D object. Ground only material identity, masses/landmarks, counts/symmetry, silhouette/proportion, contacts/negative spaces, orientation/slopes, and supplied numeric dimensions.

Do not average conflicting views. Reference pixels are not metric calibration.

### View Pair Map

Map each used reference view to the matching canonical `capture_model_views` orientation. Ambiguous front/back, left/right, mirrored, or 3/4 pairing stays `UNVERIFIED`.

### Reference Evidence Map

```text
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Claims describe visible evidence. No Cube coordinates, pixel calibration, hidden-feature invention, or generic object knowledge belong here.

## 3. Establish Coordinate Frame + Target Envelope

Use one consistent model-space convention:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
+Y = up
front direction = explicit
project ground = explicit
```

Approved numeric dimensions define the whole-model envelope. Do not silently mirror/swap front after authoring begins.

## 4. Semantic Form, Construction, Transform Ownership

Before exact coordinates, form a compact **Semantic Form Contract** linked to grounded claims:

```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
important negative spaces / separations
representation: geometry | texture | animation | omit
material evidence state
```

A semantic label never authorizes coordinates. Every primary Cube implements a grounded mass/landmark or justified split/relationship; no orphan/filler Cube exists merely because a gap can be filled.

### Construction decision

Choose the **simplest construction that preserves the visible requirement**. Solid Cuboid, plane-like Cube, layered/inflated shell, linked meaningful segments, and texture-only are examples of reasoning, **not presets or asset classes**.

- volume/silhouette → real Cuboid mass;
- genuinely sheet-like form → plane-like/thin geometry;
- visible over-layer → deliberate shell/inflate where appropriate;
- meaningful bend/articulation → purposeful linked segments, never micro-Cube staircasing;
- surface-only information → texture.

Complexity follows the object. Do not add parts merely to look professional.

### Transform ownership

Before rotation, decide whether it is **Cube-owned** or **Group/Bone-owned**.

Use a Cube-owned transform for one rigid local part. Use a Group/Bone-owned transform when several Cubes share one semantic orientation, attachment, articulation, or segment transform.

A hierarchy/pivot required for primary form, attachment/contact, articulation/segment continuity, or shared transform ownership belongs in the **primary blockout**. Neutral organization may wait.

### Primary Form Hypothesis

For each material primary mass/segment keep:

```text
role
relative size / placement
orientation: AXIS_ALIGNED | ROTATED | UNRESOLVED
transform owner
pivot role when rotated
contact/attachment invariant
supporting claim_id(s) / views
uncertainty
```

`AXIS_ALIGNED` requires image support. A visible material slope requires `ROTATED` unless an intentional stepped construction better matches the approved form. `ROTATED` needs role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

This is a compact working hypothesis, not pixel calibration, fixed Cube blueprint, mandatory Cube count, preset, or approval sheet.

## 5. Prepare/Open Bedrock Project

Use the current Local project workflow. Runtime behavior is current source + actual local proof. Do not claim save/open/runtime behavior that was not verified in the active environment.

## 6. Author The Coarse Primary Form

Build the **minimum coherent whole form**, including required primary transform hierarchy/pivots.

### Initial Cube requirements

```text
from → explicit finite [x,y,z]
to   → explicit finite [x,y,z]
```

A zero-span axis is acceptable only for a genuinely plane-like representation; it is not a shortcut for unknown depth.

```text
rotation = [0,0,0]
→ only when AXIS_ALIGNED is the intended orientation

non-zero initial rotation
→ explicit intentional origin/pivot required
```

When a specific Group/bone is intended, use exact identity. Missing/ambiguous requested parent fails; root placement must be intentional.

### Geometry rules

- every primary Cube implements a grounded mass/landmark/necessary split;
- exact extents come from the whole-form hypothesis and evidence;
- rotation must express a supported slope/orientation or motion relation;
- shared semantic transforms belong to the responsible Group/Bone;
- preserve required contact invariants and negative spaces;
- do not add secondary detail or compensating geometry;
- overlap/hierarchy/tool success is not approval.

Once primary form is judgeable, stop primary placement and run the gate.

## 7. Inspect Global Structural Envelope

Use `inspect_model_bounds` only for approved numeric envelope, scale, ground, displacement, or gross placement questions. It can reveal catastrophic structural errors; it cannot prove resemblance.

## 8. Run Canonical Primary Visual Gate

Use `capture_model_views` only for reference-corresponding views required by current claims.

A material verdict requires the **actual approved reference image and fresh current-revision model image(s) visible in the same comparison context**.

```text
claim_id
reference view
current model view
observable difference
FAIL | UNVERIFIED | PASS
```

Review difference-first: recognizability, primary masses/counts, silhouette/proportion, placement, orientation, contacts, negative spaces.

A successful capture is not `PASS`. Front PASS is not full 3D PASS when depth evidence is missing/fails. Bounds, hierarchy, coordinates, validators, similarity scores, or fluent review cannot justify PASS. Affected captures become stale after material mutation.

## 9. Classify Failure Before Correcting

### Global

Wrong recognizability, decomposition, silhouette, or several primary relations:

```text
decomposition wrong → revise Semantic Form
spatial whole-form wrong → revise/rebuild Primary Form
```

Do not preserve a bad blockout because work already exists.

### Local

Whole form is sound but one relationship is wrong:

1. locate exact UUID;
2. reuse fresh state or `inspect_element` once;
3. diagnose cause;
4. mutate only the responsible relationship;
5. capture fresh affected paired view(s).

## 10. Causal Correction Vocabulary

```text
TRANSLATE    placement wrong
RESIZE       extent/proportion wrong
ROTATE       orientation/slope wrong
REATTACH     contact/parent wrong
SPLIT        distinct orientation/volume genuinely needed
MERGE/REMOVE unnecessary/compensating geometry
ADD MASS     genuinely missing grounded visible volume
```

Do not default to adding another Cube. `modify_cubes_batch` is an execution/Undo boundary for one diagnosed relationship, not a planner.

## 11. Pivot Semantics

A pivot is a transform decision, not decoration.

Cube pivot-only correction uses `Cube.transferOrigin()` semantics to preserve visual position. A geometry+rotation+pivot rewrite sends the intended authored fields together.

A material Group/Bone pivot needs a joint/attachment/transform-center reason and exact target. Do not copy arbitrary distant pivots.

## 12. Correction Stop Rule

After correction, re-observe the smallest evidence set testing the diagnosis. If the same causal correction direction fails twice without new evidence:

```text
stop patching
→ revise owning hypothesis or report BLOCKED
```

## 13. Secondary Geometry / Neutral Organization

Only after primary `PASS`, add **identity-weighted** secondary geometry where silhouette, recognizability, contact/layering, or motion materially benefits.

Do not subdivide the whole object uniformly, add arbitrary rotations, or increase hierarchy depth merely to look detailed. Neutral organizational Groups may be added now; primary transform hierarchy should already exist when required by form.

## 14. Complete Geometry Review

Use actual reference + fresh model evidence. Check silhouette/proportion, primary parts/counts, depth/footprint where visible, contacts/negative spaces, representation choices, transform ownership, rotations/pivots, unnecessary/intersecting geometry, and editability/motion hierarchy.

A local issue reopens only affected relations. Wrong decomposition returns to Semantic Form; wrong whole spatial relation returns to Primary Form.

## 15. UV / Texture

Production UV/texture starts only when dependent geometry is accepted. Texture must not conceal `FAIL` or make `UNVERIFIED` geometry look finished.

Texture-only work on an existing asset may use current geometry as user-provided baseline without claiming reference `PASS`. A provisional flat/placeholder texture may improve readability but is not production progress.

If geometry changes, re-check affected UV/texture/material assumptions. Follow [06-texture-standard.md](06-texture-standard.md).

## 16. Animation

Production animation starts only after the geometry baseline and participating Group/bone hierarchy/pivots needed by the motion are suitable. Do not keyframe around geometry `FAIL`, broken contact, or unresolved pivot/hierarchy.

Animation-only work may use existing geometry as baseline without claiming static fidelity. Diagnostic pose/playback is evidence only for the tested transform relation.

If geometry/hierarchy/pivots change after animation begins, re-check affected animation. Existing keyframe effort never justifies preserving a bad rig or geometry baseline.

## 17. Final Validation / Save

Keep structural, visual, animation, and persistence proof separate. Final visual claims require actual approved reference + fresh release-candidate model evidence. Save `.bbmodel` through current verified operations when in scope; claim reopen fidelity only when tested.

## Anti-Slop Rules

Reject:

- authoring/approval without actual approved image;
- path/prose/memory treated as visual evidence;
- ambiguous reference↔model view pairing;
- arbitrary geometry without grounded purpose;
- preset/fixed complexity or sample-specific anatomy rules;
- arbitrary rotations or wrong transform ownership;
- hierarchy depth used as a quality signal;
- detail before coherent primary form;
- secondary geometry hiding primary errors;
- tool success reported as resemblance;
- similarity/IoU/projection authority;
- repeated micro-patching without new hypothesis/evidence.

## Related

- [Reference Guide](04-reference-guide.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
