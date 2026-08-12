# BlockIT — Modelling Workflow

**Status:** Active Policy  
**Version:** 1.4  
**Updated:** 2026-08-12

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
actual approved Modelling Brief image available to the modelling model
↓
Cross-view consistency + View Pair Map
↓
Reference Evidence Map (grounded claim_id(s))
↓
Semantic Form Contract
↓
Coordinate frame + target envelope
↓
Primary Form Hypothesis
↓
Prepare/open Bedrock project
↓
Explicit coarse primary Cube authoring
↓
inspect_model_bounds only when numeric envelope/scale/ground evidence is relevant
↓
capture_model_views using only reference-corresponding views needed for the gate
↓
actual reference + fresh model images → claim-locked primary visual gate
↓
GLOBAL failure?
  ├─ decomposition wrong → revise Semantic Form Contract
  ├─ spatial hypothesis wrong → revise/rebuild Primary Form Hypothesis
  └─ no
      ↓
LOCAL failure?
  ├─ yes → inspect_element only if needed → causal correction → fresh affected views
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

## Minimum Necessary Evidence

The workflow is strict about claims, not ritualistic about calls. Use a read, capture, or checkpoint only when its result can change the next modelling decision or prove an in-scope completion claim.

```text
no per-Cube inspect by default
no screenshot per mutation
no automatic full-view capture
no bounds call without an envelope/scale/ground question
no repeated discovery of state already known
no checkpoint based only on mutation count
local correction -> affected view/state only
UNVERIFIED -> preserve uncertainty unless more evidence is both material and obtainable
```

A global failure still reopens the owning whole-form hypothesis. A genuinely local failure should not trigger a full-project validation ceremony.

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

Reference-driven geometry requires the **actual approved reference image to be visible to the model doing the geometry reasoning**. A filename, filesystem path, manifest, `ASSET_REFERENCE.md`, textual summary, previous observation, or memory is context only and is not visual evidence. If the actual image cannot be inspected, stop as `BLOCKED` rather than reconstructing it from prose or generic object knowledge.

Read the reference as one coherent 3D object.

Check:

- recognizable target identity;
- compatible front/side/top/etc. views;
- primary masses and identity-critical landmarks;
- required counts/symmetry or deliberate asymmetry;
- silhouette/proportion relationships;
- important visible contacts/topology and negative spaces;
- important slopes/orientation;
- declared numeric dimensions when available.

Do not average materially conflicting views into guessed coordinates. If a
required axis is underdetermined, mark uncertainty.

Reference pixels are not metric calibration.

### View Pair Map

Before a reference view can approve a model view, map its identity explicitly to the matching canonical `capture_model_views` view. Ambiguous front/back, left/right, mirrored orientation, or 3/4 side remains `UNVERIFIED`; do not silently compare the closest-looking view.

### Reference Evidence Map

For only material decisions, derive compact claims from the actual image:

```text
claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Kinds may cover identity, mass/landmark, count/symmetry, topology/contact, orientation, negative space, or representation. Claims describe what is actually visible; no Cube coordinates, pixel calibration, hidden-feature invention, or generic object knowledge belong here. The map is a derived working index and never replaces the actual image.

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

## 4. Form Semantic Form + Primary Form Hypothesis

Before exact Cube numbers, form a compact **Semantic Form Contract** linked to grounded `claim_id`s:

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

A semantic label such as `head`, `body`, `handle`, or `tail` never authorizes exact coordinates. Every primary Cube must implement a grounded mass/landmark or justified split/relationship; no orphan/filler Cube exists merely because a gap can be filled.

Then reason about each important primary mass spatially:

```text
role
relative size
relative center/placement
orientation: AXIS_ALIGNED | ROTATED | UNRESOLVED
pivot role when rotated
major contact/attachment invariant
supporting claim_id(s) / reference view(s)
uncertainty
```

`AXIS_ALIGNED` requires image support; `[0,0,0]` is not a default answer. A visible material slope requires `ROTATED` unless the approved construction language intentionally uses a stepped form. `ROTATED` requires an intentional pivot role (`MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`). Material `UNRESOLVED` orientation becomes `BLOCKED` when choosing one would be guessing.

This may use qualitative/normalized proportions. Keep it as a compact working note for simple assets and expand it only when complexity/ambiguity requires more evidence tracking. It is **not**:

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
→ valid only when the orientation decision is AXIS_ALIGNED

non-zero initial rotation
→ explicit intentional origin/pivot required
```

For hierarchy:

- if a specific Group/bone is intended, locate/confirm its exact UUID;
- root placement must be intentional;
- a missing/ambiguous requested parent must fail rather than silently falling
  back.

### Geometry rules

- every primary Cube implements a grounded known mass/landmark or necessary split;
- derive exact extents from the whole-form spatial hypothesis and reference evidence;
- prefer axis-aligned geometry only when it explains the supported mass;
- rotate for a supported visible slope/orientation or required motion;
- preserve required contact invariants and intentional negative spaces;
- do not add detail or compensating geometry;
- do not treat overlap/contact/tool success as approval.

A successful mutation is execution evidence only. Once primary masses are judgeable, stop primary placement and run the gate before secondary/detail work.

## 7. Inspect Global Structural Envelope

After coarse primary authoring, use `inspect_model_bounds` only when an approved
numeric target envelope exists or the active question concerns scale, ground,
displacement, or gross placement. Otherwise skip this structural check.

When used, compare raw rendered bounds/center/ground facts with the approved target envelope.

This can reveal catastrophic scale/displacement/ground errors. It **cannot**
prove resemblance.

The current source implementation uses rendered/global Cube vertex positions;
live Blockbench behavior remains subject to local proof.

## 8. Run Canonical Primary Visual Gate

Use:

`capture_model_views`

Capture only reference-corresponding named views needed to answer the current
claim(s). Principal views are orthographic comparison evidence; 3/4 views add
volume/readability context.

When numeric target bounds exist, explicit-envelope framing should be used so
auto-framing cannot hide gross scale/offset problems.

A material visual verdict requires the **actual approved reference image and fresh current-revision model image(s) visible in the same comparison context**. A Reference Evidence Map, path, manifest, prose summary, memory, or older model capture cannot produce `PASS`.

Review each material claim difference-first:

```text
claim_id
reference view
current model view
observable difference
severity
FAIL | UNVERIFIED | PASS
```

Check:

- recognizability;
- required primary masses/landmarks/counts;
- whole silhouette;
- major proportions;
- primary mass placement;
- important orientation/slopes;
- topology/visible contacts;
- important negative spaces.

The screenshot tool is observation only. A successful capture is not `PASS`.

After material mutation, affected prior model views are stale until re-captured. If the approved image is no longer actually available to the reviewing model, remain `UNVERIFIED/BLOCKED`.

## 9. Classify Failure Before Correcting

### Global Failure

Examples:

- target is not recognizable;
- chosen semantic decomposition misses/wrongly represents required primary parts;
- whole silhouette is wrong;
- multiple major mass proportions/placements/orientations fail together.

Action:

```text
decomposition wrong → revise Semantic Form Contract against actual reference claims
spatial whole-form wrong → revise/rebuild Primary Form Hypothesis
```

Do not preserve a bad blockout because many Cubes exist.

### Local Failure

Whole form is sound, but one bounded relationship is wrong.

Action:

1. locate exact UUID;
2. reuse fresh authored state or `inspect_element` once;
3. classify the cause;
4. mutate only the responsible relationship;
5. capture fresh affected paired view(s).

## 10. Causal Correction Vocabulary

```text
TRANSLATE    placement wrong
RESIZE       extent/proportion wrong
ROTATE       orientation/slope wrong
REATTACH     contact/parent wrong
SPLIT        one mass genuinely needs separate orientation/volume
MERGE/REMOVE unnecessary/compensating geometry
ADD MASS     a genuinely missing grounded visible volume
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

For required attached masses, a rotation must preserve the declared contact invariant; technical overlap/hierarchy alone is not visual attachment proof.

## 12. Correction Stop Rule

After a correction, re-observe the smallest view set that tests the diagnosis.

If the same correction direction fails twice without new evidence:

```text
stop patching
→ revise the owning hypothesis or report BLOCKED
```

## 13. Secondary Geometry / Hierarchy / Pivots

Only after primary form passes:

- add geometry that materially improves grounded silhouette/attachment/motion/detail;
- add hierarchy for actual organization/articulation needs;
- keep non-articulated organizational Groups neutral rather than inventing
  transforms;
- use exact identity for mutation/parent targeting;
- re-check affected visible relationships after material hierarchy/pivot changes.

## 14. Complete Geometry Review

Review the complete material claim/view set needed for the asset using actual reference + fresh model evidence.

Check:

- silhouette/proportions across views;
- required major parts/counts;
- footprint/depth where visible;
- visible contact quality and negative spaces;
- rotations with no form/motion reason;
- arbitrary/distant pivots;
- unnecessary/intersecting/inverted geometry;
- hierarchy/pivots required for editability/motion.

A genuinely local issue reopens only affected relationships. A finding that
invalidates decomposition returns to Semantic Form; one that invalidates spatial whole form returns to Primary Form Hypothesis.

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

Final visual claims require the actual approved reference image + fresh current release-candidate model evidence. Do not substitute static source inspection for live Blockbench proof.

Save `.bbmodel` through the current verified operation when save is in scope.
Claim reopen fidelity only when actually tested.

## Anti-Slop Rules

Reject:

- reference-driven authoring/approval without the actual approved image;
- path/manifest/prose/memory treated as visual evidence;
- mismatched/ambiguous reference↔model view pairing;
- Cube creation as progress without intentional grounded extents;
- placement because a Cube can touch/fit somewhere;
- support-first/section-first/per-Cube universal plans;
- arbitrary multi-axis rotation or default zero rotation despite visible slope;
- default/distant pivot on a rotated part;
- detail added before primary form is coherent;
- compensating Cubes used to hide primary errors;
- structural/tool success or fluent review reported as resemblance;
- similarity/IoU/projection/SF3D authority;
- repeated micro-patching without a new hypothesis/evidence.

## Related

- [Reference Guide](04-reference-guide.md)
- [Geometry Standard](05-geometry-standard.md)
- [Visual Validation](07-visual-validation.md)
- [Reference Fidelity Decision](../knowledge/decisions/reference-fidelity-loop.md)
- [Implementation Map](../knowledge/implementation-map.md)
