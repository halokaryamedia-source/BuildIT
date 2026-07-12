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

function normalizeProfileToolMetadata(): void {
  const definitions = getAllToolDefinitions() as Record<
    string,
    MutableToolDefinition
  >;
  const activation = definitions.activate_tool_profile;
  if (activation) {
    activation.description =
      "Activates the exact stage profile inside the current MCP session. The registered tool surface stays stable; execution remains profile-guarded and the next stage must acquire a fresh write lease.";
    activation.title = "Activate Tool Profile In Current Session";
  }

  const metadata = tools.activate_tool_profile;
  if (metadata) {
    metadata.description = "Activate Tool Profile In Current Session";
  }
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
