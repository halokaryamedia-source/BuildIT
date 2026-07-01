export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";
export type JobStage =
  | "queued"
  | "saving_references"
  | "analyzing_image"
  | "planning_model"
  | "validating_plan"
  | "building_mcp_actions"
  | "checking_mcp_capabilities"
  | "executing_mcp"
  | "completed"
  | "failed";

export interface ReferenceImage {
  fileName: string;
  mimeType: string;
  path: string;
  sizeBytes: number;
}

export interface ModelJobInput {
  prompt: string;
  imagePaths: string[];
  referenceImages: ReferenceImage[];
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
  stage: JobStage;
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
    stage: "queued",
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

export function setJobStage(job: ModelJob, stage: JobStage): ModelJob {
  return appendJobLog({ ...job, stage }, "Stage changed to " + stage + ".");
}

export function setJobStatus(job: ModelJob, status: JobStatus): ModelJob {
  const nextStage: JobStage = status === "completed" ? "completed" : status === "failed" ? "failed" : job.stage;
  return appendJobLog({ ...job, status, stage: nextStage }, "Status changed to " + status + ".");
}
