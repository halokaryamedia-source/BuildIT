import "@/server/tools";
import { createServer as createTcpServer, type AddressInfo } from "node:net";
import createNetServer, { type NetServer } from "@/server/net";

const HOST = "127.0.0.1";
const ENDPOINT = "/bb-mcp";
const PROTOCOL_VERSION = "2025-06-18";

type ListedTool = {
  name?: string;
  description?: string;
  inputSchema?: unknown;
  [key: string]: unknown;
};

type JsonRpcBody = {
  result?: {
    protocolVersion?: string;
    tools?: ListedTool[];
  };
  error?: {
    message?: string;
  };
};

function percentile(values: number[], fraction: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.ceil(fraction * sorted.length) - 1);
  return sorted[index] ?? 0;
}

async function postMcp(
  baseUrl: string,
  body: unknown,
  protocolVersion = false
): Promise<{ response: Response; text: string; json: JsonRpcBody }> {
  const headers = new Headers({
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    connection: "close",
  });
  if (protocolVersion) {
    headers.set("mcp-protocol-version", PROTOCOL_VERSION);
  }

  const response = await fetch(`${baseUrl}${ENDPOINT}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const json = JSON.parse(text) as JsonRpcBody;
  return { response, text, json };
}

async function main(): Promise<void> {
  const server = createNetServer(
    {
      createServer: (callback) => createTcpServer(callback),
    },
    {
      port: 0,
      endpoint: ENDPOINT,
      host: HOST,
    }
  );

  try {
    if (!server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
      });
    }

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected an IPv4 TCP listener for MCP surface measurement.");
    }
    const tcpAddress = address as AddressInfo;
    const baseUrl = `http://${HOST}:${tcpAddress.port}`;

    const initialized = await postMcp(baseUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: "blockit-surface-measurement", version: "1.0.0" },
      },
    });
    if (initialized.response.status !== 200) {
      throw new Error(
        `MCP initialize failed (${initialized.response.status}): ${initialized.text}`
      );
    }
    if (initialized.json.result?.protocolVersion !== PROTOCOL_VERSION) {
      throw new Error(
        `Unexpected MCP protocol version: ${initialized.json.result?.protocolVersion ?? "missing"}`
      );
    }

    const listed = await postMcp(
      baseUrl,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      },
      true
    );
    if (listed.response.status !== 200) {
      throw new Error(
        `MCP tools/list failed (${listed.response.status}): ${listed.text}`
      );
    }
    if (listed.json.error) {
      throw new Error(`MCP tools/list error: ${listed.json.error.message ?? "unknown"}`);
    }

    const tools = listed.json.result?.tools ?? [];
    const rows = tools.map((tool) => {
      const payloadChars = JSON.stringify(tool).length;
      const inputSchemaChars = JSON.stringify(tool.inputSchema ?? {}).length;
      const descriptionChars = tool.description?.length ?? 0;
      return {
        name: tool.name ?? "<unnamed>",
        payload_chars: payloadChars,
        input_schema_chars: inputSchemaChars,
        description_chars: descriptionChars,
      };
    });

    const payloadSizes = rows.map((row) => row.payload_chars);
    const metrics = {
      protocol_version: PROTOCOL_VERSION,
      tool_count: tools.length,
      tools_list_response_chars: listed.text.length,
      tools_array_chars: JSON.stringify(tools).length,
      input_schema_chars: rows.reduce(
        (total, row) => total + row.input_schema_chars,
        0
      ),
      description_chars: rows.reduce(
        (total, row) => total + row.description_chars,
        0
      ),
      per_tool_payload_chars: {
        p50: percentile(payloadSizes, 0.5),
        p90: percentile(payloadSizes, 0.9),
        p95: percentile(payloadSizes, 0.95),
        max: payloadSizes.length > 0 ? Math.max(...payloadSizes) : 0,
      },
      largest_tools: [...rows]
        .sort((a, b) => b.payload_chars - a.payload_chars || a.name.localeCompare(b.name))
        .slice(0, 10),
    };

    console.log(JSON.stringify(metrics, null, 2));
  } finally {
    if (server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }
  }
}

await main();
