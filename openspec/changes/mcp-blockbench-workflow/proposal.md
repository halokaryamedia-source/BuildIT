# Proposal: MCP Blockbench Workflow Foundation

## Why This Change Is Needed

Codex and Ollama workflows need a shared planning foundation that prevents context loss, overengineering, hallucinated tools, and generic 3D modelling assumptions. The existing repository already provides an MCP Blockbench plugin; the change documents how to use it safely rather than replacing it.

## What It Changes

- Adds documentation for Codex and Ollama MCP workflows.
- Adds Minecraft / Blockbench design context documents.
- Adds OpenSpec guardrails for future implementation.
- Adds explicit boundaries for GitHub Tool and Ponytail review.
- Adds acceptance criteria and assumption tracking.

## What It Does Not Change

- Does not modify plugin source code.
- Does not add dependencies.
- Does not create a new MCP server.
- Does not add MCP tools.
- Does not change build, test, or release scripts.

## Main Risks

- `Needs verification`: Runtime MCP tools depend on Blockbench being open and plugin settings.
- `Needs verification`: Ponytail may not be available in all environments.
- `Assumption`: Default endpoint remains `http://localhost:3000/bb-mcp`.
- `Assumption`: Ollama model selected by the user can handle tool calling adequately.
- `Out of scope`: Solving missing modelling capabilities by adding new tools in this change.

## Success Criteria

- Required planning docs exist.
- OpenSpec project and change files exist.
- Every planning doc includes acceptance criteria.
- Codex and Ollama workflows are documented.
- Design context pack covers Minecraft style, scale, UV, QA, and export.
- No code or dependency files are changed.

## Acceptance Criteria

- Need, changes, non-changes, risks, and success criteria are explicit.
- Existing MCP Blockbench architecture remains unchanged.
- Future implementation is gated by OpenSpec and anti-overengineering review.
