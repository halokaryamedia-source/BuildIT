import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import type { NativeFsLike } from "@/lib/atomicFiles";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

let installed = false;

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Compact stage context needs to resolve the canonical MCP session root.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

export function resolveCanonicalStageSessionRoot(
  fs: Pick<NativeFsLike, "existsSync">,
  requestedRoot: string
): string {
  const directState = joinPath(requestedRoot, "state.json");
  const directProject = joinPath(requestedRoot, "project.json");
  if (fs.existsSync(directState) && fs.existsSync(directProject)) {
    return requestedRoot;
  }

  const nestedRoot = joinPath(requestedRoot, "mcp");
  const nestedState = joinPath(nestedRoot, "state.json");
  const nestedProject = joinPath(nestedRoot, "project.json");
  if (fs.existsSync(nestedState) && fs.existsSync(nestedProject)) {
    return nestedRoot;
  }

  return requestedRoot;
}

/**
 * Accept either workspace/active/<asset> or workspace/active/<asset>/mcp.
 * The same args object is updated so outer context-routing guards also use the
 * canonical root after the wrapped tool returns.
 */
export function installStageContextRootGuards(): void {
  if (installed) return;
  const definition = getAllToolDefinitions().get_stage_context as
    | RegisteredTool
    | undefined;
  if (!definition?.execute) return;

  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const requestedRoot =
      typeof args.session_root === "string" ? args.session_root : null;
    if (!requestedRoot) return execute(args, context);

    const canonicalRoot = resolveCanonicalStageSessionRoot(nativeFs(), requestedRoot);
    args.session_root = canonicalRoot;
    const result = await execute(args, context);

    const structured = result?.structuredContent;
    if (structured && typeof structured === "object") {
      structured.requested_session_root = requestedRoot;
      structured.canonical_session_root = canonicalRoot;
      structured.session_root_normalized = canonicalRoot !== requestedRoot;
      if (structured.context && typeof structured.context === "object") {
        structured.context.session = {
          requested_root: requestedRoot,
          canonical_root: canonicalRoot,
          normalized: canonicalRoot !== requestedRoot,
        };
      }
    }
    return result;
  };

  installed = true;
}
