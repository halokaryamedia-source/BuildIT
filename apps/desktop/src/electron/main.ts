import { app, BrowserWindow, ipcMain, shell } from "electron";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const devServerUrl = process.env.BUILDIT_DESKTOP_DEV_SERVER_URL;
const defaultMcpEndpoint = "http://localhost:3000/bb-mcp";

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1100,
    minHeight: 720,
    title: "BuildIT",
    backgroundColor: "#0f172a",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (devServerUrl) {
    void window.loadURL(devServerUrl);
    window.webContents.openDevTools({ mode: "detach" });
  } else {
    void window.loadFile(join(__dirname, "../dist/index.html"));
  }
}

function getBlockbenchCandidates(): string[] {
  const userHome = homedir();
  return process.platform === "win32"
    ? [
        join(userHome, "AppData/Local/Programs/Blockbench/Blockbench.exe"),
        "C:/Program Files/Blockbench/Blockbench.exe",
        "C:/Program Files (x86)/Blockbench/Blockbench.exe"
      ]
    : process.platform === "darwin"
      ? ["/Applications/Blockbench.app"]
      : ["/usr/bin/blockbench", "/usr/local/bin/blockbench"];
}

async function checkBlockbenchMcp(): Promise<{ connected: boolean; toolsValid: boolean; toolNames: string[]; error?: string }> {
  try {
    const response = await fetch(defaultMcpEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} })
    });

    if (!response.ok) {
      return { connected: false, toolsValid: false, toolNames: [], error: "HTTP " + response.status };
    }

    const data = (await response.json()) as { result?: { tools?: Array<{ name?: string }> } };
    const toolNames = data.result?.tools?.map((tool) => tool.name).filter((name): name is string => Boolean(name)) ?? [];
    return { connected: true, toolsValid: toolNames.length > 0, toolNames };
  } catch (error) {
    return {
      connected: false,
      toolsValid: false,
      toolNames: [],
      error: error instanceof Error ? error.message : "Unknown MCP error"
    };
  }
}

function registerRuntimeIpc(): void {
  ipcMain.handle("runtime:open-blockbench", async () => {
    const candidates = getBlockbenchCandidates();
    const executable = candidates.find((candidate) => existsSync(candidate));

    if (!executable) {
      await shell.openExternal("https://www.blockbench.net/downloads");
      return { opened: false, error: "Blockbench executable was not found. Opened the download page instead." };
    }

    if (process.platform === "darwin" && executable.endsWith(".app")) {
      spawn("open", [executable], { detached: true, stdio: "ignore" }).unref();
    } else {
      spawn(executable, [], { detached: true, stdio: "ignore" }).unref();
    }

    return { opened: true, path: executable };
  });

  ipcMain.handle("runtime:start-ollama", async () => {
    const command = process.platform === "win32" ? "ollama.exe" : "ollama";
    spawn(command, ["serve"], { detached: true, stdio: "ignore" }).unref();
    return { started: true };
  });

  ipcMain.handle("runtime:check", async () => {
    const blockbench = await checkBlockbenchMcp();
    return { blockbench };
  });
}

registerRuntimeIpc();

void app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
