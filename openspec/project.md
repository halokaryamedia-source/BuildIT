# OpenSpec Project: MCP Blockbench

## Project Purpose

MCP Blockbench is a Blockbench plugin that exposes Blockbench capabilities through MCP. This OpenSpec project keeps future Codex and Ollama workflow changes source-grounded, minimal, and Minecraft / Blockbench aware.

## Core Constraints

- Preserve the existing TypeScript/Bun plugin architecture.
- Use the existing MCP server endpoint and tool system.
- Do not create a new MCP server.
- Do not add dependencies without an approved change and review.
- Do not introduce unrelated agent frameworks.
- Do not replace Blockbench workflows with Blender or generic 3D pipelines.
- Verify available tools before using them.

## Allowed Sources

- Local repository source.
- MCP Blockbench upstream repository.
- Blockbench MCP sample skills project.
- `mcp-client-for-ollama` source and docs.
- Official Blockbench, Minecraft Creator / Bedrock, MCP, and Codex docs when validation is needed.

## Design Rules

- Start from `SourceDocument/planning/00-context-lock.md`.
- Use the design context pack for modelling workflows.
- Keep architecture changes minimal and justified.
- Prefer documentation and existing config examples before new systems.
- Mark unverified items as `Needs verification`, `Assumption`, or `Out of scope`.

## Guardrails

- No source edits before reading the active OpenSpec change.
- No new dependencies during planning-only tasks.
- No hallucinated MCP tools.
- No risky Blockbench state changes without human approval.
- No task is done until anti-overengineering review is complete.

## Review Process

1. Read Context Lock.
2. Read this project file.
3. Read the active change proposal, design, tasks, and specs.
4. Verify source and available tools.
5. Implement only the approved task.
6. Run available tests or manual verification.
7. Run Ponytail if available, otherwise perform manual anti-overengineering review.
8. Summarize changes, assumptions, out-of-scope items, and remaining risks.

## Acceptance Criteria

- Project purpose and constraints are documented.
- Allowed sources are limited.
- Design rules include Minecraft / Blockbench context.
- Guardrails prevent overengineering and hallucinated tools.
- Review process is repeatable.
