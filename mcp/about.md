## BlockIT — Bedrock Entity MCP

BlockIT provides a Minecraft **Bedrock Entity-focused** Model Context Protocol server inside desktop Blockbench.

### Default endpoint

`http://127.0.0.1:3000/bb-mcp`

The default transport is loopback-only, stateless Streamable HTTP with JSON responses. The BlockIT panel shows the loaded version, active profile, endpoint, transport, and truthful exposed surface counts.

### Product boundary

The normal profile is `bedrock_entity`. It preserves capability that genuinely belongs to Minecraft Bedrock Entity while broad generic Blockbench fallback families are not exposed by default. Native Bedrock capability is not removed merely to minimize the surface.

The panel distinguishes exposed tools/prompts from disabled catalog entries, and disabled definitions cannot be executed through the panel's Tool Test path.

### Local development builds

For this stabilization line, build `halokaryamedia-source/BuildIT` branch `Local` and load the generated `mcp/dist/mcp.js`. Do not use the upstream hosted plugin URL as evidence for BlockIT runtime behavior; it is a different artifact/product surface.

### Expectations

AI-assisted modeling remains human-in-the-loop. Tool success, valid coordinates, a validator pass, or a screenshot call succeeding are not proof that a model visually matches its reference. BlockIT's Bedrock workflow uses explicit inspection, bounded corrections, canonical views, and fresh visual comparison.

### Upstream attribution

This implementation is derived from Jason J. Gardner's open-source Blockbench MCP project and retains upstream attribution/license information while presenting a distinct BlockIT Bedrock Entity product identity.
