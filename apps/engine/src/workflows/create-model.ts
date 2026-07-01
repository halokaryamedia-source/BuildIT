import { appendJobLog, setJobStatus, type ModelJob } from "../domain/job.js";
import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";
import { generateModelPlan } from "../planning/model-plan-generator.js";
import { saveModelPlan } from "../planning/model-plan-store.js";
import { modelPlanToToolActions } from "../planning/tool-actions.js";
import { OllamaProvider } from "../providers/ollama.js";
import { saveImageAnalysis } from "../vision/image-analysis-store.js";
import type { ImageAnalysis } from "../vision/image-analysis.js";
import { analyzeReferenceImages } from "../vision/reference-image-analyzer.js";

export interface CreateModelWorkflowOptions {
  ollama: OllamaProvider;
  vision: OllamaProvider;
  blockbench: BlockbenchMcpClient;
  outputDir: string;
}

export async function runCreateModelWorkflow(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  let currentJob = setJobStatus(job, "running");
  let imageAnalysis: ImageAnalysis | null = null;

  if (currentJob.input.imagePaths.length > 0) {
    currentJob = appendJobLog(currentJob, "Analyzing reference image input.");
    imageAnalysis = await analyzeReferenceImages(currentJob, options.vision);
    const analysisPath = await saveImageAnalysis(currentJob.id, imageAnalysis, options.outputDir);
    currentJob = appendJobLog(currentJob, "Reference image analysis saved to " + analysisPath + ".");
  } else {
    currentJob = appendJobLog(currentJob, "Skipping vision analysis because no reference image was provided.");
  }

  currentJob = appendJobLog(currentJob, "Generating typed model plan for format " + currentJob.input.format + ".");
  const plan = await generateModelPlan(currentJob, imageAnalysis, options.ollama);
  const planPath = await saveModelPlan(currentJob.id, plan, options.outputDir);
  currentJob = appendJobLog(currentJob, "Model plan saved to " + planPath + ".");

  const isReady = await options.blockbench.health();
  if (!isReady) {
    return { ...setJobStatus(currentJob, "failed"), error: "Blockbench MCP is not connected." };
  }

  currentJob = appendJobLog(currentJob, "Blockbench MCP connected.");

  const actions = modelPlanToToolActions(plan);

  for (const action of actions) {
    currentJob = appendJobLog(currentJob, "Running MCP tool: " + action.name);
    await options.blockbench.callTool(action);
  }

  currentJob = setJobStatus(currentJob, "completed");
  return appendJobLog(currentJob, "Model generation completed.");
}
