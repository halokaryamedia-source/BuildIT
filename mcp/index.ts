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
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_REPOSITORY,
} from "@/lib/productIdentity";
import {
  tools,
  prompts,
  applyMcpToolSurface,
  registerMcpProfile,
} from "@/server/tools";
import {
  MCP_EXTENDED_FAMILIES_SETTING_ID,
  resolveMcpRegistrationProfile,
} from "@/lib/registrationProfile";
import {
  MCP_AUTHORING_PHASE_SETTING_ID,
  resolveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import { resources } from "@/server";
import { registerReferenceModelsResource } from "@/server/resources";
import { uiSetup, uiTeardown } from "@/ui";
import { settingsSetup, settingsTeardown } from "@/ui/settings";
import { setupI18n } from "@/ui/i18n";
import { initPromptLoader } from "@/lib/promptLoader";
import type { NetServer } from "@/server/net";
import createNetServer from "@/server/net";
import { getIcon } from "@/macros/getIcon" with { type: "macro" };

let httpServer: NetServer | null = null;

BBPlugin.register("mcp", {
  version: VERSION,
  title: PRODUCT_NAME,
  author: "Halo Karya Media",
  contributors: ["jasonjgardner", "brokestar233"],
  description: PRODUCT_DESCRIPTION,
  tags: ["MCP", "AI"],
  website: PRODUCT_REPOSITORY,
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

    // Get network module with Blockbench permission handling
    // @ts-ignore - requireNativeModule is a Blockbench global
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

    setupI18n();
    settingsSetup();

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
      Settings.get(MCP_EXTENDED_FAMILIES_SETTING_ID)
    );
    registerMcpProfile(registrationProfile);

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

    // Runtime-conditional resource (depends on the reference_models plugin).
    registerReferenceModelsResource();

    // Local prompt content is bundled into this BlockIT build. Compatible user
    // overrides remain local; stale pre-phase overrides are discarded safely.
    await initPromptLoader();

    // P1.4 default transport is request-owned/stateless Streamable HTTP on
    // loopback. No session timeout, ping, heartbeat, or Mcp-Session-Id state is
    // configured at plugin lifecycle level.
    httpServer = createNetServer(net, {
      port: rawPort,
      endpoint: String(Settings.get("mcp_endpoint") || "/bb-mcp"),
      host: "127.0.0.1",
      profile: registrationProfile,
    });

    uiSetup({
      tools,
      resources,
      prompts,
      profile: registrationProfile,
      phase: authoringPhase,
    });
  },

  onunload() {
    if (httpServer) {
      // close() throws ERR_SERVER_NOT_RUNNING when listen never succeeded;
      // socket teardown must stay unconditional.
      if (httpServer.listening) {
        httpServer.close();
      }
      httpServer.closeActiveSockets();
      httpServer = null;
    }

    uiTeardown();
    settingsTeardown();
  },

  oninstall() {
    Blockbench.showQuickMessage("Installed BlockIT Bedrock Entity MCP", 2000);
  },

  onuninstall() {
    Blockbench.showQuickMessage("Uninstalled BlockIT Bedrock Entity MCP", 2000);
    settingsTeardown();
  },
});