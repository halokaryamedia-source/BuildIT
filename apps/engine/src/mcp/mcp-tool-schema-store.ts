import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { McpToolDefinition } from "./blockbench-client.js";

export interface McpToolSchemaReport {
  capturedAt: string;
  toolCount: number;
  tools: McpToolDefinition[];
}

export async function saveMcpToolSchemaReport(
  jobId: string,
  tools: McpToolDefinition[],
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const report: McpToolSchemaReport = {
    capturedAt: new Date().toISOString(),
    toolCount: tools.length,
    tools
  };

  const reportPath = join(jobDir, "mcp_tool_schema.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
