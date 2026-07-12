import profileConfigJson from "../../../engines/shared/profiles/tool-profiles.json" assert { type: "json" };
import { getAllToolDefinitions, tools } from "@/lib/factories";
import { setExecutionProfileState, getExecutionProfileState } from "@/lib/executionState";
import { resolveMutationExecutionContext } from "@/lib/mutationContext";
import {
  assertToolMutationAllowed,
  releaseProjectWriteLease,
} from "@/lib/writeLease";
import {
  assertGeometryMutationPhase,
  recordGeometryVisualRuntimeResult,
} from "@/lib/geometryRuntime";

interface ToolProfileDefinition {
  description: string;
  allowed_tools?: string[];
  include_all?: boolean;
}

interface ToolProfileConfig {
  schema_version: string;
  default_profile: string;
  core_tools: string[];
  profiles: Record<string, ToolProfileDefinition>;
  stage_map: Record<string, string>;
  forbidden_in_normal_profiles: string[];
}

interface ToolDefinitionLike {
  execute: (args: Record<string, unknown>, context?: unknown) => Promise<unknown>;
  annotations?: { readOnlyHint?: boolean };
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

export const TOOL_PROFILE_CHANGED_EVENT = "mcp-tool-profile-changed";

const config = profileConfigJson as ToolProfileConfig;
const wrapped = new Set<string>();
const geometryProfiles = new Set([
  "BEDROCK_CUBOID_GEOMETRY",
  "GEOMETRY_LOCAL_REPAIR",
  "GEOMETRY_VISUAL_REBUILD",
]);
const textureProfiles = new Set([
  "BEDROCK_CUBOID_TEXTURE",
  "TEXTURE_LOCAL_REPAIR",
]);
const stageCompletionTools = new Set([
  "complete_stage",
  "complete_geometry_stage",
]);
let activeProfileId = config.default_profile;
let profileRevision = 1;
let initialized = false;
let validationErrors: string[] = [];

function hash(value: string): string {
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index++) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}

function profile(profileId = activeProfileId): ToolProfileDefinition {
  const value = config.profiles[profileId];
  if (!value) throw new Error(`Unknown tool profile "${profileId}".`);
  return value;
}

function allowedNames(profileId = activeProfileId): string[] {
  const current = profile(profileId);
  const all = Object.keys(getAllToolDefinitions());
  if (current.include_all) return all.sort();
  return [...new Set([...config.core_tools, ...(current.allowed_tools ?? [])])]
    .filter((name) => all.includes(name))
    .sort();
}

function validateConfig(): string[] {
  const known = new Set(Object.keys(getAllToolDefinitions()));
  const errors: string[] = [];
  if (!config.profiles[config.default_profile]) {
    errors.push("Default tool profile is missing.");
  }
  for (const name of config.core_tools) {
    if (!known.has(name)) errors.push(`Unknown core tool: ${name}`);
  }
  for (const [profileId, definition] of Object.entries(config.profiles)) {
    for (const name of definition.allowed_tools ?? []) {
      if (!known.has(name)) {
        errors.push(`${profileId} references unknown tool ${name}.`);
      }
      if (
        !definition.include_all &&
        config.forbidden_in_normal_profiles.includes(name)
      ) {
        errors.push(`${profileId} exposes forbidden tool ${name}.`);
      }
    }
  }
  for (const [stage, profileId] of Object.entries(config.stage_map)) {
    if (!config.profiles[profileId]) {
      errors.push(`${stage} maps to unknown profile ${profileId}.`);
    }
  }
  return errors;
}

function applyExposure(): void {
  const allowed = new Set(allowedNames());
  for (const [name, metadata] of Object.entries(tools)) {
    metadata.enabled = allowed.has(name);
  }
}

function publishExecutionState(snapshot: ToolProfileSnapshot): void {
  setExecutionProfileState({
    profileId: snapshot.profile_id,
    profileRevision: snapshot.profile_revision,
    profileHash: snapshot.tool_profile_hash,
  });
}

function emitChanged(): void {
  if (typeof document !== "undefined") {
    document.dispatchEvent(
      new CustomEvent(TOOL_PROFILE_CHANGED_EVENT, {
        detail: getToolProfileSnapshot(false),
      })
    );
  }
}

function hasArg(args: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(args, key) && args[key] !== undefined;
}

function assertArguments(toolName: string, args: Record<string, unknown>): void {
  if (activeProfileId === "DIAGNOSTIC_ESCALATION") return;
  if (geometryProfiles.has(activeProfileId)) {
    assertGeometryMutationPhase(toolName, args, activeProfileId);

    if (toolName === "capture_visual_feedback" && args.include_reference === true) {
      throw new Error(
        "REFERENCE_VISUAL_TRANSPORT_BLOCKED: capture_visual_feedback cannot embed the original Reference Visual in a normal Geometry response. Call inspect_reference_visual_preview once, then capture current model views with include_reference=false."
      );
    }

    if (toolName === "place_cube") {
      if (hasArg(args, "texture")) {
        throw new Error(
          `TOOL_PROFILE_ARGUMENT_BLOCKED: texture assignment is not allowed in ${activeProfileId}.`
        );
      }
      if (
        Array.isArray(args.faces) &&
        args.faces.some(
          (face) =>
            typeof face === "object" && face !== null && "uv" in face
        )
      ) {
        throw new Error(
          `TOOL_PROFILE_ARGUMENT_BLOCKED: custom face UV is not allowed in ${activeProfileId}.`
        );
      }
    }
    if (toolName === "modify_cube") {
      const blocked = ["autouv", "uv_offset", "mirror_uv", "faces"].filter(
        (key) => hasArg(args, key)
      );
      if (blocked.length) {
        throw new Error(
          `TOOL_PROFILE_ARGUMENT_BLOCKED: ${blocked.join(", ")} belong to Texture stage.`
        );
      }
    }
  }
  if (
    textureProfiles.has(activeProfileId) &&
    toolName === "create_texture" &&
    hasArg(args, "pbr_channel")
  ) {
    throw new Error(
      `TOOL_PROFILE_ARGUMENT_BLOCKED: PBR is forbidden in ${activeProfileId}.`
    );
  }
}

function canEnterBootstrapWithoutProject(
  toolName: string,
  args: Record<string, unknown>
): boolean {
  return (
    toolName === "activate_tool_profile" &&
    (typeof Project === "undefined" || !Project) &&
    args.profile_id === "BOOTSTRAP"
  );
}

function installGuards(): void {
  const definitions = getAllToolDefinitions() as Record<
    string,
    ToolDefinitionLike
  >;
  for (const [name, definition] of Object.entries(definitions)) {
    if (wrapped.has(name)) continue;
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      if (!isToolAllowed(name)) {
        throw new Error(
          `TOOL_PROFILE_BLOCKED: "${name}" is not allowed by "${activeProfileId}".`
        );
      }
      assertArguments(name, args);
      const mutationContext = resolveMutationExecutionContext(context);
      if (!canEnterBootstrapWithoutProject(name, args)) {
        assertToolMutationAllowed(
          name,
          args,
          mutationContext,
          definition.annotations?.readOnlyHint
        );
      }

      const profileBefore = getExecutionProfileState();
      const result = await execute(args, context);
      if (name === "record_geometry_visual_decision") {
        recordGeometryVisualRuntimeResult(args, result);
      }
      const profileChanged =
        getExecutionProfileState().profileRevision !==
        profileBefore.profileRevision;
      if (
        stageCompletionTools.has(name) ||
        (name === "activate_tool_profile" && profileChanged)
      ) {
        releaseProjectWriteLease(mutationContext);
      }
      return result;
    };
    wrapped.add(name);
  }
}

export function initializeToolProfiles(): ToolProfileSnapshot {
  installGuards();
  validationErrors = validateConfig();
  applyExposure();
  initialized = true;
  const snapshot = getToolProfileSnapshot(false);
  publishExecutionState(snapshot);
  emitChanged();
  return snapshot;
}

export function isToolAllowed(
  toolName: string,
  profileId = activeProfileId
): boolean {
  const current = profile(profileId);
  return (
    current.include_all === true ||
    config.core_tools.includes(toolName) ||
    (current.allowed_tools ?? []).includes(toolName)
  );
}

export function activateToolProfile(profileId: string): {
  changed: boolean;
  previous_profile: string;
  snapshot: ToolProfileSnapshot;
} {
  profile(profileId);
  const previous = activeProfileId;
  const changed = previous !== profileId;
  if (changed) {
    activeProfileId = profileId;
    profileRevision += 1;
    applyExposure();
  }
  const snapshot = getToolProfileSnapshot(false);
  publishExecutionState(snapshot);
  if (changed) emitChanged();
  return { changed, previous_profile: previous, snapshot };
}

export function getToolProfileSnapshot(
  includeTools = false
): ToolProfileSnapshot {
  const exposed = allowedNames();
  return {
    profile_id: activeProfileId,
    profile_revision: profileRevision,
    description: profile().description,
    exposed_tool_count: exposed.length,
    total_library_tool_count: Object.keys(getAllToolDefinitions()).length,
    tool_profile_hash: hash(`${activeProfileId}:${exposed.join(",")}`),
    reconnect_required_after_change: true,
    validation_errors: [...validationErrors],
    ...(includeTools ? { exposed_tools: exposed } : {}),
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
