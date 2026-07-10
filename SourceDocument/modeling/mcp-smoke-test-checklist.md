# MCP Connection Readiness

Normal local work must not search for ports, endpoints, project windows, or alternate MCP server keys.

Authority:

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/connection-profile.json
```

## Canonical Stack

```text
Codex MCP key: blockbench
URL: http://localhost:3000/bb-mcp
Blockbench plugin: MCP Server (`mcp`)
Blockbench instances: exactly one
Active Codex write session: exactly one
```

## First-Time Setup

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -InstallCodexConfig
```

Restart Codex once if the script changes `~/.codex/config.toml` or `$CODEX_HOME/config.toml`.

## Normal Asset Check

Open the intended Blockbench project, then run:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/sync-local-stack.ps1 -Asset <asset>
```

Read:

```text
SavedData/sessions/<asset>/reports/connection.json
```

Continue only when:

```text
result: PASS
```

## What the Script Proves

- Codex has exactly one canonical `mcp_servers.blockbench` entry;
- one Blockbench process is running;
- port 3000 is reachable;
- MCP initialize succeeds;
- a temporary smoke session is created and closed;
- required common tools are present;
- `get_runtime_status` confirms the actual URL and active project;
- project name, UUID, format, UV mode, and texture size are recorded;
- `state.json` receives the connection report and project identity.

## Codex Live Confirmation

After Codex connects through the canonical MCP entry, call once:

```text
get_runtime_status
```

Do not run separate connection discovery when this result is `PASS`.

## Required Common Tools

```text
get_runtime_status
get_project_info
save_project_checkpoint
capture_standard_views
```

Stage-specific tools are checked through `Engine/codex/stage-profiles.json` during the one-time asset preflight.

## No-Search Rule

Do not:

- scan ports;
- add project-specific `blockbench_*` MCP keys;
- create multiple smoke sessions;
- initialize a new session for every stage;
- list every tool repeatedly;
- infer the active project from legacy session Markdown;
- continue on a fallback port.

## Results

### PASS

```text
Connection: PASS
Canonical URL: http://localhost:3000/bb-mcp
Project UUID: <uuid>
Next action: run the asset preflight once
```

### RESTART_REQUIRED

```text
Codex config was installed or changed.
Restart Codex once and rerun the normal asset check.
```

### BLOCKER

Use the first blocker and exact safe action from `connection.json`. Do not try alternate endpoints or risky fallbacks.

## Acceptance Criteria

- Codex, Blockbench MCP, and the active Blockbench project share one recorded connection identity.
- The readiness check is one command and one report.
- The transient smoke session is cleaned up.
- No MCP write occurs before connection readiness is `PASS`.
