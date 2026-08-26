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
  // Generic fallback families are Core only when the explicit extended
  // registration profile makes them available. Their individually disabled
  // tools remain disabled at createTool().
  "import",
  "ui",
]);

const CORE_ELEMENT_TOOLS = new Set([
  "list_outline",
  "find_elements_by_criteria",
]);

const GEOMETRY_ELEMENT_TOOLS = new Set([
  "modify_group",
  "remove_element",
  "rename_element",
]);

const GEOMETRY_MAINTENANCE_TOOLS = new Set([
  "add_group",
  "place_cube",
  "duplicate_element",
  "reparent_element",
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

// Keep shared initialize text semantic rather than naming individual tools. The
// latter pollutes every tool-search corpus entry because namespace instructions
// are shared metadata; exact routes live in the active specialist Skill.
const PHASE_RUNTIME_OWNER_SUMMARY: Record<McpAuthoringPhase, string> = {
  geometry: "Owns: Cube/Group/rig/Locator/Null + UV Layout.",
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
  "Geometry intent routes: setup_and_hierarchy=create_project/get_project_info; geometry_authoring=add_group/place_cube/duplicate_element/reparent_element; correction_and_inspection=modify_cube/modify_cubes_batch/modify_group/remove_element/rename_element/list_outline/find_elements_by_criteria/inspect_element/inspect_model_bounds; checkpoint_and_export=capture_model_views/export_model. prepare_geometry_plan, compile_geometry_spec, and correct_geometry_from_report are disabled from the default Geometry flow until the reference-grounded pipeline is proven stable. Selection, locator discovery, generic screenshots, format discovery, and history are conditional support only. Choose one direct route from the current intent.";

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
  phase: McpAuthoringPhase,
  allowedTools: readonly string[] = []
): string {
  const label = phase.toUpperCase();
  const allowedToolsText =
    allowedTools.length > 0
      ? ` Allowed tools (${allowedTools.length}): ${allowedTools.join(", ")}.`
      : "";
  return [
    `ACTIVE PHASE: ${label}. Surface=MCP CORE+${label}.`,
    BEDROCK_AUTHORING_COORDINATE_CONTRACT,
    PHASE_RUNTIME_OWNER_SUMMARY[phase],
    PHASE_SUPPORT_ROUTING[phase],
    ...(phase === "geometry" ? [GEOMETRY_SUBGROUP_ROUTING] : []),
    `${PHASE_FOREIGN_SUMMARY[phase]} Their tools are intentionally unavailable.`,
    "Do not tool_search for, emulate, rename, or substitute a foreign-phase tool.",
    `Need another phase => ${MCP_HANDOFF_REQUIRED} with target_phase, reason, readiness, resume_from, action="switch_authoring_phase to <phase>", then STOP.${allowedToolsText}`,
  ].join(" ");
}

export function buildMcpPhasePromptHeader(
  phase: McpAuthoringPhase,
  allowedTools: readonly string[] = []
): string {
  return [
    "## Active Phase Contract",
    buildMcpPhaseRuntimeContract(phase, allowedTools),
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
  if (
    toolName === "capture_screenshot" ||
    toolName === "capture_app_screenshot" ||
    toolName === "set_camera_angle" ||
    toolName === "list_export_formats" ||
    toolName === "select_all_of_type" ||
    toolName === "get_selection" ||
    toolName === "list_locator_elements" ||
    toolName === "save_checkpoint" ||
    toolName === "undo" ||
    toolName === "redo" ||
    toolName === "get_undo_stack" ||
    toolName === "manage_null_object"
  ) {
    return null;
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
    // Rig/pivot mutation is an explicit opt-in support route. The normal
    // Geometry surface uses the plan-bound Group tools instead, so this legacy
    // tool must not be surfaced merely because the phase is Geometry.
    return toolName === "bone_rigging" ? null : "animation";
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
