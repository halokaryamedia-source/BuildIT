import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpArgumentShapeAdaptationReport } from "./mcp-argument-shape-adapter.js";

export async function saveMcpArgumentShapeAdaptationReport(
  jobId: string,
  report: McpArgumentShapeAdaptationReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_argument_shape_adaptation.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
