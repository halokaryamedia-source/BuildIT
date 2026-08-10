import statusBarCSS from "@/ui/statusBar.css";

let statusBarElement: HTMLDivElement | undefined;

export function statusBarSetup(): void {
  const port = Settings.get("mcp_port") || 3000;
  const endpoint = Settings.get("mcp_endpoint") || "/bb-mcp";

  Blockbench.addCSS(statusBarCSS);

  statusBarElement = document.createElement("div");
  statusBarElement.id = "mcp-status-bar";

  const statusIndicator = document.createElement("div");
  statusIndicator.className = "mcp-status-indicator";
  statusIndicator.title = tl("mcp.tooltip.click_to_view_panel");

  // Keep the neutral status dot. Stateless Streamable HTTP has no durable MCP
  // session whose presence could truthfully drive a connected/disconnected UI.
  const statusDot = document.createElement("div");
  statusDot.className = "mcp-status-dot";

  const statusText = document.createElement("span");
  statusText.className = "mcp-status-text";
  statusText.textContent = tl("mcp.status.server");

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

    if (!mcpPanel) {
      return;
    }

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
  if (statusBarElement) {
    statusBarElement.remove();
    statusBarElement = undefined;
  }
}
