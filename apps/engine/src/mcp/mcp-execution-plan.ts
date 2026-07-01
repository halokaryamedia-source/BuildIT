import type { McpToolCall } from "./blockbench-client.js";
import { optionalBlockbenchToolNames } from "./blockbench-tool-adapter.js";
import {
  getCanonicalToolNameForResolvedName,
  type CanonicalMcpToolName,
  type McpToolNameMappingReport
} from "./mcp-tool-name-mapping.js";

export interface McpExecutionPlanItem {
  order: number;
  toolName: string;
  canonicalToolName?: CanonicalMcpToolName;
  optional: boolean;
  willSkip: boolean;
  skipReason?: string;
  cubeGroup?: string;
  cubeElementCount?: number;
  batchIndex?: number;
  batchCount?: number;
  action: McpToolCall;
}

export interface McpExecutionPlanReport {
  createdAt: string;
  actionCount: number;
  executableActionCount: number;
  skippedActionCount: number;
  optionalActionCount: number;
  cubeElementCount: number;
  cubeBatchCount: number;
  items: McpExecutionPlanItem[];
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getCubeElementCount(action: McpToolCall): number | undefined {
  return Array.isArray(action.arguments.elements) ? action.arguments.elements.length : undefined;
}

function getCubeGroup(action: McpToolCall): string | undefined {
  return typeof action.arguments.group === "string" ? action.arguments.group : undefined;
}

export function buildMcpExecutionPlan(
  actions: McpToolCall[],
  mappingReport: McpToolNameMappingReport,
  missingOptionalTools: string[]
): McpExecutionPlanReport {
  const optionalToolSet = new Set<string>([...optionalBlockbenchToolNames]);
  const missingOptionalToolSet = new Set<string>(missingOptionalTools);

  const items = actions.map((action, index): McpExecutionPlanItem => {
    const canonicalToolName = getCanonicalToolNameForResolvedName(action.name, mappingReport) ?? (action.name as CanonicalMcpToolName);
    const optional = optionalToolSet.has(canonicalToolName);
    const willSkip = optional && missingOptionalToolSet.has(canonicalToolName);
    const cubeElementCount = action.name.includes("place") || canonicalToolName === "place_cube" ? getCubeElementCount(action) : undefined;

    return {
      order: index + 1,
      toolName: action.name,
      canonicalToolName,
      optional,
      willSkip,
      skipReason: willSkip ? "Optional MCP tool is not available in the running Blockbench MCP server." : undefined,
      cubeGroup: canonicalToolName === "place_cube" ? getCubeGroup(action) : undefined,
      cubeElementCount,
      batchIndex: getNumber(action.arguments.batchIndex),
      batchCount: getNumber(action.arguments.batchCount),
      action
    };
  });

  const cubeElementCount = items.reduce((total, item) => total + (item.cubeElementCount ?? 0), 0);
  const cubeBatchCount = items.filter((item) => item.canonicalToolName === "place_cube").length;

  return {
    createdAt: new Date().toISOString(),
    actionCount: items.length,
    executableActionCount: items.filter((item) => !item.willSkip).length,
    skippedActionCount: items.filter((item) => item.willSkip).length,
    optionalActionCount: items.filter((item) => item.optional).length,
    cubeElementCount,
    cubeBatchCount,
    items
  };
}
