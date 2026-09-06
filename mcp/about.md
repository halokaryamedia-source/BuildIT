## BlockIT — Bedrock Entity MCP

BlockIT connects AI-assisted Minecraft Bedrock Entity authoring to desktop Blockbench through the stable BlockIT Gateway.

### What it provides

- Geometry, rig, locator, and UV Layout authoring
- Texture Atlas, Painter, PBR, and material workflows
- Bedrock animation and controller workflows
- Explicit stage approval with fail-closed proof boundaries

### Runtime

BlockIT Runtime runs locally inside desktop Blockbench at:

`http://127.0.0.1:3000/bb-mcp`

Normal AI clients connect through the BlockIT Gateway, whose client-facing surface remains `status`, `search_capabilities`, `describe_capability`, and `invoke_capability`.

Geometry and Texturing use the same shared AUTHORING Runtime surface. Geometry↔Texturing correction stays in-session and does not require `switch_authoring_phase`.

AUTHORING↔Animation uses `switch_authoring_phase` through the Gateway. The Gateway invalidates and refreshes its Runtime catalog automatically; normal AI-client use continues the same task/chat without a manual MCP reconnect.

### Important

Tool success, coordinates, validators, exports, or source/CI success do not prove visual fidelity. Reference-driven PASS requires the actual approved reference plus fresh comparable model evidence, and user stage approval remains explicit.

Source and issue tracker: https://github.com/halokaryamedia-source/BuildIT
