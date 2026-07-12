import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { basename, join, resolve } from "node:path";

interface JsonRecord {
  [key: string]: any;
}

const repoRoot = resolve(import.meta.dir, "../..");
const workspaceRoot = join(repoRoot, "workspace");
const indexPath = join(workspaceRoot, "workspace.json");
const manageWorkspace = join(
  repoRoot,
  "engines/shared/workspace/manage-workspace.ts"
);

function option(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson(path: string): Promise<JsonRecord> {
  return JSON.parse(await readFile(path, "utf8")) as JsonRecord;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function listFiles(root: string, prefix = ""): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = join(root, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await listFiles(absolute, relative)));
    } else {
      result.push(relative);
    }
  }
  return result;
}

function rewriteWorkspacePaths(
  text: string,
  sampleId: string,
  assetId: string
): string {
  return text
    .replaceAll(`workspace/active/${sampleId}`, `workspace/active/${assetId}`)
    .replaceAll(`${sampleId}.bbmodel`, `${assetId}.bbmodel`);
}

async function copyReferencePackage(
  sampleRoot: string,
  technicalTarget: string,
  userTarget: string,
  sampleId: string,
  assetId: string
): Promise<void> {
  await mkdir(technicalTarget, { recursive: true });
  await mkdir(userTarget, { recursive: true });

  const files = await listFiles(sampleRoot);
  for (const relative of files) {
    const source = join(sampleRoot, relative);
    const technicalPath = join(technicalTarget, relative);
    await mkdir(resolve(technicalPath, ".."), { recursive: true });

    if (/\.(?:md|json)$/i.test(relative)) {
      const text = rewriteWorkspacePaths(
        await readFile(source, "utf8"),
        sampleId,
        assetId
      );
      await writeFile(technicalPath, text);
    } else {
      await cp(source, technicalPath);
    }
  }

  const manifestPath = join(technicalTarget, "reference_manifest.json");
  const manifest = await readJson(manifestPath);
  manifest.asset = manifest.asset ?? {};
  manifest.asset.id = assetId;
  manifest.asset.canonical_model_filename = `${assetId}.bbmodel`;
  manifest.package = manifest.package ?? {};
  manifest.package.root_name = `${assetId}_blockbench_reference`;
  await writeJson(manifestPath, manifest);

  const originalSource = join(sampleRoot, "source/original_reference.png");
  const referenceVisualName = String(
    manifest.reference_visual_lock?.filename ??
      manifest.package?.reference_visual ??
      `${sampleId}_reference_visual.png`
  );
  const referenceVisualSource = join(sampleRoot, referenceVisualName);

  await cp(originalSource, join(userTarget, "original_reference.png"));
  await cp(referenceVisualSource, join(userTarget, referenceVisualName));
}

async function main(): Promise<void> {
  const sampleId = process.argv[2];
  if (!sampleId || !/^[a-z0-9_]+$/.test(sampleId)) {
    throw new Error(
      "Usage: bun run workspace:sample -- <sample_id> --asset-id <new_asset_id> [--display-name <name>]"
    );
  }

  const assetId = option("--asset-id") ?? `${sampleId}_e2e`;
  if (!/^[a-z0-9_]+$/.test(assetId)) {
    throw new Error("--asset-id must use lowercase snake_case.");
  }
  const displayName = option("--display-name") ??
    sampleId
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const sampleRoot = join(
    repoRoot,
    "docs/reference/golden-samples",
    sampleId
  );
  const activeRoot = join(workspaceRoot, "active", assetId);
  const completedRoot = join(workspaceRoot, "completed", assetId);
  const technicalTarget = join(activeRoot, "mcp", "references");
  const userTarget = join(activeRoot, "blockbench", "references");

  if (!(await exists(sampleRoot))) {
    throw new Error(`Golden sample not found: ${sampleRoot}`);
  }
  if ((await exists(activeRoot)) || (await exists(completedRoot))) {
    throw new Error(
      `Target workspace already exists: ${assetId}. Choose a fresh --asset-id so the acceptance test starts from zero.`
    );
  }

  const sampleFiles = await listFiles(sampleRoot);
  const required = [
    "reference_manifest.json",
    "PRODUCTION_CONTEXT.md",
    "GEOMETRY.md",
    "TEXTURING.md",
    "ANIMATION.md",
    "VALIDATION.md",
    "CODEX_REFERENCE_HANDOFF.md",
    "source/original_reference.png",
  ];
  for (const file of required) {
    if (!sampleFiles.includes(file)) {
      throw new Error(`Golden sample is incomplete: missing ${file}`);
    }
  }
  if (sampleFiles.some((file) => file.toLowerCase().endsWith(".bbmodel"))) {
    throw new Error(
      "GOLDEN_SAMPLE_MODEL_LEAK: the zero-start sample must not contain a prebuilt .bbmodel."
    );
  }

  const originalIndex = (await exists(indexPath))
    ? await readFile(indexPath, "utf8")
    : null;

  try {
    const child = Bun.spawn(
      [
        process.execPath,
        "run",
        manageWorkspace,
        "init",
        assetId,
        "--display-name",
        displayName,
      ],
      {
        cwd: join(repoRoot, "mcp-blockbench"),
        stdout: "inherit",
        stderr: "inherit",
      }
    );
    const code = await child.exited;
    if (code !== 0) {
      throw new Error(`Workspace init failed with exit code ${code}.`);
    }

    await copyReferencePackage(
      sampleRoot,
      technicalTarget,
      userTarget,
      sampleId,
      assetId
    );

    const manifest = await readJson(
      join(technicalTarget, "reference_manifest.json")
    );
    const statePath = join(activeRoot, "mcp", "state.json");
    const projectPath = join(activeRoot, "mcp", "project.json");
    const modelPath = join(activeRoot, "blockbench", `${assetId}.bbmodel`);

    // The acceptance workspace intentionally starts with references only. Codex
    // must create the Blockbench project and every model element through MCP.
    await rm(modelPath, { force: true });

    const state = await readJson(statePath);
    state.lifecycle = {
      ...(state.lifecycle ?? {}),
      origin: "GOLDEN_SAMPLE_ZERO_START",
      sample_id: sampleId,
      baseline_model_sha256: null,
    };
    state.reference = {
      ...(state.reference ?? {}),
      status: "APPROVED",
      path: `workspace/active/${assetId}/mcp/references`,
      manifest: "reference_manifest.json",
      production_context:
        manifest.package?.production_context ?? "PRODUCTION_CONTEXT.md",
      visual:
        manifest.reference_visual_lock?.filename ??
        manifest.package?.reference_visual,
      geometry: manifest.package?.geometry ?? "GEOMETRY.md",
      texturing: manifest.package?.texturing ?? "TEXTURING.md",
      animation: manifest.package?.animation ?? "ANIMATION.md",
      validation: manifest.package?.validation ?? "VALIDATION.md",
      handoff:
        manifest.package?.codex_handoff ?? "CODEX_REFERENCE_HANDOFF.md",
    };
    state.project = {
      ...(state.project ?? {}),
      name: null,
      uuid: null,
      save_path: `workspace/active/${assetId}/blockbench/${assetId}.bbmodel`,
    };
    state.workflow = {
      ...(state.workflow ?? {}),
      state: "REFERENCE_READY",
      status: "READY",
      active_stage: "GEOMETRY",
      next_action: "CREATE_PROJECT_THEN_SYNC_IDENTITY",
      animation_required:
        Array.isArray(manifest.animation?.required_clips) &&
        manifest.animation.required_clips.length > 0,
    };
    state.mcp = {
      ...(state.mcp ?? {}),
      profile_reconnect_required: false,
      stable_tool_surface: true,
      registered_tool_surface: "STABLE_FULL_LIBRARY",
      execution_surface: "ACTIVE_PROFILE_GUARDED",
    };
    state.updated_at = new Date().toISOString();
    state.updated_by = "workspace-golden-sample-init";
    await writeJson(statePath, state);

    const project = await readJson(projectPath);
    project.provenance = {
      type: "GOLDEN_SAMPLE_ZERO_START",
      sample_id: sampleId,
      sample_root: `docs/reference/golden-samples/${sampleId}`,
      prebuilt_model_copied: false,
    };
    project.updated_at = new Date().toISOString();
    await writeJson(projectPath, project);

    console.log(
      JSON.stringify(
        {
          status: "PASS",
          sample_id: sampleId,
          asset_id: assetId,
          display_name: displayName,
          workspace_root: `workspace/active/${assetId}`,
          canonical_session_root: `workspace/active/${assetId}/mcp`,
          canonical_model_path: `workspace/active/${assetId}/blockbench/${assetId}.bbmodel`,
          reference_visual:
            manifest.reference_visual_lock?.filename ??
            manifest.package?.reference_visual,
          model_exists: await exists(modelPath),
          prebuilt_model_copied: false,
          next_action: "CREATE_PROJECT_THEN_SYNC_IDENTITY",
        },
        null,
        2
      )
    );
  } catch (error) {
    await rm(activeRoot, { recursive: true, force: true });
    if (originalIndex === null) {
      await rm(indexPath, { force: true });
    } else {
      await writeFile(indexPath, originalIndex);
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
