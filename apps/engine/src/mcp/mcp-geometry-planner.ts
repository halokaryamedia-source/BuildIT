import type { ModelPlan } from "../planning/model-plan.js";
import { applyBedrockBlockGeometryRules } from "./mcp-bedrock-block-geometry.js";
import { applyBedrockEntityGeometryRules } from "./mcp-bedrock-entity-geometry.js";

export type Vec3 = [number, number, number];
export type GeometryTargetFormat = "bedrock" | "bedrock_block";

export interface McpGeometryIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
}

export interface McpGeometryBounds {
  min: Vec3;
  max: Vec3;
}

export interface McpGeometryGroup {
  name: string;
  origin: Vec3;
}

export interface McpGeometryCube {
  name: string;
  group: string;
  from: Vec3;
  to: Vec3;
  size: Vec3;
  center: Vec3;
  material: string;
}

export interface McpGeometryReport {
  createdAt: string;
  format: GeometryTargetFormat;
  valid: boolean;
  bounds: McpGeometryBounds;
  groupCount: number;
  cubeCount: number;
  groups: McpGeometryGroup[];
  cubes: McpGeometryCube[];
  issues: McpGeometryIssue[];
}

function resolveFormat(format: string): GeometryTargetFormat {
  return format === "bedrock_block" ? "bedrock_block" : "bedrock";
}

function getBounds(format: GeometryTargetFormat): McpGeometryBounds {
  if (format === "bedrock_block") {
    return {
      min: [-8, 0, -8],
      max: [8, 16, 8]
    };
  }

  return {
    min: [-16, 0, -16],
    max: [16, 32, 16]
  };
}

function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function sanitizeName(value: string, fallback: string): string {
  const safeName = value.trim().replace(/[^a-zA-Z0-9_\-]+/g, "_").replace(/^_+|_+$/g, "");
  return safeName || fallback;
}

function normalizeVec3(value: Vec3, bounds: McpGeometryBounds, side: "from" | "to"): Vec3 {
  return [0, 1, 2].map((axis) => {
    const raw = Number.isFinite(value[axis]) ? value[axis] : side === "from" ? bounds.min[axis] : bounds.max[axis];
    return roundToQuarter(clamp(raw, bounds.min[axis], bounds.max[axis]));
  }) as Vec3;
}

function ensureAscending(from: Vec3, to: Vec3): { from: Vec3; to: Vec3; swapped: boolean } {
  let swapped = false;
  const nextFrom = [...from] as Vec3;
  const nextTo = [...to] as Vec3;

  for (let axis = 0; axis < 3; axis += 1) {
    if (nextFrom[axis] > nextTo[axis]) {
      const oldFrom = nextFrom[axis];
      nextFrom[axis] = nextTo[axis];
      nextTo[axis] = oldFrom;
      swapped = true;
    }
  }

  return { from: nextFrom, to: nextTo, swapped };
}

function ensureMinimumSize(from: Vec3, to: Vec3, bounds: McpGeometryBounds): { from: Vec3; to: Vec3; expanded: boolean } {
  const nextFrom = [...from] as Vec3;
  const nextTo = [...to] as Vec3;
  let expanded = false;

  for (let axis = 0; axis < 3; axis += 1) {
    const size = nextTo[axis] - nextFrom[axis];
    if (size >= 0.25) continue;

    const center = (nextFrom[axis] + nextTo[axis]) / 2;
    nextFrom[axis] = roundToQuarter(clamp(center - 0.5, bounds.min[axis], bounds.max[axis]));
    nextTo[axis] = roundToQuarter(clamp(center + 0.5, bounds.min[axis], bounds.max[axis]));

    if (nextTo[axis] - nextFrom[axis] < 0.25) {
      nextFrom[axis] = bounds.min[axis];
      nextTo[axis] = bounds.max[axis];
    }

    expanded = true;
  }

  return { from: nextFrom, to: nextTo, expanded };
}

function subtractVec3(to: Vec3, from: Vec3): Vec3 {
  return [roundToQuarter(to[0] - from[0]), roundToQuarter(to[1] - from[1]), roundToQuarter(to[2] - from[2])];
}

function centerVec3(from: Vec3, to: Vec3): Vec3 {
  return [roundToQuarter((from[0] + to[0]) / 2), roundToQuarter((from[1] + to[1]) / 2), roundToQuarter((from[2] + to[2]) / 2)];
}

function createGroupList(plan: ModelPlan): McpGeometryGroup[] {
  const groupSet = new Set<string>();
  groupSet.add("root");

  for (const group of plan.groups) {
    groupSet.add(sanitizeName(group, "group"));
  }

  for (const part of plan.parts) {
    groupSet.add(sanitizeName(part.group, "group"));
  }

  return Array.from(groupSet).map((name) => ({ name, origin: [0, 0, 0] }));
}

function normalizeCube(
  part: ModelPlan["parts"][number],
  index: number,
  bounds: McpGeometryBounds,
  issues: McpGeometryIssue[]
): McpGeometryCube {
  const originalFrom = part.from;
  const originalTo = part.to;
  const normalizedFrom = normalizeVec3(originalFrom, bounds, "from");
  const normalizedTo = normalizeVec3(originalTo, bounds, "to");
  const ascending = ensureAscending(normalizedFrom, normalizedTo);
  const sized = ensureMinimumSize(ascending.from, ascending.to, bounds);
  const name = sanitizeName(part.name, "cube_" + index);
  const group = sanitizeName(part.group, "root");

  if (JSON.stringify(originalFrom) !== JSON.stringify(normalizedFrom) || JSON.stringify(originalTo) !== JSON.stringify(normalizedTo)) {
    issues.push({
      severity: "warning",
      code: "CUBE_BOUNDS_CLAMPED",
      message: "Cube " + name + " was clamped to the target format bounds."
    });
  }

  if (ascending.swapped) {
    issues.push({
      severity: "warning",
      code: "CUBE_COORDINATES_REORDERED",
      message: "Cube " + name + " had inverted coordinates and was reordered."
    });
  }

  if (sized.expanded) {
    issues.push({
      severity: "warning",
      code: "CUBE_SIZE_EXPANDED",
      message: "Cube " + name + " was expanded to a minimum visible size."
    });
  }

  return {
    name,
    group,
    from: sized.from,
    to: sized.to,
    size: subtractVec3(sized.to, sized.from),
    center: centerVec3(sized.from, sized.to),
    material: sanitizeName(part.material, "default_material")
  };
}

function addFormatWarnings(plan: ModelPlan, format: GeometryTargetFormat, issues: McpGeometryIssue[]): void {
  const groupNames = plan.groups.join(" ").toLowerCase();

  if (format === "bedrock_block" && (groupNames.includes("head") || groupNames.includes("limb") || groupNames.includes("arm") || groupNames.includes("leg"))) {
    issues.push({
      severity: "warning",
      code: "ENTITY_STYLE_GROUPS_FOR_BLOCK_GEOMETRY",
      message: "Bedrock Block geometry contains entity-like group names."
    });
  }

  if (format === "bedrock" && (groupNames.includes("block_body") || groupNames.includes("decorative_details"))) {
    issues.push({
      severity: "warning",
      code: "BLOCK_STYLE_GROUPS_FOR_ENTITY_GEOMETRY",
      message: "Bedrock Entity geometry contains block-like group names."
    });
  }
}

function applyFormatSpecificRules(report: McpGeometryReport): McpGeometryReport {
  if (report.format === "bedrock_block") return applyBedrockBlockGeometryRules(report);
  return applyBedrockEntityGeometryRules(report);
}

export function buildMcpGeometry(plan: ModelPlan): McpGeometryReport {
  const format = resolveFormat(plan.format);
  const bounds = getBounds(format);
  const issues: McpGeometryIssue[] = [];
  const groups = createGroupList(plan);
  const cubes = plan.parts.map((part, index) => normalizeCube(part, index, bounds, issues));

  addFormatWarnings(plan, format, issues);

  if (cubes.length === 0) {
    issues.push({
      severity: "error",
      code: "NO_GEOMETRY_CUBES",
      message: "Model plan did not produce any geometry cubes."
    });
  }

  const baseReport: McpGeometryReport = {
    createdAt: new Date().toISOString(),
    format,
    valid: !issues.some((issue) => issue.severity === "error"),
    bounds,
    groupCount: groups.length,
    cubeCount: cubes.length,
    groups,
    cubes,
    issues
  };

  return applyFormatSpecificRules(baseReport);
}
