import { z } from "zod";
import type { ToolSpec, PromptSpec, ResourceSpec } from "../lib/factories";

// Tool docs imports — each file exports schemas at module level with zero Blockbench deps
import { cameraToolDocs } from "../server/tools/camera";
import { cubeToolDocs } from "../server/tools/cubes";
import { elementToolDocs } from "../server/tools/element";
import { elementInspectionToolDocs } from "../server/tools/element-inspection";
import { importToolDocs } from "../server/tools/import";
import { paintToolDocs } from "../server/tools/paint";
import { projectToolDocs } from "../server/tools/project";
import { textureToolDocs } from "../server/tools/texture";
import { animationToolDocs } from "../server/tools/animation";
import { animationInspectionToolDocs } from "../server/tools/animation-inspection";
import { uiToolDocs } from "../server/tools/ui";
import { materialInstanceToolDocs } from "../server/tools/material-instances";
import { historyToolDocs } from "../server/tools/history";
import { exportToolDocs } from "../server/tools/export";

export interface CategoryGroup {
  category: string;
  tools: ToolSpec[];
}

export const toolManifest: CategoryGroup[] = [
  { category: "Cubes", tools: cubeToolDocs },
  { category: "Camera & Screenshots", tools: cameraToolDocs },
  { category: "Animation", tools: [...animationToolDocs, ...animationInspectionToolDocs] },
  { category: "Elements", tools: [...elementToolDocs, ...elementInspectionToolDocs] },
  { category: "Export", tools: exportToolDocs },
  { category: "History", tools: historyToolDocs },
  { category: "Import/Export", tools: importToolDocs },
  { category: "Material Instances", tools: materialInstanceToolDocs },
  { category: "Paint Tools", tools: paintToolDocs },
  { category: "Project", tools: projectToolDocs },
  { category: "Textures", tools: textureToolDocs },
  { category: "UI Interaction", tools: uiToolDocs },
];

// Prompt specs defined inline — server/prompts.ts uses macros that complicate direct import
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
    name: "bedrock_entity_workflow",
    title: "Minecraft Bedrock Entity Workflow",
    description:
      "Canonical BlockIT workflow guidance for creating or revising Minecraft Bedrock Entity models in Blockbench. Covers inspect-first Cuboid modelling, hierarchy/pivots, canonical visual gates, Bedrock texture/Paint/PBR/material-instance work, animation boundaries, protected native capability gaps, and Bedrock/.bbmodel export outcomes.",
    argsSchema: z.object({}),
    status: "stable",
  },
];

// Resource specs defined inline — server/resources.ts uses Blockbench globals at module level
export const resourceDocs: ResourceSpec[] = [
  {
    name: "projects",
    uriTemplate: "projects://{id}",
    title: "Blockbench Projects",
    description:
      "Returns information about available projects. List URIs use the slugified project name (e.g. `projects://my-character`) when unique, or `projects://<slug>~<uuid-prefix>` on collision. Reads accept UUID, exact name, or slug.",
  },
  {
    name: "nodes",
    uriTemplate: "nodes://{id}",
    title: "Blockbench Nodes",
    description:
      "Returns the current 3D nodes in the editor. List URIs use slugified names (e.g. `nodes://head`) when unique, with `~<uuid-prefix>` on collision. Reads accept UUID, exact name, or slug.",
  },
  {
    name: "textures",
    uriTemplate: "textures://{id}",
    title: "Blockbench Textures",
    description:
      "Returns information about textures. List URIs use slugified names (e.g. `textures://skin`) when unique, with `~<uuid-prefix>` on collision. Reads accept UUID, exact name, slug, or short numeric texture id.",
  },
  {
    name: "reference_models",
    uriTemplate: "reference_models://{id}",
    title: "Reference Models",
    description:
      "Returns reference models in the current project. Requires the Reference Models plugin. List URIs use slugified names (e.g. `reference_models://turntable`) with `~<uuid-prefix>` on collision. Reads accept UUID, exact name, or slug.",
  },
  {
    name: "validator-status",
    uriTemplate: "validator://status",
    title: "Validator Status",
    description:
      "Returns the current validation status. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",
  },
  {
    name: "validator-checks",
    uriTemplate: "validator://checks/{id}",
    title: "Validator Checks",
    description:
      "Returns information about registered validator checks. Use without an ID to list all checks, or provide a check ID to get details about a specific check.",
  },
  {
    name: "validator-warnings",
    uriTemplate: "validator://warnings",
    title: "Validator Warnings",
    description:
      "Returns current validation warnings. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",
  },
  {
    name: "validator-errors",
    uriTemplate: "validator://errors",
    title: "Validator Errors",
    description:
      "Returns current validation errors. Any elementRefs are best-effort message-text inferences and are explicitly marked non-authoritative.",
  },
];
