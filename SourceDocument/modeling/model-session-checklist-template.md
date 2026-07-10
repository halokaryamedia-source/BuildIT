# Model Session Checklist Template

Use one copy of this checklist for every new model request. It is the short context file that keeps Codex, OpenSpec, Ponytail, Blockbench MCP, and the user aligned.

Start from the compact workflow first:
[workflow-quick-reference.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/workflow-quick-reference.md)

Do not start Blockbench MCP edits until this checklist is complete or missing items are marked as accepted assumptions.

Recommended location:

```text
SavedData/sessions/[asset]/session.md
```

See `model-session-folder-convention.md`.

## 1. Project Identity

```text
Project Name:
Target Category: Bedrock Entity
Asset Name:
Identifier Prefix:
In-game Function:
Target Visual Quality: marketplace-grade
Current Production Phase:
Phase Goal:
```

## 2. Reference Package

```text
Reference folder or zip:

01_[asset]_orthographic_views.png
02_[asset]_scale_sheet.png
03_[asset]_silhouette_sheet.png
04_[asset]_part_breakdown_sheet.png
05_[asset]_color_palette_sheet.png
06_[asset]_closeup_detail_sheet.png
07_[asset]_execution_target_sheet.png
08_[asset]_animation_pivot_sheet_optional.png
REFERENCE_PLAN.md
CODEX_REFERENCE_HANDOFF.md
reference_manifest.json
```

Reference priority:

```text
1. Orthographic views: front, side, back, top, and proportions.
2. Scale sheet: dimensions, contact points, and comparison target.
3. Silhouette sheet: distance readability and large identity shapes.
4. Part breakdown sheet: broad construction zones, attachment logic, and texture-only decisions.
5. Color palette sheet: atlas target, texture style, material colors, and placement.
6. Close-up detail sheet: focal areas and local detail placement.
7. Execution target sheet: DO-only visual locks.
8. Animation pivot sheet: pivot readiness only when relevant.
```

If references conflict, follow the higher-priority file and mark the conflict as `Needs verification`.

## 3. Required Answers

```text
Front side:
Scale:
Approx height:
Approx width:
Approx depth:
Top 3 to 5 focal areas:
Required geometry parts:
Texture-only details:
Out-of-scope details:
Material palette:
Texture atlas size: 64x64 / 128x128 / 256x256 / 512x512 / other
Pixel style: default Minecraft 16x style / cleaner 32x style / other
Animation required: No / Yes
Complexity level: Simple / Medium / Complex / Inferred from reference
Project name:
Root group name:
```

Execution runbook:

- `modeling-phase-quality-playbook.md`

Execution strictness:

- One phase per session, one scorecard per phase cycle.
- Max 2 critical fixes per phase cycle.
- Max 2 extra screenshot batches per phase cycle.
- Reopen scope only on user confirmation.

Quick mode:

- Keep this checklist minimal for fast runs: phase, target issue, status, evidence, and next step.
- Gunakan detail section hanya jika blocker muncul.

## 4. Cube Budget And Geometry Plan

```text
Cube budget expectation: Low / Medium / High

Geometry is allowed only for:
- Silhouette
- Depth
- Attachment
- Pose
- Animation
- Gameplay readability
- Focal identity

Texture must handle:
- Stripes
- Small panels
- Scratches
- Seams
- Gradients
- Small trim
- Shadows
- Color bands
- 1 to 2 pixel details

Execution plan before MCP edit:
Build:
Skip:
Risk:
Verification:
```

Geometry Translation Plan:

```text
Geometry Blueprint:
- Global envelope:
  - height:
  - width:
  - depth:
  - front direction:
  - ground/contact points:
- Part build order:
  1.
  2.
  3.
- Part bounding boxes:
  - part:
    - height / width / depth:
    - position relative to root:
    - attachment point:
    - rotation:

Geometry must be cube:
Texture-only detail:
Forbidden small cube detail:
Silhouette priority:
Cube budget:
```

Texture Translation Plan:

```text
Material groups:
Gradient targets:
Focal texture areas:
Reusable / shared texture areas:
Large flat-face risks:
Texture-only details replacing cube work:
```

## 5. Tool And Session Preflight

```text
OpenSpec read: Yes / No
Ponytail active or manual Ponytail-equivalent review applied: Yes / No
MCP batch plan: <phase> -> <part> -> <expected calls>
Blockbench skill loaded:
MCP endpoint:
MCP endpoint verified: Yes / No
Runtime tool list verified: Yes / No
Required MCP tools available: Yes / No
Session-lock status: Not set / Locked / Needs reset
Session lock ID:
Session lock owner:
Session lock started:
Active project:
Working session:
Unexpected extra sessions: None / List
Session reuse policy used:
```

If the runtime tool list changes or a required tool is missing, stop and report:

```text
Blocked: MCP tool availability changed.
Missing tool:
Expected tool source:
Runtime evidence:
Safe fallback available:
User approval needed:
```

Do not use a workaround before this audit is reported.

Session control escalation:

```text
Do not open new MCP session:
Yes / No
Reason (if Yes):
Reset approval:
```

Reference this when filling lock fields:
- `SourceDocument/modeling/ops/session-lock-protocol.md`
- `SourceDocument/modeling/model-session-lock-template.md`

## 6. Phase Output Contract

Stable phase meanings:

```text
Reference Collection:
Review references only. No Blockbench edits.

Main Geometry:
Large readable form only. Placeholder colors allowed. No UV or texture detail.
MCP goal in this session:
- Build: <single target part>
Allowed edit scope:
- <max 1 focused geometry pass>

Geometry Detailing:
Physical structural detail only. No texture painting.
MCP goal in this session:
- Add: <single structural addition or correction>
Allowed edit scope:
- <max 1 focused structural pass>

UV Texture:
Single-atlas UV preparation only. No final painting.
MCP goal in this session:
- Prepare UV for: <specific group/face set>
Allowed edit scope:
- <max 1 UV edit batch>

Base Texturing:
Broad material and color placement only.

Detail Texturing:
Pixel-art shading, gradients, shadows, seams, trims, and material depth.
MCP goal in this session:
- Detail: <specific part> only
Allowed edit scope:
- <max 1 texture brush/edit batch>

Polish:
Local screenshot-driven fixes only. No broad redesign.
MCP goal in this session:
- Fix: <specific issue list>
Allowed edit scope:
- Max 2 focused fixes

Final Review:
Score, decide revise/pause/export/new asset. No new edit unless a phase is reopened.
```

```text
Phase:
Completed work:
Skipped work:
Screenshots or artifact:
Issues:
Assumptions:
Next phase blocked until user approval: Yes
```

Required screenshots:

```text
Main Geometry / Geometry Detailing:
- Front
- Side
- Back
- 3/4

UV Texture / Base Texturing / Detail Texturing / Polish:
- Front
- Side
- Back
- 3/4
- Texture atlas
- Focal close-up when relevant
```

### Lightweight quality gate (per phase)

Use [phase-quality-scorecard-template.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/phase-quality-scorecard-template.md) and keep only:

- PASS / PARTIAL / BLOCKER.
- Critical fixes (max 2).
- User approval line before next phase.

If phase scorecard is `BLOCKER`, next phase MUST stay blocked until resolved.

## 6.a Ringkas flow (ops mode)

Atur minimal:

- `status` harus selalu `PASS`, `PARTIAL`, atau `BLOCKER`.
- Satu keputusan berarti satu isu.
- `PARTIAL` = revisi kecil lalu lanjutkan siklus berikutnya.
- `BLOCKER` = rollback dan kunci sampai blocker teratasi.

## 7. User Feedback Guide

Ask the user:

```text
This phase is ready for review. Please give feedback using:
Phase:
Part:
Issue:
Expected:
Do not change:
Reference:
```

Good feedback examples:

```text
Phase: Main Geometry
Part: Side silhouette / tail
Issue: Tail is too short and does not balance the body.
Expected: Make the tail longer and lower, closer to reference 02 scale sheet.
Do not change: Head and ears.
Reference: 02_scale_sheet, side view.
```

```text
Phase: Detail Texturing
Part: Chest front
Issue: Large face is still flat and has no stepped gradient.
Expected: Add darker inner edge, mid body color, brighter upper edge, and small highlight.
Do not change: UV layout and geometry.
Reference: 06_texture_reference, primary material example.
```

Poor feedback examples:

```text
Bad.
Make it better.
Not professional.
Fix everything.
```

If feedback is too broad, ask for the phase and part before editing.

## 8. Stop Conditions

Stop immediately when:

- Current phase output is complete.
- User approval is needed.
- Required tool or skill is missing.
- MCP endpoint is unavailable.
- Active project is unclear.
- Multiple sessions make ownership unclear.
- Reference conflict affects the edit.
- Visual result cannot be verified.
- User says stop.
- Requested edit belongs to another phase.
- A known phase-blocking issue remains unresolved.
- Reference conflict affects major geometry.

## 9. "Next Phase" Execution Rule

If user requests a phase transition (for example: "next", "lanjut", or "masuk next phase"), Codex must run this sequence:

1. Validate scorecard for current phase is `PASS`.
2. Confirm current phase screenshot evidence is attached in the session log.
3. Confirm unresolved blockers are `No`.
4. Confirm current phase is explicitly approved by the user with phase context.
5. Confirm next phase scope and allowed actions are in contract.

If any step is missing:

```text
Blocked: Next phase request not executable.
Reason:
Action:
```

When all steps are valid:

```text
Allowed to proceed to next phase: <phase_name>
Scope locked:
Max edits this phase:
```

Before executing next phase, re-run the per-phase checklist from section 6.

## Acceptance Criteria

- The checklist gives enough context for a new chat or another PC.
- Reference files follow a predictable order.
- The current phase and output are unambiguous.
- Tool availability is audited before fallback.
- Feedback is based on screenshots and concrete parts.
- Stop conditions are explicit.

