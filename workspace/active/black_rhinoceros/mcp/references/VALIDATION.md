# Black Rhinoceros — VALIDATION

**Decision Authority:** `PRODUCTION_CONTEXT.md`  
**Primary Visual Authority:** `black_rhinoceros_reference_visual.png`  
**Geometry Authority:** `GEOMETRY.md`  
**Texturing Authority:** `TEXTURING.md`  
**Animation Authority:** `ANIMATION.md`  
**Manifest Authority:** `reference_manifest.json`  
**Execution Status:** `PENDING_BUILD`

## Purpose

This is the mandatory post-build test contract. The completed Blockbench asset must be judged against the approved single Reference Visual first, then against the category documents. Validation evidence is created by Codex/MCP-Blockbench after the model exists; no additional reference image is generated during package creation.

## 1. Required Validation Inputs

- `black_rhinoceros.bbmodel`
- primary texture atlas image, expected `128 × 128` PNG
- Left Side neutral render
- Front neutral render
- Back neutral render
- Top / Footprint capture
- Front-left 3/4 neutral render
- hierarchy/group list
- pivot list with coordinates
- cuboid count and group membership report
- animation list showing no required clips / `ANIMATION_SKIPPED`
- export/error log
- package file inventory
- final SHA-256 hashes for `.bbmodel`, texture file(s), and evidence files

## 2. Package Integrity Tests

| Test | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| Required package files | `source/original_reference.png`, `PRODUCTION_CONTEXT.md`, `black_rhinoceros_reference_visual.png`, `GEOMETRY.md`, `TEXTURING.md`, `ANIMATION.md`, `VALIDATION.md`, `reference_manifest.json`, and `CODEX_REFERENCE_HANDOFF.md` exist and open | PENDING | |
| Single generated visual | Exactly one generated visual authority exists: `black_rhinoceros_reference_visual.png` | PENDING | |
| No numbered technical images | Files such as `01_*`, `02_*`, `03_*`, `04_*`, geometry sheets, texture sheets, motion sheets, or extra viewpoint PNGs are absent | PENDING | |
| Source-copy distinction | `source/original_reference.png` is treated as input evidence and is not counted as a generated Reference Visual | PENDING | |
| Naming | All filenames and Asset ID values match `black_rhinoceros` | PENDING | |
| Manifest JSON | Parses successfully and uses schema `3.0` | PENDING | |
| Manifest consistency | Manifest values match all Markdown contracts and implementation output | PENDING | |
| Approval state | Production Context and Reference Visual are recorded as approved; validation remains `PENDING_BUILD` until executed | PENDING | |
| Image budget | `normal_image_generations = 1`, `targeted_edit_max = 1`, and `post_visual_image_generations = 0` | PENDING | |
| Export readiness | No blocking Blockbench/Bedrock export error | PENDING | |

## 3. Geometry Tests

| Test | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| Height | `40u ± 1u` from shared ground plane to highest geometry point | PENDING | |
| Width | `27.2u ± 1u` at the approved maximum-width region | PENDING | |
| Depth | `52.8u ± 1u` across front/rear extents | PENDING | |
| Front direction | Head and muzzle face `-Z` | PENDING | |
| Ground plane | All four foot bottoms contact `Y = 0` | PENDING | |
| Left Side silhouette | Matches body length, head slope, shoulder height, horns, legs, rear taper, and tail in the Reference Visual | PENDING | |
| Front silhouette | Matches shoulder width, centered horn alignment, broad head/muzzle, ear spacing, and front-leg stance | PENDING | |
| Back silhouette | Matches rear width/taper, rear-leg stance, ear visibility, and tail placement | PENDING | |
| Top / Footprint | Matches approved length, shoulder width, head narrowing, horn alignment, leg placement, and rear taper | PENDING | |
| Front-left 3/4 | Clearly shows front and left planes and matches all major mass relationships | PENDING | |
| Cuboid count | Total remains within `22–32` | PENDING | |
| Geometry type | Cuboid-only; no mesh, sphere, cylinder, armature skinning, or dense voxel sculpture | PENDING | |
| Front horn segments | Exactly `3` tapered cuboid segments | PENDING | |
| Rear horn segments | Exactly `2` tapered cuboid segments | PENDING | |
| Tail segments | Exactly `2` segments | PENDING | |
| Leg chains | Four leg groups, each with one corresponding foot child | PENDING | |
| Required parts | Two horns, two ears, four legs, four feet, muzzle, and two-part tail are present | PENDING | |
| Mass relationship | Shoulder remains higher/heavier than rear; torso remains long and deep | PENDING | |
| Hierarchy | Matches `GEOMETRY.md` canonical parent-child structure | PENDING | |
| Micro-cubes | No forbidden decorative micro-cubes are used for wrinkles, nostrils, eyes, toes, scars, or hide noise | PENDING | |
| Z-fighting / gaps | No major visible z-fighting, floating mass, or open joint gap | PENDING | |

## 4. Texturing Tests

| Test | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| Atlas dimensions | Exactly `128 × 128` | PENDING | |
| Texture format | Valid PNG using nearest-neighbor display | PENDING | |
| Base color family | Warm gray-brown hide matches the Reference Visual | PENDING | |
| Head/muzzle family | Slightly darker but remains within the approved hide family | PENDING | |
| Horn/hoof family | Dark olive-brown to charcoal and clearly separated from hide | PENDING | |
| Facial accents | Compact near-black eyes, nostrils, mouth line, and ear interiors | PENDING | |
| Material zones | Match the visible zones defined in `TEXTURING.md` | PENDING | |
| Palette control | Restrained purposeful palette; no uncontrolled near-duplicate noise colors | PENDING | |
| UV strategy | Box UV first; selective per-face UV only in documented areas | PENDING | |
| Texel density | Major visible surfaces remain approximately consistent with the 16x style | PENDING | |
| Mirroring | Only approved paired regions are mirrored; facial/directional details are not reversed incorrectly | PENDING | |
| Seams | No unacceptable seam at head/muzzle, neck/shoulder, torso/rear, horns, ears, or leg/foot transitions | PENDING | |
| Pixel sharpness | No anti-aliasing, blur, smooth gradient, or compression halo | PENDING | |
| Eyes | Correct side placement, scale, contrast, and count | PENDING | |
| Nostrils / mouth | Correct faces, compact scale, and no fake geometry depth | PENDING | |
| Hoof separation | Painted as restrained pixels; not modeled as toe cubes | PENDING | |
| Alpha | Entire asset is opaque; no unexpected transparent pixels | PENDING | |
| Emissive | No emissive zones or glow behavior | PENDING | |
| Classic Bedrock | No PBR, normal, metallic, roughness, height, material-instance, or Vibrant Visuals dependency | PENDING | |

## 5. Animation and Pivot Tests

| Test | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| Animation status | `ANIMATION_SKIPPED` and zero required clips | PENDING | |
| Unauthorized clips | No idle, walk, charge, attack, hurt, death, jaw, rider, or special clip is included as a package requirement | PENDING | |
| Neutral pose | Reset transforms reproduce the approved neutral pose | PENDING | |
| Root pivot | Ground-centered at approximately `(0u, 0u, 0u)` | PENDING | |
| Body pivot | Located near the torso center and does not alter neutral ground contact | PENDING | |
| Head pivot | Located at the neck-to-skull transition | PENDING | |
| Ear pivots | Located at mirrored ear bases | PENDING | |
| Leg pivots | Located at body attachments, mirrored left/right | PENDING | |
| Foot pivots | Located at lower-leg connections and restore flat contact | PENDING | |
| Tail pivots | Tail base at rear-body attachment; tail tip at tail-base end | PENDING | |
| Parent-child behavior | Muzzle/horns/ears follow head; feet follow legs; tail tip follows tail base | PENDING | |
| Rigid children | Muzzle and horns have no independent motion requirement | PENDING | |
| Allowed axes | Pivot checks use only axes permitted by `ANIMATION.md` | PENDING | |
| Ground contact | Four feet return to `Y = 0`; tail remains above ground | PENDING | |
| Clipping | No critical intersection in neutral pose or conservative pivot checks | PENDING | |
| Deformation | Cuboids remain rigid; no scale-keyframe, mesh, armature, or vertex deformation | PENDING | |
| Silhouette | Conservative pivot checks preserve the recognizable rhinoceros identity | PENDING | |

## 6. Visual Consistency Tests

| Test | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| Identity | Same approved Black Rhinoceros subject | PENDING | |
| Proportions | Same major ratios and `2.5 × 1.7 × 3.3` block envelope | PENDING | |
| Horn arrangement | Two horns; front horn remains dominant | PENDING | |
| Anatomy | Broad low head, rectangular muzzle, compact ears, thick legs, short tail | PENDING | |
| Neutral pose | Same four-foot grounded pose and facing | PENDING | |
| Color/material | Same warm gray-brown hide and darker horn/hoof family | PENDING | |
| Attachments | No invented saddle, armor, harness, cargo, rider seat, or fantasy part | PENDING | |
| No redesign | No species, age/form, silhouette, or style substitution | PENDING | |
| Cross-view consistency | All five evidence views show one consistent model, not view-specific geometry variants | PENDING | |

## 7. Naming and Export Tests

| Test | Requirement | Result | Evidence / Notes |
|---|---|---|---|
| Canonical model filename | `black_rhinoceros.bbmodel` | PENDING | |
| Texture naming | Stable asset-prefixed texture filename(s) | PENDING | |
| Root group | `black_rhinoceros_root` | PENDING | |
| Group names | Match canonical names in `GEOMETRY.md` and `ANIMATION.md` | PENDING | |
| Bedrock format | Project/export target is Minecraft Bedrock Entity | PENDING | |
| Export log | No unresolved warning or error that changes geometry, UV, hierarchy, or material behavior | PENDING | |
| Hash report | SHA-256 values recorded for final model, texture, and evidence files | PENDING | |

## 8. Results

### PASS

Use only when all mandatory tests pass with direct evidence. A PASS must include the final `.bbmodel`, texture atlas, five comparison views, hierarchy/pivot report, export/error log, and completed result table.

### REVISION_REQUIRED

Use when the asset is structurally valid but one or more local repairs are required. Record each failed test, the earliest affected stage, the exact repair, and the rerun evidence.

### BLOCKER

Use for wrong identity, missing/corrupt authority files, fundamentally wrong scale, unusable hierarchy, unsupported required pipeline, absent canonical visual, unresolved `REFERENCE_CONFLICT`, or a model that cannot be exported safely.

## 9. Validation Summary

- Final Result: `PENDING_BUILD`
- Blockers: None recorded before build
- Required Revisions: None recorded before build
- Passed Categories: None; validation not yet executed
- Failed Categories: None; validation not yet executed
- Evidence Files: Pending
- Validator: Pending
- Validation Date: Pending
- Model SHA-256: Pending
- Texture SHA-256: Pending

## Conflict Rule

Use:

```text
REFERENCE_CONFLICT
```

Do not guess, silently redesign, rescale, recolor, add a technical image, or repair a conflicting authority inside validation. Report the conflict and identify the earliest authority that must be reopened.
