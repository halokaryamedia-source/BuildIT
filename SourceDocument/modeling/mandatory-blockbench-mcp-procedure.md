# Mandatory Blockbench MCP Procedure

This is the baseline procedure for every Minecraft Bedrock model made through Codex, Blockbench MCP, OpenSpec, Ponytail, and the Blockbench skills.

It is intentionally strict. If this procedure is skipped, stop the work and return to the missing step.

For the short operator view, start with `operator-one-page-checklist.md`.

For daily flow, use one chain only:
`workflow-quick-reference.md` -> `compact-geometric-pipeline.md` -> active session doc.

For detailed per-phase inputs, allowed work, forbidden work, verification, exit gates, and failure conditions, also use `phase-detail-contract.md`.
Use `phase-detail-contract.md` sebagai kontrak per fase saat fase mulai; jangan mengaktifkan gate baru setiap mini edit.
For geometry regressions or repeated failures, use `geometry-failure-prevention-playbook.md` before another edit pass.

Before Blockbench edits, also use `reference-package-pass-fail-checklist.md` for reference validation, `pre-modelling-gate.md` for final Main Geometry readiness, and `mcp-smoke-test-checklist.md` for endpoint readiness.

For reference-heavy packs, also use `marketplace-reference-to-mcp-map.md` to convert intent into safe phase actions and reject over-copying.

For every new market-quality model, complete `marketplace-reference-intelligence-template.md` before Main Geometry.

During each phase review, compare work against:

- `phase-quality-insight-matrix.md`
- `phase-quality-scorecard-template.md`

Use `modeling-phase-quality-playbook.md` as the single-phase execution runbook.

## Non-Negotiable Startup Order

Before any Blockbench MCP edit, Codex must complete this order:

1. Read `openspec/config.yaml`.
2. Read the active OpenSpec change under `openspec/changes/`.
3. Apply Ponytail review rules: smallest useful work, no speculative steps, no unnecessary tools, no unnecessary cube/detail work.
4. Run `phase-risk-simulation` (`SourceDocument/modeling/ops/phase-risk-simulation.md`) only when blocker sudah muncul 2x dan berulang.
5. Load `blockbench-use`.
6. Confirm the current session has a `session.md` with:
   - current phase,
   - risk checkpoints,
   - previous blocker history,
   - user-approved scope.
7. Load only the phase-relevant Blockbench skill:
   - `blockbench-mcp-overview` for capability discovery.
   - `blockbench-modeling` for geometry.
   - `blockbench-texturing` for UV or texture.
8. Verify the Blockbench MCP endpoint and active project.
9. Verify the runtime MCP tool list before use.
10. Pass `pre-modelling-gate.md` before Main Geometry or any first edit on a new asset.
11. Confirm the current phase and expected output.
12. Confirm whether user manual edits must be preserved.
13. Confirm flow lock:
   - No scope crossover.
   - No extra phase toolchain.
   - Maksimal 2 issue per cycle (`PARTIAL` only).

## Execution Loop (Most Efficient Path)

Use this loop for every phase cycle:

1. Read and lock scope
   - Current phase + user-approved target part.
2. Run focused preflight
   - `mcp-smoke-test-checklist`,
   - `session.md` blocker status.
3. Run one bounded edit batch
   - one part only,
   - one phase-relevant skill only,
   - one tool family only.
4. Verify with one gate capture
   - phase-required screenshots,
   - scorecard update.
5. Decide:
   - `PASS` -> lanjut jika user approve.
   - `PARTIAL` -> revisi maksimal 2 item lokal.
   - `BLOCKER` -> rollback dan selesaikan blocker.

Stop condition:

- Jika blocker berulang setelah 2 batch fokus, stop siklus dan minta user reset scope.
- Jika user bilang `lanjut/next`, lanjutkan hanya jika `PASS` + user approval.
- Jika geometri gagal 2 kali dengan gejala sama, stop, audit scale envelope, parent, pivot, attachment, lalu lanjut hanya dari checkpoint valid.

If any required item is missing, Codex must stop and report:

```text
Blocked: mandatory procedure is incomplete.
Missing:
- ...
```

## Ponytail MCP Efficiency Gate

Before each MCP work batch, apply this gate:

```text
Current phase:
Affected part:
Geometry decision path:
Required tool(s):
Smallest safe edit:
Verification needed:
Stop condition:
```

If the work does not fit the current phase, mark it `Out of scope for this phase`.

For geometry phases, `Geometry decision path` must be one of:

```text
scale envelope
front/side silhouette
parent/pivot/attachment
collision/z-fighting
cube noise reduction
defer to texture
```

If the path is `defer to texture`, do not run a geometry edit.

If the verification can be done with a screenshot, do not request large data dumps.

If the issue is local, patch locally. Do not rebuild broad structures without user approval.

## Required Tool Activation Matrix

Codex must activate only the tools needed for the current phase. Do not load or use unrelated tools just because they exist.

```text
Always before any model work:
- OpenSpec: read openspec/config.yaml and the active change under openspec/changes/.
- Ponytail: apply scope, cube-budget, token-budget, and anti-overwork review.
- MCP connection: verify the Blockbench endpoint, runtime tool list, active project, and session ownership.
- blockbench-use: load before any Blockbench MCP modelling, texture, animation, or export action.

Reference Collection:
- Required skill: none for Blockbench editing.
- Optional skill: blockbench-mcp-overview only if MCP capability must be inspected.
- MCP edit: forbidden.

Main Geometry:
- Required skills: blockbench-use, blockbench-modeling.
- Optional skill: blockbench-mcp-overview if tool availability is unclear.
- MCP tools to verify: project creation/opening, groups, cube placement/modification, outline/list, checkpoint, screenshots.

Geometry Detailing:
- Required skills: blockbench-use, blockbench-modeling.
- MCP tools to verify: group/cube edit, selection/outline inspection, checkpoint, screenshots.

UV Texture:
- Required skills: blockbench-use, blockbench-texturing.
- MCP tools to verify: texture list/create/select, UV tools, atlas/texture screenshot, model screenshots.

Base Texturing:
- Required skills: blockbench-use, blockbench-texturing.
- MCP tools to verify: texture paint/fill/draw tools, texture selection, screenshots.

Detail Texturing:
- Required skills: blockbench-use, blockbench-texturing.
- MCP tools to verify: texture paint/draw tools, focused texture inspection, screenshots.

Polish:
- Required skills: blockbench-use plus the relevant phase skill.
- Use blockbench-modeling only for geometry polish.
- Use blockbench-texturing only for texture polish.

Final Review:
- Required skills: blockbench-use, blockbench-mcp-overview only if final state/tool capability must be inspected.
- MCP edit: forbidden unless user explicitly requests a targeted revision phase.
```

If the required skill or MCP tool is unavailable, do not continue. Mark the phase as blocked and ask only for the missing setup.

## Phase Gate Rule

Codex must not enter Blockbench until the current phase is explicit and approved.

If the user asks for Main Geometry but provides a new reference package, Codex must still perform a short Reference Collection review first. This review must identify silhouette, scale, focal areas, cube-vs-texture decisions, risks, and assumptions before editing.

The approved phase list is:

```text
1. Reference Collection
2. Main Geometry
3. Geometry Detailing
4. UV Texture
5. Base Texturing
6. Detail Texturing
7. Polish
8. Final Review
```

The next phase is blocked until the current phase exit gate is reviewed by the user.

Strict rule:

- No phase transition without:
  - completed scorecard,
  - screenshot evidence,
  - explicit user approval.
- If the same blocker persists for 2 consecutive cycle fixes, request strategy reset before continuing.

Next-phase transition template:

```text
Input: phase_transition_request
Check:
1) current_scorecard_status == PASS
2) current_phase_output_artifacts present (front, side, back, 3/4 or phase-defined minimum)
3) active_blockers == none
4) user_approval_for_phase_exit == explicit
5) next_phase_scope approved in phase contract

If all true -> proceed.
Else -> return: "BLOCKED: transition request not executable".
```

No implementation may start on the next phase until this template resolves to "proceed".

## Required Phase Behavior

### 1. Reference Collection

Goal: understand the target before editing.

OpenSpec tracking:

- Current phase must be `Reference Collection`.
- Input must include a model brief or reference package.
- Output must be a concise reference review.
- Blockbench editing is forbidden.

Required output before continuing:

- Asset summary.
- Front/side/back orientation.
- Scale target.
- Geometry Blueprint:
  - global envelope,
  - part build order,
  - part bounding boxes,
  - attachment points.
- Main silhouette features.
- Required focal areas.
- Cube-vs-texture decisions.
- Risk list and assumptions.

No Blockbench edits are allowed in this phase.

Exit gate:

- The asset target is clear.
- Bedrock Entity target is clear.
- Reference priority is clear.
- Main silhouette features are listed.
- Scale and front orientation are clear.
- Cube-vs-texture decisions are listed.
- Missing items are marked `Needs user answer`, `Needs verification`, or `Assumption`.
- User approves moving to Main Geometry.

### 2. Main Geometry

Goal: build only the readable large form.

OpenSpec tracking:

- Current phase must be `Main Geometry`.
- Approved Reference Collection summary must exist.
- Output must be screenshot-based.
- UV, texture detail, animation, polish, and export are out of scope.

Allowed:

- Large silhouette parts.
- Major body or object masses.
- Placeholder colors.
- Clean group hierarchy.

Forbidden:

- UV work.
- Texture detailing.
- Small decorative cubes.
- Final polish.
- Export.

Required output:

- Scale envelope: height, width, depth, front direction, ground/contact point.
- Approved part build order and major part bounding boxes.
- Geometry decision path used for each edit batch.
- Front screenshot.
- Side screenshot.
- Back screenshot.
- 3/4 screenshot.
- Geometry Precision Gate result.
- Cube count and short phase report.

Exit gate:

- The silhouette is recognizable without texture.
- Front and side silhouettes are PASS.
- Required large parts exist.
- No obvious floating parts or bad collision.
- Parent/attachment logic is stable.
- Cube count is still intentionally simple.
- User approves moving to Geometry Detailing.

### 3. Geometry Detailing

Goal: add only physical detail that improves silhouette, depth, attachment, or animation.

OpenSpec tracking:

- Current phase must be `Geometry Detailing`.
- Approved Main Geometry output must exist.
- Every added cube must justify silhouette, depth, attachment, pivot, or focal identity.
- Texture-only details remain forbidden as cubes.

Allowed:

- Larger layered shapes.
- Structural attachments.
- Focal geometry that texture cannot solve.
- Cube reduction where texture can replace minor cube detail.

Forbidden:

- Repeated tiny trim cubes.
- Pixel-scale decorative cubes.
- Texture painting.
- UV repack unless explicitly reopened.

Exit gate:

- Structural details improve the model.
- Cube waste is reduced or justified.
- No known floating, collision, or z-fighting issues remain.
- Scale envelope did not drift from Main Geometry.
- Parent/pivot/attachment logic remains stable.
- Texture-only details are deferred.
- User approves moving to UV Texture.

### 4. UV Texture

Goal: prepare a compact single-atlas layout.

OpenSpec tracking:

- Current phase must be `UV Texture`.
- Approved Geometry Detailing output must exist.
- Atlas size and texture approach must be clear.
- Painting final detail is out of scope.

Allowed:

- UV assignment.
- UV sharing for repeated parts.
- Atlas packing.
- Focal-area pixel density planning.

Forbidden:

- Final painting.
- Full geometry redesign.
- Multiple texture files unless approved.

Exit gate:

- One intended atlas is used unless user approved otherwise.
- UV layout is compact.
- Repeated/mirrored parts reuse UV where safe.
- Focal areas have enough pixel space.
- User approves moving to Base Texturing.

### 5. Base Texturing

Goal: place broad materials and base colors.

OpenSpec tracking:

- Current phase must be `Base Texturing`.
- Approved UV Texture output must exist.
- Material palette and placement are clear.
- Texture detail and polish are out of scope.

Allowed:

- Main material colors.
- Broad color separation.
- Limited palette.

Forbidden:

- Heavy gradient polish.
- Micro scratches.
- UV repack unless blocked.

Exit gate:

- Main materials are readable.
- Palette follows the approved reference.
- Large wrong-color regions are fixed.
- Detail shading is still deferred.
- User approves moving to Detail Texturing.

### 6. Detail Texturing

Goal: add Bedrock-style material depth.

OpenSpec tracking:

- Current phase must be `Detail Texturing`.
- Approved Base Texturing output must exist.
- Detail must target visible/focal areas first.
- Geometry redesign is out of scope unless user reopens geometry.

Allowed:

- Pixel stepped shading.
- Edge highlights.
- Shadow under overlaps.
- Texture-only trims, seams, panels, bands, scratches, and gradients.

Forbidden:

- Rebuilding approved geometry unless the user reopens geometry.
- Full atlas repaint when a local patch is enough.

Exit gate:

- Focal areas have readable texture detail.
- Large visible faces are not flat.
- Gradients and shadows are visibly stepped and Bedrock-style.
- UV efficiency is not broken.
- User approves moving to Polish.

### 7. Polish

Goal: fix only visible final issues.

OpenSpec tracking:

- Current phase must be `Polish`.
- Approved Detail Texturing output must exist.
- Fixes must be local and screenshot-driven.
- Broad redesign is out of scope.

Allowed:

- Local gradient improvement.
- Focal detail clarity.
- Color balancing.
- Small visible issue patches.

Forbidden:

- Big redesign.
- New texture systems.
- Export unless explicitly requested.

Exit gate:

- Remaining visible issues are local or accepted.
- Focal identity is readable from intended view.
- No new geometry, UV, or texture regression is introduced.
- User approves moving to Final Review.

### 8. Final Review

Goal: decide whether to revise, pause, export, or start another asset.

OpenSpec tracking:

- Current phase must be `Final Review`.
- Approved Polish output must exist.
- Editing is forbidden unless the user opens a targeted revision phase.
- Export is forbidden unless user explicitly requests an export target.

Required output:

- Front, side, back, 3/4 screenshots.
- Texture atlas screenshot if textured.
- Short geometry score.
- Short texture score.
- Remaining issues.
- User decision request.

Exit gate:

- User chooses revise, pause, export, or start another asset.
- Any revision is mapped back to a specific phase.
- Final score is short and screenshot-based.

## Cube Budget Rule

Use cubes only when they improve:

- silhouette,
- depth,
- attachment,
- pose,
- animation,
- gameplay readability,
- focal identity.

Use texture for:

- stripes,
- small panels,
- scratches,
- seams,
- gradients,
- small trim,
- shadows,
- color bands,
- 1 to 2 pixel details.

Minor cube overuse must be prevented during planning, not cleaned up late after the logic is already messy.

## Session Rule

Use one intended Blockbench MCP working session per model.

Do not create extra sessions unless they perform a necessary inspection or edit. If multiple sessions exist, identify the active one and ignore idle sessions.

Before editing, report:

```text
Active project:
Active phase:
MCP endpoint:
Working session:
Manual edits to preserve:
```

## MCP Tool Audit Rule

Runtime tool availability must be checked before MCP edits.

If a required tool is missing, Codex must not silently switch to a workaround. It must report:

```text
Blocked: MCP tool availability changed.
Missing tool:
Expected tool source:
Runtime evidence:
Safe fallback available:
User approval needed:
```

Only use a fallback after the user approves or when the fallback is already documented for the current phase.

## Minimum Pre-Execution Checklist

Codex must not edit Blockbench until all items are true:

- OpenSpec read.
- Ponytail active or manual Ponytail-equivalent review applied.
- Required Blockbench skill loaded.
- MCP endpoint verified.
- Runtime MCP tool list verified.
- Active project confirmed.
- Bedrock Entity confirmed.
- Per-face UV confirmed for new projects.
- Current phase confirmed.
- Phase goal defined.
- Output expected for this phase defined.
- Reference priority known.
- Blocking questions answered or accepted as assumptions.
- Manual user edits listed or marked none.
- Export is not requested unless explicitly stated.

## Required Feedback Request

After every phase result, Codex must stop and ask:

```text
This phase is ready for review. Please give feedback using:
Phase:
Part:
Issue:
Expected:
Do not change:
Reference:
```

Do not continue to the next phase until the user approves.

## Acceptance Criteria

- Codex cannot start MCP edits without OpenSpec, Ponytail, Blockbench skills, MCP readiness, and a known phase.
- Each phase has a narrow scope and exit gate.
- The next phase is blocked until user review.
- Cube budget decisions are made before modelling detail.
- Texture is used for minor detail instead of cube noise.
- One model uses one intended working session.
- User manual edits are preserved unless explicitly reopened.
