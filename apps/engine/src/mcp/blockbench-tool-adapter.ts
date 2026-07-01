import type { ModelPlan } from "../planning/model-plan.js";
import type { McpToolCall } from "./blockbench-client.js";

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

const supportedToolNames = new Set(["create_project", "add_group", "place_cube", "capture_screenshot"]);

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

function createGroupAction(groupName: string): McpToolCall {
  return {
    name: "add_group",
    arguments: {
      name: groupName,
      origin: [0, 0, 0]
    }
  };
}

function createCubeAction(part: ModelPlan["parts"][number]): McpToolCall {
  return {
    name: "place_cube",
    arguments: {
      group: part.group,
      elements: [
        {
          name: part.name,
          from: part.from,
          to: part.to,
          material: part.material
        }
      ]
    }
  };
}

function createScreenshotAction(): McpToolCall {
  return {
    name: "capture_screenshot",
    arguments: {}
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

export function buildBlockbenchToolActions(plan: ModelPlan): ToolAdapterResult {
  const issues: ToolAdapterIssue[] = [];
  const format = resolveFormat(plan.format);

  const actions: McpToolCall[] = [createProjectAction(plan)];

  for (const group of plan.groups) {
    actions.push(createGroupAction(group));
  }

  for (const part of plan.parts) {
    actions.push(createCubeAction(part));
  }

  actions.push(createScreenshotAction());

  for (const action of actions) {
    validateAction(action, issues);
    validateProjectAction(action, issues);
    validateGroupAction(action, issues);
    validateCubeAction(action, issues);
  }

  if (format === "bedrock_block") {
    const groupNames = plan.groups.join(" ").toLowerCase();
    if (groupNames.includes("head") || groupNames.includes("limb")) {
      issues.push({
        severity: "warning",
        code: "ENTITY_GROUPS_FOR_BLOCK_ACTIONS",
        message: "Bedrock Block actions were built from entity-like group names."
      });
    }
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    format,
    actions,
    issues
  };
}
