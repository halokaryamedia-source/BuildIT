export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface ModelJobInput {
  prompt: string;
  imagePaths: string[];
  format: string;
  autoReview: boolean;
}

export interface ModelJobLog {
  at: string;
  message: string;
}

export interface ModelJob {
  id: string;
  status: JobStatus;
  input: ModelJobInput;
  createdAt: string;
  updatedAt: string;
  logs: ModelJobLog[];
  error?: string;
}

export function createJob(input: ModelJobInput): ModelJob {
  const now = new Date().toISOString();
  return {
    id: "job_" + Date.now(),
    status: "queued",
    input,
    createdAt: now,
    updatedAt: now,
    logs: [{ at: now, message: "Job created." }]
  };
}

export function appendJobLog(job: ModelJob, message: string): ModelJob {
  const now = new Date().toISOString();
  return {
    ...job,
    updatedAt: now,
    logs: [...job.logs, { at: now, message }]
  };
}

export function setJobStatus(job: ModelJob, status: JobStatus): ModelJob {
  return appendJobLog({ ...job, status }, "Status changed to " + status + ".");
}
