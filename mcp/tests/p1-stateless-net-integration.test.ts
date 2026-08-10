import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createConnection, createServer as createTcpServer, type AddressInfo } from "node:net";
import { z } from "zod";
import { createTool } from "@/lib/factories";
import createNetServer, { type NetServer } from "@/server/net";

const HOST = "127.0.0.1";
const ENDPOINT = "/bb-mcp";
// Match the current Codex legacy Streamable HTTP initialization revision.
const PROTOCOL_VERSION = "2025-06-18";
const FIXTURE_TOOL = "p1_raw_net_echo_fixture";

let server: NetServer;
let baseUrl = "";

// The raw-net integration test is deliberately transport-owned. Register one
// runtime-independent MCP fixture through BlockIT's real factory registry rather
// than importing the full Bedrock profile, whose Paint family correctly expects
// live Blockbench globals such as Painter during registration.
createTool(
  FIXTURE_TOOL,
  {
    description: "P1.4 raw-net protocol fixture",
    parameters: z.object({ value: z.string() }),
    async execute({ value }) {
      return value;
    },
  },
  "experimental"
);

function closedHeaders(extra: Record<string, string> = {}): Headers {
  return new Headers({
    connection: "close",
    ...extra,
  });
}

async function postMcp(
  body: unknown,
  options: {
    protocolVersion?: boolean;
    origin?: string;
  } = {}
): Promise<Response> {
  const headers = closedHeaders({
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
  });
  if (options.protocolVersion) {
    headers.set("mcp-protocol-version", PROTOCOL_VERSION);
  }
  if (options.origin) {
    headers.set("origin", options.origin);
  }

  return fetch(`${baseUrl}${ENDPOINT}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

async function bodyJson(response: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await response.text()) as Record<string, unknown>;
}

beforeAll(async () => {
  server = createNetServer(
    {
      createServer: (callback) => createTcpServer(callback),
    },
    {
      port: 0,
      endpoint: ENDPOINT,
      host: HOST,
    }
  );

  if (!server.listening) {
    await new Promise<void>((resolve, reject) => {
      server.once("listening", resolve);
      server.once("error", reject);
    });
  }

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected an IPv4 TCP listener for the P1.4 integration fixture.");
  }

  const tcpAddress = address as AddressInfo;
  expect(tcpAddress.address).toBe(HOST);
  baseUrl = `http://${HOST}:${tcpAddress.port}`;
});

afterAll(async () => {
  if (!server?.listening) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

describe("P1.4 raw-net stateless integration", () => {
  test("listener binds to loopback and health exposes stateless JSON mode", async () => {
    const address = server.address();
    expect(address).not.toBeNull();
    expect(typeof address).not.toBe("string");
    if (!address || typeof address === "string") return;

    expect(address.address).toBe(HOST);

    const response = await fetch(`${baseUrl}${ENDPOINT}/health`, {
      headers: closedHeaders(),
    });
    expect(response.status).toBe(200);

    const body = await bodyJson(response);
    expect(body.transport).toEqual({
      mode: "stateless",
      response_mode: "json",
    });
    expect(body).not.toHaveProperty("sessions");
  });

  test("outer HTTP owner rejects standalone GET and DELETE", async () => {
    const getResponse = await fetch(`${baseUrl}${ENDPOINT}`, {
      method: "GET",
      headers: closedHeaders({ accept: "text/event-stream" }),
    });
    expect(getResponse.status).toBe(405);

    const deleteResponse = await fetch(`${baseUrl}${ENDPOINT}`, {
      method: "DELETE",
      headers: closedHeaders(),
    });
    expect(deleteResponse.status).toBe(405);
  });

  test("invalid present Origin is a real HTTP 403 before MCP dispatch", async () => {
    const response = await postMcp(
      {
        jsonrpc: "2.0",
        id: 90,
        method: "initialize",
        params: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {},
          clientInfo: { name: "p1-net-fixture", version: "1.0.0" },
        },
      },
      { origin: "https://example.invalid" }
    );

    expect(response.status).toBe(403);
    const body = await bodyJson(response);
    expect((body.error as { message?: string }).message).toContain("invalid Origin");
  });

  test("initialize, tools/list and tools/call pass through the real raw HTTP parser without sessions", async () => {
    const initializeResponse = await postMcp({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: "p1-net-fixture", version: "1.0.0" },
      },
    });

    expect(initializeResponse.status).toBe(200);
    expect(initializeResponse.headers.get("mcp-session-id")).toBeNull();
    const initializeBody = await bodyJson(initializeResponse);
    expect(
      (initializeBody.result as { protocolVersion?: string }).protocolVersion
    ).toBe(PROTOCOL_VERSION);

    const listTools = async (id: number) => {
      const response = await postMcp(
        {
          jsonrpc: "2.0",
          id,
          method: "tools/list",
          params: {},
        },
        { protocolVersion: true }
      );
      const body = await bodyJson(response);
      const tools = (body.result as { tools?: Array<{ name?: string }> }).tools ?? [];
      return { response, names: tools.map((tool) => tool.name) };
    };

    const first = await listTools(2);
    const second = await listTools(3);

    expect(first.response.status).toBe(200);
    expect(second.response.status).toBe(200);
    expect(first.response.headers.get("mcp-session-id")).toBeNull();
    expect(second.response.headers.get("mcp-session-id")).toBeNull();
    expect(first.names).toContain(FIXTURE_TOOL);
    expect(second.names).toEqual(first.names);

    const callResponse = await postMcp(
      {
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
          name: FIXTURE_TOOL,
          arguments: { value: "raw-net-ok" },
        },
      },
      { protocolVersion: true }
    );
    expect(callResponse.status).toBe(200);
    expect(callResponse.headers.get("mcp-session-id")).toBeNull();
    const callBody = await bodyJson(callResponse);
    expect(
      (callBody.result as { content?: Array<{ type?: string; text?: string }> })
        .content
    ).toEqual([{ type: "text", text: "raw-net-ok" }]);
  });


  test("active keep-alive sockets can be closed deterministically", async () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected active TCP listener.");
    }

    const socket = createConnection({ host: HOST, port: address.port });
    await new Promise<void>((resolve, reject) => {
      socket.once("connect", resolve);
      socket.once("error", reject);
    });

    const responseReceived = new Promise<void>((resolve, reject) => {
      socket.once("data", () => resolve());
      socket.once("error", reject);
    });
    socket.write(
      `GET ${ENDPOINT}/health HTTP/1.1\r\nHost: ${HOST}\r\nConnection: keep-alive\r\n\r\n`
    );
    await responseReceived;
    expect(socket.destroyed).toBe(false);

    const closed = new Promise<void>((resolve) => socket.once("close", () => resolve()));
    server.closeActiveSockets();
    await closed;
    expect(socket.destroyed).toBe(true);
  });
});
