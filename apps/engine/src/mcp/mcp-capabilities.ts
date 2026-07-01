import type { McpToolDefinition } from "./blockbench-client.js";
import { requiredBlockbenchToolNames } from "./blockbench-tool-adapter.js";

export interface McpCapabilityReport {
  checkedAt: string;
  connected: boolean;
  valid: boolean;
  availableTools: string[];
  requiredTools: string[];
  missingTools: string[];
  extraTools: string[];
  error?: string;
}

export function evaluateMcpCapabilities(tools: McpToolDefinition[]): McpCapabilityReport {
  const availableTools = tools.map((tool) => tool.name).filter(Boolean).sort();
  const requiredTools = [...requiredBlockbenchToolNames].sort();
  const availableToolSet = new Set(availableTools);
  const requiredToolSet = new Set(requiredTools);

  const missingTools = requiredTools.filter((toolName) => !availableToolSet.has(toolName));
  const extraTools = availableTools.filter((toolName) => !requiredToolSet.has(toolName));

  return {
    checkedAt: new Date().toISOString(),
    connected: true,
    valid: missingTools.length === 0,
    availableTools,
    requiredTools,
    missingTools,
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
    missingTools: [...requiredBlockbenchToolNames].sort(),
    extraTools: [],
    error: error instanceof Error ? error.message : "Unable to inspect Blockbench MCP capabilities."
  };
}
