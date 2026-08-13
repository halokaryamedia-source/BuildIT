# Minecraft Bedrock Entity Workflow

Create/revise Bedrock **Entity**. Cubes are geometry; Groups are bones.

## Minimum necessary evidence

Do not inspect each new Cube or capture after every mutation. Reuse fresh state. Do not immediately call `get_project_info` unless needed. `inspect_model_bounds` is only for envelope/scale/ground/displacement; otherwise skip it. `UNVERIFIED` is not a retry command.

## Actual reference grounding

Reference work requires the **actual approved reference image visible in active multimodal context**. Path/memory **is not image evidence**. If unavailable, `BLOCKED`.

```text
user brief/target → identity/function
approved image → visible Minecraft form guidance
approved dimensions → numeric envelope
Reference Evidence Map → claim_id | kind | observable claim | supporting reference view(s) | SUPPORTED | PROVISIONAL | CONFLICTING | UNAVAILABLE
```

Build a **View Pair Map**. Ambiguous front/back, left/right, mirrored, or 3/4 pairing → `UNVERIFIED`.

Reference fidelity is **Minecraft-first**: recognizability + Blockbench buildability matter more than exact anatomy/contour.

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

A semantic label never authorizes coordinates. Every primary Cube maps to a declared mass/landmark or justified split; no orphan/filler Cube.

Choose the **simplest construction that preserves the visible requirement**. Cuboid, plane-like Cube, layered/inflated shell, linked segments, and texture-only are reasoning examples, not presets. Use volume for silhouette, planes for sheet-like form, linked segments for meaningful bends, and Locator for required non-visible anchors.

Decide transform ownership before rotation. Shared orientation/attachment/articulation should be Group/Bone-owned; local rigid slope may be Cube-owned. Form/contact/articulation Groups/pivots belong in primary blockout; neutral organization may wait.

Classify primary masses `AXIS_ALIGNED | ROTATED | UNRESOLVED`. A visible material slope requires `ROTATED` + explicit origin/pivot + role `MASS_CENTER | ATTACHMENT | JOINT | PARENT_TRANSFORM`. Material `UNRESOLVED` → `BLOCKED`.

For every required attachment identify contact target/invariant first. Numeric overlap/hierarchy is not contact proof; important negative spaces stay open.

## Primary form / authoring

**A front-view match cannot certify depth.** Triage cross-view differences before conflict:

```text
MINOR → choose one canonical Minecraft interpretation → continue
MATERIAL → CONFLICTING / BLOCKED
```

Minor drift does not change identity, primary masses/counts, topology/attachment, important negative spaces, or Minecraft buildability. Canonical choice: **user requirement → original Source evidence → best-supported approved view → simplest recognizable Blockbench-buildable form**. Do not average drift. Only unresolved material conflict → `BLOCKED`.

Build minimum coherent form with finite transforms and required primary Groups/pivots. Successful `place_cube`, `modify_cube`, or `modify_cubes_batch` is execution evidence only; `visual_verdict: not_evaluated` is not approval. Do not chain Cube placement from tool success. Under-constrained extent is a working hypothesis, not verified evidence.

After primary `PASS`, use identity-weighted detail only where silhouette, recognizability, contact/layering, or motion benefits.

## Difference-first visual gate

Material verdict requires **actual approved reference image plus fresh current-revision model image(s) visible in the same comparison context**. Path/prose/memory/stale capture cannot approve.

```text
claim_id | reference view | current model view | observed difference | FAIL | UNVERIFIED | PASS
```

Review **difference-first**. `FAIL` = critical/major mismatch; `UNVERIFIED` = missing/ambiguous/materially conflicting evidence; `PASS` = no critical/major supported mismatch. Minor reference drift is not `FAIL` when the canonical Minecraft interpretation remains recognizable/buildable.

Front PASS is not full 3D PASS when depth evidence is missing/fails. Bounds, hierarchy, coordinates, tool success, similarity/IoU/projection scores, or fluent review cannot justify PASS. Material mutation makes affected views stale.

## Local correction / convergence

Reuse fresh exact authored state when sufficient; otherwise `inspect_element` once. Diagnose `TRANSLATE | RESIZE | ROTATE | REATTACH | SPLIT | MERGE/REMOVE | ADD MASS`, state target/invariant/effect, mutate, verify `geometry_effect`, then compare `IMPROVED | UNCHANGED | REGRESSED`.

Progress requires `IMPROVED` and no supported material claim/view `REGRESSED`. Delta is qualitative, not a score. If the **same causal correction direction fails twice without new evidence**, use `BLOCKED`.

## Downstream stages

Primary-form hierarchy/pivots may exist before primary `PASS`; secondary geometry waits. Production texture waits for dependent geometry `PASS`; animation waits for suitable hierarchy/pivots. Material `FAIL` returns upstream; unresolved required `UNVERIFIED` → `BLOCKED`.

Texture specialist is Minecraft-first too: minor shade/noise/marking drift may be canonicalized; material identity/required region/channel conflict may not.

## Protected Native Capability Gaps

Molang: `manage_keyframes`; no MCP eval. `inspect_animation` reads controllers. Controller mutation, TextureMesh, visible bounds, sound/timeline mutation, animated textures, bone-binding expressions remain gaps; do not fake them. Native Bedrock PBR and per-face `material_instance` are not gaps.

## Stage/tool routing

```text
project unknown/absent → get_project_info or create_project
known project → grounded reference → Semantic Form + Primary Form → place_cube / add_group
judgeable form → capture_model_views
bounded mismatch → inspect_element only if needed → modify_cube / modify_cubes_batch
downstream → active texture or animation specialist
requested deliverable → export_model
```
