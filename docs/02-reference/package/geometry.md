# LazyDesigner GEOMETRY.md Contract

Updated: 2026-09-11

This document owns the canonical content and structure of `GEOMETRY.md` inside a ChatGPT-generated LazyDesigner reference package.

`GEOMETRY.md` is a **stage-specific projection** for Codex/Astra. It explains only the geometry decisions already supported by the approved user intent, approved visual references, and `REFERENCE.json`. It is not an independent authority and it is not a Cube-by-Cube blueprint.

## Objective

`GEOMETRY.md` should let Codex answer quickly:

```text
what must be built?
what size/envelope is authoritative?
what major parts and relationships matter?
what silhouette/depth/openings must be preserved?
what representation is appropriate?
what hierarchy/pivot/rig-readiness constraints already matter?
which images should be inspected for Geometry?
what is still unknown or blocking?
```

The document should reduce repeated visual interpretation without replacing modelling reasoning.

## Authority

Use this order when a conflict appears:

```text
1. explicit current user requirement
2. approved visual reference
3. REFERENCE.json structured facts
4. GEOMETRY.md explanatory projection
5. downstream Codex interpretation
```

`GEOMETRY.md` must never introduce a fact that is absent from stronger authority.

## Required Sections

Use only applicable sections, but preserve this order so Astra/Codex can scan the file predictably:

```text
# Geometry Reference

## Target
## Scale
## Primary Structure
## Proportion & Silhouette
## Attachment / Contact / Openings
## Representation Guidance
## Rig Readiness            ← only when materially relevant
## Geometry Constraints
## Visual References
## Unknowns / Blockers
```

For very simple assets, sections with no material content may be omitted.

## 1. Target

Required.

One concise sentence describing what Codex is building.

Example:

```markdown
## Target
Minecraft Bedrock farmer NPC carrying a back basket and using the approved harvesting tool.
```

Do not paste the whole user conversation or compiled prompt.

## 2. Scale

Required when numeric dimensions are known or required by downstream construction.

Use the exact confirmed values from `REFERENCE.json`.

Example:

```markdown
## Scale
- Height: 2 Minecraft blocks
- Width: unspecified
- Length: unspecified
```

Rules:
- never infer dimensions from image pixels;
- never silently replace an explicit dimension with a visually convenient value;
- `unspecified` means no numeric fact was confirmed;
- do not invent per-part dimensions unless explicitly confirmed or technically required and supported.

## 3. Primary Structure

List only decision-critical semantic assemblies.

Example:

```markdown
## Primary Structure
- head
- torso
- pelvis
- left/right upper arms
- left/right lower arms
- hands
- left/right upper legs
- left/right lower legs
- feet
- straw hat
- back basket
- harvesting tool
```

Rules:
- semantic part identity, not Cube inventory;
- omit decorative micro-parts that do not affect form or later correction;
- preserve asymmetric parts explicitly;
- use the same stable IDs as `REFERENCE.json` when available.

## 4. Proportion & Silhouette

Describe only geometry-relevant visual relationships that materially affect recognition.

Examples:

```markdown
## Proportion & Silhouette
- Preserve the approved head-to-body ratio.
- Hat brim is a major silhouette landmark and must remain wider than the head.
- Basket must remain readable as a separate rear mass in side and 3/4 views.
- Upper and lower legs must preserve the approved compact Minecraft-style proportions.
```

Good content:
- whole-body/body-to-part ratio;
- major width/height/depth relationships;
- stance;
- wheelbase/ground clearance when vehicle-specific;
- body axis for creatures;
- major taper/slope/curvature direction;
- identity-critical silhouette landmarks.

Do not add aesthetic prose that cannot change Geometry.

## 5. Attachment / Contact / Openings

Describe topology and negative-space requirements.

Recommended form:

```markdown
## Attachment / Contact / Openings
- Hat attaches to `head`.
- Basket attaches to the upper-back/torso region; it must not float behind the body.
- Harvesting tool is owned by `right_hand`.
- Preserve the visible gap between arm and basket where shown in the approved turnaround.
```

Use this section for:
- parent/contact relationships;
- ground contact;
- supports;
- intentionally open cavities;
- closed boundaries that must not accidentally open;
- articulation overlap/contact requirements;
- front/rear or left/right orientation that changes construction.

Do not invent hidden supports or internal structure.

## 6. Representation Guidance

Record only representation decisions that materially reduce ambiguity.

Allowed vocabulary:

```text
VOLUMETRIC_GEOMETRY
SEGMENTED_FORM
PLANE_LIKE
CROSSED_CUTOUT
LAYERED_CUTOUT
TEXTURE_ONLY
ANIMATION_ONLY
OMIT
UNRESOLVED
```

Example:

```markdown
## Representation Guidance
- Body, hat, basket and tool: `VOLUMETRIC_GEOMETRY`.
- Flat shirt markings: `TEXTURE_ONLY`.
- Thin basket strap: use the simplest supported representation; exact implementation remains a Codex decision.
```

Rules:
- representation guidance is a hint/constraint, not a fixed implementation recipe;
- do not specify Cube count, coordinates, exact plane angle, or mandatory primitive count;
- when evidence is insufficient, use `UNRESOLVED` rather than guessing.

## 7. Rig Readiness

Include only when animation or articulation materially affects Geometry.

Example:

```markdown
## Rig Readiness
- Upper legs must overlap the pelvis enough to avoid an exposed hip gap during expected swing.
- Shoulder attachment must remain visually closed through the intended arm range.
- Knee segmentation must allow bending without exposing a large open seam.
- Harvesting tool must remain a separable motion participant owned by the right hand.
```

This section may describe:
- participating semantic parts;
- parent-child relationship;
- pivot **region**;
- axis intent;
- overlap/coverage;
- clearance;
- attachment invariants;
- deformation risk.

Do not provide exact pivot coordinates or animation keyframes here.

## 8. Geometry Constraints

Include only stable correctness constraints not already expressed more clearly elsewhere.

Example:

```markdown
## Geometry Constraints
- Use the user-supplied harvesting tool; do not substitute a generic pickaxe.
- Preserve basket silhouette and attachment.
- Do not close reference-visible negative spaces with convenience geometry.
```

Keep this section short.

Do not repeat generic Modelling Skill rules such as "use correct pivots" or "avoid unnecessary cubes" unless a specific asset requirement makes them material.

## 9. Visual References

Required when images exist.

Refer to image IDs from `REFERENCE.json`, not ambiguous filenames alone.

Example:

```markdown
## Visual References
- `IMG_GEO_01` — primary turnaround; authority for whole-form proportion and cross-view geometry.
- `IMG_GEO_02` — structural detail; authority for basket attachment.
- `IMG_RIG_01` — rig/deformation guide; use only for joint overlap and motion-readiness relationships.
```

Rules:
- state why each image matters to Geometry;
- do not redescribe every visible detail;
- do not list texture-only or animation-only images unless they materially constrain Geometry.

## 10. Unknowns / Blockers

Required whenever any Geometry-relevant uncertainty remains.

Recommended structure:

```markdown
## Unknowns / Blockers

### Blocking
- None.

### Non-blocking
- Exact underside basket color is unresolved and does not affect Geometry.
```

Only Geometry-stage blockers belong here.

A Texture-only uncertainty must not block Geometry.

## Profile Use

`GEOMETRY.md` may reflect knowledge from one selected profile:

```text
PROP_FURNITURE
VEHICLE
HUMANOID
CREATURE
MECHANICAL
PLANT_FOLIAGE
GENERIC
```

Do not copy the whole profile into the document.

Only extract the asset-specific conclusions that matter for this model.

Example:

```text
HUMANOID profile says joint overlap matters
→ GEOMETRY.md records only the actual shoulder/hip/knee risks for this character
```

not:

```text
copy every HUMANOID modelling rule into GEOMETRY.md
```

## Concision Rule

The document should be as short as possible while still eliminating material geometry ambiguity.

Prefer:

```text
stable semantic bullets
explicit relationships
short constraints
image-ID references
```

Avoid:

```text
long prose
history of user revisions
repeated prompt wording
generic tutorials
implementation speculation
```

## What Must Never Appear

Do not include:

```text
exact Cube coordinates guessed by ChatGPT
fixed Cube counts
unverified part dimensions
exact UV islands
texture painting instructions
animation keyframe implementation
tool-call sequences
MCP schemas
Blockbench API documentation
generic modelling tutorials
unsupported hidden geometry
conversation transcript
compiled-prompt history
```

## Adaptive Size

Simple asset:

```text
Target
Scale
Primary Structure
Representation
Visual References
Unknowns
```

Complex articulated asset:

```text
Target
Scale
Primary Structure
Proportion & Silhouette
Attachment / Contact / Openings
Representation Guidance
Rig Readiness
Geometry Constraints
Visual References
Unknowns / Blockers
```

Do not inflate a trivial prop into a long document.

## Correction / Revision Rule

A bounded user correction updates only affected Geometry guidance.

Example:

```text
straw hat → beanie
```

Update:
- relevant semantic part;
- silhouette note;
- attachment note if changed;
- affected image references;
- constraints if necessary.

Preserve unrelated accepted geometry guidance.

Do not regenerate the document from scratch in a way that silently changes unaffected facts.

## Completion Condition

`GEOMETRY.md` is ready when:
- it agrees with `REFERENCE.json` and approved images;
- it contains no unsupported facts;
- Geometry-relevant parts and relationships are clear;
- representation ambiguity is reduced where evidence allows;
- articulation constraints are present only when needed;
- visual references are mapped by stable image ID;
- Geometry blockers are explicit;
- no Texturing/Animation implementation detail has leaked into the document.
