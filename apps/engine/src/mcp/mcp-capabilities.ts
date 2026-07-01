import type { McpToolDefinition } from "./blockbench-client.js";
import { optionalBlockbenchToolNames, requiredBlockbenchToolNames } from "./blockbench-tool-adapter.js";
import { resolveMcpToolNameMappings, type McpToolNameResolution } from "./mcp-tool-name-mapping.js";

export interface McpCapabilityReport {
  checkedAt: string;
  connected: boolean;
  valid: boolean;
  availableTools: string[];
  requiredTools: string[];
  optionalTools: string[];
  missingTools: string[];
  missingOptionalTools: string[];
  extraTools: string[];
  toolNameResolutions: McpToolNameResolution[];
  error?: string;
}

export function evaluateMcpCapabilities(tools: McpToolDefinition[]): McpCapabilityReport {
  const mappingReport = resolveMcpToolNameMappings(tools);
  const availableTools = mappingReport.availableTools;
  const requiredTools = [...requiredBlockbenchToolNames].sort();
  const optionalTools = [...optionalBlockbenchToolNames].sort();
  const resolvedToolNames = new Set(
    mappingReport.resolutions.map((resolution) => resolution.resolvedName).filter((value): value is string => Boolean(value))
  );

  const extraTools = availableTools.filter((toolName) => !resolvedToolNames.has(toolName));

  return {
    checkedAt: new Date().toISOString(),
    connected: true,
    valid: mappingReport.valid,
    availableTools,
    requiredTools,
    optionalTools,
    missingTools: mappingReport.missingRequiredTools,
    missingOptionalTools: mappingReport.missingOptionalTools,
    extraTools,
    toolNameResolutions: mappingReport.resolutions
  };
}

export function createFailedMcpCapabilityReport(error: unknown): McpCapabilityReport {
  return {
    checkedAt: new Date().toISOString(),
    connected: false,
    valid: false,
    availableTools: [],
    requiredTools: [...requiredBlockbenchToolNames].sort(),
    optionalTools: [...optionalBlockbenchToolNames].sort(),
    missingTools: [...requiredBlockbenchToolNames].sort(),
    missingOptionalTools: [...optionalBlockbenchToolNames].sort(),
    extraTools: [],
    toolNameResolutions: [],
    error: error instanceof Error ? error.message : "Unable to inspect Blockbench MCP capabilities."
  };
}
