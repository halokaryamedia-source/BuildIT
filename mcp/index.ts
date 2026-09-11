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
  applyMcpToolSurface,
  getActiveMcpRegistrationProfile,
  registerMcpProfile,
  setMcpPhaseSwitchHandler,
  setMcpProfileSwitchHandler,
} from "@/server/tools";
import {
  MCP_AUTHORING_PHASE_SETTING_ID,
  resolveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import {
  claimRuntimeGeneration,
  isRuntimeGenerationCurrent,
  markRuntimeGenerationState,
  type RuntimeGenerationClaim,
} from "@/lib/runtimeLifecycle";
import { getIcon } from "@/macros/getIcon" with { type: "macro" };
import {
  setupLocalDevAutoReload,
  stopLocalDevAutoReload,
} from "@/plugin/devSync";
import { RuntimeHost } from "@/plugin/runtimeHost";
import { BlockbenchIntegration } from "@/plugin/blockbenchIntegration";

const runtimeHost = new RuntimeHost();
const blockbenchIntegration = new BlockbenchIntegration();
let runtimeGeneration: number | null = null;
let initializationInProgress: Promise<void> | null = null;

function currentBuildIdentity(): string | null {
  return (
    (
      globalThis as typeof globalThis & {
        __BLOCKIT_BUILD_ID__?: unknown;
      }
    ).__BLOCKIT_BUILD_ID__ as string | undefined
  ) ?? null;
}

function beginBlockItRuntimeTeardown(
  generation: number | null = runtimeGeneration
): void {
  if (generation !== null && runtimeGeneration === generation) {
    runtimeGeneration = null;
  }
  initializationInProgress = null;

  // Blockbench does not await plugin onunload(). Detach integration callbacks
  // synchronously, then let RuntimeHost + the lifecycle coordinator drain native
  // work and listener shutdown before a new generation binds.
  stopLocalDevAutoReload();
  setMcpPhaseSwitchHandler(() => undefined);
  setMcpProfileSwitchHandler(() => undefined);
  blockbenchIntegration.teardown();
  runtimeHost.teardown(generation);
}

async function initializeBlockItRuntime(
  claim: RuntimeGenerationClaim
): Promise<void> {
  const { generation, priorTeardown } = claim;
  await priorTeardown;
  if (!isRuntimeGenerationCurrent(generation)) return;
  if (!runtimeHost.acquireNativeNetwork(generation)) return;

  const registrationProfile = blockbenchIntegration.setupBase({
    generation,
    isGenerationCurrent: isRuntimeGenerationCurrent,
  });
  registerMcpProfile(registrationProfile);

  setMcpProfileSwitchHandler((profile) => {
    if (!isRuntimeGenerationCurrent(generation)) return;
    runtimeHost.updateProfile(profile);
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
    runtimeHost.updateSurface(activeProfile, targetPhase);
    Blockbench.showQuickMessage(
      `LazyDesigner MCP phase switched to ${targetPhase}. Gateway clients refresh automatically.`,
      2000
    );
  });

  if (!(await blockbenchIntegration.loadPrompts())) return;

  runtimeHost.setConfig({
    port: rawPort,
    endpoint: String(Settings.get("mcp_endpoint") || "/bb-mcp"),
    profile: registrationProfile,
    phase: authoringPhase,
  });

  if (!(await runtimeHost.start(generation))) return;
  if (!isRuntimeGenerationCurrent(generation)) return;

  blockbenchIntegration.setupUi(registrationProfile, authoringPhase);
  setupLocalDevAutoReload(generation, currentBuildIdentity());
}

BBPlugin.register("blockit_mcp", {
  version: VERSION,
  title: PRODUCT_NAME,
  author: "Anonymous",
  description: PRODUCT_DESCRIPTION,
  about: PRODUCT_ABOUT,
  tags: ["MCP", "AI"],
  repository: "",
  bug_tracker: "",
  icon: getIcon(),
  variant: "desktop",

  onload() {
    if (
      initializationInProgress ||
      (runtimeGeneration !== null &&
        isRuntimeGenerationCurrent(runtimeGeneration))
    ) {
      console.error(
        "[MCP] Plugin onload called while this generation is already active."
      );
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
    blockbenchIntegration.teardown();
  },
});
