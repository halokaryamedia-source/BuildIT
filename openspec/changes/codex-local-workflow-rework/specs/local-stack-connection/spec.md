# Local Stack Connection Specification

## Requirement: Canonical Connection Identity

The system SHALL use exactly one normal Codex MCP entry:

```text
server key: blockbench
transport: Streamable HTTP
URL: http://localhost:3000/bb-mcp
```

The Blockbench MCP runtime SHALL listen on port `3000` with endpoint `/bb-mcp` and SHALL NOT use automatic fallback ports during the Rework workflow.

### Scenario: Canonical stack available

- Given one Blockbench instance is running
- And the Rework MCP plugin is loaded
- And an intended Blockbench project is open
- And Codex contains the canonical `blockbench` entry
- When the readiness command runs
- Then connection result is `PASS`
- And no alternate port or MCP server key is created

### Scenario: Canonical port unavailable

- Given port 3000 cannot be bound or reached
- When Blockbench MCP starts or readiness runs
- Then the result is `BLOCKER`
- And the system does not scan another port
- And one safe recovery action identifies the conflicting process or required restart

## Requirement: One-Command Readiness

The system SHALL provide one local command that:

- checks or installs the Codex MCP entry;
- reports whether Codex restart is required;
- verifies exactly one Blockbench process;
- performs an MCP initialize handshake;
- lists tools once;
- verifies required common tools;
- calls `get_runtime_status` once;
- records live server and project identity;
- closes the temporary smoke session;
- writes `reports/connection.json`;
- updates connection/project fields in `state.json` when an asset is supplied.

### Scenario: First Codex setup

- Given the canonical Codex entry is absent
- When the command runs with `-InstallCodexConfig`
- Then only `mcp_servers.blockbench` is added or replaced
- And result is `RESTART_REQUIRED`
- And the user receives one action: restart Codex once

### Scenario: Normal startup

- Given Codex config already matches
- When the command runs with an asset ID
- Then it does not rewrite Codex config
- And it writes the asset connection report
- And it updates `state.json`
- And result is `PASS` or one explicit `BLOCKER`

## Requirement: Single Live Runtime Snapshot

The MCP server SHALL expose `get_runtime_status` as a read-only structured tool.

It SHALL return:

- plugin and Blockbench versions;
- live server status and actual URL;
- canonical connection comparison;
- effective runtime settings;
- configured legacy settings when different;
- active project name, UUID, format, UV mode, texture size, save path, and counts;
- active session identities;
- blockers and non-blocking warnings.

Codex SHALL prefer this tool over repeated connection, project, and settings discovery.

## Requirement: Session Discipline

The readiness smoke session SHALL be temporary and SHALL be closed before stage work.

The Codex MCP session SHALL be the only active write session recorded in `state.json`.

### Scenario: Multiple sessions

- Given more than one MCP session remains active during readiness or stage work
- When runtime status is checked
- Then status is `BLOCKER`
- And no model mutation occurs until ownership is unambiguous

## Requirement: No Search Behavior

Codex SHALL NOT:

- scan local ports;
- create project-specific Blockbench MCP keys;
- add multiple Blockbench MCP entries;
- initialize a new session per stage;
- list all tools before every edit;
- infer the active project from legacy Markdown;
- continue on a fallback endpoint.

## Requirement: Connection Before Asset Preflight

Connection readiness SHALL precede reference/package/project preflight.

The full order SHALL be:

```text
canonical connection readiness
→ active asset/reference preflight
→ persistent session-start checkpoint
→ active production stage
```

No MCP write SHALL occur unless `reports/connection.json` is `PASS` and live `get_runtime_status` is not blocked.

## Acceptance Criteria

- Connection identity is deterministic and machine-readable.
- One command replaces manual connection discovery.
- One runtime tool replaces repeated live discovery calls.
- A missing capability produces one explicit blocker rather than a risky fallback.
- Existing saved Blockbench settings cannot silently move the Rework runtime to another endpoint.
- Codex configuration is installed at most once and reused across asset sessions.
