import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sessionManager, type Session } from "@/lib/sessions";
import { serverState, type McpServerState } from "@/lib/serverState";
import statusBarCSS from "@/ui/statusBar.css";

let statusBarElement: HTMLDivElement | undefined;
let unsubscribeSessions: (() => void) | undefined;
let unsubscribeServer: (() => void) | undefined;
let statusDot: HTMLDivElement | undefined;
let statusText: HTMLSpanElement | undefined;
let serverInfo: HTMLSpanElement | undefined;

function formatServerInfo(runtime: McpServerState): string {
  const port = runtime.port ?? runtime.requestedPort;
  return `(${port}${runtime.endpoint})`;
}

function updateServerDisplay(runtime: McpServerState): void {
  if (!statusDot || !statusText || !serverInfo) return;

  serverInfo.textContent = formatServerInfo(runtime);

  if (runtime.status === "starting") {
    statusDot.classList.remove("connected");
    statusDot.classList.add("disconnected");
    statusText.textContent = tl("mcp.status.server");
    statusDot.title = tl("mcp.tooltip.click_to_view_panel");
    return;
  }

  if (runtime.status === "error") {
    statusDot.classList.remove("connected");
    statusDot.classList.add("disconnected");
    statusText.textContent = tl("mcp.status.server_error");
    statusDot.title = runtime.errorMessage ?? tl("mcp.status.server_error");
    return;
  }

  if (runtime.fallbackUsed) {
    statusDot.title = tl("mcp.status.fallback_tooltip", [
      runtime.requestedPort,
      runtime.port ?? runtime.requestedPort,
    ]);
  } else {
    statusDot.title = tl("mcp.tooltip.click_to_view_panel");
  }
}

export function statusBarSetup(_server: McpServer): void {
  Blockbench.addCSS(statusBarCSS);

  statusBarElement = document.createElement("div");
  statusBarElement.id = "mcp-status-bar";

  const statusIndicator = document.createElement("div");
  statusIndicator.className = "mcp-status-indicator";
  statusIndicator.title = tl("mcp.tooltip.click_to_view_panel");

  statusDot = document.createElement("div");
  statusDot.className = "mcp-status-dot disconnected";

  statusText = document.createElement("span");
  statusText.className = "mcp-status-text";
  statusText.textContent = tl("mcp.status.server");

  serverInfo = document.createElement("span");
  serverInfo.className = "mcp-server-info";
  serverInfo.textContent = formatServerInfo(serverState.get());

  statusIndicator.appendChild(statusDot);
  statusIndicator.appendChild(statusText);
  statusIndicator.appendChild(serverInfo);
  statusBarElement.appendChild(statusIndicator);

  const updateSessions = (sessions: Session[]) => {
    if (!statusDot || !statusText) return;
    const runtime = serverState.get();
    if (runtime.status === "error") return;

    const count = sessions.length;
    if (count > 0) {
      statusDot.classList.remove("disconnected");
      statusDot.classList.add("connected");
      statusText.textContent =
        count === 1
          ? tl("mcp.status.server_one_client")
          : tl("mcp.status.server_clients", [count]);
    } else {
      statusDot.classList.remove("connected");
      statusDot.classList.add("disconnected");
      statusText.textContent = tl("mcp.status.server");
    }
    updateServerDisplay(runtime);
  };

  unsubscribeSessions = sessionManager.subscribe(updateSessions);
  unsubscribeServer = serverState.subscribe((runtime) => {
    updateServerDisplay(runtime);
    updateSessions(sessionManager.getAll());
  });

  statusIndicator.addEventListener("click", () => {
    // @ts-ignore - Blockbench Panel types
    const mcpPanel = Panels.mcp_panel;
    if (!mcpPanel) return;

    if (mcpPanel.folded) {
      mcpPanel.fold(false);
      return;
    }

    if (mcpPanel.slot === "float") {
      mcpPanel.moveToFront();
    }
  });

  const existingStatusBar = document.getElementById("status_bar");
  if (!existingStatusBar) {
    console.warn("Could not find status_bar element");
    return;
  }

  existingStatusBar.appendChild(statusBarElement);
}

export function statusBarTeardown(): void {
  if (unsubscribeSessions) {
    unsubscribeSessions();
    unsubscribeSessions = undefined;
  }
  if (unsubscribeServer) {
    unsubscribeServer();
    unsubscribeServer = undefined;
  }
  if (statusBarElement) {
    statusBarElement.remove();
    statusBarElement = undefined;
  }
  statusDot = undefined;
  statusText = undefined;
  serverInfo = undefined;
}
