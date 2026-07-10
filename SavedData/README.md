# Saved Data Workspace

This folder is the live operational store for the **current and in-progress assets**.

## What belongs here

- `SavedData/ACTIVE_PROJECT.md`  
  Global active model status (model, phase, owner, blockers, and checkpoints).
- `sessions/<asset_name>/`  
  Per-asset working state and session control files:
  - `session.md`
  - `session-lock.md`
  - optional references and screenshots
  - `artifacts/<phase>/` for phase screenshots and generated evidence
- `cache/`
  Ignored runtime/cache artifacts such as temporary ZIP inspections, visual check screenshots, generated scratch files, and files that should not live in `SourceDocument/` or `.codex/`.

## Current active path

- `sessions/kangaroo/`  
  - `session.md`
  - `session-lock.md`

## Usage rule

- `SourceDocument/` remains authoritative for reusable SOPs and templates.
- `SavedData/` holds only **current session state and work artifacts**.
- `SavedData/cache/` holds disposable generated artifacts. Keep it out of source control.
- `.codex/` should keep Codex skills/config only, not modelling screenshots or generated visual checks.
- `prompts/` is runtime/build input for plugin prompts. Do not move prompt files unless `src/lib/promptLoader.ts`, `build/generate-manifest.ts`, and docs manifests are updated together.

