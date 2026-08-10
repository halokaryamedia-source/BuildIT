/// <reference types="three" />
/// <reference types="blockbench-types" />

import { tools, prompts } from "@/lib/factories";
import {
  DEFAULT_MCP_REGISTRATION_PROFILE,
  getRegistrationFamilies,
  type McpRegistrationFamily,
  type McpRegistrationProfile,
} from "@/lib/registrationProfile";

// Import tool registration functions
import { registerCameraTools } from "./tools/camera";
import { registerAnimationTools } from "./tools/animation";
import { registerAnimationInspectionTools } from "./tools/animation-inspection";
import { registerCubesTools } from "./tools/cubes";
import { registerElementTools } from "./tools/element";
import { registerElementInspectionTools } from "./tools/element-inspection";
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

/**
 * Registration ownership stays family-level. The profile selects which existing
 * family registration functions are invoked; it does not introduce per-tool
 * ACLs or a dynamic policy engine.
 */
const registrationFunctions: Record<
  McpRegistrationFamily,
  RegistrationFunction
> = {
  animation: registerAnimationTools,
  animation_inspection: registerAnimationInspectionTools,
  camera: registerCameraTools,
  cubes: registerCubesTools,
  elements: registerElementTools,
  element_inspection: registerElementInspectionTools,
  export: registerExportTools,
  history: registerHistoryTools,
  import: registerImportTools,
  material_instances: registerMaterialInstanceTools,
  paint: registerPaintTools,
  project: registerProjectTools,
  textures: registerTextureTools,
  ui: registerUITools,
  validator_resources: registerValidatorResources,
};

/**
 * Tracks family registration within this plugin load so an explicit extended
 * opt-in adds only the missing fallback families instead of attempting to
 * register the Bedrock Entity core twice.
 */
const registeredFamilies = new Set<McpRegistrationFamily>();

export function registerMcpProfile(
  profile: McpRegistrationProfile = DEFAULT_MCP_REGISTRATION_PROFILE
): void {
  for (const family of getRegistrationFamilies(profile)) {
    if (registeredFamilies.has(family)) continue;

    registrationFunctions[family]();
    registeredFamilies.add(family);
  }
}

// Register exactly the default BlockIT Bedrock Entity profile at module load.
// The plugin onload path may explicitly opt in to the extended profile after
// settings are initialized; registerMcpProfile() is idempotent per family.
registerMcpProfile(DEFAULT_MCP_REGISTRATION_PROFILE);

// Function to get tool count - called at runtime after registration
export function getToolCount(): number {
  return Object.keys(tools).length;
}

// Re-export tools and prompts for use by other modules
export { tools, prompts };
