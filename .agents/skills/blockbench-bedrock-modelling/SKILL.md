---
name: blockbench-bedrock-modelling
description: Bedrock Entity judgement for reference grounding, construction, transforms, correction, and visual completion.
---

# Blockbench Bedrock Modelling

Own Geometry form judgement, transform ownership, correction, and reference readiness.

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

Never infer/default/auto-switch Geometry Strategy.

```text
DIRECT      → semantic Groups/Cubes
3D_ASSISTED → Shape Reconstruction → Shape GLB PASS
             → PrimitiveAnything decomposition PASS → Cuboid Scaffold → semantic cleanup
```

3D-Assisted intermediates are hypotheses. Remove live GLB before final Geometry review. Unavailable path → `BLOCKED`; never emulate/fallback.

Use a View Pair Map only to resolve materially ambiguous front/back, left/right, mirrored, depth, or 3/4 evidence. When evidence is clear, **do not turn analysis ceremony into the work**.

## Simple Rigid Fast Path

When evidence is clear, topology simple, and the object predominantly rigid:

```text
identity + envelope + primary masses
→ cross-view proportions + shared primary boundaries
→ required continuous surfaces + intentional negative spaces
→ simplest transform ownership
→ minimum meaningful hierarchy
→ coherent PRIMARY BLOCKOUT
→ primary proportion + whole-form surface gate
→ judgeable views
→ diagnose only observed mismatch
```

Construction forms are **not presets**. Keep Groups/Bones only for real shared transform, attachment, articulation, or form-defining hierarchy. Local rigid slopes may be Cube-owned; neutral organization stays downstream.

## Semantic Form / Construction / Transform Gate

Before exact coordinates determine material facts:

```text
identity / recognizability
primary masses + must-exist reason
identity-critical landmarks
required count / symmetry or deliberate asymmetry
topology: what attaches to what
required continuous surface regions
intentional openings / recesses / negative spaces
representation: geometry | texture | animation | omit
micro-detail candidates + smallest material span
material evidence state
```

A semantic label never authorizes coordinates. **No orphan/filler Cube**: each primary Cube implements a declared mass/landmark, required surface coverage, or justified split. `PROVISIONAL` may support a coarse hypothesis; placement never verifies it.

Choose the simplest buildable construction preserving the visible requirement: volume for silhouette, plane-like Cubes for sheet form, linked segments for bends, Locator for non-visible anchors. **Use texture for surface information** that needs no silhouette, volume, contact, intentional negative-space boundary, or separate motion.

Decide transform ownership before rotation: shared semantic orientation/attachment/articulation is **Group/Bone-owned**; local rigid orientation may be Cube-owned. Classify primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`. A visible slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every required attachment state its **contact target/invariant** before coordinates. Use an **attachment/joint pivot** when it owns the transform. AABB overlap, hierarchy, or numeric touching is not contact proof; important negative spaces stay open.

## Primary Mass / Proportion / Depth Gate

For reference-driven `DIRECT` work, **coordinates are the consequence of one coherent 3D interpretation, not the starting point**. Before authoring material primary coordinates, establish:

```text
coordinate frame + canonical front + envelope
PRIMARY masses        → silhouette / major volume / major opening / major moving part
SECONDARY masses      → supported 3D identity refinement after primary PASS
SURFACE information   → texture unless a material 3D reason exists
major shared boundaries / partitions
cross-view proportion constraints
material depth state
```

Do not decompose the reference into small visible features first. Establish the whole-object mass hierarchy before local detail.

### Cross-view dimension constraint

Treat orthographic-like views as complementary constraints, not independent models:

```text
front/back → width + height evidence
left/right → depth + height evidence
top/bottom → width + depth evidence
3/4        → relationship / layering / orientation cross-check
```

A view may be perspective-stylized or internally imperfect; do not calibrate geometry by raw reference pixels. Use approved dimensions as the numeric envelope and use the reference for **relative proportions, landmarks, boundaries, count, alignment, silhouette, and contact**.

Do not lock a material axis from one view when that axis is not sufficiently observable there. Front agreement does not certify depth; side agreement does not certify width. Use the smallest set of views that actually constrains the relationship.

### Shared-boundary partitioning

When adjacent primary cohorts meet at the same visible boundary, derive them from **one shared partition**, not independent coordinate guesses.

```text
outer boundary
→ region A
→ shared boundary
→ region B / opening
→ shared boundary
→ region C
→ outer boundary
```

For an intended flush/continuous transition, reuse the same boundary value or intentionally overlapping construction when the form requires it. Do not independently estimate `A.to` and `B.from` and then repair accidental strips afterward. Symmetric or repeated partitions may share a rule only when the reference supports that relationship.

### Depth evidence state

Classify material depth decisions:

```text
OBSERVED    → directly constrained by a suitable side/top/3/4 relationship
INFERRED    → not direct, but supported by multiple consistent visible relationships
UNRESOLVED  → insufficient/conflicting evidence
```

`INFERRED` must use the **simplest geometry that explains the visible evidence**. Do not invent hidden engineering structure, unseen recesses, internal supports, or detail merely because a real-world object might contain them.

A material `UNRESOLVED` depth/topology/orientation that can change the primary form is `BLOCKED`. A non-material unresolved detail may remain coarse, move to texture, or be omitted; uncertainty is not permission to add speculative geometry.

### One coherent 3D interpretation

When approved views have minor drift, choose one consistent interpretation that preserves the strongest shared invariants. Do not fit each side independently and do not average contradictions into distorted geometry. A material conflict in count, topology, orientation, opening, attachment, or major proportion that cannot be reconciled from the approved evidence is `BLOCKED`.

### Primary coarse-to-fine lock

```text
primary mass hierarchy
→ major partitions/shared boundaries
→ material depth/layering
→ primary silhouette/proportion gate
→ surface coverage/negative-space gate
→ primary visual PASS
→ only then secondary geometry
```

Do not use secondary geometry, trim, or texture to compensate for a wrong primary mass, wrong proportion, wrong depth, or wrong opening. If several primary relationships are wrong, reopen the primary interpretation instead of patching local Cubes.

At primary review, compare global silhouette, envelope occupation, major mass ratios, openings, shared boundaries, contact/layering, and cross-view depth before judging detail.

## Surface Coverage / Negative-Space Gate

Before coordinates for a shell, body panel, wall, housing, casing, skin, or any reference region that is visually continuous, state a compact coverage contract:

```text
surface/cohort
required covered region
intentional opening or recess
adjacent cohort/contact boundary
```

For enclosure-like forms, use **closed-shell reasoning**: every major exposed region must be covered except an explicitly intended opening/recess. For naturally open forms, do not force a box; apply the same rule only to surfaces/segments the reference shows as continuous and preserve intended negative space.

**Every gap must be intentional.** A space between adjacent cohorts that is not a named opening/recess is a Geometry defect. Exact outer bounds, AABB overlap, hierarchy, or successful Cube creation do not prove surface coverage.

Build broad continuous primary surfaces/cohorts before local inserts and trim. Prefer one coherent primary mass/cohort over disconnected strips that recreate one continuous plane without a structural reason. Do not use later detail Cubes or texture to conceal missing primary coverage.

At the primary whole-form gate, review the exposed form from the minimum views needed to cover front/back/left/right/top/bottom plus a useful 3/4 view when depth relationships matter. Fail the gate if unintended background/interior/backfaces are visible through the form, if adjacent required surfaces leave a gap, or if a seam/recess exists without reference support.

## Geometry Detail Budget / Texture Delegation Gate

Before creating **secondary/detail geometry**, classify each candidate:

```text
GEOMETRY  → materially changes silhouette, real volume, intentional opening/contact,
            layering that must read in 3D, or separate motion
TEXTURE   → surface pattern/color/seam/panel line/marking/detail with no required 3D effect
OMIT      → unsupported or visually immaterial detail
```

For a **detail-only candidate whose smallest material span/thickness is `<= 4 Blockbench units` (1/4 block)**, default to `TEXTURE` or `OMIT`. Geometry at or below this size requires a stated exception: silhouette-critical thin form, genuine volume/contact, intentional negative-space boundary, or independently moving part. This is a suppression gate, not a permission rule: being larger than 4 units does not automatically justify geometry.

Do not build geometry merely to reproduce panel grids, painted seams, grout lines, scratches, bolts/buttons, thin decorative borders, material breaks, or other surface information when texture can preserve the visible requirement. Conversely, a thin structural part that genuinely changes silhouette or motion remains geometry even when its thickness is <=4 units.

Secondary geometry begins only after the primary surface-coverage gate passes. If detail creation starts increasing gaps, fragmentation, UV burden, or correction cost without a material 3D benefit, merge/remove it and delegate the visible detail downstream to texture.

## Surface / Cohort Quality Gate

**No positive-volume overlap alone is not visual PASS.** Judge affected views for penetration, accidental coplanar surfaces, holes, gaps, contact seams, and layer offsets. User-reported surface defects reopen this gate even after a clean structural validator.

For a semantic assembly translation/orientation, prefer its Group/Bone when one shared transform explains intent. Otherwise update the complete affected sibling cohort coherently. A single-child move inside a multi-part assembly needs an explicit local-part reason and fresh view proof that sibling relationships remain correct.

A repaired local gap does not certify the whole surface. Re-run the affected surface/cohort coverage check and reject a correction that merely moves the hole, creates a new seam, or uses compensating micro-geometry instead of restoring the intended continuous form.

## Future Editability / Animation Readiness

Keep semantic hierarchy and movable distinct parts separate; do not build speculative full rigs. If Animation is required, participating hierarchy/pivots/attachments must be ready before Geometry approval.

## Primary Build / Difference-First Reference Fidelity Verdict

**Stay in the geometry lane unless a current decision requires another branch.** Build the minimum coherent complete form before detail.

```text
explicit user requirement
→ original source evidence
→ best-supported approved view(s)
→ one coherent 3D interpretation
→ primary mass hierarchy + shared boundaries + material depth
→ simplest recognizable Blockbench-buildable construction
→ primary silhouette/proportion gate
→ continuous required surfaces + intentional negative spaces
→ primary whole-form surface gate
→ only then identity-weighted secondary geometry
```

Minor supported drift uses one consistent interpretation. Do not average drift. **Only unresolved material conflict becomes `BLOCKED`.** Front agreement does not certify depth.

Successful `manage_cubes` execution is **Tool success** and **execution evidence** only. Tool success never authorizes visual `PASS`. After primary `PASS`, add identity-weighted secondary geometry only where silhouette, recognizability, contact/layering, editability, or motion benefits; apply the Geometry Detail Budget before each detail cohort.

Material verdict requires the actual approved reference image + **fresh current-revision model** image(s):

```text
claim | reference view | current view | observed difference | FAIL | UNVERIFIED | PASS
```

Mutation makes affected captures stale. **Tool success, coordinates, bounds, hierarchy, validators, or similarity scores cannot justify `PASS`**. Similarity scores cannot justify `PASS`.

## Local Correction / Convergence

```text
TRANSLATE placement | RESIZE extent | ROTATE orientation
REATTACH contact/parent | SPLIT distinct volume/orientation
MERGE/REMOVE compensatory geometry | ADD MASS genuinely missing volume
```

Reuse fresh exact authored state; otherwise `inspect_elements(mode=detail)` once. State target UUID(s), cause, intended change, invariant, and expected visible/structural effect. TRANSLATE preserves size; RESIZE names changed axis + fixed anchor/center/contact; ROTATE preserves `from/to/size` and uses a justified pivot. Returned `geometry_effect` must match intent.

Capture **affected view(s) first**; expand only for material cross-view risk. Classify `IMPROVED | UNCHANGED | REGRESSED`. **Progress requires `IMPROVED`**. A fix that helps one view while materially regressing another is rejected. If the **same causal correction direction has failed twice without new evidence**, stop speculative mutation and reframe as `BLOCKED`.

## Existing Assets

Existing-asset work may use current geometry as baseline without certifying reference accuracy. Diagnose only the requested/current defect unless evidence proves the baseline materially wrong. Visual/fidelity updates require the approved reference; deterministic explicit changes may not.

## Shared Authoring Session / User Approval

Geometry owns shape/hierarchy/rig/pivots/UV Layout; Texturing owns atlas pixels/PBR. Both remain callable in the same AUTHORING Runtime surface; semantic ownership governs mutation.

`internal geometry=PASS` requires coherent primary mass/proportion/depth, the primary surface/negative-space gate to pass, and no unjustified detail-only micro-geometry to remain. `internal geometry=PASS + uv_layout=PASS → READY_FOR_USER_REVIEW` at a meaningful checkpoint. User revision continues Geometry; explicit approval saves the checkpoint and continues Texturing focus in the same AUTHORING surface.

A texture-discovered Geometry/UV defect is corrected directly with the Geometry owner; no Geometry↔Texturing phase handoff. Revalidate only affected texture evidence. `HANDOFF_REQUIRED` + `switch_authoring_phase` through Gateway is reserved for AUTHORING↔Animation.
