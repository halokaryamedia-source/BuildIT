import type { McpToolCall } from "./blockbench-client.js";
import {
  getCanonicalToolNameForResolvedName,
  type CanonicalMcpToolName,
  type McpToolNameMappingReport
} from "./mcp-tool-name-mapping.js";

export interface McpSkippedAction {
  action: McpToolCall;
  canonicalToolName: CanonicalMcpToolName;
  reason: string;
}

export interface McpExecutableActionSet {
  executableActions: McpToolCall[];
  skippedActions: McpSkippedAction[];
}

export function splitMcpActionsByAvailability(
  actions: McpToolCall[],
  mappingReport: McpToolNameMappingReport,
  missingOptionalTools: string[]
): McpExecutableActionSet {
  const missingOptionalToolSet = new Set<string>(missingOptionalTools);
  const executableActions: McpToolCall[] = [];
  const skippedActions: McpSkippedAction[] = [];

  for (const action of actions) {
    const canonicalToolName = getCanonicalToolNameForResolvedName(action.name, mappingReport) ?? (action.name as CanonicalMcpToolName);

    if (missingOptionalToolSet.has(canonicalToolName)) {
      skippedActions.push({
        action,
        canonicalToolName,
        reason: "Optional MCP core app tool is not available."
      });
      continue;
    }

    executableActions.push(action);
  }

  return { executableActions, skippedActions };
}
