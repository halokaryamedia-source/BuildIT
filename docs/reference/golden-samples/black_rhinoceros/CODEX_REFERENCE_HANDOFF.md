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

## Authority

Use the current repository and this approved package. Reject old project-context ZIPs or instructions requiring four technical sheets, three approval moments, or numbered `01_*`–`04_*` images with `LEGACY_SKILL_CONFLICT`.

Do not generate additional reference images.

## One-session Geometry workflow

Use only the `BEDROCK_CUBOID_GEOMETRY` profile for all Geometry work.

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views
→ edit only diagnosed parts
→ final five-view capture and diagnosis
→ record_geometry_visual_decision
→ validate_geometry_contract
→ verify_geometry_review_ready
→ non-approved review checkpoint
→ GEOMETRY_REVIEW / AWAITING_USER_REVIEW
```

Codex must follow `next_safe_operation` from compact context. Do not ask the user to edit workspace JSON, switch Geometry profiles, close the model, or reconnect between Geometry revision scopes.

## Revision scope

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal diagnosis scopes, not MCP profiles or separate stages.

When a fresh diagnosis returns `MAJOR_FORM_REVISION`, call `prepare_geometry_visual_rebuild` in the current Geometry profile. The tool preserves project identity, primary masses, and all checkpoints; it may remove only machine-classified structural detail and then continues normal Geometry work.

## Visual diagnosis

Codex must inspect actual image payloads. Paths or successful screenshot writes alone are not visual evidence.

`analyze_geometry_views` must report:

- failing view and semantic region;
- missing or excessive silhouette;
- approximate magnitude in Blockbench units;
- affected parts;
- a concrete repair recommendation;
- local or major revision scope.

Do not make unrelated trial-and-error changes. Free-rescaling the current model to fit the Reference Visual is forbidden.

## Internal progress

`PRIMARY_FORM`, `STRUCTURAL_DETAIL`, and `FINAL_REVIEW_READY` are internal progress markers, not user approval gates.

Use this practical order:

1. long deep torso, high shoulder, lower rear taper, short thick neck, low broad head, broad muzzle, four short thick legs, and ground relationship;
2. exactly two horns, compact ears, feet, short two-part tail, hierarchy, and connection cleanup;
3. final evidence.

Two non-improving checks require attention and a better repair decision, but do not require a new profile or reconnect.

## Rotation and pivot

Use `place_cubes_safe` and `modify_cubes` only for unrotated placement or modification.

Every non-zero rotation must use `rotate_cube_about_attachment`, which validates axis, angle, attachment pivot, expected direction, declared connection, and affected-view score with automatic rollback on regression.

Black Rhinoceros intent:

- neck, head, and muzzle move down and forward;
- dominant front horn rises up and slightly forward;
- smaller rear horn rises upward;
- ears angle outward without crossing centerline;
- tail remains short and close to the rear;
- torso taper uses stepped cuboid sizes rather than rotating large masses.

## Identity lock

Preserve:

- high shoulder and lower rear;
- long deep body with rear taper;
- broad low head and rectangular muzzle;
- exactly two horns;
- three-segment front horn;
- two-segment rear horn;
- compact upright ears;
- four thick leg/foot chains;
- short two-part tail;
- total cuboid count `22–32` unless a real reference conflict exists.

Eyes, nostrils, mouth, wrinkles, scars, folds, muscle shading, and hoof separation are Texture details.

## Final evidence

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

`geometry_report.json` must report PASS for structural, visual, deterministic visual, evidence, and final result. Rotation may be PASS or a non-blocking warning.

`verify_geometry_review_ready` must confirm all five views, current Reference Visual hash, current Geometry fingerprint, current analyzer output, current evidence, and safe rotations.

## Forbidden

- mesh, subdivision, vertex editing, or armature skinning;
- PBR or Vibrant Visuals;
- Texture or UV work before Geometry approval;
- animation clips;
- extra reference images;
- free-rescaling during comparison;
- broad guessing outside diagnosed parts;
- direct non-zero rotation through generic cube tools;
- approval based only on bounds, hierarchy, cube count, or Blockbench warnings.

Stop with `REFERENCE_CONFLICT` only when approved authorities cannot be reconciled.

After explicit user approval, use `complete_geometry_stage`.
