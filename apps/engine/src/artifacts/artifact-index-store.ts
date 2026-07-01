import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { jobArtifactNames, type JobArtifactName, type JobArtifactSummary } from "./job-artifacts.js";

export interface ArtifactIndex {
  jobId: string;
  generatedAt: string;
  artifactCount: number;
  availableCount: number;
  artifacts: JobArtifactSummary[];
}

async function inspectArtifact(outputRoot: string, jobId: string, artifactName: JobArtifactName): Promise<JobArtifactSummary> {
  const fileName = artifactName + ".json";
  const artifactPath = join(outputRoot, "jobs", jobId, fileName);

  try {
    const metadata = await stat(artifactPath);
    return {
      name: artifactName,
      fileName,
      available: true,
      sizeBytes: metadata.size,
      updatedAt: metadata.mtime.toISOString()
    };
  } catch {
    return {
      name: artifactName,
      fileName,
      available: false
    };
  }
}

export async function buildArtifactIndex(outputRoot: string, jobId: string): Promise<ArtifactIndex> {
  const artifacts = await Promise.all(jobArtifactNames.map((artifactName) => inspectArtifact(outputRoot, jobId, artifactName)));
  const availableCount = artifacts.filter((artifact) => artifact.available).length;

  return {
    jobId,
    generatedAt: new Date().toISOString(),
    artifactCount: artifacts.length,
    availableCount,
    artifacts
  };
}

export async function saveArtifactIndex(outputRoot: string, jobId: string): Promise<ArtifactIndex> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const report = await buildArtifactIndex(outputRoot, jobId);
  const reportPath = join(jobDir, "artifact_index.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return {
    ...report,
    artifacts: report.artifacts.map((artifact) =>
      artifact.name === "artifact_index"
        ? {
            ...artifact,
            available: true,
            updatedAt: report.generatedAt
          }
        : artifact
    ),
    availableCount: report.artifacts.some((artifact) => artifact.name === "artifact_index" && artifact.available)
      ? report.availableCount
      : report.availableCount + 1
  };
}
