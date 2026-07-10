# Root Layout Constraints (Why not only 2 visible folders?)

Only two folders were meant to hold operational content:

- `Engine/` → workflow, session rules, tooling boundary.
- `SavedData/` → active in-progress model state.

The following must stay in root because they are required by build/runtime/tooling and are explicitly protected:

- `.agents/`, `.codex/`, `.github/`, `.vscode/`
- `openspec/`, `SourceDocument/`, `src/`, `build/`, `prompts/`, `server/`, `dist/`, `docs/`
- `package.json`, `bun.lock`, `tsconfig.json`, `node_modules/`, plugin/index files, and repo metadata files

So the repo will always show more than two items at root, but workflow logic is now concentrated in `Engine/` and `SavedData/` as requested.
