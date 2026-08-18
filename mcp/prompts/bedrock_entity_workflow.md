# Minecraft Bedrock Entity Workflow

Create/revise Bedrock **Entity**. Cubes are geometry; Groups are bones.

## Minimum necessary evidence

**Do not inspect each newly placed Cube or capture after every mutation.** Reuse fresh state. **Do not immediately call `get_project_info`** unless needed. `inspect_model_bounds` is only for envelope/scale/ground/displacement. **Otherwise skip it.** **Do not spend additional calls trying to remove UNVERIFIED** unless evidence can change the decision.

## Actual reference grounding

Reference-driven authoring requires the **actual approved reference image visible in active multimodal context**. Path/memory **is not image evidence**. If unavailable, `BLOCKED`.

```text
Reference Evidence Map
claim_id | kind | observable claim | supporting reference view(s)
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map**. Ambiguous front/back, left/right, mirrored, or 3/4 pairing → `UNVERIFIED`. Reference fidelity is Minecraft-first: recognizability + buildability over exact contour.

## Semantic form before coordinates

Before exact `from/to/origin/rotation`, form a **Semantic Form Contract**:

```text
primary masses + must-exist reason
required count / symmetry or deliberate asymmetry
topology: what attaches to what
important negative spaces / separations
representation: geometry | texture | animation | omit
material evidence state + claim_id
```

A semantic label never authorizes coordinates. Every primary Cube maps to a declared mass/landmark; no orphan/filler Cube. Construction examples are **not presets**. Decide **transform ownership**: local rigid slope may be **Cube-owned**; shared orientation/attachment/articulation is **Group/Bone**-owned. Form/contact/articulation hierarchy belongs in **primary blockout**.

Classify primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`; **`[0,0,0]` needs image support.** A visible material slope requires `ROTATED` + explicit origin/pivot + `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, identify **contact target/invariant** first. Use an **attachment/joint pivot** when it owns the transform. Numeric overlap/hierarchy is not contact proof; important negative spaces stay open.

## Primary form / authoring

**A front-view match cannot certify depth.** Minor drift uses one canonical interpretation; only unresolved material conflict → `CONFLICTING / BLOCKED`.

Build coherent primary form with required Groups/pivots. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is execution evidence only; `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once judgeable, stop before secondary detail. Under-constrained extent is a **working hypothesis, not verified reference evidence**.

After primary `PASS`, add only identity-weighted detail.

## Difference-first visual gate

Material verdict requires the **actual approved reference image plus fresh current-revision model image(s)** together; stale/path/prose/memory cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first**. `FAIL` = critical/major mismatch; `UNVERIFIED` = missing/ambiguous/conflicting evidence; `PASS` = no critical/major supported mismatch. **Front PASS is not full 3D PASS** when depth evidence is missing/fails. Bounds, coordinates, tool success, or similarity scores cannot justify PASS. Material mutation makes affected views stale.

## Local correction / convergence

**Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once. Declare target/invariant, diagnose `TRANSLATE | RESIZE | ROTATE | hierarchy REATTACH | SPLIT | MERGE/REMOVE | ADD MASS`, mutate, verify `geometry_effect`, then compare `IMPROVED | UNCHANGED | REGRESSED`.

`UNCHANGED`/`REGRESSED` is **not progress**. Reject any correction that regresses a **previously supported material claim**; **cross-view regression** is rejected. Delta is **qualitative, not a score**. If the **same causal correction direction fails twice without new evidence**, use `BLOCKED`.

## Downstream stages

Primary-form hierarchy/pivots may exist before primary `PASS`; secondary geometry waits. End-to-end **production** texture waits for dependent geometry `PASS`; production animation waits for **participating hierarchy/pivots**. Material `FAIL` returns upstream; required `UNVERIFIED` → `BLOCKED`.

## Texture Design Contract

Normal AI-authored Bedrock Entity production uses **one color atlas PNG for the whole model**. Never create separate base-color textures per body part/Cube/material zone. If texture state is unknown, call `list_textures` once: reuse one existing color atlas; create exactly one only when none exists; if several color textures already exist, do not add another until explicit variants/PBR are distinguished from accidental fragmentation. PBR normal/height/MER channels do not change the one-base-color-atlas rule.

New projects use a **128×128 logical UV baseline**. Create the production color PNG with explicit square `width`/`height` starting at 128×128 and scale upward only in clean 128-based sizes when detail needs it; prefer the smallest sufficient canvas and do not rely on `create_texture`'s generic small default. Existing/user-supplied assets may keep authored nonstandard resolution.

Before pixels define:

```text
one base-color atlas + chosen 128-based canvas
palette roles per material family
material zones: Cube/face + mapped region
value hierarchy / part separation
one face-aware shading language
hard-pixel / edge language + alpha intent
directional/asymmetric marks + mirror constraints
seam direction / identity-critical marks
detail budget: identity > material > optional wear/noise
required PBR / material_instance meaning
```

Use a controlled palette ramp per material family, not a flat global palette. A flat base color is not completion when the reference/style shows form shading, material variation, edge treatment, pattern, or identity detail. Prefer stepped pixel value ramps and hard texel edges for Minecraft style; continuous smooth gradient or soft/anti-aliased painting is only justified by the reference. Reject random high-contrast noise.

### UV / Atlas Gate

Do not paint production pixels until the intended single-atlas UV state is usable:

```text
single color atlas selected
→ important faces mapped inside intended canvas
→ uv_offset / mirror_uv / autouv final enough for painting
→ accidental overlap rejected; intentional repeat/mirror reuse allowed
→ asymmetric/directional details have suitable orientation
→ seam-critical regions identified
```

Do not optimize packing percentage as a quality score. Do not move UVs after substantial painting without a concrete reason.

```text
MAP → inspect_element; require mapping_state=mapped + paintable=true; reuse texture_pixels.rect + flip_u/flip_v
BASE PASS → bounded draw_shape_tool for major material regions
VALUE / FORM PASS → controlled face-aware variation + material palette ramps; flat fill alone cannot pass when form is visible
IDENTITY PASS → bounded region / paint_with_brush exact-pixel path for required markings/features
SECONDARY DETAIL PASS → purposeful material detail only; stop before noise
VERIFY → fresh atlas + model-view evidence
```

Tool success is not visual `PASS`. Diagnose `REGION_PLACEMENT | PALETTE_VALUE | MATERIAL_READABILITY | UV_ORIENTATION | SEAM_CONTINUITY | IDENTITY_MARK | DETAIL_DENSITY`.

Texture convergence requires actual approved reference + fresh `get_texture` atlas + `capture_model_views`; mutation stales affected evidence. Review structure before microdetail: UV/region placement → palette/material separation → value/form shading → seam/orientation → identity marks → detail density.

```text
Texture Difference Table
region | reference | atlas | model view | category | mismatch | severity | FAIL | UNVERIFIED | PASS
```

Local `FAIL` → target/invariant → smallest bounded correction → retain pre-evidence → T3 mutate → fresh evidence → `IMPROVED | UNCHANGED | REGRESSED`. Progress requires target `IMPROVED` and no regression. Same causal correction direction failing twice without new evidence → `BLOCKED`.

## Locator / Null Object authored state

Use `list_locator_elements` for discovery, `inspect_element` for focused state, and `manage_locator` / `manage_null_object` for create/update.

## Protected Native Capability Gaps

Molang: `manage_keyframes`; no MCP eval. `manage_animation_controller` mutates state machines; `inspect_animation` reads them. TextureMesh, visible bounds, existing-animation effects, animated textures, bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project as appropriate
known project → grounded reference → Semantic Form + Primary Form → place_cube / add_group
judgeable form → capture_model_views
bounded geometry mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream texture → Texture Design Contract → single-atlas UV gate → mapped/bounded texturing
downstream animation → active animation specialist
requested deliverable → export_model
```
