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

/**
 * Every MCP session receives one stable registered tool surface. The active
 * profile remains the execution authority: disallowed tools still fail inside
 * the profile guard with TOOL_PROFILE_BLOCKED.
 *
 * Keeping registration stable means Geometry → Texture → Animation → Final
 * transitions do not require a client reconnect or a new Codex session.
 */
export function enforceStableToolSurface(): void {
  for (const metadata of Object.values(tools)) {
    metadata.enabled = true;
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
    "Activates the exact stage profile inside the current MCP session. The registered tool surface stays stable; execution remains profile-guarded and the next stage must acquire a fresh write lease."
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
      // activateToolProfile applies its logical allowlist first. Restore the
      // registered surface immediately afterward; execute guards still enforce
      // the logical allowlist for every call.
      enforceStableToolSurface();
    });
  }

  installed = true;
}
