# Reference Generator Current Route

Date: 2026-08-13  
Status: current decision

This decision supersedes the 2026-08-08 foundation-only/no-root-skill Reference Generator decision.

Current authority:

```text
source image / user intent
→ .agents/skills/blockbench-reference-generator/SKILL.md
→ one buildable Minecraft / Blockbench multi-view Modelling Brief image
→ maximum one targeted correction
→ user approval
→ actual approved image supplied to blockbench-bedrock-modelling
```

`docs/foundation/04-reference-guide.md` remains the durable policy owner. The repository skill is an image-capable pre-modelling route only; it does not call BlockIT MCP, create geometry, emit ZIP/manifest/production packages, or use numeric fidelity scoring.

The old decision remains useful as historical rationale for keeping reference generation separate from MCP/Codex geometry authoring, but its conclusion that root skill discovery must exclude Reference Generator is no longer current.
