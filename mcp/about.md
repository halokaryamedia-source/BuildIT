## BlockIT — Bedrock Entity MCP

BlockIT brings AI-assisted Minecraft Bedrock Entity authoring into desktop Blockbench.

### Authoring

- Geometry, rig, locator, and UV workflows
- Texturing, Painter, PBR, and materials
- Animation and controller workflows
- Explicit stage approval for reference-based work

### Connection

BlockIT Runtime runs locally inside desktop Blockbench at:

`http://127.0.0.1:3000/bb-mcp`

Normal AI clients connect through the stable BlockIT Gateway. Geometry and Texturing use one shared AUTHORING Runtime surface, while AUTHORING↔Animation handoff is handled through the Gateway without requiring a new task/chat or routine manual reconnect.

### Visual approval

Reference-based work uses the approved reference plus current comparable model views. Tool execution and technical validation are execution evidence, not visual acceptance.

Source and issue tracker: https://github.com/halokaryamedia-source/BuildIT
