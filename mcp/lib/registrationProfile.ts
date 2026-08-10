export type McpRegistrationProfile = "bedrock_entity" | "extended";

export type McpRegistrationFamily =
  | "animation"
  | "animation_inspection"
  | "camera"
  | "cubes"
  | "elements"
  | "element_inspection"
  | "export"
  | "history"
  | "import"
  | "material_instances"
  | "paint"
  | "project"
  | "textures"
  | "ui"
  | "validator_resources";

/**
 * The normal BlockIT MCP product profile.
 *
 * Keep every family that is native/relevant to the Bedrock Entity workflow
 * available here. P1 registration reduction is not permission to delete or
 * silently gate native Bedrock capability merely because it is optional in a
 * particular modelling pass.
 */
export const BEDROCK_ENTITY_REGISTRATION_FAMILIES = [
  "animation",
  "animation_inspection",
  "camera",
  "cubes",
  "elements",
  "element_inspection",
  "export",
  "history",
  "material_instances",
  "paint",
  "project",
  "textures",
  "validator_resources",
] as const satisfies readonly McpRegistrationFamily[];

/**
 * Generic Blockbench fallback families retained in source but not exposed by
 * the normal Bedrock Entity profile.
 *
 * P0.2 containment remains authoritative inside these families: selecting the
 * extended profile does not re-enable `risky_eval` or `from_geo_json` because
 * those tools remain individually disabled at their createTool() boundary.
 */
export const EXTENDED_LEGACY_REGISTRATION_FAMILIES = [
  "import",
  "ui",
] as const satisfies readonly McpRegistrationFamily[];

export const DEFAULT_MCP_REGISTRATION_PROFILE: McpRegistrationProfile =
  "bedrock_entity";

export function getRegistrationFamilies(
  profile: McpRegistrationProfile = DEFAULT_MCP_REGISTRATION_PROFILE
): readonly McpRegistrationFamily[] {
  if (profile === "extended") {
    return [
      ...BEDROCK_ENTITY_REGISTRATION_FAMILIES,
      ...EXTENDED_LEGACY_REGISTRATION_FAMILIES,
    ];
  }

  return BEDROCK_ENTITY_REGISTRATION_FAMILIES;
}
