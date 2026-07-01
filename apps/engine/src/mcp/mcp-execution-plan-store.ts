import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpExecutionPlanReport } from "./mcp-execution-plan.js";

export async function saveMcpExecutionPlanReport(
  jobId: string,
  report: McpExecutionPlanReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_execution_plan.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
