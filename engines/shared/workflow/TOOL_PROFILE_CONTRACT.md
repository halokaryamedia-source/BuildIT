# MCP Tool Profile Contract

Authority: `engines/shared/profiles/tool-profiles.json`.

## Stable Registered Surface

Every canonical MCP session registers one stable full tool library for the lifetime of the loaded plugin. A stage/profile transition MUST NOT require an MCP reconnect, plugin reload, or new Codex session.

The registered surface is not permission authority. The active logical profile remains the execution authority:

- calls outside the active profile fail with `TOOL_PROFILE_BLOCKED`;
- cross-stage arguments fail with `TOOL_PROFILE_ARGUMENT_BLOCKED`;
- persistent writes require the one current project write lease;
- agent-specific MCP allowlists still narrow specialist access.

PBR, Hytale, mesh UV, armature/vertex weights, UI automation, eval, and other unrelated capabilities remain unavailable to normal production because the execution guard rejects them, even though the protocol-level tool list is stable.

## Profile Transition

```text
complete or reopen stage
→ activate logical profile in memory
→ release previous write lease
→ continue in the same MCP session
→ continue in the same Codex session
→ call get_stage_context
→ acquire a fresh current-stage write lease
```

`reconnect_required`, `profile_reconnect_required`, and `user_restart_required` MUST remain `false`. A profile hash/revision change still invalidates the previous lease; this is a lease reacquisition requirement, not a client reconnection requirement.

## Plugin Reload

Reload the plugin only when installing a newly built binary. Normal production, revisions, approvals, profile changes, and stage transitions MUST NOT reload the plugin.
