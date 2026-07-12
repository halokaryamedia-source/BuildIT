import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { enforceStableToolSurface } from "./stable-tool-surface";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const normalizedTools = new Set([
  "get_runtime_status",
  "get_tool_profile",
  "get_stage_context",
  "activate_tool_profile",
  "complete_geometry_stage",
  "complete_stage",
  "reopen_stage_for_revision",
]);

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
    message: "Stage continuity needs current workflow metadata access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function normalizeProfileSnapshot(value: unknown): void {
  if (!value || typeof value !== "object") return;
  const snapshot = value as Record<string, any>;
  snapshot.reconnect_required_after_change = false;
  snapshot.registered_tool_surface = "STABLE_FULL_LIBRARY";
  snapshot.execution_surface = "ACTIVE_PROFILE_GUARDED";
}

function normalizeText(result: any, replacement: string): void {
  const content = result?.content;
  if (!Array.isArray(content)) return;
  const first = content.find((item) => item?.type === "text");
  if (first && typeof first.text === "string" && /reconnect/i.test(first.text)) {
    first.text = replacement;
  }
}

function reconcileStateContinuity(root: string): Record<string, any> | null {
  const fs = nativeFs();
  const statePath = joinPath(root, "state.json");
  assertInsideRoot(statePath, root);
  if (!fs.existsSync(statePath)) return null;

  const state = readJsonFile<Record<string, any>>(fs, statePath);
  state.mcp = state.mcp ?? {};
  state.mcp.profile_reconnect_required = false;
  state.mcp.stable_tool_surface = true;
  state.mcp.registered_tool_surface = "STABLE_FULL_LIBRARY";
  state.mcp.execution_surface = "ACTIVE_PROFILE_GUARDED";
  writeJsonAtomically(fs, statePath, state);
  return state;
}

function normalizeResult(
  name: string,
  args: Record<string, unknown>,
  result: any
): void {
  enforceStableToolSurface();

  const structured = result?.structuredContent;
  if (!structured || typeof structured !== "object") return;

  if (name === "get_runtime_status") {
    normalizeProfileSnapshot(structured.tool_profile);
    structured.contract = structured.contract ?? {};
    structured.contract.stable_tool_surface = true;
    structured.contract.profile_changes_require_reconnect = false;
  } else if (name === "get_tool_profile") {
    normalizeProfileSnapshot(structured);
  }

  if (name === "get_stage_context") {
    structured.reconnect_required = false;
    structured.current_session_continues = true;
    if (structured.context && typeof structured.context === "object") {
      structured.context.automation = structured.context.automation ?? {};
      structured.context.automation.reconnect_required = false;
      structured.context.automation.user_restart_required = false;
      structured.context.automation.current_session_continues = true;
    }
  }

  if (name === "activate_tool_profile") {
    normalizeProfileSnapshot(structured.snapshot);
    structured.reconnect_required = false;
    structured.current_session_continues = true;
    structured.stable_tool_surface = true;
    structured.write_lease_reacquire_required = structured.changed === true;
    structured.next_action = structured.changed
      ? "Call get_stage_context in the current MCP session, then acquire the fresh current-stage write lease."
      : "Continue with the active stage in the current MCP session.";
    normalizeText(
      result,
      structured.changed
        ? `Tool profile changed to ${structured.active_profile}. Continue in the current MCP session and acquire a fresh current-stage write lease.`
        : `Tool profile ${structured.active_profile} is already active; continue in the current MCP session.`
    );
  }

  if (!transitionTools.has(name)) return;

  const root = typeof args.session_root === "string" ? args.session_root : null;
  const state = root ? reconcileStateContinuity(root) : null;
  const stateNextAction = state?.workflow?.next_action;

  structured.reconnect_required = false;
  structured.current_session_continues = true;
  structured.stable_tool_surface = true;
  structured.next_action =
    typeof stateNextAction === "string"
      ? stateNextAction
      : structured.next_action ?? "CALL_GET_STAGE_CONTEXT";
  normalizeText(
    result,
    `${structured.completed_stage ?? structured.reopened_stage ?? "Stage"} transition completed. Continue in the current MCP session.`
  );
}

export function installSessionContinuityGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  for (const name of normalizedTools) {
    const definition = definitions[name];
    if (!definition?.execute) continue;
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      const result = await execute(args, context);
      normalizeResult(name, args, result);
      return result;
    };
  }

  installed = true;
}
