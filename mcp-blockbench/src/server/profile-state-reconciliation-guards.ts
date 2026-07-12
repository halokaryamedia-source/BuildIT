import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { getToolProfileSnapshot } from "@/lib/toolProfiles";
import { clearProjectWriteLease } from "@/lib/writeLease";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const transitionTools = new Set([
  "complete_geometry_stage",
  "complete_stage",
  "reopen_stage_for_revision",
]);

let installed = false;

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Failed transition reconciliation needs current state access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function reconcileIfNeeded(root: string, toolName: string): boolean {
  const fs = nativeFs();
  const statePath = joinPath(root, "state.json");
  assertInsideRoot(statePath, root);
  if (!fs.existsSync(statePath)) return false;

  const state = readJsonFile<Record<string, any>>(fs, statePath);
  const profile = getToolProfileSnapshot(false);
  const metadata = state.mcp ?? {};
  const mismatch =
    metadata.active_tool_profile !== profile.profile_id ||
    metadata.tool_profile_revision !== profile.profile_revision ||
    metadata.tool_profile_hash !== profile.tool_profile_hash ||
    metadata.exposed_tool_count !== profile.exposed_tool_count ||
    metadata.total_library_tool_count !== profile.total_library_tool_count ||
    metadata.profile_reconnect_required !== false ||
    metadata.stable_tool_surface !== true;

  if (!mismatch) return false;

  state.mcp = metadata;
  state.mcp.active_tool_profile = profile.profile_id;
  state.mcp.tool_profile_revision = profile.profile_revision;
  state.mcp.tool_profile_hash = profile.tool_profile_hash;
  state.mcp.exposed_tool_count = profile.exposed_tool_count;
  state.mcp.total_library_tool_count = profile.total_library_tool_count;
  state.mcp.profile_reconnect_required = false;
  state.mcp.stable_tool_surface = true;
  state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
  state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";
  state.updated_at = new Date().toISOString();
  state.updated_by = `${toolName}_profile_reconciliation`;
  writeJsonAtomically(fs, statePath, state);
  clearProjectWriteLease();
  return true;
}

export function installProfileStateReconciliationGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  for (const name of transitionTools) {
    const definition = definitions[name];
    if (!definition?.execute) continue;
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      try {
        return await execute(args, context);
      } catch (error) {
        const root =
          typeof args.session_root === "string" ? args.session_root : null;
        if (root) {
          try {
            reconcileIfNeeded(root, name);
          } catch (reconcileError) {
            console.error(
              `[MCP] ${name} profile/state reconciliation failed:`,
              reconcileError
            );
          }
        }
        throw error;
      }
    };
  }

  installed = true;
}
