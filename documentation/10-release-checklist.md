# 10-release-checklist

## Purpose
- Release and QA runbook for the BlockIT bridge lifecycle.

## Pre-release
- Source contract contract files exist and are pinned (`SOURCE_CONTRACT.md`, `contracts/upstream/mcp-blockbench/api.json`, `contracts/upstream/mcp-blockbench/pinned-commit.txt`).
- CI guardrails pass, including source contract verification and folder safety checks.
- No leftover runtime/temp files from manual testing.

## Verification
- Automated checks:
  - `tsx tools/verify-source-contract.ts` (offline checks).
  - Static scan for forbidden folders: `legacy`, `old`, `v1`, `v2`, `v3`, `new-engine`, `engine-final`, `engine-fixed`.
  - Confirm `contract/` files are present and valid.
- Manual QA checklist:
  - Install/start Blockbench MCP at `http://localhost:3000/bb-mcp` and run `Start Workspace` (Ollama mode), then stop.
  - Start Blockbench MCP on `http://localhost:3001/bb-mcp` and confirm selectable endpoint auto-detects.
  - Start Blockbench MCP on `http://localhost:3002/bb-mcp` and confirm switching endpoint works.
  - Remove/disable `uvx` and verify clear dependency error state before launch.
  - Remove/stop Ollama and verify "Ollama not available" state and actionable message.
  - Enable Codex mode, generate both direct and fallback configs, copy preview, and write only after confirmation.
  - Confirm remote endpoint launch shows warning and requires explicit confirm.
  - Confirm logs are streamed to Logs tab and are bounded.

## Release criteria
- All high-level acceptance criteria in documentation files 00-09 are met.
- One active MCP bridge engine only; no duplicate runtime paths.
- No added modeling logic, tool invention, or source-contract override.
- Source contract checks pass in local and CI environments.
- Final commit is clean and pushed to `origin V1`.

## Final release gate
- Run all commands in [`RELEASE.md`](./RELEASE.md) before tagging.
- Require screenshots/log evidence for:
  - Endpoint detection at 3000/3001/3002.
  - Missing-`uvx` and missing-`Ollama` warning flow.
  - Successful Codex config write after confirmation.
- CI and manual QA must both pass before release tag.
