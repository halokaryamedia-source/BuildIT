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
  expandedFromBatch?: boolean;
  sourceElementName?: string;
  issues: McpArgumentShapeIssue[];
}

export interface McpArgumentShapeAdaptationReport {
  createdAt: string;
  valid: boolean;
  actionCount: number;
  adaptedActionCount: number;
  expandedActionCount: number;
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

interface ExpandedActionSet {
  actions: McpToolCall[];
  issue?: McpArgumentShapeIssue;
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
    { canonicalArgument: "group", aliases: ["group", "groupName", "group_name", "parent", "parentGroup", "parent_group", "bone"] },
    { canonicalArgument: "elements", aliases: ["elements", "cubes", "cubeElements", "cube_elements", "boxes"] },
    { canonicalArgument: "material", aliases: ["material", "texture", "textureName", "texture_name"] }
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

function hasAnyProperty(properties: Record<string, unknown> | null, names: string[]): boolean {
  if (!properties) return false;
  return names.some((name) => name in properties);
}

function findFirstProperty(properties: Record<string, unknown> | null, names: string[]): string | undefined {
  if (!properties) return undefined;
  return names.find((name) => name in properties);
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

function shouldExpandPlaceCubeBatch(
  canonicalName: CanonicalMcpToolName,
  action: McpToolCall,
  properties: Record<string, unknown> | null
): boolean {
  if (canonicalName !== "place_cube") return false;
  if (!Array.isArray(action.arguments.elements)) return false;
  if (!properties) return false;

  const supportsBatch = hasAnyProperty(properties, ["elements", "cubes", "cubeElements", "cube_elements", "boxes"]);
  if (supportsBatch) return false;

  return hasAnyProperty(properties, ["cube", "box", "element", "name", "from", "to", "position", "dimensions", "size"]);
}

function toSingleCubeArguments(
  action: McpToolCall,
  element: Record<string, unknown>,
  properties: Record<string, unknown> | null
): Record<string, unknown> {
  const baseArguments = { ...action.arguments };
  delete baseArguments.elements;
  delete baseArguments.batchIndex;
  delete baseArguments.batchCount;

  const wrapperProperty = findFirstProperty(properties, ["cube", "box", "element"]);
  if (wrapperProperty) {
    return {
      ...baseArguments,
      [wrapperProperty]: element
    };
  }

  return {
    ...baseArguments,
    ...element,
    group: typeof element.group === "string" ? element.group : baseArguments.group
  };
}

function expandPlaceCubeBatchIfNeeded(
  action: McpToolCall,
  canonicalName: CanonicalMcpToolName,
  properties: Record<string, unknown> | null
): ExpandedActionSet {
  if (!shouldExpandPlaceCubeBatch(canonicalName, action, properties)) return { actions: [action] };

  const elements = action.arguments.elements;
  if (!Array.isArray(elements)) return { actions: [action] };

  return {
    issue: {
      severity: "warning",
      toolName: action.name,
      code: "PLACE_CUBE_BATCH_EXPANDED",
      message: "place_cube batch was expanded into single-cube calls to match the MCP core app schema."
    },
    actions: elements.filter(isRecord).map((element, index) => ({
      name: action.name,
      arguments: {
        ...toSingleCubeArguments(action, element, properties),
        batchIndex: index,
        batchCount: elements.length
      }
    }))
  };
}

function adaptOneExpandedAction(
  originalAction: McpToolCall,
  action: McpToolCall,
  tools: McpToolDefinition[],
  mappingReport: McpToolNameMappingReport,
  expandedFromBatch: boolean
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
    original: originalAction,
    adapted: {
      ...action,
      arguments: adaptedArguments
    },
    renamedArguments,
    expandedFromBatch,
    sourceElementName: typeof adaptedArguments.name === "string" ? adaptedArguments.name : undefined,
    issues
  };
}

function adaptOneAction(
  action: McpToolCall,
  tools: McpToolDefinition[],
  mappingReport: McpToolNameMappingReport
): { actions: McpArgumentShapeAdaptedAction[]; issue?: McpArgumentShapeIssue } {
  const canonicalName = getCanonicalToolNameForResolvedName(action.name, mappingReport) ?? (action.name as CanonicalMcpToolName);
  const tool = findTool(tools, action.name);
  const properties = getSchemaProperties(tool);
  const expandedActionSet = expandPlaceCubeBatchIfNeeded(action, canonicalName, properties);

  return {
    issue: expandedActionSet.issue,
    actions: expandedActionSet.actions.map((expandedAction) =>
      adaptOneExpandedAction(action, expandedAction, tools, mappingReport, expandedActionSet.actions.length > 1)
    )
  };
}

export function adaptMcpActionArgumentShapes(
  actions: McpToolCall[],
  tools: McpToolDefinition[],
  mappingReport: McpToolNameMappingReport
): McpArgumentShapeAdaptationReport {
  const adaptedActionSets = actions.map((action) => adaptOneAction(action, tools, mappingReport));
  const adaptedActions = adaptedActionSets.flatMap((actionSet) => actionSet.actions);
  const issues = [
    ...adaptedActionSets.map((actionSet) => actionSet.issue).filter((issue): issue is McpArgumentShapeIssue => Boolean(issue)),
    ...adaptedActions.flatMap((action) => action.issues)
  ];

  return {
    createdAt: new Date().toISOString(),
    valid: !issues.some((issue) => issue.severity === "error"),
    actionCount: actions.length,
    adaptedActionCount: adaptedActions.filter((action) => action.renamedArguments.length > 0).length,
    expandedActionCount: adaptedActions.filter((action) => action.expandedFromBatch).length,
    issues,
    actions: adaptedActions
  };
}
