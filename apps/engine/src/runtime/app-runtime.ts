import { appendJobLog, createJob, setJobStatus, type ModelJob, type ModelJobInput } from "../domain/job.js";
import { JobStore } from "../jobs/job-store.js";
import { saveJobSnapshot } from "../jobs/job-snapshot-store.js";
import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";
import { OllamaProvider } from "../providers/ollama.js";
import { saveReferenceImages, type ReferenceImageUpload } from "../storage/reference-images.js";
import { SyncManager } from "../sync/sync-manager.js";
import { runCreateModelWorkflow } from "../workflows/create-model.js";

export interface AppRuntimeOptions {
  ollamaUrl: string;
  ollamaModel: string;
  visionModel: string;
  blockbenchMcpUrl: string;
  outputDir: string;
}

export class AppRuntime {
  readonly jobs = new JobStore();
  readonly ollama: OllamaProvider;
  readonly vision: OllamaProvider;
  readonly blockbench: BlockbenchMcpClient;
  readonly sync: SyncManager;

  constructor(private readonly options: AppRuntimeOptions) {
    this.ollama = new OllamaProvider({ baseUrl: options.ollamaUrl, model: options.ollamaModel });
    this.vision = new OllamaProvider({ baseUrl: options.ollamaUrl, model: options.visionModel });
    this.blockbench = new BlockbenchMcpClient({ endpoint: options.blockbenchMcpUrl });
    this.sync = new SyncManager(this.blockbench, options.blockbenchMcpUrl);
  }

  private async persistJob(job: ModelJob): Promise<void> {
    this.jobs.save(job);
    await saveJobSnapshot(job, this.options.outputDir);
  }

  async createModelJob(input: ModelJobInput, referenceUploads: ReferenceImageUpload[] = []) {
    let job = createJob(input);

    const savedReferences = await saveReferenceImages(job.id, referenceUploads, this.options.outputDir);

    job = appendJobLog(
      {
        ...job,
        input: {
          ...job.input,
          imagePaths: savedReferences.map((image) => image.path),
          referenceImages: savedReferences
        }
      },
      savedReferences.length > 0
        ? "Saved " + savedReferences.length + " reference image file(s)."
        : "No reference image files were provided."
    );

    await this.persistJob(job);
    void this.runJob(job.id);

    return job;
  }

  async runJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    try {
      const result = await runCreateModelWorkflow(job, {
        ollama: this.ollama,
        vision: this.vision,
        blockbench: this.blockbench,
        outputDir: this.options.outputDir,
        onProgress: async (progressJob) => {
          await this.persistJob(progressJob);
        }
      });
      await this.persistJob(result);
    } catch (error) {
      const failedJob = {
        ...setJobStatus(job, "failed"),
        error: error instanceof Error ? error.message : "Unknown job failure."
      };
      await this.persistJob(failedJob);
    }
  }

  getOptions(): AppRuntimeOptions {
    return this.options;
  }
}
