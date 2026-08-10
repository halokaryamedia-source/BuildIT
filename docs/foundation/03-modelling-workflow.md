# BlockIT — Modelling Workflow

**Status:** Active Policy  
**Version:** 1.3  
**Updated:** 2026-08-08

## Purpose

Define the canonical object-agnostic workflow for creating/revising Minecraft
Bedrock Entity models in Blockbench through MCP.

The workflow exists to prevent **locally plausible but globally wrong** models.
It must not encode fixture-specific anatomy, section order, Cube count, or
per-Cube approval ceremony.

Reference preparation belongs to [04-reference-guide.md](04-reference-guide.md).

## Canonical Reference Fidelity Loop

```text
Understand request
↓
Approved Modelling Brief
↓
Cross-view consistency
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Prepare/open Bedrock project
↓
Explicit coarse primary Cube authoring
↓
inspect_model_bounds
↓
capture_model_views
↓
Reference ↔ model primary visual gate
↓
GLOBAL failure?
  ├─ yes → revise/rebuild Primary Form Hypothesis
  └─ no
      ↓
LOCAL failure?
  ├─ yes → inspect_element → causal correction → fresh affected views
  └─ no
      ↓
Secondary geometry / hierarchy / pivots
↓
Complete geometry review
↓
UV / texture
↓
Texture gate when required
↓
Animation only when required
↓
Final validation
↓
Save `.bbmodel` when in scope
```

## 1. Understand Request

Identify:

- intended asset;
- Bedrock Entity target;
- expected output;
- requested dimensions when provided;
- texture/animation scope;
- only unresolved decisions that materially affect the result.

The user does not need to provide Cube counts, exact transforms, hierarchy, or
professional modelling terminology.

## 2. Review The Approved Modelling Brief

Read the reference as one coherent 3D object.

Check:

- recognizable target identity;
- compatible front/side/top/etc. views;
- primary masses;
- silhouette/proportion relationships;
- important visible contacts;
- important slopes/orientation;
- declared numeric dimensions when available.

Do not average materially conflicting views into guessed coordinates. If a
required axis is underdetermined, mark uncertainty.

Reference pixels are not metric calibration.

## 3. Establish Coordinate Frame + Target Envelope

Use one consistent model-space convention, normally:

```text
X = width / left-right
Y = height / up-down
Z = length / front-back
+Y = up
front direction = explicit
project ground = explicit
```

When numeric dimensions exist, establish the overall target envelope.

Do not silently swap/mirror front/back after authoring begins.

## 4. Form A Primary Form Hypothesis

Before exact Cube numbers, reason about each important primary mass:

```text
role
relative size
relative center/placement
orientation/slope when material
major contact/attachment
supporting reference view(s)
uncertainty
```

This may use qualitative/normalized proportions. It is **not**:

- pixel calibration;
- a locked Cube blueprint;
- a mandatory Cube count;
- a section-first/support-first plan;
- an approval sheet.

Its purpose is to prevent the direct jump:

```text
"I see a head/body/handle/etc."
→ arbitrary exact from/to/origin/rotation
```

## 5. Prepare/Open Bedrock Project

Use the current Local project workflow. Runtime behavior is source + local proof,
not historical documentation.

Do not claim save/open/project behavior that has not been verified in the active
environment.

## 6. Author The Coarse Primary Form

Build the **minimum coherent whole form**, not a polished local section.

### Initial Cube requirements

Normal `place_cube` authoring requires intentional geometry:

```text
from → explicit finite [x,y,z]
to   → explicit finite [x,y,z]
```

There is no default `[0,0,0] → [1,1,1]` Cube used as modelling progress.

For rotation:

```text
rotation = [0,0,0]
→ origin may remain neutral/omitted

non-zero initial rotation
→ explicit intentional origin/pivot required
```

For hierarchy:

- if a specific Group/bone is intended, locate/confirm its exact UUID;
- root placement must be intentional;
- a missing/ambiguous requested parent must fail rather than silently falling
  back.

### Geometry rules

- every primary Cube implements a known mass or necessary split;
- derive exact extents from the spatial hypothesis and reference evidence;
- prefer axis-aligned geometry when it explains the mass;
- rotate only for a visible slope/orientation or required motion;
- do not add detail or compensating geometry;
- do not treat overlap/contact/tool success as approval.

## 7. Inspect Global Structural Envelope

After coarse primary authoring, use:

`inspect_model_bounds`

Compare raw rendered bounds/center/ground facts with the approved target envelope
when one exists.

This can reveal catastrophic scale/displacement/ground errors. It **cannot**
prove resemblance.

The current source implementation uses rendered/global Cube vertex positions;
live Blockbench behavior remains subject to local proof.

## 8. Run Canonical Primary Visual Gate

Use:

`capture_model_views`

Capture only reference-corresponding named views needed to answer the current
question. Principal views are orthographic comparison evidence; 3/4 views add
volume/readability context.

When numeric target bounds exist, explicit-envelope framing should be used so
auto-framing cannot hide gross scale/offset problems.

Check:

- recognizability;
- whole silhouette;
- major proportions;
- primary mass placement;
- important orientation/slopes;
- visible primary contacts.

The screenshot tool is observation only. A successful capture is not `PASS`.

## 9. Classify Failure Before Correcting

### Global Failure

Examples:

- target is not recognizable;
- whole silhouette is wrong;
- multiple major mass proportions/placements/orientations fail together.

Action:

```text
reject current primary scaffold
→ revise/rebuild Primary Form Hypothesis
```

Do not preserve a bad blockout because many Cubes exist.

### Local Failure

Whole form is sound, but one bounded relationship is wrong.

Action:

1. locate exact UUID;
2. `inspect_element` to read current authored state;
3. classify the cause;
4. mutate only the responsible relationship;
5. capture fresh affected view(s).

## 10. Causal Correction Vocabulary

```text
TRANSLATE    placement wrong
RESIZE       extent/proportion wrong
ROTATE       orientation/slope wrong
REATTACH     contact/parent wrong
SPLIT        one mass genuinely needs separate orientation/volume
MERGE/REMOVE unnecessary/compensating geometry
ADD MASS     a genuinely missing visible volume
```

Do not default to adding another Cube.

### One Cube

Use `modify_cube` against a confirmed target UUID.

### Several Cubes In One Relationship

Use `modify_cubes_batch` only when one diagnosed relationship requires different
updates to several exact Cube UUIDs. The batch is an execution/Undo boundary, not
a planner.

Do not combine unrelated cleanup/speculative edits into the same batch.

## 11. Pivot Semantics

A pivot is a transform decision, not required decoration.

### Cube pivot only

When geometry is already visually correct and only pivot is wrong:

```text
origin supplied
from omitted
to omitted
rotation omitted
→ pivot-only correction
→ Cube.transferOrigin()
→ visual position preserved
```

### Cube geometry + pivot rewrite

When geometry/rotation and pivot are intentionally changed together, send the
actual changed `origin` + `from/to/rotation` fields as one authored rewrite.

### Group / Bone pivot

For a material Group pivot change:

- inspect exact Group;
- identify the joint/attachment/transform-center reason;
- use explicit target + origin;
- current `bone_rigging(set_pivot)` uses `Group.transferOrigin()` semantics.

Do not choose/copy arbitrary distant pivots.

## 12. Correction Stop Rule

After a correction, re-observe the smallest view set that tests the diagnosis.

If the same correction direction fails twice without new evidence:

```text
stop patching
→ revise the hypothesis
```

## 13. Secondary Geometry / Hierarchy / Pivots

Only after primary form passes:

- add geometry that materially improves silhouette/attachment/motion/detail;
- add hierarchy for actual organization/articulation needs;
- keep non-articulated organizational Groups neutral rather than inventing
  transforms;
- use exact identity for mutation/parent targeting;
- re-check affected visible relationships after material hierarchy/pivot changes.

## 14. Complete Geometry Review

Review the complete declared reference view set needed for the asset.

Check:

- silhouette/proportions across views;
- required major parts;
- footprint/depth where visible;
- visible contact quality;
- unnecessary/intersecting/inverted geometry;
- rotations with no form/motion reason;
- arbitrary/distant pivots;
- hierarchy/pivots required for editability/motion.

A genuinely local issue reopens only affected relationships. A finding that
invalidates the primary hypothesis returns to the primary loop.

## 15. UV / Texture

For end-to-end reference-driven creation, production UV/texture work starts only
after the complete geometry review is `PASS` for the surfaces/shape
relationships it depends on. Texture must not conceal `FAIL` or convert a
required `UNVERIFIED` geometry claim into apparent completion.

A texture-only task on an existing asset may treat current geometry as the
user-provided baseline when geometry correction is outside scope; this is not a
retroactive geometry `PASS`. A flat/placeholder texture used only to improve
visibility remains provisional and is not production surface progress.

If material geometry changes after texture work begins, re-check affected UV,
face/texture assignment, material-instance/PBR assumptions, and painted
alignment. Do not keep rejected geometry because downstream texture work already
exists.

Follow [06-texture-standard.md](06-texture-standard.md).

## 16. Animation

For end-to-end creation, production animation starts only after the geometry
baseline needed by the requested motion is accepted and participating
Group/bone hierarchy and pivots are inspected and suitable. Do not keyframe
around a material geometry `FAIL`, unresolved attachment, or pivot/hierarchy
blocker.

An animation-only task on an existing asset may use the current geometry as its
user-provided baseline without claiming static reference fidelity. A disposable
diagnostic pose/playback is allowed only to test a pivot/attachment/transform
relationship and is not animation completion evidence.

If material geometry, hierarchy, or pivots change after animation begins,
re-inspect and preview the affected animation state before completion. Existing
keyframe effort never justifies preserving a bad rig or geometry baseline.

When animation is required, verify hierarchy, pivot arcs, clipping/detachment,
intended motion, and return/neutral behavior as relevant.

## 17. Final Validation / Save

Keep proof types separate:

- structural proof;
- visual proof;
- animation proof;
- persistence/reopen proof.

Do not substitute static source inspection for live Blockbench proof.

Save `.bbmodel` through the current verified operation when save is in scope.
Claim reopen fidelity only when actually tested.

## Anti-Slop Rules

Reject:

- Cube creation as progress without intentional extents;
- placement because a Cube can touch/fit somewhere;
- support-first/section-first/per-Cube universal plans;
- arbitrary multi-axis rotation;
- default/distant pivot on a rotated part;
- detail added before primary form is coherent;
- compensating Cubes used to hide primary errors;
- structural/tool success reported as resemblance;
- similarity/IoU/projection/SF3D authority;
- repeated micro-patching without a new hypothesis.

## Related

- [Reference Guide](04-reference-guide.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
- [Implementation Map](../knowledge/implementation-map.md)
