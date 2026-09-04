import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";

describe("P1.4 stateless Streamable HTTP ownership", () => {
  test("default MCP request path is stateless JSON on the existing SDK line", async () => {
    const source = await readFile(
      new URL("../server/net.ts", import.meta.url),
      "utf8"
    );

    expect(source).toContain("sessionIdGenerator: undefined");
    expect(source).toContain("enableJsonResponse: true");
    expect(source).toContain("const requestServer = createMcpServer(");
    expect(source).toContain("registerToolsOnServer(requestServer)");
    expect(source).toContain("registerResourcesOnServer(requestServer)");
    expect(source).toContain("registerPromptsOnServer(requestServer)");
    expect(source).toContain("await requestServer.close()");

    expect(source).not.toContain("mcp-session-id");
    expect(source).not.toContain("sessionManager");
    expect(source).not.toContain("SessionTransports");
    expect(source).not.toContain("setPingCallback");
    expect(source).not.toContain("sseHeartbeat");
    expect(source).not.toContain("setKeepAlive(");
    expect(source).not.toContain("socket.setTimeout(");
    expect(source).toContain("Close each MCP response so a client-side keep-alive socket cannot");
    expect(source).toContain("response.body,\n              'close'");
  });

  test("standalone SSE and session DELETE are not offered by the default endpoint", async () => {
    const source = await readFile(
      new URL("../server/net.ts", import.meta.url),
      "utf8"
    );

    const methodGate = source.indexOf("if (method !== 'POST')");
    const methodNotAllowed = source.indexOf("405", methodGate);
    const statelessDispatch = source.indexOf(
      "handleStatelessMcpRequest(",
      methodGate
    );

    expect(methodGate).toBeGreaterThan(-1);
    expect(methodNotAllowed).toBeGreaterThan(methodGate);
    expect(statelessDispatch).toBeGreaterThan(methodNotAllowed);
    expect(source).toContain("allow: 'POST'");
  });

  test("health output no longer reports protocol sessions", async () => {
    const source = await readFile(
      new URL("../server/net.ts", import.meta.url),
      "utf8"
    );

    expect(source).toContain("mode: 'stateless'");
    expect(source).toContain("response_mode: 'json'");
    expect(source).not.toContain("sessions:");
  });

  test("plugin lifecycle owns only the HTTP server, not session timers or transports", async () => {
    const [indexSource, settingsSource] = await Promise.all([
      readFile(new URL("../index.ts", import.meta.url), "utf8"),
      readFile(new URL("../ui/settings.ts", import.meta.url), "utf8"),
    ]);

    expect(indexSource).not.toContain('from "@/lib/sessions"');
    expect(indexSource).not.toContain("SessionTransports");
    expect(indexSource).not.toContain("sessionTransports");
    expect(indexSource).not.toContain("mcp_session_timeout");
    expect(indexSource).not.toContain("mcp_sse_heartbeat");
    expect(indexSource).toContain("const candidate = createNetServer(nativeNet, config)");
    expect(indexSource).toContain("await waitForServerListening(candidate)");

    expect(settingsSource).not.toContain("mcp_session_timeout");
    expect(settingsSource).not.toContain("mcp_sse_heartbeat");
  });

  test("UI does not present stateless requests as durable client sessions", async () => {
    const [uiSource, statusSource, templateSource] = await Promise.all([
      readFile(new URL("../ui/index.ts", import.meta.url), "utf8"),
      readFile(new URL("../ui/statusBar.ts", import.meta.url), "utf8"),
      readFile(new URL("../ui/panel.html", import.meta.url), "utf8"),
    ]);

    expect(uiSource).not.toContain("sessionManager");
    expect(uiSource).not.toContain("sessions:");
    expect(uiSource).toContain("createSurfaceManifest");

    expect(statusSource).not.toContain("sessionManager");
    expect(statusSource).not.toContain("server_one_client");
    expect(statusSource).not.toContain("server_clients");

    expect(templateSource).not.toContain("sessions.length");
    expect(templateSource).not.toContain("connected_clients");
    expect(templateSource).toContain("surface.tools.exposed_count");
  });

  test("Origin rejection still precedes stateless MCP server construction", async () => {
    const source = await readFile(
      new URL("../server/net.ts", import.meta.url),
      "utf8"
    );

    const originGuard = source.indexOf(
      "if (origin !== undefined && !isAllowedLocalOrigin(origin))"
    );
    const forbiddenResponse = source.indexOf("403", originGuard);
    const requestConstruction = source.indexOf(
      "const webRequest = new Request(url, requestInit)",
      originGuard
    );
    const statelessDispatch = source.indexOf(
      "handleStatelessMcpRequest(",
      originGuard
    );

    expect(originGuard).toBeGreaterThan(-1);
    expect(forbiddenResponse).toBeGreaterThan(originGuard);
    expect(requestConstruction).toBeGreaterThan(forbiddenResponse);
    expect(statelessDispatch).toBeGreaterThan(requestConstruction);
  });
});
