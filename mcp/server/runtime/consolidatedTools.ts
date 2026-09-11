import { z } from "zod";
import { createTool, getAllToolDefinitions, tools, withToolBranch } from "@/lib/factories";
import type { McpRegistrationFamily } from "@/lib/registrationProfile";
import {
  animationCopyPasteParameters,
  animationGraphEditorParameters,
  animationTimelineParameters,
  batchKeyframeOperationsParameters,
  manageKeyframesParameters,
} from "../tools/animation";
import {
  findElementsByCriteriaParameters,
  listOutlineParameters,
} from "../tools/element";
import { inspectElementParameters } from "../tools/element-inspection";
import {
  assignTextureChannelParameters,
  configureMaterialParameters,
  createPbrMaterialParameters,
  saveMaterialConfigParameters,
} from "../tools/texture";
import {
  bulkSetMaterialInstancesParametersSchema,
  clearMaterialInstancesParametersSchema,
  getFaceMaterialInstancesParametersSchema,
  listMaterialInstancesParametersSchema,
  setFaceMaterialInstanceParametersSchema,
} from "../tools/material-instances";

export type ConsolidatedCatalogUpdate = (
  toolName: string,
  family: McpRegistrationFamily,
  enabled: boolean
) => void;

const consolidatedInspectionParameters = z.union([
  withToolBranch(listOutlineParameters, "mode", "outline"),
  withToolBranch(findElementsByCriteriaParameters, "mode", "search"),
  withToolBranch(inspectElementParameters, "mode", "detail"),
]);

export const consolidatedInspectionToolDocs = {
  name: "inspect_elements",
  description:
    "Inspects Bedrock elements through one focused boundary. Use mode=outline for hierarchy, search for bounded criteria discovery, or detail for one authored element with optional UV data.",
  annotations: { title: "Inspect Elements", readOnlyHint: true },
  parameters: consolidatedInspectionParameters,
  status: "stable" as const,
};

const consolidatedMaterialParameters = z.union([
  withToolBranch(createPbrMaterialParameters, "operation", "create"),
  withToolBranch(configureMaterialParameters, "operation", "configure"),
  withToolBranch(assignTextureChannelParameters, "operation", "assign_channel"),
  withToolBranch(saveMaterialConfigParameters, "operation", "save"),
]);

export const consolidatedMaterialToolDocs = {
  name: "manage_material",
  description:
    "Creates, configures, assigns channels, or saves one Bedrock PBR material through one focused boundary.",
  annotations: { title: "Manage Material", destructiveHint: true },
  parameters: consolidatedMaterialParameters,
  status: "stable" as const,
};

const consolidatedAnimationTimelineParameters = z.union([
  manageKeyframesParameters.and(z.object({ operation: z.literal("keyframes") })),
  animationGraphEditorParameters.and(z.object({ operation: z.literal("graph") })),
  animationTimelineParameters.and(z.object({ operation: z.literal("timeline") })),
  batchKeyframeOperationsParameters.and(z.object({ operation: z.literal("batch") })),
  animationCopyPasteParameters.and(z.object({ operation: z.literal("copy_paste") })),
]);

export const consolidatedAnimationTimelineToolDocs = {
  name: "manage_animation_timeline",
  description:
    "Authors one Bedrock Animation through keyframes, graph/easing, timeline, coherent batch/copy operations, or a one-call native property cohort.",
  annotations: { title: "Manage Bedrock Animation Timeline", destructiveHint: true },
  parameters: consolidatedAnimationTimelineParameters,
  status: "stable" as const,
};

const consolidatedMaterialInstancesParameters = z.union([
  withToolBranch(listMaterialInstancesParametersSchema, "operation", "list"),
  withToolBranch(getFaceMaterialInstancesParametersSchema, "operation", "get"),
  withToolBranch(setFaceMaterialInstanceParametersSchema, "operation", "set"),
  withToolBranch(bulkSetMaterialInstancesParametersSchema, "operation", "bulk_set"),
  withToolBranch(clearMaterialInstancesParametersSchema, "operation", "clear"),
]);

export const consolidatedMaterialInstancesToolDocs = {
  name: "manage_material_instances",
  description:
    "Lists, reads, assigns, bulk-assigns, or clears Bedrock face material instances through one focused boundary.",
  annotations: { title: "Manage Material Instances", destructiveHint: true },
  parameters: consolidatedMaterialInstancesParameters,
  status: "stable" as const,
};

function disableLegacyTools(
  names: readonly string[],
  family: McpRegistrationFamily,
  updateCatalog: ConsolidatedCatalogUpdate
): void {
  for (const name of names) {
    if (tools[name]) tools[name].enabled = false;
    updateCatalog(name, family, false);
  }
}

export function registerConsolidatedTools(
  updateCatalog: ConsolidatedCatalogUpdate
): void {
  if (!tools.inspect_elements) {
    createTool(
      "inspect_elements",
      {
        ...consolidatedInspectionToolDocs,
        async execute(request) {
          const target = request.mode === "outline"
            ? "list_outline"
            : request.mode === "search"
              ? "find_elements_by_criteria"
              : "inspect_element";
          const definition = getAllToolDefinitions()[target];
          if (!definition) throw new Error(`Inspection executor ${target} is unavailable.`);
          const { mode: _mode, ...args } = request;
          return definition.execute(args);
        },
      },
      "stable"
    );
    disableLegacyTools(
      ["list_outline", "find_elements_by_criteria", "inspect_element"],
      "element_inspection",
      updateCatalog
    );
    updateCatalog("inspect_elements", "element_inspection", true);
  }

  if (!tools.manage_material) {
    createTool(
      "manage_material",
      {
        ...consolidatedMaterialToolDocs,
        async execute(request) {
          const target = request.operation === "create"
            ? "create_pbr_material"
            : request.operation === "configure"
              ? "configure_material"
              : request.operation === "assign_channel"
                ? "assign_texture_channel"
                : "save_material_config";
          const definition = getAllToolDefinitions()[target];
          if (!definition) throw new Error(`Material executor ${target} is unavailable.`);
          const { operation: _operation, ...args } = request;
          return definition.execute(args);
        },
      },
      "stable"
    );
    disableLegacyTools(
      ["create_pbr_material", "configure_material", "assign_texture_channel", "save_material_config"],
      "textures",
      updateCatalog
    );
    updateCatalog("manage_material", "textures", true);
  }

  if (!tools.manage_animation_timeline) {
    createTool(
      "manage_animation_timeline",
      {
        ...consolidatedAnimationTimelineToolDocs,
        async execute(request) {
          let target = "animation_copy_paste";
          const operation = String(request.operation);
          if (operation === "keyframes") target = "manage_keyframes";
          else if (operation === "graph") target = "animation_graph_editor";
          else if (operation === "timeline") target = "animation_timeline";
          else if (operation === "batch") target = "batch_keyframe_operations";
          const definition = getAllToolDefinitions()[target];
          if (!definition) throw new Error(`Animation timeline executor ${target} is unavailable.`);
          const { operation: _operation, ...args } = request;
          return definition.execute(args);
        },
      },
      "stable"
    );
    disableLegacyTools(
      ["manage_keyframes", "animation_graph_editor", "animation_timeline", "batch_keyframe_operations", "animation_copy_paste"],
      "animation",
      updateCatalog
    );
    updateCatalog("manage_animation_timeline", "animation", true);
  }

  if (!tools.manage_material_instances) {
    createTool(
      "manage_material_instances",
      {
        ...consolidatedMaterialInstancesToolDocs,
        async execute(request) {
          const target = request.operation === "list"
            ? "list_material_instances"
            : request.operation === "get"
              ? "get_face_material_instances"
              : request.operation === "set"
                ? "set_face_material_instance"
                : request.operation === "bulk_set"
                  ? "bulk_set_material_instances"
                  : "clear_material_instances";
          const definition = getAllToolDefinitions()[target];
          if (!definition) throw new Error(`Material-instance executor ${target} is unavailable.`);
          const { operation: _operation, ...args } = request;
          return definition.execute(args);
        },
      },
      "stable"
    );
    disableLegacyTools(
      ["list_material_instances", "get_face_material_instances", "set_face_material_instance", "bulk_set_material_instances", "clear_material_instances"],
      "material_instances",
      updateCatalog
    );
    updateCatalog("manage_material_instances", "material_instances", true);
  }
}
