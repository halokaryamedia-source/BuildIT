import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpGeometryReport } from "./mcp-geometry-planner.js";

export async function saveMcpGeometryReport(
  jobId: string,
  report: McpGeometryReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_geometry_plan.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
