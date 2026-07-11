# Shared Skill Registry

This directory is the single canonical source for production skills and external skill metadata.

## Production Skills

```text
blockbench-production
blockbench-geometry
blockbench-texture
blockbench-animation
blockbench-validation
```

Exactly one stage skill is loaded together with `blockbench-production`. Maximum production skills loaded at once: `2`.

Machine authority:

```text
skill-profiles.json
```

Host-native adapters remain at repository root for discovery:

```text
.agents/skills/
.codex/skills/
```

They are generated copies, not editable authorities.

Synchronize or verify them from `mcp-blockbench/`:

```powershell
bun run skills:sync
bun run skills:check
```

`skills-lock.json` tracks external skill dependencies only. Do not create versioned lock files or edit the same production skill in multiple locations.
