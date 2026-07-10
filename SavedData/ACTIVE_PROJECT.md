# Active Project

## Current Project State

Project: MCP-Blockbench Asset Studio
Current model in progress: kangaroo
Target Category: Bedrock Entity
Current Phase: Reference Collection
Status: In Progress
Priority: High / Medium / Low
Start Date:
Last Updated:
Project Owner:
Expected Output:
- Model file package in Blockbench only (no final export yet)

Active model folder:
- `SavedData/sessions/kangaroo/`

## Active Source References

- OpenSpec:
  - `openspec/config.yaml`
  - `openspec/changes/mcp-blockbench-workflow/`
- Core workflow docs:
  - `SourceDocument/README.md`
  - `SourceDocument/modeling/operator-one-page-checklist.md`
  - `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md`
  - `SourceDocument/modeling/phase-detail-contract.md`
  - `SourceDocument/modeling/quality-implementation-rules.md`
- MCP/session controls:
  - `SourceDocument/modeling/efficient-mcp-session-flow.md`
  - `SourceDocument/modeling/model-session-checklist-template.md`
  - `SourceDocument/modeling/model-session-lock-template.md`
  - `SourceDocument/modeling/ops/README.md`
  - `SourceDocument/modeling/ops/session-lock-protocol.md`
- ChatGPT reference orchestration:
  - `SourceDocument/modeling/chatgpt-system-read-first.md`
  - `SourceDocument/modeling/chatgpt-ready-reference-generator-prompt.md`
  - `SourceDocument/modeling/chatgpt-upload-zip-rebuild-instructions.md`
- Engineering/design specs:
  - `SourceDocument/planning/00-context-lock.md`
  - `SourceDocument/planning/01-prd.md`
  - `SourceDocument/planning/02-srs.md`
  - `SourceDocument/planning/03-system-design.md`
  - `SourceDocument/planning/04-uiux-flow.md`
  - `SourceDocument/planning/05-task-breakdown.md`
- QA and quality:
  - `SourceDocument/modeling/modeling-phase-quality-playbook.md`
  - `SourceDocument/modeling/phase-quality-insight-matrix.md`
  - `SourceDocument/modeling/phase-quality-scorecard-template.md`
  - `SourceDocument/modeling/visual-qa-checklist.md`
  - `SourceDocument/modeling/quality-implementation-rules.md`

## Asset Workspace

- Session folder: `SavedData/sessions/<asset_name>/`
  - `session.md` (single source of session progress)
  - `session-lock.md` (per-session MCP lock)
  - `references/` (reference package)
  - `final-screenshots/` (approved captures)
  - `phase-screenshots/` (optional, per phase only)

## Workflow Checkpoints

- Before start:
  - Validate OpenSpec + required checks
  - Confirm one active session lock
  - Run smoke test
  - Run `phase-risk-simulation`
- Per phase:
  - one phase only
  - phase scorecard required
  - no broad redesign
  - max 2 critical fixes per cycle
- Before next phase:
  - scorecard must be PASS
  - user explicit approval recorded

## Decisions & Logs

- Key decisions:
  - <entry>
- Blockers:
  - <entry>
- Validation failures:
  - <entry>
- Final note:
  - <entry>

## Finalization

- Final visual review:
  - Front / Side / Back / 3-4
  - Texture atlas
  - UV compactness check
  - Cube budget check
- Final status:
  - Ready for handoff / Hold for manual edits / Needs new reference / Export pending

