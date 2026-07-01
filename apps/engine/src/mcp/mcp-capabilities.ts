import type { McpToolDefinition } from "./blockbench-client.js";
import { optionalBlockbenchToolNames, requiredBlockbenchToolNames } from "./blockbench-tool-adapter.js";

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
  error?: string;
}

export function evaluateMcpCapabilities(tools: McpToolDefinition[]): McpCapabilityReport {
  const availableTools = tools.map((tool) => tool.name).filter(Boolean).sort();
  const requiredTools = [...requiredBlockbenchToolNames].sort();
  const optionalTools = [...optionalBlockbenchToolNames].sort();
  const availableToolSet = new Set(availableTools);
  const knownToolSet = new Set([...requiredTools, ...optionalTools]);

  const missingTools = requiredTools.filter((toolName) => !availableToolSet.has(toolName));
  const missingOptionalTools = optionalTools.filter((toolName) => !availableToolSet.has(toolName));
  const extraTools = availableTools.filter((toolName) => !knownToolSet.has(toolName));

  return {
    checkedAt: new Date().toISOString(),
    connected: true,
    valid: missingTools.length === 0,
    availableTools,
    requiredTools,
    optionalTools,
    missingTools,
    missingOptionalTools,
    extraTools
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
    error: error instanceof Error ? error.message : "Unable to inspect Blockbench MCP capabilities."
  };
}
