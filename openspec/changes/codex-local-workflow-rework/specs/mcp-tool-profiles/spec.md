# MCP Tool Profile Specification

## Exact Exposure

The full MCP capability library MAY remain registered internally, but normal sessions SHALL expose only the exact active profile from `engines/shared/profiles/tool-profiles.json`.

Core tools SHALL remain available for runtime/project/profile inspection. Stage profiles SHALL be:

```text
BEDROCK_CUBOID_GEOMETRY
BEDROCK_CUBOID_TEXTURE
BEDROCK_CUBOID_ANIMATION
FINAL_VALIDATION_READONLY
```

Targeted revisions SHALL use matching local-repair profiles.

## Enforcement

Calls outside the active profile SHALL fail with `TOOL_PROFILE_BLOCKED`. Cross-stage arguments SHALL fail with `TOOL_PROFILE_ARGUMENT_BLOCKED`.

Normal profiles SHALL hide PBR, Hytale, mesh UV, armature/vertex-weight, UI automation, and eval capabilities.

A real profile transition SHALL activate the next profile, reconnect the existing canonical MCP entry once, and verify profile ID/hash/count. Normal edits SHALL NOT reconnect.
