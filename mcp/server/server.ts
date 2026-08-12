/// <reference types="three" />
/// <reference types="blockbench-types" />
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRODUCT_NAME, PRODUCT_VERSION } from "@/lib/productIdentity";

/**
 * Compact server-level description used by MCP clients as namespace context.
 * Keep this capability-oriented and searchable; detailed workflow guidance
 * belongs in the dedicated runtime prompt rather than the initialization path.
 */
export const MCP_SERVER_INSTRUCTIONS =
  "BlockIT Bedrock Entity authoring for Blockbench: project lifecycle; Cube/Group geometry; focused inspection and model bounds/views; textures, Painter, PBR, material instances; animation, rigging, keyframes; Locator/Null Object; history/Undo/Redo; and Bedrock/.bbmodel export. Prefer the smallest matching tool for the current step, and reuse fresh returned state before broad discovery.";

/** Create one request-owned MCP server instance. */
export function createServer(): McpServer {
  return new McpServer(
    {
      name: PRODUCT_NAME,
      version: PRODUCT_VERSION,
    },
    {
      instructions: MCP_SERVER_INSTRUCTIONS,
    }
  );
}
