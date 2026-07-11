# Root Architecture Specification

## Requirement: Single Canonical Root Layout

The repository SHALL use exactly one canonical root path for each concern:

- `src/` for MCP Blockbench implementation;
- `engines/` for shared and engine-specific orchestration;
- `workspace/` for mutable runtime asset data;
- `docs/` for human and generated documentation;
- `openspec/` for scope and decision contracts;
- `build/` for build tooling.

`Engine/`, `SavedData/`, and `SourceDocument/` SHALL NOT exist after migration.

### Scenario: Agent starts work

- Given the repository is opened
- When the agent reads root navigation
- Then it can identify implementation, engine integration, runtime state, documentation, and OpenSpec without searching duplicate roots

## Requirement: No Versioned Duplicate Authorities

The system SHALL NOT create parallel folders or files using names such as `v2`, `new`, `latest`, or copied authorities. Git history SHALL serve as the archive.

## Requirement: Tool-Native Root Paths

`.agents/`, `.codex/`, `.github/`, and `.vscode/` SHALL remain at root for host discovery but SHALL NOT redefine shared production workflow.

## Requirement: Runtime Data Isolation

New asset sessions SHALL live under `workspace/sessions/<asset>/` and SHALL be ignored by Git by default. `workspace/active-session.json` SHALL be the only repository-level active-session pointer.
