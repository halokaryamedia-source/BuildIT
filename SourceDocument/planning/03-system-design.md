# System Design: MCP Blockbench Workflow Foundation

## System Overview

The system is a documentation and specification guardrail around the existing MCP Blockbench plugin. It does not replace the plugin. It defines how Codex and Ollama clients should connect to the existing MCP endpoint, verify tools, use Minecraft design context, and stop before risky or unapproved actions.

## Component List

- Blockbench desktop application.
- MCP Blockbench plugin, built from this repository.
- MCP server endpoint inside Blockbench, default `http://localhost:3000/bb-mcp`.
- Codex MCP client configuration.
- `mcp-client-for-ollama` / `ollmcp`.
- OpenSpec project and change files.
- GitHub Tool for inspection when available.
- Ponytail or manual anti-overengineering review.
- Design Context Pack in `SourceDocument/modeling/`.

## Codex Scenario Architecture

```txt
User
  |
  v
Codex
  |
  v
Context Lock + OpenSpec
  |
  v
Repository Source
  |
  v
GitHub Tool / Ponytail Review
  |
  v
MCP Blockbench Server
  |
  v
Blockbench Desktop
```

Codex should read context documents first, inspect source, verify MCP tool availability, and use the existing endpoint. Future code changes require an approved OpenSpec task and an anti-overengineering review.

## Ollama Scenario Architecture

```txt
User
  |
  v
mcp-client-for-ollama
  |
  v
Local Ollama Model
  |
  v
Human-in-the-loop Approval
  |
  v
MCP Blockbench Server
  |
  v
Blockbench Desktop
```

The Ollama workflow keeps a human approval gate between local model intent and state-changing Blockbench tools.

## OpenSpec Guardrail Architecture

OpenSpec stores project rules and change-specific requirements. Future implementation should read `openspec/project.md`, then the active change proposal, design, tasks, and specs before editing source.

## GitHub Tool Usage Boundary

GitHub tooling may inspect repositories, issues, pull requests, source files, and history. It is not required to write to GitHub for this planning foundation.

## Ponytail Review Boundary

Ponytail is used only as an anti-overengineering and simplicity review step when available. `Needs verification`: Ponytail availability in the current execution environment. If unavailable, perform the same review manually.

## Blockbench MCP Interaction Boundary

Agents may use only verified MCP tools. The generated `docs/api.json` is the static reference, while the active MCP client tool list is the runtime reference. State-changing tools require context, approval, and QA.

## Design Context Pack Architecture

```txt
Model Request
  |
  v
Minecraft Model Brief
  |
  v
Scale Rules
  |
  v
Geometry Rules
  |
  v
Texture / UV Rules
  |
  v
Visual QA Checklist
  |
  v
Export Rules
```

## Data and Context Flow

- User request enters Codex or `ollmcp`.
- Agent reads Context Lock and the relevant OpenSpec change.
- Agent verifies repo facts and MCP tools.
- Modelling requests load the design context pack.
- Agent requests approval for risky actions.
- Agent performs the smallest approved action.
- Agent records assumptions, QA results, and next steps.

## Safety and Approval Flow

```txt
Requested action
  |
  v
Is it source-changing or Blockbench state-changing?
  |
  +-- no --> Execute after tool verification
  |
  +-- yes --> Explain risk and required inputs
              |
              v
            Human approval
              |
              +-- approved --> Execute minimal action
              +-- rejected --> Stop and summarize
```

## Known Limitations

- Automated tests are not currently set up in the upstream repository.
- Runtime tool availability depends on Blockbench being open with the plugin loaded.
- Multiple Blockbench windows may change the port.
- Local Ollama model quality and tool-calling reliability vary.
- Ponytail availability is not guaranteed.

## Future Extension Boundary

Future extensions must be proposed through OpenSpec, justified against existing source, and reviewed for overengineering. New dependencies, new tools, and new architecture are not permitted without explicit approval.

## Acceptance Criteria

- Codex, Ollama, and design context diagrams are included.
- Boundaries for GitHub Tool, Ponytail, and MCP interactions are explicit.
- Safety and approval flow is documented.
- Known limitations are visible.
- No new runtime architecture is introduced.
