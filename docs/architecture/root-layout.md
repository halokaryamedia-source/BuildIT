# Root Layout

There is one canonical path for each concern:

```text
mcp-blockbench  complete MCP Blockbench package
engines         shared and engine-specific AI orchestration
workspace       active and completed Blockbench production projects
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

Inside each workspace project:

```text
workspace/active/<asset>/ or workspace/completed/<asset>/
├─ blockbench/   user-facing .bbmodel, textures, reference PNGs, previews
└─ mcp/          project/state metadata, technical contracts, checkpoints, evidence, reports
```

`workspace/workspace.json` is a local pointer/index only. `mcp/state.json` is runtime authority. Completed projects retain MCP metadata for future revision but expose all ordinary user files in one copyable `blockbench/` folder.

Tool-native `.agents`, `.codex`, `.github`, and `.vscode` remain at root for host discovery. They are adapters, not competing workflow authorities.

Do not recreate root `src`, `build`, `prompts`, `tests`, `Engine`, `SavedData`, or `SourceDocument`. Do not introduce `v2`, `new`, `latest`, `backup`, or parallel authority names.
