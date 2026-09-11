/**
 * @author jasonjgardner
 * @discord jason.gardner
 * @github https://github.com/jasonjgardner
 */
/// <reference types="three" />
/// <reference types="blockbench-types" />
import { VERSION } from "@/lib/constants";
import {
  PRODUCT_ABOUT,
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
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

  setExtendedMcpProfileHandler,
  clearExtendedMcpProfileHandler,
  settingsSetup,
  settingsTeardown,
} from "@/ui/settings";
import { setupI18n } from "@/ui/i18n";
import { initPromptLoader } from "@/lib/promptLoader";
import type { NetServer } from "@/server/net";
import createNetServer from "@/server/net";
import {
  beginRuntimeGenerationTeardown,
  claimRuntimeGeneration,
  isRuntimeGenerationCurrent,
  markRuntimeGenerationState,
  type RuntimeGenerationClaim,
} from "@/lib/runtimeLifecycle";
import { getIcon } from "@/macros/getIcon" with { type: "macro" };

type LocalDevFileWatcher = { close(): void };
type LocalDevFilesystem = {
  watch(
    path: string,
    listener: (eventType?: string, filename?: string | Buffer) => void
  ): LocalDevFileWatcher;
  readFileSync(path: string, encoding: "utf8"): string;
};
type ReloadableBlockItPlugin = {
  id?: string;
  source?: string;
  path?: string;
  reload?: () => unknown;
  isReloadable?: () => boolean;
};

const SERVER_BIND_TIMEOUT_MS = 3_000;

let httpServer: NetServer | null = null;

let nativeNet: Parameters<typeof createNetServer>[0] | null = null;
let serverConfig: {
  port: number;
  endpoint: string;
  profile: ReturnType<typeof resolveMcpRegistrationProfile>;
  phase: McpAuthoringPhase;
} | null = null;
let runtimeGeneration: number | null = null;
let initializationInProgress: Promise<void> | null = null;

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
    let timer: ReturnType<typeof setTimeout> | null = null;
    const cleanup = () => {
      server.off("listening", onListening);
      server.off("error", onError);
      server.off("close", onClose);
      if (timer) clearTimeout(timer);
      timer = null;
    };
    const onListening = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error("LazyDesigner MCP listener closed before binding completed."));
    };
    server.once("listening", onListening);
    server.once("error", onError);
    server.once("close", onClose);
    timer = setTimeout(() => {
      cleanup();
      reject(
        new Error(
          `LazyDesigner MCP listener did not bind within ${SERVER_BIND_TIMEOUT_MS}ms.`
        )
      );
    }, SERVER_BIND_TIMEOUT_MS);
  });
}

async function startMcpServer(generation: number): Promise<boolean> {
  if (
    !isRuntimeGenerationCurrent(generation) ||
    !nativeNet ||
    !serverConfig ||
    httpServer
  ) {
    return false;
  }

  const config = serverConfig;
  setStatusBarState("starting", `binding ${config.port}`);
  const candidate = createNetServer(nativeNet, { ...config, generation });
  // Keep the pending listener owned so unload/restart can quiesce it even before
  // Node emits `listening`. UI readiness is still published only after bind.
  httpServer = candidate;

  try {
    await waitForServerListening(candidate);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    candidate.closeActiveSockets();
    await candidate.closeAndWait();
    if (httpServer === candidate) httpServer = null;
    if (isRuntimeGenerationCurrent(generation)) {
      markRuntimeGenerationState(generation, "failed");
      setStatusBarState("failed", reason);
      Blockbench.showQuickMessage(
        `LazyDesigner MCP failed to start: ${reason}. Close the old MCP instance or free port ${config.port}.`,
        6000
      );
    }
    return false;
  }

  if (!isRuntimeGenerationCurrent(generation)) {
    if (httpServer === candidate) httpServer = null;
    await candidate.closeAndWait();
    return false;
  }

  markRuntimeGenerationState(generation, "running");
  setStatusBarState("running", `${config.port}${config.endpoint}`);
  return true;
}

function beginBlockItRuntimeTeardown(
  generation: number | null = runtimeGeneration
): void {
  if (generation !== null && runtimeGeneration === generation) {
    runtimeGeneration = null;
  }
  initializationInProgress = null;

  // Blockbench does not await plugin onunload(). Detach user-facing and callback
  // ownership synchronously, then let the global lifecycle barrier finish native
  // operation drain and listener shutdown before a new generation binds.
  stopLocalDevAutoReload();
  setMcpPhaseSwitchHandler(() => undefined);
  setMcpProfileSwitchHandler(() => undefined);
  clearExtendedMcpProfileHandler();
  uiTeardown();

  settingsTeardown();

  const current = httpServer;
  httpServer = null;
  const closePromise = current?.closeAndWait() ?? Promise.resolve();

  nativeNet = null;
  serverConfig = null;

  if (generation === null) {
    void closePromise.catch((error) => {
      console.error("[MCP] LazyDesigner listener cleanup failed", error);
    });
    return;
  }

  void beginRuntimeGenerationTeardown(generation, async () => {
    await closePromise;
  }).catch((error) => {
    console.error("[MCP] LazyDesigner runtime teardown failed", error);
  });
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

function splitPluginPath(path: string): { directory: string; filename: string } {
  const slash = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
  return {
    directory: slash >= 0 ? path.slice(0, slash) || "." : ".",
    filename: slash >= 0 ? path.slice(slash + 1) : path,
  };
}

function setupLocalDevAutoReload(generation: number): void {
  if (
    process.env.NODE_ENV !== "development" ||
    localDevFileWatcher ||
    !isRuntimeGenerationCurrent(generation)
  ) {
    return;
  }

  const plugin = getReloadableBlockItPlugin();
  if (
    !plugin ||
    plugin.source !== "file" ||
    !plugin.path ||
    typeof plugin.reload !== "function" ||
    (typeof plugin.isReloadable === "function" && !plugin.isReloadable())
  ) {
    console.warn(
      "[MCP] dev:sync auto-reload requires LazyDesigner to be loaded as a reloadable file-based plugin."
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
    message: "LazyDesigner development sync watches its local plugin directory for successful atomic rebuilds.",
    detail: "This is used only by development builds to reload the file-based LazyDesigner plugin automatically.",
    optional: true,
  }) as LocalDevFilesystem | null;
  if (!devFs) {
    console.warn("[MCP] dev:sync auto-reload disabled: filesystem access was not granted.");
    return;
  }

  const { directory: watchDirectory, filename: pluginFilename } = splitPluginPath(
    plugin.path
  );

  const scheduleReload = () => {
    if (!isRuntimeGenerationCurrent(generation)) return;
    if (localDevReloadTimer) clearTimeout(localDevReloadTimer);
    localDevReloadTimer = setTimeout(() => {
      localDevReloadTimer = null;
      if (
        localDevReloadInProgress ||
        !isRuntimeGenerationCurrent(generation)
      ) {
        return;
      }

      let nextContent: string;
      try {
        nextContent = devFs.readFileSync(plugin.path!, "utf8");
      } catch (error) {
        console.warn("[MCP] dev:sync could not read the updated plugin file", error);
        return;
      }

      const nextBuildIdentity = embeddedBuildIdentity(nextContent);
      if (!nextBuildIdentity || nextBuildIdentity === runningBuildIdentity) return;

      localDevReloadInProgress = Promise.resolve()
        .then(() => {
          if (!isRuntimeGenerationCurrent(generation)) return;
          console.log(
            `[MCP] Development bundle changed ${runningBuildIdentity} → ${nextBuildIdentity}; reloading LazyDesigner through native plugin lifecycle.`
          );
          plugin.reload?.();
        })
        .catch((error) => {
          console.error("[MCP] Automatic development plugin reload failed", error);
          Blockbench.showQuickMessage(
            "LazyDesigner dev sync could not reload automatically; use the plugin Reload action once.",
            5000
          );
        })
        .finally(() => {
          localDevReloadInProgress = null;
        });
    }, 250);
  };

  try {
    localDevFileWatcher = devFs.watch(
      watchDirectory,
      (_eventType, changedFilename) => {
        if (changedFilename !== undefined) {
          const changed = String(changedFilename).replace(/\\/g, "/").split("/").pop();
          if (changed && changed !== pluginFilename) return;
        }
        scheduleReload();
      }
    );
    console.log(`[MCP] dev:sync auto-reload watching ${watchDirectory}`);
    // One cheap startup reconciliation closes the missed-event window created by
    // atomic file replacement; production builds never execute this path.
    scheduleReload();
  } catch (error) {
    console.warn("[MCP] dev:sync auto-reload watcher could not start", error);
  }
}

async function initializeBlockItRuntime(
  claim: RuntimeGenerationClaim
): Promise<void> {
  const { generation, priorTeardown } = claim;
  await priorTeardown;
  if (!isRuntimeGenerationCurrent(generation)) return;

  // Get network module with Blockbench permission handling.
  const net = requireNativeModule("net", {
    message: "Network access is required for the MCP server to accept connections.",
    detail: "The MCP plugin needs to create a local server that AI assistants can connect to.",
    optional: false,
  });

  if (!net) {
    markRuntimeGenerationState(generation, "failed");
    console.error("[MCP] Failed to get net module - server will not start");
    Blockbench.showQuickMessage("MCP Server requires network permission", 3000);
    return;
  }
  nativeNet = net;

  setupI18n();
  settingsSetup();

  setMcpProfileSwitchHandler((profile) => {
    if (!isRuntimeGenerationCurrent(generation)) return;
    if (serverConfig) serverConfig.profile = profile;
    Blockbench.showQuickMessage(
      `LazyDesigner compatibility surface switched to ${profile}. Gateway clients refresh automatically.`,
      2000
    );
  });

  const rawPort = Number(Settings.get("mcp_port") || 3000);
  if (!Number.isInteger(rawPort) || rawPort < 1 || rawPort > 65535) {
    markRuntimeGenerationState(generation, "failed");
    console.error(
      `[MCP] Invalid mcp_port value "${Settings.get("mcp_port")}" - server will not start. Set a port between 1 and 65535 in plugin settings.`
    );
    Blockbench.showQuickMessage("MCP Server: invalid port in settings", 3000);
    return;
  }

  // Bedrock Entity remains the catalog truth. The optional extended setting
  // adds Legacy UI Fallback families for debug/maintenance compatibility.
  // Geometry and Texturing still share AUTHORING; Animation remains separate.
  const registrationProfile = resolveMcpRegistrationProfile(
    isExtendedMcpFamiliesEnabled()
  );
  registerMcpProfile(registrationProfile);
  setExtendedMcpProfileHandler((enabled) => {
    if (!isRuntimeGenerationCurrent(generation)) return;
    applyMcpRegistrationProfile(resolveMcpRegistrationProfile(enabled));
  });

  let authoringPhase: McpAuthoringPhase;
  try {
    authoringPhase = resolveMcpAuthoringPhase(
      Settings.get(MCP_AUTHORING_PHASE_SETTING_ID)
    );
  } catch (error) {
    markRuntimeGenerationState(generation, "failed");
    console.error("[MCP] Invalid authoring phase setting - server will not start", error);
    Blockbench.showQuickMessage(
      "MCP Server: invalid Authoring Phase setting",
      3000
    );
    return;
  }
  applyMcpToolSurface(registrationProfile, authoringPhase);
  setMcpPhaseSwitchHandler((targetPhase) => {
    if (!isRuntimeGenerationCurrent(generation)) return;
    const activeProfile = getActiveMcpRegistrationProfile();
    applyMcpToolSurface(activeProfile, targetPhase);
    if (serverConfig) {
      serverConfig.profile = activeProfile;
      serverConfig.phase = targetPhase;
    }
    Blockbench.showQuickMessage(
      `LazyDesigner MCP phase switched to ${targetPhase}. Gateway clients refresh automatically.`,
      2000
    );
  });

  // Runtime-conditional resource (depends on the reference_models plugin).
  registerReferenceModelsResource();

  // Local prompt content is bundled into this LazyDesigner build. Compatible user
  // overrides remain local; stale pre-phase overrides are discarded safely.
  await initPromptLoader();
  if (!isRuntimeGenerationCurrent(generation)) return;

  // P1.4 default transport is request-owned/stateless Streamable HTTP on
  // loopback. No session timeout, ping, heartbeat, or Mcp-Session-Id state is
  // configured at plugin lifecycle level.
  serverConfig = {
    port: rawPort,
    endpoint: String(Settings.get("mcp_endpoint") || "/bb-mcp"),
    profile: registrationProfile,
    phase: authoringPhase,
  };

  if (!(await startMcpServer(generation))) return;
  if (!isRuntimeGenerationCurrent(generation)) return;

  uiSetup({
    tools,
    resources,
    prompts,
    profile: registrationProfile,
    phase: authoringPhase,
  });
  setupLocalDevAutoReload(generation);
}

BBPlugin.register("blockit_mcp", {
  version: VERSION,
  title: PRODUCT_NAME,
  author: "Anonymous",
  description: PRODUCT_DESCRIPTION,
  about: PRODUCT_ABOUT,
  tags: ["MCP", "AI"],
  // Explicitly clear old account links when reloading an existing install.
  repository: "",
  bug_tracker: "",
  icon: getIcon(),
  variant: "desktop",
  onload() {
    // Blockbench does not await plugin lifecycle callbacks. Keep this callback
    // synchronous and let the coordinator-owned generation serialize async boot.
    if (
      initializationInProgress ||
      (runtimeGeneration !== null &&
        isRuntimeGenerationCurrent(runtimeGeneration))
    ) {
      console.error("[MCP] Plugin onload called while this generation is already active.");
      return;
    }

    const claim = claimRuntimeGeneration(currentBuildIdentity());
    runtimeGeneration = claim.generation;
    const initialization = initializeBlockItRuntime(claim);
    initializationInProgress = initialization;
    void initialization
      .catch((error) => {
        if (!isRuntimeGenerationCurrent(claim.generation)) return;
        markRuntimeGenerationState(claim.generation, "failed");
        console.error("[MCP] LazyDesigner runtime initialization failed", error);
        Blockbench.showQuickMessage(
          `LazyDesigner MCP initialization failed: ${error instanceof Error ? error.message : String(error)}`,
          6000
        );
      })
      .finally(() => {
        if (initializationInProgress === initialization) {
          initializationInProgress = null;
        }
      });
  },

  onunload() {
    beginBlockItRuntimeTeardown();
  },

  oninstall() {
    Blockbench.showQuickMessage("Installed LazyDesigner Bedrock Entity MCP", 2000);
  },

  onuninstall() {
    Blockbench.showQuickMessage("Uninstalled LazyDesigner Bedrock Entity MCP", 2000);
    settingsTeardown();
  },
});
