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
  "list_outline",
  "find_elements_by_criteria",
  "select_all_of_type",
  "get_selection",
  "list_locator_elements",
]);

const GEOMETRY_ELEMENT_TOOLS = new Set([
  "add_group",
  "duplicate_element",
  "remove_element",
  "rename_element",
  "manage_locator",
  "manage_null_object",
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
    "Geometry owns Cube/Group/rig/Locator/Null mutation and UV Layout mutation/audit.",
  texturing:
    "Texturing owns Texture Atlas, Painter, PBR, material-instance authoring, and Texture Verify.",
  animation:
    "Animation owns authored animations, keyframes, timeline, effects, controllers, and animation inspection.",
};

const PHASE_READINESS_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry:
    "Texturing handoff readiness: geometry=PASS; uv_layout=PASS; final Box-UV lock is complete where applicable; list_textures has no unresolved invalid/out-of-bounds/partial-overlap blocker.",
  texturing:
    "Animation handoff readiness: texture_verify=PASS; no unresolved Geometry/UV blocker remains; required texture/material state is current.",
  animation:
    "Animation completion readiness: requested motion scope is verified; any structural rig/pivot/IK defect returns to Geometry instead of being repaired here.",
};

export function isMcpAuthoringPhase(value: unknown): value is McpAuthoringPhase {
  return MCP_AUTHORING_PHASES.includes(value as McpAuthoringPhase);
}

/**
 * Missing/default setting starts in Geometry. An explicit invalid value is a
 * configuration error because silently pretending it is Geometry would give
 * the agent a plausible but incorrect authoring context.
 */
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
  phase: McpAuthoringPhase
): string {
  const label = phase.toUpperCase();
  return [
    `ACTIVE PHASE: ${label}. Exposed surface: MCP CORE + ${label} only.`,
    PHASE_OWNER_SUMMARY[phase],
    `${PHASE_FOREIGN_SUMMARY[phase]} Their tools are intentionally unavailable.`,
    "Do not tool_search for, emulate, rename, or substitute a foreign-phase tool.",
    `If another phase is required, return ${MCP_HANDOFF_REQUIRED} with target_phase, reason, readiness, resume_from, and action="set MCP Authoring Phase=<phase>; reload BlockIT MCP", then STOP.`,
  ].join(" ");
}

export function buildMcpPhasePromptHeader(
  phase: McpAuthoringPhase
): string {
  return [
    "## Active Phase Contract",
    buildMcpPhaseRuntimeContract(phase),
    "Only the current phase workflow is rendered below. Later phases are handoff targets, not callable routes in this session.",
  ].join("\n\n");
}

export function buildMcpPhaseHandoffContract(
  phase: McpAuthoringPhase
): string {
  return [
    "## Phase Readiness / Handoff",
    PHASE_READINESS_SUMMARY[phase],
    "A handoff must preserve only resume-critical state: target_phase, reason, readiness, resume_from, and action. resume_from names the current model/project, immediate target identifiers, and last verified gate; include an exact UUID only when the next mutation needs it. Do not create a persistent UUID registry or tool-call transcript.",
    `${MCP_HANDOFF_REQUIRED} means STOP after reporting the handoff.`,
  ].join("\n\n");
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

  if (family === "textures") {
    return CORE_TEXTURE_TOOLS.has(toolName) ? "core" : "texturing";
  }
  if (family === "paint" || family === "material_instances") {
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
