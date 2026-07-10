# New Chat Real Flow Test

Use this to confirm the workflow still works when starting a new ChatGPT or Codex chat.

## Purpose

The test verifies that context survives through documents instead of relying on memory from an old conversation.

## ChatGPT Reference Generation Test

1. Upload `SourceDocument/chatgpt-bedrock-blockbench-reference-generator-upload.zip` to ChatGPT Web.
2. Tell ChatGPT to read `SYSTEM_READ_FIRST.md` first.
3. Confirm ChatGPT asks what asset should be created instead of inventing one.
4. Provide a target asset description and optional inspiration images.
5. Confirm ChatGPT generates the required reference package in the same phase order used by Codex:
   - Reference Collection
   - Main Geometry
   - Geometry Detailing
   - UV Texture
   - Base Texturing
   - Detail Texturing
   - Polish
   - Final Review
6. Confirm ChatGPT marks sample kangaroo images as format examples only.
7. Confirm ChatGPT outputs a Codex-ready request with the generated image references attached or clearly named.

## Codex Execution Test

1. Start a new Codex chat in this project.
2. Upload the ChatGPT output and reference images.
3. Confirm Codex reads OpenSpec and the required SourceDocument modelling docs before acting.
4. Confirm Codex performs the MCP smoke test before any write/edit tool.
5. Confirm Codex uses `blockbench-use` before Blockbench MCP edits.
6. Confirm Codex uses Ponytail as the anti-overwork gate.
7. Confirm Codex starts with Reference Collection and does not jump straight into modelling.
8. Confirm Codex stops after the current phase and requests user feedback.

## Failure Conditions

- ChatGPT creates a target asset without asking the user.
- ChatGPT treats sample images as the required model.
- Codex skips OpenSpec or required modelling docs.
- Codex opens unnecessary MCP sessions.
- Codex edits Blockbench before MCP readiness is verified.
- Codex skips phases or starts texturing before geometry approval.
- Codex uses minor decorative cubes where texture should carry the detail.

## Acceptance Criteria

- A new ChatGPT chat can produce the required reference package without old conversation context.
- A new Codex chat can continue from that package using the mandatory phase workflow.
- The first Blockbench edit only happens after OpenSpec, skills, MCP readiness, and phase scope are verified.
