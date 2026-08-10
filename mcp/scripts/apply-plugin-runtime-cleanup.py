from __future__ import annotations

from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, content: str) -> None:
    (ROOT / path).write_text(content, encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    if text.count(old) != 1:
        raise RuntimeError(f"Expected exactly one target in {path}: {old!r}")
    write(path, text.replace(old, new, 1))


def replace_section(path: str, start: str, end: str, replacement: str) -> None:
    text = read(path)
    start_index = text.find(start)
    if start_index < 0:
        raise RuntimeError(f"Missing section start in {path}: {start!r}")
    end_index = text.find(end, start_index)
    if end_index < 0:
        raise RuntimeError(f"Missing section end in {path}: {end!r}")
    write(path, text[:start_index] + replacement + text[end_index:])


def grep_paths(term: str) -> set[str]:
    result = subprocess.run(
        ["git", "grep", "-l", term, "--", "mcp"],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    if result.returncode not in (0, 1):
        raise RuntimeError(result.stderr)
    return {line.strip() for line in result.stdout.splitlines() if line.strip()}


def assert_only(term: str, allowed: set[str]) -> None:
    found = grep_paths(term)
    unexpected = found - allowed
    if unexpected:
        raise RuntimeError(f"Unexpected references for {term!r}: {sorted(unexpected)}")


# Guard deletion/ownership assumptions before mutation.
assert_only(
    "getServer",
    {
        "mcp/lib/factories.ts",
        "mcp/server/server.ts",
    },
)
assert_only(
    "setServer",
    {
        "mcp/server/server.ts",
        "mcp/tests/p0-contracts.test.ts",
    },
)
assert_only("BlockbenchSessionAuth", {"mcp/server/types.ts"})
assert_only(
    "mcp_prompt_cdn_enabled",
    {
        "mcp/index.ts",
        "mcp/ui/settings.ts",
    },
)
assert_only("refreshFromCDN", {"mcp/lib/promptLoader.ts"})

# 1. Request-owned MCP server only: remove the unused singleton owner.
write(
    "mcp/server/server.ts",
    '''/// <reference types="three" />
/// <reference types="blockbench-types" />
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PRODUCT_NAME, PRODUCT_VERSION } from "@/lib/productIdentity";

/** Create one request-owned MCP server instance. */
export function createServer(): McpServer {
  return new McpServer({
    name: PRODUCT_NAME,
    version: PRODUCT_VERSION,
  });
}
''',
)

write(
    "mcp/server/index.ts",
    '''export { createServer } from "./server";
export * as tools from "./tools";
// Import resources.ts for side effects (stores resource definitions via createResource).
import "./resources";
export { resources } from "@/lib/factories";
export { default as prompts } from "./prompts";
''',
)

replace_once("mcp/lib/factories.ts", 'import { getServer } from "@/server/server";\n', "")
replace_section(
    "mcp/lib/factories.ts",
    "  // Register with server if enabled\n",
    "  tools[name] = {\n",
    "",
)
replace_section(
    "mcp/lib/factories.ts",
    "  // Register with the current server instance\n",
    "  resources[name] = {\n",
    "",
)
replace_section(
    "mcp/lib/factories.ts",
    "  // Store prompt definition for session reconstruction\n",
    "  prompts[name] = {\n",
    '''  // Store enabled prompt definitions for request-owned server reconstruction.
  if (enabled && prompt.generate && argsShape) {
    const promptDef: PromptDefinition = {
      name,
      title: prompt.title || prompt.description,
      description: prompt.description,
      argsSchema: argsShape,
      generate: async (args: Record<string, unknown>) =>
        prompt.generate!(args as z.infer<z.ZodObject<T>>),
    };

    promptDefinitions[name] = promptDef;
  }

''',
)
for old, new in [
    ("dynamic server reconstruction", "request-owned server reconstruction"),
    ("new session servers with the same tools", "fresh request-owned servers with the same tools"),
    ("session reconstruction", "request-owned server reconstruction"),
    ("new session servers with the same resources", "fresh request-owned servers with the same resources"),
    ("new session servers with the same prompts", "fresh request-owned servers with the same prompts"),
]:
    text = read("mcp/lib/factories.ts")
    if old in text:
        write("mcp/lib/factories.ts", text.replace(old, new))

# 2. Deterministic socket ownership on plugin unload.
replace_once(
    "mcp/server/net.ts",
    "import type { Server as NetServer, Socket } from 'node:net'\n",
    "import type { Server as NodeNetServer, Socket } from 'node:net'\n",
)
replace_once(
    "mcp/server/net.ts",
    "export type { NetServer }\n",
    '''export interface NetServer extends NodeNetServer {
  closeActiveSockets(): void
}
''',
)
replace_once(
    "mcp/server/net.ts",
    "    createServer: (callback: (socket: Socket) => void) => NetServer\n",
    "    createServer: (callback: (socket: Socket) => void) => NodeNetServer\n",
)
replace_once(
    "mcp/server/net.ts",
    "): NetServer {\n  const httpServer = createServer((socket: Socket) => {\n",
    '''): NetServer {
  const activeSockets = new Set<Socket>()
  const httpServer = createServer((socket: Socket) => {
    activeSockets.add(socket)
''',
)
replace_once(
    "mcp/server/net.ts",
    "    socket.on('close', () => {\n      buffer = Buffer.alloc(0)\n    })\n",
    "    socket.on('close', () => {\n      buffer = Buffer.alloc(0)\n      activeSockets.delete(socket)\n    })\n",
)
replace_once(
    "mcp/server/net.ts",
    "  })\n\n  httpServer.listen(port, host, () => {\n",
    '''  }) as NetServer

  httpServer.closeActiveSockets = () => {
    for (const socket of activeSockets) {
      socket.destroy()
    }
    activeSockets.clear()
  }

  httpServer.listen(port, host, () => {
''',
)
replace_once(
    "mcp/index.ts",
    "      httpServer.close();\n      httpServer = null;\n",
    "      httpServer.close();\n      httpServer.closeActiveSockets();\n      httpServer = null;\n",
)

# 3. Local-owned prompt loader: bundled prompt + user override only.
write(
    "mcp/lib/promptLoader.ts",
    '''import bundledPromptManifest from "@/prompts/manifest.json";
import { z } from "zod";

export interface PromptManifest {
  version: string;
  generatedAt: string;
  prompts: Record<string, string>;
}

const STORAGE_KEY_OVERRIDES = "bbmcp_prompt_overrides";

const promptManifestSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  prompts: z.record(z.string(), z.string()),
});

const localManifest: PromptManifest = promptManifestSchema.parse(
  bundledPromptManifest
);

let overrides: Record<string, string> = {};
let initialized = false;

function hasLocalStorage(): boolean {
  return typeof localStorage !== "undefined";
}

function storageGet(key: string): string | null {
  if (!hasLocalStorage()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  if (!hasLocalStorage()) return;
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn("[MCP] localStorage write failed:", err);
  }
}

function storageRemove(key: string): void {
  if (!hasLocalStorage()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage cleanup failures.
  }
}

function loadOverrides(): Record<string, string> {
  const raw = storageGet(STORAGE_KEY_OVERRIDES);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed).filter((entry): entry is [string, string] =>
          typeof entry[1] === "string"
        )
      );
    }
  } catch {
    // Invalid legacy override payload is removed below.
  }

  storageRemove(STORAGE_KEY_OVERRIDES);
  return {};
}

function persistOverrides(): void {
  if (Object.keys(overrides).length === 0) {
    storageRemove(STORAGE_KEY_OVERRIDES);
    return;
  }
  storageSet(STORAGE_KEY_OVERRIDES, JSON.stringify(overrides));
}

/** Initialize bundled Local prompts and persisted user overrides. */
export async function initPromptLoader(): Promise<void> {
  overrides = loadOverrides();
  initialized = true;
  console.log(
    `[MCP] Local prompt manifest loaded (v${localManifest.version}, ${Object.keys(localManifest.prompts).length} prompts)`
  );
}

/** Priority: user override > bundled Local prompt > empty. */
export function getPromptContent(name: string): string {
  if (!initialized) {
    console.warn(
      "[MCP] getPromptContent called before initPromptLoader — returning empty"
    );
    return "";
  }

  const override = overrides[name];
  if (override !== undefined && override !== "") return override;
  return localManifest.prompts[name] ?? "";
}

export function setPromptOverride(name: string, content: string): void {
  overrides = { ...overrides, [name]: content };
  persistOverrides();
}

export function clearPromptOverride(name: string): void {
  const { [name]: _removed, ...rest } = overrides;
  overrides = rest;
  persistOverrides();
}

export function hasPromptOverride(name: string): boolean {
  return name in overrides && overrides[name] !== "";
}

export function getPromptOverrides(): Record<string, string> {
  return { ...overrides };
}

export function getAvailablePromptNames(): string[] {
  return Object.keys(localManifest.prompts);
}

export function getManifest(): PromptManifest {
  return {
    ...localManifest,
    prompts: { ...localManifest.prompts },
  };
}
''',
)
replace_section(
    "mcp/index.ts",
    "    // Local prompt content is bundled into the plugin and remains the default\n",
    "    // P1.4 default transport is request-owned/stateless Streamable HTTP on\n",
    '''    // Local prompt content is bundled into this BlockIT build. User overrides
    // remain local; normal plugin startup performs no prompt-network fetch.
    await initPromptLoader();

''',
)

# 4. Settings and UI lifecycle ownership.
write(
    "mcp/ui/settings.ts",
    '''import { MCP_EXTENDED_FAMILIES_SETTING_ID } from "@/lib/registrationProfile";

const settings: Setting[] = [];

export function settingsSetup(): void {
  settingsTeardown();
  const category = "general";

  settings.push(
    new Setting("mcp_port", {
      name: tl("mcp.settings.port_name"),
      description: tl("mcp.settings.port_desc"),
      type: "number",
      value: 3000,
      category,
      icon: "numbers",
    }),
    new Setting("mcp_endpoint", {
      name: tl("mcp.settings.endpoint_name"),
      description: tl("mcp.settings.endpoint_desc"),
      type: "text",
      value: "/bb-mcp",
      category,
      icon: "webhook",
    }),
    new Setting(MCP_EXTENDED_FAMILIES_SETTING_ID, {
      name: "Extended MCP Families",
      description:
        "Explicitly expose the source-preserved generic import/UI fallback families on the next MCP plugin load. risky_eval and from_geo_json remain disabled.",
      type: "toggle",
      value: false,
      category,
      icon: "extension",
    })
  );
}

export function settingsTeardown(): void {
  for (const setting of settings.splice(0)) {
    setting.delete();
  }
}
''',
)

replace_once(
    "mcp/ui/toolTestDialog.ts",
    "export function getToolInfo(toolName: string): {\n",
    '''export function toolTestDialogTeardown(): void {
  currentDialog?.hide();
  currentDialog = null;
  resultDialog?.hide();
  resultDialog = null;
}

export function getToolInfo(toolName: string): {
''',
)
replace_once(
    "mcp/ui/promptPreviewDialog.ts",
    "export function openPromptPreviewDialog(promptName: string) {\n",
    '''export function promptPreviewDialogTeardown(): void {
  currentDialog?.hide();
  currentDialog = null;
  contentDialog?.hide();
  contentDialog = null;
}

export function openPromptPreviewDialog(promptName: string) {
''',
)
replace_once(
    "mcp/ui/index.ts",
    'import { openToolTestDialog } from "@/ui/toolTestDialog";\n',
    'import { openToolTestDialog, toolTestDialogTeardown } from "@/ui/toolTestDialog";\n',
)
replace_once(
    "mcp/ui/index.ts",
    'import { openPromptPreviewDialog } from "@/ui/promptPreviewDialog";\n',
    'import { openPromptPreviewDialog, promptPreviewDialogTeardown } from "@/ui/promptPreviewDialog";\n',
)
replace_once(
    "mcp/ui/index.ts",
    "let panel: Panel | undefined;\nlet overrideListener: (() => void) | undefined;\n",
    '''let panel: Panel | undefined;
let overrideListener: (() => void) | undefined;
let panelCssHandle: { delete(): void } | undefined;
''',
)
replace_once(
    "mcp/ui/index.ts",
    "  Blockbench.addCSS(panelCSS);\n",
    "  panelCssHandle?.delete();\n  panelCssHandle = Blockbench.addCSS(panelCSS);\n",
)
replace_once(
    "mcp/ui/index.ts",
    '''export function uiTeardown() {
  overrideDialogTeardown();
  statusBarTeardown();
  panel?.delete();
}
''',
    '''export function uiTeardown(): void {
  if (overrideListener) {
    overrideListener();
    overrideListener = undefined;
  }
  overrideDialogTeardown();
  toolTestDialogTeardown();
  promptPreviewDialogTeardown();
  statusBarTeardown();
  panel?.delete();
  panel = undefined;
  panelCssHandle?.delete();
  panelCssHandle = undefined;
}
''',
)

write(
    "mcp/ui/statusBar.ts",
    '''import statusBarCSS from "@/ui/statusBar.css";

let statusBarElement: HTMLDivElement | undefined;
let statusBarCssHandle: { delete(): void } | undefined;

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
  statusBarCssHandle?.delete();
  statusBarCssHandle = undefined;
}
''',
)

# Remove dead stateless/session/settings translations, preserving active languages.
i18n_path = ROOT / "mcp/ui/i18n.ts"
i18n = i18n_path.read_text(encoding="utf-8")
legacy_keys = [
    "mcp.panel.sessions",
    "mcp.sessions.no_clients",
    "mcp.server.connected_clients",
    "mcp.status.server_one_client",
    "mcp.status.server_clients",
    "mcp.settings.instructions_name",
    "mcp.settings.instructions_desc",
    "mcp.settings.prompt_cdn_name",
    "mcp.settings.prompt_cdn_desc",
    "mcp.settings.session_timeout_name",
    "mcp.settings.session_timeout_desc",
    "mcp.settings.sse_heartbeat_name",
    "mcp.settings.sse_heartbeat_desc",
]
for key in legacy_keys:
    i18n, count = re.subn(rf'^\s*"{re.escape(key)}":.*\n', "", i18n, flags=re.MULTILINE)
    if count != 4:
        raise RuntimeError(f"Expected 4 language entries for {key}, found {count}")
i18n = re.sub(r'^\s*// Sessions section\n', "", i18n, flags=re.MULTILINE)
i18n_path.write_text(i18n, encoding="utf-8")

# 5. Product metadata consistency and dead session type removal.
package_path = ROOT / "mcp/package.json"
package = json.loads(package_path.read_text(encoding="utf-8"))
package["name"] = "blockit-bedrock-entity-mcp"
package["description"] = "Minecraft Bedrock Entity-focused MCP server plugin for Blockbench"
package["author"] = "Halo Karya Media"
package["contributors"] = ["Jason J. Gardner", "brokestar233"]
package_path.write_text(json.dumps(package, indent=2) + "\n", encoding="utf-8")

lock_path = ROOT / "mcp/bun.lock"
lock = lock_path.read_text(encoding="utf-8")
if lock.count('"name": "blockbench-mcp"') != 1:
    raise RuntimeError("Unexpected bun.lock workspace-name ownership")
lock_path.write_text(lock.replace('"name": "blockbench-mcp"', '"name": "blockit-bedrock-entity-mcp"', 1), encoding="utf-8")

server_types = ROOT / "mcp/server/types.ts"
if not server_types.exists():
    raise RuntimeError("Expected legacy mcp/server/types.ts")
server_types.unlink()

replace_once(
    "mcp/README.md",
    "- Optional prompt CDN fallback (off by default)\n",
    "",
)

# 6. Contract tests adapt to definition-only factory ownership.
p0 = read("mcp/tests/p0-contracts.test.ts")
p0 = p0.replace('import { setServer } from "@/server/server";\n', "")
p0 = p0.replace("    setServer(capture.server as never);\n\n", "")
p0 = p0.replace("    setServer(initialCapture.server as never);\n\n", "")
p0 = p0.replace(
    '    const registration = capture.registrations.get("p0_refine_contract_fixture");\n',
    '    registerToolsOnServer(capture.server);\n    const registration = capture.registrations.get("p0_refine_contract_fixture");\n',
    1,
)
p0 = p0.replace(
    "    registerUITools();\n    registerImportTools();\n\n",
    "    registerUITools();\n    registerImportTools();\n    registerToolsOnServer(capture.server);\n\n",
    1,
)
write("mcp/tests/p0-contracts.test.ts", p0)

# Integration proof for deterministic active-socket cleanup.
integration = read("mcp/tests/p1-stateless-net-integration.test.ts")
integration = integration.replace(
    'import { createServer as createTcpServer, type AddressInfo, type Server } from "node:net";\n',
    'import { createConnection, createServer as createTcpServer, type AddressInfo } from "node:net";\n',
)
integration = integration.replace(
    'import createNetServer from "@/server/net";\n',
    'import createNetServer, { type NetServer } from "@/server/net";\n',
)
integration = integration.replace("let server: Server;\n", "let server: NetServer;\n")
needle = "});\n"
insert_at = integration.rfind(needle)
if insert_at < 0:
    raise RuntimeError("Could not locate integration suite end")
socket_test = '''

  test("active keep-alive sockets can be closed deterministically", async () => {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Expected active TCP listener.");
    }

    const socket = createConnection({ host: HOST, port: address.port });
    await new Promise<void>((resolve, reject) => {
      socket.once("connect", resolve);
      socket.once("error", reject);
    });

    const responseReceived = new Promise<void>((resolve, reject) => {
      socket.once("data", () => resolve());
      socket.once("error", reject);
    });
    socket.write(
      `GET ${ENDPOINT}/health HTTP/1.1\\r\\nHost: ${HOST}\\r\\nConnection: keep-alive\\r\\n\\r\\n`
    );
    await responseReceived;
    expect(socket.destroyed).toBe(false);

    const closed = new Promise<void>((resolve) => socket.once("close", () => resolve()));
    server.closeActiveSockets();
    await closed;
    expect(socket.destroyed).toBe(true);
  });
'''
integration = integration[:insert_at] + socket_test + integration[insert_at:]
write("mcp/tests/p1-stateless-net-integration.test.ts", integration)

# Focused source/lifecycle regression.
write(
    "mcp/tests/plugin-runtime-cleanup.test.ts",
    '''import { describe, expect, test } from "bun:test";

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
    expect(readme).toContain("Upstream attribution");
    expect(await Bun.file("server/types.ts").exists()).toBe(false);
  });
});
''',
)

# Snapshot: runtime cleanup is the final source boundary before local acceptance.
next_path = "docs/knowledge/next-action.md"
next_text = read(next_path)
next_text = next_text.replace(
    "`MCP_MODEL_EFFECTIVENESS_MINIMUM_EVIDENCE_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    "`MCP_PLUGIN_RUNTIME_CLEANUP_SOURCE_COMPLETE_LOCAL_PROOF_REQUIRED`",
    1,
)
anchor = "The final pre-local cleanup has hardened **Minimum Necessary Evidence**: bounds are conditional, specialists load lazily, checkpoints are risk-based, newly placed Cubes do not require per-Cube inspection, captures happen at meaningful gates/affected views only, simple Primary Form reasoning stays compact, and `UNVERIFIED` is not an automatic retry/search instruction. No runtime mode/profile/framework was added.\n"
if anchor not in next_text:
    raise RuntimeError("Missing next-action minimum-evidence anchor")
next_text = next_text.replace(
    anchor,
    anchor
    + "\nThe Blockbench plugin runtime has also been cleaned before local acceptance: definition factories no longer create/register an unused singleton MCP server, each POST remains request-owned, active TCP sockets have an explicit unload owner, UI CSS/dialog/settings handles are torn down deterministically, dead session/SSE/system-instructions settings were removed, prompt loading is bundled-Local plus user override only, and MCP/package identity now consistently reports BlockIT. No Bedrock capability family or stateless request architecture was removed.\n",
    1,
)
write(next_path, next_text)

# Post-mutation guardrails.
for forbidden in ["getServer", "setServer", "BlockbenchSessionAuth", "mcp_prompt_cdn_enabled", "refreshFromCDN"]:
    remaining = grep_paths(forbidden)
    if remaining:
        raise RuntimeError(f"Cleanup left forbidden runtime symbol {forbidden!r}: {sorted(remaining)}")

print("Applied bounded BlockIT plugin runtime cleanup.")
