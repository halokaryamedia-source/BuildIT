/// <reference types="blockbench-types" />

import { getAllToolDefinitions, type ToolContext } from "@/lib/factories";
import {
  assertInsideRoot,
  normalizePathForCompare,
  readJsonFile,
  writeJsonFilesAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { resolveMutationExecutionContext } from "@/lib/mutationContext";
import { getProjectWriteLeaseSnapshot } from "@/lib/writeLease";

interface ToolDefinitionLike {
  execute: (args: Record<string, unknown>, context?: ToolContext) => Promise<unknown>;
  annotations?: { readOnlyHint?: boolean };
}

const SKIPPED_TOOLS = new Set([
  "create_project",
  "rebind_active_project_identity",
  "manage_project_write_lease",
  "get_stage_context",
  "get_runtime_status",
  "get_project_info",
  "get_tool_profile",
]);

let installed = false;

function nativeFs(): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", {
    message:
      "Automatic project identity reconciliation needs coordinated workspace metadata access.",
    optional: false,
  });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function currentFormatId(): string | null {
  const projectFormat = Project?.format as { id?: string } | undefined;
  const activeFormat = Format as { id?: string } | undefined;
  return projectFormat?.id ?? activeFormat?.id ?? null;
}

function canonicalPathMatches(runtimePath: string, recordedPath: string): boolean {
  const runtime = normalizePathForCompare(runtimePath);
  const recorded = normalizePathForCompare(recordedPath);
  return Boolean(runtime && recorded && (runtime === recorded || runtime.endsWith(`/${recorded}`)));
}

export function reconcileActiveProjectIdentity(
  sessionRoot: string,
  rawContext?: ToolContext
): { changed: boolean; previous_uuid: string | null; new_uuid: string | null } {
  if (!Project) {
    return { changed: false, previous_uuid: null, new_uuid: null };
  }

  const root = sessionRoot.replace(/[\\/]$/, "");
  const statePath = `${root}/state.json`;
  const projectPath = `${root}/project.json`;
  for (const path of [statePath, projectPath]) assertInsideRoot(path, sessionRoot);

  const fs = nativeFs();
  if (!fs.existsSync(statePath) || !fs.existsSync(projectPath)) {
    return { changed: false, previous_uuid: null, new_uuid: Project.uuid };
  }

  const state = readJsonFile<Record<string, any>>(fs, statePath);
  const metadata = readJsonFile<Record<string, any>>(fs, projectPath);
  const stateUuid = state.project?.uuid ?? null;
  const metadataUuid = metadata.project?.uuid ?? null;
  if (stateUuid === Project.uuid && metadataUuid === Project.uuid) {
    return { changed: false, previous_uuid: stateUuid, new_uuid: Project.uuid };
  }

  if (!state.asset?.id || state.asset.id !== metadata.asset_id) {
    throw new Error("AUTO_IDENTITY_ASSET_MISMATCH");
  }

  const runtimeSavePath = String(
    (Project as unknown as { save_path?: string }).save_path ?? ""
  );
  const canonicalModelPath = String(
    metadata.paths?.model ?? state.project?.save_path ?? ""
  );
  if (!canonicalPathMatches(runtimeSavePath, canonicalModelPath)) {
    throw new Error(
      `AUTO_IDENTITY_SAVE_PATH_MISMATCH: active ${runtimeSavePath || "none"}; expected ${canonicalModelPath || "none"}.`
    );
  }

  const context = resolveMutationExecutionContext(rawContext);
  const lease = getProjectWriteLeaseSnapshot();
  if (
    lease.status === "ACTIVE" &&
    lease.owner_session_id &&
    context.sessionId &&
    lease.owner_session_id !== context.sessionId
  ) {
    throw new Error(
      `AUTO_IDENTITY_CONCURRENT_WRITER: project is owned by ${lease.owner_client ?? lease.owner_session_id}.`
    );
  }

  const revision = Number(state.state_revision ?? 0);
  if (!Number.isInteger(revision) || revision < 0) {
    throw new Error("AUTO_IDENTITY_STATE_REVISION_INVALID");
  }
  const previous = stateUuid ?? metadataUuid;
  const nextRevision = revision + 1;
  const audit = {
    operation: "automatic_project_identity_reconciliation",
    previous_uuid: previous,
    new_uuid: Project.uuid,
    state_revision_before: revision,
    state_revision_after: nextRevision,
    canonical_model_path: canonicalModelPath,
    timestamp: new Date().toISOString(),
  };

  state.project = {
    ...(state.project ?? {}),
    uuid: Project.uuid,
    name: Project.name,
    format: currentFormatId(),
  };
  state.state_revision = nextRevision;
  state.project_identity_audit = [
    ...(state.project_identity_audit ?? []),
    audit,
  ];
  state.updated_at = audit.timestamp;
  state.updated_by = "automatic-project-identity-guard";

  metadata.project = {
    ...(metadata.project ?? {}),
    uuid: Project.uuid,
    name: Project.name,
    format: currentFormatId(),
  };
  metadata.project_identity_audit = [
    ...(metadata.project_identity_audit ?? []),
    audit,
  ];
  metadata.updated_at = audit.timestamp;

  writeJsonFilesAtomically(fs, [
    { path: statePath, value: state },
    { path: projectPath, value: metadata },
  ]);

  return { changed: true, previous_uuid: previous, new_uuid: Project.uuid };
}

export function installAutomaticProjectIdentityGuards(): void {
  if (installed) return;
  const definitions = getAllToolDefinitions() as Record<string, ToolDefinitionLike>;
  for (const [name, definition] of Object.entries(definitions)) {
    if (SKIPPED_TOOLS.has(name) || definition.annotations?.readOnlyHint === true) {
      continue;
    }
    const execute = definition.execute;
    definition.execute = async (args, context) => {
      const sessionRoot =
        typeof args.session_root === "string" && args.session_root.length > 0
          ? args.session_root
          : null;
      if (sessionRoot && Project) {
        reconcileActiveProjectIdentity(sessionRoot, context);
      }
      return execute(args, context);
    };
  }
  installed = true;
}
