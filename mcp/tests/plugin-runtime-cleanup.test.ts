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
    const net = await source("server/net.ts");

    const candidateCreated = index.indexOf("const candidate = createNetServer(nativeNet");
    const candidateOwned = index.indexOf("httpServer = candidate;", candidateCreated);
    const listeningHook = index.indexOf('server.once("listening"');
    const errorHook = index.indexOf('server.once("error"');
    const bindCleanup = index.indexOf("candidate.closeActiveSockets()", errorHook);
    const resetServer = index.indexOf("return false;", bindCleanup);
    const failClosedReturn = index.indexOf("if (!(await startMcpServer(generation))) return;");
    const readyUi = index.indexOf("uiSetup({");

    expect(index).toContain('BBPlugin.register("blockit_mcp"');
    expect(candidateCreated).toBeGreaterThan(-1);
    expect(candidateOwned).toBeGreaterThan(candidateCreated);
    expect(listeningHook).toBeGreaterThan(-1);
    expect(errorHook).toBeGreaterThan(-1);
    expect(bindCleanup).toBeGreaterThan(errorHook);
    expect(resetServer).toBeGreaterThan(bindCleanup);
    expect(failClosedReturn).toBeGreaterThan(resetServer);
    expect(failClosedReturn).toBeLessThan(readyUi);
    expect(listeningHook).toBeLessThan(readyUi);

    expect(tools).toMatch(/if \(!phaseSwitchHandler\).*throw/);
    expect(tools).toContain("requestMcpPhaseSwitch");
    expect(tools).not.toContain("phaseSwitchHandler(target_phase)");
    expect(net).toContain("requestedAuthoringPhase === null");
    expect(net).toContain("requestMcpPhaseSwitch(envelope.targetAuthoringPhase)");
    expect(tools).not.toContain("surface_changed: true");
    expect(tools).toContain("reload_required: false");
  });

  test("phase switching follows the current profile and keeps Gateway clients stable", async () => {
    const index = await source("index.ts");

    expect(index).toContain("const activeProfile = getActiveMcpRegistrationProfile();");
    expect(index).toContain("applyMcpToolSurface(activeProfile, targetPhase);");
    expect(index).not.toContain("applyMcpToolSurface(registrationProfile, targetPhase);");
    expect(index).toContain("serverConfig.profile = activeProfile;");
    expect(index).toContain("serverConfig.phase = targetPhase;");
    expect(index).toContain("Gateway clients refresh automatically");
  });

  test("Blockbench lifecycle callbacks stay synchronous while async teardown is coordinator-owned", async () => {
    const index = await source("index.ts");
    const lifecycle = await source("lib/runtimeLifecycle.ts");

    expect(index).toContain("onload() {");
    expect(index).toContain("onunload() {");
    expect(index).not.toContain("async onload() {");
    expect(index).not.toContain("async onunload() {");
    expect(index).toContain("claimRuntimeGeneration(currentBuildIdentity())");
    expect(index).toContain("beginBlockItRuntimeTeardown();");
    expect(index).toContain("initializationInProgress = null;");
    expect(lifecycle).toContain("priorTeardown");
    expect(lifecycle).toContain("beginRuntimeGenerationTeardown");
  });

  test("plugin unload detaches UI synchronously and drains listener ownership asynchronously", async () => {
    const index = await source("index.ts");
    const net = await source("server/net.ts");
    const ui = await source("ui/index.ts");
    const status = await source("ui/statusBar.ts");
    const settings = await source("ui/settings.ts");

    const teardownStart = index.indexOf("function beginBlockItRuntimeTeardown");
    const uiTeardown = index.indexOf("uiTeardown();", teardownStart);
    const closeCapture = index.indexOf("const closePromise = current?.closeAndWait()", teardownStart);
    expect(teardownStart).toBeGreaterThan(-1);
    expect(uiTeardown).toBeGreaterThan(teardownStart);
    expect(closeCapture).toBeGreaterThan(uiTeardown);
    expect(net).toContain("activeSockets");
    expect(net).toContain("closeActiveSockets");
    expect(net).toContain("waitForRuntimeOperationDrain()");
    expect(net).toContain("ERR_SERVER_NOT_RUNNING");
    expect(ui).toContain("toolTestDialogTeardown()");
    expect(ui).toContain("promptPreviewDialogTeardown()");
    expect(ui).toContain("panelCssHandle?.delete()");
    expect(status).toContain("statusBarCssHandle?.delete()");
    expect(settings).toContain("settings.splice(0)");
  });

  test("native tool serialization survives listener replacement through the global coordinator", async () => {
    const net = await source("server/net.ts");
    const lifecycle = await source("lib/runtimeLifecycle.ts");

    expect(net).toContain("runRuntimeOperationExclusive(generation");
    expect(net).not.toContain("let runtimeRequestTail: Promise<void>");
    expect(lifecycle).toContain("operationTail: Promise<void>");
    expect(lifecycle).toContain("RuntimeGenerationRetiredError");
  });

  test("manual MCP restart drains the old listener before rebinding the same generation", async () => {
    const index = await source("index.ts");

    expect(index).toContain('blockit_restart_mcp_server');
    expect(index).toContain('setStatusBarState("starting", "restarting")');
    expect(index).toContain("const current = httpServer;");
    expect(index).toContain("if (current) await current.closeAndWait();");
    expect(index).toContain("const started = await startMcpServer(generation);");
    expect(index).not.toContain("Reconnect the Codex MCP client");
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
