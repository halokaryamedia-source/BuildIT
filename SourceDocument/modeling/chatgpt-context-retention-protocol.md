# ChatGPT Context Retention Protocol

Use this to keep ChatGPT focused after reading the full upload package.

Do not skip documents. Read the full package first, then keep a compact working-memory card active during the chat.

## Read-All Rule

ChatGPT must read all uploaded package documents before generating references:

- `START_AFTER_UPLOAD.md`
- `SYSTEM_READ_FIRST.md`
- `00_START_HERE_UPLOAD_THIS_TO_CHATGPT.md`
- all `supporting_docs/*`
- all `reference_templates/*`
- sample images as format examples only

The purpose is full context coverage. The working-memory card exists only to prevent context drift after reading.

## Working-Memory Card

After reading the package, ChatGPT must create and silently follow this card:

```text
WORKING MEMORY CARD
Target: Bedrock Entity only
Quality: marketplace-grade
Current job: ask user setup questions before generation
Current phase: Reference Collection
Do not: generate before user answers
Do not: copy sample assets
Do not: treat kangaroo or lantern sprite as target unless requested
Must produce: reference sheets/prompts, reference_manifest.json, Geometry Blueprint table, Negative Geometry Constraints, View Consistency, Codex-ready request
Must preserve: phase gates, geometry-vs-texture split, atlas/cube/bone budget, marketplace baseline
Codex first action: Run Reference Collection only; no Blockbench edit until Geometry Blueprint is accepted
```

ChatGPT should not print this card every turn unless asked. It should use it as the active control state.

## Context Refresh Checkpoints

Before each major output, ChatGPT must briefly self-check:

```text
Current target still user-provided:
Bedrock Entity only:
Marketplace-grade baseline:
Reference Collection first:
Geometry Blueprint required:
reference_manifest.json required:
No sample copying:
```

If any answer is unclear, ask a follow-up instead of generating.

## User-Facing Flow

Keep the conversation light:

1. Read all documents.
2. Ask the easy setup questions.
3. Ask only missing follow-up questions.
4. Generate reference plan.
5. Generate reference prompts/images.
6. Output `reference_manifest.json`.
7. Output Geometry Blueprint table.
8. Output Codex-ready request.

Do not explain the full workflow unless the user asks.

## Drift Recovery

If ChatGPT starts to drift, it must reset to:

```text
We are preparing marketplace-grade Bedrock Entity references only.
We are not modelling yet.
We must finish Reference Collection outputs before Codex edits anything.
```

## Acceptance Criteria

- ChatGPT reads all documents.
- ChatGPT keeps a compact control state after reading.
- ChatGPT asks simple questions to the user.
- ChatGPT does not lose the Bedrock Entity, marketplace-grade, phase-gated workflow.
- ChatGPT does not copy sample assets.
