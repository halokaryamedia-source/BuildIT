# Reference Studio Flow

## Linear flow

```text
source intake
→ zero to four high-impact questions in one batch when needed
→ Production Context
→ APPROVAL 1
→ one Golden-Sample-guided Reference Visual
→ blocking QA; maximum one targeted edit
→ APPROVAL 2
→ automatic stage documents + executable manifest + Codex handoff
→ automatic package audit
→ reference_candidate ZIP
```

There is no routine third approval. Promotion to `golden_sample` is a separate repository action.

## States

```text
CONTEXT_DRAFT
CONTEXT_REVIEW
REFERENCE_VISUAL_DRAFT
REFERENCE_VISUAL_REVIEW
PACKAGE_BUILD
PACKAGE_AUDIT
HANDOFF_READY
```

## Import mapping

- technical contracts and manifest → `workspace/active/<asset>/mcp/references/`
- approved Reference Visual and source evidence → `workspace/active/<asset>/blockbench/references/`

Runtime state, checkpoints, diagnostics, reports, and model output are created only after Codex imports the approved package.
