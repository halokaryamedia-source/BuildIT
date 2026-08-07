# Obsidian Vault Layout for BlockIT

## Context

- The repo needed a knowledge system that could be opened directly in Obsidian.
- The working docs were already split between product policy and development notes.
- The goal was to keep the repo modular without adding a heavy documentation layer.

## Decision

- Use `docs/knowledge/` as the repo-local Obsidian vault.
- Keep `docs/foundation/` as the product and operating-model SSOT.
- Use `docs/knowledge/index.md` as the vault dashboard.
- Use `.obsidian/` inside `docs/knowledge/` for vault settings.

## Why

- This keeps the vault close to the repo it describes.
- It avoids maintaining a separate external notes folder.
- It gives Obsidian a clean start page and predictable structure.
- It keeps product rules separate from working notes.

## Tradeoffs

- The vault is now part of the repo, so it needs light maintenance.
- Obsidian config files are tracked alongside the notes.
- The structure must stay disciplined or it can sprawl.

## Validation

- The vault folder exists in the repo.
- Obsidian settings are present under `docs/knowledge/.obsidian/`.
- The dashboard and templates exist.
- The start page is configured to open `index.md`.

## Follow-up

- Add new notes only when the repo actually needs them.
- Move stable rules into `docs/foundation/` if a note becomes policy.
- Keep `operations/` short-lived and practical.
