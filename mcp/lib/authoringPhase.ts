import type { McpRegistrationFamily } from "@/lib/registrationProfile";

export const MCP_AUTHORING_PHASE_SETTING_ID = "mcp_authoring_phase";
export const MCP_HANDOFF_REQUIRED = "HANDOFF_REQUIRED";

export const MCP_AUTHORING_PHASES = [
  "geometry",
  "texturing",
  "animation",
] as const;

export type McpAuthoringPhase = (typeof MCP_AUTHORING_PHASES)[number];
export type McpToolPhaseCategory = "core" | McpAuthoringPhase;

export const DEFAULT_MCP_AUTHORING_PHASE: McpAuthoringPhase = "geometry";

/** Normal asset authoring does not load root CONTEXT.md, so this invariant travels with MCP initialize. */
export const BEDROCK_AUTHORING_COORDINATE_CONTRACT =
  "Coords: 16 Blockbench units=1 Minecraft block; x=width,y=height,z=length,+Y=up.";

let activeAuthoringPhase: McpAuthoringPhase = DEFAULT_MCP_AUTHORING_PHASE;

const CORE_FAMILIES = new Set<McpRegistrationFamily>([
  "camera",
  "element_inspection",
  "export",
  "history",
  "project",
  "phase_control",
  "import",
  "ui",
]);

const CORE_ELEMENT_TOOLS = new Set(["inspect_elements"]);

const GEOMETRY_ELEMENT_TOOLS = new Set([
  "modify_group",
  "remove_element",
  "rename_element",
]);

const GEOMETRY_MAINTENANCE_TOOLS = new Set([
  "add_group",
  "manage_cubes",
  "duplicate_element",
  "reparent_element",
  "manage_locator",
  "manage_null_object",
  "manage_geometry_reference",
]);

const CORE_TEXTURE_TOOLS = new Set([
  "list_textures",
]);

function isSharedAuthoringStage(phase: McpAuthoringPhase): boolean {
  return phase === "geometry" || phase === "texturing";
}

const PHASE_FOREIGN_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Foreign: Animation only. Geometry and Texturing share the AUTHORING tool surface.",
  texturing:
    "Foreign: Animation only. Geometry and Texturing share the AUTHORING tool surface.",
  animation:
    "Foreign: AUTHORING (Geometry/rig/UV/Texture/PBR).",
};

const PHASE_OWNER_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "AUTHORING surface; Geometry focus owns Cube/Group/rig/Locator/Null mutation and UV Layout. Texture capabilities remain callable for adjacent authoring work.",
  texturing:
    "AUTHORING surface; Texturing focus owns Texture Atlas/Painter/PBR/materials/Texture Verify. Geometry/UV capabilities remain callable for bounded upstream correction.",
  animation:
    "Animation owns animations, keyframes, timeline, effects, controllers, and animation inspection.",
};

const PHASE_RUNTIME_OWNER_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry: "AUTHORING surface. Current focus: Geometry/rig/UV Layout.",
  texturing: "AUTHORING surface. Current focus: Texture Atlas/Painter/PBR/Texture Verify.",
  animation: "Animation surface. Owns motion/keyframes/effects/controllers/inspection.",
};

const PHASE_READINESS_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Authoring readiness: geometry=PASS and uv_layout=PASS before substantial styling; texture_verify=PASS before Animation/finalization.",
  texturing:
    "Animation handoff readiness: geometry=PASS; uv_layout=PASS; texture_verify=PASS; no unresolved Geometry/surface/UV blocker remains.",
  animation:
    "Animation completion readiness: requested motion scope is verified; any structural rig/pivot/UV/texture defect returns to the shared AUTHORING surface.",
};

const GEOMETRY_SUBGROUP_ROUTING =
  "Geometry intent routes: setup_and_hierarchy=create_project/get_project_info; geometry_authoring=add_group/manage_cubes(operation=create)/duplicate_element/reparent_element; correction_and_inspection=manage_cubes(operation=update|batch_update)/modify_group/remove_element/rename_element/inspect_elements(mode=outline|search|detail)/inspect_model_bounds; checkpoint_and_export=capture_model_views/export_model. Selection, locator discovery, generic screenshots, format discovery, and history are conditional support only. Choose one direct route from the current intent.";

void GEOMETRY_SUBGROUP_ROUTING;

export function isMcpAuthoringPhase(value: unknown): value is McpAuthoringPhase {
  return MCP_AUTHORING_PHASES.includes(value as McpAuthoringPhase);
}

export function resolveMcpAuthoringPhase(value: unknown): McpAuthoringPhase {
  if (value === undefined || value === null || value === "") {
    return DEFAULT_MCP_AUTHORING_PHASE;
  }
  if (isMcpAuthoringPhase(value)) return value;
  throw new Error(
    `Invalid MCP Authoring Phase "${String(value)}". Expected geometry, texturing, or animation.`
  );
}

export function setActiveMcpAuthoringPhase(phase: McpAuthoringPhase): void {
  activeAuthoringPhase = phase;
}

export function getActiveMcpAuthoringPhase(): McpAuthoringPhase {
  return activeAuthoringPhase;
}

export function getMcpPhaseOwnerSummary(phase: McpAuthoringPhase): string {
  return PHASE_OWNER_SUMMARY[phase];
}

export function getMcpPhaseReadinessSummary(phase: McpAuthoringPhase): string {
  return PHASE_READINESS_SUMMARY[phase];
}

export function buildMcpPhaseRuntimeContract(
  phase: McpAuthoringPhase,
  allowedTools: readonly string[] = []
): string {
  const label = phase.toUpperCase();
  const surface = isSharedAuthoringStage(phase) ? "AUTHORING" : "ANIMATION";
  const allowedToolsText =
    allowedTools.length > 0
      ? ` Allowed tools (${allowedTools.length}): ${allowedTools.join(", ")}.`
      : "";
  const transition = isSharedAuthoringStage(phase)
    ? "Geometry↔Texturing focus changes stay in the same AUTHORING surface; do not call switch_authoring_phase for those corrections."
    : "Structural/UV/texture correction requires HANDOFF_REQUIRED back to AUTHORING.";
  return [
    `ACTIVE STAGE: ${label}. MCP CORE + ${surface} tools available.`,
    BEDROCK_AUTHORING_COORDINATE_CONTRACT,
    PHASE_RUNTIME_OWNER_SUMMARY[phase],
    PHASE_FOREIGN_SUMMARY[phase],
    "Do not search for, emulate, rename, or substitute foreign tools.",
    transition,
    `${MCP_HANDOFF_REQUIRED}: only when crossing AUTHORING↔ANIMATION; include target_phase, reason, readiness, resume_from and invoke switch_authoring_phase through Gateway.${allowedToolsText}`,
  ].join(" ");
}

export function buildMcpPhasePromptHeader(
  phase: McpAuthoringPhase,
  allowedTools: readonly string[] = []
): string {
  return [
    "## Active Stage Contract",
    buildMcpPhaseRuntimeContract(phase, allowedTools),
    isSharedAuthoringStage(phase)
      ? "Geometry and Texturing guidance are rendered together because both operate in the same AUTHORING Runtime surface."
      : "Animation guidance is rendered alone; upstream correction returns through Gateway to the shared AUTHORING surface.",
  ].join("\n\n");
}

export function buildMcpPhaseHandoffContract(
  phase: McpAuthoringPhase
): string {
  if (isSharedAuthoringStage(phase)) {
    return [
      "## Authoring Focus / Handoff",
      PHASE_READINESS_SUMMARY[phase],
      "Geometry↔Texturing correction does not require HANDOFF_REQUIRED or a Runtime phase switch. Use the semantic owner directly in the same task/chat and invalidate only affected downstream evidence.",
      "When Animation is required, handoff state is target_phase, reason, readiness, resume_from; resume_from names the current project, immediate target, and last verified gate.",
      `${MCP_HANDOFF_REQUIRED} means cross AUTHORING↔ANIMATION through switch_authoring_phase via Gateway, then continue the same task/chat.`,
    ].join("\n\n");
  }

  return [
    "## Phase Readiness / Handoff",
    PHASE_READINESS_SUMMARY[phase],
    "A handoff preserves only resume-critical state: target_phase, reason, readiness, resume_from, and action. resume_from names the current model/project, immediate target identifiers, and last verified gate.",
    `${MCP_HANDOFF_REQUIRED} means STOP Animation mutation routes, invoke switch_authoring_phase through the Gateway, then continue the same task on the shared AUTHORING surface.`,
  ].join("\n\n");
}

export function classifyMcpToolPhase(
  toolName: string,
  family: McpRegistrationFamily
): McpToolPhaseCategory | null {
  if (family === "phase_control") return "core";
  if (
    toolName === "capture_screenshot" ||
    toolName === "capture_app_screenshot" ||
    toolName === "set_camera_angle" ||
    toolName === "list_export_formats" ||
    toolName === "save_checkpoint"
  ) {
    return null;
  }
  if (
    toolName === "select_all_of_type" ||
    toolName === "get_selection" ||
    toolName === "list_locator_elements" ||
    toolName === "undo" ||
    toolName === "redo" ||
    toolName === "get_undo_stack"
  ) {
    return "core";
  }
  if (GEOMETRY_MAINTENANCE_TOOLS.has(toolName)) return "geometry";
  if (CORE_FAMILIES.has(family)) return "core";
  if (family === "cubes") return "geometry";
  if (family === "textures") {
    return CORE_TEXTURE_TOOLS.has(toolName) ? "core" : "texturing";
  }
  if (family === "paint" || family === "material_instances") {
    return "texturing";
  }
  if (family === "animation_inspection") return "animation";
  if (family === "animation") {
    return toolName === "bone_rigging" ? "geometry" : "animation";
  }
  if (family === "elements") {
    if (CORE_ELEMENT_TOOLS.has(toolName)) return "core";
    if (GEOMETRY_ELEMENT_TOOLS.has(toolName)) return "geometry";
    if (toolName === "filter_by_material") return "texturing";
    return null;
  }
  return null;
}

export function isMcpToolExposedForPhase(
  toolName: string,
  family: McpRegistrationFamily,
  phase: McpAuthoringPhase
): boolean {
  const category = classifyMcpToolPhase(toolName, family);
  if (category === "core") return true;
  if (phase === "animation") return category === "animation";
  return category === "geometry" || category === "texturing";
}
