## BlockIT — Bedrock Entity MCP

BlockIT connects AI-assisted Minecraft Bedrock Entity modelling to desktop Blockbench.

### What it provides

- Geometry, rig, locator, and UV authoring
- Texture Atlas, Painter, PBR, and material workflows
- Bedrock animation and controller workflows
- Phase-scoped MCP tools for focused agent decisions

### Runtime

BlockIT runs locally inside Blockbench and exposes:

`http://127.0.0.1:3000/bb-mcp`

Only the active authoring phase is exposed at a time. A phase handoff requires selecting the target MCP Authoring Phase, reloading/restarting BlockIT MCP, and reconnecting the MCP client before continuing.

### Important

Tool success does not prove visual fidelity. Use canonical model views and human review for reference-based modelling.

Source and issue tracker: https://github.com/halokaryamedia-source/BuildIT
