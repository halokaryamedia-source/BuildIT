# MCP Tool Profile Contract

Authority: `engines/shared/profiles/tool-profiles.json`.

Normal stage profiles expose only exact allowlists. PBR, Hytale, mesh UV, armature/vertex weights, UI automation, and eval stay hidden. Calls outside the active profile fail with `TOOL_PROFILE_BLOCKED`; cross-stage arguments fail with `TOOL_PROFILE_ARGUMENT_BLOCKED`.

Profile changes happen only at real stage transitions:

```text
activate profile
→ reconnect existing blockbench MCP entry once
→ get_runtime_status once
→ verify profile ID, hash, and count
```

Do not reconnect after normal edits. Diagnostic escalation requires a recorded blocker and rollback plan.
