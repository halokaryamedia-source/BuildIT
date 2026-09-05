/**
 * @author jasonjgardner
 * @discord jason.gardner
 * @github https://github.com/jasonjgardner
 */
/// <reference types="three" />
/// <reference types="blockbench-types" />
import { VERSION } from "@/lib/constants";
import {
  PRODUCT_BUG_TRACKER,
  PRODUCT_ABOUT,
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_REPOSITORY,
} from "@/lib/productIdentity";
import {
  tools,
  prompts,
  applyMcpToolSurface,
  applyMcpRegistrationProfile,
  getActiveMcpRegistrationProfile,
  registerMcpProfile,
  setMcpPhaseSwitchHandler,
  setMcpProfileSwitchHandler,
} from "@/server/tools";
import { resolveMcpRegistrationProfile } from "@/lib/registrationProfile";
import {
  MCP_AUTHORING_PHASE_SETTING_ID,
  resolveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import { resources } from "@/server";
import { registerReferenceModelsResource } from "@/server/resources";
import { uiSetup, uiTeardown } from "@/ui";
import { setStatusBarState } from "@/ui/statusBar";
import {
  isExtendedMcpFamiliesEnabled,
  setExtendedMcpFamiliesEnabled,
  setExtendedMcpProfileHandler,
  clearExtendedMcpProfileHandler,
  settingsSetup,
  settingsTeardown,
} from "@/ui/settings";
import { setupI18n } from "@/ui/i18n";
import { initPromptLoader } from "@/lib/promptLoader";
import type { NetServer } from "@/server/net";
import createNetServer from "@/server/net";
import { getIcon } from "@/macros/getIcon" with { type: "macro" };

type LocalDevFileWatcher = { close(): void };
type LocalDevFilesystem = {
  watch(path: string, listener: () => void): LocalDevFileWatcher;
  readFileSync(path: string, encoding: "utf8"): string;
};
type ReloadableBlockItPlugin = {
  id?: string;
  source?: string;
  path?: string;
  reload?: () => unknown;
  isReloadable?: () => boolean;
};

let httpServer: NetServer | null = null;
let profileActions: Action[] = [];
let nativeNet: Parameters<typeof createNetServer>[0] | null = null;
let serverConfig: {
  port: number;
  endpoint: string;
  profile: ReturnType<typeof resolveMcpRegistrationProfile>;
  phase: McpAuthoringPhase;
} | null = null;
let restartInProgress: Promise<void> | null = null;
let localDevFileWatcher: LocalDevFileWatcher | null = null;
let localDevReloadTimer: ReturnType<typeof setTimeout> | null = null;
let localDevReloadInProgress: Promise<void> | null = null;

function embeddedBuildIdentity(content: string): string | null {
  return (
    content.match(
      /globalThis\.__BLOCKIT_BUILD_ID__\s*=\s*["'](sha256:[a-f0-9]{64})["']/
    )?.[1] ?? null
  );
}

function currentBuildIdentity(): string | null {
  return (
    (
      globalThis as typeof globalThis & {
        __BLOCKIT_BUILD_ID__?: unknown;
      }
    ).__BLOCKIT_BUILD_ID__ as string | undefined
  ) ?? null;
}

function stopLocalDevAutoReload(): void {
  if (localDevReloadTimer) {
    clearTimeout(localDevReloadTimer);
    localDevReloadTimer = null;
  }
  localDevFileWatcher?.close();
  localDevFileWatcher = null;
}

async function waitForServerListening(server: NetServer): Promise<void> {
  if (server.listening) return;

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      server.off("listening", onListening);
      server.off("error", onError);
    };
    const onListening = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    server.once("listening", onListening);
    server.once("error", onError);
  });
}

async function startMcpServer(): Promise<boolean> {
  if (!nativeNet || !serverConfig || httpServer) return false;

  const config = serverConfig;
  setStatusBarState("starting", `binding ${config.port}`);
  const candidate = createNetServer(nativeNet, config);

  try {
    await waitForServerListening(candidate);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    candidate.closeActiveSockets();
    await candidate.closeAndWait();
    setStatusBarState("failed", reason);
    Blockbench.showQuickMessage(
      `BlockIT MCP failed to start: ${reason}. Close the old MCP instance or free port ${config.port}.`,
      6000
    );
    return false;
  }

  httpServer = candidate;
  setStatusBarState("running", `${config.port}${config.endpoint}`);
  return true;
}

async function restartMcpServer(): Promise<void> {
  if (restartInProgress || !nativeNet || !serverConfig) return;

  restartInProgress = (async () => {
    setStatusBarState("starting", "restarting");
    const current = httpServer;
    httpServer = null;
    if (current) await current.closeAndWait();

    const started = await startMcpServer();
    if (started) {
      Blockbench.showQuickMessage(
        "BlockIT MCP server restarted. Gateway clients reconnect automatically; direct native MCP clients may need to refresh.",
        4000
      );
    }
  })().finally(() => {
    restartInProgress = null;
  });

  await restartInProgress;
}

async function teardownBlockItRuntime(): Promise<void> {
  stopLocalDevAutoReload();
  setMcpPhaseSwitchHandler(() => undefined);
  setMcpProfileSwitchHandler(() => undefined);
  clearExtendedMcpProfileHandler();

  const pendingRestart = restartInProgress;
  if (pendingRestart) {
    try {
      await pendingRestart;
    } catch {
      // The restart path already reports its own failure; teardown continues.
    }
  }
  restartInProgress = null;

  const current = httpServer;
  httpServer = null;
  if (current) await current.closeAndWait();

  nativeNet = null;
  serverConfig = null;

  uiTeardown();
  teardownProfileActions();
  settingsTeardown();
}

function getReloadableBlockItPlugin(): ReloadableBlockItPlugin | null {
  const pluginState = Plugins as unknown as {
    registered?: Record<string, ReloadableBlockItPlugin>;
    all?: ReloadableBlockItPlugin[];
  };
  return (
    pluginState.registered?.blockit_mcp ??
    pluginState.all?.find((plugin) => plugin.id === "blockit_mcp") ??
    null
  );
}

function setupLocalDevAutoReload(): void {
  if (process.env.NODE_ENV !== "development" || localDevFileWatcher) return;

  const plugin = getReloadableBlockItPlugin();
  if (
    !plugin ||
    plugin.source !== "file" ||
    !plugin.path ||
    typeof plugin.reload !== "function" ||
    (typeof plugin.isReloadable === "function" && !plugin.isReloadable())
  ) {
    console.warn(
      "[MCP] dev:sync auto-reload requires BlockIT to be loaded as a reloadable file-based plugin."
    );
    return;
  }

  const runningBuildIdentity = currentBuildIdentity();
  if (!runningBuildIdentity) {
    console.warn("[MCP] dev:sync auto-reload disabled: current build_identity is unavailable.");
    return;
  }

  // @ts-ignore - requireNativeModule is a Blockbench desktop global.
  const devFs = requireNativeModule("fs", {
    message: "BlockIT development sync watches its local plugin file for successful rebuilds.",
    detail: "This is used only by development builds to reload the file-based BlockIT plugin automatically.",
    optional: true,
  }) as LocalDevFilesystem | null;
  if (!devFs) {
    console.warn("[MCP] dev:sync auto-reload disabled: filesystem access was not granted.");
    return;
  }

  const scheduleReload = () => {
    if (localDevReloadTimer) clearTimeout(localDevReloadTimer);
    localDevReloadTimer = setTimeout(() => {
      localDevReloadTimer = null;
      if (localDevReloadInProgress) return;

      let nextContent: string;
      try {
        nextContent = devFs.readFileSync(plugin.path!, "utf8");
      } catch (error) {
        console.warn("[MCP] dev:sync could not read the updated plugin file", error);
        return;
      }

      const nextBuildIdentity = embeddedBuildIdentity(nextContent);
      if (!nextBuildIdentity || nextBuildIdentity === runningBuildIdentity) return;

      localDevReloadInProgress = (async () => {
        console.log(
          `[MCP] Development bundle changed ${runningBuildIdentity} → ${nextBuildIdentity}; safely reloading BlockIT.`
        );
        await teardownBlockItRuntime();
        plugin.reload?.();
      })()
        .catch((error) => {
          console.error("[MCP] Automatic development plugin reload failed", error);
          Blockbench.showQuickMessage(
            "BlockIT dev sync could not reload automatically; use the plugin Reload action once.",
            5000
          );
        })
        .finally(() => {
          localDevReloadInProgress = null;
        });
    }, 250);
  };

  try {
    localDevFileWatcher = devFs.watch(plugin.path, scheduleReload);
    console.log(`[MCP] dev:sync auto-reload watching ${plugin.path}`);
  } catch (error) {
    console.warn("[MCP] dev:sync auto-reload watcher could not start", error);
  }
}

function setupProfileActions(): void {
  profileActions = [
    new Action("blockit_restart_mcp_server", {
      name: "Restart BlockIT MCP Server",
      description: "Safely close MCP sockets and bind the local server again.",
      icon: "refresh",
      plugin: "blockit_mcp",
      click: () => void restartMcpServer(),
    }),
    new Action("blockit_enable_extended", {
      name: "Enable BlockIT Extended MCP Profile",
      description: "Enable the opt-in generic Blockbench fallback families.",
      icon: "extension",
      plugin: "blockit_mcp",
      click: () => setExtendedMcpFamiliesEnabled(true),
    }),
    new Action("blockit_disable_extended", {
      name: "Disable BlockIT Extended MCP Profile",
      description: "Return BlockIT to the default Bedrock Entity profile.",
      icon: "extension",
      plugin: "blockit_mcp",
      click: () => setExtendedMcpFamiliesEnabled(false),
    }),
  ];
  for (const action of profileActions) MenuBar.addAction(action, "tools");
}

function teardownProfileActions(): void {
  for (const action of profileActions) action.delete();
  profileActions = [];
}

BBPlugin.register("blockit_mcp", {
  version: VERSION,
  title: PRODUCT_NAME,
  author: "Halo Karya Media",
  description: PRODUCT_DESCRIPTION,
  about: PRODUCT_ABOUT,
  tags: ["MCP", "AI"],
  repository: PRODUCT_REPOSITORY,
  bug_tracker: PRODUCT_BUG_TRACKER,
  icon: getIcon(),
  variant: "desktop",
  async onload() {
    // Guard against double onload without onunload: re-creating the server
    // would leak the previous listener and keep the port occupied.
    if (httpServer) {
      console.error("[MCP] Plugin onload called while the server is already running.");
      return;
    }

    // Get network module with Blockbench permission handling.
    const net = requireNativeModule("net", {
      message: "Network access is required for the MCP server to accept connections.",
      detail: "The MCP plugin needs to create a local server that AI assistants can connect to.",
      optional: false,
    });

    if (!net) {
      console.error("[MCP] Failed to get net module - server will not start");
      Blockbench.showQuickMessage("MCP Server requires network permission", 3000);
      return;
    }
    nativeNet = net;

    setupI18n();
    settingsSetup();
    setupProfileActions();
    setMcpProfileSwitchHandler((profile) => {
      if (serverConfig) serverConfig.profile = profile;
      Blockbench.showQuickMessage(
        `BlockIT MCP profile switched to ${profile}. Gateway clients refresh automatically.`,
        2000
      );
    });

    const rawPort = Number(Settings.get("mcp_port") || 3000);
    if (!Number.isInteger(rawPort) || rawPort < 1 || rawPort > 65535) {
      console.error(
        `[MCP] Invalid mcp_port value "${Settings.get("mcp_port")}" - server will not start. Set a port between 1 and 65535 in plugin settings.`
      );
      Blockbench.showQuickMessage("MCP Server: invalid port in settings", 3000);
      return;
    }

    // Bedrock Entity remains the catalog truth. The optional extended setting
    // may add generic fallback families, then authoring phase exposure narrows
    // the actual MCP surface to Core + exactly one phase for this plugin load.
    const registrationProfile = resolveMcpRegistrationProfile(
      isExtendedMcpFamiliesEnabled()
    );
    registerMcpProfile(registrationProfile);
    setExtendedMcpProfileHandler((enabled) => {
      applyMcpRegistrationProfile(resolveMcpRegistrationProfile(enabled));
    });

    let authoringPhase: McpAuthoringPhase;
    try {
      authoringPhase = resolveMcpAuthoringPhase(
        Settings.get(MCP_AUTHORING_PHASE_SETTING_ID)
      );
    } catch (error) {
      console.error("[MCP] Invalid authoring phase setting - server will not start", error);
      Blockbench.showQuickMessage(
        "MCP Server: invalid Authoring Phase setting",
        3000
      );
      return;
    }
    applyMcpToolSurface(registrationProfile, authoringPhase);
    setMcpPhaseSwitchHandler((targetPhase) => {
      const activeProfile = getActiveMcpRegistrationProfile();
      applyMcpToolSurface(activeProfile, targetPhase);
      if (serverConfig) {
        serverConfig.profile = activeProfile;
        serverConfig.phase = targetPhase;
      }
      Blockbench.showQuickMessage(
        `BlockIT MCP phase switched to ${targetPhase}. Gateway clients refresh automatically.`,
        2000
      );
    });

    // Runtime-conditional resource (depends on the reference_models plugin).
    registerReferenceModelsResource();

    // Local prompt content is bundled into this BlockIT build. Compatible user
    // overrides remain local; stale pre-phase overrides are discarded safely.
    await initPromptLoader();

    // P1.4 default transport is request-owned/stateless Streamable HTTP on
    // loopback. No session timeout, ping, heartbeat, or Mcp-Session-Id state is
    // configured at plugin lifecycle level.
    serverConfig = {
      port: rawPort,
      endpoint: String(Settings.get("mcp_endpoint") || "/bb-mcp"),
      profile: registrationProfile,
      phase: authoringPhase,
    };

    if (!(await startMcpServer())) return;

    uiSetup({
      tools,
      resources,
      prompts,
      profile: registrationProfile,
      phase: authoringPhase,
    });
    setupLocalDevAutoReload();
  },

  async onunload() {
    await teardownBlockItRuntime();
  },

  oninstall() {
    Blockbench.showQuickMessage("Installed BlockIT Bedrock Entity MCP", 2000);
  },

  onuninstall() {
    Blockbench.showQuickMessage("Uninstalled BlockIT Bedrock Entity MCP", 2000);
    settingsTeardown();
  },
});
