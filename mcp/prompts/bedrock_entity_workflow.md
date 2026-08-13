# Minecraft Bedrock Entity Workflow

Create/revise Bedrock **Entity**. Cubes are geometry; Groups are bones.

## Minimum necessary evidence

**Do not inspect each newly placed Cube or capture after every mutation.** Reuse fresh state. **Do not immediately call `get_project_info`** unless needed. `inspect_model_bounds` is only for envelope/scale/ground/displacement; **Otherwise skip it**. **Do not spend additional calls trying to remove UNVERIFIED** unless evidence can change the decision.

## Actual reference grounding

Reference-driven authoring requires the **actual approved reference image visible in active multimodal context**. Path/memory **is not image evidence**. If unavailable, `BLOCKED`.

```text
user brief/target → identity/function
approved image → visible form
approved dimensions → numeric envelope
Reference Evidence Map → claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map** to matching `capture_model_views` views. Ambiguous front/back, left/right, mirrored, or 3/4 pairing → `UNVERIFIED`.

## Semantic form before coordinates

Before exact `from/to/origin/rotation`, form a **Semantic Form Contract** linked to `claim_id`s:

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

A semantic label never authorizes coordinates. Every primary Cube maps to a declared mass/landmark or justified split; **no orphan/filler Cube**.

Choose the **simplest construction that preserves the visible requirement**. Solid Cuboid, plane-like Cube, layered/inflated shell, linked segments, and texture-only are reasoning examples, **not presets or asset classes**. Use volume for silhouette; planes for sheet-like form; `inflate` for layering; linked segments for meaningful bends; use Locator—not a hidden Cube—for a required non-visible anchor.

Decide **transform ownership** before rotation. Shared orientation/attachment/articulation should be Group/Bone-owned; local rigid slope can stay Cube-owned. Form/contact/articulation-defining Groups/pivots belong in primary blockout; neutral organization may wait.

Classify each primary mass `AXIS_ALIGNED | ROTATED | UNRESOLVED`. `[0,0,0]` needs image support. A **visible material slope** requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every **required attachment**, identify **contact target/invariant** first. Use an **attachment/joint pivot** when it owns the transform. Numeric overlap/hierarchy is not contact proof; negative spaces stay open.

## Primary form / authoring

**A front-view match cannot certify depth.** Never average cross-view conflict; unresolved conflict → `BLOCKED`.

Semantic Form says what exists/how parts relate; Primary Form Hypothesis says where/how large/how oriented. Keep placement/size, claims/views, transform owner, contact invariant, uncertainty.

Build minimum coherent form with finite `from/to`, required primary Groups/pivots, and intentional transforms. Non-zero Cube rotation needs pivot/origin. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is execution evidence only; `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once judgeable, stop before secondary detail. An under-constrained extent remains a **working hypothesis, not verified reference evidence** after placement.

After primary `PASS`, use **identity-weighted detail** only where silhouette, recognizability, contact/layering, or motion benefits.

## Difference-first visual gate

Material verdict requires **actual approved reference image plus fresh current-revision model image(s) visible in the same comparison context**. Path/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first**: recognizability, masses/counts, silhouette/proportion, placement, orientation, contact, negative spaces. `FAIL` = major mismatch; `UNVERIFIED` = missing/ambiguous/conflicting evidence; `PASS` = fresh paired evidence has no critical/major supported mismatch.

Front PASS is not full 3D PASS when depth evidence is missing/fails. Bounds, hierarchy, coordinates, tool success, similarity/IoU/projection scores, or fluent review cannot justify PASS. Material mutation makes affected views stale.

## Local correction / convergence

1. **Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once.
2. Diagnose `TRANSLATE`, `RESIZE`, `ROTATE`, **hierarchy REATTACH**, `SPLIT`, `MERGE/REMOVE`, or grounded `ADD MASS`.
3. State target UUID(s), change, invariant, expected effect.
4. Mutate; verify `geometry_effect`; re-capture affected view(s).
5. Compare: `IMPROVED | UNCHANGED | REGRESSED`.

Progress requires the mismatch `IMPROVED` and no previously supported material claim/view `REGRESSED`. `UNCHANGED`/`REGRESSED` is not progress; change diagnosis or reopen Primary Form instead of patching around cross-view regression. The delta is **qualitative, not a score**.

TRANSLATE preserves size; RESIZE names fixed center/face/contact; ROTATE preserves `from/to/size`, pivot role, attachment. Wrong/no structural effect is not progress. If the **same causal correction direction fails twice without new evidence**, use `BLOCKED`.

## Downstream stages

Primary-form-defining hierarchy/pivots may exist before primary `PASS`; secondary geometry and neutral organization wait. Production texture waits for dependent **geometry** to `PASS`; production animation waits for suitable **participating hierarchy/pivots**. Material `FAIL` returns upstream; unresolved required `UNVERIFIED` → `BLOCKED`.

## Locator / Null Object authored state

Use `list_locator_elements` for discovery, `inspect_element` for focused state, and `manage_locator` / `manage_null_object` for create/update.

## Protected Native Capability Gaps

TextureMesh, visible bounding-box fields, animation controllers, sound/timeline effects, expression-valued transform keyframes, animated textures, and bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are **not** gaps.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project as appropriate
known project → grounded reference → Semantic Form + Primary Form → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream → active texture or animation specialist
requested deliverable → export_model
```
