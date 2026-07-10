# Quality Implementation Rules

This document captures the practical quality rules learned from previous Samurai modelling feedback. It is general-purpose and applies to any Minecraft Bedrock / Blockbench model.

Use this with:

- `phase-detail-contract.md`
- `mandatory-blockbench-mcp-procedure.md`
- `model-session-checklist-template.md`
- `common-failure-patterns.md`
- `phase-quality-scorecard-template.md`
- `phase-quality-insight-matrix.md`

## Geometry Freedom Rule

Minecraft / Bedrock style does not mean every cube must be a rigid 1:1 block.

Allowed geometry creativity:

- varied cuboid sizes,
- long and thin cuboids,
- wide and flat cuboids,
- rotated cuboids,
- offset layers,
- stepped silhouettes,
- angled armor or organic forms,
- varied thickness,
- asymmetry when intentional,
- silhouette-driven accessories.

Keep geometry Blockbench-friendly and performance-aware. Use creative cuboids to improve silhouette and structure, not to add noisy tiny decoration.

## Geometry Reliability Rule

Geometry phases must prove shape accuracy before adding detail.

For Main Geometry and Geometry Detailing, use this order:

```text
1. Scale envelope
2. Silhouette lock
3. Structural lock
```

Scale envelope:

- Record target height, width, depth, ground/contact point, and front direction.
- Keep the model inside that envelope unless the user approves a scale change.
- If scale is unknown, mark `Needs verification` before editing.

Silhouette lock:

- Judge the model from front, side, back, and 3/4 screenshots using placeholder colors only.
- Required large parts must be readable before any small detail is added.
- If front or side fails, stay in Main Geometry.

Structural lock:

- Check parent chain, pivot logic, attachments, floating parts, collisions, and z-fighting.
- Fix parent/pivot/attachment causes before resizing decorative cubes.
- If the same geometry issue fails twice, stop and run the failure recovery flow instead of repeating edits.

## Geometry Decision Tree

Before any geometry edit, classify the issue and apply the first matching fix path:

```text
1. Wrong total size or proportion?
   -> fix scale envelope first; do not move details.

2. Wrong front/side silhouette?
   -> fix primary mass or major part bounding box; do not add detail.

3. Part looks detached or floating?
   -> fix parent, pivot, and attachment point before resizing cubes.

4. Part collides, flickers, or z-fights?
   -> separate volumes or simplify overlap; do not hide with texture.

5. Model looks noisy or messy?
   -> remove small cubes and move minor detail to texture plan.

6. Only color, trim, seam, scratch, or surface pattern is missing?
   -> defer to texture; geometry is already done for that issue.
```

If two paths seem true, choose the earlier path. Scale and silhouette errors invalidate later detail decisions.

## Complexity And Atlas Rule

Model complexity is inferred from the user request and references.

Use the simplest category that fits the requested asset:

- Simple: small block, small prop, simple item, simple decorative object.
- Medium: detailed prop, tool, weapon, furniture, small creature, or medium entity.
- Complex: character, large creature, vehicle, machine, boss, large structure, or multi-part entity.

Atlas size follows the user request first. If the user does not specify it, infer it from reference complexity and visible focal detail.

Rules:

- Do not force a larger atlas when the model does not need it.
- Do not force a smaller atlas when the reference needs readable detail.
- If atlas size is unclear, mark it `Needs verification`.
- Higher atlas sizes require a visible reason: complex silhouette, many materials, large model, or important focal texture detail.

## Animation Boundary Rule

Animation is out of scope for the current workflow unless the user explicitly opens an animation phase.

Current priority:

1. Good geometry.
2. Good UV.
3. Good texturing.
4. Animation later.

Still keep models modular-ready:

- readable root group,
- clean parent groups,
- sensible pivots,
- separated limbs or moving parts when relevant,
- no unnecessary baked-in pose that blocks future animation.

## Cube Purpose Rule

Every cube must serve at least one purpose:

- silhouette,
- structure,
- depth,
- attachment,
- pose,
- pivot or animation,
- gameplay readability,
- focal identity.

If a cube only represents color, stripe, scratch, seam, shadow, small panel, trim, or 1 to 2 pixel detail, it should be texture instead.

For geometry phases, reject any cube that cannot answer:

```text
What reference part does this match?
What does it improve: silhouette, scale, structure, attachment, pivot, or focal identity?
Which view proves it works: front, side, back, or 3/4?
```

## Professional Naming Rule

Project and root names follow the object being created.

Rules:

- Project name should follow the asset/object name.
- Root group name should be short, readable, and asset-specific.
- Use lowercase snake_case for technical names.
- Avoid random generated names.
- Avoid overly long names.
- Include side when useful: `_left`, `_right`.
- Include role when useful: `body`, `head`, `tail`, `blade`, `wheel`, `panel`, `leg_left`.

Examples:

```text
kangaroo_root
samurai_root
sound_truck_root
dragon_boss_root
```

## Geometry Translation Plan

Before Main Geometry, produce:

```text
Geometry Blueprint:
- global envelope: height / width / depth
- front direction:
- ground/contact points:
- part build order:
- part bounding boxes:
  - part:
    - height / width / depth:
    - position relative to root:
    - attachment point:
    - rotation:

Geometry must be cube:
- ...

Texture-only detail:
- ...

Forbidden small cube detail:
- ...

Silhouette priority:
- ...

Cube budget:
Low / Medium / High
```

Do not start Blockbench geometry until this plan is clear.

Build order rule:

```text
1. root / primary body mass
2. head or primary focal mass
3. base / legs / ground-contact parts
4. major attachments
5. secondary silhouette parts
6. structural detail only after silhouette pass
```

Main Geometry cube budget guide:

- Simple: 6-12 cubes.
- Medium: 12-25 cubes.
- Complex: 25-45 cubes.

These are guides, not hard limits. Exceed them only when the reference needs it and every extra cube passes the Cube Purpose Rule.

Orthographic check:

- Front view checks height ratio, width ratio, main mass position, and left/right balance.
- Side view checks depth ratio, lean/pose, and attachment continuity.
- Back and 3/4 views check hidden drift, disconnected parts, and silhouette readability.
- If front or side does not match the blueprint, fix Main Geometry before adding detail.

Pre-MCP geometry action plan:

```text
Issue:
Decision tree path:
Affected part:
Do not change:
Single edit:
Expected screenshot proof:
Rollback if:
```

Do not run a geometry edit without this plan.

## Texture Translation Plan

Before UV Texture or Base Texturing, produce:

```text
Material groups:
- ...

Gradient targets:
- ...

Focal texture areas:
- ...

Reusable / shared texture areas:
- ...

Large flat-face risks:
- ...

Texture-only details replacing cube work:
- ...
```

Texture must not feel like simple palette fill. Palette is the base; gradient and material depth make it readable.

## Gradient Standard

Gradient is required for visible texture quality.

Rules:

- Every large visible face should use at least 3 stepped values.
- Focal areas should use 4 to 5 stepped values when space allows.
- Use darker values on lower, inner, recessed, or covered areas.
- Use mid values for the main material body.
- Use brighter values on outer edges, upper edges, or exposed surfaces.
- Add small highlights sparingly.
- Avoid smooth blur.
- Keep the finish pixel-stepped and Minecraft-readable.

## UV Efficiency Audit

Before Base Texturing, check:

```text
Single atlas used:
Atlas size justified:
Large empty spaces avoided:
Repeated / mirrored parts reuse UV where safe:
Focal areas have unique and sufficient UV space:
Hidden or low-priority faces use minimal space:
No accidental overlap on important faces:
No unexpected multi-texture setup:
```

If any answer blocks texture quality, fix UV before painting.

## Reference Conflict Handling

Reference sheets can conflict. Do not average conflicting information blindly.

Authority order:

1. Orthographic views: shape, orientation, proportions.
2. Scale sheet: measurements and contact points.
3. Silhouette sheet: distance readability.
4. Part breakdown: geometry groups and attachment logic.
5. Color palette sheet: atlas target, texture style, material, and shading.
6. Close-up detail: focal area detail.
7. Execution target sheet: DO-only failure prevention and visual locks.
8. Animation pivot sheet: future movement only.

If lower-priority reference conflicts with higher-priority reference, follow the higher-priority reference and mark:

```text
Needs verification:
```

If the conflict affects major geometry, stop before editing and ask the user.

## User-Friendly Review Prompt

After showing screenshots, ask the user:

```text
This phase is ready for review.
Please tell me:

Part that feels wrong:
Compared to which reference:
What you expected:
Do not change:
```

Codex maps this feedback back to the technical phase and part. The user does not need to use technical wording.

## MCP Tool Use Efficiency

MCP must be verified, but tools must be used only when needed.

Rules:

- Verify endpoint and runtime tool list before editing.
- Use `blockbench-modeling` only for geometry phases.
- Use `blockbench-texturing` only for UV/texture phases.
- Use screenshots at phase gates, not after every tiny edit.
- Avoid full outline dumps unless hierarchy is relevant.
- Avoid texture inspection outside texture phases.
- Do not create extra sessions unless they perform necessary work.
- Stop if a required tool is missing instead of silently using a risky workaround.
- Token budget guard (default):
  - If a phase has no visible progress, stop after 2 passes and request user reset.
  - Use one targeted fix batch per issue instead of combined broad edits.
  - Reuse the previous issue map; do not re-state unchanged context.

## Ponytail Token-Saving Rules For MCP Blockbench

Ponytail is used to reduce unnecessary MCP work without reducing model quality.

Rules:

- Do only the current approved phase.
- Inspect only the affected part when possible.
- Use only the tools required for the current phase.
- Do not inspect UV or texture data during geometry phases.
- Do not inspect full model data when a screenshot or selected-part check is enough.
- Do not take screenshots after every micro edit.
- Take screenshots at phase gates or after a meaningful correction batch.
- Do not rebuild the model when a local fix is enough.
- Do not create geometry for minor texture details.
- Do not add polish while the phase is still blockout or base work.
- Stop when the current phase acceptance criteria are met.
- Ask before broad rebuilds, phase reopen, or risky fallback tools.
- Reuse the Reference Collection summary instead of rereading every reference every phase.
- Keep one intended MCP working session per model.

Short rule:

```text
Current phase only.
Affected part only.
Required tool only.
Screenshot at gates.
Texture for minor detail.
Stop when good enough for the phase.
```

Before a large edit, ask internally:

```text
What is wrong?
What is the smallest safe fix?
Does this require reopening a phase?
What must not change?
Can texture solve this instead of geometry?
```

## Common Failure Prevention

Before moving to the next phase, check:

```text
Silhouette readable:
Scale close to reference:
No floating geometry:
No bad collision or z-fighting:
Cube count justified:
Small decorative cubes avoided:
Texture-only details deferred correctly:
UV efficient before painting:
Large faces have gradient before polish:
Focal detail is on the correct side:
```

If any check fails, stay in the current phase and fix the issue before continuing.

After any phase check, record the result in the phase scorecard and determine:

- Gate status (PASS / NEEDS_MINOR_FIX / BLOCKER),
- Critical fixes (max 2),
- Explicit user handoff.

## Phase Reopen And Failure Recovery

If a later phase reveals an earlier phase problem, report it before fixing.

Allowed direct fix:

- The issue is local.
- The fix does not damage approved geometry.
- The fix does not change the model direction.
- The user has not said to preserve that part unchanged.

Report format:

```text
Needs earlier-phase correction:
Phase affected:
Part:
Issue:
Safe fix:
Risk:
```

If the fix is broad, changes silhouette, changes scale, or can damage accepted work, stop and ask approval before editing.

Do not continue to finalization with known phase-blocking problems.

## Screenshot Cleanup Rule

Screenshots are used for phase review, but process screenshots should not become final clutter.

Rules:

- Keep only the screenshots needed for the current phase review.
- At final review, keep only final screenshots unless the user asks to preserve process history.
- Final screenshot set should include front, side, back, 3/4, and texture atlas when textured.
- Temporary or failed-attempt screenshots may be deleted after the issue is resolved.

## Acceptance Criteria

- Geometry stays creative but cube-efficient.
- Cube detail is justified by purpose.
- Texture uses gradient and material depth, not flat palette fill.
- UV layout is efficient before painting.
- User review is easy and screenshot-based.
- Common Samurai failure patterns are prevented before finalization.
- Animation remains modular-ready but out of scope until explicitly requested.
- Project/root naming is professional and asset-specific.
