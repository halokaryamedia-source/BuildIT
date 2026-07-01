import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ModelJob } from "../domain/job.js";

export async function saveJobSnapshot(job: ModelJob, outputRoot: string): Promise<string> {
  const jobDir = join(outputRoot, "jobs", job.id);
  await mkdir(jobDir, { recursive: true });

  const snapshotPath = join(jobDir, "job_snapshot.json");
  await writeFile(snapshotPath, JSON.stringify(job, null, 2));

  return snapshotPath;
}
