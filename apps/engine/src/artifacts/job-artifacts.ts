import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const jobArtifactNames = [
  "job_snapshot",
  "image_analysis",
  "model_plan",
  "model_plan_validation",
  "mcp_actions",
  "mcp_capabilities",
  "mcp_execution_report"
] as const;

export type JobArtifactName = (typeof jobArtifactNames)[number];

export interface JobArtifactSummary {
  name: JobArtifactName;
  fileName: string;
  available: boolean;
}

export interface JobArtifactContent extends JobArtifactSummary {
  content?: unknown;
  error?: string;
}

function getArtifactPath(outputRoot: string, jobId: string, artifactName: JobArtifactName): string {
  return join(outputRoot, "jobs", jobId, artifactName + ".json");
}

function isJobArtifactName(value: string): value is JobArtifactName {
  return jobArtifactNames.includes(value as JobArtifactName);
}

async function readArtifact(outputRoot: string, jobId: string, artifactName: JobArtifactName): Promise<JobArtifactContent> {
  const fileName = artifactName + ".json";

  try {
    const raw = await readFile(getArtifactPath(outputRoot, jobId, artifactName), "utf8");
    return {
      name: artifactName,
      fileName,
      available: true,
      content: JSON.parse(raw)
    };
  } catch (error) {
    return {
      name: artifactName,
      fileName,
      available: false,
      error: error instanceof Error ? error.message : "Artifact is not available."
    };
  }
}

export async function listJobArtifacts(outputRoot: string, jobId: string): Promise<JobArtifactSummary[]> {
  const artifacts = await Promise.all(jobArtifactNames.map((artifactName) => readArtifact(outputRoot, jobId, artifactName)));

  return artifacts.map((artifact) => ({
    name: artifact.name,
    fileName: artifact.fileName,
    available: artifact.available
  }));
}

export async function getJobArtifact(
  outputRoot: string,
  jobId: string,
  artifactName: string
): Promise<JobArtifactContent | null> {
  if (!isJobArtifactName(artifactName)) return null;
  return readArtifact(outputRoot, jobId, artifactName);
}
