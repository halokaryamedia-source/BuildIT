# Visual QA Checklist

Use this checklist at Geometry Review, Texture Review, optional Animation Review, and Final Review.

Do not capture unrelated screenshots.

## Standard Views

- [ ] Front uses stable framing and approved ground alignment.
- [ ] Left Side is a strict profile.
- [ ] Back is readable and consistent with the approved form.
- [ ] Top / Footprint shows correct width, length, contacts, and attachments.
- [ ] Front-left 3/4 clearly shows front and left planes.
- [ ] Displayed scale is consistent across comparable views.
- [ ] Evidence filenames and paths are stable.

## Geometry Review

- [ ] Total height, width, depth, and front direction match the approved package.
- [ ] Primary silhouette is recognizable without texture.
- [ ] Front and Left Side match the Reference Visual.
- [ ] Back, Top, and 3/4 do not reveal hidden drift.
- [ ] Required geometry parts exist.
- [ ] Ground contacts share the approved plane.
- [ ] Attachments connect cleanly.
- [ ] No major floating parts, collision, or z-fighting.
- [ ] Every cube has a structural purpose.
- [ ] Texture-only details are not represented as micro-cubes.

## Texture Review

- [ ] Atlas size and UV strategy match `TEXTURING.md`.
- [ ] UVs are compact and intentional.
- [ ] Mirroring/reuse occurs only in approved areas.
- [ ] Focal faces have enough texel density.
- [ ] Base color family and material zones match the Reference Visual.
- [ ] Large visible faces have readable stepped depth where required.
- [ ] Pixels are sharp; no unwanted blur or anti-aliasing.
- [ ] No unacceptable visible seam.
- [ ] Alpha/emissive behavior is approved.
- [ ] No PBR or Vibrant Visuals dependency.

## Animation Review — When Required

- [ ] Hierarchy and pivots match `ANIMATION.md`.
- [ ] Only approved axes and qualitative ranges are used.
- [ ] Required clips or sampled poses exist.
- [ ] Model returns exactly to neutral pose.
- [ ] Ground contacts are preserved.
- [ ] No critical clipping.
- [ ] Rigid cuboids remain rigid.
- [ ] Motion preserves asset identity and silhouette.

When not required:

- [ ] State records `ANIMATION_SKIPPED` with an approved-package reason.

## Final Review

- [ ] Candidate `.bbmodel` exists and opens.
- [ ] Texture files exist and are linked correctly.
- [ ] Five final standard views exist.
- [ ] Completed `VALIDATION.md` exists.
- [ ] Blockbench validator summary is recorded.
- [ ] Naming and export readiness pass.
- [ ] Animation evidence exists when required.
- [ ] Revision summary lists only changes actually made.
- [ ] No new feature or unrelated polish was added during validation.

## Evidence Hygiene

- [ ] Approved evidence is stored under the active asset session.
- [ ] Temporary/failed attempts are outside approved evidence folders.
- [ ] Accepted stage evidence is not overwritten without a new review cycle.
- [ ] Only review-relevant closeups are included.

## Result

```text
Stage:
Result: PASS / REVISION_REQUIRED / BLOCKER
Missing evidence:
Visible issues:
Preserved areas:
Next user action:
```

## Acceptance Criteria

- Required evidence is complete for the active stage.
- Review is tied to the approved package.
- Failed checks are named and routed to the correct stage.
- User can approve or request a focused revision without interpreting internal tool logs.
