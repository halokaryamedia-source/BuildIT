---
name: blockbench-bedrock-modelling
description: Mandatory BlockIT Bedrock Geometry and UV Layout specialist. Use before reference-grounded Geometry, hierarchy, pivots, surface continuity, geometry-vs-texture decisions, correction, or UV Layout mutation.
---

# Blockbench Bedrock Modelling

Own Geometry form judgement, transform ownership, correction, user Geometry readiness, and UV Layout.

## Minimum Necessary Evidence

- **No per-Cube inspection ceremony** without a diagnosed problem.
- **No screenshot-per-mutation loop.** Build a judgeable whole form, then gate it.
- Surface/contact question → `inspect_model_bounds` once for bounded risk hints. Otherwise skip the bounds call.
- `UNVERIFIED` does not automatically require more calls.

## Reference Grounding

Reference-driven work requires the **actual approved reference image visible in active multimodal context**. Filename/path/manifest/prose/memory is context, not visual evidence. If unavailable, `BLOCKED`.

```text
user brief/target   → identity/function
approved image      → visual authority
approved dimensions → numeric envelope authority
Geometry Strategy   → DIRECT | 3D_ASSISTED; user-selected only
claim | observable requirement | supporting view | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Never infer/default/auto-switch Geometry Strategy. `DIRECT` uses semantic Groups/Cubes. `3D_ASSISTED` remains Shape Reconstruction → Shape GLB PASS → PrimitiveAnything PASS → Cuboid Scaffold → semantic cleanup; unavailable path → `BLOCKED`, never fallback. 3D-Assisted intermediates are hypotheses and live GLB is removed before final Geometry review.

Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence. When evidence is clear, **do not turn analysis ceremony into the work**.

## Semantic Form / Construction / Transform Gate

Before exact coordinates determine material facts:

```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
required continuous surfaces + intentional negative spaces
representation: geometry | texture | animation | omit
transform ownership + attachment/contact invariant
material evidence state
```

A semantic label never authorizes coordinates. **No orphan/filler Cube**: each primary Cube implements a declared mass/landmark, required surface coverage, or justified split. `PROVISIONAL` may support a coarse hypothesis; placement never verifies it.

Construction forms are **not presets**. Choose the simplest buildable representation: volume for silhouette/real volume, plane-like Cube for genuinely sheet-like form, linked meaningful segments for bends, Locator for non-visible anchors, texture for surface information needing no silhouette/volume/contact/opening/motion.

Decide transform ownership before rotation. Shared orientation/attachment/articulation is **Group/Bone-owned**; local rigid orientation may be Cube-owned. Classify primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`. A visible slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every required attachment state its **contact target/invariant** before coordinates; use an **attachment/joint pivot** when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof.

## Primary Mass / Proportion / Depth

**Coordinates are the consequence of one coherent 3D interpretation, not the starting point.**

```text
coordinate frame + canonical front + envelope
→ primary mass hierarchy
→ major shared boundaries / partitions
→ cross-view proportion constraints
→ material depth/layering
→ primary silhouette/proportion gate
```

Treat views as complementary constraints: front/back constrain width+height; sides constrain depth+height; top/bottom constrain width+depth; 3/4 cross-checks layering/orientation. Do not calibrate geometry by raw reference pixels. Front agreement does not certify depth.

Adjacent primary cohorts sharing one visible boundary use **one shared partition**, not independent coordinate guesses. For intended flush continuity, reuse the same boundary value or a deliberately justified overlap.

Depth state:

```text
OBSERVED   → directly constrained
INFERRED   → multiple consistent visible relationships; simplest explaining geometry only
UNRESOLVED → insufficient/conflicting evidence
```

Do not invent hidden engineering structure. Material `UNRESOLVED` depth/topology/orientation → `BLOCKED`. Minor view drift uses one consistent interpretation. Do not average drift. **Only unresolved material conflict becomes `BLOCKED`.**

## Surface Coverage / Negative Space

For each shell/body/wall/housing/casing/skin or other visually continuous cohort, know:

```text
required covered region
intentional opening/recess
adjacent contact boundary
```

For enclosure-like forms use closed-shell reasoning; for naturally open forms apply coverage only where the reference shows continuity. **Every gap must be intentional.** Bounds, hierarchy, successful Cube creation, or clean positive-volume overlap do not prove coverage.

Build broad continuous primary surfaces before trim. At whole-form review, inspect enough front/back/left/right/top/bottom and useful 3/4 evidence to detect holes, visible background/interior/backfaces, unsupported seams, penetration, contact errors, or layer offsets.

**No positive-volume overlap alone is not visual PASS.** A repaired local gap does not certify the whole surface.

## Geometry Detail Budget

Before secondary/detail geometry:

```text
GEOMETRY → silhouette, real volume, opening/contact, required 3D layering, or separate motion
TEXTURE  → pattern/color/seam/panel line/marking with no required 3D effect
OMIT     → unsupported or visually immaterial
```

For a detail-only candidate whose smallest material span/thickness is `<= 4 Blockbench units` (`1/4 block`), default to `TEXTURE` or `OMIT`. Geometry needs an explicit exception: silhouette-critical thin form, genuine volume/contact, intentional negative-space boundary, or independent motion. Larger than 4 units is not automatic permission.

Do not model panel grids, painted seams, scratches, small buttons/bolts, thin decorative borders, or material breaks when texture preserves the requirement. Secondary geometry begins only after primary proportion + coverage PASS.

## Geometry Verify / User Gate

**Stay in the geometry lane unless a current decision requires another branch.**

```text
approved reference + dimensions
→ coherent primary interpretation
→ PRIMARY BLOCKOUT + required hierarchy/pivots
→ primary proportion + surface coverage PASS
→ identity-weighted secondary geometry only
→ fresh current-revision model views
→ difference-first verdict
```

Material verdict requires the actual approved reference image + fresh current-revision model evidence. Mutation makes affected captures stale.

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Tool success is **execution evidence** only. After primary `PASS`, add identity-weighted secondary geometry only. **Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`.** Similarity scores cannot justify `PASS`.

`internal geometry=PASS` requires coherent mass/proportion/depth, surface/negative-space coverage, purposeful detail, required hierarchy/pivots, and no major defect. Then stop at `READY_FOR_USER_REVIEW`. **User Geometry APPROVED is required before fresh/rebuilt production UV Layout.**

## Native UV Layout / Texel Integrity

UV Layout is Geometry-owned even though `create_texture(type=template)` is callable on shared AUTHORING.

For fresh or materially rebuilt Cube-based production UV:

```text
Geometry APPROVED
→ create_texture(type=template)
   pixel_density=<explicit>
   rearrange_uv=true
   power_of_two=true
→ native UV arrangement + template atlas
→ UV audit + important-face review
→ UV Layout PASS
→ Texturing owner
```

Do not replace the normal path with guessed rectangles, arbitrary `uv_offset` packing, stretched reference images, color-fill atlases, or hand-scaled islands merely to fit. Preserve valid imported/authored UV when no material rebuild reason exists.

Choose one model/atlas pixel-density intent. `16x` = 1 texture pixel/model unit; `32x` = 2; `64x` = 4. Face model-space aspect must match pixel-space UV aspect (direct or intentional 90° orientation). **Never non-uniformly scale an island to squeeze it into the atlas.**

If atlas pressure is real, lower global density when justified, remove unnecessary geometry, use intentional exact reuse/mirroring, or choose a larger valid bitmap. Do not distort important faces.

`uv_audit.production_gate=ready` is necessary hygiene, not UV Layout PASS. Review:

```text
face geometry ↔ UV aspect
consistent texel density
orientation / material flow
padding / seams
accidental overlap
intentional exact reuse / mirroring
unique regions for asymmetric identity detail
```

Invalid/out-of-bounds/materially stretched important mapping → `FAIL`; correct/regenerate before painting. Do not rearrange a valid template after Styling starts.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing volume
```

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, expected effect. Returned `geometry_effect` must match intent before visual review.

Capture affected views first. Classify `IMPROVED | UNCHANGED | REGRESSED`; **progress requires `IMPROVED`**. A fix that helps one view while materially regressing another is rejected. If the **same causal correction direction has failed twice without new evidence**, stop and mark `BLOCKED`.

## Existing Assets / Shared Session

Existing-asset work may use current geometry as baseline without certifying reference accuracy. Diagnose only the requested/current defect unless evidence proves the baseline materially wrong.

Geometry owns shape/hierarchy/rig/pivots/UV Layout; Texturing owns atlas pixels/PBR. Both are callable in shared AUTHORING, but semantic ownership governs mutation. A texture-discovered Geometry/UV defect returns to this owner in-session; no Geometry↔Texturing phase switch. `HANDOFF_REQUIRED` + `switch_authoring_phase` is reserved for AUTHORING↔Animation.
