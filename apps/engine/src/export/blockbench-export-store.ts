import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

export interface BlockbenchExportValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface BlockbenchExportValidationReport {
  valid: boolean;
  expectedFormat: string;
  exportPath?: string;
  exportExtension?: string;
  issues: BlockbenchExportValidationIssue[];
}

export interface BlockbenchExportReport {
  exportedAt: string;
  toolName: string;
  format: string;
  exportPath?: string;
  validation: BlockbenchExportValidationReport;
  rawResult: unknown;
}

function findExportPath(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.length > 0 && !value.startsWith("data:") ? value : undefined;
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const found = findExportPath(candidate);
      if (found) return found;
    }
  }

  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of ["path", "filePath", "exportPath", "outputPath", "savedPath", "destination"]) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.length > 0) return candidate;
  }

  for (const candidate of Object.values(record)) {
    const found = findExportPath(candidate);
    if (found) return found;
  }

  return undefined;
}

function getExpectedExtensions(format: string): string[] {
  if (format === "bedrock_block") return [".bbmodel", ".json"];
  if (format === "bedrock") return [".bbmodel", ".json", ".geo.json"];
  return [".bbmodel", ".json"];
}

function validateExportPath(format: string, exportPath: string | undefined): BlockbenchExportValidationReport {
  const issues: BlockbenchExportValidationIssue[] = [];

  if (!exportPath) {
    issues.push({
      severity: "warning",
      code: "EXPORT_PATH_MISSING",
      message: "Export result did not include a clear output path."
    });

    return {
      valid: true,
      expectedFormat: format,
      issues
    };
  }

  const exportExtension = extname(exportPath).toLowerCase();
  const expectedExtensions = getExpectedExtensions(format);

  if (!exportExtension) {
    issues.push({
      severity: "warning",
      code: "EXPORT_EXTENSION_MISSING",
      message: "Export path does not include a file extension."
    });
  } else if (!expectedExtensions.includes(exportExtension) && !(format === "bedrock" && exportPath.endsWith(".geo.json"))) {
    issues.push({
      severity: "warning",
      code: "EXPORT_EXTENSION_UNEXPECTED",
      message: "Export extension " + exportExtension + " is not a common extension for " + format + "."
    });
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    expectedFormat: format,
    exportPath,
    exportExtension,
    issues
  };
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

  const exportPath = findExportPath(rawResult);
  const validation = validateExportPath(format, exportPath);
  const reportPath = join(jobDir, "blockbench_export.json");
  const report: BlockbenchExportReport = {
    exportedAt: new Date().toISOString(),
    toolName,
    format,
    exportPath,
    validation,
    rawResult
  };

  await writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}
