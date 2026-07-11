# CODEX REFERENCE HANDOFF — Black Rhinoceros

## Package lock

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Target: Minecraft Bedrock Entity
- Package Status: `APPROVED`
- Primary Visual Authority: `black_rhinoceros_reference_visual.png`
- Canonical Model: `black_rhinoceros.bbmodel`
- Animation: `ANIMATION_SKIPPED`
- Geometry: cuboid-only
- Front: `-Z`
- Ground: `Y = 0`
- Envelope: `27.2u W × 40u H × 52.8u D`, tolerance `±1u`

## Read order

1. `reference_manifest.json`
2. `PRODUCTION_CONTEXT.md`
3. `black_rhinoceros_reference_visual.png`
4. `GEOMETRY.md`
5. active-stage document
6. `VALIDATION.md`

The single Reference Visual is the sole visual authority. Do not generate or substitute numbered sheets, loose angles, technical sheets, or replacement images.

## Required Geometry workflow

```text
inspect_reference_visual
→ build primary form only
→ capture_visual_feedback: left_side + front + top_footprint
→ correct primary silhouette
→ add horns, ears, feet, tail, and final hierarchy
→ capture affected visual feedback
→ capture final five-view visual feedback
→ record_geometry_visual_result
→ validate_reference_contract
→ verify_geometry_visual_gate
→ non-approved checkpoint
→ GEOMETRY_REVIEW / AWAITING_USER_REVIEW
```

Codex must inspect the returned image payloads. Paths or successful screenshot writes alone are not visual evidence.

A structural validator PASS is not a visual PASS. Geometry may reach review only when:

```text
structural_status = PASS
visual_status = PASS
rotation_status = PASS or non-blocking WARNING
evidence_status = CURRENT
```

## Primary-form gate

Before detail, the untextured model must already match the approved overall read in Left, Front, and Top views:

- long deep torso;
- high heavy shoulder;
- lower and narrower rear taper;
- thick short neck transition;
- low broad head;
- broad muzzle;
- short thick legs positioned within the body footprint.

Do not add detail to compensate for a wrong body silhouette.

## Rotation and pivot lock

Use `place_cubes_safe` and `modify_cubes` for all Geometry mutation.

- A rotated cube must provide its explicit intended attachment pivot.
- Prefer one local rotation axis per cube.
- Compound cube rotation is forbidden unless an approved contract explicitly requires it.
- Default maximum absolute cube rotation is `45°`.
- Do not rotate large torso masses merely to simulate taper; prefer stepped cuboid sizing.
- After every rotated batch, inspect the affected Side or 3/4 view.
- Horn segments must remain connected and taper in the intended direction.
- Ear rotation must not invert or cross the head centerline.
- Head/neck rotation must move toward the approved low-forward profile, not upward.
- World bounds and camera framing must include cube and parent transforms.
- A stale visual report after any Geometry or rotation mutation is invalid.

## Geometry mutation efficiency

- Use bounded related batches.
- Prefer one `modify_cubes` call over many single-cube calls.
- Inspect the Reference Visual once unless its hash changes.
- Request only the views needed by the current correction.
- Maximum automatic visual repair cycles per internal pass: `2`.
- If two cycles do not improve the result, stop with `VISUAL_CONVERGENCE_FAILED`.

## Revision routing

Use `GEOMETRY_LOCAL_REPAIR` only for one part or a tightly related pair.

Use `GEOMETRY_VISUAL_REBUILD` when:

- multiple primary masses are wrong;
- multiple views fail;
- body/head/footprint requires broad reconstruction;
- a local repair fails to converge.

Preserve previous checkpoints. Never overwrite an earlier review checkpoint.

## Black Rhinoceros identity lock

Preserve:

- high shoulder and lower rear;
- broad low head and rectangular muzzle;
- exactly two horns;
- dominant three-segment front horn;
- smaller two-segment rear horn;
- compact ears;
- four thick leg/foot chains;
- short two-part tail;
- total cuboid count `22–32` unless a real reference conflict is reported.

Texture-only details include eyes, nostrils, mouth, wrinkles, scars, folds, muscle shading, and hoof separation.

## Forbidden

- mesh, subdivision, vertex editing, armature skinning;
- PBR or Vibrant Visuals;
- texture/UV work before Geometry approval;
- animation clips;
- extra reference-image generation;
- automatic approval based only on bounds, group names, cube count, or Blockbench validator output;
- silent authority repair.

When authorities conflict, stop with `REFERENCE_CONFLICT`.

## Stage approval

After explicit user approval, use `complete_geometry_stage`, not generic `complete_stage`. The guarded tool must reject missing, stale, visually failed, reference-mismatched, or rotation-unsafe Geometry evidence.
