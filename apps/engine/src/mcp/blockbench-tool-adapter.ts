import type { ModelPlan } from "../planning/model-plan.js";
import type { McpToolCall } from "./blockbench-client.js";
import { buildMcpGeometry, type McpGeometryCube, type McpGeometryReport } from "./mcp-geometry-planner.js";

export type SupportedBlockbenchFormat = "bedrock" | "bedrock_block";

export interface ToolAdapterIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface ToolAdapterResult {
  valid: boolean;
  format: SupportedBlockbenchFormat;
  actions: McpToolCall[];
  issues: ToolAdapterIssue[];
}

export const requiredBlockbenchToolNames = ["create_project", "add_group", "place_cube", "capture_screenshot"] as const;
export const optionalBlockbenchToolNames = ["export_project"] as const;

const supportedToolNames = new Set<string>([...requiredBlockbenchToolNames, ...optionalBlockbenchToolNames]);

function resolveFormat(format: string): SupportedBlockbenchFormat {
  return format === "bedrock_block" ? "bedrock_block" : "bedrock";
}

function createProjectAction(plan: ModelPlan): McpToolCall {
  return {
    name: "create_project",
    arguments: {
      name: plan.name,
      format: resolveFormat(plan.format)
    }
  };
}

function createGroupAction(groupName: string, origin: [number, number, number]): McpToolCall {
  return {
    name: "add_group",
    arguments: {
      name: groupName,
      origin
    }
  };
}

function toCubeElement(cube: McpGeometryCube): Record<string, unknown> {
  return {
    name: cube.name,
    from: cube.from,
    to: cube.to,
    size: cube.size,
    center: cube.center,
    material: cube.material
  };
}

function groupCubesByGroup(cubes: McpGeometryCube[]): Map<string, McpGeometryCube[]> {
  const grouped = new Map<string, McpGeometryCube[]>();

  for (const cube of cubes) {
    const existing = grouped.get(cube.group) ?? [];
    existing.push(cube);
    grouped.set(cube.group, existing);
  }

  return grouped;
}

function createCubeActions(cubes: McpGeometryCube[]): McpToolCall[] {
  return Array.from(groupCubesByGroup(cubes).entries()).map(([group, groupCubes]) => ({
    name: "place_cube",
    arguments: {
      group,
      elements: groupCubes.map(toCubeElement)
    }
  }));
}

function createScreenshotAction(): McpToolCall {
  return {
    name: "capture_screenshot",
    arguments: {}
  };
}

function createExportAction(plan: ModelPlan): McpToolCall {
  return {
    name: "export_project",
    arguments: {
      name: plan.name,
      format: resolveFormat(plan.format)
    }
  };
}

function validateAction(action: McpToolCall, issues: ToolAdapterIssue[]): void {
  if (!supportedToolNames.has(action.name)) {
    issues.push({
      severity: "error",
      code: "UNSUPPORTED_MCP_TOOL",
      message: "Unsupported MCP tool action: " + action.name + "."
    });
  }

  if (!action.arguments || typeof action.arguments !== "object") {
    issues.push({
      severity: "error",
      code: "INVALID_TOOL_ARGUMENTS",
      message: "MCP tool action " + action.name + " must include an arguments object."
    });
  }
}

function validateProjectAction(action: McpToolCall, issues: ToolAdapterIssue[]): void {
  if (action.name !== "create_project") return;

  const format = action.arguments.format;
  const name = action.arguments.name;

  if (format !== "bedrock" && format !== "bedrock_block") {
    issues.push({
      severity: "error",
      code: "INVALID_PROJECT_FORMAT",
      message: "create_project format must be bedrock or bedrock_block."
    });
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    issues.push({
      severity: "error",
      code: "INVALID_PROJECT_NAME",
      message: "create_project requires a non-empty project name."
    });
  }
}

function validateGroupAction(action: McpToolCall, issues: ToolAdapterIssue[]): void {
  if (action.name !== "add_group") return;

  if (typeof action.arguments.name !== "string" || action.arguments.name.trim().length === 0) {
    issues.push({
      severity: "error",
      code: "INVALID_GROUP_NAME",
      message: "add_group requires a non-empty group name."
    });
  }

  if (!Array.isArray(action.arguments.origin) || action.arguments.origin.length !== 3) {
    issues.push({
      severity: "error",
      code: "INVALID_GROUP_ORIGIN",
      message: "add_group requires a 3D origin array."
    });
  }
}

function validateCubeAction(action: McpToolCall, issues: ToolAdapterIssue[]): void {
  if (action.name !== "place_cube") return;

  if (typeof action.arguments.group !== "string" || action.arguments.group.trim().length === 0) {
    issues.push({
      severity: "error",
      code: "INVALID_CUBE_GROUP",
      message: "place_cube requires a target group."
    });
  }

  if (!Array.isArray(action.arguments.elements) || action.arguments.elements.length === 0) {
    issues.push({
      severity: "error",
      code: "INVALID_CUBE_ELEMENTS",
      message: "place_cube requires at least one cube element."
    });
  }
}

function validateExportAction(action: McpToolCall, issues: ToolAdapterIssue[]): void {
  if (action.name !== "export_project") return;

  if (typeof action.arguments.name !== "string" || action.arguments.name.trim().length === 0) {
    issues.push({
      severity: "error",
      code: "INVALID_EXPORT_NAME",
      message: "export_project requires a non-empty export name."
    });
  }

  if (action.arguments.format !== "bedrock" && action.arguments.format !== "bedrock_block") {
    issues.push({
      severity: "error",
      code: "INVALID_EXPORT_FORMAT",
      message: "export_project format must be bedrock or bedrock_block."
    });
  }
}

export function buildBlockbenchToolActionsFromGeometry(plan: ModelPlan, geometry: McpGeometryReport): ToolAdapterResult {
  const issues: ToolAdapterIssue[] = [...geometry.issues];
  const format = resolveFormat(plan.format);
  const actions: McpToolCall[] = [createProjectAction(plan)];

  for (const group of geometry.groups) {
    actions.push(createGroupAction(group.name, group.origin));
  }

  actions.push(...createCubeActions(geometry.cubes));
  actions.push(createScreenshotAction());
  actions.push(createExportAction(plan));

  for (const action of actions) {
    validateAction(action, issues);
    validateProjectAction(action, issues);
    validateGroupAction(action, issues);
    validateCubeAction(action, issues);
    validateExportAction(action, issues);
  }

  return {
    valid: geometry.valid && !issues.some((issue) => issue.severity === "error"),
    format,
    actions,
    issues
  };
}

export function buildBlockbenchToolActions(plan: ModelPlan): ToolAdapterResult {
  return buildBlockbenchToolActionsFromGeometry(plan, buildMcpGeometry(plan));
}
