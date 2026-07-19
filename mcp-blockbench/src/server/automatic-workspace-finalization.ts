/// <reference types="blockbench-types" />

import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  readJsonFile,
  writeFileAtomically,
  writeJsonAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";

interface FinalizationFs extends NativeFsLike {
  cpSync(source: string, target: string, options: { recursive: true; force?: boolean }): void;
  copyFileSync(source: string, target: string): void;
  rmSync(path: string, options?: { force?: boolean; recursive?: boolean }): void;
}

interface PathModuleLike {
  resolve(...paths: string[]): string;
  join(...paths: string[]): string;
  dirname(path: string): string;
}

interface ToolDefinitionLike {
  execute: (args: Record<string, unknown>, context?: ToolContext) => Promise<unknown>;
}

let installed = false;

function nativeFs(): FinalizationFs {
  // @ts-ignore Blockbench runtime permission API.
  const value = requireNativeModule("fs", {
    message: "Final approval needs access to promote validated files and complete the workspace.",
    optional: false,
  });
  if (!value) throw new Error("Filesystem access was denied.");
  return value as FinalizationFs;
}

function pathModule(): PathModuleLike {
  // @ts-ignore Blockbench runtime permission API.
  const value = requireNativeModule("path", {
    message: "Final approval needs canonical workspace path resolution.",
    optional: false,
  });
  if (!value) throw new Error("Path access was denied.");
  return value as PathModuleLike;
}

function slash(value: string): string {
  return value.replace(/\\/g, "/");
}

function rewriteStrings(value: unknown, from: string, to: string): unknown {
  if (typeof value === "string") return value.replaceAll(from, to);
  if (Array.isArray(value)) return value.map((item) => rewriteStrings(item, from, to));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, rewriteStrings(item, from, to)])
    );
  }
  return value;
}

function sha256(data: string | Buffer): string {
  // @ts-ignore Blockbench runtime permission API.
  const crypto = requireNativeModule("crypto", {
    message: "Final workspace completion needs artifact integrity hashing.",
    optional: false,
  }) as {
    createHash(name: string): {
      update(value: string | Buffer): { digest(encoding: string): string };
    };
  };
  return crypto.createHash("sha256").update(data).digest("hex");
}

function structuredContent(result: unknown): Record<string, any> | null {
  if (!result || typeof result !== "object") return null;
  const structured = (result as Record<string, any>).structuredContent;
  return structured && typeof structured === "object" ? structured : null;
}

export function finalizeApprovedWorkspace(input: {
  sessionRoot: string;
  assetId: string;
  approvalRef: string;
}): Record<string, unknown> {
  const fs = nativeFs();
  const path = pathModule();
  const sessionRoot = path.resolve(input.sessionRoot);
  const activeRoot = path.dirname(sessionRoot);
  const workspaceRoot = path.dirname(path.dirname(activeRoot));
  const completedRoot = path.join(workspaceRoot, "completed", input.assetId);
  const blockbenchRoot = path.join(activeRoot, "blockbench");
  const modelPath = path.join(blockbenchRoot, `${input.assetId}.bbmodel`);
  const texturesPath = path.join(blockbenchRoot, "textures");
  const previewsPath = path.join(blockbenchRoot, "previews");
  const stagedRoot = path.join(sessionRoot, "final");
  const stagedModel = path.join(stagedRoot, `${input.assetId}.bbmodel`);
  const stagedTextures = path.join(stagedRoot, "textures");
  const statePath = path.join(sessionRoot, "state.json");
  const projectPath = path.join(sessionRoot, "project.json");

  for (const required of [stagedModel, stagedTextures, statePath, projectPath]) {
    if (!fs.existsSync(required)) {
      throw new Error(`WORKSPACE_FINALIZATION_REQUIRED_FILE_MISSING: ${required}`);
    }
  }

  const state = readJsonFile<Record<string, any>>(fs, statePath);
  const metadata = readJsonFile<Record<string, any>>(fs, projectPath);
  if (state.workflow?.state !== "DONE") {
    throw new Error(`WORKSPACE_FINALIZATION_STATE_MISMATCH: ${state.workflow?.state ?? "unknown"}`);
  }
  if (state.asset?.id !== input.assetId || metadata.asset_id !== input.assetId) {
    throw new Error("WORKSPACE_FINALIZATION_ASSET_MISMATCH");
  }

  fs.mkdirSync(blockbenchRoot, { recursive: true });
  fs.mkdirSync(previewsPath, { recursive: true });
  writeFileAtomically(fs, modelPath, fs.readFileSync(stagedModel));
  fs.rmSync(texturesPath, { recursive: true, force: true });
  fs.cpSync(stagedTextures, texturesPath, { recursive: true, force: true });

  const finalEvidence = path.join(sessionRoot, "evidence", "final");
  for (const filename of [
    "final_front.png",
    "final_left.png",
    "final_right.png",
    "final_back.png",
    "final_top.png",
    "final_front_left_3_4.png",
    "final_texture_atlas.png",
  ]) {
    const source = path.join(finalEvidence, filename);
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, path.join(previewsPath, filename));
    }
  }

  const activePrefix = slash(activeRoot);
  const completedPrefix = slash(completedRoot);
  const timestamp = new Date().toISOString();
  const completedState = rewriteStrings(state, activePrefix, completedPrefix) as Record<string, any>;
  completedState.lifecycle = {
    ...(completedState.lifecycle ?? {}),
    status: "COMPLETED",
  };
  completedState.updated_at = timestamp;
  completedState.updated_by = "automatic-workspace-finalization";

  const completedMetadata = rewriteStrings(metadata, activePrefix, completedPrefix) as Record<string, any>;
  completedMetadata.lifecycle = {
    ...(completedMetadata.lifecycle ?? {}),
    status: "COMPLETED",
  };
  completedMetadata.artifacts = {
    ...(completedMetadata.artifacts ?? {}),
    model_sha256: sha256(fs.readFileSync(modelPath)),
  };
  completedMetadata.completion = {
    completed_at: timestamp,
    approval_ref: input.approvalRef,
    last_approved_state: "DONE",
  };
  completedMetadata.updated_at = timestamp;

  writeJsonAtomically(fs, statePath, completedState);
  writeJsonAtomically(fs, projectPath, completedMetadata);
  fs.rmSync(stagedRoot, { recursive: true, force: true });

  const backup = `${completedRoot}.previous.tmp`;
  fs.rmSync(backup, { recursive: true, force: true });
  if (fs.existsSync(completedRoot)) fs.renameSync(completedRoot, backup);
  try {
    fs.renameSync(activeRoot, completedRoot);
    fs.rmSync(backup, { recursive: true, force: true });
  } catch (error) {
    if (fs.existsSync(completedRoot)) {
      fs.rmSync(completedRoot, { recursive: true, force: true });
    }
    if (fs.existsSync(backup)) fs.renameSync(backup, completedRoot);
    throw error;
  }

  const indexPath = path.join(workspaceRoot, "workspace.json");
  const index = fs.existsSync(indexPath)
    ? readJsonFile<Record<string, any>>(fs, indexPath)
    : { schema_version: "1.0", selected_asset_id: null, projects: {} };
  if (index.selected_asset_id === input.assetId) index.selected_asset_id = null;
  index.projects = index.projects ?? {};
  index.projects[input.assetId] = {
    lifecycle: "COMPLETED",
    active_path: null,
    completed_path: completedPrefix,
    blockbench_path: slash(path.join(completedRoot, "blockbench")),
    mcp_path: slash(path.join(completedRoot, "mcp")),
    updated_at: timestamp,
  };
  writeJsonAtomically(fs, indexPath, index);

  if (Project) {
    (Project as unknown as { save_path?: string }).save_path = path.join(
      completedRoot,
      "blockbench",
      `${input.assetId}.bbmodel`
    );
  }

  return {
    status: "COMPLETED",
    asset_id: input.assetId,
    completed_root: completedRoot,
    user_output_root: path.join(completedRoot, "blockbench"),
    model_path: path.join(completedRoot, "blockbench", `${input.assetId}.bbmodel`),
    approval_ref: input.approvalRef,
    completed_at: timestamp,
    manual_workspace_completion_required: false,
  };
}

export function installAutomaticWorkspaceFinalization(): void {
  if (installed) return;
  const definition = getAllToolDefinitions()["complete_stage"] as
    | ToolDefinitionLike
    | undefined;
  if (!definition) throw new Error("complete_stage is unavailable.");
  const execute = definition.execute;
  definition.execute = async (args, context) => {
    const result = await execute(args, context);
    if (args.stage !== "FINAL_VALIDATION") return result;
    const structured = structuredContent(result);
    if (structured?.status !== "PASS") return result;
    const completion = finalizeApprovedWorkspace({
      sessionRoot: String(args.session_root),
      assetId: String(args.asset_id),
      approvalRef: String(args.approval_ref),
    });
    structured.workspace_completion = completion;
    structured.next_safe_operation = "WORKSPACE_COMPLETE";
    if (Array.isArray((result as Record<string, any>).content)) {
      (result as Record<string, any>).content.push({
        type: "text",
        text: `Workspace completed automatically. User output: ${completion.user_output_root}.`,
      });
    }
    return result;
  };
  installed = true;
}
