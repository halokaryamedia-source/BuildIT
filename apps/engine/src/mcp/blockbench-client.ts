export interface McpToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface McpToolDefinition {
  name: string;
  description?: string;
  inputSchema?: unknown;
}

export interface BlockbenchClientOptions {
  endpoint: string;
}

interface McpToolsListResponse {
  result?: {
    tools?: McpToolDefinition[];
  };
}

export class BlockbenchMcpClient {
  constructor(private readonly options: BlockbenchClientOptions) {}

  async health(): Promise<boolean> {
    try {
      const response = await fetch(this.options.endpoint.replace(/\/bb-mcp$/, "/health"));
      return response.ok;
    } catch {
      return false;
    }
  }

  async listTools(): Promise<McpToolDefinition[]> {
    const response = await fetch(this.options.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/list",
        params: {}
      })
    });

    if (!response.ok) {
      throw new Error("Blockbench MCP tools/list failed with status " + response.status);
    }

    const data = (await response.json()) as McpToolsListResponse;
    return data.result?.tools ?? [];
  }

  async callTool(call: McpToolCall): Promise<unknown> {
    const response = await fetch(this.options.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: call.name,
          arguments: call.arguments
        }
      })
    });

    if (!response.ok) {
      throw new Error("Blockbench MCP request failed with status " + response.status);
    }

    return response.json();
  }
}
