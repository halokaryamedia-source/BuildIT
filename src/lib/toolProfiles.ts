import profileConfigJson from "../../Engine/codex/tool-profiles.json" assert { type: "json" };
import { getAllToolDefinitions, tools } from "@/lib/factories";

interface ToolProfileDefinition {
  description: string;
  allowed_tools?: string[];
  include_all?: boolean;
}

interface ToolProfileConfig {
  schema_version: string;
  default_profile: string;
  profile_change_policy: string;
  core_tools: string[];
  profiles: Record<string, ToolProfileDefinition>;
  stage_map: Record<string, string>;
  forbidden_in_normal_profiles: string[];
}

interface ToolDefinitionLike {
  execute: (
    args: Record<string, unknown>,
    context?: unknown
  ) => Promise<unknown>;
}

export interface ToolProfileSnapshot {
  profile_id: string;
  profile_revision: number;
  description: string;
  exposed_tool_count: number;
  total_library_tool_count: number;
  tool_profile_hash: string;
  reconnect_required_after_change: boolean;
  validation_errors: string[];
  exposed_tools?: string[];
}

const config = profileConfigJson as ToolProfileConfig;
const wrappedTools = new Set<string>();
const geometryProfiles = new Set([
  "BEDROCK_CUBOID_GEOMETRY",
  "GEOMETRY_LOCAL_REPAIR",
]);
const classicTextureProfiles = new Set([
  "BEDROCK_CUBOID_TEXTURE",
  "TEXTURE_LOCAL_REPAIR",
]);
let activeProfileId = config.default_profile;
let profileRevision = 1;
let initialized = false;
let validationErrors: string[] = [];

function fnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function getProfileOrThrow(profileId: string): ToolProfileDefinition {
  const profile = config.profiles[profileId];
  if (!profile) {
    throw new Error(
      `Unknown tool profile "${profileId}". Available profiles: ${Object.keys(config.profiles).join(", ")}`
    );
  }
  return profile;
}

function getAllowedToolNames(profileId = activeProfileId): string[] {
  const profile = getProfileOrThrow(profileId);
  const allNames = Object.keys(getAllToolDefinitions());
  if (profile.include_all) return allNames.sort();

  return Array.from(
    new Set([...(config.core_tools ?? []), ...(profile.allowed_tools ?? [])])
  )
    .filter((name) => allNames.includes(name))
    .sort();
}

function validateProfileConfiguration(): string[] {
  const knownTools = new Set(Object.keys(getAllToolDefinitions()));
  const errors: string[] = [];

  if (!config.profiles[config.default_profile]) {
    errors.push(`Default profile ${config.default_profile} does not exist.`);
  }

  for (const coreTool of config.core_tools) {
    if (!knownTools.has(coreTool)) {
      errors.push(`Core tool ${coreTool} is not registered.`);
    }
  }

  for (const [profileId, profile] of Object.entries(config.profiles)) {
    for (const toolName of profile.allowed_tools ?? []) {
      if (!knownTools.has(toolName)) {
        errors.push(`Profile ${profileId} references unknown tool ${toolName}.`);
      }
    }

    if (!profile.include_all) {
      for (const forbiddenTool of config.forbidden_in_normal_profiles) {
        if ((profile.allowed_tools ?? []).includes(forbiddenTool)) {
          errors.push(
            `Profile ${profileId} exposes forbidden normal-workflow tool ${forbiddenTool}.`
          );
        }
      }
    }
  }

  for (const [stage, profileId] of Object.entries(config.stage_map)) {
    if (!config.profiles[profileId]) {
      errors.push(`Stage ${stage} maps to unknown profile ${profileId}.`);
    }
  }

  return errors;
}

function applyToolExposure(): void {
  const allowed = new Set(getAllowedToolNames());
  for (const [name, metadata] of Object.entries(tools)) {
    metadata.enabled = allowed.has(name);
  }
}

function hasOwn(args: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(args, key) && args[key] !== undefined;
}

function assertToolArgumentsAllowed(
  toolName: string,
  args: Record<string, unknown>
): void {
  if (activeProfileId === "DIAGNOSTIC_ESCALATION") return;

  if (geometryProfiles.has(activeProfileId)) {
    if (toolName === "place_cube") {
      if (hasOwn(args, "texture")) {
        throw new Error(
          `TOOL_PROFILE_ARGUMENT_BLOCKED: explicit texture assignment is not allowed in ${activeProfileId}. Geometry must remain untextured or use an existing neutral placeholder implicitly.`
        );
      }
      const faces = args.faces;
      if (
        Array.isArray(faces) &&
        faces.some((face) => typeof face === "object" && face !== null && "uv" in face)
      ) {
        throw new Error(
          `TOOL_PROFILE_ARGUMENT_BLOCKED: custom face UV data is not allowed in ${activeProfileId}.`
        );
      }
    }

    if (toolName === "modify_cube") {
      const forbiddenGeometryArguments = [
        "autouv",
        "uv_offset",
        "mirror_uv",
        "faces",
      ].filter((key) => hasOwn(args, key));
      if (forbiddenGeometryArguments.length > 0) {
        throw new Error(
          `TOOL_PROFILE_ARGUMENT_BLOCKED: ${forbiddenGeometryArguments.join(", ")} belong to Texture stage, not ${activeProfileId}.`
        );
      }
    }
  }

  if (
    classicTextureProfiles.has(activeProfileId) &&
    toolName === "create_texture" &&
    hasOwn(args, "pbr_channel")
  ) {
    throw new Error(
      `TOOL_PROFILE_ARGUMENT_BLOCKED: pbr_channel is forbidden in ${activeProfileId}. Use Classic Bedrock color/alpha/emissive behavior only.`
    );
  }
}

function installExecutionGuards(): void {
  const definitions = getAllToolDefinitions() as Record<
    string,
    ToolDefinitionLike
  >;

  for (const [name, definition] of Object.entries(definitions)) {
    if (wrappedTools.has(name)) continue;
    const originalExecute = definition.execute;
    definition.execute = async (args, context) => {
      if (!isToolAllowed(name)) {
        throw new Error(
          `TOOL_PROFILE_BLOCKED: tool "${name}" is not allowed by active profile "${activeProfileId}". Activate the correct profile and reconnect once.`
        );
      }
      assertToolArgumentsAllowed(name, args);
      return originalExecute(args, context);
    };
    wrappedTools.add(name);
  }
}

export function initializeToolProfiles(): ToolProfileSnapshot {
  installExecutionGuards();
  validationErrors = validateProfileConfiguration();
  applyToolExposure();
  initialized = true;

  if (validationErrors.length > 0) {
    console.error("[MCP] Tool profile configuration errors:", validationErrors);
  } else {
    console.log(
      `[MCP] Tool profile initialized: ${activeProfileId} (${getAllowedToolNames().length} exposed tools)`
    );
  }

  return getToolProfileSnapshot(false);
}

export function isToolAllowed(
  toolName: string,
  profileId = activeProfileId
): boolean {
  const profile = getProfileOrThrow(profileId);
  if (profile.include_all) return true;
  return (
    config.core_tools.includes(toolName) ||
    (profile.allowed_tools ?? []).includes(toolName)
  );
}

export function activateToolProfile(profileId: string): {
  changed: boolean;
  previous_profile: string;
  snapshot: ToolProfileSnapshot;
} {
  getProfileOrThrow(profileId);
  const previousProfile = activeProfileId;
  const changed = previousProfile !== profileId;

  if (changed) {
    activeProfileId = profileId;
    profileRevision += 1;
    applyToolExposure();
    console.log(
      `[MCP] Tool profile changed: ${previousProfile} -> ${activeProfileId}. Reconnect required for a reduced tool list.`
    );
  }

  return {
    changed,
    previous_profile: previousProfile,
    snapshot: getToolProfileSnapshot(false),
  };
}

export function getToolProfileSnapshot(
  includeTools = false
): ToolProfileSnapshot {
  const profile = getProfileOrThrow(activeProfileId);
  const exposedTools = getAllowedToolNames();
  const definitions = Object.keys(getAllToolDefinitions());
  const hashInput = `${activeProfileId}:${exposedTools.join(",")}`;

  return {
    profile_id: activeProfileId,
    profile_revision: profileRevision,
    description: profile.description,
    exposed_tool_count: exposedTools.length,
    total_library_tool_count: definitions.length,
    tool_profile_hash: fnv1a(hashInput),
    reconnect_required_after_change: true,
    validation_errors: [...validationErrors],
    ...(includeTools ? { exposed_tools: exposedTools } : {}),
  };
}

export function getToolProfileIds(): string[] {
  return Object.keys(config.profiles);
}

export function getStageToolProfile(stage: string): string | null {
  return config.stage_map[stage] ?? null;
}

export function toolProfilesInitialized(): boolean {
  return initialized;
}
