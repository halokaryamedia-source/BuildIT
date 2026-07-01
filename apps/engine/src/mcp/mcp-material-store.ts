import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpMaterialPlanReport } from "./mcp-material-planner.js";

export async function saveMcpMaterialPlanReport(
  jobId: string,
  report: McpMaterialPlanReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_material_plan.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
