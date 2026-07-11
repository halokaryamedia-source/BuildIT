import { createServer } from "@/server/server";
import { tools, prompts } from "@/server/tools";
import { resources } from "@/server";
import { uiSetup, uiTeardown } from "@/ui";
import { settingsSetup, settingsTeardown } from "@/ui/settings";
import { setupI18n } from "@/ui/i18n";
import { sessionManager } from "@/lib/sessions";
import { initPromptLoader } from "@/lib/promptLoader";
import type { NetServer, SessionTransports } from "@/server/net";
import createNetServer from "@/server/net";
import { serverState } from "@/lib/serverState";

const CANONICAL_MCP_PORT = 3000;
const CANONICAL_MCP_ENDPOINT = "/bb-mcp";
const MINIMUM_SESSION_TIMEOUT_MINUTES = 30;
const DEFAULT_SSE_HEARTBEAT_SECONDS = 15;

let httpServer: NetServer | null = null;
let sessionTransports: SessionTransports | null = null;
let runtimeStarted = false;

function toFiniteNumber(raw: unknown, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export async function startPluginRuntime(): Promise<void> {
  if (runtimeStarted) return;

  // @ts-ignore - requireNativeModule is a Blockbench runtime global.
  const net = requireNativeModule("net", {
    message: "Network access is required for BuildIT MCP to accept local connections.",
    detail:
      "BuildIT MCP creates a local server that Codex and other MCP-compatible clients can connect to.",
    optional: false,
  });

  if (!net) {
    throw new Error("Network permission was not granted.");
  }

  setupI18n();
  settingsSetup();

  try {
    const cdnEnabled = Settings.get("mcp_prompt_cdn_enabled") !== false;
    await initPromptLoader(cdnEnabled);
  } catch (error) {
    console.error(
      "[BuildIT MCP] Prompt loader initialization failed — continuing without prompts:",
      error
    );
  }

  const configuredTimeout = toFiniteNumber(
    Settings.get("mcp_session_timeout"),
    MINIMUM_SESSION_TIMEOUT_MINUTES
  );
  const sessionTimeoutMin = Math.max(
    MINIMUM_SESSION_TIMEOUT_MINUTES,
    configuredTimeout
  );
  const sseHeartbeatSec = toFiniteNumber(
    Settings.get("mcp_sse_heartbeat"),
    DEFAULT_SSE_HEARTBEAT_SECONDS
  );

  serverState.set({
    status: "starting",
    requestedPort: CANONICAL_MCP_PORT,
    endpoint: CANONICAL_MCP_ENDPOINT,
    autoPort: false,
    fallbackUsed: false,
    projectName: Project?.name ?? null,
    projectUuid: Project?.uuid ?? null,
  });

  [httpServer, sessionTransports] = createNetServer(net, {
    port: CANONICAL_MCP_PORT,
    endpoint: CANONICAL_MCP_ENDPOINT,
    autoPort: false,
    portScanLimit: 0,
    keepAlive: {
      sseHeartbeatIntervalMs: Math.max(0, sseHeartbeatSec) * 1000,
    },
    sessionConfig: {
      inactivityTimeoutMs: sessionTimeoutMin * 60 * 1000,
    },
    onListening(info) {
      serverState.set({
        status: "listening",
        requestedPort: info.requestedPort,
        port: info.port,
        endpoint: info.endpoint,
        url: info.url,
        autoPort: info.autoPort,
        fallbackUsed: info.fallbackUsed,
        projectName: info.projectName ?? null,
        projectUuid: info.projectUuid ?? null,
      });
      console.info(`[BuildIT MCP] Listening at ${info.url}`);
      Blockbench.showQuickMessage(`BuildIT MCP ready at ${info.url}`, 3000);
    },
    onListenError(error) {
      serverState.set({
        status: "error",
        errorMessage: error.message,
      });
      console.error("[BuildIT MCP] Server failed to start:", error);
      Blockbench.showQuickMessage(
        `BuildIT MCP failed to start: ${error.message}`,
        4000
      );
    },
  });

  const referenceServer = createServer();
  uiSetup({
    server: referenceServer,
    tools,
    resources,
    prompts,
  });

  runtimeStarted = true;
}

export function stopPluginRuntime(): void {
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }

  const values = Array.from(sessionTransports?.values() ?? []);
  for (const session of values) {
    session.transport.close();
  }
  sessionTransports?.clear();
  sessionTransports = null;

  sessionManager.clear();
  serverState.set({ status: "stopped" });
  serverState.clear();

  uiTeardown();
  settingsTeardown();
  runtimeStarted = false;
}
