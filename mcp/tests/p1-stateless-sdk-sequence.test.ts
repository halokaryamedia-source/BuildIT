import { describe, expect, test } from "bun:test";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

const MCP_URL = "http://127.0.0.1:3000/bb-mcp";
const PROTOCOL_VERSION = "2025-11-25";

function createFixtureServer(): McpServer {
  const server = new McpServer({
    name: "blockit-p1-stateless-fixture",
    version: "1.0.0",
  });

  server.registerTool(
    "echo_fixture",
    {
      description: "P1.4 stateless protocol fixture",
      inputSchema: {
        value: z.string(),
      },
    },
    async ({ value }) => ({
      content: [{ type: "text" as const, text: value }],
    })
  );

  return server;
}

async function postWithFreshStatelessServer(
  message: unknown,
  options: { includeProtocolHeader?: boolean } = {}
): Promise<{ status: number; headers: Headers; text: string }> {
  const server = createFixtureServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  try {
    const headers = new Headers({
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
    });
    if (options.includeProtocolHeader) {
      headers.set("mcp-protocol-version", PROTOCOL_VERSION);
    }

    const response = await transport.handleRequest(
      new Request(MCP_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(message),
      })
    );

    return {
      status: response.status,
      headers: response.headers,
      text: await response.text(),
    };
  } finally {
    await server.close();
  }
}

function parseJson(text: string): Record<string, unknown> {
  return JSON.parse(text) as Record<string, unknown>;
}

describe("P1.4 pinned-SDK stateless request sequence", () => {
  test("fresh server/transport per POST supports initialize then independent follow-up requests", async () => {
    const initialize = await postWithFreshStatelessServer({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: {
          name: "blockit-p1-test-client",
          version: "1.0.0",
        },
      },
    });

    expect(initialize.status).toBe(200);
    expect(initialize.headers.get("mcp-session-id")).toBeNull();
    const initializeJson = parseJson(initialize.text);
    expect(initializeJson.jsonrpc).toBe("2.0");
    expect(initializeJson.id).toBe(1);
    expect(
      (initializeJson.result as { protocolVersion?: string }).protocolVersion
    ).toBe(PROTOCOL_VERSION);

    const initialized = await postWithFreshStatelessServer(
      {
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {},
      },
      { includeProtocolHeader: true }
    );

    expect(initialized.status).toBe(202);
    expect(initialized.headers.get("mcp-session-id")).toBeNull();

    const toolsList = await postWithFreshStatelessServer(
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      },
      { includeProtocolHeader: true }
    );

    expect(toolsList.status).toBe(200);
    expect(toolsList.headers.get("mcp-session-id")).toBeNull();
    const toolsListJson = parseJson(toolsList.text);
    const tools = (toolsListJson.result as { tools?: Array<{ name?: string }> }).tools;
    expect(tools?.map((tool) => tool.name)).toContain("echo_fixture");

    const toolCall = await postWithFreshStatelessServer(
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "echo_fixture",
          arguments: { value: "stateless-ok" },
        },
      },
      { includeProtocolHeader: true }
    );

    expect(toolCall.status).toBe(200);
    expect(toolCall.headers.get("mcp-session-id")).toBeNull();
    const toolCallJson = parseJson(toolCall.text);
    expect(
      (toolCallJson.result as { content?: Array<{ type?: string; text?: string }> })
        .content
    ).toEqual([{ type: "text", text: "stateless-ok" }]);
  });

  test("follow-up requests remain independent of any server-issued protocol session", async () => {
    const firstList = await postWithFreshStatelessServer(
      {
        jsonrpc: "2.0",
        id: 10,
        method: "tools/list",
        params: {},
      },
      { includeProtocolHeader: true }
    );
    const secondList = await postWithFreshStatelessServer(
      {
        jsonrpc: "2.0",
        id: 11,
        method: "tools/list",
        params: {},
      },
      { includeProtocolHeader: true }
    );

    expect(firstList.status).toBe(200);
    expect(secondList.status).toBe(200);
    expect(firstList.headers.get("mcp-session-id")).toBeNull();
    expect(secondList.headers.get("mcp-session-id")).toBeNull();
  });
});
