# MCP Blockbench Workflow Hub (Single Source for Operational Context)

> This is the operational "single source" you use to run one model end-to-end.

## 1) Active Project State (isi dari sini dulu)

- Project: `MCP-Blockbench Asset Studio`
- Current model: `kangaroo`
- Target category: `Bedrock Entity`
- Current phase: `Reference Collection` / `Main Geometry` / `Geometry Detailing` / `UV Texture` / `Base Texturing` / `Detail Texturing` / `Polish` / `Final Review`
- Status: `Not Started` / `In Progress` / `Blocked` / `Review` / `Paused` / `Done`
- Last updated: `<date>`
- Owner: `<owner_name>`

## 2) Core Required Files (always load once per session)

- `Active model control`: `SavedData/ACTIVE_PROJECT.md`
- `Workflow index`: `SourceDocument/engine/project-hub.md`
- `Execution baseline`: `SourceDocument/modeling/mandatory-blockbench-mcp-procedure.md`
- `Operator guardrail`: `SourceDocument/modeling/operator-one-page-checklist.md`
- `Phase contract`: `SourceDocument/modeling/phase-detail-contract.md`
- `Quality rules`: `SourceDocument/modeling/quality-implementation-rules.md`
- `Session lock`: `SourceDocument/modeling/model-session-lock-template.md`
- `OpenSpec`: `openspec/config.yaml` and `openspec/changes/mcp-blockbench-workflow/`

## 3) Exact Session Flow (one phase only)

1. Read required source (`SavedData/ACTIVE_PROJECT.md` + `SourceDocument/README.md` + `operator-one-page-checklist.md`)
2. Run preflight:
   - phase-risk simulation
   - MCP smoke test
   - session lock check (single active `session_id`)
3. Execute only approved phase
4. Scorecard + screenshots required
5. Get explicit user approval before next phase

Do not do:
- multi-phase execution in one pass
- re-initialize MCP session without reset reason
- broad edits outside allowed phase scope

## 4) File Ownership Map

- Planning documents:
  - `SourceDocument/planning/*`
- Modelling workflow:
  - `SourceDocument/modeling/*`
- MCP control + ops:
  - `SourceDocument/modeling/ops/*`
- Active model data (per asset):
  - `SavedData/sessions/<asset>/session.md`
  - `SavedData/sessions/<asset>/session-lock.md`
  - `SavedData/sessions/<asset>/references/`
  - `SavedData/sessions/<asset>/final-screenshots/`
- ChatGPT reference generator pack:
  - `SourceDocument/modeling/chatgpt-system-read-first.md`
  - `SourceDocument/modeling/chatgpt-ready-reference-generator-prompt.md`
  - `SourceDocument/chatgpt-bedrock-blockbench-reference-generator-upload.zip`
  - `SourceDocument/modeling/chatgpt-upload-zip-rebuild-instructions.md`

ChatGPT sync rule:
- If geometry, phase, reference, or quality logic changes in `SourceDocument/modeling/`, update the ChatGPT-facing prompt/docs and rebuild `SourceDocument/chatgpt-bedrock-blockbench-reference-generator-upload.zip` before using ChatGPT for new references.
- Minimum trigger files: `mandatory-blockbench-mcp-procedure.md`, `phase-detail-contract.md`, `quality-implementation-rules.md`, `reference-package-pass-fail-checklist.md`, `model-session-checklist-template.md`, and `operator-one-page-checklist.md`.

## 5) Root Access (only these when starting)

- `SavedData/ACTIVE_PROJECT.md`
- `SourceDocument/engine/WORKFLOW_HUB.md`
- `SourceDocument/README.md`
- `SourceDocument/modeling/`
- `SavedData/sessions/`
- `openspec/`
- `SourceDocument/engine/project-hub.md` (compact path map)

## 6) Anti-Spam Session Rule (hard)

- One model request = one active MCP session unless explicitly reset.
- Keep one `session_id` per active phase group.
- If a second session appears unexpectedly:
  - stop edits
  - log blocker
  - request explicit reset approval

## 7) Completion Gate

Session is eligible to close when:
- smoke test and risk simulation are clean,
- scorecard result is `PASS`,
- user approval is recorded,
- no unresolved `BLOCKER`,
- final screenshots and session lock updated.

## 8) What to update for new model

Before new model:
1. Update `SavedData/ACTIVE_PROJECT.md`
2. Create `SavedData/sessions/<asset>/session.md` and `session-lock.md`
3. Copy phase contract + session checklist fields
4. Start flow from **Reference Collection**

## 9) Reference Package Locations

- Active calibration sample: `SourceDocument/reference-samples/ninja-master-bedrock-entity/`
- Legacy layout comparison: `SourceDocument/reference-samples/legacy/kangaroo_legacy_9sheet/`
- Active per-asset sessions: `SavedData/sessions/<asset>/`

