import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpToolCall } from "./blockbench-client.js";
import type { ToolAdapterIssue } from "./blockbench-tool-adapter.js";
import type { McpToolResultSummary } from "./mcp-tool-result-summary.js";
import type { McpToolResultValidationReport } from "./mcp-tool-result-validation.js";

export interface McpActionBuildReport {
  createdAt: string;
  valid: boolean;
  format: string;
  actionCount: number;
  issues: ToolAdapterIssue[];
  actions: McpToolCall[];
}

export interface McpExecutionStep {
  toolName: string;
  canonicalToolName?: string;
  startedAt: string;
  finishedAt: string;
  success: boolean;
  skipped?: boolean;
  optional?: boolean;
  nonFatal?: boolean;
  resultSummary?: McpToolResultSummary;
  resultValidation?: McpToolResultValidationReport;
  outputArtifacts?: string[];
  error?: string;
}

export interface McpExecutionReport {
  startedAt: string;
  finishedAt: string;
  success: boolean;
  actionCount: number;
  requiredFailureCount?: number;
  optionalFailureCount?: number;
  resultValidationFailureCount?: number;
  steps: McpExecutionStep[];
}

export async function saveMcpActions(jobId: string, report: McpActionBuildReport, outputRoot: string): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const actionsPath = join(jobDir, "mcp_actions.json");
  await writeFile(actionsPath, JSON.stringify(report, null, 2));

  return actionsPath;
}

export async function saveMcpExecutionReport(
  jobId: string,
  report: McpExecutionReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_execution_report.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
