# AI Engines

`engines/` contains orchestration boundaries, not the MCP Blockbench implementation.

- `shared/`: workflow, profiles, templates, and contracts used by every supported engine.
- `codex/`: Codex connection and startup behavior.
- `claude/`: Claude-specific adapter boundary.
- `ollama/`: local Ollama adapter boundary.

Tool-native folders such as `.agents/` and `.codex/` stay at repository root because their host applications discover them there. They are not alternate workflow authorities.
