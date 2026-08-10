import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createServer as createTcpServer, type AddressInfo, type Server } from "node:net";
import "@/server";
import createNetServer from "@/server/net";

const HOST = "127.0.0.1";
const ENDPOINT = "/bb-mcp";
const PROTOCOL_VERSION = "2025-11-25";

let server: Server;
let baseUrl = "";

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

  test("initialize and repeated tools/list work through the real raw HTTP parser without sessions", async () => {
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
    expect(first.names).toContain("place_cube");
    expect(first.names).toContain("inspect_element");
    expect(first.names).toContain("create_texture");
    expect(first.names).toContain("create_animation");
    expect(first.names).not.toContain("risky_eval");
    expect(first.names).not.toContain("from_geo_json");
    expect(second.names).toEqual(first.names);
  });
});
