import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpToolCall } from "./blockbench-client.js";

export interface McpExecutionStep {
  toolName: string;
  startedAt: string;
  finishedAt: string;
  success: boolean;
  error?: string;
}

export interface McpExecutionReport {
  startedAt: string;
  finishedAt: string;
  success: boolean;
  actionCount: number;
  steps: McpExecutionStep[];
}

export async function saveMcpActions(jobId: string, actions: McpToolCall[], outputRoot: string): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const actionsPath = join(jobDir, "mcp_actions.json");
  await writeFile(
    actionsPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        actionCount: actions.length,
        actions
      },
      null,
      2
    )
  );

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
