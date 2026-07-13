# Reference Studio Flow

## Linear Minecraft-only flow

```text
source intake
→ extract subject identity and visible facts
→ apply mandatory Minecraft / Blockbench cuboid style automatically
→ zero to four high-impact subject questions in one batch when needed
→ Production Context
→ APPROVAL 1
→ one Golden-Sample-locked Minecraft cuboid Reference Visual
→ hidden blocking QA
→ maximum one targeted correction of the same visual when required
→ only a QA-passing visual is shown
→ APPROVAL 2
→ automatic stage documents + executable manifest + Codex handoff
→ automatic package audit
→ reference_candidate ZIP
```

There is no style-selection branch. The user is never asked to choose realistic, semi-realistic, voxel-filter, cinematic, or Minecraft styling. This skill always produces Minecraft Bedrock / Blockbench cuboid pixel art.

There is no routine third approval. Promotion to `golden_sample` is a separate repository action.

## States

```text
CONTEXT_DRAFT
CONTEXT_REVIEW
REFERENCE_VISUAL_DRAFT
REFERENCE_VISUAL_QA
REFERENCE_VISUAL_CORRECTION
REFERENCE_VISUAL_REVIEW
PACKAGE_BUILD
PACKAGE_AUDIT
HANDOFF_READY
```

## QA visibility rule

`REFERENCE_VISUAL_DRAFT` and `REFERENCE_VISUAL_CORRECTION` are internal states. A failed draft is never shown to the user as approval-ready.

The visual advances to `REFERENCE_VISUAL_REVIEW` only when all of these pass:

- actual Minecraft / Blockbench cuboid construction;
- varied and intentional cuboid massing rather than uniform stacking;
- purposeful stepped forms and limited justified rotations;
- Golden Sample panel layout, camera position, facing direction, scale, and spacing;
- identity, proportions, pose, attachments, texture, and cross-view consistency.

If the initial visual fails, use the one allowed targeted correction. If the corrected visual still fails, stop with exact failure codes. Do not generate another board and do not restart the flow from source intake.

## No-loop rules

- Do not re-ask approved or visible facts.
- Do not ask for a visual-style preference.
- Do not generate separate angles or technical sheets.
- Do not show failed visual drafts for approval.
- Do not perform optional polish after QA passes.
- Do not reopen Production Context for a technical-document wording fix.
- Do not create draft, backup, alternate-style, or versioned package outputs.

## Import mapping

- technical contracts and manifest → `workspace/active/<asset>/mcp/references/`
- approved Reference Visual and source evidence → `workspace/active/<asset>/blockbench/references/`

Runtime state, checkpoints, diagnostics, reports, and model output are created only after Codex imports the approved package.
