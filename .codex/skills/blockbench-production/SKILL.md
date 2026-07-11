---
name: blockbench-production
description: "Mandatory dispatcher for approved Blockbench asset production. Reads the active workflow state, selects exactly one stage skill, enforces the matching MCP tool profile, and stops at the stage review gate. Do not use for MCP repository development."
---

# Blockbench Production

Read `state.json`, resolve `engines/shared/skills/skill-profiles.json`, verify the matching exact MCP profile, and load exactly one stage skill. Maximum production skills loaded: two.

```text
GEOMETRY → blockbench-geometry
TEXTURE → blockbench-texture
ANIMATION → blockbench-animation when required
FINAL_VALIDATION → blockbench-validation
```

Reuse fresh readiness, avoid repeated discovery, use only exposed tools, capture evidence only at review milestones, preserve accepted areas, and stop on review, blocker, or conflict. Do not use this skill for MCP repository development.
