# CODEX REFERENCE HANDOFF — Black Rhinoceros

## Package lock

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Target: Minecraft Bedrock Entity
- Package Status: `APPROVED`
- Primary Visual Authority: `black_rhinoceros_reference_visual.png`
- Reference Visual SHA-256: `fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f`
- Canonical Model: `black_rhinoceros.bbmodel`
- Animation: `ANIMATION_SKIPPED`
- Geometry: cuboid-only
- Front: `-Z`
- Ground: `Y = 0`
- Envelope: `27.2u W × 40u H × 52.8u D`, tolerance `±1u`

## Authority and context lock

1. Call `get_stage_context` for `GEOMETRY`.
2. Call `inspect_reference_visual` and inspect the returned image.
3. Open full package documents only when compact context is insufficient or conflicting.

The current repository and this package override downloaded project-context ZIPs or old prompt packs. Stop `LEGACY_SKILL_CONFLICT` if another instruction requires four sheets, three approval moments, or numbered technical images.

Do not generate or substitute loose angles, technical sheets, or replacement images.

## Required Geometry workflow

```text
get_stage_context
→ inspect_reference_visual
→ PRIMARY_FORM only
→ capture_visual_feedback: left_side + front + top_footprint
→ analyze_geometry_views: left_side + front + top_footprint
→ repair only ranked affected masses
→ STRUCTURAL_DETAIL
→ capture and analyze affected views
→ final five-view capture_visual_feedback
→ final five-view analyze_geometry_views
→ record_geometry_visual_result
→ validate_geometry_contract
→ verify_geometry_review_ready
→ non-approved checkpoint
→ GEOMETRY_REVIEW / AWAITING_USER_REVIEW
```

Codex must inspect actual image payloads. Paths or successful screenshot writes are not visual evidence.

`analyze_geometry_views` is the deterministic diagnosis authority. It projects transformed cuboids at the approved coordinate scale and must report:

- failing view;
- semantic region;
- missing/excess direction;
- approximate magnitude in Blockbench units;
- affected parts;
- specific recommendation;
- local or major repair route.

Do not make unrelated trial-and-error changes. Free-rescaling the current model to fit the Reference Visual is forbidden.

## Enforced phases

```text
PRIMARY_FORM
→ STRUCTURAL_DETAIL
→ FINAL_REVIEW_READY
```

During `PRIMARY_FORM`, do not add horns, ears, final feet, tail, or minor detail. First establish:

- long deep torso;
- high heavy shoulder;
- lower narrowing rear;
- thick short neck;
- low broad head;
- broad muzzle;
- four short thick provisional legs;
- correct ground relationship.

Left, Front, and Top diagnosis plus Codex visual inspection must pass before detail unlocks.

Two consecutive non-improving cycles stop as `VISUAL_CONVERGENCE_FAILED`.

## Rotation and pivot lock

Use `place_cubes_safe` and `modify_cubes` only for unrotated placement/modification.

Every non-zero cube rotation must use:

```text
rotate_cube_about_attachment
```

The tool derives the attachment pivot and verifies axis, angle range, expected direction, declared connection, and affected-view score before keeping the rotation. Visual regression or broken connection rolls back automatically.

Black Rhinoceros rotation intent:

- neck/head/muzzle move down and forward;
- front horn rises up and slightly forward;
- rear horn rises up and remains smaller;
- ears angle outward without crossing centerline;
- tail stays short and close to the rear;
- large torso masses use stepped sizes, not rotation-based fake taper.

## Revision routing

Use `GEOMETRY_LOCAL_REPAIR` only when one part or tightly related pair fails.

Use `GEOMETRY_VISUAL_REBUILD` when multiple primary masses or views fail, body/head/footprint requires broad reconstruction, or local repair does not converge.

Preserve previous checkpoints.

## Identity lock

Preserve:

- high shoulder and lower rear;
- long deep body with rear taper;
- broad low head and rectangular muzzle;
- exactly two horns;
- dominant three-segment front horn;
- smaller two-segment rear horn;
- compact upright ears;
- four thick leg/foot chains;
- short two-part tail;
- total cuboid count `22–32` unless a real conflict is reported.

Texture-only details include eyes, nostrils, mouth, wrinkles, scars, folds, muscle shading, and hoof separation.

## Final Geometry evidence

Before user review, store current:

```text
geometry_front.png
geometry_left.png
geometry_back.png
geometry_top.png
geometry_front_left_3_4.png
geometry_visual_metrics.json
geometry_visual_diff.png
geometry_visual_report.json
geometry_runtime.json
geometry_report.json
```

`geometry_report.json` must state:

```text
structural_status = PASS
visual_status = PASS
deterministic_visual_status = PASS
rotation_status = PASS or non-blocking WARNING
evidence_status = PASS
result = PASS
```

`verify_geometry_review_ready` must confirm all five views, current Reference Visual hash, current Geometry fingerprint, current analyzer, current evidence, and safe rotations.

## Forbidden

- mesh, subdivision, vertex editing, or armature skinning;
- PBR or Vibrant Visuals;
- Texture/UV work before Geometry approval;
- animation clips;
- extra reference images;
- free-rescaling current Geometry during comparison;
- broad guessing outside ranked diagnostic parts;
- direct non-zero rotation through generic cube tools;
- approval from bounds, hierarchy, cube count, or Blockbench warnings alone;
- silent authority repair.

Stop `REFERENCE_CONFLICT` when package authorities cannot be reconciled.

## Stage approval

After explicit user approval, use `complete_geometry_stage`. It must reject missing, stale, incomplete, deterministically failed, multimodally failed, reference-mismatched, structurally invalid, or rotation-unsafe Geometry evidence.
