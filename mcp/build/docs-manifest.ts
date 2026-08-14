import { z } from "zod";
import type { ToolSpec, PromptSpec, ResourceSpec } from "../lib/factories";

// Tool docs imports — each file exports schemas at module level with zero Blockbench deps
import { cameraToolDocs } from "../server/tools/camera";
import { cubeToolDocs } from "../server/tools/cubes";
import { elementToolDocs } from "../server/tools/element";
import { elementInspectionToolDocs } from "../server/tools/element-inspection";
import { locatorToolDocs } from "../server/tools/locators";
import { importToolDocs } from "../server/tools/import";
import { paintToolDocs } from "../server/tools/paint";
import { projectToolDocs } from "../server/tools/project";
import { textureToolDocs } from "../server/tools/texture";
import { animationToolDocs } from "../server/tools/animation";
import { animationControllerToolDocs } from "../server/tools/animation-controller";
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
  {
    category: "Animation",
    tools: [
      ...animationToolDocs,
      ...animationControllerToolDocs,
      ...animationInspectionToolDocs,
    ],
  },
  { category: "Elements", tools: [...elementToolDocs, ...elementInspectionToolDocs, ...locatorToolDocs] },
  { category: "Export", tools: exportToolDocs },
  { category: "History", tools: historyToolDocs },
  { category: "Import/Export", tools: importToolDocs },
  { category: "Material Instances", tools: materialInstanceToolDocs },
  { category: "Paint Tools", tools: paintToolDocs },
  { category: "Project", tools: projectToolDocs },
  { category: "Textures", tools: textureToolDocs },
  { category: "UI Interaction", tools: uiToolDocs },
];

// Only runtime-callable prompts belong in generated MCP API docs.
// Maintainer/reference markdown under prompts/ remains source documentation.
export const promptDocs: PromptSpec[] = [
  {
    name: "bedrock_entity_workflow",
    title: "Minecraft Bedrock Entity Workflow",
    description:
      "Compact BlockIT workflow for Bedrock Entity authoring: minimum evidence, visual gates, bounded correction, downstream readiness, protected native gaps, and Bedrock/.bbmodel export.",
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
