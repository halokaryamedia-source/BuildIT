/// <reference types="three" />
/// <reference types="blockbench-types" />

import { createTool, tools, prompts, getAllToolDefinitions } from "@/lib/factories";
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
import { manageKeyframesParameters, animationGraphEditorParameters, animationTimelineParameters, batchKeyframeOperationsParameters, animationCopyPasteParameters } from "./tools/animation";
import { listOutlineParameters, findElementsByCriteriaParameters } from "./tools/element";
import { inspectElementParameters } from "./tools/element-inspection";
import { createPbrMaterialParameters, configureMaterialParameters, assignTextureChannelParameters, saveMaterialConfigParameters } from "./tools/texture";
import { listMaterialInstancesParametersSchema, getFaceMaterialInstancesParametersSchema, setFaceMaterialInstanceParametersSchema, bulkSetMaterialInstancesParametersSchema, clearMaterialInstancesParametersSchema } from "./tools/material-instances";

// Core resource registrations
import { registerValidatorResources } from "./resources/validator";

type RegistrationFunction = () => void;

const consolidatedInspectionParameters = z.union([
  listOutlineParameters.and(z.object({ mode: z.literal("outline") })),
  findElementsByCriteriaParameters.and(z.object({ mode: z.literal("search") })),
  inspectElementParameters.and(z.object({ mode: z.literal("detail") })),
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
  createPbrMaterialParameters.and(z.object({ operation: z.literal("create") })),
  configureMaterialParameters.and(z.object({ operation: z.literal("configure") })),
  assignTextureChannelParameters.and(z.object({ operation: z.literal("assign_channel") })),
  saveMaterialConfigParameters.and(z.object({ operation: z.literal("save") })),
]);

const consolidatedMaterialInputSchema: Record<string, z.ZodType> = {
  operation: z
    .enum(["create", "configure", "assign_channel", "save"])
    .describe("Material operation; provide the fields required by that operation."),
  name: z.string().optional().describe("Material name for create."),
  material: z.string().optional().describe("Material UUID or exact unique name."),
  channel: z.string().optional().describe("Texture channel."),
  texture: z.unknown().optional().describe("Texture reference or channel payload."),
  color_texture: z.string().optional().describe("Color texture reference."),
  normal_texture: z.string().optional().describe("Normal texture reference."),
  height_texture: z.string().optional().describe("Height texture reference."),
  mer_texture: z.string().optional().describe("MER texture reference."),
  color_value: z.unknown().optional().describe("Uniform RGBA value."),
  mer_value: z.unknown().optional().describe("Uniform MER value."),
  subsurface_value: z.number().optional().describe("Subsurface value."),
};

export const consolidatedMaterialToolDocs = {
  name: "manage_material",
  description: "Creates, configures, assigns channels, or saves one Bedrock PBR material through one focused boundary.",
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

const consolidatedAnimationTimelineInputSchema: Record<string, z.ZodType> = {
  operation: z
    .enum(["keyframes", "graph", "timeline", "batch", "copy_paste"])
    .describe("Animation operation; provide the fields required by that operation."),
  animation_id: z.string().optional().describe("Animation UUID or exact unique name."),
  action: z.string().optional().describe("Operation-specific action."),
  bone_name: z.string().optional().describe("Operation-specific Group UUID or name."),
  channel: z.string().optional().describe("Operation-specific animation channel."),
  keyframes: z.unknown().optional().describe("Operation-specific keyframe payload."),
  keyframe_range: z.unknown().optional().describe("Operation-specific keyframe range."),
  parameters: z.unknown().optional().describe("Operation-specific graph parameters."),
  selection: z.string().optional().describe("Batch selection mode."),
  range: z.unknown().optional().describe("Operation-specific time range."),
  pattern: z.unknown().optional().describe("Batch pattern selection."),
  source: z.unknown().optional().describe("Copy/paste source animation bone."),
  target: z.unknown().optional().describe("Copy/paste target animation bone."),
  axis: z.string().optional().describe("Mirror axis."),
  time: z.number().optional().describe("Timeline time in seconds."),
  length: z.number().optional().describe("Animation length in seconds."),
  fps: z.number().optional().describe("Animation snapping rate."),
  loop_mode: z.string().optional().describe("Animation loop mode."),
  molang: z.unknown().optional().describe("Authored Molang value or null."),
  custom_curve: z.unknown().optional().describe("Operation-specific custom curve."),
};

export const consolidatedAnimationTimelineToolDocs = {
  name: "manage_animation_timeline",
  description: "Authors Bedrock animation keyframes, timing, graph/easing, batch edits, and copy/paste through one focused boundary.",
  annotations: { title: "Manage Animation Timeline", destructiveHint: true },
  parameters: consolidatedAnimationTimelineParameters,
  status: "stable" as const,
};

const consolidatedMaterialInstancesParameters = z.union([
  listMaterialInstancesParametersSchema.and(z.object({ operation: z.literal("list") })),
  getFaceMaterialInstancesParametersSchema.and(z.object({ operation: z.literal("get") })),
  setFaceMaterialInstanceParametersSchema.and(z.object({ operation: z.literal("set") })),
  bulkSetMaterialInstancesParametersSchema.and(z.object({ operation: z.literal("bulk_set") })),
  clearMaterialInstancesParametersSchema.and(z.object({ operation: z.literal("clear") })),
]);

export const consolidatedMaterialInstancesToolDocs = {
  name: "manage_material_instances",
  description: "Lists, reads, assigns, bulk-assigns, or clears Bedrock face material instances through one focused boundary.",
  annotations: { title: "Manage Material Instances", destructiveHint: true },
  parameters: consolidatedMaterialInstancesParameters,
  status: "stable" as const,
};

function registerConsolidatedInspectionTool(): void {
  if (tools.inspect_elements) return;
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
  for (const legacy of ["list_outline", "find_elements_by_criteria", "inspect_element"]) {
    if (tools[legacy]) tools[legacy].enabled = false;
    catalogToolEnabled.set(legacy, false);
  }
  toolRegistrationFamily.set("inspect_elements", "element_inspection");
  catalogToolEnabled.set("inspect_elements", true);
}

function registerConsolidatedMaterialTool(): void {
  if (tools.manage_material) return;
  createTool("manage_material", {
    ...consolidatedMaterialToolDocs,
    inputSchema: consolidatedMaterialInputSchema,
    async execute(request) {
      const target = request.operation === "create" ? "create_pbr_material" : request.operation === "configure" ? "configure_material" : request.operation === "assign_channel" ? "assign_texture_channel" : "save_material_config";
      const definition = getAllToolDefinitions()[target];
      if (!definition) throw new Error(`Material executor ${target} is unavailable.`);
      const { operation: _operation, ...args } = request;
      return definition.execute(args);
    },
  }, "stable");
  for (const legacy of ["create_pbr_material", "configure_material", "assign_texture_channel", "save_material_config"]) {
    if (tools[legacy]) tools[legacy].enabled = false;
    catalogToolEnabled.set(legacy, false);
  }
  toolRegistrationFamily.set("manage_material", "textures");
  catalogToolEnabled.set("manage_material", true);
}

function registerConsolidatedAnimationTimelineTool(): void {
  if (tools.manage_animation_timeline) return;
  createTool("manage_animation_timeline", {
    ...consolidatedAnimationTimelineToolDocs,
    inputSchema: consolidatedAnimationTimelineInputSchema,
    async execute(request) {
      let target: string = "animation_copy_paste";
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
  }, "stable");
  for (const legacy of ["manage_keyframes", "animation_graph_editor", "animation_timeline", "batch_keyframe_operations", "animation_copy_paste"]) {
    if (tools[legacy]) tools[legacy].enabled = false;
    catalogToolEnabled.set(legacy, false);
  }
  toolRegistrationFamily.set("manage_animation_timeline", "animation");
  catalogToolEnabled.set("manage_animation_timeline", true);
}

function registerConsolidatedMaterialInstancesTool(): void {
  if (tools.manage_material_instances) return;
  createTool("manage_material_instances", {
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
  }, "stable");
  for (const legacy of ["list_material_instances", "get_face_material_instances", "set_face_material_instance", "bulk_set_material_instances", "clear_material_instances"]) {
    if (tools[legacy]) tools[legacy].enabled = false;
    catalogToolEnabled.set(legacy, false);
  }
  toolRegistrationFamily.set("manage_material_instances", "material_instances");
  catalogToolEnabled.set("manage_material_instances", true);
}

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
let phaseSwitchHandler:
  | ((phase: McpAuthoringPhase) => void)
  | undefined;
let profileSwitchHandler:
  | ((profile: McpRegistrationProfile) => void)
  | undefined;

export function setMcpPhaseSwitchHandler(
  handler: (phase: McpAuthoringPhase) => void
): void {
  phaseSwitchHandler = handler;
}

export function setMcpProfileSwitchHandler(
  handler: (profile: McpRegistrationProfile) => void
): void {
  profileSwitchHandler = handler;
}

function registerPhaseControlTool(): void {
  createTool(
    "switch_authoring_phase",
    {
      description:
        "Switches the live MCP authoring surface to one explicit phase without requiring a UI reload.",
      parameters: z.object({
        target_phase: z.enum(["geometry", "texturing", "animation"]),
        reason: z.string().min(1),
        resume_from: z.string().min(1),
      }),
      async execute({ target_phase, reason, resume_from }) {
        phaseSwitchHandler?.(target_phase);
        return {
          content: [
            {
              type: "text" as const,
              text: `MCP authoring phase switched to ${target_phase}. Reconnect the client to refresh tools/list.`,
            },
          ],
          structuredContent: {
            phase: target_phase,
            reason,
            resume_from,
            surface_changed: true,
            reload_required: false,
            action: `reconnect MCP client for ${target_phase}`,
          },
        };
      },
    },
    "stable",
    true
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
  if (profile === DEFAULT_MCP_REGISTRATION_PROFILE) registerConsolidatedInspectionTool();
  if (profile === DEFAULT_MCP_REGISTRATION_PROFILE) registerConsolidatedMaterialTool();
  if (profile === DEFAULT_MCP_REGISTRATION_PROFILE) registerConsolidatedAnimationTimelineTool();
  if (profile === DEFAULT_MCP_REGISTRATION_PROFILE) registerConsolidatedMaterialInstancesTool();

  phaseSurfaceCache.clear();
}

export function getActiveMcpRegistrationProfile(): McpRegistrationProfile {
  return activeRegistrationProfile;
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
