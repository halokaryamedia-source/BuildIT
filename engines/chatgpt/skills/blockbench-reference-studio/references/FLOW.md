# Reference Studio Flow

## End-to-end boundary

```text
SOURCE INTAKE
source image + user notes

CHATGPT REFERENCE STUDIO
Production Context
→ approval
→ one turnaround generation
→ Sheet 01
→ approval
→ deterministic Sheets 02–04
→ approval
→ stage contracts
→ final approval
→ manifest + handoff + ZIP

CODEX + MCP-BLOCKBENCH
ZIP import
→ contract validation
→ workspace init/activate
→ Geometry review
→ Texture review
→ optional Animation review
→ Final Validation review
```

## Phase states

```text
CONTEXT_DRAFT
CONTEXT_APPROVED
TURNAROUND_DRAFT
SHEET_01_REVIEW
TECHNICAL_SHEETS_REVIEW
STAGE_CONTRACTS_REVIEW
PACKAGE_AUDIT
PACKAGE_APPROVED
HANDOFF_READY
```

## Approval rules

- No image generation before `CONTEXT_APPROVED`.
- No Sheets 02–04 before Sheet 01 approval.
- No final ZIP before technical sheets and stage contracts are approved.
- ChatGPT never simulates approval.
- Codex never edits an unapproved reference package.

## Import mapping

When Codex imports the final ZIP:

```text
technical documents
→ workspace/active/<asset>/mcp/references/

visual sheets and source images useful to the modeller
→ workspace/active/<asset>/blockbench/references/
```

The ZIP remains the immutable approved source package. Runtime state, checkpoints, evidence, and reports are created only after import.
