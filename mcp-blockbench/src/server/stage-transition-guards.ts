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

interface ApprovedCheckpointPolicy {
  canonicalName: string;
  stem: string;
  historyBase: number;
}

interface ApprovedCheckpointSnapshot {
  canonicalModelPath: string;
  canonicalMetadataPath: string;
  modelData: string | Buffer | null;
  metadataData: string | Buffer | null;
  historyModelPath: string | null;
  historyMetadataPath: string | null;
}

const completionTools = new Set([
  "complete_geometry_stage",
  "complete_stage",
]);

const approvedCheckpointPolicies: Record<string, ApprovedCheckpointPolicy> = {
  TEXTURE: {
    canonicalName: "40_texture_approved",
    stem: "texture_approved",
    historyBase: 41,
  },
  ANIMATION: {
    canonicalName: "60_animation_approved",
    stem: "animation_approved",
    historyBase: 61,
  },
  FINAL_VALIDATION: {
    canonicalName: "80_validation_pass",
    stem: "validation_pass",
    historyBase: 81,
  },
};

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

function sha256(value: string): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Checkpoint history metadata needs SHA-256 integrity.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: string): { digest(encoding: string): string };
    };
  };
  if (!crypto) throw new Error("Crypto access was denied.");
  return crypto.createHash("sha256").update(value).digest("hex");
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

function text(value: string | Buffer): string {
  return Buffer.isBuffer(value) ? value.toString("utf8") : value;
}

function nextHistoryName(
  fs: NativeFsLike,
  directory: string,
  policy: ApprovedCheckpointPolicy
): string {
  const escaped = policy.stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^(\\d+)_${escaped}`, "i");
  let number = policy.historyBase;
  for (const entry of fs.readdirSync?.(directory) ?? []) {
    const match = entry.match(pattern);
    if (match) number = Math.max(number, Number(match[1]) + 1);
  }
  return `${String(number).padStart(2, "0")}_${policy.stem}_history`;
}

function snapshotAndArchiveApprovedCheckpoint(
  fs: NativeFsLike,
  root: string,
  checkpointDirectory: string,
  toolName: string,
  args: Record<string, unknown>
): ApprovedCheckpointSnapshot | null {
  if (toolName !== "complete_stage") return null;
  const stage = String(args.stage ?? "");
  const policy = approvedCheckpointPolicies[stage];
  if (!policy) return null;

  const canonicalModelPath = joinPath(
    checkpointDirectory,
    `${policy.canonicalName}.bbmodel`
  );
  const canonicalMetadataPath = joinPath(
    checkpointDirectory,
    `${policy.canonicalName}.json`
  );
  assertInsideRoot(canonicalModelPath, root);
  assertInsideRoot(canonicalMetadataPath, root);

  const modelData = fs.existsSync(canonicalModelPath)
    ? fs.readFileSync(canonicalModelPath)
    : null;
  const metadataData = fs.existsSync(canonicalMetadataPath)
    ? fs.readFileSync(canonicalMetadataPath)
    : null;

  if (modelData === null && metadataData === null) {
    return {
      canonicalModelPath,
      canonicalMetadataPath,
      modelData,
      metadataData,
      historyModelPath: null,
      historyMetadataPath: null,
    };
  }

  fs.mkdirSync(checkpointDirectory, { recursive: true });
  const historyName = nextHistoryName(fs, checkpointDirectory, policy);
  const historyModelPath = joinPath(
    checkpointDirectory,
    `${historyName}.bbmodel`
  );
  const historyMetadataPath = joinPath(
    checkpointDirectory,
    `${historyName}.json`
  );
  assertInsideRoot(historyModelPath, root);
  assertInsideRoot(historyMetadataPath, root);

  if (modelData !== null) {
    fs.writeFileSync(historyModelPath, modelData);
  }
  if (metadataData !== null) {
    try {
      const metadata = JSON.parse(text(metadataData)) as Record<string, any>;
      delete metadata.metadata_payload_sha256;
      metadata.checkpoint_name = historyName;
      metadata.bbmodel_path = historyModelPath;
      metadata.metadata_path = historyMetadataPath;
      metadata.archived_from = policy.canonicalName;
      metadata.archived_at = new Date().toISOString();
      const base = JSON.stringify(metadata, null, 2);
      metadata.metadata_payload_sha256 = sha256(base);
      fs.writeFileSync(historyMetadataPath, JSON.stringify(metadata, null, 2));
    } catch {
      fs.writeFileSync(historyMetadataPath, metadataData);
    }
  }

  return {
    canonicalModelPath,
    canonicalMetadataPath,
    modelData,
    metadataData,
    historyModelPath,
    historyMetadataPath,
  };
}

function restoreCanonicalCheckpoint(
  fs: NativeFsLike,
  snapshot: ApprovedCheckpointSnapshot | null
): void {
  if (!snapshot) return;

  if (snapshot.modelData !== null) {
    fs.writeFileSync(snapshot.canonicalModelPath, snapshot.modelData);
  } else if (fs.existsSync(snapshot.canonicalModelPath)) {
    fs.rmSync(snapshot.canonicalModelPath, { force: true });
  }

  if (snapshot.metadataData !== null) {
    fs.writeFileSync(snapshot.canonicalMetadataPath, snapshot.metadataData);
  } else if (fs.existsSync(snapshot.canonicalMetadataPath)) {
    fs.rmSync(snapshot.canonicalMetadataPath, { force: true });
  }
}

function annotateArchive(
  result: any,
  snapshot: ApprovedCheckpointSnapshot | null
): void {
  if (!snapshot?.historyModelPath) return;
  if (!result?.structuredContent || typeof result.structuredContent !== "object") {
    return;
  }
  result.structuredContent.archived_previous_checkpoint = {
    model: snapshot.historyModelPath,
    metadata: snapshot.historyMetadataPath,
  };
}

/**
 * Completion tools write checkpoints before activating the next profile and
 * committing state. This guard provides coordinated rollback and preserves a
 * prior canonical approved checkpoint before generic stage approval replaces it.
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
      const approvedSnapshot = snapshotAndArchiveApprovedCheckpoint(
        fs,
        root,
        checkpointDirectory,
        name,
        args
      );

      try {
        const result = await execute(args, context);
        annotateArchive(result, approvedSnapshot);
        return result;
      } catch (error) {
        const currentProfile = getToolProfileSnapshot(false);
        const profileChanged =
          currentProfile.profile_id !== previousProfile.profile_id ||
          currentProfile.profile_revision !== previousProfile.profile_revision;

        if (currentProfile.profile_id !== previousProfile.profile_id) {
          activateToolProfile(previousProfile.profile_id);
        }

        removeNewCheckpointEntries(fs, checkpointDirectory, previousEntries);
        restoreCanonicalCheckpoint(fs, approvedSnapshot);

        if (profileChanged) {
          // Reverting a profile creates a new revision, so a previous lease can
          // no longer be trusted even when the profile ID is restored.
          clearProjectWriteLease();
        }

        try {
          writeJsonAtomically(fs, statePath, previousState);
        } catch (rollbackError) {
          console.error(
            `[MCP] ${name} state rollback failed after completion error:`,
            rollbackError
          );
        }

        throw error;
      }
    };
  }

  installed = true;
}
