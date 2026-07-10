# MCP Connection and Tool Profile Readiness

Normal local work must not search for ports, endpoints, project windows, alternate MCP keys, or unrelated tools.

Authority:

```text
Engine/codex/CONNECTION_CONTRACT.md
Engine/codex/connection-profile.json
Engine/codex/TOOL_PROFILE_CONTRACT.md
Engine/codex/tool-profiles.json
```

## Canonical Stack

```text
Codex MCP key: blockbench
URL: http://localhost:3000/bb-mcp
Blockbench plugin: MCP Server (`mcp`)
Blockbench windows: exactly one
Active Codex write session: at most one before connection, exactly one during work
Tool exposure: exact active stage/repair profile
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
- one visible Blockbench window is running;
- port 3000 is reachable;
- MCP initialize succeeds;
- a temporary readiness session is created and closed;
- required core workflow tools are present;
- the runtime tool profile matches `state.json` or is aligned before Codex connects;
- profile validation has no error;
- `get_runtime_status` confirms URL, project, and exact tool profile;
- project name, UUID, format, UV mode, and texture size are recorded;
- profile ID, revision, hash, exposed count, and total count are recorded;
- `state.json` receives the verified connection/project/profile identity.

## Codex Live Confirmation

After Codex connects through the canonical MCP entry, call once:

```text
get_runtime_status
```

Expected profile proof:

```text
tool_profile.profile_id
tool_profile.profile_revision
tool_profile.exposed_tool_count
tool_profile.total_library_tool_count
tool_profile.tool_profile_hash
tool_profile.validation_errors: []
```

Do not run separate discovery when this result is `PASS`.

## Required Core Workflow Tools

```text
get_runtime_status
get_project_info
get_tool_profile
activate_tool_profile
save_project_checkpoint
capture_standard_views
```

Only core plus the exact active profile should appear in `tools/list`.

## Stage Transition

At a real stage or repair transition:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/set-tool-profile.ps1 -Asset <asset>
```

Or provide an explicit approved profile:

```powershell
powershell -ExecutionPolicy Bypass -File Engine/codex/scripts/set-tool-profile.ps1 -Asset <asset> -Profile BEDROCK_CUBOID_TEXTURE
```

When the report says the profile changed:

1. reconnect the existing canonical `blockbench` entry once;
2. call `get_runtime_status` once;
3. verify profile ID/hash/count;
4. clear `profile_reconnect_required` in state;
5. continue the stage.

Do not reconnect for normal edits.

## No-Search and No-Bypass Rule

Do not:

- scan ports;
- add project-specific `blockbench_*` keys;
- create repeated readiness sessions;
- initialize a new session for every edit;
- list the complete tool library repeatedly;
- infer the project/profile from legacy Markdown;
- continue on a fallback port;
- bypass `TOOL_PROFILE_BLOCKED` using eval or UI automation;
- activate `DIAGNOSTIC_ESCALATION` without a recorded blocker and rollback checkpoint.

## Results

### PASS

```text
Connection: PASS
Canonical URL: http://localhost:3000/bb-mcp
Project UUID: <uuid>
Tool Profile: <exact profile>
Exposed Tools: <count>
Profile Hash: <hash>
Next action: run or continue the active stage
```

### RESTART_REQUIRED

```text
Codex config was installed or changed.
Restart Codex once and rerun the normal asset check.
```

### BLOCKER

Use the first blocker and exact safe action from `connection.json`. Do not try alternate endpoints, unrelated tools, or risky fallbacks.

## Acceptance Criteria

- Codex, Blockbench MCP, and the active Blockbench project share one recorded connection identity.
- The readiness check is one command and one report.
- The transient readiness session is cleaned up.
- The exact profile is recorded and enforced.
- Normal `tools/list` is substantially smaller than the full capability library.
- No MCP write occurs before connection and profile readiness are `PASS`.
