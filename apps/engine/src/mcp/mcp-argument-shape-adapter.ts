import type { McpToolCall, McpToolDefinition } from "./blockbench-client.js";
import {
  getCanonicalToolNameForResolvedName,
  type CanonicalMcpToolName,
  type McpToolNameMappingReport
} from "./mcp-tool-name-mapping.js";

export interface McpArgumentShapeIssue {
  severity: "error" | "warning";
  toolName: string;
  code: string;
  message: string;
}

export interface McpArgumentRename {
  from: string;
  to: string;
}

export interface McpArgumentShapeAdaptedAction {
  canonicalName?: CanonicalMcpToolName;
  toolName: string;
  original: McpToolCall;
  adapted: McpToolCall;
  renamedArguments: McpArgumentRename[];
  issues: McpArgumentShapeIssue[];
}

export interface McpArgumentShapeAdaptationReport {
  createdAt: string;
  valid: boolean;
  actionCount: number;
  adaptedActionCount: number;
  issues: McpArgumentShapeIssue[];
  actions: McpArgumentShapeAdaptedAction[];
}

interface ObjectLikeSchema {
  properties?: unknown;
}

interface ArgumentAliasRule {
  canonicalArgument: string;
  aliases: string[];
}

const argumentAliasRules: Record<CanonicalMcpToolName, ArgumentAliasRule[]> = {
  create_project: [
    { canonicalArgument: "name", aliases: ["name", "projectName", "project_name", "title"] },
    { canonicalArgument: "format", aliases: ["format", "projectFormat", "project_format", "type"] }
  ],
  add_group: [
    { canonicalArgument: "name", aliases: ["name", "groupName", "group_name", "id"] },
    { canonicalArgument: "origin", aliases: ["origin", "pivot", "position"] }
  ],
  place_cube: [
    { canonicalArgument: "group", aliases: ["group", "groupName", "group_name", "parent", "parentGroup", "parent_group"] },
    { canonicalArgument: "elements", aliases: ["elements", "cubes", "cubeElements", "cube_elements", "boxes"] }
  ],
  capture_screenshot: [],
  export_project: [
    { canonicalArgument: "name", aliases: ["name", "projectName", "project_name", "fileName", "file_name"] },
    { canonicalArgument: "format", aliases: ["format", "exportFormat", "export_format", "type"] }
  ]
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getSchemaProperties(tool: McpToolDefinition | undefined): Record<string, unknown> | null {
  if (!tool || !isRecord(tool.inputSchema)) return null;
  const schema = tool.inputSchema as ObjectLikeSchema;
  return isRecord(schema.properties) ? schema.properties : null;
}

function findTool(tools: McpToolDefinition[], toolName: string): McpToolDefinition | undefined {
  return tools.find((tool) => tool.name === toolName);
}

function findTargetArgumentName(
  properties: Record<string, unknown> | null,
  currentArguments: Record<string, unknown>,
  rule: ArgumentAliasRule
): string | undefined {
  if (!properties) return undefined;

  for (const alias of rule.aliases) {
    if (alias in properties) return alias;
  }

  if (rule.canonicalArgument in currentArguments) return rule.canonicalArgument;
  return undefined;
}

function applyArgumentAliasRule(
  action: McpToolCall,
  properties: Record<string, unknown> | null,
  rule: ArgumentAliasRule,
  renamedArguments: McpArgumentRename[]
): Record<string, unknown> {
  const nextArguments = { ...action.arguments };

  if (!(rule.canonicalArgument in nextArguments)) return nextArguments;

  const targetArgument = findTargetArgumentName(properties, nextArguments, rule);
  if (!targetArgument || targetArgument === rule.canonicalArgument) return nextArguments;

  if (!(targetArgument in nextArguments)) {
    nextArguments[targetArgument] = nextArguments[rule.canonicalArgument];
  }

  if (!properties || !(rule.canonicalArgument in properties)) {
    delete nextArguments[rule.canonicalArgument];
  }

  renamedArguments.push({ from: rule.canonicalArgument, to: targetArgument });
  return nextArguments;
}

function adaptOneAction(
  action: McpToolCall,
  tools: McpToolDefinition[],
  mappingReport: McpToolNameMappingReport
): McpArgumentShapeAdaptedAction {
  const canonicalName = getCanonicalToolNameForResolvedName(action.name, mappingReport) ?? (action.name as CanonicalMcpToolName);
  const tool = findTool(tools, action.name);
  const properties = getSchemaProperties(tool);
  const renamedArguments: McpArgumentRename[] = [];
  const issues: McpArgumentShapeIssue[] = [];
  const rules = argumentAliasRules[canonicalName] ?? [];

  if (!tool) {
    issues.push({
      severity: "warning",
      toolName: action.name,
      code: "TOOL_SCHEMA_NOT_FOUND",
      message: "No MCP tool schema was found while adapting arguments for " + action.name + "."
    });
  }

  let adaptedArguments = { ...action.arguments };
  for (const rule of rules) {
    adaptedArguments = applyArgumentAliasRule(
      {
        ...action,
        arguments: adaptedArguments
      },
      properties,
      rule,
      renamedArguments
    );
  }

  return {
    canonicalName,
    toolName: action.name,
    original: action,
    adapted: {
      ...action,
      arguments: adaptedArguments
    },
    renamedArguments,
    issues
  };
}

export function adaptMcpActionArgumentShapes(
  actions: McpToolCall[],
  tools: McpToolDefinition[],
  mappingReport: McpToolNameMappingReport
): McpArgumentShapeAdaptationReport {
  const adaptedActions = actions.map((action) => adaptOneAction(action, tools, mappingReport));
  const issues = adaptedActions.flatMap((action) => action.issues);

  return {
    createdAt: new Date().toISOString(),
    valid: !issues.some((issue) => issue.severity === "error"),
    actionCount: actions.length,
    adaptedActionCount: adaptedActions.filter((action) => action.renamedArguments.length > 0).length,
    issues,
    actions: adaptedActions
  };
}
