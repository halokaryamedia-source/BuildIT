# Root Layout

There is one canonical path for each concern:

```text
mcp-blockbench  complete MCP Blockbench package
engines         shared and engine-specific AI orchestration
workspace       mutable runtime asset production data
docs            authored documentation and generated API output
openspec        approved scope, decisions, and tasks
```

Inside `mcp-blockbench/`:

```text
src      plugin implementation
scripts  build and documentation tooling
prompts  MCP prompt assets
tests    focused verification
dist     generated plugin output
```

Tool-native `.agents`, `.codex`, `.github`, and `.vscode` remain at root for host discovery. They are adapters, not competing workflow authorities.

Do not recreate root `src`, `build`, `prompts`, `tests`, `Engine`, `SavedData`, or `SourceDocument`. Do not introduce `v2`, `new`, `latest`, `backup`, or parallel authority names.
