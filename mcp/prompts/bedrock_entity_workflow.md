# Minecraft Bedrock Entity Workflow

Create/revise Bedrock **Entity**. Cubes are geometry; Groups are bones.

## Minimum necessary evidence

**Do not inspect each newly placed Cube or capture after every mutation.** Reuse fresh state. **Do not immediately call `get_project_info`** unless needed. Use `inspect_model_bounds` only for envelope/scale/ground/displacement; **Otherwise skip it.** **Do not spend additional calls trying to remove UNVERIFIED** unless evidence can change the decision. Non-reference `UNVERIFIED` is `PROVISIONAL`.

## Actual reference grounding

Reference-driven authoring requires the **actual approved reference image in active multimodal context**. Path/memory **is not image evidence**. If unavailable, `BLOCKED`. Non-reference direct tasks skip maps.

```text
Reference Evidence Map
claim_id | kind | observable claim | supporting reference view(s)
SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map**; ambiguous front/back, left/right, mirrored, or 3/4 pairing → `UNVERIFIED`. Minecraft-first fidelity: recognizability + buildability over exact contour.

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

A semantic label never authorizes coordinates. Every primary Cube maps to a declared mass/landmark; no orphan/filler Cube. Construction examples are **not presets**. **Transform ownership**: local rigid slope may be **Cube-owned**; shared orientation/attachment/articulation is **Group/Bone**-owned. Form/contact/articulation belongs in **primary blockout**.

Classify primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`; **`[0,0,0]` needs image support.** A visible material slope requires `ROTATED` + explicit origin/pivot + `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` with fallback `MASS_CENTER=center` or Group pivot → `PROVISIONAL`, otherwise `BLOCKED`.

For every **required attachment**, identify **contact target/invariant** first; use an **attachment/joint pivot** when it owns the transform. Numeric overlap/hierarchy is not contact proof; important negative spaces stay open.

## Primary form / authoring

**A front-view match cannot certify depth.** Minor drift uses one canonical interpretation; unresolved material conflict → `CONFLICTING / BLOCKED`.

Build coherent primary form with required Groups/pivots. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` proves execution only; `visual_verdict: not_evaluated` is not approval. **Do not chain Cube placement based on previous tool success.** Once judgeable, stop before secondary detail. Under-constrained extent is a **working hypothesis, not verified evidence**.

After primary `PASS`, add only identity-weighted detail.

## Difference-first visual gate

Material verdict requires the **actual approved reference image plus fresh current-revision model image(s)** together; stale/path/prose/memory cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first**. `FAIL` = critical/major mismatch; `UNVERIFIED` = missing/ambiguous/conflicting evidence; `PASS` = no critical/major supported mismatch. **Front PASS is not full 3D PASS** when depth evidence is missing/fails. Bounds, coordinates, tool success, or similarity scores cannot justify PASS. Mutation makes affected views stale.

## Local correction / convergence

**Reuse fresh exact authored state already returned for that target when sufficient**; otherwise `inspect_element` once. Declare target/invariant, diagnose `TRANSLATE | RESIZE | ROTATE | hierarchy REATTACH | SPLIT | MERGE/REMOVE | ADD MASS`, mutate, verify `geometry_effect`, then compare `IMPROVED | UNCHANGED | REGRESSED`.

`UNCHANGED`/`REGRESSED` is **not progress**. Reject correction that regresses a **previously supported material claim**; reject **cross-view regression**. Delta is **qualitative, not a score**. If the **same causal correction direction fails twice without new evidence**, use `BLOCKED`.

## Downstream stages

Primary hierarchy/pivots may precede `PASS`; secondary geometry waits. **Production** texture waits for geometry `PASS`; production animation waits for **participating hierarchy/pivots**. Material `FAIL` returns upstream; required `UNVERIFIED` → `BLOCKED`.

## Texture Design Contract

Use **one base-color atlas PNG** never per body part/Cube/material zone; `list_textures`: `none`→create, `single`→reuse, `fragmented`→stop. Variants use non-material group. New projects: 128×128 UV, 128-based production; provisional 16-based. Single atlas reused; pass `texture_id` when multiple base candidates.

Define `palette roles`, material value/hue ramps, `material zones`, `value hierarchy`, `face-aware` shading, contact/occlusion, edge, hard-pixel/alpha intent, mirror/orientation, `seam`, identity, `detail budget`, pixels per UV unit, PBR / `material_instance`. Flat fill provisional; reject random high-contrast noise.

### UV / Atlas Gate

Audit with `list_textures` before paint. AI Box UV final paint: `autouv=0`; no out-of-bounds/invalid UV, integer logical UV unless justified, no unexplained partial overlap, stable seams; exact reuse okay. Do not mentally re-derive atlas coordinates.

```text
MAP → inspect_element; mapping_state=mapped + paintable=true; reuse texture_pixels.rect + flip_u/flip_v
BASE PASS → draw_shape_tool
VALUE / FORM PASS → face-aware form + contact/occlusion + edge + value/hue
IDENTITY PASS → paint_with_brush exact-pixel path before microdetail
SECONDARY DETAIL PASS → detail by pixels per UV unit; stop before noise
VERIFY → fresh get_texture + capture_model_views model-view evidence
```

Tool success is not visual `PASS`.

Texture convergence needs actual reference + fresh `get_texture` + `capture_model_views`; mutation makes evidence stale. Use a **Texture Difference Table**. `FAIL` → **smallest bounded correction** → **retain pre-evidence** → T3 mutate → fresh evidence → `IMPROVED | UNCHANGED | REGRESSED`. **Same causal correction direction failing twice without new evidence** → `BLOCKED`.

## Protected Native Capability Gaps

Gaps: TextureMesh, visible bounds, animated textures, controller blend-curve mutation, bone-binding expressions. Native Bedrock PBR and per-face `material_instance` are **not** gaps; existing-animation effects and controller-state particle/sound authoring are supported.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project
build → place_cube / add_group → capture_model_views
mismatch → inspect_element → modify_cube / modify_cubes_batch
texture → Texture Design Contract → UV / Atlas Gate
deliverable → export_model
```
