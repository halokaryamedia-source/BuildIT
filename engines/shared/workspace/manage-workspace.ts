import { createHash } from "node:crypto";
import {
  access,
  cp,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";

interface WorkspaceEntry {
  lifecycle: "ACTIVE" | "COMPLETED" | "REOPENED";
  active_path: string | null;
  completed_path: string | null;
  blockbench_path: string;
  mcp_path: string;
  updated_at: string;
}

interface WorkspaceIndex {
  schema_version: "1.0";
  selected_asset_id: string | null;
  projects: Record<string, WorkspaceEntry>;
}

interface JsonRecord {
  [key: string]: any;
}

const repoRoot = resolve(import.meta.dir, "../../..");
const workspaceRoot = join(repoRoot, "workspace");
const indexPath = join(workspaceRoot, "workspace.json");
const stateTemplatePath = join(
  repoRoot,
  "engines/shared/templates/state.template.json"
);
const projectTemplatePath = join(import.meta.dir, "project.template.json");

const now = () => new Date().toISOString();
const posix = (path: string) => relative(repoRoot, path).replace(/\\/g, "/");

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

async function writeJsonAtomic(path: string, value: unknown): Promise<void> {
  await mkdir(resolve(path, ".."), { recursive: true });
  const temp = `${path}.tmp`;
  await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temp, path);
}

async function loadIndex(): Promise<WorkspaceIndex> {
  if (!(await exists(indexPath))) {
    const empty: WorkspaceIndex = {
      schema_version: "1.0",
      selected_asset_id: null,
      projects: {},
    };
    await writeJsonAtomic(indexPath, empty);
    return empty;
  }
  return readJson<WorkspaceIndex>(indexPath);
}

function validateAssetId(assetId: string): void {
  if (!/^[a-z0-9_]+$/.test(assetId)) {
    throw new Error("Asset ID must use lowercase snake_case.");
  }
}

function paths(assetId: string, lifecycle: "active" | "completed") {
  const root = join(workspaceRoot, lifecycle, assetId);
  return {
    root,
    blockbench: join(root, "blockbench"),
    model: join(root, "blockbench", `${assetId}.bbmodel`),
    textures: join(root, "blockbench", "textures"),
    references: join(root, "blockbench", "references"),
    previews: join(root, "blockbench", "previews"),
    mcp: join(root, "mcp"),
    project: join(root, "mcp", "project.json"),
    state: join(root, "mcp", "state.json"),
    technicalReference: join(root, "mcp", "references"),
    checkpoints: join(root, "mcp", "checkpoints"),
    evidence: join(root, "mcp", "evidence"),
    reports: join(root, "mcp", "reports"),
    finalStaging: join(root, "mcp", "final"),
  };
}

function replaceTokens(value: unknown, assetId: string, displayName: string): unknown {
  if (typeof value === "string") {
    return value
      .replaceAll("<asset_id>", assetId)
      .replaceAll("<DISPLAY NAME>", displayName)
      .replaceAll(
        `workspace/sessions/${assetId}`,
        `workspace/active/${assetId}/mcp`
      );
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceTokens(item, assetId, displayName));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceTokens(item, assetId, displayName),
      ])
    );
  }
  return value;
}

async function hashFile(path: string): Promise<string> {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

async function ensureLayout(assetId: string, displayName: string): Promise<void> {
  const target = paths(assetId, "active");
  for (const directory of [
    target.textures,
    target.references,
    target.previews,
    target.technicalReference,
    target.checkpoints,
    join(target.evidence, "geometry"),
    join(target.evidence, "texture"),
    join(target.evidence, "animation"),
    join(target.evidence, "final"),
    target.reports,
    join(target.finalStaging, "textures"),
  ]) {
    await mkdir(directory, { recursive: true });
  }

  const blockbenchReadme = `# ${displayName}\n\nThis folder is the user-facing Blockbench package.\n\n- ${assetId}.bbmodel — canonical model\n- textures/ — model textures\n- references/ — source and approved reference images\n- previews/ — approved preview renders\n\nThe sibling mcp/ folder is agent/runtime data and is not required for ordinary Blockbench use.\n`;
  await writeFile(join(target.blockbench, "README.md"), blockbenchReadme, "utf8");

  const projectTemplate = replaceTokens(
    await readJson<JsonRecord>(projectTemplatePath),
    assetId,
    displayName
  ) as JsonRecord;
  projectTemplate.created_at = now();
  projectTemplate.updated_at = projectTemplate.created_at;
  await writeJsonAtomic(target.project, projectTemplate);

  const stateTemplate = replaceTokens(
    await readJson<JsonRecord>(stateTemplatePath),
    assetId,
    displayName
  ) as JsonRecord;
  stateTemplate.lifecycle = {
    status: "ACTIVE",
    origin: "NEW",
    reopened_from: null,
    baseline_model_sha256: null,
    reason: null,
    reopened_stage: null,
  };
  stateTemplate.project.save_path = posix(target.model);
  stateTemplate.reference.path = posix(target.technicalReference);
  stateTemplate.mcp.connection_report = posix(join(target.reports, "connection.json"));
  stateTemplate.mcp.preflight.report = posix(join(target.reports, "preflight.json"));
  stateTemplate.validation.report = posix(
    join(target.evidence, "final", "validation_report.json")
  );
  await writeJsonAtomic(target.state, stateTemplate);
}

async function init(assetId: string, displayName: string): Promise<void> {
  validateAssetId(assetId);
  const active = paths(assetId, "active");
  const completed = paths(assetId, "completed");
  if ((await exists(active.root)) || (await exists(completed.root))) {
    throw new Error(`Workspace project already exists: ${assetId}`);
  }
  await ensureLayout(assetId, displayName);
  const index = await loadIndex();
  index.selected_asset_id = assetId;
  index.projects[assetId] = {
    lifecycle: "ACTIVE",
    active_path: posix(active.root),
    completed_path: null,
    blockbench_path: posix(active.blockbench),
    mcp_path: posix(active.mcp),
    updated_at: now(),
  };
  await writeJsonAtomic(indexPath, index);
  console.log(`Initialized and selected ${assetId}.`);
}

async function activate(assetId: string): Promise<void> {
  validateAssetId(assetId);
  const active = paths(assetId, "active");
  if (!(await exists(active.root))) {
    throw new Error(
      `Active project not found: ${assetId}. Use reopen for a completed project.`
    );
  }
  const index = await loadIndex();
  const current = index.projects[assetId];
  index.selected_asset_id = assetId;
  index.projects[assetId] = {
    lifecycle: current?.lifecycle === "REOPENED" ? "REOPENED" : "ACTIVE",
    active_path: posix(active.root),
    completed_path: current?.completed_path ?? null,
    blockbench_path: posix(active.blockbench),
    mcp_path: posix(active.mcp),
    updated_at: now(),
  };
  await writeJsonAtomic(indexPath, index);
  console.log(`Selected ${assetId}.`);
}

async function inspect(assetId: string): Promise<void> {
  validateAssetId(assetId);
  const active = paths(assetId, "active");
  const completed = paths(assetId, "completed");
  const selected = (await exists(active.root)) ? active : completed;
  if (!(await exists(selected.root))) throw new Error(`Project not found: ${assetId}`);
  const project = await readJson<JsonRecord>(selected.project);
  const state = await readJson<JsonRecord>(selected.state);
  console.log(
    JSON.stringify(
      {
        asset_id: assetId,
        location: posix(selected.root),
        lifecycle: project.lifecycle,
        workflow: state.workflow,
        blockbench: project.paths?.blockbench_root,
        model: project.paths?.model,
        mcp: project.paths?.mcp_root,
      },
      null,
      2
    )
  );
}

async function promoteFinal(assetId: string): Promise<void> {
  const active = paths(assetId, "active");
  const stagedModel = join(active.finalStaging, `${assetId}.bbmodel`);
  const stagedTextures = join(active.finalStaging, "textures");
  if (!(await exists(stagedModel))) {
    throw new Error(`Validated final model is missing: ${stagedModel}`);
  }
  if (!(await exists(stagedTextures))) {
    throw new Error(`Validated final texture directory is missing: ${stagedTextures}`);
  }
  await cp(stagedModel, active.model, { force: true });
  await rm(active.textures, { recursive: true, force: true });
  await cp(stagedTextures, active.textures, { recursive: true, force: true });

  const finalEvidence = join(active.evidence, "final");
  if (await exists(finalEvidence)) {
    await mkdir(active.previews, { recursive: true });
    for (const filename of [
      "final_front.png",
      "final_left.png",
      "final_back.png",
      "final_top.png",
      "final_front_left_3_4.png",
      "final_texture_atlas.png",
    ]) {
      const source = join(finalEvidence, filename);
      if (await exists(source)) await cp(source, join(active.previews, filename), { force: true });
    }
  }
  await rm(active.finalStaging, { recursive: true, force: true });
}

async function replaceCompleted(activeRoot: string, completedRoot: string): Promise<void> {
  const previous = `${completedRoot}.previous.tmp`;
  await rm(previous, { recursive: true, force: true });
  if (await exists(completedRoot)) await rename(completedRoot, previous);
  try {
    await rename(activeRoot, completedRoot);
    await rm(previous, { recursive: true, force: true });
  } catch (error) {
    if (await exists(completedRoot)) await rm(completedRoot, { recursive: true, force: true });
    if (await exists(previous)) await rename(previous, completedRoot);
    throw error;
  }
}

async function complete(assetId: string, approvalRef: string): Promise<void> {
  validateAssetId(assetId);
  if (!approvalRef) throw new Error("--approval-ref is required.");
  const active = paths(assetId, "active");
  const completed = paths(assetId, "completed");
  if (!(await exists(active.root))) throw new Error(`Active project not found: ${assetId}`);
  const state = await readJson<JsonRecord>(active.state);
  if (state.workflow?.state !== "DONE") {
    throw new Error(`Project must be DONE before completion; found ${state.workflow?.state}.`);
  }

  await promoteFinal(assetId);
  const project = await readJson<JsonRecord>(active.project);
  project.lifecycle = {
    status: "COMPLETED",
    origin: project.lifecycle?.origin ?? "NEW",
    reopened_from: project.lifecycle?.reopened_from ?? null,
    reopened_stage: project.lifecycle?.reopened_stage ?? null,
    reason: project.lifecycle?.reason ?? null,
    baseline_model_sha256: project.lifecycle?.baseline_model_sha256 ?? null,
  };
  project.paths = Object.fromEntries(
    Object.entries(project.paths ?? {}).map(([key, value]) => [
      key,
      typeof value === "string"
        ? value.replace(
            `workspace/active/${assetId}`,
            `workspace/completed/${assetId}`
          )
        : value,
    ])
  );
  project.artifacts.model_sha256 = await hashFile(active.model);
  project.completion = {
    completed_at: now(),
    approval_ref: approvalRef,
    last_approved_state: "DONE",
  };
  project.updated_at = now();
  await writeJsonAtomic(active.project, project);

  state.lifecycle = {
    ...(state.lifecycle ?? {}),
    status: "COMPLETED",
  };
  state.updated_at = now();
  state.updated_by = "workspace-complete";
  await writeJsonAtomic(active.state, state);

  await replaceCompleted(active.root, completed.root);
  const index = await loadIndex();
  if (index.selected_asset_id === assetId) index.selected_asset_id = null;
  index.projects[assetId] = {
    lifecycle: "COMPLETED",
    active_path: null,
    completed_path: posix(completed.root),
    blockbench_path: posix(completed.blockbench),
    mcp_path: posix(completed.mcp),
    updated_at: now(),
  };
  await writeJsonAtomic(indexPath, index);
  console.log(`Completed ${assetId}. User files: ${posix(completed.blockbench)}`);
}

const stageOrder = ["GEOMETRY", "TEXTURE", "ANIMATION", "FINAL_VALIDATION"] as const;
type Stage = (typeof stageOrder)[number];

function revisionState(stage: Stage): string {
  return stage === "FINAL_VALIDATION" ? "FINAL_REVISION" : `${stage}_REVISION`;
}

async function reopen(assetId: string, stage: Stage, reason: string): Promise<void> {
  validateAssetId(assetId);
  if (!stageOrder.includes(stage)) throw new Error(`Invalid stage: ${stage}`);
  if (!reason) throw new Error("--reason is required.");
  const active = paths(assetId, "active");
  const completed = paths(assetId, "completed");
  if (await exists(active.root)) throw new Error(`Active project already exists: ${assetId}`);
  if (!(await exists(completed.root))) throw new Error(`Completed project not found: ${assetId}`);

  await cp(completed.root, active.root, { recursive: true });
  const project = await readJson<JsonRecord>(active.project);
  const baselineHash = await hashFile(active.model);
  project.lifecycle = {
    status: "ACTIVE",
    origin: "REOPENED",
    reopened_from: posix(completed.root),
    reopened_stage: stage,
    reason,
    baseline_model_sha256: baselineHash,
  };
  project.paths = Object.fromEntries(
    Object.entries(project.paths ?? {}).map(([key, value]) => [
      key,
      typeof value === "string"
        ? value.replace(
            `workspace/completed/${assetId}`,
            `workspace/active/${assetId}`
          )
        : value,
    ])
  );
  project.completion = {
    completed_at: null,
    approval_ref: null,
    last_approved_state: null,
  };
  project.updated_at = now();
  await writeJsonAtomic(active.project, project);

  const state = await readJson<JsonRecord>(active.state);
  state.lifecycle = {
    status: "ACTIVE",
    origin: "REOPENED",
    reopened_from: posix(completed.root),
    baseline_model_sha256: baselineHash,
    reason,
    reopened_stage: stage,
  };
  state.state_revision = Number(state.state_revision ?? 0) + 1;
  state.workflow.state = revisionState(stage);
  state.workflow.status = "IN_PROGRESS";
  state.workflow.active_stage = stage;
  state.workflow.next_action = `START_${stage}_REVISION`;
  const reopenedIndex = stageOrder.indexOf(stage);
  for (const current of stageOrder) {
    const record = state.workflow.stage_records?.[current];
    if (!record) continue;
    const currentIndex = stageOrder.indexOf(current);
    if (current === stage) {
      record.status = "IN_REVISION";
      record.decision = null;
      record.open_issues = [reason];
    } else if (currentIndex > reopenedIndex) {
      record.status = "REVALIDATION_REQUIRED";
      record.decision = null;
    }
  }
  state.updated_at = now();
  state.updated_by = "workspace-reopen";
  await writeJsonAtomic(active.state, state);
  await mkdir(join(active.finalStaging, "textures"), { recursive: true });

  const index = await loadIndex();
  index.selected_asset_id = assetId;
  index.projects[assetId] = {
    lifecycle: "REOPENED",
    active_path: posix(active.root),
    completed_path: posix(completed.root),
    blockbench_path: posix(active.blockbench),
    mcp_path: posix(active.mcp),
    updated_at: now(),
  };
  await writeJsonAtomic(indexPath, index);
  console.log(`Reopened ${assetId} at ${stage}. Completed baseline remains unchanged.`);
}

async function list(): Promise<void> {
  const index = await loadIndex();
  console.log(JSON.stringify(index, null, 2));
}

function option(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

async function main(): Promise<void> {
  const [, , command, assetId] = process.argv;
  if (!command) {
    throw new Error(
      "Usage: workspace <init|list|activate|inspect|complete|reopen> [asset_id]"
    );
  }
  if (command === "list") return list();
  if (!assetId) throw new Error("asset_id is required.");
  if (command === "init") {
    return init(assetId, option("--display-name") ?? assetId);
  }
  if (command === "activate") return activate(assetId);
  if (command === "inspect") return inspect(assetId);
  if (command === "complete") {
    return complete(assetId, option("--approval-ref") ?? "");
  }
  if (command === "reopen") {
    return reopen(
      assetId,
      (option("--stage") ?? "FINAL_VALIDATION") as Stage,
      option("--reason") ?? ""
    );
  }
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
