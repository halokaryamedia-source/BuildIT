# PRD: MCP Blockbench Workflow Foundation

## Product Overview

MCP Blockbench is a Blockbench plugin that exposes modelling, texture, project, prompt, and resource capabilities through Model Context Protocol. This planning foundation defines two safe workflows: Codex for code, configuration, documentation, and controlled modelling support; and Ollama for local LLM driven MCP usage through `mcp-client-for-ollama`.

## Problem Statement

Agents can lose context, assume generic 3D workflows, invent missing tools, or add unnecessary architecture. MCP Blockbench needs a source-grounded planning layer that keeps work inside the existing plugin architecture and Minecraft / Blockbench modelling context.

## Goals

- Document Codex connection to the existing MCP Blockbench endpoint.
- Document Ollama connection through `ollmcp`.
- Require MCP tool verification before use.
- Create Minecraft / Blockbench design context rules for modelling requests.
- Use OpenSpec to anchor future changes before implementation.
- Include GitHub tooling and Ponytail review boundaries without requiring them as runtime dependencies.

## Non-Goals

- No new MCP server.
- No replacement architecture.
- No new dependencies.
- No unrelated agent framework.
- No Blender or generic 3D production pipeline.
- No implementation of modelling automation in this planning phase.

## Target Users

- Developers maintaining MCP Blockbench.
- Codex users planning or implementing repository changes.
- Local Ollama users driving MCP tools with human approval.
- Minecraft / Blockbench creators who need modelling briefs, scale rules, texture rules, QA, and export constraints.

## Main Use Cases

- Connect Codex to `http://localhost:3000/bb-mcp`.
- Verify available MCP tools before modelling or code-related workflows.
- Use OpenSpec before future implementation.
- Use `ollmcp` for local Ollama access to the Blockbench MCP server.
- Create model briefs that keep geometry, scale, texture, UV, and exports Minecraft-aware.

## Scenario A: Codex Workflow

Codex reads `SourceDocument/planning/00-context-lock.md`, checks OpenSpec, inspects relevant source, verifies available MCP tools, and then performs only the approved task. Codex should document direct Streamable HTTP MCP config first, with `mcp-remote` as fallback if direct HTTP cannot list tools.

## Scenario B: Ollama Workflow

The user runs Blockbench with the plugin enabled, then connects `ollmcp` to the MCP URL. The local model uses tool enable/disable controls and human-in-the-loop approval before executing tool calls that modify Blockbench state.

## Minecraft / Blockbench Design Context Requirement

Every modelling workflow must start from a Minecraft model brief. Geometry should use readable blocky silhouettes, restrained element counts, consistent scale, and texture/UV rules appropriate to the target platform.

## Tooling Requirement

- OpenSpec is needed to prevent context loss and lock approved requirements before source edits.
- GitHub Tool is useful for inspecting repository history, issues, PRs, and source context faster than manual browsing.
- Ponytail is needed as an anti-overengineering review step when available.
- The design context pack is needed because Blockbench modelling for Minecraft is not the same as generic 3D modelling.
- Unnecessary tools must be avoided because this repo already has a functioning plugin architecture and generated API docs.

## Success Metrics

- Future agents can connect Codex or Ollama without inventing configuration.
- Future tasks reference OpenSpec before implementation.
- Modelling tasks include Minecraft scale, style, UV, QA, and export checks.
- Future changes avoid new dependencies unless explicitly specified and reviewed.
- Assumptions and out-of-scope items are visible in planning outputs.

## Risks

- `Needs verification`: Ponytail availability in the current environment.
- `Assumption`: Blockbench plugin settings remain at default port `3000` and endpoint `bb-mcp`.
- `Assumption`: Local Ollama model supports tool calling well enough for the selected task.
- `Out of scope`: Adding missing MCP tools to satisfy future modelling requests.

## Acceptance Criteria

- Codex and Ollama workflows are both covered.
- OpenSpec, GitHub Tool, Ponytail, and design context rationale is included.
- Non-goals prevent overengineering.
- Minecraft / Blockbench context is required for modelling.
- Risks are labelled with `Needs verification`, `Assumption`, or `Out of scope`.
