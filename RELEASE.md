# BlockIT Release Guide (V1)

## Scope
This release package includes:
- `app-launcher` (Tauri/Svelte launcher)
- `mcp-engine` (Bridge runtime)
- Contract & verification tooling under `tools/*`

## Pre-release validation (required)
1. `git fetch`
2. `git checkout V1`
3. `git pull`
4. `git status --short` must be clean
5. `tsx tools/verify-source-contract.ts`
6. `tsx tools/verify-app-launcher.ts`
7. `tsx tools/frontend-smoke-check.ts`
8. `cargo check --manifest-path mcp-engine/Cargo.toml`
9. `cargo check --manifest-path app-launcher/src-tauri/Cargo.toml`
10. `cargo clippy --manifest-path mcp-engine/Cargo.toml -- -D warnings`

## Manual QA evidence
- Run `documentation/10-release-checklist.md` manually and record pass/fail status:
  - Endpoint detection for 3000 / 3001 / 3002
  - Ollama missing warning flow
  - uvx missing warning flow
  - Remote endpoint confirmation
  - Codex config preview + write confirmation
  - Logs stream and bounded history

## CI gate
- CI (`.github/workflows/ci.yml`) must pass on `push`/`pull_request`.
- Includes:
  - source contract verify
  - app-launcher verify
  - frontend smoke check
  - Rust `cargo check` and `clippy`

## Release gate
- Only after all checks and manual QA pass, create release tag:
  - `git tag -a v0.1.0 -m "BlockIT release v0.1.0"`
  - `git push origin v0.1.0`

## Post-release
- Keep docs and CI guards unchanged unless source contracts change.
- Re-run this guide on every release milestone.
