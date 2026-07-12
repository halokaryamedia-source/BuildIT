import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  readJsonFile,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import {
  activateToolProfile,
  getToolProfileSnapshot,
} from "@/lib/toolProfiles";
import { clearProjectWriteLease } from "@/lib/writeLease";

interface RegisteredTool {
  execute?: (
    args: Record<string, unknown>,
    context?: ToolContext
  ) => Promise<any>;
}

const completionTools = new Set([
  "complete_geometry_stage",
  "complete_stage",
]);

let installed = false;

function joinPath(root: string, relative: string): string {
  const separator = root.includes("\\") && !root.includes("/") ? "\\" : "/";
  return `${root.replace(/[\\/]$/, "")}${separator}${relative.replace(/^[\\/]/, "")}`;
}

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message: "Stage completion rollback needs state and checkpoint access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function entries(fs: NativeFsLike, directory: string): Set<string> {
  if (!fs.existsSync(directory)) return new Set();
  return new Set(fs.readdirSync?.(directory) ?? []);
}

function removeNewCheckpointEntries(
  fs: NativeFsLike,
  directory: string,
  before: Set<string>
): string[] {
  if (!fs.existsSync(directory)) return [];
  const removed: string[] = [];
  for (const entry of fs.readdirSync?.(directory) ?? []) {
    if (before.has(entry)) continue;
    if (!/\.(?:bbmodel|json)$/i.test(entry)) continue;
    const path = joinPath(directory, entry);
    fs.rmSync(path, { force: true });
    removed.push(path);
  }
  return removed;
}

/**
 * Completion tools write a checkpoint before activating the next profile and
 * committing state. This guard makes the whole sequence recoverable without
 * requiring every stage implementation to duplicate rollback bookkeeping.
 */
export function installStageTransitionGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, RegisteredTool>;

  for (const name of completionTools) {
    const definition = definitions[name];
    if (!definition?.execute) continue;
    const execute = definition.execute;

    definition.execute = async (args, context) => {
      const root =
        typeof args.session_root === "string" ? args.session_root : null;
      if (!root) return execute(args, context);

      const fs = nativeFs();
      const statePath = joinPath(root, "state.json");
      const checkpointDirectory = joinPath(root, "checkpoints");
      assertInsideRoot(statePath, root);
      assertInsideRoot(checkpointDirectory, root);

      const previousState = readJsonFile<Record<string, any>>(fs, statePath);
      const previousEntries = entries(fs, checkpointDirectory);
      const previousProfile = getToolProfileSnapshot(false);

      try {
        return await execute(args, context);
      } catch (error) {
        const currentProfile = getToolProfileSnapshot(false);
        const profileChanged =
          currentProfile.profile_id !== previousProfile.profile_id ||
          currentProfile.profile_revision !== previousProfile.profile_revision;

        if (currentProfile.profile_id !== previousProfile.profile_id) {
          activateToolProfile(previousProfile.profile_id);
        }

        const removed = removeNewCheckpointEntries(
          fs,
          checkpointDirectory,
          previousEntries
        );

        if (profileChanged || removed.length > 0) {
          clearProjectWriteLease();
          try {
            writeJsonAtomically(fs, statePath, previousState);
          } catch (rollbackError) {
            console.error(
              `[MCP] ${name} state rollback failed after completion error:`,
              rollbackError
            );
          }
        }

        throw error;
      }
    };
  }

  installed = true;
}
