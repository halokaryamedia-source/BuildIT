# Root Architecture Specification

## Requirement: Single Canonical Root Layout

The repository SHALL use exactly one canonical root path for each concern:

- `mcp-blockbench/` for the complete MCP Blockbench package, including `src/`, `scripts/`, `prompts/`, `tests/`, package files, and generated `dist/` output;
- `engines/` for shared and engine-specific orchestration;
- `workspace/` for active and completed runtime asset data;
- `docs/` for authored documentation and generated API output;
- `openspec/` for scope and decision contracts.

Root-level `src/`, `build/`, `prompts/`, `tests/`, package files, `Engine/`, `SavedData/`, and `SourceDocument/` SHALL NOT exist after migration.

### Scenario: Agent starts work

- Given the repository is opened
- When the agent reads root navigation
- Then it can identify the canonical MCP package, engine integration, runtime state, documentation, and OpenSpec without searching duplicate roots

## Requirement: No Versioned Duplicate Authorities

The system SHALL NOT create parallel folders or files using names such as `v2`, `new`, `latest`, or copied authorities. Git history SHALL serve as the archive.

## Requirement: Tool-Native Root Paths

`.agents/`, `.codex/`, `.github/`, and `.vscode/` SHALL remain at root for host discovery but SHALL NOT redefine shared production workflow.

## Requirement: Runtime Data Isolation

`workspace/workspace.json` SHALL be the only repository-level selected-project index and SHALL NOT be runtime authority.

Editable assets SHALL live under `workspace/active/<asset>/`; completed assets SHALL live under `workspace/completed/<asset>/`. Each asset SHALL separate:

```text
blockbench/  canonical model, textures, reference images, approved previews
mcp/         project metadata, state, contracts, checkpoints, evidence, reports
```

`workspace/active/<asset>/mcp/state.json` SHALL be runtime authority and `workspace/active/<asset>/mcp/project.json` SHALL provide canonical identity/path metadata. Completed baselines SHALL remain immutable while a reopened revision is active.