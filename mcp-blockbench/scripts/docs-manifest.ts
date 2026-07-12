import { z } from "zod";
import type { ToolSpec, PromptSpec, ResourceSpec } from "../src/lib/factories";

import { cameraToolDocs } from "../src/server/tools/camera";
import { cubeToolDocs } from "../src/server/tools/cubes";
import { elementToolDocs } from "../src/server/tools/element";
import { importToolDocs } from "../src/server/tools/import";
import { meshToolDocs } from "../src/server/tools/mesh";
import { paintToolDocs } from "../src/server/tools/paint";
import { projectToolDocs } from "../src/server/tools/project";
import { cubeUvToolDocs } from "../src/server/tools/cubeUv";
import { textureToolDocs } from "../src/server/tools/texture";
import { armatureToolDocs } from "../src/server/tools/armature";
import { animationToolDocs } from "../src/server/tools/animation";
import { uiToolDocs } from "../src/server/tools/ui";
import { hytaleToolDocs } from "../src/server/tools/hytale";
import { materialInstanceToolDocs } from "../src/server/tools/material-instances";
import { uvToolDocs } from "../src/server/tools/uv";
import { historyToolDocs } from "../src/server/tools/history";
import { exportToolDocs } from "../src/server/tools/export";
import { runtimeToolDocs } from "../src/server/tools/runtime";
import { workflowToolDocs } from "../src/server/tools/workflow";
import { leaseToolDocs } from "../src/server/tools/lease";
import { geometryFeedbackToolDocs } from "../src/server/tools/geometry-feedback";
import { referenceVisualPreviewToolDocs } from "../src/server/tools/reference-visual-preview";
import { geometryAnalyzerToolDocs } from "../src/server/tools/geometry-analyzer";
import { geometryDecisionToolDocs } from "../src/server/tools/geometry-decision";
import { geometryRotationToolDocs } from "../src/server/tools/geometry-rotation";
import { geometryValidatorToolDocs } from "../src/server/tools/geometry-validator";
import { geometryRebuildToolDocs } from "../src/server/tools/geometry-rebuild";
import { geometryCompletionToolDocs } from "../src/server/tools/geometry-completion";
import { geometryReviewGateToolDocs } from "../src/server/tools/geometry-review-gate";
import { geometryReviewSubmitToolDocs } from "../src/server/tools/geometry-review-submit";
import { stageReviewSubmitToolDocs } from "../src/server/tools/stage-review-submit";
import { stageRevisionToolDocs } from "../src/server/tools/stage-revision";
import { stageReopenToolDocs } from "../src/server/tools/stage-reopen";
import { stageContextToolDocs } from "../src/server/tools/stage-context";
import { projectIdentityToolDocs } from "../src/server/tools/project-identity";

export interface CategoryGroup {
  category: string;
  tools: ToolSpec[];
}

export const toolManifest: CategoryGroup[] = [
  { category: "Runtime", tools: runtimeToolDocs },
  { category: "Write Ownership", tools: leaseToolDocs },
  { category: "Workflow", tools: workflowToolDocs },
  { category: "Stage Revision", tools: stageRevisionToolDocs },
  { category: "Upstream Stage Reopen", tools: stageReopenToolDocs },
  { category: "Stage Review Submission", tools: stageReviewSubmitToolDocs },
  { category: "Compact Stage Context", tools: stageContextToolDocs },
  { category: "Project Identity", tools: projectIdentityToolDocs },
  { category: "Reference Visual Transport", tools: referenceVisualPreviewToolDocs },
  { category: "Geometry Visual Feedback", tools: geometryFeedbackToolDocs },
  { category: "Geometry Visual Diagnosis", tools: geometryAnalyzerToolDocs },
  { category: "Geometry Visual Decision", tools: geometryDecisionToolDocs },
  { category: "Geometry Contract Rotation", tools: geometryRotationToolDocs },
  { category: "Geometry Contract Validation", tools: geometryValidatorToolDocs },
  { category: "Geometry Revision", tools: geometryRebuildToolDocs },
  { category: "Geometry Review Gate", tools: geometryReviewGateToolDocs },
  { category: "Geometry Review Submission", tools: geometryReviewSubmitToolDocs },
  { category: "Geometry Completion", tools: geometryCompletionToolDocs },
  { category: "Cubes", tools: cubeToolDocs },
  { category: "Camera & Screenshots", tools: cameraToolDocs },
  { category: "Animation", tools: animationToolDocs },
  { category: "Armature", tools: armatureToolDocs },
  { category: "Elements", tools: elementToolDocs },
  { category: "Export", tools: exportToolDocs },
  { category: "History", tools: historyToolDocs },
  { category: "Import/Export", tools: importToolDocs },
  { category: "Material Instances", tools: materialInstanceToolDocs },
  { category: "Mesh Editing", tools: meshToolDocs },
  { category: "Paint Tools", tools: paintToolDocs },
  { category: "Project", tools: projectToolDocs },
  { category: "Cube UV", tools: cubeUvToolDocs },
  { category: "Textures", tools: textureToolDocs },
  { category: "UI Interaction", tools: uiToolDocs },
  { category: "UV Mapping", tools: uvToolDocs },
  { category: "Hytale Integration", tools: hytaleToolDocs },
];

export const promptDocs: PromptSpec[] = [
  {
    name: "blockbench_native_apis",
    description:
      "Essential information about Blockbench v5.0 native API security model and requireNativeModule() usage. Use this when working with Node.js modules, file system access, or native APIs in Blockbench plugins.",
    status: "stable",
  },
  {
    name: "blockbench_code_eval_safety",
    description:
      "Critical safety guide for agents using code evaluation/execution tools with Blockbench v5.0+. Contains breaking changes, quick reference, common mistakes, and safe code patterns for native module usage.",
    status: "stable",
  },
  {
    name: "model_creation_strategy",
    title: "Model Creation Strategy",
    description: "A strategy for creating a new 3D model in Blockbench.",
    argsSchema: z.object({
      format: z.enum(["java_block", "bedrock"]).optional().describe("Target model format."),
      approach: z.enum(["ui", "programmatic", "import"]).optional().describe("Creation approach to use."),
    }),
    status: "stable",
  },
  {
    name: "hytale_model_creation",
    title: "Hytale Model Creation Guide",
    description:
      "Comprehensive guide for creating Hytale character and prop models. Covers format selection, node limits, shading modes, stretch, quads, and best practices.",
    argsSchema: z.object({
      format_type: z
        .enum(["character", "prop", "both"])
        .describe("Which format type to focus on.")
        .optional()
        .default("both"),
    }),
    status: "experimental",
  },
  {
    name: "hytale_animation_workflow",
    title: "Hytale Animation Workflow",
    description:
      "Guide for creating animations in Hytale models. Covers 60 FPS timing, quaternion rotations, visibility keyframes, loop modes, and common animation patterns.",
    argsSchema: z.object({
      animation_type: z
        .enum(["walk", "idle", "attack", "general"])
        .describe("Type of animation to focus on.")
        .optional()
        .default("general"),
    }),
    status: "experimental",
  },
  {
    name: "hytale_attachments",
    title: "Hytale Attachments System",
    description:
      "Guide for creating and managing attachments in Hytale models. Covers attachment collections, piece bones, modular equipment, and best practices.",
    status: "experimental",
  },
  {
    name: "texture_uv_workflow",
    title: "Per-Face UV Texture Workflow",
    description:
      "Guide for per-face UV workflows: project setup, placing cubes with face rects, exporting UV layouts with get_uv_layout, and painting custom texture atlases.",
    status: "stable",
  },
];

export const resourceDocs: ResourceSpec[] = [
  {
    name: "projects",
    uriTemplate: "projects://{id}",
    title: "Blockbench Projects",
    description:
      "Returns information about available projects. List URIs use the slugified project name when unique, or <slug>~<uuid-prefix> on collision. Reads accept UUID, exact name, or slug.",
  },
  {
    name: "nodes",
    uriTemplate: "nodes://{id}",
    title: "Blockbench Nodes",
    description:
      "Returns the current 3D nodes in the editor. List URIs use slugified project name when unique, with ~<uuid-prefix> on collision. Reads accept UUID, exact name, or slug.",
  },
  {
    name: "textures",
    uriTemplate: "textures://{id}",
    title: "Blockbench Textures",
    description:
      "Returns information about textures. List URIs use the slugified texture name when unique, with ~<uuid-prefix> on collision. Reads accept UUID, exact name, slug, or short numeric texture id.",
  },
  {
    name: "reference_models",
    uriTemplate: "reference_models://{id}",
    title: "Blockbench Reference Models",
    description:
      "Returns reference models in the current project. Requires the Reference Models plugin.",
  },
  {
    name: "validator-status",
    uriTemplate: "validator://status",
    title: "Validator Status",
    description:
      "Returns the current validation status including error/warning counts and a summary of all problems.",
  },
  {
    name: "validator-checks",
    uriTemplate: "validator://checks/{id}",
    title: "Validator Checks",
    description:
      "Returns information about registered validator checks. Use without an ID to list all checks, or provide a check ID for details.",
  },
  {
    name: "validator-warnings",
    uriTemplate: "validator://warnings",
    title: "Validator Warnings",
    description:
      "Returns all current validation warnings with element references where available.",
  },
  {
    name: "validator-errors",
    uriTemplate: "validator://errors",
    title: "Validator Errors",
    description:
      "Returns all current validation errors with element references where available.",
  },
  {
    name: "hytale-format",
    uriTemplate: "hytale://format",
    title: "Hytale Format Information",
    description:
      "Returns information about the active Hytale model format and its constraints.",
  },
];
