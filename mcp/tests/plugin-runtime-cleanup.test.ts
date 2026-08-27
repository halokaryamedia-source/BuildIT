import { describe, expect, test } from "bun:test";

async function source(path: string): Promise<string> {
  return Bun.file(path).text();
}

describe("pre-local plugin runtime cleanup", () => {
  test("MCP ownership is request-only with BlockIT identity", async () => {
    const server = await source("server/server.ts");
    const factories = await source("lib/factories.ts");

    expect(server).toContain("PRODUCT_NAME");
    expect(server).not.toContain("serverInstance");
    expect(server).not.toContain("getServer");
    expect(server).not.toContain("setServer");
    expect(factories).not.toContain('from "@/server/server"');
    expect(factories).not.toContain("const server = getServer()");
    expect(factories).toContain("registerToolsOnServer");
  });

  test("plugin uses unique install identity and does not report ready before TCP bind", async () => {
    const index = await source("index.ts");
    const tools = await source("server/tools.ts");

    const listeningHook = index.indexOf('startingServer.once("listening"');
    const errorHook = index.indexOf('startingServer.once("error"');
    const bindCleanup = index.indexOf("startingServer.closeActiveSockets()", errorHook);
    const resetServer = index.indexOf("httpServer = null", bindCleanup);
    const failClosedReturn = index.indexOf("return;", resetServer);
    const readyUi = index.indexOf("uiSetup({");

    expect(index).toContain('BBPlugin.register("blockit_mcp"');
    expect(listeningHook).toBeGreaterThan(-1);
    expect(errorHook).toBeGreaterThan(-1);
    expect(bindCleanup).toBeGreaterThan(errorHook);
    expect(resetServer).toBeGreaterThan(bindCleanup);
    expect(failClosedReturn).toBeGreaterThan(resetServer);
    expect(failClosedReturn).toBeLessThan(readyUi);
    expect(listeningHook).toBeLessThan(readyUi);

    expect(tools).not.toContain(
      "applyMcpToolSurface(activeRegistrationProfile, target_phase)"
    );
    expect(tools).toContain("surface_changed: false");
    expect(tools).toContain("reload_required: true");
  });

  test("plugin unload owns sockets, CSS, dialogs and settings references", async () => {
    const index = await source("index.ts");
    const net = await source("server/net.ts");
    const ui = await source("ui/index.ts");
    const status = await source("ui/statusBar.ts");
    const settings = await source("ui/settings.ts");

    expect(index).toContain("httpServer.closeActiveSockets()");
    expect(net).toContain("activeSockets");
    expect(net).toContain("closeActiveSockets");
    expect(ui).toContain("toolTestDialogTeardown()");
    expect(ui).toContain("promptPreviewDialogTeardown()");
    expect(ui).toContain("panelCssHandle?.delete()");
    expect(status).toContain("statusBarCssHandle?.delete()");
    expect(settings).toContain("settings.splice(0)");
  });

  test("dead prompt CDN and stateless session settings are removed", async () => {
    const promptLoader = await source("lib/promptLoader.ts");
    const settings = await source("ui/settings.ts");
    const i18n = await source("ui/i18n.ts");

    expect(promptLoader).not.toContain("CDN_BASE_URL");
    expect(promptLoader).not.toContain("remoteManifest");
    expect(promptLoader).not.toContain("refreshFromCDN");
    expect(settings).not.toContain("mcp_prompt_cdn_enabled");
    expect(settings).not.toContain("mcp_instructions");
    expect(i18n).not.toContain("session_timeout");
    expect(i18n).not.toContain("sse_heartbeat");
    expect(i18n).not.toContain("connected_clients");
  });

  test("package/runtime metadata identify BlockIT while upstream attribution remains documentation", async () => {
    const pkg = JSON.parse(await source("package.json")) as {
      name: string;
      description: string;
      author: string;
      contributors?: string[];
    };
    const readme = await source("README.md");

    expect(pkg.name).toBe("blockit-bedrock-entity-mcp");
    expect(pkg.description).toContain("Minecraft Bedrock Entity");
    expect(pkg.author).toBe("Halo Karya Media");
    expect(pkg.contributors).toContain("Jason J. Gardner");
    expect(readme).toContain("upstream hosted plugin");
    expect(await Bun.file("server/types.ts").exists()).toBe(false);
  });
});
