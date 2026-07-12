/// <reference types="three" />
/// <reference types="blockbench-types" />

import { tools, prompts } from "@/lib/factories";
import { initializeToolProfiles } from "@/lib/toolProfiles";
import { installGeometryFreshnessGuards } from "./geometry-freshness-guards";
import { installProfileStateReconciliationGuards } from "./profile-state-reconciliation-guards";
import { installReviewSubmissionLeaseGuards } from "./review-submission-lease-guards";
import { installStageCompletionFreshnessGuards } from "./stage-completion-freshness-guards";
import { installStageContextRoutingGuards } from "./stage-context-routing-guards";
import { installStageReviewMutationGuards } from "./stage-review-mutation-guards";
import { installStageValidationRoutingGuards } from "./stage-validation-routing-guards";
import { installStageTransitionGuards } from "./stage-transition-guards";

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
import { registerReferenceVisualPreviewTools } from "./tools/reference-visual-preview";
import { registerGeometryAnalyzerTools } from "./tools/geometry-analyzer";
import { registerGeometryDecisionTools } from "./tools/geometry-decision";
import { registerGeometryRotationTools } from "./tools/geometry-rotation";
import { registerGeometryValidatorTools } from "./tools/geometry-validator";
import { registerGeometryRebuildTools } from "./tools/geometry-rebuild";
import { registerGeometryCompletionTools } from "./tools/geometry-completion";
import { registerGeometryReviewGateTools } from "./tools/geometry-review-gate";
import { registerGeometryReviewSubmitTools } from "./tools/geometry-review-submit";
import { registerStageReviewSubmitTools } from "./tools/stage-review-submit";
import { registerStageReportTools } from "./tools/stage-report";
import { registerStageRevisionTools } from "./tools/stage-revision";
import { registerStageReopenTools } from "./tools/stage-reopen";
import { registerStageContextTools } from "./tools/stage-context";
import { registerProjectIdentityTools } from "./tools/project-identity";

// Core resource registrations
import { registerValidatorResources } from "./resources/validator";

// Optional plugin integrations (conditionally registered)
import { registerHytaleTools } from "./tools/hytale";
import { registerHytaleResources } from "./resources/hytale";
import { registerHytalePrompts } from "./prompts/hytale";

const registrationFunctions = [
  registerAnimationTools,
  registerArmatureTools,
  registerCameraTools,
  registerCubesTools,
  registerElementTools,
  registerExportTools,
  registerGeometryFeedbackTools,
  registerReferenceVisualPreviewTools,
  registerGeometryAnalyzerTools,
  registerGeometryDecisionTools,
  registerGeometryRotationTools,
  registerGeometryValidatorTools,
  registerGeometryRebuildTools,
  registerGeometryCompletionTools,
  registerGeometryReviewGateTools,
  registerGeometryReviewSubmitTools,
  registerStageReviewSubmitTools,
  registerStageReportTools,
  registerStageRevisionTools,
  registerStageReopenTools,
  registerStageContextTools,
  registerProjectIdentityTools,
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

const optionalRegistrationFunctions = [
  registerHytaleTools,
  registerHytaleResources,
  registerHytalePrompts,
];

for (const register of registrationFunctions) register();
for (const register of optionalRegistrationFunctions) register();

// Guard order matters: evidence and review-state checks are installed before
// completion rollback. Review submissions release the writer while waiting for
// user input. Profile/state reconciliation remains the outermost transition
// recovery guard before the final profile/write-lease wrapper.
installGeometryFreshnessGuards();
installStageContextRoutingGuards();
installStageValidationRoutingGuards();
installStageReviewMutationGuards();
installStageCompletionFreshnessGuards();
installReviewSubmissionLeaseGuards();
installStageTransitionGuards();
installProfileStateReconciliationGuards();

initializeToolProfiles();

export function getToolCount(): number {
  return Object.keys(tools).length;
}

export { tools, prompts };
