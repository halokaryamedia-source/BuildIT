import type { McpToolCall, McpToolDefinition } from "./blockbench-client.js";

export interface McpActionSchemaIssue {
  severity: "error" | "warning";
  toolName: string;
  code: string;
  message: string;
}

export interface McpSchemaMatchedAction {
  original: McpToolCall;
  normalized: McpToolCall;
  matchedSchema: boolean;
  removedArguments: string[];
  issues: McpActionSchemaIssue[];
}

export interface McpActionSchemaMatchReport {
  createdAt: string;
  valid: boolean;
  actionCount: number;
  matchedActionCount: number;
  issues: McpActionSchemaIssue[];
  actions: McpSchemaMatchedAction[];
}

interface ObjectLikeSchema {
  type?: unknown;
  properties?: unknown;
  required?: unknown;
  additionalProperties?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getObjectSchema(inputSchema: unknown): ObjectLikeSchema | null {
  if (!isRecord(inputSchema)) return null;
  return inputSchema as ObjectLikeSchema;
}

function getSchemaProperties(schema: ObjectLikeSchema): Record<string, unknown> | null {
  return isRecord(schema.properties) ? schema.properties : null;
}

function getRequiredPropertyNames(schema: ObjectLikeSchema): string[] {
  return Array.isArray(schema.required) ? schema.required.filter((value): value is string => typeof value === "string") : [];
}

function allowsAdditionalProperties(schema: ObjectLikeSchema): boolean {
  return schema.additionalProperties !== false;
}

function findToolSchema(tools: McpToolDefinition[], toolName: string): McpToolDefinition | undefined {
  return tools.find((tool) => tool.name === toolName);
}

function normalizeArguments(action: McpToolCall, tool: McpToolDefinition | undefined): McpSchemaMatchedAction {
  const issues: McpActionSchemaIssue[] = [];

  if (!tool) {
    issues.push({
      severity: "error",
      toolName: action.name,
      code: "TOOL_SCHEMA_NOT_FOUND",
      message: "No MCP tool schema was found for action " + action.name + "."
    });

    return {
      original: action,
      normalized: action,
      matchedSchema: false,
      removedArguments: [],
      issues
    };
  }

  const schema = getObjectSchema(tool.inputSchema);
  if (!schema) {
    issues.push({
      severity: "warning",
      toolName: action.name,
      code: "TOOL_SCHEMA_MISSING",
      message: "MCP tool " + action.name + " does not expose an object input schema."
    });

    return {
      original: action,
      normalized: action,
      matchedSchema: false,
      removedArguments: [],
      issues
    };
  }

  const properties = getSchemaProperties(schema);
  const requiredProperties = getRequiredPropertyNames(schema);
  const removedArguments: string[] = [];
  const normalizedArguments: Record<string, unknown> = { ...action.arguments };

  if (properties && !allowsAdditionalProperties(schema)) {
    for (const argumentName of Object.keys(normalizedArguments)) {
      if (!(argumentName in properties)) {
        removedArguments.push(argumentName);
        delete normalizedArguments[argumentName];
      }
    }
  }

  for (const requiredName of requiredProperties) {
    if (!(requiredName in normalizedArguments)) {
      issues.push({
        severity: "error",
        toolName: action.name,
        code: "MISSING_REQUIRED_ARGUMENT",
        message: "MCP tool " + action.name + " requires argument " + requiredName + "."
      });
    }
  }

  for (const removedArgument of removedArguments) {
    issues.push({
      severity: "warning",
      toolName: action.name,
      code: "REMOVED_UNKNOWN_ARGUMENT",
      message: "Removed argument " + removedArgument + " from MCP tool " + action.name + " because the tool schema disallows it."
    });
  }

  return {
    original: action,
    normalized: {
      ...action,
      arguments: normalizedArguments
    },
    matchedSchema: true,
    removedArguments,
    issues
  };
}

export function matchMcpActionsToSchemas(actions: McpToolCall[], tools: McpToolDefinition[]): McpActionSchemaMatchReport {
  const matchedActions = actions.map((action) => normalizeArguments(action, findToolSchema(tools, action.name)));
  const issues = matchedActions.flatMap((action) => action.issues);

  return {
    createdAt: new Date().toISOString(),
    valid: !issues.some((issue) => issue.severity === "error"),
    actionCount: actions.length,
    matchedActionCount: matchedActions.filter((action) => action.matchedSchema).length,
    issues,
    actions: matchedActions
  };
}
