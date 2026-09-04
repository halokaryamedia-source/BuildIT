import statusBarCSS from "@/ui/statusBar.css";

let statusBarElement: HTMLDivElement | undefined;
let statusBarCssHandle: { delete(): void } | undefined;
let statusDot: HTMLDivElement | undefined;
let statusText: HTMLSpanElement | undefined;

export type McpServerStatus = "running" | "starting" | "failed";

export function setStatusBarState(
  state: McpServerStatus,
  detail?: string
): void {
  if (!statusDot || !statusText) return;

  statusDot.className = `mcp-status-dot ${state}`;
  statusText.textContent = detail
    ? `${tl("mcp.status.server")} — ${detail}`
    : `${tl("mcp.status.server")} — ${state}`;
}

export function statusBarSetup(): void {
  statusBarTeardown();

  const port = Settings.get("mcp_port") || 3000;
  const endpoint = Settings.get("mcp_endpoint") || "/bb-mcp";
  statusBarCssHandle = Blockbench.addCSS(statusBarCSS);

  const existingStatusBar = document.getElementById("status_bar");
  if (!existingStatusBar) {
    console.warn("Could not find status_bar element");
    statusBarCssHandle.delete();
    statusBarCssHandle = undefined;
    return;
  }

  statusBarElement = document.createElement("div");
  statusBarElement.id = "mcp-status-bar";

  const statusIndicator = document.createElement("div");
  statusIndicator.className = "mcp-status-indicator";
  statusIndicator.title = tl("mcp.tooltip.click_to_view_panel");

  statusDot = document.createElement("div");
  statusDot.className = "mcp-status-dot running";

  statusText = document.createElement("span");
  statusText.className = "mcp-status-text";
  statusText.textContent = `${tl("mcp.status.server")} — running`;

  const serverInfo = document.createElement("span");
  serverInfo.className = "mcp-server-info";
  serverInfo.textContent = `(${port}${endpoint})`;

  statusIndicator.appendChild(statusDot);
  statusIndicator.appendChild(statusText);
  statusIndicator.appendChild(serverInfo);
  statusBarElement.appendChild(statusIndicator);

  statusIndicator.addEventListener("click", () => {
    // @ts-ignore - Blockbench Panel types
    const mcpPanel = Panels.mcp_panel;
    if (!mcpPanel) return;
    if (mcpPanel.folded) {
      mcpPanel.fold(false);
      return;
    }
    if (mcpPanel.slot === "float") mcpPanel.moveToFront();
  });

  existingStatusBar.appendChild(statusBarElement);
}

export function statusBarTeardown(): void {
  statusBarElement?.remove();
  statusBarElement = undefined;
  statusDot = undefined;
  statusText = undefined;
  statusBarCssHandle?.delete();
  statusBarCssHandle = undefined;
}
