import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpActionSchemaMatchReport } from "./mcp-action-schema-matcher.js";

export async function saveMcpActionSchemaMatchReport(
  jobId: string,
  report: McpActionSchemaMatchReport,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "mcp_action_schema_match.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
