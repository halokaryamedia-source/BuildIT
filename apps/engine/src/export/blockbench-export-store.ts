import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface BlockbenchExportReport {
  exportedAt: string;
  toolName: string;
  format: string;
  exportPath?: string;
  rawResult: unknown;
}

function findExportPath(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.length > 0 && !value.startsWith("data:") ? value : undefined;
  }

  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of ["path", "filePath", "exportPath", "outputPath"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }

  for (const candidate of Object.values(record)) {
    const found = findExportPath(candidate);
    if (found) return found;
  }

  return undefined;
}

export async function saveBlockbenchExport(
  jobId: string,
  toolName: string,
  format: string,
  rawResult: unknown,
  outputRoot: string
): Promise<string> {
  const jobDir = join(outputRoot, "jobs", jobId);
  await mkdir(jobDir, { recursive: true });

  const reportPath = join(jobDir, "blockbench_export.json");
  const report: BlockbenchExportReport = {
    exportedAt: new Date().toISOString(),
    toolName,
    format,
    exportPath: findExportPath(rawResult),
    rawResult
  };

  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
