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
  // Internal extended compatibility only adds Legacy UI Fallback families.
  // They remain debug/maintenance capability rather than an authoring profile.
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
  // Read-only cross-phase inventory + global UV audit. Geometry uses it before
  // handoff; Texturing reuses it without borrowing Cube mutation.
  "list_textures",
]);

const PHASE_FOREIGN_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Foreign phases are Texturing (Texture/PBR) and Animation (keyframes/controllers).",
  texturing:
    "Foreign phases are Geometry (Cube/Group/rig/UV mutation) and Animation (keyframes/controllers).",
  animation:
    "Foreign phases are Geometry (Cube/Group/rig/UV mutation) and Texturing (Texture/PBR).",
};

const PHASE_OWNER_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Geometry owns Cube/Group/rig/Locator/Null mutation, UV Layout, and optional 3D Evidence lifecycle.",
  texturing:
    "Texturing owns Texture Atlas, Painter, PBR, material-instance authoring, and Texture Verify.",
  animation:
    "Animation owns authored animations, keyframes, timeline, effects, controllers, and animation inspection.",
};

const PHASE_RUNTIME_OWNER_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry: "Owns: Cube/Group/rig/Locator/Null + UV Layout + optional 3D Evidence.",
  texturing: "Owns: Texture Atlas/Painter/PBR/materials + Texture Verify.",
  animation: "Owns: animations/keyframes/timeline/effects/controllers/inspection.",
};

const PHASE_READINESS_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Texturing handoff readiness: geometry=PASS; uv_layout=PASS; final Box-UV lock is complete where applicable; list_textures has no unresolved invalid/out-of-bounds/partial-overlap blocker.",
  texturing:
    "Animation handoff readiness: texture_verify=PASS; no unresolved Geometry/UV blocker remains; required texture/material state is current.",
  animation:
    "Animation completion readiness: requested motion scope is verified; any structural rig/pivot/IK defect returns to Geometry instead of being repaired here.",
};

const PHASE_SUPPORT_ROUTING: Record<McpAuthoringPhase, string> = {
  geometry:
    "Support-only routes: selection tools only when editor selection is required; locator tools only for explicit attachment/marker needs; camera only for visual checkpoints; history only for recovery; export only at the final artifact checkpoint.",
  texturing:
    "Support-only routes: camera only for visual texture checkpoints; history only for recovery; export only at the final artifact checkpoint.",
  animation:
    "Support-only routes: camera only for motion checkpoints; history only for recovery; export only at the final artifact checkpoint.",
};

const GEOMETRY_SUBGROUP_ROUTING =
  "Geometry intent routes: setup_and_hierarchy=create_project/get_project_info; geometry_authoring=add_group/manage_cubes(operation=create)/duplicate_element/reparent_element; correction_and_inspection=manage_cubes(operation=update|batch_update)/modify_group/remove_element/rename_element/inspect_elements(mode=outline|search|detail)/inspect_model_bounds; checkpoint_and_export=capture_model_views/export_model. Legacy Geometry Plan and compiler routes are not part of the production surface. Selection, locator discovery, generic screenshots, format discovery, and history are conditional support only. Choose one direct route from the current intent.";

void PHASE_SUPPORT_ROUTING;
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
  const allowedToolsText =
    allowedTools.length > 0
      ? ` Allowed tools (${allowedTools.length}): ${allowedTools.join(", ")}.`
      : "";
  return [
    `ACTIVE PHASE: ${label}. MCP CORE + ${label} only.`,
    BEDROCK_AUTHORING_COORDINATE_CONTRACT,
    PHASE_RUNTIME_OWNER_SUMMARY[phase],
    `${PHASE_FOREIGN_SUMMARY[phase]} unavailable until phase handoff.`,
    "Do not search for, emulate, rename, or substitute foreign tools.",
    `${MCP_HANDOFF_REQUIRED}: include target_phase, reason, readiness, resume_from; invoke switch_authoring_phase through the Gateway, then stop using prior-phase mutation routes while the Gateway refreshes automatically.${allowedToolsText}`,
  ].join(" ");
}

export function buildMcpPhasePromptHeader(
  phase: McpAuthoringPhase,
  allowedTools: readonly string[] = []
): string {
  return [
    "## Active Phase Contract",
    buildMcpPhaseRuntimeContract(phase, allowedTools),
    "Only the current phase workflow is rendered below. Later phases become callable only after a Gateway phase handoff; the same task/chat continues.",
  ].join("\n\n");
}

export function buildMcpPhaseHandoffContract(
  phase: McpAuthoringPhase
): string {
  return [
    "## Phase Readiness / Handoff",
    PHASE_READINESS_SUMMARY[phase],
    "A handoff preserves only resume-critical state: target_phase, reason, readiness, resume_from, and action. resume_from names the current model/project, immediate target identifiers, and last verified gate; include an exact UUID only when the next mutation needs it. Do not create a persistent UUID registry or tool-call transcript.",
    `${MCP_HANDOFF_REQUIRED} means STOP using current-phase mutation routes, invoke switch_authoring_phase through the Gateway, then continue the same task after the Gateway refreshes the Runtime catalog.`,
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
  return category === "core" || category === phase;
}
