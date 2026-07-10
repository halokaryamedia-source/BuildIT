# MCP Tool Profile Contract

## Goal

Keep the full MCP capability library available in the plugin while exposing only the smallest exact tool set required by the active Codex stage.

Machine-readable authority:

```text
Engine/codex/tool-profiles.json
```

Runtime implementation:

```text
src/lib/toolProfiles.ts
src/server/tools/runtime.ts
```

## Core Rule

```text
Full capability library
→ exact active profile
→ reduced tools/list response after reconnect
→ call-time rejection outside the active profile
```

Tools are not deleted from the codebase. They are hidden and blocked unless the active profile explicitly allows them.

## Default Profile

```text
BEDROCK_CUBOID_GEOMETRY
```

This permits a current-format Bedrock cuboid asset to start Geometry immediately after connection readiness.

## Stage Mapping

```text
GEOMETRY         → BEDROCK_CUBOID_GEOMETRY
TEXTURE          → BEDROCK_CUBOID_TEXTURE
ANIMATION        → BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION → FINAL_VALIDATION_READONLY
```

Revision mapping:

```text
Geometry revision  → GEOMETRY_LOCAL_REPAIR
Texture revision   → TEXTURE_LOCAL_REPAIR
Animation revision → ANIMATION_LOCAL_REPAIR
```

`DIAGNOSTIC_ESCALATION` is never used for normal stage work.

## Runtime Controls

Always-exposed control tools:

```text
get_runtime_status
get_project_info
get_tool_profile
activate_tool_profile
```

`get_tool_profile` returns:

- active profile ID;
- profile revision;
- exposed count;
- total library count;
- deterministic profile hash;
- optional exact exposed names;
- configuration validation errors.

`activate_tool_profile`:

1. validates the exact profile ID;
2. applies the new allowlist immediately;
3. blocks calls outside the new profile immediately;
4. returns `reconnect_required: true` when the profile changed.

## Reconnect Rule

After a profile change:

```text
activate_tool_profile
→ reconnect the existing canonical `blockbench` MCP entry once
→ continue stage work
```

Do not:

- create another MCP server key;
- scan another port;
- restart Blockbench;
- restart Codex unless its client cannot reconnect the existing server;
- reconnect after every edit.

Reconnect only on a real profile transition.

## Exposure and Enforcement

### Future sessions

The plugin updates each tool's enabled exposure before a new MCP session is built. The next session receives only the core tools plus the active exact allowlist.

### Existing session

Execution guards check the active profile on every network-session tool call. A stale tool that remains visible in the client after profile activation returns:

```text
TOOL_PROFILE_BLOCKED
```

The safe action is one reconnect to refresh the reduced list.

## Normal Workflow Exclusions

The following capabilities are not exposed in normal Bedrock cuboid profiles:

- PBR materials and texture sets;
- Hytale-specific tools;
- mesh UV tools;
- armature and vertex-weight tools;
- UI clicking and dialog automation;
- `risky_eval`;
- broad final export during Geometry/Texture/Animation;
- speculative tools unrelated to the active stage.

## Texture Rules

`BEDROCK_CUBOID_TEXTURE` uses:

```text
set_cube_face_uv
get_uv_layout
```

It does not expose mesh UV or PBR tools.

Smooth gradient tooling is not part of the default profile because the approved pipeline prefers pixel-stepped shading. It may be added only through a reviewed profile change when a reference package requires it.

## Animation Rules

`BEDROCK_CUBOID_ANIMATION` uses Blockbench group/bone animation tools.

It does not expose mesh armatures or vertex weights. Those require an explicitly approved non-cuboid profile in a future OpenSpec change.

## Final Validation Rules

`FINAL_VALIDATION_READONLY` is read-mostly. It can:

- inspect project, outline, textures, and UV;
- capture standard views;
- save checkpoints;
- list/export final formats.

It cannot silently modify Geometry, Texture, or Animation. A failed check activates the matching local-repair profile and routes back to the relevant stage.

## Diagnostic Escalation

Activate `DIAGNOSTIC_ESCALATION` only when all are recorded:

```text
Blocker:
Why native stage tools cannot solve it:
Allowed high-risk tool:
Rollback checkpoint:
Verification:
Stop condition:
```

Return to the correct normal or repair profile immediately after resolving the blocker.

## State Synchronization

`state.json` records:

```text
active_tool_profile
tool_profile_revision
tool_profile_hash
exposed_tool_count
total_library_tool_count
profile_reconnect_required
```

The runtime value returned by `get_runtime_status` is authoritative. If state and runtime differ, update state; do not invent another connection.

## Acceptance Criteria

- normal `tools/list` is reduced to the active exact profile;
- PBR, Hytale, mesh UV, armature, UI automation, and eval are absent from normal profiles;
- calls outside the active profile fail at runtime;
- profile changes require at most one deterministic reconnect;
- runtime status exposes profile ID, count, and hash;
- stage and repair profiles use exact allowlists, not broad domains;
- the complete capability library remains available only through recorded diagnostic escalation.
