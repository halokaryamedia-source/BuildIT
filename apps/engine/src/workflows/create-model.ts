import { appendJobLog, setJobStatus, type ModelJob } from "../domain/job.js";
import { BlockbenchMcpClient } from "../mcp/blockbench-client.js";
import { saveMcpActions, saveMcpExecutionReport, type McpExecutionStep } from "../mcp/mcp-action-store.js";
import { generateModelPlan } from "../planning/model-plan-generator.js";
import { saveModelPlan } from "../planning/model-plan-store.js";
import { saveModelPlanValidation } from "../planning/model-plan-validation-store.js";
import { validateModelPlan } from "../planning/model-plan-validation.js";
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

  const validationReport = validateModelPlan(plan);
  const validationPath = await saveModelPlanValidation(currentJob.id, validationReport, options.outputDir);
  currentJob = appendJobLog(currentJob, "Model plan validation saved to " + validationPath + ".");

  if (!validationReport.valid) {
    return {
      ...setJobStatus(currentJob, "failed"),
      error: "Model plan validation failed. Review model_plan_validation.json for details."
    };
  }

  if (validationReport.issues.length > 0) {
    currentJob = appendJobLog(
      currentJob,
      "Model plan validation completed with " + validationReport.issues.length + " warning(s)."
    );
  } else {
    currentJob = appendJobLog(currentJob, "Model plan validation completed with no issues.");
  }

  const actions = modelPlanToToolActions(plan);
  const actionsPath = await saveMcpActions(currentJob.id, actions, options.outputDir);
  currentJob = appendJobLog(currentJob, "MCP action list saved to " + actionsPath + ".");

  const isReady = await options.blockbench.health();
  if (!isReady) {
    return { ...setJobStatus(currentJob, "failed"), error: "Blockbench MCP is not connected." };
  }

  currentJob = appendJobLog(currentJob, "Blockbench MCP connected.");

  const executionStartedAt = new Date().toISOString();
  const steps: McpExecutionStep[] = [];

  for (const action of actions) {
    const startedAt = new Date().toISOString();
    currentJob = appendJobLog(currentJob, "Running MCP tool: " + action.name);

    try {
      await options.blockbench.callTool(action);
      steps.push({
        toolName: action.name,
        startedAt,
        finishedAt: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      steps.push({
        toolName: action.name,
        startedAt,
        finishedAt: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown MCP tool error."
      });

      const reportPath = await saveMcpExecutionReport(
        currentJob.id,
        {
          startedAt: executionStartedAt,
          finishedAt: new Date().toISOString(),
          success: false,
          actionCount: actions.length,
          steps
        },
        options.outputDir
      );

      return {
        ...setJobStatus(currentJob, "failed"),
        error: "MCP execution failed. Review " + reportPath + " for details."
      };
    }
  }

  const reportPath = await saveMcpExecutionReport(
    currentJob.id,
    {
      startedAt: executionStartedAt,
      finishedAt: new Date().toISOString(),
      success: true,
      actionCount: actions.length,
      steps
    },
    options.outputDir
  );

  currentJob = appendJobLog(currentJob, "MCP execution report saved to " + reportPath + ".");
  currentJob = setJobStatus(currentJob, "completed");
  return appendJobLog(currentJob, "Model generation completed.");
}
