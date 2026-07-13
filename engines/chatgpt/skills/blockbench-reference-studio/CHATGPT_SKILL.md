# ChatGPT Skill Distribution

This directory contains the **ChatGPT Skill installation package** for MCP-Blockbench Reference Studio.

## Download

- File: [`MCP-Blockbench-Reference-Studio-3.3-Unified-GitHub-Live-Final.zip`](releases/MCP-Blockbench-Reference-Studio-3.3-Unified-GitHub-Live-Final.zip)
- SHA-256: `09ba22e44c2f75b47832a9f0c3c8bc4c3b41050564061d51d4369d00282ed013`
- Size: `4,339 bytes`
- Source branch: `Rework`

## Purpose

Upload this ZIP to **ChatGPT** as the Blockbench Reference Studio Skill.

The package is a GitHub-live bootstrap. At the beginning of a compatible task it loads the current Reference Studio, Geometry, Texture, Animation, Validation, and Codex handoff rules from this repository's `Rework` branch.

GitHub remains the source of truth. Ordinary updates to rules and templates in `Rework` do not require replacing the bootstrap ZIP.

Use these commands in ChatGPT:

```text
SYNC
SYNC SKILL
SYNC STATUS
REFRESH
```

`SYNC STATUS` must report the resolved GitHub commit and loaded file hashes. The Skill fails closed when GitHub authority cannot be read instead of silently claiming stale data is current.

## Canonical live source

```text
repository: halokaryamedia-source/BuildIT
branch: Rework
path: engines/chatgpt/skills/blockbench-reference-studio
```

The ZIP is for ChatGPT orchestration and reference-package creation. Codex must still independently fetch the latest `origin/Rework` before local MCP + Blockbench production.
