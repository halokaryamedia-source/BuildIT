# BuildIT MCP Server

BuildIT MCP Server is the Blockbench desktop bridge for BuildIT's local production workflow. It exposes structured MCP tools for project inspection, cuboid geometry, texture and UV work, animation, evidence capture, checkpointing, validation, and controlled export.

The plugin uses one deterministic local endpoint at `http://localhost:3000/bb-mcp`, keeps automatic port fallback disabled, and supports the Geometry, Texture, optional Animation, and Final Validation stages used by Codex and other MCP-compatible clients.

Plugin identity:

- Title: `BuildIT MCP Server`
- Author: `MIVUBI`
- Version: `1.6.3`
- Plugin ID: `mcp`
- Canonical bundle: `mcp-blockbench/dist/mcp.js`
- Upstream foundation: `achmadawdi/mcp-blockbench`
