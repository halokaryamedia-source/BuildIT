import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpCapabilityReport } from "./mcp-capabilities.js";

export async function saveMcpCapabilityReport(
  jobId: string,
  report: McpCapabilityReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_capabilities.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
