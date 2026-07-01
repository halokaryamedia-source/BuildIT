import type { McpToolCall, McpToolDefinition } from "./blockbench-client.js";
import { optionalBlockbenchToolNames, requiredBlockbenchToolNames } from "./blockbench-tool-adapter.js";

export type CanonicalMcpToolName =
  | (typeof requiredBlockbenchToolNames)[number]
  | (typeof optionalBlockbenchToolNames)[number];

export type ToolNameMatchType = "canonical" | "alias" | "normalized" | "semantic";

export interface McpToolNameResolution {
  canonicalName: CanonicalMcpToolName;
  resolvedName?: string;
  status: "resolved" | "missing";
  matchType?: ToolNameMatchType;
  aliases: string[];
  semanticScore?: number;
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
  add_group: ["add_group", "group_add", "create_group", "addGroup", "createGroup", "add_bone", "create_bone", "blockbench.addGroup"],
  place_cube: ["place_cube", "cube_place", "add_cube", "create_cube", "placeCube", "addCube", "blockbench.placeCube"],
  capture_screenshot: [
    "capture_screenshot",
    "screenshot_capture",
    "take_screenshot",
    "captureScreenshot",
    "takeScreenshot",
    "capture_preview",
    "render_preview",
    "preview_screenshot",
    "blockbench.captureScreenshot"
  ],
  export_project: ["export_project", "project_export", "exportProject", "save_project", "saveProject", "download_project", "blockbench.exportProject"]
};

const semanticKeywords: Record<CanonicalMcpToolName, string[]> = {
  create_project: ["create", "new", "project", "model", "format"],
  add_group: ["add", "create", "group", "bone", "outliner", "folder"],
  place_cube: ["place", "add", "create", "cube", "box", "element"],
  capture_screenshot: ["capture", "take", "screenshot", "preview", "viewport", "render"],
  export_project: ["export", "save", "download", "project", "model", "file"]
};

function normalizeToolName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function collectSchemaKeys(value: unknown): string[] {
  if (!isRecord(value)) return [];
  const keys = new Set<string>();

  function visit(candidate: unknown): void {
    if (!isRecord(candidate)) return;
    for (const [key, child] of Object.entries(candidate)) {
      keys.add(key.toLowerCase());
      if (key === "properties" && isRecord(child)) {
        for (const propertyName of Object.keys(child)) keys.add(propertyName.toLowerCase());
      }
      if (isRecord(child)) visit(child);
    }
  }

  visit(value);
  return Array.from(keys);
}

function getToolSearchText(tool: McpToolDefinition): string {
  return [tool.name, tool.description ?? "", ...collectSchemaKeys(tool.inputSchema)].join(" ").toLowerCase();
}

function getAvailableToolNames(tools: McpToolDefinition[]): string[] {
  return tools.map((tool) => tool.name).filter(Boolean).sort();
}

function scoreSemanticToolMatch(canonicalName: CanonicalMcpToolName, tool: McpToolDefinition): number {
  const searchText = getToolSearchText(tool);
  const keywords = semanticKeywords[canonicalName];
  let score = 0;

  for (const keyword of keywords) {
    if (searchText.includes(keyword)) score += 1;
  }

  if (canonicalName === "create_project" && searchText.includes("project") && searchText.includes("create")) score += 3;
  if (canonicalName === "place_cube" && searchText.includes("cube")) score += 3;
  if (canonicalName === "capture_screenshot" && (searchText.includes("screenshot") || searchText.includes("preview"))) score += 3;
  if (canonicalName === "add_group" && (searchText.includes("group") || searchText.includes("bone"))) score += 2;
  if (canonicalName === "export_project" && (searchText.includes("export") || searchText.includes("save"))) score += 2;

  return score;
}

function findSemanticMatch(
  canonicalName: CanonicalMcpToolName,
  tools: McpToolDefinition[],
  alreadyResolved: Set<string>
): { toolName: string; score: number } | undefined {
  const candidates = tools
    .filter((tool) => !alreadyResolved.has(tool.name))
    .map((tool) => ({ toolName: tool.name, score: scoreSemanticToolMatch(canonicalName, tool) }))
    .filter((candidate) => candidate.score >= 4)
    .sort((left, right) => right.score - left.score || left.toolName.localeCompare(right.toolName));

  return candidates[0];
}

function resolveOneToolName(
  canonicalName: CanonicalMcpToolName,
  tools: McpToolDefinition[],
  alreadyResolved: Set<string>
): McpToolNameResolution {
  const aliases = toolAliases[canonicalName];
  const availableToolNames = getAvailableToolNames(tools);
  const availableToolSet = new Set(availableToolNames);

  if (availableToolSet.has(canonicalName) && !alreadyResolved.has(canonicalName)) {
    alreadyResolved.add(canonicalName);
    return {
      canonicalName,
      resolvedName: canonicalName,
      status: "resolved",
      matchType: "canonical",
      aliases
    };
  }

  for (const alias of aliases) {
    if (availableToolSet.has(alias) && !alreadyResolved.has(alias)) {
      alreadyResolved.add(alias);
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
  const normalizedMatch = availableToolNames.find(
    (toolName) => normalizedAliases.has(normalizeToolName(toolName)) && !alreadyResolved.has(toolName)
  );

  if (normalizedMatch) {
    alreadyResolved.add(normalizedMatch);
    return {
      canonicalName,
      resolvedName: normalizedMatch,
      status: "resolved",
      matchType: "normalized",
      aliases
    };
  }

  const semanticMatch = findSemanticMatch(canonicalName, tools, alreadyResolved);
  if (semanticMatch) {
    alreadyResolved.add(semanticMatch.toolName);
    return {
      canonicalName,
      resolvedName: semanticMatch.toolName,
      status: "resolved",
      matchType: "semantic",
      aliases,
      semanticScore: semanticMatch.score
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
  const alreadyResolved = new Set<string>();
  const resolutions = allCanonicalTools.map((canonicalName) => resolveOneToolName(canonicalName, tools, alreadyResolved));
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

export function mapMcpActionToolNames(actions: McpToolCall[], mappingReport: McpToolNameMappingReport): McpToolCall[] {
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
