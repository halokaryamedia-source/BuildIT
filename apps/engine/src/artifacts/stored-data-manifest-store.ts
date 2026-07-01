import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildArtifactIndex, type ArtifactIndex } from "./artifact-index-store.js";
import type { JobArtifactSummary } from "./job-artifacts.js";

export interface StoredDataFile {
  name: string;
  fileName: string;
  role: "state" | "input" | "plan" | "validation" | "mcp" | "preview" | "export" | "diagnostic" | "manifest";
  required: boolean;
  available: boolean;
  sizeBytes?: number;
  updatedAt?: string;
}

export interface StoredDataManifest {
  jobId: string;
  generatedAt: string;
  manifestVersion: 1;
  manifestType: "buildit_stored_data";
  storedDataRoot: string;
  openTargetPath: string;
  ready: boolean;
  missingRequiredFiles: string[];
  files: StoredDataFile[];
  artifactIndex: ArtifactIndex;
}

function getArtifactRole(name: string): StoredDataFile["role"] {
  if (name === "job_snapshot") return "state";
  if (name === "artifact_index" || name === "stored_data_manifest") return "manifest";
  if (name === "image_analysis") return "input";
  if (name === "model_plan") return "plan";
  if (name === "model_plan_validation") return "validation";
  if (
    name === "mcp_actions" ||
    name === "mcp_tool_schema" ||
    name === "mcp_tool_name_mapping" ||
    name === "mcp_action_schema_match" ||
    name === "mcp_capabilities" ||
    name === "mcp_execution_report"
  ) {
    return "mcp";
  }
  if (name === "blockbench_preview") return "preview";
  if (name === "blockbench_export") return "export";
  return "diagnostic";
}

function isRequiredStoredDataArtifact(name: string): boolean {
  return [
    "job_snapshot",
    "artifact_index",
    "model_plan",
    "model_plan_validation",
    "mcp_actions",
    "mcp_capabilities",
    "mcp_execution_report"
  ].includes(name);
}

function toStoredDataFile(artifact: JobArtifactSummary): StoredDataFile {
  return {
    name: artifact.name,
    fileName: artifact.fileName,
    role: getArtifactRole(artifact.name),
    required: isRequiredStoredDataArtifact(artifact.name),
    available: artifact.available,
    sizeBytes: artifact.sizeBytes,
    updatedAt: artifact.updatedAt
  };
}

function markStoredDataManifestAvailable(manifest: StoredDataManifest): StoredDataManifest {
  return {
    ...manifest,
    files: manifest.files.map((file) =>
      file.name === "stored_data_manifest"
        ? {
            ...file,
            available: true,
            updatedAt: manifest.generatedAt
          }
        : file
    )
  };
}

export async function buildStoredDataManifest(outputRoot: string, jobId: string): Promise<StoredDataManifest> {
  const artifactIndex = await buildArtifactIndex(outputRoot, jobId);
  const files = artifactIndex.artifacts.map(toStoredDataFile);
  const storedDataRoot = join(outputRoot, "jobs", jobId);
  const missingRequiredFiles = files.filter((file) => file.required && !file.available).map((file) => file.fileName);

  return {
    jobId,
    generatedAt: new Date().toISOString(),
    manifestVersion: 1,
    manifestType: "buildit_stored_data",
    storedDataRoot,
    openTargetPath: storedDataRoot,
    ready: missingRequiredFiles.length === 0,
    missingRequiredFiles,
    files,
    artifactIndex
  };
}

export async function saveStoredDataManifest(outputRoot: string, jobId: string): Promise<StoredDataManifest> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const manifest = markStoredDataManifestAvailable(await buildStoredDataManifest(outputRoot, jobId));
  await writeFile(join(jobDir, "stored_data_manifest.json"), JSON.stringify(manifest, null, 2));

  return manifest;
}
