# Operator One-Page Checklist

Use this checklist before every Codex + Blockbench MCP modelling session. It is intentionally short so the operator can enforce the workflow without rereading every document.

 Jika Anda ingin mode paling cepat: gunakan
[compact-geometric-pipeline.md](/D:/Work/AI%20Stuff/MCP-Blockbench/SourceDocument/modeling/compact-geometric-pipeline.md) dulu, lalu turun ke dokumen detail hanya saat ada masalah.

Tidak ada mode/model-engine ganda: pakai satu alur tunggal (reference-ready -> fase aktif -> loop 1 isu -> user confirm) sampai blokir selesai.

## Required Before Any Blockbench Edit

- Read `openspec/config.yaml` and the active change under `openspec/changes/mcp-blockbench-workflow/`.
- Read `mandatory-blockbench-mcp-procedure.md`, `phase-detail-contract.md`, and `quality-implementation-rules.md`.
- Confirm the project is Bedrock Entity.
- Confirm Default UV Mode is Per-face UV.
- Confirm the target asset name, identifier prefix, scale, visual direction, and reference package.
- Confirm the Blockbench MCP endpoint is the existing `blockbench` endpoint, normally `http://localhost:3000/bb-mcp`.
- Run the MCP smoke test before using write/edit tools.
- For normal one-issue geometry sessions: run `phase-risk-simulation` only if a blocker appears twice.
- Use Blockbench skills before modelling: `blockbench-use` first, then modelling or texturing skills as needed.
- Use Ponytail as the anti-overwork gate: do only the current phase, avoid unnecessary sessions, avoid minor-detail cubes, avoid new tools unless required.
- Execution mode is fixed: one phase per cycle, max 2 critical fixes, and no broad redesign.
- Maximum MCP call pattern per cycle: one edit goal -> one focused verification set -> one scorecard pass.
- Session lock is required before every modeling/tool action:
  - Create or reuse one lock entry in `SavedData/sessions/[asset]/session-lock.md` (or the asset `session.md`).
  - Reuse one `mcp-session-id` across all related calls for the same phase.
  - If session is not locked, stop and run preflight.
  - Follow: `SourceDocument/modeling/ops/session-lock-protocol.md`
  - Template: `SourceDocument/modeling/model-session-lock-template.md`

## Phase Rule

Only execute the current approved phase:

1. Reference Collection
2. Main Geometry
3. Geometry Detailing
4. UV Texture
5. Base Texturing
6. Detail Texturing
7. Polish
8. Final Review

Do not skip, merge, or continue into the next phase unless the user approves.

Geometry hard rule:

- Main Geometry must run scale envelope -> silhouette lock -> structural lock.
- Main Geometry must follow the approved Geometry Blueprint: build order, part bounding boxes, and attachment points.
- Every geometry edit must name one decision path: scale, silhouette, parent/pivot/attachment, collision, cube noise, or defer to texture.
- Front and side screenshots must PASS before Geometry Detailing.
- If the same geometry blocker fails twice, stop and use `geometry-failure-prevention-playbook.md`.
- Do not use texture, UV, or color to hide geometry failure.

Phase transition command:

- When user says "lanjut" / "next", Codex must run one gate check:
  - Current phase scorecard status = PASS
  - Required screenshots or artifacts are present
  - Blockers resolved
  - User approval for exit is explicit
- If any item is missing, respond with:
  
  ```text
Blocked: cannot proceed to next phase yet.
  Missing checks: ...
  Missing approvals or artifacts:
  ```
  
  - If all checks pass, start the next phase directly with the exact next phase contract loaded.

Strict escalation:

- If two consecutive blocker cycles happen with similar issues, ask user for scope reset before the next attempt.
- If feedback is broad, request phase + part before editing and do not proceed on generic wording.

## Per-Phase Stop Point

At the end of each phase, stop and report:

- What was completed.
- What was intentionally not touched.
- Which reference points were followed.
- Any issue that should be fixed before the next phase.
- The exact feedback format the user should use.

## Token-Saving Rules

- Do not repeat long source documents in chat; cite the controlling document name.
- Use screenshots only at checkpoints or when visual verification is needed.
- Do not open extra MCP sessions unless the current session is unavailable.
- Do not rebuild geometry already accepted by the user.
- Do not create cube details that texture can represent.
- Do not run broad audits when a phase-specific check is enough.
- Use one checklist + one scorecard per phase cycle only.
- Do not open new MCP sessions after preflight unless the active session is lost/unusable.

Session anti-spam rule (hard):

- One model request = one active MCP session at a time.
- No initialize/reconnect loop in a single fix cycle.
- If a second session is needed, escalate as `Blocked` and ask for explicit session reset approval.

## Acceptance Criteria

- OpenSpec and required modelling documents were read.
- Required skills and MCP readiness were verified before edits.
- Work stayed inside the approved phase.
- Ponytail anti-overwork review was applied before marking the phase done.
- User approval is requested before moving to the next phase.

