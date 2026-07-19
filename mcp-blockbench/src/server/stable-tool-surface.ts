import profileConfigJson from "../../engines/shared/profiles/tool-profiles.json" assert { type: "json" };
import {
  getAllToolDefinitions,
  tools,
} from "@/lib/factories";
import { TOOL_PROFILE_CHANGED_EVENT } from "@/lib/toolProfiles";

let installed = false;

interface MutableToolDefinition {
  title?: string;
  description?: string;
}

interface ProfileConfig {
  core_tools: string[];
  profiles: Record<
    string,
    {
      allowed_tools?: string[];
      include_all?: boolean;
    }
  >;
}

const INTERNAL_OR_MANUAL_TOOLS = new Set([
  "activate_tool_profile",
  "manage_project_write_lease",
  "rebind_active_project_identity",
]);

function stableProductionToolNames(): Set<string> {
  const config = profileConfigJson as ProfileConfig;
  const names = new Set<string>(config.core_tools);
  for (const profile of Object.values(config.profiles)) {
    if (profile.include_all) continue;
    for (const name of profile.allowed_tools ?? []) names.add(name);
  }
  for (const name of INTERNAL_OR_MANUAL_TOOLS) names.delete(name);
  return names;
}

/**
 * Every MCP session receives one stable production tool union. Stage changes do
 * not require reconnecting, while diagnostic-only, unsafe, unrelated, and manual
 * coordination tools stay out of Codex's normal schema.
 *
 * `STABLE_FULL_LIBRARY` remains a legacy compatibility marker for older state
 * files; the active public surface is `STABLE_PRODUCTION_UNION`.
 */
export function enforceStableToolSurface(): void {
  const publicTools = stableProductionToolNames();
  for (const [name, metadata] of Object.entries(tools)) {
    metadata.enabled = publicTools.has(name);
  }
}

function updateDefinition(
  definitions: Record<string, MutableToolDefinition>,
  name: string,
  title: string,
  description: string
): void {
  const definition = definitions[name];
  if (definition) {
    definition.title = title;
    definition.description = description;
  }
  const metadata = tools[name];
  if (metadata) metadata.description = title;
}

function normalizeProfileToolMetadata(): void {
  const definitions = getAllToolDefinitions() as Record<
    string,
    MutableToolDefinition
  >;

  updateDefinition(
    definitions,
    "activate_tool_profile",
    "Activate Tool Profile In Current Session",
    "Advanced diagnostic recovery only. Normal stage transitions activate the required profile automatically and continue in the same MCP session."
  );
  updateDefinition(
    definitions,
    "complete_geometry_stage",
    "Approve Geometry And Continue Current Session",
    "Approves current Geometry after fresh gates pass, activates Texture, releases the previous lease, and continues through the same MCP and Codex session."
  );
  updateDefinition(
    definitions,
    "complete_stage",
    "Approve Stage And Continue Current Session",
    "Approves the current reviewed stage, activates the next logical profile, releases the previous lease, and continues through the same MCP and Codex session."
  );
  updateDefinition(
    definitions,
    "reopen_stage_for_revision",
    "Reopen Stage In Current Session",
    "Reopens the earliest affected stage, preserves approved checkpoints, invalidates downstream results, activates the target profile, releases the old lease, and continues in the current MCP and Codex session."
  );
}

export function installStableToolSurface(): void {
  if (installed) return;
  normalizeProfileToolMetadata();
  enforceStableToolSurface();

  if (typeof document !== "undefined") {
    document.addEventListener(TOOL_PROFILE_CHANGED_EVENT, () => {
      // Restore the same production union after logical profile changes. Execute
      // guards continue to enforce the currently active stage allowlist.
      enforceStableToolSurface();
    });
  }

  installed = true;
}
