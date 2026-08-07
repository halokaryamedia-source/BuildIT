# Project Workspace

`workspace/` is the root-level working area for Blockbench projects.

- `active/` contains projects currently being developed.
- `saved/` contains projects that passed validation and are finished.

Each project contains its `.bbmodel` file directly, plus `export-data/` and `mcp-data/`.
References and preview screenshots belong under `mcp-data/references/` and
`mcp-data/cache/`; keep MCP cache and development metadata out of export data.
