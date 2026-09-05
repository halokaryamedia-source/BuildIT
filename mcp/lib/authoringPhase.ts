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
const CORE_TEXTURE_TOOLS = new Set(["list_textures"]);

function isAuthoringStage(phase: McpAuthoringPhase): boolean {
  return phase !== "animation";
}

const PHASE_OWNER_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry: "AUTHORING focus: Geometry/rig/UV Layout.",
  texturing: "AUTHORING focus: Texture/Painter/PBR/Texture Verify.",
  animation: "ANIMATION focus: motion/keyframes/effects/controllers.",
};

const PHASE_READINESS_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Authoring readiness: geometry=PASS; uv_layout=PASS before substantial styling; texture_verify=PASS before Animation/finalization.",
  texturing:
    "Animation handoff readiness: geometry=PASS; uv_layout=PASS; texture_verify=PASS; no unresolved Authoring blocker.",
  animation:
    "Animation completion readiness: requested motion is verified; structural/UV/texture defects return to AUTHORING.",
};

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
  const surface = isAuthoringStage(phase) ? "AUTHORING" : "ANIMATION";
  const allowed =
    allowedTools.length > 0
      ? ` Allowed tools (${allowedTools.length}): ${allowedTools.join(", ")}.`
      : "";
  const transition = isAuthoringStage(phase)
    ? "Geometry↔Texturing stays in AUTHORING."
    : "Upstream correction requires AUTHORING handoff.";
  return [
    `ACTIVE STAGE: ${label}. MCP CORE + ${surface} tools available.`,
    BEDROCK_AUTHORING_COORDINATE_CONTRACT,
    PHASE_OWNER_SUMMARY[phase],
    "Do not search for, emulate, rename, or substitute foreign tools.",
    transition,
    `${MCP_HANDOFF_REQUIRED} only AUTHORING↔ANIMATION: target_phase, reason, readiness, resume_from; use switch_authoring_phase through Gateway.${allowed}`,
  ].join(" ");
}

export function buildMcpPhasePromptHeader(
  phase: McpAuthoringPhase,
  allowedTools: readonly string[] = []
): string {
  return [
    "## Active Stage Contract",
    buildMcpPhaseRuntimeContract(phase, allowedTools),
    isAuthoringStage(phase)
      ? "Geometry and Texturing guidance share the AUTHORING Runtime surface."
      : "Animation guidance is isolated; upstream correction returns to AUTHORING.",
  ].join("\n\n");
}

export function buildMcpPhaseHandoffContract(
  phase: McpAuthoringPhase
): string {
  if (isAuthoringStage(phase)) {
    return [
      "## Authoring Focus / Handoff",
      PHASE_READINESS_SUMMARY[phase],
      "Geometry↔Texturing correction does not require HANDOFF_REQUIRED; use the semantic owner directly in AUTHORING.",
      `${MCP_HANDOFF_REQUIRED} is only AUTHORING↔ANIMATION through switch_authoring_phase via Gateway; continue the same task/chat with target_phase, reason, readiness, resume_from.`,
    ].join("\n\n");
  }
  return [
    "## Phase Readiness / Handoff",
    PHASE_READINESS_SUMMARY[phase],
    "Keep target_phase, reason, readiness, resume_from.",
    `${MCP_HANDOFF_REQUIRED}: STOP Animation mutation routes, invoke switch_authoring_phase through Gateway, then continue the same task on the shared AUTHORING surface.`,
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
  ) return null;
  if (
    toolName === "select_all_of_type" ||
    toolName === "get_selection" ||
    toolName === "list_locator_elements" ||
    toolName === "undo" ||
    toolName === "redo" ||
    toolName === "get_undo_stack"
  ) return "core";
  if (GEOMETRY_MAINTENANCE_TOOLS.has(toolName)) return "geometry";
  if (CORE_FAMILIES.has(family)) return "core";
  if (family === "cubes") return "geometry";
  if (family === "textures") {
    return CORE_TEXTURE_TOOLS.has(toolName) ? "core" : "texturing";
  }
  if (family === "paint" || family === "material_instances") return "texturing";
  if (family === "animation_inspection") return "animation";
  if (family === "animation") {
    return toolName === "bone_rigging" ? "geometry" : "animation";
  }
  if (family === "elements") {
    if (CORE_ELEMENT_TOOLS.has(toolName)) return "core";
    if (GEOMETRY_ELEMENT_TOOLS.has(toolName)) return "geometry";
    if (toolName === "filter_by_material") return "texturing";
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
