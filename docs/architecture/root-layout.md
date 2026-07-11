# Root Layout

There is one canonical path for each concern:

```text
src        MCP Blockbench implementation
engines    AI-engine orchestration
workspace  runtime asset production data
docs       documentation
openspec   approved scope and tasks
build      build tooling
```

Tool-native `.agents`, `.codex`, `.github`, and `.vscode` remain at root for host discovery. They are adapters, not competing workflow authorities.

Do not recreate `Engine`, `SavedData`, or `SourceDocument`. Do not introduce versioned folder names such as `v2`, `new`, or `latest`.
