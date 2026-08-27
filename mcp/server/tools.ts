/// <reference types="three" />
/// <reference types="blockbench-types" />

import { createTool, tools, prompts } from "@/lib/factories";
import { z } from "zod";
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  getRegistrationFamilies,
  type McpRegistrationFamily,
  type McpRegistrationProfile,
} from "@/lib/registrationProfile";
import {
  DEFAULT_MCP_AUTHORING_PHASE,
  isMcpToolExposedForPhase,
  setActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import { invalidateToolRegistrationRuntimeCaches } from "@/lib/factories";

// Import tool registration functions
import { registerCameraTools } from "./tools/camera";
import { registerAnimationTools } from "./tools/animation";
import { registerAnimationEffectTools } from "./tools/animation-effects";
import { registerAnimationControllerTools } from "./tools/animation-controller";
import { registerAnimationInspectionTools } from "./tools/animation-inspection";
import { registerCubesTools } from "./tools/cubes";
import { registerElementTools } from "./tools/element";
import { registerElementInspectionTools } from "./tools/element-inspection";
import { registerLocatorTools } from "./tools/locators";
import { registerImportTools } from "./tools/import";
import { registerPaintTools } from "./tools/paint";
import { registerProjectTools } from "./tools/project";
import { registerTextureTools } from "./tools/texture";
import { registerUITools } from "./tools/ui";
import { registerMaterialInstanceTools } from "./tools/material-instances";
import { registerHistoryTools } from "./tools/history";
import { registerExportTools } from "./tools/export";

// Core resource registrations
import { registerValidatorResources } from "./resources/validator";

type RegistrationFunction = () => void;

function registerAnimationFamilyTools(): void {
  registerAnimationTools();
  registerAnimationEffectTools();
  registerAnimationControllerTools();
}

function registerElementFamilyTools(): void {
  registerElementTools();
  registerLocatorTools();
}

/**
 * Registration ownership stays family-level. The profile selects which existing
 * family registration functions are invoked; it does not introduce per-tool
 * ACLs or a dynamic policy engine.
 */
const registrationFunctions: Record<
  McpRegistrationFamily,
  RegistrationFunction
> = {
  animation: registerAnimationFamilyTools,
  animation_inspection: registerAnimationInspectionTools,
  camera: registerCameraTools,
  cubes: registerCubesTools,
  elements: registerElementFamilyTools,
  element_inspection: registerElementInspectionTools,
  export: registerExportTools,
  history: registerHistoryTools,
  import: registerImportTools,
  material_instances: registerMaterialInstanceTools,
  paint: registerPaintTools,
  project: registerProjectTools,
  phase_control: registerPhaseControlTool,
  textures: registerTextureTools,
  ui: registerUITools,
  validator_resources: registerValidatorResources,
};

let activeRegistrationProfile: McpRegistrationProfile =
  DEFAULT_MCP_REGISTRATION_PROFILE;

function registerPhaseControlTool(): void {
  createTool(
    "switch_authoring_phase",
    {
      description:
        "Prepares an explicit authoring-phase handoff. It does not mutate the live tool surface; set the Blockbench MCP Authoring Phase setting, reload BlockIT, and reconnect the MCP client.",
      parameters: z.object({
        target_phase: z.enum(["geometry", "texturing", "animation"]),
        reason: z.string().min(1),
        resume_from: z.string().min(1),
      }),
      async execute({ target_phase, reason, resume_from }) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Phase handoff prepared for ${target_phase}. The current MCP surface is unchanged. Set Blockbench MCP Authoring Phase=${target_phase}, reload BlockIT, then reconnect the MCP client.`,
            },
          ],
          structuredContent: {
            phase: target_phase,
            reason,
            resume_from,
            surface_changed: false,
            reload_required: true,
            action: `set MCP Authoring Phase=${target_phase}; reload BlockIT MCP; reconnect client`,
          },
        };
      },
    },
    "stable",
    false
  );
}

/**
 * Tracks family registration within this plugin load so an explicit extended
 * opt-in adds only the missing fallback families instead of attempting to
 * register the Bedrock Entity core twice.
 */
const registeredFamilies = new Set<McpRegistrationFamily>();
const toolRegistrationFamily = new Map<string, McpRegistrationFamily>();
const catalogToolEnabled = new Map<string, boolean>();
const phaseSurfaceCache = new Map<string, readonly string[]>();

function registerFamily(family: McpRegistrationFamily): void {
  if (registeredFamilies.has(family)) return;

  const before = new Set(Object.keys(tools));
  registrationFunctions[family]();
  registeredFamilies.add(family);

  for (const [name, tool] of Object.entries(tools)) {
    if (before.has(name)) continue;
    toolRegistrationFamily.set(name, family);
    catalogToolEnabled.set(name, tool.enabled);
  }

  phaseSurfaceCache.clear();
}

function surfaceCacheKey(profile: McpRegistrationProfile, phase: McpAuthoringPhase): string {
  return `${profile}|${phase}`;
}

export function describeMcpSurfaceToolNames(
  profile: McpRegistrationProfile,
  phase: McpAuthoringPhase
): readonly string[] {
  return getMcpSurfaceToolNames(profile, phase);
}

export function registerMcpProfile(
  profile: McpRegistrationProfile = DEFAULT_MCP_REGISTRATION_PROFILE
): void {
  activeRegistrationProfile = profile;
  for (const family of getRegistrationFamilies(profile)) {
    registerFamily(family);
  }

  phaseSurfaceCache.clear();
}

export function getToolRegistrationFamily(
  toolName: string
): McpRegistrationFamily | undefined {
  return toolRegistrationFamily.get(toolName);
}

export function isCatalogToolEnabled(toolName: string): boolean {
  return catalogToolEnabled.get(toolName) === true;
}

/**
 * Calculate the exact MCP tool names exposed for one profile + authoring phase
 * without mutating the catalog. Core is always included; only one phase pack is
 * added. Individually disabled tools stay disabled.
 */
export function getMcpSurfaceToolNames(
  profile: McpRegistrationProfile,
  phase: McpAuthoringPhase
): string[] {
  const cacheKey = surfaceCacheKey(profile, phase);
  const cached = phaseSurfaceCache.get(cacheKey);
  if (cached) return [...cached];

  const allowedFamilies = new Set(getRegistrationFamilies(profile));
  const names = Array.from(catalogToolEnabled.entries())
    .map(([toolName]) => toolName)
    .filter((toolName) => {
      const authoredEnabled = catalogToolEnabled.get(toolName);
      if (!authoredEnabled) return false;

      const family = toolRegistrationFamily.get(toolName);
      return Boolean(
        family &&
          allowedFamilies.has(family) &&
          isMcpToolExposedForPhase(toolName, family, phase)
      );
    })
    .sort((a, b) => a.localeCompare(b));

  phaseSurfaceCache.set(cacheKey, names);
  return [...names];
}

/**
 * Apply one deterministic authoring surface before the MCP server starts.
 * Catalog capability is preserved and can be restored on the next plugin load;
 * only tools/list + invocation exposure changes for the active phase.
 */
export function applyMcpToolSurface(
  profile: McpRegistrationProfile,
  phase: McpAuthoringPhase
): void {
  setActiveMcpAuthoringPhase(phase);
  const exposed = new Set(getMcpSurfaceToolNames(profile, phase));

  for (const [toolName, authoredEnabled] of catalogToolEnabled) {
    const tool = tools[toolName];
    if (!tool) continue;
    tool.enabled = authoredEnabled && exposed.has(toolName);
  }

  phaseSurfaceCache.clear();
  invalidateToolRegistrationRuntimeCaches();
}

// Register the full normal Bedrock catalog at module load. Actual plugin startup
// narrows exposure to Core + one authoring phase after settings are available.
registerMcpProfile(DEFAULT_MCP_REGISTRATION_PROFILE);

// Keep a deterministic phase value for helpers/tests before plugin startup,
// without mutating the catalog's authored enabled flags.
setActiveMcpAuthoringPhase(DEFAULT_MCP_AUTHORING_PHASE);

// Function to get tool count - called at runtime after registration
export function getToolCount(): number {
  return Object.keys(tools).length;
}

// Re-export tools and prompts for use by other modules
export { tools, prompts };
