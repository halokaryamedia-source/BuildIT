# Stage Quality Insight Matrix

Use this as a compact quality lens for the four user-visible stages.

Internal passes do not create separate user approvals.

## 0. Reference Intake — Automatic Gate

Required quality:

- approved package contains `PRODUCTION_CONTEXT.md`, one Reference Visual, `GEOMETRY.md`, `TEXTURING.md`, `ANIMATION.md`, `VALIDATION.md`, manifest, and handoff;
- target, scale, front direction, intended use, geometry-vs-texture split, and Animation requirement are explicit;
- no material reference conflict exists;
- `state.json` is created or recovered.

Failure signals:

- legacy numbered sheets are treated as mandatory;
- target or scale is ambiguous;
- manifest and documents disagree materially;
- reference package cannot determine the active Geometry scope.

Result:

- `PASS` → one-time preflight and Geometry;
- `REFERENCE_CONFLICT` → stop before Blockbench edits;
- `BLOCKER` → repair the missing runtime/reference prerequisite.

No user approval is required for a valid intake.

## 1. Geometry

Internal passes:

```text
Primary Form
→ Structural Detail
```

Required quality:

- scale envelope matches the approved package;
- Front, Left Side, Back, Top / Footprint, and Front-left 3/4 are readable;
- primary masses and silhouette-critical parts exist;
- ground contacts are correct;
- hierarchy and attachments are stable;
- cube count is intentional;
- geometry-only and texture-only decisions are respected;
- no floating major part, bad collision, or z-fighting remains.

Hard no's:

- UV or texture work;
- decorative micro-cubes;
- geometry used only for seams, stripes, shading, scratches, or tiny trim;
- unapproved broad redesign;
- final export.

Failure signals:

- wrong scale or asset class;
- Front or Left Side silhouette fails;
- disconnected major part;
- unstable parent/attachment chain;
- repeated tiny cubes dominate the form;
- accepted manual work changes without approval.

Review evidence:

- five standard views;
- dimensions/hierarchy/cube report;
- persistent Geometry checkpoint.

User decision:

- `APPROVED` → freeze accepted Geometry and continue to Texture;
- `REVISION: ...` → patch one named issue or tightly related pair.

## 2. Texture

Internal passes:

```text
UV
→ Base Texture
→ Detail Texture
```

Required quality:

- approved atlas and UV strategy are used;
- focal faces have sufficient texel density;
- safe mirrored/shared areas reuse UV;
- directional/unique areas remain unique where required;
- palette and material zones match the Reference Visual;
- large visible faces have readable pixel-stepped depth;
- seams, alpha, and emissive behavior follow `TEXTURING.md`;
- Classic Bedrock constraints are preserved.

Hard no's:

- approval between internal Texture passes;
- broad Geometry redesign;
- PBR or Vibrant Visuals;
- smooth blur;
- random pixel noise without material/shading purpose;
- unnecessary additional textures or atlas growth.

Failure signals:

- compressed focal UVs;
- important UV overlap;
- visible seam or stretch;
- wrong color/material family;
- flat hero surfaces;
- texture detail placed on the wrong side;
- geometry created to solve a pixel-level issue.

Review evidence:

- atlas;
- Front, Left Side, Back, and Front-left 3/4;
- UV/material report;
- persistent Texture checkpoint.

User decision:

- `APPROVED` → freeze accepted Texture and continue to Animation or Final Validation;
- `REVISION: ...` → patch one named Texture/UV issue or tightly related pair.

## 3. Animation — Optional

Run only when required by the approved manifest or `ANIMATION.md`.

Required quality when used:

- hierarchy and pivots match the approved contract;
- only required clips or motion families are created;
- neutral pose is recovered exactly;
- ground contact is acceptable;
- cuboids remain rigid unless the approved model explicitly requires another behavior;
- no critical clipping occurs;
- accepted Geometry and Texture are preserved.

Hard no's:

- optional clips added merely for completeness;
- approved Geometry or Texture changed silently;
- unauthorized motion axes;
- broad rig redesign not required by the package.

Failure signals:

- wrong pivot;
- broken parent-child motion;
- floating/sliding contacts;
- neutral-pose drift;
- clipping or deformation that changes identity.

Review evidence:

- hierarchy and pivot summary;
- neutral pose;
- required clips or representative samples;
- ground-contact and clipping report;
- persistent Animation checkpoint.

When not required:

```text
ANIMATION_SKIPPED
Reason: not required by approved reference package
```

No fake animation evidence is created.

## 4. Final Validation

Required quality:

- final `.bbmodel` and textures exist;
- five standard views match the approved Reference Visual;
- Geometry, Texturing, and Animation/skip contracts pass;
- Blockbench validator has no unresolved blocking error;
- naming and export readiness are correct;
- completed `VALIDATION.md` and revision summary exist;
- no new feature or broad polish was introduced during validation.

Automatic repair rule:

- at most two clearly local validation failures may be fixed automatically;
- broad failures return to the relevant stage review;
- accepted areas remain protected.

Failure signals:

- unresolved identity, scale, silhouette, palette, hierarchy, or animation mismatch;
- missing evidence or final artifacts;
- final output differs from the reviewed stage checkpoint;
- validation work expands scope.

Final evidence:

- final `.bbmodel` path;
- texture files;
- five standard views;
- final atlas;
- completed validation report;
- Animation evidence when applicable;
- concise revision summary.

User decision:

- `APPROVED` → `DONE`;
- `REVISION: ...` → map the issue to Geometry, Texture, Animation, or a local Final Validation correction.

## Decision Rule

- `BLOCKER`: stop and report one recovery action.
- `REVISION_REQUIRED`: apply only the named local revision scope.
- `PASS`: present the user-visible stage preview and wait for approval.
- Same blocker after two focused attempts: stop and request strategy reset.

## Ponytail Check

Before any meaningful batch:

```text
Does this serve the active stage acceptance criteria?
Is it required now?
What is the smallest complete safe batch?
What accepted area must remain unchanged?
What focused evidence proves completion?
When should work stop?
```

If the action is not required now, use `DEFERRED_NOT_REQUIRED` rather than executing it.
