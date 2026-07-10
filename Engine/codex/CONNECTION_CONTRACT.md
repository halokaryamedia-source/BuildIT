# Codex ↔ Blockbench MCP Connection Contract

This contract prevents Codex from searching ports, rebuilding connection configuration, or repeatedly rediscovering the active Blockbench endpoint.

## Canonical Connection

```text
Codex MCP server key: blockbench
Transport: Streamable HTTP
URL: http://localhost:3000/bb-mcp
Blockbench plugin ID: mcp
Port: 3000
Endpoint: /bb-mcp
Auto port fallback: disabled
```

Machine-readable authority:

```text
Engine/codex/connection-profile.json
```

## Responsibility Boundary

```text
Blockbench
→ hosts the open project and MCP plugin

Blockbench MCP plugin
→ exposes tools/resources at the canonical URL

Codex
→ connects through the single `blockbench` MCP server key
→ reads state/reference/stage rules
→ performs the approved stage work
```

The components must not independently invent another port, endpoint, server key, or active project.

## Required Blockbench Settings

```text
mcp_port: 3000
mcp_auto_port: false
mcp_endpoint: /bb-mcp
mcp_session_timeout: 30 minutes
mcp_sse_heartbeat: 15 seconds
```

Only one Blockbench instance may own port 3000 during an asset session.

If port 3000 is already occupied, do not scan for another port. Stop with `BLOCKER` and close or reconfigure the conflicting process intentionally.

## Required Codex Configuration

The Codex user configuration must contain exactly one canonical entry:

```toml
[mcp_servers.blockbench]
url = "http://localhost:3000/bb-mcp"
```

Use:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

The script updates only the `mcp_servers.blockbench` section. When the configuration changes, restart Codex once. Normal asset sessions must not rewrite the config.

## Deterministic Startup Order

```text
1. Open the Rework workspace.
2. Launch one Blockbench instance.
3. Ensure the MCP plugin is loaded.
4. Open or create the intended Blockbench project.
5. Run sync-local-stack.ps1 for the active asset.
6. Read reports/connection.json.
7. Start or resume Codex work only when result = PASS.
```

Example:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset black_rhinoceros
```

## Readiness Report

The script writes:

```text
SavedData/sessions/<asset>/reports/connection.json
```

The report records:

- canonical URL;
- Codex config status;
- Blockbench process count;
- MCP handshake status;
- plugin/runtime version;
- actual server URL and settings;
- active project name, UUID, format, UV mode, and texture size;
- required common tool availability;
- transient smoke-session cleanup result;
- one exact next action when blocked.

Codex reads this report instead of searching the machine or re-running multiple connection experiments.

## MCP Runtime Confirmation

After Codex is connected, call once:

```text
get_runtime_status
```

This returns the live plugin, server, project, and session state in one structured result.

Do not call separate discovery tools when `get_runtime_status` already proves the required facts.

## No-Search Rule

Codex must not:

- scan ports 3000–3020;
- create alternate MCP server keys per project;
- add another `blockbench_*` connection;
- repeatedly initialize smoke sessions;
- inspect every MCP tool before each stage;
- infer the project from an old Markdown file;
- continue when the actual URL differs from the canonical URL.

## Failure Handling

### Codex config missing or changed

```text
INSTALL_AND_RESTART_CODEX
```

Run the sync script with `-InstallCodexConfig`, restart Codex once, and rerun the readiness check.

### Blockbench not running

```text
BLOCKER: BLOCKBENCH_NOT_RUNNING
Safe action: launch Blockbench once.
```

### Plugin or endpoint unavailable

```text
BLOCKER: MCP_ENDPOINT_UNAVAILABLE
Safe action: load/reload the MCP plugin and verify the canonical settings.
```

### Port or endpoint mismatch

```text
BLOCKER: CONNECTION_CONTRACT_MISMATCH
Safe action: restore port 3000, endpoint /bb-mcp, and auto-port disabled.
```

### Multiple Blockbench instances

```text
BLOCKER: MULTIPLE_BLOCKBENCH_INSTANCES
Safe action: keep only the intended project window open.
```

### Required tool missing

```text
BLOCKER: MCP_CAPABILITY_MISMATCH
Safe action: rebuild/reload the Rework plugin; do not use a risky workaround.
```

## Session Rule

The readiness script uses a temporary read-only smoke session and closes it before returning.

The actual Codex MCP session is created by Codex through the canonical `blockbench` entry and becomes the single active write session recorded in `state.json`.

Do not store the smoke-session ID as the Codex write-session ID.

## Acceptance Criteria

Connection readiness is `PASS` only when:

- exactly one Blockbench process is running;
- the MCP plugin listens at the canonical URL;
- auto-port fallback is not active;
- the Codex config matches the canonical server key and URL;
- the common workflow tools exist;
- the intended Blockbench project is open and identifiable;
- the temporary smoke session is closed;
- no connection blocker remains.
