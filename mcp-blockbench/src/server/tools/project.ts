/// <reference types="three" />
/// <reference types="blockbench-types" />
import { z } from "zod";
import { createTool, type ToolContext, type ToolSpec } from "@/lib/factories";
import { STATUS_STABLE } from "@/lib/constants";
import {
  assertInsideRoot,
  parentDirectory,
  readJsonFile,
  writeFileAtomically,
  writeJsonFilesAtomically,
  type NativeFsLike,
} from "@/lib/atomicFiles";
import { resolveMutationExecutionContext } from "@/lib/mutationContext";
import {
  ensureProjectWriteLease,
  type EnsureProjectWriteLeaseResult,
} from "@/lib/writeLease";
import {
  activateToolProfile,
  getToolProfileSnapshot,
} from "@/lib/toolProfiles";
import {
  prepareWorkspaceFromReferencePackage,
  type WorkspaceBootstrapResult,
} from "@/lib/workspaceBootstrap";

export const createProjectParameters = z.object({
  name: z
    .string()
    .min(1)
    .optional()
    .describe("Optional Blockbench project name. Defaults to asset_id for canonical workspace projects."),
  format: z
    .string()
    .default("bedrock_block")
    .describe("Project format ID from Blockbench's Formats registry."),
  box_uv: z
    .boolean()
    .optional()
    .describe(
      "Default UV mode. false = per-face UV (recommended for custom texture atlases). When omitted, uses the format default."
    ),
  texture_width: z.number().int().min(1).max(4096).optional(),
  texture_height: z.number().int().min(1).max(4096).optional(),
  save_path: z
    .string()
    .min(1)
    .optional()
    .describe("Optional explicit path. When session_root and asset_id are provided, the canonical path is derived automatically."),
  session_root: z.string().min(1).optional(),
  asset_id: z.string().regex(/^[a-z0-9_]+$/).optional(),
  reference_package_root: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional extracted ChatGPT Reference Studio package directory. When provided, MCP creates the canonical workspace, state, metadata, reference copies, and project automatically."
    ),
  workspace_root: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Optional production workspace directory. Defaults to <process cwd>/workspace when bootstrapping from a ChatGPT package."
    ),
  persist_immediately: z.boolean().optional().default(true),
});

export const configureProjectParameters = z.object({
  name: z.string().optional().describe("Rename the project."),
  box_uv: z
    .boolean()
    .optional()
    .describe("Switch UV mode. false = per-face UV, true = box UV. Requires format support."),
  texture_width: z.number().int().min(1).max(4096).optional(),
  texture_height: z.number().int().min(1).max(4096).optional(),
});

export const getProjectInfoParameters = z.object({});

function nativeFs(message: string): NativeFsLike {
  // @ts-ignore Blockbench runtime permission API.
  const fs = requireNativeModule("fs", { message, optional: false });
  if (!fs) throw new Error("Filesystem access was denied.");
  return fs as NativeFsLike;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
}

function canonicalProjectPath(sessionRoot: string, assetId: string): string {
  const activeRoot = parentDirectory(sessionRoot);
  if (!activeRoot) {
    throw new Error(`CANONICAL_SESSION_ROOT_INVALID: ${sessionRoot}`);
  }
  const separator = sessionRoot.includes("\\") && !sessionRoot.includes("/") ? "\\" : "/";
  return `${activeRoot}${separator}blockbench${separator}${assetId}.bbmodel`;
}

function projectCodecOutput(): string | Buffer {
  // @ts-ignore Blockbench runtime codec registry.
  const codec = Codecs.project as { compile?: (options?: unknown) => unknown; getExportOptions?: () => unknown };
  if (!codec || typeof codec.compile !== "function") {
    throw new Error('Blockbench project codec "project" is unavailable.');
  }
  const value = codec.compile(
    typeof codec.getExportOptions === "function" ? codec.getExportOptions() : undefined
  );
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

interface CanonicalProjectSave {
  path: string;
  byte_length: number;
  state_revision: number;
  stage: string | null;
  profile_id: string | null;
  identity_synced: true;
}

function currentFormatId(): string | null {
  const projectFormat = Project?.format as { id?: string } | undefined;
  const activeFormat = Format as { id?: string } | undefined;
  return projectFormat?.id ?? activeFormat?.id ?? null;
}

function persistCanonicalProject(input: {
  savePath: string;
  sessionRoot: string;
  assetId: string;
}): CanonicalProjectSave {
  const fs = nativeFs(
    `MCP create_project needs canonical model write access to ${input.savePath}`
  );
  const root = input.sessionRoot.replace(/[\\/]$/, "");
  const statePath = `${root}/state.json`;
  const projectPath = `${root}/project.json`;
  for (const path of [statePath, projectPath]) assertInsideRoot(path, input.sessionRoot);

  const state = readJsonFile<Record<string, any>>(fs, statePath);
  if (state.asset?.id !== input.assetId) {
    throw new Error(
      `ASSET_ID_MISMATCH: state has ${state.asset?.id ?? "unknown"}, expected ${input.assetId}.`
    );
  }
  if (!fs.existsSync(projectPath)) {
    throw new Error(`PROJECT_METADATA_MISSING: ${projectPath}`);
  }
  const metadata = readJsonFile<Record<string, any>>(fs, projectPath);
  if (metadata.asset_id !== input.assetId) {
    throw new Error(
      `PROJECT_METADATA_ASSET_MISMATCH: project has ${metadata.asset_id ?? "unknown"}, expected ${input.assetId}.`
    );
  }

  const expected = canonicalProjectPath(input.sessionRoot, input.assetId);
  if (normalizePath(input.savePath) !== normalizePath(expected)) {
    throw new Error(
      `CANONICAL_MODEL_PATH_MISMATCH: requested ${input.savePath}; expected ${expected}.`
    );
  }
  const recorded = String(state.project?.save_path ?? "");
  if (recorded && normalizePath(expected) !== normalizePath(recorded) && !normalizePath(expected).endsWith(normalizePath(recorded))) {
    throw new Error(
      `CANONICAL_MODEL_STATE_PATH_MISMATCH: state has ${recorded}; expected ${expected}.`
    );
  }

  const output = projectCodecOutput();
  writeFileAtomically(fs, expected, output);

  const previousRevision = Number(state.state_revision ?? 0);
  if (!Number.isInteger(previousRevision) || previousRevision < 0) {
    throw new Error("PROJECT_STATE_REVISION_INVALID");
  }
  const nextRevision = previousRevision + 1;
  const format = currentFormatId();
  const audit = {
    operation: "create_project_auto_sync",
    previous_uuid: state.project?.uuid ?? null,
    new_uuid: Project!.uuid,
    state_revision_before: previousRevision,
    state_revision_after: nextRevision,
    canonical_model_path: expected,
    timestamp: new Date().toISOString(),
  };

  state.project = {
    ...(state.project ?? {}),
    uuid: Project!.uuid,
    name: Project!.name,
    format,
  };
  state.state_revision = nextRevision;
  state.project_identity_audit = [
    ...(state.project_identity_audit ?? []),
    audit,
  ];
  state.workflow.state = "GEOMETRY_IN_PROGRESS";
  state.workflow.status = "IN_PROGRESS";
  state.workflow.next_action = "INSPECT_REFERENCE_THEN_BUILD_GEOMETRY";
  if (state.workflow?.stage_records?.GEOMETRY) {
    state.workflow.stage_records.GEOMETRY.status = "IN_PROGRESS";
  }
  state.updated_at = audit.timestamp;
  state.updated_by = "create_project";

  metadata.project = {
    ...(metadata.project ?? {}),
    uuid: Project!.uuid,
    name: Project!.name,
    format,
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

  return {
    path: expected,
    byte_length: Buffer.isBuffer(output)
      ? output.byteLength
      : Buffer.byteLength(output, "utf8"),
    state_revision: nextRevision,
    stage:
      typeof state.workflow?.active_stage === "string"
        ? state.workflow.active_stage
        : null,
    profile_id:
      typeof state.mcp?.active_tool_profile === "string"
        ? state.mcp.active_tool_profile
        : null,
    identity_synced: true,
  };
}

function getUvInfo() {
  const format = Format as { box_uv?: boolean } | undefined;
  return {
    mode: Project!.box_uv ? ("box" as const) : ("per_face" as const),
    box_uv: Project!.box_uv,
    texture_width: Project!.texture_width ?? null,
    texture_height: Project!.texture_height ?? null,
    format_supports_box_uv: format?.box_uv ?? false,
  };
}

function projectSnapshot() {
  if (!Project) {
    throw new Error("No project is open. Use create_project or open an existing file in Blockbench.");
  }

  const format = Format as {
    id?: string;
    name?: string;
    display_name?: string;
    box_uv?: boolean;
  } | undefined;
  const rootGroups = Outliner.root
    .filter((node): node is Group => node instanceof Group)
    .map((group) => ({
      name: group.name,
      uuid: group.uuid,
      children: group.children?.length ?? 0,
    }));

  return {
    project: {
      name: Project.name,
      uuid: Project.uuid,
      save_path: (Project as { save_path?: string }).save_path ?? null,
    },
    format: {
      id: format?.id ?? null,
      name: format?.display_name ?? format?.name ?? null,
    },
    uv: getUvInfo(),
    resolution: {
      texture_width: Project.texture_width ?? null,
      texture_height: Project.texture_height ?? null,
    },
    counts: {
      cubes: Cube.all.length,
      meshes: Mesh.all.length,
      groups: Group.all.length,
      textures: Texture.all.length,
      outliner_elements: Outliner.elements.length,
    },
    root_groups: rootGroups,
  };
}

function cancelUndoEdit(): void {
  (Undo as unknown as { cancelEdit?: (amend?: boolean) => void })
    .cancelEdit?.(false);
}

export const projectToolDocs: ToolSpec[] = [
  {
    name: "create_project",
    description:
      "Creates a fresh Blockbench project. It can consume an extracted ChatGPT Reference Studio package, create the canonical workspace/state/reference layout, derive the model path, persist the project, synchronize identity/profile, and prepare current-session write ownership in one call.",
    annotations: { title: "Create Asset Workspace And Project", destructiveHint: true, openWorldHint: true },
    parameters: createProjectParameters,
    status: STATUS_STABLE,
  },
  {
    name: "configure_project",
    description: "Updates project name, UV mode, and texture resolution.",
    annotations: { title: "Configure Project", destructiveHint: true },
    parameters: configureProjectParameters,
    status: STATUS_STABLE,
  },
  {
    name: "get_project_info",
    description:
      "Returns one compact structured project snapshot: identity, format, UV mode, texture size, counts, and top-level groups.",
    annotations: { title: "Get Project Info", readOnlyHint: true },
    parameters: getProjectInfoParameters,
    status: STATUS_STABLE,
  },
];

export function registerProjectTools() {
  createTool(
    projectToolDocs[0].name,
    {
      ...projectToolDocs[0],
      async execute(
        {
          name,
          format,
          box_uv,
          texture_width,
          texture_height,
          save_path,
          session_root,
          asset_id,
          reference_package_root,
          workspace_root,
          persist_immediately,
        },
        rawContext?: ToolContext
      ) {
        let workspaceBootstrap: WorkspaceBootstrapResult | null = null;
        let resolvedSessionRoot = session_root;
        let resolvedAssetId = asset_id;
        let resolvedName = name;

        if (reference_package_root) {
          workspaceBootstrap = prepareWorkspaceFromReferencePackage({
            referencePackageRoot: reference_package_root,
            workspaceRoot: workspace_root,
            assetId: asset_id,
            displayName: name,
          });
          resolvedSessionRoot = workspaceBootstrap.session_root;
          resolvedAssetId = workspaceBootstrap.asset_id;
          resolvedName = workspaceBootstrap.display_name;
        }

        const formatDef = Formats[format];
        if (!formatDef) {
          throw new Error(`Unknown format "${format}". Use a valid Blockbench format ID.`);
        }
        const created = newProject(formatDef);
        if (!created) throw new Error("Failed to create project.");

        Project!.name = resolvedAssetId ?? resolvedName ?? "untitled_model";
        if (box_uv !== undefined) {
          if (box_uv && !formatDef.box_uv) {
            throw new Error(`Format "${format}" does not support box UV mode.`);
          }
          Project!.box_uv = box_uv;
        }
        if (texture_width !== undefined) Project!.texture_width = texture_width;
        if (texture_height !== undefined) Project!.texture_height = texture_height;

        const resolvedSavePath =
          save_path ??
          (resolvedSessionRoot && resolvedAssetId
            ? canonicalProjectPath(resolvedSessionRoot, resolvedAssetId)
            : undefined);
        if (resolvedSavePath !== undefined) {
          (Project as { save_path?: string }).save_path = resolvedSavePath;
        }

        let canonicalSave: CanonicalProjectSave | null = null;
        let sessionPreparation: EnsureProjectWriteLeaseResult | null = null;
        if (resolvedSavePath && persist_immediately) {
          if (!resolvedSessionRoot || !resolvedAssetId) {
            throw new Error(
              "CANONICAL_PROJECT_PERSISTENCE_ARGUMENTS_REQUIRED: canonical persistence needs session_root and asset_id, or reference_package_root for automatic workspace bootstrap."
            );
          }
          canonicalSave = persistCanonicalProject({
            savePath: resolvedSavePath,
            sessionRoot: resolvedSessionRoot,
            assetId: resolvedAssetId,
          });

          if (
            canonicalSave.profile_id &&
            getToolProfileSnapshot(false).profile_id !== canonicalSave.profile_id
          ) {
            activateToolProfile(canonicalSave.profile_id);
          }
          if (canonicalSave.stage) {
            sessionPreparation = ensureProjectWriteLease(
              {
                sessionRoot: resolvedSessionRoot,
                assetId: resolvedAssetId,
                expectedProjectUuid: Project!.uuid,
                expectedStage: canonicalSave.stage,
              },
              resolveMutationExecutionContext(rawContext)
            );
          }
        }

        const snapshot = projectSnapshot();
        return {
          content: [{
            type: "text" as const,
            text: canonicalSave
              ? `Created and prepared project ${snapshot.project.name} (${snapshot.project.uuid}) at ${canonicalSave.path}; workspace, references, identity, profile, and write access are ready.`
              : `Created project ${snapshot.project.name} (${snapshot.project.uuid}) using ${snapshot.format.id} and ${snapshot.uv.mode} UV.`,
          }],
          structuredContent: {
            status: "PASS",
            ...snapshot,
            asset_id: resolvedAssetId ?? null,
            session_root: resolvedSessionRoot ?? null,
            workspace_bootstrap: workspaceBootstrap,
            canonical_save: canonicalSave,
            session_preparation: sessionPreparation,
            next_safe_operation: canonicalSave
              ? "inspect_reference_visual_preview"
              : "configure_project",
            manual_workspace_setup_required: false,
            manual_identity_sync_required: false,
            manual_profile_selection_required: false,
            manual_write_lease_required: false,
          },
        };
      },
    },
    projectToolDocs[0].status
  );

  createTool(
    projectToolDocs[1].name,
    {
      ...projectToolDocs[1],
      async execute({ name, box_uv, texture_width, texture_height }) {
        if (!Project) throw new Error("No project is open. Use create_project first.");
        const format = Format as { box_uv?: boolean } | undefined;
        if (box_uv && !format?.box_uv) {
          throw new Error("Current format does not support box UV mode.");
        }

        Undo.initEdit({});
        try {
          if (name !== undefined) Project.name = name;
          if (box_uv !== undefined) Project.box_uv = box_uv;
          if (texture_width !== undefined) Project.texture_width = texture_width;
          if (texture_height !== undefined) Project.texture_height = texture_height;
          Undo.finishEdit("Configure project");
        } catch (error) {
          cancelUndoEdit();
          throw error;
        }

        Canvas.updateAll();
        if (typeof UVEditor !== "undefined") UVEditor.loadData();
        const snapshot = projectSnapshot();
        return {
          content: [{
            type: "text" as const,
            text: `Configured ${snapshot.project.name}: ${snapshot.uv.mode} UV at ${snapshot.resolution.texture_width}x${snapshot.resolution.texture_height}.`,
          }],
          structuredContent: { status: "PASS", ...snapshot },
        };
      },
    },
    projectToolDocs[1].status
  );

  createTool(
    projectToolDocs[2].name,
    {
      ...projectToolDocs[2],
      async execute() {
        const snapshot = projectSnapshot();
        return {
          content: [{
            type: "text" as const,
            text: `Project ${snapshot.project.name}: ${snapshot.counts.cubes} cubes, ${snapshot.counts.groups} groups, ${snapshot.counts.textures} textures.`,
          }],
          structuredContent: { status: "PASS", ...snapshot },
        };
      },
    },
    projectToolDocs[2].status
  );
}
