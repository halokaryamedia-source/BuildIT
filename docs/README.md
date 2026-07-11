# Documentation

| Path | Purpose |
| --- | --- |
| `product/` | Product overview, installation, and usage. |
| `workflow/` | Human-readable production stages and review flow. |
| `architecture/` | Repository, MCP runtime, and tool-profile architecture. |
| `integrations/` | ChatGPT, Codex, Claude, Ollama, and tool-native integration notes. |
| `reference/` | Reference-package guidance, ChatGPT Reference Studio flow, and approved examples. |
| `project/` | Contribution and repository guidance. |
| `legacy/` | Historical index only; never runtime authority. |
| `api/` | Generated MCP API documentation; do not edit generated files manually. |

Reference creation starts from:

```text
engines/chatgpt/skills/blockbench-reference-studio/SKILL.md
```

The approved reference ZIP is then handed to Codex/MCP-Blockbench for staged production. See `reference/CHATGPT_REFERENCE_STUDIO.md`.

Normal production agents start from the root `README.md`, `engines/codex/BOOTSTRAP.md`, and the active OpenSpec. They do not load the entire documentation tree.
