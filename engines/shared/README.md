# Shared Engine Workflow

This directory is the engine-neutral authority for model production.

```text
workflow/   state, evidence, checkpoint, governance, and profile contracts
profiles/   exact stage and MCP tool allowlists
templates/  canonical runtime state template
skills/     shared skill registry and lock metadata
```

The MCP implementation itself lives only in `mcp-blockbench/`.

Codex, Claude, Ollama, and other integrations may adapt transport or prompt behavior, but must not redefine the four production stages, copy profile authorities, or create versioned workflow files.
