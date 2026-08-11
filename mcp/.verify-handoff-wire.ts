import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { registerToolsOnServer } from "./lib/factories";
import "./server/tools";

const server = new McpServer({ name: "handoff-check", version: "1" });
registerToolsOnServer(server);
const transport = new WebStandardStreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
  enableJsonResponse: true,
});
await server.connect(transport);

try {
  const response = await transport.handleRequest(
    new Request("http://127.0.0.1:3000/bb-mcp", {
      method: "POST",
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json",
        "mcp-protocol-version": "2025-06-18",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      }),
    })
  );
  const raw = await response.text();
  const parsed = JSON.parse(raw) as {
    result?: {
      tools?: Array<{
        name?: string;
        description?: string;
        inputSchema?: unknown;
      }>;
    };
  };
  const tools = parsed.result?.tools ?? [];
  const names = tools.map((tool) => tool.name ?? "");
  const metrics = {
    tools: tools.length,
    response: raw.length,
    schemas: tools.reduce(
      (total, tool) => total + JSON.stringify(tool.inputSchema ?? {}).length,
      0
    ),
    descriptions: tools.reduce(
      (total, tool) => total + (tool.description ?? "").length,
      0
    ),
  };
  const expected = {
    tools: 62,
    response: 72775,
    schemas: 48674,
    descriptions: 11800,
  };
  if (JSON.stringify(metrics) !== JSON.stringify(expected)) {
    throw new Error(`wire changed during handoff: ${JSON.stringify(metrics)}`);
  }
  if (
    !names.includes("export_model") ||
    names.includes("list_export_formats") ||
    names.includes("apply_texture") ||
    names.includes("filter_by_material")
  ) {
    throw new Error("default containment changed during handoff");
  }
  console.log(metrics);
} finally {
  await server.close();
}
