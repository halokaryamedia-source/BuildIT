import { tools } from "@/lib/factories";
import { invalidateToolRegistrationRuntimeCaches } from "@/lib/factories";
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  getRegistrationFamilies,
  type McpRegistrationFamily,
  type McpRegistrationProfile,
} from "@/lib/registrationProfile";
import {
  getActiveMcpAuthoringPhase,
  isMcpToolExposedForPhase,
  setActiveMcpAuthoringPhase,
  type McpAuthoringPhase,
} from "@/lib/authoringPhase";
import { registerCameraTools } from "../tools/camera";
import { registerAnimationTools } from "../tools/animation";
import { registerAnimationEffectTools } from "../tools/animation-effects";
import { registerAnimationControllerTools } from "../tools/animation-controller";
import { registerAnimationInspectionTools } from "../tools/animation-inspection";
import { registerParticleTools } from "../tools/particle";
import { registerParticleResources } from "../resources/particle";
import { wireAnimationRuntimeContracts } from "../tools/animation-runtime-wiring";
import { registerCubesTools } from "../tools/cubes";
import { registerElementTools } from "../tools/element";
import { registerElementInspectionTools } from "../tools/element-inspection";
import { registerLocatorTools } from "../tools/locators";
import { registerImportTools } from "../tools/import";
import { registerPaintTools } from "../tools/paint";
import { registerProjectTools } from "../tools/project";
import { registerTextureTools } from "../tools/texture";
import {
  registerPaintTextureTransactionTool,
  wireTextureRuntimeContracts,
} from "../tools/prelocal-wiring";
import { registerUITools } from "../tools/ui";
import { registerMaterialInstanceTools } from "../tools/material-instances";
import { registerHistoryTools } from "../tools/history";
import { registerExportTools } from "../tools/export";
import { registerValidatorResources } from "../resources/validator";
import { registerConsolidatedTools } from "./consolidatedTools";
import { registerPhaseControlTool } from "./phaseControl";

type RegistrationFunction = () => void;

function registerAnimationFamilyTools(): void {
  registerAnimationTools();
  registerAnimationEffectTools();
  registerAnimationControllerTools();
  registerParticleTools();
  registerParticleResources();
}

function registerElementFamilyTools(): void {
  registerElementTools();
  registerLocatorTools();
}

function registerPaintFamilyTools(): void {
  registerPaintTools();
  registerPaintTextureTransactionTool();
}

function registerTextureFamilyTools(): void {
  registerTextureTools();
  wireTextureRuntimeContracts();
}

const registrationFunctions: Record<McpRegistrationFamily, RegistrationFunction> = {
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
  paint: registerPaintFamilyTools,
  project: registerProjectTools,
  phase_control: registerPhaseControlTool,
  textures: registerTextureFamilyTools,
  ui: registerUITools,
  validator_resources: registerValidatorResources,
};

let activeRegistrationProfile: McpRegistrationProfile =
  DEFAULT_MCP_REGISTRATION_PROFILE;
let profileSwitchHandler:
  | ((profile: McpRegistrationProfile) => void)
  | undefined;

const registeredFamilies = new Set<McpRegistrationFamily>();
const toolRegistrationFamily = new Map<string, McpRegistrationFamily>();
const catalogToolEnabled = new Map<string, boolean>();
const phaseSurfaceCache = new Map<string, readonly string[]>();

function updateCatalogTool(
  toolName: string,
  family: McpRegistrationFamily,
  enabled: boolean
): void {
  toolRegistrationFamily.set(toolName, family);
  catalogToolEnabled.set(toolName, enabled);
  phaseSurfaceCache.clear();
}

function registerFamily(family: McpRegistrationFamily): void {
  if (registeredFamilies.has(family)) return;

  const before = new Set(Object.keys(tools));
  registrationFunctions[family]();
  registeredFamilies.add(family);

  for (const [name, tool] of Object.entries(tools)) {
    if (before.has(name)) continue;
    updateCatalogTool(name, family, tool.enabled);
  }
}

function surfaceCacheKey(
  profile: McpRegistrationProfile,
  phase: McpAuthoringPhase
): string {
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

  if (profile === DEFAULT_MCP_REGISTRATION_PROFILE) {
    registerConsolidatedTools(updateCatalogTool);
    wireAnimationRuntimeContracts();
  }

  phaseSurfaceCache.clear();
}

export function getActiveMcpRegistrationProfile(): McpRegistrationProfile {
  return activeRegistrationProfile;
}

export function setMcpProfileSwitchHandler(
  handler: (profile: McpRegistrationProfile) => void
): void {
  profileSwitchHandler = handler;
}

export function applyMcpRegistrationProfile(
  profile: McpRegistrationProfile
): void {
  registerMcpProfile(profile);
  applyMcpToolSurface(profile, getActiveMcpAuthoringPhase());
  profileSwitchHandler?.(profile);
}

export function getToolRegistrationFamily(
  toolName: string
): McpRegistrationFamily | undefined {
  return toolRegistrationFamily.get(toolName);
}

export function isCatalogToolEnabled(toolName: string): boolean {
  return catalogToolEnabled.get(toolName) === true;
}

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

export function getToolCount(): number {
  return Object.keys(tools).length;
}
