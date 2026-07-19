/// <reference types="blockbench-types" />

import {
  writeFileAtomically,
  writeJsonAtomically,
  type NativeDirentLike,
  type NativeFsLike,
} from "@/lib/atomicFiles";

type BootstrapFs = NativeFsLike & {
  readdirSync(path: string): string[];
  readdirSync(
    path: string,
    options: { withFileTypes: true }
  ): NativeDirentLike[];
  cpSync(
    source: string,
    target: string,
    options: { recursive: true; force?: boolean }
  ): void;
  copyFileSync(source: string, target: string): void;
};

interface PathModuleLike {
  resolve(...paths: string[]): string;
  join(...paths: string[]): string;
  dirname(path: string): string;
  basename(path: string): string;
  extname(path: string): string;
}

export interface WorkspaceBootstrapResult {
  created: boolean;
  asset_id: string;
  display_name: string;
  workspace_root: string;
  active_root: string;
  blockbench_root: string;
  session_root: string;
  model_path: string;
  manifest_path: string;
  copied_reference_images: string[];
}

function nativeFs(): BootstrapFs {
  // @ts-ignore Blockbench runtime permission API.
  const value = requireNativeModule("fs", {
    message:
      "Workspace bootstrap needs access to the approved ChatGPT reference package and local production workspace.",
    optional: false,
  });
  if (!value) throw new Error("Filesystem access was denied.");
  const fs = value as unknown as BootstrapFs;
  if (
    typeof fs.readdirSync !== "function" ||
    typeof fs.cpSync !== "function" ||
    typeof fs.copyFileSync !== "function"
  ) {
    throw new Error("WORKSPACE_BOOTSTRAP_FILESYSTEM_CAPABILITY_MISSING");
  }
  return fs;
}

function pathModule(): PathModuleLike {
  // @ts-ignore Blockbench runtime permission API.
  const value = requireNativeModule("path", {
    message: "Workspace bootstrap needs canonical path resolution.",
    optional: false,
  });
  if (!value) throw new Error("Path access was denied.");
  return value as unknown as PathModuleLike;
}

function readJson(fs: NativeFsLike, path: string): Record<string, any> {
  if (!fs.existsSync(path)) throw new Error(`Required JSON file not found: ${path}`);
  return JSON.parse(String(fs.readFileSync(path, "utf8"))) as Record<string, any>;
}

function findManifest(
  fs: BootstrapFs,
  path: PathModuleLike,
  packageRoot: string
): string {
  for (const candidate of [
    path.join(packageRoot, "reference_manifest.json"),
    path.join(packageRoot, "references", "reference_manifest.json"),
  ]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  for (const entry of fs.readdirSync(packageRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(packageRoot, entry.name, "reference_manifest.json");
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    `REFERENCE_PACKAGE_MANIFEST_MISSING: no reference_manifest.json under ${packageRoot}.`
  );
}

function collectReferenceImages(
  fs: BootstrapFs,
  path: PathModuleLike,
  root: string,
  depth = 0
): string[] {
  if (depth > 3) return [];
  const images: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const source = path.join(root, entry.name);
    if (entry.isDirectory()) {
      images.push(...collectReferenceImages(fs, path, source, depth + 1));
    } else if (
      entry.isFile() &&
      [".png", ".jpg", ".jpeg", ".webp"].includes(
        path.extname(entry.name).toLowerCase()
      )
    ) {
      images.push(source);
    }
  }
  return images;
}

function slash(value: string): string {
  return value.replace(/\\/g, "/");
}

function animationRequired(manifest: Record<string, any>): boolean {
  return (
    String(manifest.animation?.status ?? "").toUpperCase() ===
      "ANIMATION_REQUIRED" ||
    (Array.isArray(manifest.animation?.required_clips) &&
      manifest.animation.required_clips.length > 0)
  );
}

function stateTemplate(input: {
  assetId: string;
  displayName: string;
  sessionRoot: string;
  modelPath: string;
  manifest: Record<string, any>;
}): Record<string, any> {
  const requiresAnimation = animationRequired(input.manifest);
  const now = new Date().toISOString();
  return {
    schema_version: "2.4",
    state_revision: 0,
    asset: {
      id: input.assetId,
      display_name: input.displayName,
      target: input.manifest.asset?.target ?? "minecraft_bedrock_entity",
    },
    lifecycle: {
      status: "ACTIVE",
      origin: "CHATGPT_REFERENCE_PACKAGE",
      reopened_from: null,
      baseline_model_sha256: null,
      reason: null,
      reopened_stage: null,
    },
    reference: {
      path: slash(`${input.sessionRoot}/references`),
      status: "APPROVED",
      manifest: "reference_manifest.json",
      production_context:
        input.manifest.package?.production_context ?? "PRODUCTION_CONTEXT.md",
      visual:
        input.manifest.reference_visual_lock?.filename ??
        input.manifest.package?.reference_visual ??
        `${input.assetId}_reference_visual.png`,
      geometry: input.manifest.package?.geometry ?? "GEOMETRY.md",
      texturing: input.manifest.package?.texturing ?? "TEXTURING.md",
      animation: input.manifest.package?.animation ?? "ANIMATION.md",
      validation: input.manifest.package?.validation ?? "VALIDATION.md",
      handoff:
        input.manifest.package?.codex_handoff ?? "CODEX_REFERENCE_HANDOFF.md",
      conflicts: [],
    },
    project: {
      name: null,
      uuid: null,
      format: "bedrock_block",
      uv_mode: "per_face",
      texture_width: null,
      texture_height: null,
      save_path: slash(input.modelPath),
    },
    mcp: {
      server_key: "blockbench",
      canonical_url: "http://localhost:3000/bb-mcp",
      connection_status: "READY",
      capability_status: "READY",
      active_tool_profile: "BEDROCK_CUBOID_GEOMETRY",
      tool_profile_revision: null,
      tool_profile_hash: null,
      exposed_tool_count: null,
      total_library_tool_count: null,
      profile_reconnect_required: false,
      stable_tool_surface: true,
      registered_tool_surface: "STABLE_PRODUCTION_UNION",
      execution_surface: "ACTIVE_PROFILE_GUARDED",
      connection_report: slash(`${input.sessionRoot}/reports/connection.json`),
      preflight: {
        status: "READY",
        completed_at: now,
        stale_checks: [],
        report: slash(`${input.sessionRoot}/reports/preflight.json`),
      },
    },
    workflow: {
      state: "REFERENCE_READY",
      status: "READY",
      active_stage: "GEOMETRY",
      next_action: "CREATE_PROJECT",
      animation_required: requiresAnimation,
      last_completed_stage: null,
      last_safe_checkpoint: null,
      stage_records: {
        GEOMETRY: {
          status: "NOT_STARTED",
          decision: null,
          accepted_areas: [],
          open_issues: [],
        },
        TEXTURE: {
          status: "LOCKED",
          decision: null,
          accepted_areas: [],
          open_issues: [],
        },
        ANIMATION: {
          status: requiresAnimation ? "LOCKED" : "SKIPPED",
          decision: requiresAnimation ? null : "SKIPPED",
          accepted_areas: [],
          open_issues: [],
        },
        FINAL_VALIDATION: {
          status: "LOCKED",
          decision: null,
          accepted_areas: [],
          open_issues: [],
        },
      },
    },
    preservation: {
      manual_edits_present: false,
      manual_edits_to_preserve: [],
      globally_protected_areas: [],
      approved_stage_areas: { GEOMETRY: [], TEXTURE: [], ANIMATION: [] },
    },
    checkpoints: {
      session_start: null,
      geometry_review: null,
      geometry_approved: null,
      texture_review: null,
      texture_approved: null,
      animation_review: null,
      animation_approved_or_skipped: null,
      final_candidate: null,
      validation_pass: null,
    },
    validation: {
      status: "PENDING_BUILD",
      result: null,
      report: slash(`${input.sessionRoot}/evidence/final/validation_report.json`),
    },
    updated_at: now,
    updated_by: "create_project_workspace_bootstrap",
  };
}

function projectTemplate(input: {
  assetId: string;
  displayName: string;
  activeRoot: string;
  blockbenchRoot: string;
  sessionRoot: string;
  modelPath: string;
}): Record<string, any> {
  const now = new Date().toISOString();
  return {
    schema_version: "1.1",
    asset_id: input.assetId,
    display_name: input.displayName,
    lifecycle: {
      status: "ACTIVE",
      origin: "CHATGPT_REFERENCE_PACKAGE",
      reopened_from: null,
      reopened_stage: null,
      reason: null,
      baseline_model_sha256: null,
    },
    project: {
      uuid: null,
      format: "bedrock_block",
      uv_mode: "per_face",
      texture_width: null,
      texture_height: null,
      front_axis: "-z",
    },
    paths: {
      active_root: slash(input.activeRoot),
      blockbench_root: slash(input.blockbenchRoot),
      model: slash(input.modelPath),
      textures: slash(`${input.blockbenchRoot}/textures`),
      references: slash(`${input.blockbenchRoot}/references`),
      previews: slash(`${input.blockbenchRoot}/previews`),
      mcp_root: slash(input.sessionRoot),
      state: slash(`${input.sessionRoot}/state.json`),
      technical_reference: slash(`${input.sessionRoot}/references`),
      checkpoints: slash(`${input.sessionRoot}/checkpoints`),
      evidence: slash(`${input.sessionRoot}/evidence`),
      reports: slash(`${input.sessionRoot}/reports`),
    },
    connection: {
      server_key: "blockbench",
      canonical_url: "http://localhost:3000/bb-mcp",
      automatic: true,
    },
    artifacts: {
      model_sha256: null,
      reference_manifest_sha256: null,
      validation: null,
    },
    completion: {
      completed_at: null,
      approval_ref: null,
      last_approved_state: null,
    },
    created_at: now,
    updated_at: now,
  };
}

function ensureDirectories(fs: NativeFsLike, directories: string[]): void {
  for (const directory of directories) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function prepareWorkspaceFromReferencePackage(input: {
  referencePackageRoot: string;
  workspaceRoot?: string;
  assetId?: string;
  displayName?: string;
}): WorkspaceBootstrapResult {
  const fs = nativeFs();
  const path = pathModule();
  const packageRoot = path.resolve(input.referencePackageRoot);
  if (!fs.existsSync(packageRoot)) {
    throw new Error(`REFERENCE_PACKAGE_ROOT_MISSING: ${packageRoot}`);
  }

  const manifestSource = findManifest(fs, path, packageRoot);
  const referenceRoot = path.dirname(manifestSource);
  const manifest = readJson(fs, manifestSource);
  const manifestAssetId = String(manifest.asset?.id ?? "");
  const assetId = input.assetId ?? manifestAssetId;
  if (!/^[a-z0-9_]+$/.test(assetId)) {
    throw new Error("REFERENCE_PACKAGE_ASSET_ID_INVALID");
  }
  if (manifestAssetId && manifestAssetId !== assetId) {
    throw new Error(
      `REFERENCE_PACKAGE_ASSET_ID_MISMATCH: manifest ${manifestAssetId}; requested ${assetId}.`
    );
  }

  const displayName =
    input.displayName ??
    manifest.asset?.display_name ??
    manifest.asset?.name ??
    assetId;
  const workspaceRoot = path.resolve(
    input.workspaceRoot ?? path.join(process.cwd(), "workspace")
  );
  const activeRoot = path.join(workspaceRoot, "active", assetId);
  const completedRoot = path.join(workspaceRoot, "completed", assetId);
  const blockbenchRoot = path.join(activeRoot, "blockbench");
  const sessionRoot = path.join(activeRoot, "mcp");
  const modelPath = path.join(blockbenchRoot, `${assetId}.bbmodel`);
  const statePath = path.join(sessionRoot, "state.json");
  const projectPath = path.join(sessionRoot, "project.json");
  const manifestPath = path.join(
    sessionRoot,
    "references",
    "reference_manifest.json"
  );

  if (fs.existsSync(completedRoot)) {
    throw new Error(`WORKSPACE_COMPLETED_ASSET_EXISTS: ${assetId}`);
  }
  if (fs.existsSync(statePath) && fs.existsSync(projectPath)) {
    return {
      created: false,
      asset_id: assetId,
      display_name: displayName,
      workspace_root: workspaceRoot,
      active_root: activeRoot,
      blockbench_root: blockbenchRoot,
      session_root: sessionRoot,
      model_path: modelPath,
      manifest_path: manifestPath,
      copied_reference_images: [],
    };
  }

  ensureDirectories(fs, [
    path.join(blockbenchRoot, "textures"),
    path.join(blockbenchRoot, "references"),
    path.join(blockbenchRoot, "previews"),
    path.join(sessionRoot, "references"),
    path.join(sessionRoot, "checkpoints"),
    path.join(sessionRoot, "reports"),
    path.join(sessionRoot, "evidence", "geometry"),
    path.join(sessionRoot, "evidence", "texture"),
    path.join(sessionRoot, "evidence", "animation"),
    path.join(sessionRoot, "evidence", "final"),
    path.join(sessionRoot, "final", "textures"),
  ]);

  fs.cpSync(referenceRoot, path.join(sessionRoot, "references"), {
    recursive: true,
    force: true,
  });
  const copiedImages: string[] = [];
  for (const source of collectReferenceImages(fs, path, referenceRoot)) {
    const destination = path.join(
      blockbenchRoot,
      "references",
      path.basename(source)
    );
    fs.copyFileSync(source, destination);
    copiedImages.push(destination);
  }

  writeFileAtomically(
    fs,
    path.join(blockbenchRoot, "README.md"),
    `# ${displayName}\n\nThis is the user-facing Blockbench package for ${assetId}.\n\n- ${assetId}.bbmodel — canonical model\n- textures/ — model textures\n- references/ — approved ChatGPT reference images\n- previews/ — approved preview renders\n\nThe sibling mcp/ directory is managed automatically by Codex and MCP.\n`
  );
  writeJsonAtomically(
    fs,
    projectPath,
    projectTemplate({
      assetId,
      displayName,
      activeRoot,
      blockbenchRoot,
      sessionRoot,
      modelPath,
    })
  );
  writeJsonAtomically(
    fs,
    statePath,
    stateTemplate({
      assetId,
      displayName,
      sessionRoot,
      modelPath,
      manifest,
    })
  );

  const indexPath = path.join(workspaceRoot, "workspace.json");
  const index = fs.existsSync(indexPath)
    ? readJson(fs, indexPath)
    : { schema_version: "1.0", selected_asset_id: null, projects: {} };
  index.selected_asset_id = assetId;
  index.projects = index.projects ?? {};
  index.projects[assetId] = {
    lifecycle: "ACTIVE",
    active_path: slash(activeRoot),
    completed_path: null,
    blockbench_path: slash(blockbenchRoot),
    mcp_path: slash(sessionRoot),
    updated_at: new Date().toISOString(),
  };
  writeJsonAtomically(fs, indexPath, index);

  return {
    created: true,
    asset_id: assetId,
    display_name: displayName,
    workspace_root: workspaceRoot,
    active_root: activeRoot,
    blockbench_root: blockbenchRoot,
    session_root: sessionRoot,
    model_path: modelPath,
    manifest_path: manifestPath,
    copied_reference_images: copiedImages,
  };
}
