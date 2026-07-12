# MCP Tool Profile Specification

## Stable Registration

The full MCP capability library SHALL remain registered for the lifetime of the loaded plugin. Geometry, Texture, optional Animation, Final Validation, approval, and revision transitions SHALL continue through the same MCP session and the same Codex session.

A logical profile change SHALL NOT require:

- MCP reconnect;
- plugin reload;
- new Codex session;
- user-managed capability selection.

Core tools SHALL remain callable for runtime/project/profile inspection. Logical stage profiles SHALL be:

```text
BEDROCK_CUBOID_GEOMETRY
BEDROCK_CUBOID_TEXTURE
BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION_READONLY
```

Targeted revisions SHALL use the matching canonical stage profile. Geometry revision scopes SHALL remain internal scopes, not separate registered surfaces.

## Enforcement

Stable registration SHALL NOT weaken permissions. Calls outside the active logical profile SHALL fail with `TOOL_PROFILE_BLOCKED`. Cross-stage arguments SHALL fail with `TOOL_PROFILE_ARGUMENT_BLOCKED`. Persistent mutations SHALL require the single project write lease. Specialist agents SHALL retain their own MCP disablement or allowlists.

Normal production SHALL continue to reject PBR, Hytale, mesh UV, armature/vertex-weight, UI automation, eval, and unrelated capabilities through execution-time profile guards.

## Transition Result

Every successful profile transition SHALL report:

```text
reconnect_required = false
current_session_continues = true
stable_tool_surface = true
```

The previous write lease SHALL be released. Codex SHALL call `get_stage_context` and acquire a fresh current-stage lease without reconnecting.

## User Acceptance Boundary

Internal capability, identity, lease, profile, build, and session checks SHALL be automated before user acceptance. The user SHALL receive only one final end-to-end test: create a new asset workspace from the tracked Black Rhinoceros Golden Sample without copying a prebuilt model, then build the model from zero through the normal production flow.
