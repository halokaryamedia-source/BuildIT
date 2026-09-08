import statusBarCSS from "@/ui/statusBar.css";

let statusBarElement: HTMLDivElement | undefined;
let statusBarCssHandle: { delete(): void } | undefined;
let statusIndicator: HTMLDivElement | undefined;
let statusDot: HTMLDivElement | undefined;
let statusText: HTMLSpanElement | undefined;
let runtimeAddress = "";

export type McpServerStatus = "running" | "starting" | "failed";
export interface BlockItRuntimeStatusDetail {
  state: McpServerStatus;
  detail?: string;
}

export const BLOCKIT_RUNTIME_STATUS_CHANGED = "blockit-runtime-status-changed";

let currentStatus: BlockItRuntimeStatusDetail = { state: "running" };

function statusLabel(state: McpServerStatus): string {
  if (state === "starting") return "BlockIT Starting";
  if (state === "failed") return "BlockIT Error";
  return "BlockIT Ready";
}

function renderStatus(): void {
  if (statusDot) statusDot.className = `mcp-status-dot ${currentStatus.state}`;
  if (statusText) statusText.textContent = statusLabel(currentStatus.state);
  if (!statusIndicator) return;

  const detail = currentStatus.detail?.trim();
  const diagnostic =
    currentStatus.state === "running"
      ? runtimeAddress
      : detail || runtimeAddress;
  statusIndicator.title = [
    statusLabel(currentStatus.state),
    diagnostic,
    "Click to open BlockIT panel",
  ]
    .filter(Boolean)
    .join(" · ");
}

function emitStatus(): void {
  if (typeof document === "undefined") return;
  document.dispatchEvent(
    new CustomEvent<BlockItRuntimeStatusDetail>(BLOCKIT_RUNTIME_STATUS_CHANGED, {
      detail: { ...currentStatus },
    })
  );
}

export function setStatusBarState(
  state: McpServerStatus,
  detail?: string
): void {
  currentStatus = detail ? { state, detail } : { state };
  renderStatus();
  emitStatus();
}

export function statusBarSetup(): void {
  statusBarTeardown();

  const port = Settings.get("mcp_port") || 3000;
  const endpoint = Settings.get("mcp_endpoint") || "/bb-mcp";
  runtimeAddress = `127.0.0.1:${port}${endpoint}`;
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

  statusIndicator = document.createElement("div");
  statusIndicator.className = "mcp-status-indicator";

  statusDot = document.createElement("div");
  statusDot.className = "mcp-status-dot";

  statusText = document.createElement("span");
  statusText.className = "mcp-status-text";

  statusIndicator.appendChild(statusDot);
  statusIndicator.appendChild(statusText);
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
  renderStatus();
}

export function statusBarTeardown(): void {
  statusBarElement?.remove();
  statusBarElement = undefined;
  statusIndicator = undefined;
  statusDot = undefined;
  statusText = undefined;
  runtimeAddress = "";
  statusBarCssHandle?.delete();
  statusBarCssHandle = undefined;
}
