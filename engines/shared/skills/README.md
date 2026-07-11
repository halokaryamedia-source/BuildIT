# Shared Skill Registry

`skills-lock.json` is the single shared registry for externally sourced Blockbench skills.

Tool-native folders remain at repository root for host discovery:

```text
.agents/skills/
.codex/skills/
```

Those folders may also contain host-specific skills. Shared skill metadata must not be duplicated into versioned lock files such as `skills-lock-v2.json` or `skills-lock-latest.json`.

When shared skill synchronization is automated, it must read this single lock file and update only the required host-native destinations.
