# Installed BlockIT authoring workspace

This workspace contains user assets and a managed BlockIT skill package, not the MCP development repository. Do not scan Runtime source, run build/test/deploy, or ask the user to replace installation files during authoring.

Before any asset mutation, load `.agents/skills/blockit-bedrock-entity-mcp/SKILL.md` and exactly the current specialist:
- Geometry, hierarchy, rig or UV: `.agents/skills/blockbench-bedrock-modelling/SKILL.md`.
- Texture, pixels or PBR: `.agents/skills/blockit-bedrock-texturing/SKILL.md`.
- Animation: `.agents/skills/blockit-bedrock-animation/SKILL.md`.

Use `workspace/active/<asset>/` for asset continuity and `workspace/README.md` for workspace conventions. Actual approved image, dimensions, user-selected `DIRECT | 3D_ASSISTED`, and Animation Required remain intake requirements. Geometry approval precedes production UV; UV PASS precedes Texturing; approved Texturing and a checkpoint precede optional Animation. Follow the specialist's quality and approval gates.

Known capability → direct invocation through the existing four-tool Gateway. Discovery is conditional; no status polling or confirmation rereads. Never guess unavailable tool schemas or bypass permissions through eval/UI automation. Installed distribution does not by itself install optional 3D_ASSISTED GPU providers; a missing external backend is a setup blocker, not permission to switch strategy.

Load `docs/foundation/09-finalization-standard.md` only during Finalization. Application update/rollback never restores or deletes user models.

For an explicit maintenance request, run the installed `blockit.cmd update`, `status`, `rollback`, or `recover` command using the normal approved terminal. Do not edit binaries, plugin files, skills, or Codex TOML by hand. Active sessions keep their current package; a staged update activates only at a safe boundary. Native plugin trust and application permissions are never bypassed.
