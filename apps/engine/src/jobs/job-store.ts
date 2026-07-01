import type { ModelJob } from "../domain/job.js";

export class JobStore {
  private readonly jobs = new Map<string, ModelJob>();

  save(job: ModelJob): ModelJob {
    this.jobs.set(job.id, job);
    return job;
  }

  get(jobId: string): ModelJob | undefined {
    return this.jobs.get(jobId);
  }

  list(): ModelJob[] {
    return Array.from(this.jobs.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
