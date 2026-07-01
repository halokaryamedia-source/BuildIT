import { appendJobLog, setJobStage, setJobStatus, type JobStage, type ModelJob } from "../domain/job.js";
import { saveBlockbenchExport } from "../export/blockbench-export-store.js";
import { BlockbenchMcpClient, type McpToolDefinition } from "../mcp/blockbench-client.js";
import { buildBlockbenchToolActions, optionalBlockbenchToolNames } from "../mcp/blockbench-tool-adapter.js";
import { saveMcpActions, saveMcpExecutionReport, type McpExecutionStep } from "../mcp/mcp-action-store.js";
import { createFailedMcpCapabilityReport, evaluateMcpCapabilities } from "../mcp/mcp-capabilities.js";
import { saveMcpCapabilityReport } from "../mcp/mcp-capability-store.js";
import { saveMcpToolSchemaReport } from "../mcp/mcp-tool-schema-store.js";
import { generateModelPlan } from "../planning/model-plan-generator.js";
import { saveModelPlan } from "../planning/model-plan-store.js";
import { saveModelPlanValidation } from "../planning/model-plan-validation-store.js";
import { validateModelPlan } from "../planning/model-plan-validation.js";
import { saveBlockbenchPreview } from "../preview/blockbench-preview-store.js";
import { OllamaProvider } from "../providers/ollama.js";
import { saveImageAnalysis } from "../vision/image-analysis-store.js";
import type { ImageAnalysis } from "../vision/image-analysis.js";
import { analyzeReferenceImages } from "../vision/reference-image-analyzer.js";

export interface CreateModelWorkflowOptions {
  ollama: OllamaProvider;
  vision: OllamaProvider;
  blockbench: BlockbenchMcpClient;
  outputDir: string;
  onProgress?: (job: ModelJob) => void | Promise<void>;
}

async function reportProgress(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  await options.onProgress?.(job);
  return job;
}

async function enterStage(
  job: ModelJob,
  stage: JobStage,
  options: CreateModelWorkflowOptions
): Promise<ModelJob> {
  return reportProgress(setJobStage(job, stage), options);
}

export async function runCreateModelWorkflow(job: ModelJob, options: CreateModelWorkflowOptions): Promise<ModelJob> {
  let currentJob = await reportProgress(setJobStatus(job, "running"), options);
  let imageAnalysis: ImageAnalysis | null = null;

  currentJob = await enterStage(currentJob, "analyzing_image", options);
  if (currentJob.input.imagePaths.length > 0) {
    currentJob = await reportProgress(appendJobLog(currentJob, "Analyzing reference image input."), options);
    imageAnalysis = await analyzeReferenceImages(currentJob, options.vision);
    const analysisPath = await saveImageAnalysis(currentJob.id, imageAnalysis, options.outputDir);
    currentJob = await reportProgress(appendJobLog(currentJob, "Reference image analysis saved to " + analysisPath + "."), options);
  } else {
    currentJob = await reportProgress(
      appendJobLog(currentJob, "Skipping vision analysis because no reference image was provided."),
      options
    );
  }

  currentJob = await enterStage(currentJob, "planning_model", options);
  currentJob = await reportProgress(
    appendJobLog(currentJob, "Generating typed model plan for format " + currentJob.input.format + "."),
    options
  );
  const plan = await generateModelPlan(currentJob, imageAnalysis, options.ollama);
  const planPath = await saveModelPlan(currentJob.id, plan, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "Model plan saved to " + planPath + "."), options);

  currentJob = await enterStage(currentJob, "validating_plan", options);
  const validationReport = validateModelPlan(plan);
  const validationPath = await saveModelPlanValidation(currentJob.id, validationReport, options.outputDir);
  currentJob = await reportProgress(
    appendJobLog(currentJob, "Model plan validation saved to " + validationPath + "."),
    options
  );

  if (!validationReport.valid) {
    return reportProgress(
      {
        ...setJobStatus(currentJob, "failed"),
        error: "Model plan validation failed. Review model_plan_validation.json for details."
      },
      options
    );
  }

  if (validationReport.issues.length > 0) {
    currentJob = await reportProgress(
      appendJobLog(
        currentJob,
        "Model plan validation completed with " + validationReport.issues.length + " warning(s)."
      ),
      options
    );
  } else {
    currentJob = await reportProgress(appendJobLog(currentJob, "Model plan validation completed with no issues."), options);
  }

  currentJob = await enterStage(currentJob, "building_mcp_actions", options);
  const adapterResult = buildBlockbenchToolActions(plan);
  const actionsPath = await saveMcpActions(
    currentJob.id,
    {
      createdAt: new Date().toISOString(),
      valid: adapterResult.valid,
      format: adapterResult.format,
      actionCount: adapterResult.actions.length,
      issues: adapterResult.issues,
      actions: adapterResult.actions
    },
    options.outputDir
  );
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP action list saved to " + actionsPath + "."), options);

  if (!adapterResult.valid) {
    return reportProgress(
      {
        ...setJobStatus(currentJob, "failed"),
        error: "MCP tool adapter validation failed. Review mcp_actions.json for details."
      },
      options
    );
  }

  if (adapterResult.issues.length > 0) {
    currentJob = await reportProgress(
      appendJobLog(currentJob, "MCP tool adapter completed with " + adapterResult.issues.length + " warning(s)."),
      options
    );
  } else {
    currentJob = await reportProgress(appendJobLog(currentJob, "MCP tool adapter completed with no issues."), options);
  }

  currentJob = await enterStage(currentJob, "checking_mcp_capabilities", options);
  const isReady = await options.blockbench.health();
  if (!isReady) {
    return reportProgress(
      { ...setJobStatus(currentJob, "failed"), error: "Blockbench MCP is not connected." },
      options
    );
  }

  currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench MCP connected."), options);

  let availableTools: McpToolDefinition[] = [];
  let capabilityReport;
  try {
    availableTools = await options.blockbench.listTools();
    const schemaPath = await saveMcpToolSchemaReport(currentJob.id, availableTools, options.outputDir);
    currentJob = await reportProgress(appendJobLog(currentJob, "MCP tool schema saved to " + schemaPath + "."), options);
    capabilityReport = evaluateMcpCapabilities(availableTools);
  } catch (error) {
    capabilityReport = createFailedMcpCapabilityReport(error);
  }

  const capabilityPath = await saveMcpCapabilityReport(currentJob.id, capabilityReport, options.outputDir);
  currentJob = await reportProgress(appendJobLog(currentJob, "MCP capability report saved to " + capabilityPath + "."), options);

  if (!capabilityReport.valid) {
    return reportProgress(
      {
        ...setJobStatus(currentJob, "failed"),
        error: "Blockbench MCP required tools are missing. Review mcp_capabilities.json for details."
      },
      options
    );
  }

  currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench MCP capability check passed."), options);

  const missingOptionalToolSet = new Set(capabilityReport.missingOptionalTools ?? []);
  const optionalToolSet = new Set<string>(optionalBlockbenchToolNames);

  currentJob = await enterStage(currentJob, "executing_mcp", options);
  const executionStartedAt = new Date().toISOString();
  const steps: McpExecutionStep[] = [];

  for (const action of adapterResult.actions) {
    const startedAt = new Date().toISOString();

    if (optionalToolSet.has(action.name) && missingOptionalToolSet.has(action.name)) {
      steps.push({
        toolName: action.name,
        startedAt,
        finishedAt: new Date().toISOString(),
        success: true,
        skipped: true
      });
      currentJob = await reportProgress(
        appendJobLog(currentJob, "Skipping optional MCP tool: " + action.name + "."),
        options
      );
      continue;
    }

    if (action.name === "capture_screenshot") {
      currentJob = await enterStage(currentJob, "capturing_preview", options);
    }

    if (action.name === "export_project") {
      currentJob = await enterStage(currentJob, "exporting_model", options);
    }

    currentJob = await reportProgress(appendJobLog(currentJob, "Running MCP tool: " + action.name), options);

    try {
      const toolResult = await options.blockbench.callTool(action);

      if (action.name === "capture_screenshot") {
        const previewPath = await saveBlockbenchPreview(currentJob.id, action.name, toolResult, options.outputDir);
        currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench preview saved to " + previewPath + "."), options);
      }

      if (action.name === "export_project") {
        const exportPath = await saveBlockbenchExport(
          currentJob.id,
          action.name,
          adapterResult.format,
          toolResult,
          options.outputDir
        );
        currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench export saved to " + exportPath + "."), options);
      }

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
          actionCount: adapterResult.actions.length,
          steps
        },
        options.outputDir
      );

      return reportProgress(
        {
          ...setJobStatus(currentJob, "failed"),
          error: "MCP execution failed. Review " + reportPath + " for details."
        },
        options
      );
    }
  }

  const reportPath = await saveMcpExecutionReport(
    currentJob.id,
    {
      startedAt: executionStartedAt,
      finishedAt: new Date().toISOString(),
      success: true,
      actionCount: adapterResult.actions.length,
      steps
    },
    options.outputDir
  );

  currentJob = await reportProgress(appendJobLog(currentJob, "MCP execution report saved to " + reportPath + "."), options);
  currentJob = await reportProgress(setJobStatus(currentJob, "completed"), options);
  return reportProgress(appendJobLog(currentJob, "Model generation completed."), options);
}
