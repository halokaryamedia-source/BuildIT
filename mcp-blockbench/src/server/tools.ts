/// <reference types="three" />
/// <reference types="blockbench-types" />

import { tools, prompts } from "@/lib/factories";
import { initializeToolProfiles } from "@/lib/toolProfiles";

// Import tool registration functions
import { registerCameraTools } from "./tools/camera";
import { registerAnimationTools } from "./tools/animation";
import { registerCubesTools } from "./tools/cubes";
import { registerElementTools } from "./tools/element";
import { registerImportTools } from "./tools/import";
import { registerMeshTools } from "./tools/mesh";
import { registerPaintTools } from "./tools/paint";
import { registerProjectTools } from "./tools/project";
import { registerTextureTools } from "./tools/texture";
import { registerUITools } from "./tools/ui";
import { registerUVTools } from "./tools/uv";
import { registerCubeUvTools } from "./tools/cubeUv";
import { registerMaterialInstanceTools } from "./tools/material-instances";
import { registerArmatureTools } from "./tools/armature";
import { registerHistoryTools } from "./tools/history";
import { registerExportTools } from "./tools/export";
import { registerRuntimeTools } from "./tools/runtime";
import { registerWorkflowTools } from "./tools/workflow";
import { registerLeaseTools } from "./tools/lease";
import { registerGeometryFeedbackTools } from "./tools/geometry-feedback";
import { registerGeometryCompletionTools } from "./tools/geometry-completion";
import { registerStageContextTools } from "./tools/stage-context";
import { registerVisualCompareTools } from "./tools/visual-compare";

// Core resource registrations
import { registerValidatorResources } from "./resources/validator";

// Optional plugin integrations (conditionally registered)
import { registerHytaleTools } from "./tools/hytale";
import { registerHytaleResources } from "./resources/hytale";
import { registerHytalePrompts } from "./prompts/hytale";

// All registration functions - MUST be used to prevent tree-shaking
const registrationFunctions = [
  registerAnimationTools,
  registerArmatureTools,
  registerCameraTools,
  registerCubesTools,
  registerElementTools,
  registerExportTools,
  registerGeometryFeedbackTools,
  registerGeometryCompletionTools,
  registerStageContextTools,
  registerVisualCompareTools,
  registerHistoryTools,
  registerImportTools,
  registerLeaseTools,
  registerMaterialInstanceTools,
  registerMeshTools,
  registerPaintTools,
  registerProjectTools,
  registerRuntimeTools,
  registerTextureTools,
  registerUITools,
  registerUVTools,
  registerCubeUvTools,
  registerWorkflowTools,
  registerValidatorResources,
];

// Optional plugin registration functions
const optionalRegistrationFunctions = [
  registerHytaleTools,
  registerHytaleResources,
  registerHytalePrompts,
];

// Build the complete capability library first.
for (const register of registrationFunctions) {
  register();
}

for (const register of optionalRegistrationFunctions) {
  register();
}

// Then expose only the exact default profile to future MCP sessions and install
// call-time guards for every tool definition. The complete library remains
// available for an explicit diagnostic profile without burdening normal stages.
initializeToolProfiles();

export function getToolCount(): number {
  return Object.keys(tools).length;
}

export { tools, prompts };
