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

## Compact read order

1. Call `get_stage_context` for `GEOMETRY`.
2. Call `inspect_reference_visual` and inspect the returned image.
3. Open full `PRODUCTION_CONTEXT.md`, `GEOMETRY.md`, or manifest sections only when compact context is insufficient or conflicting.

The single Reference Visual is the sole visual authority. Do not generate or substitute numbered sheets, loose angles, technical sheets, or replacement images.

## Required Geometry workflow

```text
get_stage_context
→ inspect_reference_visual
→ build primary form only
→ capture_visual_feedback: left_side + front + top_footprint
→ compare_reference_views: left_side + front + top_footprint
→ correct primary silhouette
→ add horns, ears, feet, tail, and final hierarchy
→ capture and compare affected views
→ final five-view capture_visual_feedback
→ final five-view compare_reference_views
→ record_geometry_visual_result
→ validate_reference_contract
→ verify_geometry_visual_gate
→ non-approved checkpoint
→ GEOMETRY_REVIEW / AWAITING_USER_REVIEW
```

Codex must inspect actual image payloads. Paths or successful screenshot writes alone are not visual evidence.

`compare_reference_views` provides deterministic silhouette/profile metrics and a compact diff contact sheet. It is a guardrail, not a substitute for Codex or user review.

Geometry may reach review only when:

```text
structural_status = PASS
visual_status = PASS
deterministic_visual_status = PASS
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

## Deterministic diff reading

The visual diff contact sheet is ordered:

```text
Reference mask | Current mask | Difference
```

- green: overlap;
- red: Reference silhouette missing from current Geometry;
- blue: current Geometry exceeds the Reference silhouette.

The approved Golden Sample board layout is recognized by its locked SHA-256. Do not generate panel crops or substitute images.

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
- Any Geometry mutation makes earlier deterministic metrics and multimodal reports stale.

## Geometry mutation efficiency

- Use bounded related batches.
- Prefer one `modify_cubes` call over many single-cube calls.
- Inspect the Reference Visual once unless its hash changes.
- Request only views needed by the current correction.
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
- approval based only on bounds, group names, cube count, or Blockbench validator output;
- ignoring a failed deterministic comparison;
- silent authority repair.

When authorities conflict, stop with `REFERENCE_CONFLICT`.

## Stage approval

After explicit user approval, use `complete_geometry_stage`, not generic `complete_stage`. It must reject missing, stale, deterministically failed, multimodally failed, reference-mismatched, or rotation-unsafe Geometry evidence.
