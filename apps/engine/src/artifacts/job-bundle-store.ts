import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { buildArtifactIndex, type ArtifactIndex } from "./artifact-index-store.js";
import type { JobArtifactSummary } from "./job-artifacts.js";

export interface JobBundleFile {
  name: string;
  fileName: string;
  role: "state" | "input" | "plan" | "validation" | "mcp" | "preview" | "export" | "diagnostic" | "manifest";
  required: boolean;
  available: boolean;
  sizeBytes?: number;
  updatedAt?: string;
}

export interface JobBundleManifest {
  jobId: string;
  generatedAt: string;
  bundleVersion: 1;
  bundleType: "buildit_job_output";
  ready: boolean;
  missingRequiredFiles: string[];
  files: JobBundleFile[];
  artifactIndex: ArtifactIndex;
}

function getArtifactRole(name: string): JobBundleFile["role"] {
  if (name === "job_snapshot") return "state";
  if (name === "artifact_index" || name === "job_bundle") return "manifest";
  if (name === "image_analysis") return "input";
  if (name === "model_plan") return "plan";
  if (name === "model_plan_validation") return "validation";
  if (name === "mcp_actions" || name === "mcp_capabilities" || name === "mcp_execution_report") return "mcp";
  if (name === "blockbench_preview") return "preview";
  if (name === "blockbench_export") return "export";
  return "diagnostic";
}

function isRequiredBundleArtifact(name: string): boolean {
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

function toBundleFile(artifact: JobArtifactSummary): JobBundleFile {
  return {
    name: artifact.name,
    fileName: artifact.fileName,
    role: getArtifactRole(artifact.name),
    required: isRequiredBundleArtifact(artifact.name),
    available: artifact.available,
    sizeBytes: artifact.sizeBytes,
    updatedAt: artifact.updatedAt
  };
}

export async function buildJobBundle(outputRoot: string, jobId: string): Promise<JobBundleManifest> {
  const artifactIndex = await buildArtifactIndex(outputRoot, jobId);
  const files = artifactIndex.artifacts.map(toBundleFile);
  const missingRequiredFiles = files
    .filter((file) => file.required && !file.available && file.name !== "job_bundle")
    .map((file) => file.fileName);

  return {
    jobId,
    generatedAt: new Date().toISOString(),
    bundleVersion: 1,
    bundleType: "buildit_job_output",
    ready: missingRequiredFiles.length === 0,
    missingRequiredFiles,
    files,
    artifactIndex
  };
}

export async function saveJobBundle(outputRoot: string, jobId: string): Promise<JobBundleManifest> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const bundle = await buildJobBundle(outputRoot, jobId);
  await writeFile(join(jobDir, "job_bundle.json"), JSON.stringify(bundle, null, 2));

  return bundle;
}
