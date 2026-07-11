# Shared Engine Workflow

This directory is the engine-neutral authority for model production.

```text
workflow/   state, evidence, checkpoint, governance, and profile contracts
profiles/   exact stage and MCP tool allowlists
templates/  canonical runtime state template
skills/     shared runtime production skill registry and lock metadata
```

The MCP implementation itself lives only in `mcp-blockbench/`.

The ChatGPT-only reference-generation workflow lives separately in `engines/chatgpt/`. It creates the approved per-asset handoff package but is not part of the runtime production skill registry or the `.agents`/`.codex` adapters.

Codex, Claude, Ollama, and other production integrations may adapt transport or prompt behavior, but must not redefine the four production stages, copy profile authorities, or create versioned workflow files.
