import type { McpToolResultSummary } from "./mcp-tool-result-summary.js";
import { summarizeMcpToolResult } from "./mcp-tool-result-summary.js";
import type { CanonicalMcpToolName } from "./mcp-tool-name-mapping.js";

export interface McpToolResultValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface McpToolResultValidationReport {
  valid: boolean;
  canonicalToolName: string;
  toolName: string;
  summary: McpToolResultSummary;
  issues: McpToolResultValidationIssue[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function findString(value: unknown, predicate: (value: string) => boolean): string | undefined {
  if (typeof value === "string") return predicate(value) ? value : undefined;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findString(item, predicate);
      if (found) return found;
    }
  }
  if (isRecord(value)) {
    for (const item of Object.values(value)) {
      const found = findString(item, predicate);
      if (found) return found;
    }
  }
  return undefined;
}

function hasImageDataUrl(result: unknown): boolean {
  return Boolean(findString(result, (value) => value.startsWith("data:image/")));
}

function hasPathLikeValue(result: unknown): boolean {
  return Boolean(findString(result, (value) => /[\\/]/.test(value) && value.length < 260));
}

function hasAnyPayload(result: unknown): boolean {
  if (result === null || result === undefined) return false;
  if (typeof result === "string") return result.trim().length > 0;
  if (Array.isArray(result)) return result.length > 0;
  if (isRecord(result)) return Object.keys(result).length > 0;
  return true;
}

function validateByCanonicalTool(canonicalToolName: CanonicalMcpToolName | string, result: unknown): McpToolResultValidationIssue[] {
  const issues: McpToolResultValidationIssue[] = [];

  if (canonicalToolName === "capture_screenshot" && !hasImageDataUrl(result)) {
    issues.push({
      severity: "error",
      code: "SCREENSHOT_RESULT_MISSING_IMAGE",
      message: "capture_screenshot completed but did not return an image data URL."
    });
  }

  if (canonicalToolName === "export_project" && !hasPathLikeValue(result)) {
    issues.push({
      severity: "warning",
      code: "EXPORT_RESULT_MISSING_PATH",
      message: "export_project completed but did not return a clear path-like value."
    });
  }

  if ((canonicalToolName === "create_project" || canonicalToolName === "add_group" || canonicalToolName === "place_cube") && !hasAnyPayload(result)) {
    issues.push({
      severity: "warning",
      code: "MCP_RESULT_EMPTY_PAYLOAD",
      message: canonicalToolName + " completed with an empty result payload."
    });
  }

  return issues;
}

export function validateMcpToolResult(
  canonicalToolName: CanonicalMcpToolName | string,
  toolName: string,
  result: unknown
): McpToolResultValidationReport {
  const summary = summarizeMcpToolResult(result);
  const issues = validateByCanonicalTool(canonicalToolName, result);

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    canonicalToolName,
    toolName,
    summary,
    issues
  };
}
