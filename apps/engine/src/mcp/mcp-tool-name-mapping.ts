import type { McpToolCall, McpToolDefinition } from "./blockbench-client.js";
import { optionalBlockbenchToolNames, requiredBlockbenchToolNames } from "./blockbench-tool-adapter.js";

export type CanonicalMcpToolName =
  | (typeof requiredBlockbenchToolNames)[number]
  | (typeof optionalBlockbenchToolNames)[number];

export type ToolNameMatchType = "canonical" | "alias" | "normalized";

export interface McpToolNameResolution {
  canonicalName: CanonicalMcpToolName;
  resolvedName?: string;
  status: "resolved" | "missing";
  matchType?: ToolNameMatchType;
  aliases: string[];
}

export interface McpToolNameMappingReport {
  createdAt: string;
  valid: boolean;
  availableTools: string[];
  requiredCanonicalTools: CanonicalMcpToolName[];
  optionalCanonicalTools: CanonicalMcpToolName[];
  missingRequiredTools: CanonicalMcpToolName[];
  missingOptionalTools: CanonicalMcpToolName[];
  resolutions: McpToolNameResolution[];
}

const toolAliases: Record<CanonicalMcpToolName, string[]> = {
  create_project: ["create_project", "project_create", "createProject", "blockbench.createProject", "blockbench_create_project"],
  add_group: ["add_group", "group_add", "create_group", "addGroup", "createGroup", "blockbench.addGroup"],
  place_cube: ["place_cube", "cube_place", "add_cube", "create_cube", "placeCube", "addCube", "blockbench.placeCube"],
  capture_screenshot: [
    "capture_screenshot",
    "screenshot_capture",
    "take_screenshot",
    "captureScreenshot",
    "takeScreenshot",
    "blockbench.captureScreenshot"
  ],
  export_project: ["export_project", "project_export", "exportProject", "save_project", "saveProject", "blockbench.exportProject"]
};

function normalizeToolName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getAvailableToolNames(tools: McpToolDefinition[]): string[] {
  return tools.map((tool) => tool.name).filter(Boolean).sort();
}

function resolveOneToolName(canonicalName: CanonicalMcpToolName, availableToolNames: string[]): McpToolNameResolution {
  const aliases = toolAliases[canonicalName];
  const availableToolSet = new Set(availableToolNames);

  if (availableToolSet.has(canonicalName)) {
    return {
      canonicalName,
      resolvedName: canonicalName,
      status: "resolved",
      matchType: "canonical",
      aliases
    };
  }

  for (const alias of aliases) {
    if (availableToolSet.has(alias)) {
      return {
        canonicalName,
        resolvedName: alias,
        status: "resolved",
        matchType: "alias",
        aliases
      };
    }
  }

  const normalizedAliases = new Set(aliases.map(normalizeToolName));
  const normalizedMatch = availableToolNames.find((toolName) => normalizedAliases.has(normalizeToolName(toolName)));

  if (normalizedMatch) {
    return {
      canonicalName,
      resolvedName: normalizedMatch,
      status: "resolved",
      matchType: "normalized",
      aliases
    };
  }

  return {
    canonicalName,
    status: "missing",
    aliases
  };
}

export function resolveMcpToolNameMappings(tools: McpToolDefinition[]): McpToolNameMappingReport {
  const availableTools = getAvailableToolNames(tools);
  const requiredCanonicalTools = [...requiredBlockbenchToolNames];
  const optionalCanonicalTools = [...optionalBlockbenchToolNames];
  const allCanonicalTools = [...requiredCanonicalTools, ...optionalCanonicalTools];
  const resolutions = allCanonicalTools.map((canonicalName) => resolveOneToolName(canonicalName, availableTools));
  const missingRequiredTools = resolutions
    .filter((resolution) => requiredCanonicalTools.includes(resolution.canonicalName as (typeof requiredBlockbenchToolNames)[number]))
    .filter((resolution) => resolution.status === "missing")
    .map((resolution) => resolution.canonicalName);
  const missingOptionalTools = resolutions
    .filter((resolution) => optionalCanonicalTools.includes(resolution.canonicalName as (typeof optionalBlockbenchToolNames)[number]))
    .filter((resolution) => resolution.status === "missing")
    .map((resolution) => resolution.canonicalName);

  return {
    createdAt: new Date().toISOString(),
    valid: missingRequiredTools.length === 0,
    availableTools,
    requiredCanonicalTools,
    optionalCanonicalTools,
    missingRequiredTools,
    missingOptionalTools,
    resolutions
  };
}

export function mapMcpActionToolNames(
  actions: McpToolCall[],
  mappingReport: McpToolNameMappingReport
): McpToolCall[] {
  const resolutionMap = new Map(mappingReport.resolutions.map((resolution) => [resolution.canonicalName, resolution]));

  return actions.map((action) => {
    const resolution = resolutionMap.get(action.name as CanonicalMcpToolName);

    if (!resolution?.resolvedName) return action;

    return {
      ...action,
      name: resolution.resolvedName
    };
  });
}

export function getCanonicalToolNameForResolvedName(
  resolvedName: string,
  mappingReport: McpToolNameMappingReport
): CanonicalMcpToolName | undefined {
  return mappingReport.resolutions.find((resolution) => resolution.resolvedName === resolvedName)?.canonicalName;
}
