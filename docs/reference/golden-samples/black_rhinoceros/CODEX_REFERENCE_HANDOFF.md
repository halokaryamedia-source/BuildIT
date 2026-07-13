# CODEX REFERENCE HANDOFF — Black Rhinoceros

## Package lock

- Asset ID: `black_rhinoceros`
- Display Name: `Black Rhinoceros`
- Target: Minecraft Bedrock Entity
- Package Status: `APPROVED`
- Reference Visual: `black_rhinoceros_reference_visual.png`
- Reference SHA-256: `fc46201d38fa1b357d285dd0450becfef1f88c65f39b179dfa41ea27ba182d5f`
- Canonical Model: `black_rhinoceros.bbmodel`

- Manifest Schema: `3.3`
- Sample Type: `golden_sample`
- Promotion Status: `PROMOTED`
- Symmetry Policy: `BILATERAL`
- Local MCP Acceptance: `PENDING`
- Animation: `ANIMATION_SKIPPED`
- Geometry: cuboid-only
- Front: `-Z`
- Ground: `Y = 0`
- Envelope: `27.2u W × 40u H × 52.8u D`, tolerance `±1u`

Use the current repository and this package. Reject legacy four-sheet, three-approval, or numbered-image workflows with `LEGACY_SKILL_CONFLICT`. Do not generate extra reference images.

## Geometry flow

Use only `BEDROCK_CUBOID_GEOMETRY`:

```text
get_stage_context
→ rebind_active_project_identity when required
→ manage_project_write_lease acquire
→ inspect_reference_visual_preview
→ capture_visual_feedback
→ analyze_geometry_views with return_diff_image=false during correction
→ edit diagnosed parts
→ final required-view evidence with write_diff_image=true
→ record_geometry_visual_decision
→ submit_geometry_for_review
→ GEOMETRY_REVIEW
```

`submit_geometry_for_review` runs current Geometry validation, uses its embedded readiness result, creates the next unused non-approved review checkpoint, and atomically changes state to `GEOMETRY_REVIEW` without reconnecting.

All later stage transitions and any upstream reopen also remain in the same Codex and MCP session. Release the old lease and acquire a fresh target-stage lease; never reconnect for normal recovery.

Do not ask the user to edit JSON, select a profile, choose a checkpoint name, or repeatedly reopen Blockbench.

## Revision after user review

`LOCAL_REPAIR` and `MAJOR_FORM_REVISION` are internal scopes, not profiles.

After user feedback during `GEOMETRY_REVIEW`:

1. capture and inspect affected views;
2. run `analyze_geometry_views`;
3. when metrics return `REVISION_REQUIRED`, use that current evidence;
4. when metrics pass but the user still requests a visible change, call `record_geometry_visual_decision` with `REVISION_REQUIRED`, the issue, affected views, and scope;
5. call `prepare_geometry_visual_rebuild`;
6. edit only after it returns `GEOMETRY_IN_PROGRESS`.

`prepare_geometry_visual_rebuild` is a compatibility name for preparing either scope. It accepts current deterministic or multimodal revision evidence, preserves checkpoints and primary masses, keeps detail by default, and permits broad detail removal only for an explicit major revision.

User feedback is authoritative and cannot be cancelled solely by a passing deterministic score. Revision evidence must still match the current project UUID, Geometry fingerprint, Reference Visual hash, and freshness checks.

Generic Geometry issues, including those found during Final Validation, route to `BEDROCK_CUBOID_GEOMETRY`. Never activate removed Geometry repair profiles.

## Geometry identity

Preserve:

- high shoulder and lower rear;
- long deep body with rear taper;
- broad low head and rectangular muzzle;
- exactly two horns: three-segment front and two-segment rear;
- compact upright ears;
- four thick leg/foot chains;
- short two-part tail;
- total cuboid count `22–32` unless a real reference conflict exists.

Eyes, nostrils, mouth, wrinkles, scars, folds, muscle shading, and hoof separation are Texture details.

## Mutation rules

Use `place_cubes_safe` and `modify_cubes` for unrotated work. Every non-zero rotation uses `rotate_cube_about_attachment` with pivot, axis, direction, connection, and affected-view validation.

Free-rescaling, unrelated trial-and-error changes, mesh work, PBR, Texture before Geometry approval, animation clips, and extra reference images are forbidden.

## Final evidence

Current review evidence must include the five base files below. Add `geometry_right.png` only when a future package declares `ASYMMETRIC`:

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

Final Geometry requires all manifest-required visual and deterministic views to PASS, matching fingerprint/world signature/Reference Visual hash, structural and symmetry PASS, current evidence, and safe rotations.

After explicit user approval, call `complete_geometry_stage`.
