import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ModelJob } from "../domain/job.js";

function isSafeJobId(jobId: string): boolean {
  return /^job_[a-zA-Z0-9_-]+$/.test(jobId);
}

function isModelJob(value: unknown): value is ModelJob {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ModelJob>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.stage === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    Array.isArray(candidate.logs)
  );
}

async function readJobSnapshot(outputRoot: string, jobId: string): Promise<ModelJob | null> {
  if (!isSafeJobId(jobId)) return null;

  try {
    const snapshotPath = join(outputRoot, "jobs", jobId, "job_snapshot.json");
    const raw = await readFile(snapshotPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return isModelJob(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function listPersistedJobs(outputRoot: string): Promise<ModelJob[]> {
  try {
    const jobsRoot = join(outputRoot, "jobs");
    const entries = await readdir(jobsRoot, { withFileTypes: true });
    const snapshots = await Promise.all(
      entries.filter((entry) => entry.isDirectory()).map((entry) => readJobSnapshot(outputRoot, entry.name))
    );

    return snapshots
      .filter((snapshot): snapshot is ModelJob => Boolean(snapshot))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function mergeJobs(memoryJobs: ModelJob[], persistedJobs: ModelJob[]): ModelJob[] {
  const jobMap = new Map<string, ModelJob>();

  for (const job of persistedJobs) {
    jobMap.set(job.id, job);
  }

  for (const job of memoryJobs) {
    jobMap.set(job.id, job);
  }

  return Array.from(jobMap.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
