import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpToolNameMappingReport } from "./mcp-tool-name-mapping.js";

export async function saveMcpToolNameMappingReport(
  jobId: string,
  report: McpToolNameMappingReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_tool_name_mapping.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
