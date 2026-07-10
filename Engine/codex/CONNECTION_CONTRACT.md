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

## Required Blockbench Runtime

Rework enforces these effective values in plugin startup:

```text
port: 3000
endpoint: /bb-mcp
auto-port: false
minimum session timeout: 30 minutes
SSE heartbeat: 15 seconds
```

Saved legacy UI settings may still be visible until resaved, but they cannot silently move the Rework runtime to another port or endpoint.

Only one visible Blockbench application window may be active during an asset session. Electron child processes do not count as extra Blockbench instances.

If port 3000 is occupied, do not scan for another port. Stop with `BLOCKER` and resolve the conflicting process intentionally.

## Build and Reload the Rework Plugin

After source changes to the MCP plugin:

```powershell
bun install
bun run dev
```

Then in the single Blockbench window:

1. load or reload `dist/mcp.js`;
2. grant local network permission when Blockbench requests it;
3. confirm the MCP panel shows `http://localhost:3000/bb-mcp`;
4. open or create the intended Blockbench project.

Do not run the readiness command against an old plugin build. A missing `get_runtime_status`, `save_project_checkpoint`, or `capture_standard_views` tool means the Rework build was not loaded correctly.

## Required Codex Configuration

The Codex user configuration must contain exactly one Blockbench MCP entry:

```toml
[mcp_servers.blockbench]
url = "http://localhost:3000/bb-mcp"
```

First-time synchronization:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

The script removes stale `blockbench_*` entries, preserves unrelated TOML sections, and writes the canonical `mcp_servers.blockbench` section. When it changes the configuration, restart Codex once.

Normal asset sessions must not rewrite Codex configuration.

## Deterministic Startup Order

```text
1. Open the Rework workspace.
2. Build/reload the current Rework plugin when source changed.
3. Keep one visible Blockbench window open.
4. Open or create the intended Blockbench project.
5. Run sync-local-stack.ps1 for the active asset.
6. Read reports/connection.json.
7. Restart Codex only when result = RESTART_REQUIRED.
8. Start or resume stage work only when result = PASS.
```

Normal example:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset black_rhinoceros
```

## Readiness Report

The script writes:

```text
SavedData/sessions/<asset>/reports/connection.json
```

The report records:

- canonical server key and URL;
- Codex config status and stale-key cleanup;
- visible Blockbench window count;
- MCP handshake status;
- actual plugin/runtime version;
- actual server URL and effective settings;
- active project name, UUID, format, UV mode, and texture size;
- required common tool availability;
- transient smoke-session cleanup result;
- remaining active session count;
- one exact next action when blocked.

Codex reads this report instead of searching the machine or re-running multiple connection experiments.

## MCP Runtime Confirmation

After Codex is connected, call once:

```text
get_runtime_status
```

This returns the live plugin, server, project, effective settings, and session state in one structured result.

The temporary readiness smoke session is explicitly marked and excluded from write-session ambiguity checks while it exists.

Do not call separate discovery tools when `get_runtime_status` already proves the required facts.

## No-Search Rule

Codex must not:

- scan ports 3000–3020;
- create alternate MCP server keys per project;
- add another `blockbench_*` connection;
- repeatedly initialize smoke sessions;
- initialize a new write session for each stage;
- inspect every MCP tool before each stage;
- infer the project from an old Markdown file;
- continue when the actual URL differs from the canonical URL.

## Failure Handling

### Codex config missing or changed

```text
INSTALL_AND_RESTART_CODEX
```

Run the sync script with `-InstallCodexConfig`, restart Codex once, and rerun the normal asset readiness check.

### Blockbench not running

```text
BLOCKER: BLOCKBENCH_NOT_RUNNING
Safe action: launch one Blockbench window.
```

### Plugin or endpoint unavailable

```text
BLOCKER: MCP_ENDPOINT_UNAVAILABLE
Safe action: build/reload the Rework plugin and verify local network permission.
```

### Port or endpoint mismatch

```text
BLOCKER: CONNECTION_CONTRACT_MISMATCH
Safe action: ensure the current Rework build owns port 3000 and /bb-mcp.
```

### Multiple Blockbench windows

```text
BLOCKER: MULTIPLE_BLOCKBENCH_INSTANCES
Safe action: keep only the intended project window open.
```

### Required tool missing

```text
BLOCKER: MCP_CAPABILITY_MISMATCH
Safe action: rebuild/reload the Rework plugin; do not use a risky workaround.
```

### Multiple write sessions

```text
BLOCKER: MULTIPLE_MCP_WRITE_SESSIONS
Safe action: close stale MCP clients so only the intended Codex session remains.
```

## Session Rule

The readiness script uses a temporary read-only smoke session and closes it before returning.

The actual Codex MCP session is created through the canonical `blockbench` entry and becomes the single write session recorded in `state.json`.

Do not store the smoke-session ID as the Codex write-session ID.

## Acceptance Criteria

Connection readiness is `PASS` only when:

- exactly one visible Blockbench application window is running;
- the current Rework MCP plugin listens at the canonical URL;
- auto-port fallback is not active;
- Codex has only the canonical Blockbench MCP key and URL;
- the common workflow tools exist;
- the intended Blockbench project is open and identifiable;
- the temporary smoke session is closed;
- no more than one non-readiness/write session remains;
- no connection blocker remains.
