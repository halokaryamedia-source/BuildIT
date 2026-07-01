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

interface JsonRpcErrorPayload {
  code?: number;
  message?: string;
  data?: unknown;
}

interface JsonRpcResponse<T> {
  jsonrpc?: string;
  id?: number | string | null;
  result?: T;
  error?: JsonRpcErrorPayload;
}

interface McpToolsListResult {
  tools?: unknown;
}

interface McpToolCallResult {
  content?: unknown;
  structuredContent?: unknown;
  isError?: boolean;
  [key: string]: unknown;
}

export class BlockbenchMcpError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly data?: unknown
  ) {
    super(message);
  }
}

function getJsonRpcErrorMessage(error: JsonRpcErrorPayload): string {
  const message = typeof error.message === "string" && error.message.length > 0 ? error.message : "Unknown JSON-RPC error.";
  return typeof error.code === "number" ? message + " (code " + error.code + ")" : message;
}

function isToolDefinition(value: unknown): value is McpToolDefinition {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<McpToolDefinition>;
  return typeof candidate.name === "string" && candidate.name.length > 0;
}

function parseToolDefinitions(value: unknown): McpToolDefinition[] {
  if (!Array.isArray(value)) {
    throw new Error("Blockbench MCP tools/list result did not include a tools array.");
  }

  return value.filter(isToolDefinition);
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

  private async request<T>(method: string, params: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.options.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params
      })
    });

    if (!response.ok) {
      throw new Error("Blockbench MCP " + method + " failed with HTTP status " + response.status + ".");
    }

    const data = (await response.json()) as JsonRpcResponse<T>;

    if (data.error) {
      throw new BlockbenchMcpError(getJsonRpcErrorMessage(data.error), data.error.code, data.error.data);
    }

    if (data.result === undefined) {
      throw new Error("Blockbench MCP " + method + " returned no JSON-RPC result.");
    }

    return data.result;
  }

  async listTools(): Promise<McpToolDefinition[]> {
    const result = await this.request<McpToolsListResult>("tools/list", {});
    return parseToolDefinitions(result.tools);
  }

  async callTool(call: McpToolCall): Promise<McpToolCallResult> {
    const result = await this.request<McpToolCallResult>("tools/call", {
      name: call.name,
      arguments: call.arguments
    });

    if (result.isError) {
      throw new Error("Blockbench MCP tool returned an error result: " + call.name + ".");
    }

    return result;
  }
}
