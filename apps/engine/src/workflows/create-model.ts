import { appendJobLog, setJobStatus, type ModelJob } from "../domain/job.js";
import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";
import { OllamaProvider } from "../providers/ollama.js";
import { createFallbackPlan } from "../planning/model-plan.js";
import { modelPlanToToolActions } from "../planning/tool-actions.js";
import { saveImageAnalysis } from "../vision/image-analysis-store.js";
import { analyzeReferenceImages } from "../vision/reference-image-analyzer.js";

export interface CreateModelWorkflowOptions {
  ollama: OllamaProvider;
  vision: OllamaProvider;
  blockbench: BlockbenchMcpClient;
  outputDir: string;
}

export async function runCreateModelWorkflow(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  let currentJob = setJobStatus(job, "running");

  if (currentJob.input.imagePaths.length > 0) {
    currentJob = appendJobLog(currentJob, "Analyzing reference image input.");
    const analysis = await analyzeReferenceImages(currentJob, options.vision);
    const analysisPath = await saveImageAnalysis(currentJob.id, analysis, options.outputDir);
    currentJob = appendJobLog(currentJob, "Reference image analysis saved to " + analysisPath + ".");
  } else {
    currentJob = appendJobLog(currentJob, "Skipping vision analysis because no reference image was provided.");
  }

  const isReady = await options.blockbench.health();
  if (!isReady) {
    return { ...setJobStatus(currentJob, "failed"), error: "Blockbench MCP is not connected." };
  }

  currentJob = appendJobLog(currentJob, "Blockbench MCP connected.");

  const plan = createFallbackPlan(job.input.prompt);
  const actions = modelPlanToToolActions(plan);

  for (const action of actions) {
    currentJob = appendJobLog(currentJob, "Running MCP tool: " + action.name);
    await options.blockbench.callTool(action);
  }

  currentJob = setJobStatus(currentJob, "completed");
  return appendJobLog(currentJob, "Model generation completed.");
}
