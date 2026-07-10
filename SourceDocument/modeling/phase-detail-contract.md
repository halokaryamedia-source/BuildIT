# Phase Detail Contract

This document defines the detailed working contract for each Minecraft Bedrock / Blockbench MCP production phase.

Use it with:

- `mandatory-blockbench-mcp-procedure.md`
- `model-session-checklist-template.md`
- `quality-implementation-rules.md`
- `phase-quality-scorecard-template.md`
- OpenSpec `mcp-blockbench-workflow`

Codex must keep the current phase visible while working. If the requested edit does not belong to the current phase, mark it `Out of scope for this phase`.

## Global Phase Report Format

Every phase must end with:

```text
Phase:
Goal:
Completed:
Skipped:
Screenshots / artifacts:
Issues:
Assumptions:
Needs user approval before next phase: Yes
```

## Phase Quality Gate

A phase can only advance after its quality gate is complete and recorded:

```text
Scorecard used: Yes
Scorecard status:
- PASS
- NEEDS_MINOR_FIX
- BLOCKER
Decision:
- BLOCKER -> stay in this phase
- NEEDS_MINOR_FIX -> fix listed items before continuing
- PASS -> request user approval
Critical fixes before transition: max 2
Critical fixes are tied to a named part / concrete issue
```

Token constraint:

- Max 2 additional edit passes for the same blocker in one phase.
- If still blocked after 2 passes, pause and request re-scope before broad change.

If any quality signal is ambiguous, the phase is treated as:

```text
Needs user clarification
```

and may not advance until resolved.

## Geometry Precision Gate

Main Geometry and Geometry Detailing must pass this gate before moving forward:

```text
Scale envelope recorded: Yes / No
Front silhouette: PASS / PARTIAL / BLOCKER
Side silhouette: PASS / PARTIAL / BLOCKER
Back silhouette: PASS / PARTIAL / BLOCKER
3/4 silhouette: PASS / PARTIAL / BLOCKER
Attachment continuity: PASS / PARTIAL / BLOCKER
Parent / pivot logic: PASS / PARTIAL / BLOCKER
Floating / collision / z-fighting: PASS / PARTIAL / BLOCKER
Cube purpose check: PASS / PARTIAL / BLOCKER
Decision: PASS / NEEDS_MINOR_FIX / BLOCKER
```

Rules:

- Front and side must be `PASS` before leaving Main Geometry.
- Any floating major part, broken attachment, or unstable parent chain is a `BLOCKER`.
- If the same geometry blocker appears twice, stop and use `geometry-failure-prevention-playbook.md` before another edit pass.
- Do not solve geometry failure with texture, UV, or color.
- Every geometry fix must state the Geometry Decision Tree path before editing.

## Ponytail Phase Rule

Each phase should use the smallest useful work unit:

```text
Work unit:
Affected part:
Allowed edit:
Forbidden edit:
Verification:
Stop when:
```

Avoid broad inspections, repeated screenshots, or unrelated tool calls when a focused check is enough.

## Phase 1: Reference Collection

Purpose: convert ChatGPT output and user references into a reliable modelling plan.

Required input:

- Asset name.
- Bedrock Entity.
- In-game function.
- Scale target.
- Reference images or reference sheet package.
- Current requested phase.

Must inspect:

- Orthographic views for orientation and proportions.
- Scale sheet for size and contact points.
- Silhouette sheet for recognizability.
- Part breakdown for geometry groups.
- Close-up sheet for focal areas.
- Execution target sheet for DO-only visual locks and known failure prevention.

Must decide:

- Front side.
- Scale.
- Main silhouette features.
- Required large geometry parts.
- Geometry Blueprint with global envelope, part build order, and part bounding boxes.
- Texture-only details.
- Focal areas.
- Rough cube budget: low, medium, or high.
- Atlas size: 64x64, 128x128, 256x256, 512x512, or explicitly approved other.
- Pixel style: default Minecraft 16x style or cleaner 32x style.
- Complexity level inferred from request and references.
- Project name and root group naming.
- Geometry Translation Plan.
- Texture Translation Plan.

Allowed:

- Summarize references.
- Mark conflicts.
- Ask missing questions.
- Produce geometry plan.

Forbidden:

- Blockbench edits.
- MCP model changes.
- Texture or UV work.
- Assuming missing scale, front side, or target category.

Exit output:

- Asset summary.
- Reference priority.
- Geometry Blueprint.
- Cube-vs-texture list.
- Phase risks.
- Assumptions / Needs verification.
- Approval request for Main Geometry.

Failure conditions:

- Asset target unclear.
- Bedrock category unclear.
- Reference conflict affects major shape.
- Scale or front side unclear.
- Quality gate scorecard shows any blocker.

## Phase 2: Main Geometry

Purpose: create the readable large form only.

Required input:

- Approved Reference Collection summary.
- Scale target.
- Geometry Blueprint.
- Scale envelope: height, width, depth, front direction, ground/contact point.
- Pre-MCP geometry action plan for the first build batch.
- Main silhouette list.
- Required large parts.
- Cube budget expectation.

Must build:

- Root group.
- Main body or primary object mass.
- Major silhouette parts.
- Large attachments or props that define identity.
- Animation-ready parent groups for entities.
- Asset-specific root name.
- Front/side/back readable blockout before any detailing.
- Parts in the approved build order.
- Part bounding boxes close to the approved blueprint.

Allowed:

- Placeholder colors.
- Large cuboids.
- Simple rotations if they improve silhouette.
- Clean hierarchy.
- One checkpoint before meaningful edits.

Forbidden:

- UV work.
- Texture painting.
- Detail gradients.
- Small decorative cubes.
- Micro trims.
- Export.
- Animation work unless explicitly requested.

Verification:

- Front screenshot.
- Side screenshot.
- Back screenshot.
- 3/4 screenshot.
- Scale envelope comparison.
- Part bounding box comparison for major parts.
- Orthographic front/side comparison against the blueprint.
- Decision tree path result.
- Geometry Precision Gate.
- Cube count.
- Short hierarchy report.

Exit gate:

- Model is recognizable without texture.
- Major parts exist.
- Scale is close enough.
- Front and side silhouettes pass against reference.
- No obvious floating parts.
- No obvious z-fighting.
- Parent/attachment logic is stable enough for detailing.
- User approves Geometry Detailing.

Failure conditions:

- Silhouette does not read.
- Model resembles a wrong asset class.
- Large parts are disconnected.
- Scale envelope is missing or contradicted by screenshots.
- Major part bounding boxes are missing or contradicted by screenshots.
- Build order was skipped and caused unstable attachments.
- Edit was made without a stated decision-tree path.
- Front or side silhouette is `PARTIAL` or `BLOCKER`.
- Parent, pivot, or attachment issue repeats twice.
- Cube budget already wasted on tiny details.

## Phase 3: Geometry Detailing

Purpose: add important physical structure without wasting cubes.

Required input:

- Approved Main Geometry screenshots.
- Structural detail list.
- Texture-only detail list.
- Cube budget expectation.

Must review:

- Floating parts.
- Colliding/z-fighting parts.
- Side profile.
- Attachment logic.
- Animation pivot logic.
- Scale envelope drift.
- Cube count.

Allowed:

- Larger layered plates or structural forms.
- Side-profile improvements.
- Focal geometry that cannot be texture-only.
- Cube reduction where texture can replace small detail.
- Better parent/group placement.

Forbidden:

- Pixel-scale cube decoration.
- Repeating tiny stripe cubes.
- Texture painting.
- UV repack.
- Full redesign unless Main Geometry is reopened.

Verification:

- Front/side/back/3/4 screenshots.
- Geometry Precision Gate.
- List of added structural details.
- List of details deferred to texture.
- Any cube optimizations.

Exit gate:

- Structure is cleaner than blockout.
- No known floating/collision issues.
- Cube count is justified.
- Texture-only details are not modelled as cubes.
- Parent, pivot, and attachment decisions remain stable.
- Scale envelope remains unchanged unless user approved a change.
- User approves UV Texture.

Failure conditions:

- New geometry creates clutter.
- Small cube noise increases.
- Important parts still look detached.
- Geometry is less readable than Main Geometry.
- Detailing hides a failed Main Geometry silhouette.
- A repeated issue was retried without root-cause recovery.

## Phase 4: UV Texture

Purpose: prepare an efficient single-atlas UV layout before painting.

Required input:

- Approved Geometry Detailing.
- Texture atlas size.
- Focal area priority.
- Repeated/mirrored parts list.

Must decide:

- Single atlas target.
- Unique UV areas.
- Shared UV areas.
- Hidden/low-priority areas.
- Focal pixel density.

Allowed:

- Create/select one texture atlas.
- Pack UVs.
- Reuse UV for repeated or mirrored parts.
- Reserve larger space for focal areas.

Forbidden:

- Final painting.
- Detail shading.
- Large geometry redesign.
- Multiple texture files unless approved.

Verification:

- Texture atlas screenshot.
- Model screenshot.
- Focal UV areas identified.
- Reused UV areas identified.
- UV Efficiency Audit from `quality-implementation-rules.md`.

Exit gate:

- Atlas is compact.
- Focal areas have enough space.
- Repeated parts reuse UV safely.
- No unexpected multi-texture setup.
- User approves Base Texturing.

Failure conditions:

- Atlas has excessive empty space.
- Focal UVs are too small.
- Important faces overlap accidentally.
- Multiple textures appear without approval.

## Phase 5: Base Texturing

Purpose: establish broad material placement.

Required input:

- Approved UV Texture.
- Material palette.
- Material placement notes.

Must paint:

- Dominant material.
- Secondary material.
- Basic shadow material.
- Basic highlight material.
- Accent placement only where approved.

Allowed:

- Broad fills.
- Simple material separation.
- Limited color palette.
- Placeholder-level material readability.

Forbidden:

- Heavy gradient polish.
- Micro scratches.
- UV repack unless blocked.
- Geometry redesign.

Verification:

- Front/side/back/3/4 screenshots.
- Atlas screenshot.
- Material placement report.

Exit gate:

- Materials are readable.
- Major regions use correct colors.
- Accent colors are controlled.
- User approves Detail Texturing.

Failure conditions:

- Large visible region uses wrong material.
- Palette drifts from reference.
- Colors are too flat to judge material separation.

## Phase 6: Detail Texturing

Purpose: add Bedrock-style depth and texture-only detail.

Required input:

- Approved Base Texturing.
- Texture reference sheet.
- Focal area list.
- Texture-only detail list.

Must add:

- Stepped gradients.
- Edge highlights.
- Recess shadows.
- Seams / trims / panel lines.
- Material-specific detail.
- Focal identity detail.
- Gradient coverage on large visible faces.

Allowed:

- Local atlas edits.
- Reusable detail for repeated parts.
- Stronger detail on hero areas.
- Texture replacement for minor cube detail.

Forbidden:

- Full atlas repaint when local edits work.
- Geometry redesign unless reopened.
- Smooth blurred shading.
- Random noisy pixels.

Verification:

- Front/side/back/3/4 screenshots.
- Atlas screenshot.
- Focal close-up.
- Flat-face issue list.

Exit gate:

- Large visible faces have gradient or material depth.
- Focal details read from intended view.
- Texture remains pixel-art style.
- User approves Polish.

Failure conditions:

- Texture is still flat.
- Focal detail is on the wrong side.
- Detail looks random instead of material-based.
- Atlas becomes wasteful or chaotic.

## Phase 7: Polish

Purpose: fix visible issues only.

Required input:

- Approved Detail Texturing.
- Screenshot-based issue list.
- Parts that must not change.

Allowed:

- Local color balance.
- Local gradient improvement.
- Focal readability fix.
- Small texture cleanup.
- Small geometry fix only if it blocks final quality and user approves.
- Earlier-phase local correction when reported and safe.

Forbidden:

- Broad redesign.
- Reopening UV without clear blocker.
- Repainting the whole atlas.
- Export unless requested.
- Broad earlier-phase redesign without approval.

Verification:

- Final screenshot set.
- Atlas screenshot if texture changed.
- Before/after issue summary.

Exit gate:

- Visible issues are fixed or accepted.
- No new regression.
- User approves Final Review.

Failure conditions:

- Fix creates new geometry/texture problems.
- Polish becomes redesign.
- Work continues without visible issue.

## Phase 8: Final Review

Purpose: decide the final state.

Required input:

- Approved Polish output.
- Final screenshots.
- Final atlas screenshot if textured.

Must report:

- Geometry score.
- Texture score.
- Remaining visible issues.
- Whether issues are blocking or acceptable.
- Suggested next action: revise, pause, export, or new asset.
- Final project name.
- Final screenshot set location.

Allowed:

- Review.
- Scoring.
- Mapping feedback to a phase.

Forbidden:

- New edits.
- Export without explicit export request.
- Starting a new model without user request.
- Keeping failed-attempt screenshots as final deliverables unless requested.

Exit gate:

- User chooses revise, pause, export, or start another asset.
- Any revision is assigned to a specific phase.

Failure conditions:

- Score is not based on screenshots.
- Review hides known issues.
- User feedback is too broad and Codex edits anyway.
- Final scorecard status is still "Blocker".

## Acceptance Criteria

- Each phase has clear inputs, allowed work, forbidden work, verification, exit gate, and failure conditions.
- Codex can recover context from the current phase alone.
- Later-phase work cannot leak into earlier phases.
- User feedback can be mapped back to one phase.
- Every phase-to-phase transition must pass the phase quality gate.
