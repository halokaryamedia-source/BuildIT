# MCP Tool Profile Contract

Machine-readable authority: `engines/shared/profiles/tool-profiles.json`.

## Stable production union

Every canonical MCP session exposes one stable **production union** for the lifetime of the loaded plugin. A Stage/profile transition does not require an MCP reconnect, plugin reload, or new Codex session.

The registered production union is not permission authority. The active logical profile remains the execution guard:

- calls outside the active profile fail with `TOOL_PROFILE_BLOCKED`;
- cross-Stage arguments fail with `TOOL_PROFILE_ARGUMENT_BLOCKED`;
- persistent writes require current Writer ownership prepared by the runtime;
- agent-specific MCP allowlists further narrow specialist access;
- diagnostic-only and unrelated library tools are not part of the normal public production union.

PBR, Hytale, mesh UV, armature/vertex weights, UI automation, eval, manual lease/profile coordination, and unrelated capabilities remain unavailable to normal production.

## Profile transition

```text
complete or reopen Stage
→ activate logical profile in memory
→ release previous Writer ownership
→ continue in the same MCP session
→ continue in the same Codex session
→ call get_stage_context once
→ next mutating call prepares current-Stage ownership automatically
```

`reconnect_required`, `profile_reconnect_required`, and `user_restart_required` remain `false`. A profile hash/revision change invalidates prior ownership internally; the caller does not manually reacquire a lease.

## Public versus diagnostic surface

Normal production callers use the stable production union. Manual profile activation, project-identity rebind, and write-lease management remain registered only as diagnostic recovery capabilities where configured. A cached client cannot use them through a normal Stage profile.

## Plugin reload

Reload the plugin only when installing a newly built binary. Normal production, revisions, approvals, profile changes, and Stage transitions do not reload the plugin.
