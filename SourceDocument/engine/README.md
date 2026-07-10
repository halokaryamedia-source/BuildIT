# Engine Workspace

This folder stores operational/control documents used across MCP Blockbench sessions.

## Purpose

- Keep runtime rules and orchestrator notes separate from current session output.
- Centralize where to start when opening a new chat or new environment.

## What belongs here

- `SourceDocument/engine/WORKFLOW_HUB.md`  
  Single entry for session execution rules and phase flow.
- `project-hub.md`  
  Compact workflow index and path map to active controls.
- `root-layout-constraints.md`  
  Why most source/tool folders cannot be moved out of root.
- `tooling-map.md`  
  Boundary map for Codex skills, MCP, and plugin/runtime artifacts.
- `WORKFLOW_HUB.md` checklist and references for every modeling session.

## Skill / MCP / Plugin boundaries

- **Codex-level instructions** (procedural prompts, session locks, and process handoffs): referenced from `SourceDocument/*` and `SavedData/*`.
- **MCP/Blockbench tooling**: Blockbench MCP server + plugin runtime docs under repository source (`src/`, `build/`, `prompts/`, etc., not moved).
- **Connector/LLM docs**: references to Claude/Cline/Ollama setup are stored in `SourceDocument/engine-connectors/*`.

## Quick links for operations

- Planning source: `SourceDocument/README.md`
- MCP and skill map: `SourceDocument/mcp-and-skills/README.md`
- Active model session: `SavedData/ACTIVE_PROJECT.md`
- New chat bootstrap: `SourceDocument/modeling/engine-bootstrap-faststart.md`
- Redirect map: `SourceDocument/engine/root-layout-redirects.md`

## Rule

Do not add new production docs here unless they are core execution controls.

For full constraints on what cannot be moved out of root, see:

- `SourceDocument/engine/root-layout-constraints.md`

