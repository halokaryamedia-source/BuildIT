/// <reference types="three" />
/// <reference types="blockbench-types" />
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRODUCT_NAME, PRODUCT_VERSION } from "@/lib/productIdentity";

/** Create one request-owned MCP server instance. */
export function createServer(): McpServer {
  return new McpServer({
    name: PRODUCT_NAME,
    version: PRODUCT_VERSION,
  });
}
