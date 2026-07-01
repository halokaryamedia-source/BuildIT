import { createJob, setJobStatus, type ModelJobInput } from "../domain/job.js";
import { JobStore } from "../jobs/job-store.js";
import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";
import { OllamaProvider } from "../providers/ollama.js";
import { SyncManager } from "../sync/sync-manager.js";
import { runCreateModelWorkflow } from "../workflows/create-model.js";

export interface AppRuntimeOptions {
  ollamaUrl: string;
  ollamaModel: string;
  blockbenchMcpUrl: string;
}

export class AppRuntime {
  readonly jobs = new JobStore();
  readonly ollama: OllamaProvider;
  readonly blockbench: BlockbenchMcpClient;
  readonly sync: SyncManager;

  constructor(private readonly options: AppRuntimeOptions) {
    this.ollama = new OllamaProvider({ baseUrl: options.ollamaUrl, model: options.ollamaModel });
    this.blockbench = new BlockbenchMcpClient({ endpoint: options.blockbenchMcpUrl });
    this.sync = new SyncManager(this.blockbench, options.blockbenchMcpUrl);
  }

  createModelJob(input: ModelJobInput) {
    const job = this.jobs.save(createJob(input));

    void this.runJob(job.id);

    return job;
  }

  async runJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      const result = await runCreateModelWorkflow(job, {
        ollama: this.ollama,
        blockbench: this.blockbench
      });
      this.jobs.save(result);
    } catch (error) {
      const failedJob = {
        ...setJobStatus(job, "failed"),
        error: error instanceof Error ? error.message : "Unknown job failure."
      };
      this.jobs.save(failedJob);
    }
  }

  getOptions(): AppRuntimeOptions {
    return this.options;
  }
}
