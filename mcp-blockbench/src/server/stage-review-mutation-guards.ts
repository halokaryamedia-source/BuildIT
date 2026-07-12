import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { getProjectWriteLeaseSnapshot } from "@/lib/writeLease";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const activeModelMutationTools = new Set([
  "add_group",
  "place_cubes_safe",
  "modify_cubes",
  "rotate_cube_about_attachment",
  "duplicate_element",
  "rename_element",
  "remove_element",
  "create_texture",
  "apply_texture",
  "activate_texture",
  "set_cube_face_uv",
  "paint_fill_tool",
  "draw_shape_tool",
  "paint_with_brush",
  "eraser_tool",
  "bone_rigging",
  "create_animation",
  "manage_keyframes",
  "animation_timeline",
  "undo",
  "redo",
]);

const reviewStates = new Set([
  "GEOMETRY_REVIEW",
  "TEXTURE_REVIEW",
  "ANIMATION_REVIEW",
  "FINAL_REVIEW",
]);

let installed = false;

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Review-state mutation protection needs current workflow state.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function currentSessionRoot(args: Record<string, unknown>): string | null {
  if (typeof args.session_root === "string" && args.session_root.length > 0) {
    return args.session_root;
  }
  const lease = getProjectWriteLeaseSnapshot();
  return lease.status === "ACTIVE" ? lease.session_root : null;
}

function assertWorkingState(
  toolName: string,
  args: Record<string, unknown>
): void {
  if (!activeModelMutationTools.has(toolName)) return;
  const root = currentSessionRoot(args);
  if (!root) return;
  const statePath = joinPath(root, "state.json");
  assertInsideRoot(statePath, root);
  const fs = nativeFs();
  if (!fs.existsSync(statePath)) return;
  const state = readJsonFile<Record<string, any>>(fs, statePath);
  const workflowState = String(state.workflow?.state ?? "");
  if (!reviewStates.has(workflowState)) return;

  const prepareTool =
    workflowState === "GEOMETRY_REVIEW"
      ? "prepare_geometry_visual_rebuild"
      : "prepare_stage_revision";
  throw new Error(
    `STAGE_REVIEW_MUTATION_BLOCKED: ${toolName} cannot mutate the active model while workflow state is ${workflowState}. Record/confirm the requested revision and call ${prepareTool} first.`
  );
}

export function installStageReviewMutationGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  for (const [name, definition] of Object.entries(definitions)) {
    if (!definition.execute || !activeModelMutationTools.has(name)) continue;
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      assertWorkingState(name, args);
      return execute(args, context);
    };
  }

  installed = true;
}
