import { appendJobLog, setJobStage, setJobStatus, type JobStage, type ModelJob } from "../domain/job.js";
import { saveBlockbenchExport } from "../export/blockbench-export-store.js";
import type { BlockbenchMcpClient, McpToolCall } from "../mcp/blockbench-client.js";
import { optionalBlockbenchToolNames, type SupportedBlockbenchFormat } from "../mcp/blockbench-tool-adapter.js";
import type { McpSkippedAction } from "../mcp/mcp-action-availability.js";
import { saveMcpExecutionReport, type McpExecutionStep } from "../mcp/mcp-action-store.js";
import {
  getCanonicalToolNameForResolvedName,
  type CanonicalMcpToolName,
  type McpToolNameMappingReport
} from "../mcp/mcp-tool-name-mapping.js";
import { validateMcpToolResult } from "../mcp/mcp-tool-result-validation.js";
import { saveBlockbenchPreview } from "../preview/blockbench-preview-store.js";

export interface McpExecutionRunnerOptions {
  blockbench: BlockbenchMcpClient;
  outputDir: string;
  adapterFormat: SupportedBlockbenchFormat;
  toolNameMappingReport: McpToolNameMappingReport;
  missingOptionalTools: string[];
  skippedActions?: McpSkippedAction[];
  onProgress?: (job: ModelJob) => void | Promise<void>;
}

async function reportProgress(job: ModelJob, options: McpExecutionRunnerOptions): Promise<ModelJob> {
  await options.onProgress?.(job);
  return job;
}

async function enterStage(job: ModelJob, stage: JobStage, options: McpExecutionRunnerOptions): Promise<ModelJob> {
  return reportProgress(setJobStage(job, stage), options);
}

function getRequiredFailureCount(steps: McpExecutionStep[]): number {
  return steps.filter((step) => !step.success && !step.optional).length;
}

function getOptionalFailureCount(steps: McpExecutionStep[]): number {
  return steps.filter((step) => !step.success && step.optional).length;
}

function getResultValidationFailureCount(steps: McpExecutionStep[]): number {
  return steps.filter((step) => step.resultValidation && !step.resultValidation.valid).length;
}

function getTotalActionCount(executionActions: McpToolCall[], options: McpExecutionRunnerOptions): number {
  return executionActions.length + (options.skippedActions?.length ?? 0);
}

async function failJob(currentJob: ModelJob, message: string, options: McpExecutionRunnerOptions): Promise<ModelJob> {
  return reportProgress(
    {
      ...setJobStatus(currentJob, "failed"),
      error: message
    },
    options
  );
}

async function saveExecutionReport(
  job: ModelJob,
  executionStartedAt: string,
  actionCount: number,
  steps: McpExecutionStep[],
  success: boolean,
  options: McpExecutionRunnerOptions
): Promise<string> {
  return saveMcpExecutionReport(
    job.id,
    {
      startedAt: executionStartedAt,
      finishedAt: new Date().toISOString(),
      success,
      actionCount,
      requiredFailureCount: getRequiredFailureCount(steps),
      optionalFailureCount: getOptionalFailureCount(steps),
      resultValidationFailureCount: getResultValidationFailureCount(steps),
      steps
    },
    options.outputDir
  );
}

async function recordSkippedActions(
  currentJob: ModelJob,
  steps: McpExecutionStep[],
  options: McpExecutionRunnerOptions
): Promise<ModelJob> {
  let nextJob = currentJob;

  for (const skippedAction of options.skippedActions ?? []) {
    const startedAt = new Date().toISOString();
    steps.push({
      toolName: skippedAction.action.name,
      canonicalToolName: skippedAction.canonicalToolName,
      startedAt,
      finishedAt: new Date().toISOString(),
      success: true,
      optional: true,
      skipped: true
    });

    nextJob = await reportProgress(
      appendJobLog(nextJob, "Skipping optional MCP tool before schema matching: " + skippedAction.canonicalToolName + "."),
      options
    );
  }

  return nextJob;
}

export async function runMcpExecution(
  job: ModelJob,
  executionActions: McpToolCall[],
  options: McpExecutionRunnerOptions
): Promise<ModelJob> {
  const missingOptionalToolSet = new Set<string>(options.missingOptionalTools);
  const optionalToolSet = new Set<string>([...optionalBlockbenchToolNames]);
  let currentJob = await enterStage(job, "executing_mcp", options);
  const executionStartedAt = new Date().toISOString();
  const steps: McpExecutionStep[] = [];
  const actionCount = getTotalActionCount(executionActions, options);

  currentJob = await recordSkippedActions(currentJob, steps, options);

  for (const action of executionActions) {
    const startedAt = new Date().toISOString();
    const canonicalToolName =
      getCanonicalToolNameForResolvedName(action.name, options.toolNameMappingReport) ?? (action.name as CanonicalMcpToolName);
    const isOptionalTool = optionalToolSet.has(canonicalToolName);

    if (isOptionalTool && missingOptionalToolSet.has(canonicalToolName)) {
      steps.push({
        toolName: action.name,
        canonicalToolName,
        startedAt,
        finishedAt: new Date().toISOString(),
        success: true,
        optional: true,
        skipped: true
      });
      currentJob = await reportProgress(appendJobLog(currentJob, "Skipping optional MCP tool: " + canonicalToolName + "."), options);
      continue;
    }

    if (canonicalToolName === "capture_screenshot") currentJob = await enterStage(currentJob, "capturing_preview", options);
    if (canonicalToolName === "export_project") currentJob = await enterStage(currentJob, "exporting_model", options);

    currentJob = await reportProgress(appendJobLog(currentJob, "Running MCP tool: " + canonicalToolName + " as " + action.name), options);

    try {
      const toolResult = await options.blockbench.callTool(action);
      const resultValidation = validateMcpToolResult(canonicalToolName, action.name, toolResult);
      const outputArtifacts: string[] = [];

      if (!resultValidation.valid) {
        steps.push({
          toolName: action.name,
          canonicalToolName,
          startedAt,
          finishedAt: new Date().toISOString(),
          success: false,
          optional: isOptionalTool,
          nonFatal: isOptionalTool,
          resultSummary: resultValidation.summary,
          resultValidation,
          error: "MCP result validation failed."
        });

        if (isOptionalTool) {
          currentJob = await reportProgress(
            appendJobLog(currentJob, "Optional MCP result validation failed but job will continue: " + canonicalToolName + "."),
            options
          );
          continue;
        }

        const reportPath = await saveExecutionReport(currentJob, executionStartedAt, actionCount, steps, false, options);
        return failJob(currentJob, "MCP result validation failed. Review " + reportPath + " for details.", options);
      }

      if (canonicalToolName === "capture_screenshot") {
        const previewPath = await saveBlockbenchPreview(currentJob.id, action.name, toolResult, options.outputDir);
        outputArtifacts.push("blockbench_preview");
        currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench preview saved to " + previewPath + "."), options);
      }

      if (canonicalToolName === "export_project") {
        const exportPath = await saveBlockbenchExport(currentJob.id, action.name, options.adapterFormat, toolResult, options.outputDir);
        outputArtifacts.push("blockbench_export");
        currentJob = await reportProgress(appendJobLog(currentJob, "Blockbench export saved to " + exportPath + "."), options);
      }

      steps.push({
        toolName: action.name,
        canonicalToolName,
        startedAt,
        finishedAt: new Date().toISOString(),
        success: true,
        optional: isOptionalTool,
        resultSummary: resultValidation.summary,
        resultValidation,
        outputArtifacts
      });
    } catch (error) {
      steps.push({
        toolName: action.name,
        canonicalToolName,
        startedAt,
        finishedAt: new Date().toISOString(),
        success: false,
        optional: isOptionalTool,
        nonFatal: isOptionalTool,
        error: error instanceof Error ? error.message : "Unknown MCP tool error."
      });

      if (isOptionalTool) {
        currentJob = await reportProgress(
          appendJobLog(currentJob, "Optional MCP tool failed but job will continue: " + canonicalToolName + "."),
          options
        );
        continue;
      }

      const reportPath = await saveExecutionReport(currentJob, executionStartedAt, actionCount, steps, false, options);
      return failJob(currentJob, "MCP execution failed. Review " + reportPath + " for details.", options);
    }
  }

  const reportPath = await saveExecutionReport(
    currentJob,
    executionStartedAt,
    actionCount,
    steps,
    getRequiredFailureCount(steps) === 0,
    options
  );

  currentJob = await reportProgress(appendJobLog(currentJob, "MCP execution report saved to " + reportPath + "."), options);
  currentJob = await reportProgress(setJobStatus(currentJob, "completed"), options);
  return reportProgress(appendJobLog(currentJob, "Model generation completed."), options);
}
