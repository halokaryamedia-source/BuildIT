import type { McpRegistrationFamily } from "@/lib/registrationProfile";

export const MCP_AUTHORING_PHASE_SETTING_ID = "mcp_authoring_phase";

export const MCP_AUTHORING_PHASES = [
  "geometry",
  "texturing",
  "animation",
] as const;

export type McpAuthoringPhase = (typeof MCP_AUTHORING_PHASES)[number];
export type McpToolPhaseCategory = "core" | McpAuthoringPhase;

export const DEFAULT_MCP_AUTHORING_PHASE: McpAuthoringPhase = "geometry";

let activeAuthoringPhase: McpAuthoringPhase = DEFAULT_MCP_AUTHORING_PHASE;

const CORE_FAMILIES = new Set<McpRegistrationFamily>([
  "camera",
  "element_inspection",
  "export",
  "history",
  "project",
  // Generic fallback families are Core only when the explicit extended
  // registration profile makes them available. Their individually disabled
  // tools remain disabled at createTool().
  "import",
  "ui",
]);

const CORE_ELEMENT_TOOLS = new Set([
  "remove_element",
  "list_outline",
  "rename_element",
  "find_elements_by_criteria",
  "select_all_of_type",
  "get_selection",
  "list_locator_elements",
]);

const GEOMETRY_ELEMENT_TOOLS = new Set([
  "add_group",
  "duplicate_element",
  "manage_locator",
  "manage_null_object",
]);

export function resolveMcpAuthoringPhase(value: unknown): McpAuthoringPhase {
  return MCP_AUTHORING_PHASES.includes(value as McpAuthoringPhase)
    ? (value as McpAuthoringPhase)
    : DEFAULT_MCP_AUTHORING_PHASE;
}

export function setActiveMcpAuthoringPhase(phase: McpAuthoringPhase): void {
  activeAuthoringPhase = phase;
}

export function getActiveMcpAuthoringPhase(): McpAuthoringPhase {
  return activeAuthoringPhase;
}

/**
 * Assign one retained MCP tool to exactly one authoring ownership category.
 * Core remains available in every phase; phase-owned mutation families do not
 * cross authoring boundaries. Unknown mixed-family tools fail closed (null).
 */
export function classifyMcpToolPhase(
  toolName: string,
  family: McpRegistrationFamily
): McpToolPhaseCategory | null {
  if (CORE_FAMILIES.has(family)) return "core";

  if (family === "cubes") return "geometry";
  if (family === "textures" || family === "paint" || family === "material_instances") {
    return "texturing";
  }
  if (family === "animation_inspection") return "animation";

  if (family === "animation") {
    // Rig/pivot hierarchy is Geometry ownership. Animation must hand back to
    // Geometry instead of silently rewriting the rig mid-animation pass.
    return toolName === "bone_rigging" ? "geometry" : "animation";
  }

  if (family === "elements") {
    if (CORE_ELEMENT_TOOLS.has(toolName)) return "core";
    if (GEOMETRY_ELEMENT_TOOLS.has(toolName)) return "geometry";
    // Retained legacy material lookup is texturing-owned even though it stays
    // individually disabled on the normal Bedrock Entity surface.
    if (toolName === "filter_by_material") return "texturing";
    return null;
  }

  // validator_resources registers resources rather than MCP tools.
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
